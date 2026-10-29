#!/usr/bin/env python3
import os
import sys
import json
import mimetypes
import socket
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Configuration
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')
ROOT_DIR = os.getcwd() # Defaults to current working directory where server is started

class AirVaultHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        query = parse_qs(parsed_url.query)

        if path == '/api/list':
            self.handle_api_list(query)
        elif path == '/api/download':
            self.handle_api_download(query)
        else:
            # Serve static frontend files from public/
            self.serve_static(path)

    def serve_static(self, path):
        if path == '/' or path == '':
            path = '/index.html'
        
        file_path = os.path.normpath(os.path.join(PUBLIC_DIR, path.lstrip('/')))
        if not file_path.startswith(PUBLIC_DIR) or not os.path.exists(file_path):
            self.send_error(404, "File not found")
            return

        if os.path.isdir(file_path):
            file_path = os.path.join(file_path, 'index.html')

        ctype, _ = mimetypes.guess_type(file_path)
        ctype = ctype or 'application/octet-stream'

        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception:
            self.send_error(500, "Internal Server Error")

    def handle_api_list(self, query):
        rel_path = query.get('path', [''])[0]
        target_path = os.path.normpath(os.path.join(ROOT_DIR, rel_path))

        # Security check to prevent directory traversal outside ROOT_DIR
        if not target_path.startswith(ROOT_DIR) or not os.path.exists(target_path):
            self.send_json({'error': 'Invalid path'}, 400)
            return

        if os.path.isfile(target_path):
            # If target is a file, serve its info
            self.send_json({
                'path': rel_path,
                'items': []
            })
            return

        items = []
        try:
            for entry in os.scandir(target_path):
                if entry.name.startswith('.'):
                    continue # Skip hidden files
                is_dir = entry.is_dir()
                stat = entry.stat()
                item_count = 0
                if is_dir:
                    try:
                        item_count = sum(1 for _ in os.scandir(entry.path) if not _.name.startswith('.'))
                    except Exception:
                        pass

                items.append({
                    'name': entry.name,
                    'path': os.path.relpath(entry.path, ROOT_DIR).replace('\\', '/'),
                    'is_dir': is_dir,
                    'size': 0 if is_dir else stat.st_size,
                    'mtime': stat.st_mtime,
                    'item_count': item_count
                })
        except Exception as e:
            self.send_json({'error': str(e)}, 500)
            return

        # Sort: directories first, then alphabetical
        items.sort(key=lambda x: (not x['is_dir'], x['name'].lower()))

        self.send_json({
            'path': rel_path.replace('\\', '/'),
            'items': items
        })

    def handle_api_download(self, query):
        rel_path = query.get('path', [''])[0]
        target_path = os.path.normpath(os.path.join(ROOT_DIR, rel_path))

        if not target_path.startswith(ROOT_DIR) or not os.path.exists(target_path) or os.path.isdir(target_path):
            self.send_error(404, "File not found")
            return

        file_size = os.path.getsize(target_path)
        ctype, _ = mimetypes.guess_type(target_path)
        ctype = ctype or 'application/octet-stream'

        range_header = self.headers.get('Range')
        if range_header:
            try:
                byte_range = range_header.replace('bytes=', '')
                start_str, end_str = byte_range.split('-')
                start = int(start_str) if start_str else 0
                end = int(end_str) if end_str else file_size - 1
                if end >= file_size:
                    end = file_size - 1
                length = end - start + 1

                with open(target_path, 'rb') as f:
                    f.seek(start)
                    data = f.read(length)

                self.send_response(206)
                self.send_header('Content-Type', ctype)
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Accept-Ranges', 'bytes')
                self.send_header('Content-Length', str(length))
                self.end_headers()
                self.wfile.write(data)
                return
            except Exception:
                pass

        # Full file transfer
        with open(target_path, 'rb') as f:
            self.send_response(200)
            self.send_header('Content-Type', ctype)
            self.send_header('Content-Length', str(file_size))
            self.send_header('Accept-Ranges', 'bytes')
            self.end_headers()
            while True:
                chunk = f.read(65536)
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except BrokenPipeError:
                    break

    def send_json(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        try:
            self.wfile.write(body)
        except BrokenPipeError:
            pass

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def run(port=8080):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, AirVaultHandler)
    local_ip = get_local_ip()
    
    print("=" * 60)
    print(f" 🚀 AirVault Local Network Server Running!")
    print("=" * 60)
    print(f" • Local access:    http://localhost:{port}")
    print(f" • Wi-Fi LAN access: http://{local_ip}:{port}")
    print(f" • Serving directory: {ROOT_DIR}")
    print(" • Press Ctrl+C to stop the server.")
    print("=" * 60)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down AirVault server...")
        httpd.server_close()

if __name__ == '__main__':
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run(port)

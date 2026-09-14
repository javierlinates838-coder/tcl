import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root = resolve('dist');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.webm':'video/webm'};
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    // Local verification fixture lives outside the deployable directory.
    const file = url.pathname === '/__checks__/media.html'
      ? resolve('tests/browser-media.html')
      : resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root + sep) && file !== resolve('tests/browser-media.html')) {
      res.writeHead(403).end(); return;
    }
    const bytes = await readFile(file);
    const headers = {'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store', 'Accept-Ranges':'bytes'};
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start, end;
      if (match && (match[1] || match[2])) {
        start = match[1] ? Number(match[1]) : Math.max(0, bytes.length - Number(match[2]));
        end = match[1] && match[2] ? Math.min(Number(match[2]), bytes.length - 1) : bytes.length - 1;
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= bytes.length) {
        res.writeHead(416, {'Content-Range':'bytes */' + bytes.length}).end(); return;
      }
      res.writeHead(206, {...headers, 'Content-Range':'bytes ' + start + '-' + end + '/' + bytes.length, 'Content-Length':end - start + 1});
      res.end(req.method === 'HEAD' ? undefined : bytes.subarray(start, end + 1)); return;
    }
    res.writeHead(200, {...headers, 'Content-Length':bytes.length}).end(req.method === 'HEAD' ? undefined : bytes);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));

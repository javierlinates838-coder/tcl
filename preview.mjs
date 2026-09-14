import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const file=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+sep)){res.writeHead(403).end();return}const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'}).end(bytes)}catch{res.writeHead(404).end('Not found')}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));

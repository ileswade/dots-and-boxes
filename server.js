import http from 'node:http';
import { readFile } from 'node:fs/promises';
const files = { '/': ['index.html', 'text/html'], '/index.html': ['index.html', 'text/html'], '/style.css': ['style.css', 'text/css'], '/app.js': ['app.js', 'text/javascript'], '/game.js': ['game.js', 'text/javascript'] };
const port = Number(process.env.PORT || 4173);
http.createServer(async (request, response) => {
  const file = files[new URL(request.url, 'http://localhost').pathname];
  if (!file) { response.writeHead(404); response.end('Not found'); return; }
  try {
    const content = await readFile(new URL(file[0], import.meta.url));
    response.writeHead(200, { 'Content-Type': `${file[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
    response.end(content);
  } catch { response.writeHead(500); response.end('Unable to load game.'); }
}).listen(port, '127.0.0.1', () => console.log(`Dots & Boxes: http://127.0.0.1:${port}`));

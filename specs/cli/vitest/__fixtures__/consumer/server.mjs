import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const roots = (process.env.SITE ?? 'healthy').split(',');
const types = { '.html': 'text/html', '.png': 'image/png', '.txt': 'text/plain', '.xml': 'application/xml' };

createServer(async (request, response) => {
    const path = request.url === '/' ? '/index.html' : request.url;
    for (const root of roots) {
        const body = await readFile(join(root, path)).catch(() => undefined);
        if (body !== undefined) {
            response.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
            response.end(body);
            return;
        }
    }
    response.writeHead(404, { 'content-type': 'text/plain' });
    response.end('not found');
}).listen(Number(process.env.PORT));

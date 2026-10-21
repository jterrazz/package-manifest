import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const roots = (process.env.SITE ?? 'healthy,channels').split(',');
const types = { '.html': 'text/html', '.png': 'image/png', '.txt': 'text/plain', '.xml': 'application/xml' };

createServer(async (request, response) => {
    const { pathname } = new URL(request.url, 'http://fixture.test');
    if (pathname !== '/' && extname(pathname) === '') {
        const location = pathname.endsWith('/')
            ? `${pathname.slice(0, -1)}.html?hop=2`
            : `http://${request.headers.host}${pathname}/`;
        response.writeHead(301, { location });
        response.end();
        return;
    }
    const path = pathname === '/' ? '/index.html' : pathname;
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

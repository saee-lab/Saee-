const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = 3000;
const HTML_FILE = path.join(__dirname, 'index.html');

function startServer(port) {
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
      fs.readFile(HTML_FILE, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Error loading the page.');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      });
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.log(`Port ${port} is busy. Trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

const PORT = Number(process.env.PORT) || DEFAULT_PORT;
startServer(PORT);

const http = require('http');
const fs = require('fs');

const PORT = 3000;

fs.readFile('./home.html', (err, html) => {
  if (err) throw err;

  http.createServer((request, response) => {
    response.writeHeader(200, { 'Content-Type': 'text/html' });
    response.write(html);
    response.end();
  }).listen(PORT);
});

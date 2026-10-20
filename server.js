import http from "node:http";

const PORT = 3000;

function parseCsv(text) {
  const [headerLine, ...lines] = text.split("\n");
  const headers = headerLine.split(",");

  return lines
    .filter((line) => line.length > 0)
    .map((line) => {
      const values = line.split(",");
      const row = {};
      headers.forEach((header, i) => {
        row[header] = values[i];
      });
      return row;
    });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/upload") {
    const body = await readBody(req);
    const rows = parseCsv(body);

    const total = rows.reduce((sum, row) => sum + Number(row.amount), 0);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ rows: rows.length, total }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Upload server listening on http://localhost:${PORT}`);
});

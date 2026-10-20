import fs from "node:fs";
import http from "node:http";

const file = new URL("../transactions.csv", import.meta.url);
const { size } = fs.statSync(file);

const req = http.request(
  {
    host: "localhost",
    port: 3000,
    path: "/upload",
    method: "POST",
    headers: { "content-type": "text/csv", "content-length": size },
  },
  (res) => {
    let body = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => console.log(res.statusCode, body));
  },
);

req.on("error", (err) => {
  console.error(`Upload failed: ${err.code ?? err.message}`);
});

fs.createReadStream(file).pipe(req);

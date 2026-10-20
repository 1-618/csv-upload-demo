import fs from "node:fs";
import { once } from "node:events";

const ROWS = Number(process.argv[2] ?? 2_000_000);
const out = fs.createWriteStream(new URL("../transactions.csv", import.meta.url));

out.write("id,date,customer,email,amount,currency,status\n");

for (let i = 1; i <= ROWS; i++) {
  const day = String((i % 28) + 1).padStart(2, "0");
  const line =
    `${i},2026-09-${day},Customer ${i},customer${i}@example.com,` +
    `${(i % 9999) / 100},ZAR,settled\n`;

  if (!out.write(line)) {
    await once(out, "drain");
  }
}

out.end();
await once(out, "finish");
console.log(`Wrote ${ROWS.toLocaleString()} rows to transactions.csv`);

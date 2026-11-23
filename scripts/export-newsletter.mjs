import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { openNewsletter } from "../lib/newsletter.mjs";

function csvCell(value) {
  const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

const output = resolve(process.argv[2] || "newsletter.csv");

try {
  using database = openNewsletter({ readOnly: true });
  const records = database.prepare(
    "SELECT email, subscribed_at FROM subscribers ORDER BY subscribed_at, email"
  ).all();
  const csv = [
    "email,subscribed_at",
    ...records.map(({ email, subscribed_at }) => [email, subscribed_at].map(csvCell).join(",")),
  ].join("\r\n");
  writeFileSync(output, `${csv}\r\n`, { flag: "wx", encoding: "utf8" });
  console.log(`Exported ${records.length} signup(s) to ${output}`);
} catch (error) {
  console.error(
    error.code === "EEXIST"
      ? "That CSV already exists. Run the command with a different output filename."
      : "Could not export the newsletter. Check that the local signup database exists and the output directory is writable."
  );
  process.exitCode = 1;
}

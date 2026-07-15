import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = path.resolve("outputs/CMC_QR_Tool_Gegenueberstellung.xlsx");
const previewDir = path.resolve("outputs/qr_tool_comparison_previews");

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const checks = [
  ["Entscheidungsmatrix!A1:E18", "decision"],
  ["Zusammenfassung!A1:B22", "summary"],
  ["Vorteile & Chancen!A1:D18", "opportunities"],
  ["Entwicklung vs Markttool!A1:H28", "build vs buy"],
  ["Anforderungsmatrix!A1:K25", "requirements"],
  ["Anbieter-Vergleich!A1:F26", "providers"],
  ["Risiken & nächste Schritte!A1:C25", "risks"],
  ["Quellen!A1:C14", "sources"],
];

for (const [range, label] of checks) {
  const inspect = await workbook.inspect({
    kind: "table",
    range,
    include: "values,formulas",
    tableMaxRows: 40,
    tableMaxCols: 8,
  });
  console.log(`\n## ${label}`);
  console.log(inspect.ndjson);
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log("\n## formula errors");
console.log(errors.ndjson);

await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["Entscheidungsmatrix", "A1:E18"],
  ["Zusammenfassung", "A1:B22"],
  ["Vorteile & Chancen", "A1:D18"],
  ["Entwicklung vs Markttool", "A1:H28"],
  ["Anforderungsmatrix", "A1:K25"],
  ["Anbieter-Vergleich", "A1:F26"],
  ["Risiken & nächste Schritte", "A1:C25"],
  ["Quellen", "A1:C14"],
]) {
  const png = await workbook.render({ sheetName, range, scale: 1.4 });
  const bytes = Buffer.from(await png.arrayBuffer());
  await fs.writeFile(path.join(previewDir, `${sheetName.replaceAll(/[^A-Za-z0-9]+/g, "_")}.png`), bytes);
}

console.log(`\nRendered previews: ${previewDir}`);

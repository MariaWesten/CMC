import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/mariaake/Documents/CMC/outputs/time_tracking_taetigkeitsschein/CMC_Time_Tracking_Taetigkeitsschein_Juni_2026.xlsx";

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "sheet,table,computedStyle",
  sheetId: "Datenbasis",
  range: "A12:O16",
  maxChars: 6000,
  tableMaxRows: 8,
  tableMaxCols: 15,
});
console.log(overview.ndjson);


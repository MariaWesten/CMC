import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = path.resolve("outputs/CMC_QR_Tool_Gegenueberstellung.xlsx");
const previewDir = path.resolve("outputs/qr_tool_comparison_previews");

function styleHeader(range) {
  range.format.font = { bold: true, color: "#FFFFFF" };
  range.format.fill = "#1F4E78";
  range.format.horizontalAlignment = "center";
  range.format.verticalAlignment = "middle";
  range.format.wrapText = true;
}

function styleSubtitle(range) {
  range.format.font = { bold: true, color: "#374151" };
  range.format.wrapText = true;
}

function styleTable(range) {
  styleHeader(range.getRow(0));
  range.format.wrapText = true;
  range.format.verticalAlignment = "top";
  range.format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
}

function setWidths(sheet, widths) {
  widths.forEach((width, i) => {
    sheet.getRangeByIndexes(0, i, 1, 1).format.columnWidthPx = width;
  });
}

const input = await FileBlob.load(workbookPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const opportunities = workbook.worksheets.getItem("Vorteile & Chancen");
opportunities.getRange("B8:D9").values = [
  [
    "Schneller Start; wenig technischer Initialaufwand; unkomplizierter Test ohne festes langfristiges Commitment; Betrieb, Skalierung und Grund-Monitoring liegen beim Anbieter.",
    "Gut geeignet, um kurzfristig zu validieren, ob ein externer Anbieter den Link-/QR-Prozess zuverlässig abbildet und welche echten Kosten bei unserem Volumen entstehen.",
    "Kurzfristige Pilotkampagne, Vergleich von Reporting/Exporten, SLA- und Datenschutzprüfung, Preisbenchmark für Eigenbau-Entscheidung.",
  ],
  [
    "Sehr hoher Prozess-Fit; Eingaben, Validierung, Exporte und Reporting können exakt auf CSM/Data/Produktion zugeschnitten werden; laufender Betrieb ist ohne externen Admin voraussichtlich deutlich günstiger als Enterprise-Markttools.",
    "Der Eigenbau wäre voraussichtlich der beste Fit, wenn der heutige Malin-Prozess sauber ersetzt und perspektivisch verbessert werden soll. Gleichzeitig trägt CMC mehr Verantwortung für Betrieb, Monitoring und Ausfallsicherheit.",
    "Rollen/Rechte, Freigabe-Workflow, Kampagnen-Dashboard, automatische Plausibilitätschecks, QR-Export als ZIP, Data-Export, Historie/Audit-Log, Warnungen bei fehlerhaften Ziel-URLs.",
  ],
];
opportunities.getRange("B8:D9").format.wrapText = true;

opportunities.getRange("A19").values = [["Zusätzliche Chancen / Abwägungen"]];
styleSubtitle(opportunities.getRange("A19"));
const oppExtra = opportunities.getRange("A20:D23");
oppExtra.values = [
  ["Thema", "Eigenbau", "Markttool", "Einordnung"],
  [
    "Betriebskosten vs. Ausfallrisiko",
    "Ohne externen Admin voraussichtlich deutlich günstiger im laufenden Betrieb. Dafür muss Monitoring, Backup, Incident-Reaktion und Verantwortlichkeit sauber aufgesetzt werden.",
    "Laufend teurer bzw. bei Enterprise-Volumen oft Custom Pricing, dafür übernimmt der Anbieter einen großen Teil von Betrieb und Skalierung.",
    "Ja: Eigenbau kann günstiger sein, birgt aber mehr Betriebsrisiko, wenn kein sauberer Betrieb definiert wird.",
  ],
  [
    "Erweiterbarkeit",
    "Sehr gut erweiterbar, wenn modular gebaut: weitere Exporte, interne Workflows, Reporting, Rollen/Rechte, Integrationen zu Data/CRM/Produktion.",
    "Erweiterbarkeit abhängig von API, Exporten, Tarif und Roadmap des Anbieters.",
    "Eigenbau bietet hier die größere strategische Chance, weil CMC den Funktionsumfang selbst steuern kann.",
  ],
  [
    "Produktisierung / Abo",
    "Langfristig grundsätzlich denkbar, wenn das Tool stabil, dokumentiert und mandantenfähig gebaut wird.",
    "Nicht relevant, wenn ein externer Anbieter genutzt wird.",
    "Als optionale Zukunftschance aufnehmen, aber nicht als Hauptargument für die aktuelle Entscheidung. Dafür bräuchte es später separaten Business Case, Support, SLA, Datenschutz, Abrechnung und Produktverantwortung.",
  ],
];
styleTable(oppExtra);
setWidths(opportunities, [190, 470, 470, 520]);

const risks = workbook.worksheets.getItem("Risiken & nächste Schritte");
risks.getRange("A20:C23").values = [
  ["Datenschutz-/AVV-Kurzcheck?", "AVV/DPA, Serverstandort, Trackingdaten, Speicherfristen und Datenminimierung kurz klären.", "hoch"],
  ["Welche Praxisdaten fehlen?", "Beispielkampagnen, echte Exporte, gewünschtes Reporting, geschätzte Klick-/Scanmengen.", "mittel"],
  ["Für welches Mengengerüst soll gerechnet werden?", "Heutiger Stand und mittelfristiger Zielstand: Kampagnen pro Monat, Links je Kampagne, Link-Laufzeit und erwartetes Klick-/Scanvolumen.", "hoch"],
  ["Betrieb durch Rent your Admin?", "Konkretes Angebot für Setup, Monitoring, Backups, Incident-Reaktion, Reaktionszeiten und monatliche Pauschale einholen, da dies ein großer Kostenblock sein kann.", "hoch"],
];
risks.getRange("A20:C23").format.wrapText = true;
setWidths(risks, [330, 560, 430]);

const buildVsBuy = workbook.worksheets.getItem("Entwicklung vs Markttool");
buildVsBuy.getRange("A29").values = [["Offene Berechnungsparameter"]];
styleSubtitle(buildVsBuy.getRange("A29"));
const calcQuestions = buildVsBuy.getRange("A30:D34");
calcQuestions.values = [
  ["Frage", "Warum wichtig?", "Benötigte Angabe", "Status"],
  ["Heutiges Mengengerüst", "Basis für realistische Anbieteranfragen und Betriebskosten.", "Kampagnen/Monat, Links/Kampagne, Klicks/Scans, Laufzeit der Links.", "offen"],
  ["Mittelfristiges Mengengerüst", "Verhindert, dass eine Lösung kurzfristig passt, aber in 6-12 Monaten zu klein oder zu teuer wird.", "Zielwert für Kampagnen/Monat, Links/Kampagne und erwartetes Wachstum.", "offen"],
  ["Betrieb mit Rent your Admin", "Kann der größte laufende Kostenblock im Eigenbau-Szenario sein.", "Monatspauschale, enthaltene Leistungen, Reaktionszeiten, Rufbereitschaft, Zusatzkosten.", "offen"],
  ["Ausfallsicherheit", "Relevant, weil fehlerhafte Links laufende Mailings direkt gefährden.", "SLA-Ziel, Monitoring, Backup-/Restore-Konzept, Fallback-Prozess.", "offen"],
];
styleTable(calcQuestions);
setWidths(buildVsBuy, [280, 430, 520, 120, 140, 140, 150, 500]);

const requirements = workbook.worksheets.getItem("Anforderungsmatrix");
requirements.getRange("A16").values = [["Quellenhinweise zur Matrix - Features / Dokumentation"]];
requirements.getRange("A17:C24").values = [
  ["Anbieter", "Quelle", "Wofür verwendet"],
  ["Short.io", "https://short.io/features", "Features: Bulk/API, Rollen, Tracking, Custom Domains, QR-Code, Export/Import, SLA/GDPR-Hinweise"],
  ["Dub", "https://dub.co/docs", "Feature-/Dokumentationsquelle: Short Links, Bulk Link Creation, Analytics, Webhooks, API, Integrationen"],
  ["Bitly", "https://bitly.com/pages/products/url-shortener", "Featurequelle: Link Management, Custom Domains, QR-Codes, Analytics, Kampagnenfunktionen"],
  ["Rebrandly", "https://www.rebrandly.com/features", "Featurequelle: Branded Links, Analytics, QR-Codes, API/Link Management"],
  ["BL.INK", "https://www.bl.ink/features", "Featurequelle: Short URLs, QR-Codes, Analytics, API/Integrationen, Enterprise/Compliance"],
  ["T2M", "https://t2mio.com/", "Featurequelle: URL Shortener, QR-Codes, Analytics, API, Kampagnen- und Teamfunktionen"],
  ["Linkly", "https://linklyhq.com/features", "Featurequelle: Link Tracking, Analytics, QR-Codes und Kampagnenfunktionen"],
];
styleTable(requirements.getRange("A17:C24"));
requirements.getRange("A16:C24").format.wrapText = true;
setWidths(requirements, [260, 390, 650, 190, 230, 230, 190, 210, 190, 170, 400]);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

await fs.mkdir(previewDir, { recursive: true });
for (const [sheetName, range] of [
  ["Vorteile & Chancen", "A1:D24"],
  ["Risiken & nächste Schritte", "A1:C24"],
  ["Entwicklung vs Markttool", "A21:H34"],
  ["Anforderungsmatrix", "A16:C24"],
]) {
  const png = await workbook.render({ sheetName, range, scale: 1.4 });
  const bytes = Buffer.from(await png.arrayBuffer());
  await fs.writeFile(path.join(previewDir, `${sheetName.replaceAll(/[^A-Za-z0-9]+/g, "_")}_targeted_update.png`), bytes);
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(workbookPath);
console.log(workbookPath);

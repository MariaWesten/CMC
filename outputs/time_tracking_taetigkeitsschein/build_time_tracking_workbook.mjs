import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "/Users/mariaake/Documents/CMC/outputs/time_tracking_taetigkeitsschein";
const outputPath = `${outputDir}/CMC_Time_Tracking_Taetigkeitsschein_Juni_2026.xlsx`;

const workbook = Workbook.create();
workbook.comments.setSelf({ displayName: "Maria" });

const settings = workbook.worksheets.add("Einstellungen");
const tracking = workbook.worksheets.add("Zeiterfassung");
const data = workbook.worksheets.add("Datenbasis");
const summary = workbook.worksheets.add("Auswertung");
const report = workbook.worksheets.add("Monatstätigkeitsschein");

const COLORS = {
  navy: "#243B53",
  teal: "#0F766E",
  paleTeal: "#E6F4F1",
  blue: "#2563EB",
  paleBlue: "#EAF2FF",
  amber: "#F59E0B",
  paleAmber: "#FFF7E6",
  green: "#15803D",
  paleGreen: "#EAF7ED",
  grayText: "#475569",
  border: "#CBD5E1",
  lightBorder: "#E2E8F0",
  headerFill: "#F1F5F9",
  white: "#FFFFFF",
};

function styleTitle(sheet, range, title, subtitle = null) {
  const r = sheet.getRange(range);
  r.merge();
  r.values = [[title]];
  r.format = {
    fill: COLORS.navy,
    font: { bold: true, color: COLORS.white, size: 18 },
    verticalAlignment: "center",
  };
  r.format.rowHeightPx = 38;
  if (subtitle) {
    const row = Number(range.match(/\d+/)?.[0] ?? 1) + 1;
    const sub = sheet.getRange(`A${row}:H${row}`);
    sub.merge();
    sub.values = [[subtitle]];
    sub.format = {
      fill: COLORS.paleBlue,
      font: { color: COLORS.grayText, italic: true },
      verticalAlignment: "center",
      wrapText: true,
    };
    sub.format.rowHeightPx = 34;
  }
}

function setHeader(range) {
  range.format = {
    fill: COLORS.teal,
    font: { bold: true, color: COLORS.white },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: COLORS.teal },
  };
}

function setTableBody(range) {
  range.format = {
    verticalAlignment: "top",
    wrapText: true,
    borders: { preset: "all", style: "thin", color: COLORS.lightBorder },
  };
}

function setColumnWidths(sheet, widths) {
  widths.forEach(([col, width]) => {
    sheet.getRange(`${col}:${col}`).format.columnWidth = width;
  });
}

function addNote(sheet, cell, text, fill = COLORS.paleAmber) {
  const r = sheet.getRange(cell);
  r.values = [[text]];
  r.format = {
    fill,
    font: { color: COLORS.grayText, italic: true },
    wrapText: true,
    verticalAlignment: "top",
    borders: { preset: "outside", style: "thin", color: COLORS.border },
  };
}

function formatGermanDate(date) {
  const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  return `${date.getUTCDate()}. ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function formatGermanNumber(value) {
  return value.toFixed(2).replace(".", ",");
}

const entries = [
  {
    date: new Date(Date.UTC(2026, 5, 17)),
    project: "QR Code",
    shortTask: "Prozess-Refresh, Toolmarkt und Build-Option",
    description:
      "Einarbeitung in den bestehenden QR-Code-Prozess, Ableitung der Soll-Anforderungen an ein neues Tool, erste Marktanalyse geeigneter Anbieter sowie technische Machbarkeitsprüfung eines eigenen Builds.",
    value:
      "Grundlage für die QR-Tool-Gegenüberstellung: Soll-Kriterien, Markt-/Eigenbau-Perspektive und erste technische Stack-Klarheit wurden herausgearbeitet.",
    hours: 3.15,
    category: "Analyse / Recherche",
    status: "Abgeschlossen",
  },
  {
    date: new Date(Date.UTC(2026, 5, 18)),
    project: "Technisches Setup",
    shortTask: "Accounts, Mail und Arbeitsumgebung",
    description:
      "Einrichtung und Prüfung der benötigten Accounts/Mail-Zugänge sowie kurze Orientierung in vorhandenen technischen Unterlagen und Arbeitsständen.",
    value:
      "Reduziert Reibung im Folgeprozess und stellt sicher, dass weitere Analyse/Umsetzung ohne Zugriffshürden starten kann.",
    hours: 0.75,
    category: "Setup / Administration",
    status: "Abgeschlossen",
  },
  {
    date: new Date(Date.UTC(2026, 5, 18)),
    project: "QR Code",
    shortTask: "Technisches Setup und Stack-Vorauswahl",
    description:
      "Verfeinerung des technischen Setups, Recherche möglicher Stack-Varianten und Eingrenzung der sinnvollsten Tool-/Build-Richtung.",
    value:
      "Verdichtet die offenen Optionen technisch: Stack-Richtung, Toolanforderungen und Build-Risiken wurden so geklärt, dass die Gegenüberstellung belastbarer wird.",
    hours: 1.5,
    category: "Technische Konzeption",
    status: "Abgeschlossen",
  },
  {
    date: new Date(Date.UTC(2026, 5, 18)),
    project: "Asana / Monday",
    shortTask: "Projektplan Migration Monday zu Asana",
    description:
      "Aufsetzen eines ersten Projektplan-Rahmens für die Ablösung von Monday durch Asana inklusive Arbeitspaketen und Migrationslogik.",
    value:
      "Macht die Migration planbar und zeigt früh, welche Schritte, Abhängigkeiten und Prüfungen für den Wechsel nötig werden.",
    hours: 0.5,
    category: "Projektplanung",
    status: "Initial",
  },
  {
    date: new Date(Date.UTC(2026, 5, 19)),
    project: "Asana / Monday",
    shortTask: "Board- und Prozessanalyse",
    description:
      "Analyse vorhandener Monday-Boards und Prozesse mit Blick auf Migrationsrelevanz, Struktur, Dubletten und notwendige Übertragungslogik.",
    value:
      "Identifiziert, was wirklich migriert werden muss und wo Prozessvereinfachung möglich ist, statt bestehende Komplexität ungeprüft nach Asana zu kopieren.",
    hours: 1.15,
    category: "Analyse / Recherche",
    status: "Initial",
  },
  {
    date: new Date(Date.UTC(2026, 5, 20)),
    project: "QR Code",
    shortTask: "Toolvergleich und Build-Abgleich",
    description:
      "Detaillierte Analyse ausgewählter markttauglicher Tools und strukturierter Abgleich der Ergebnisse mit den Anforderungen an einen möglichen eigenen Build.",
    value:
      "CMC_QR_Tool_Gegenueberstellung.xlsx mit Entscheidungsmatrix, Annahmen, Kurzfazit und nächsten Schritten; ergänzt durch Klarheit zum technischen Stack.",
    hours: 2.75,
    category: "Analyse / Recherche",
    status: "Abgeschlossen",
  },
  {
    date: new Date(Date.UTC(2026, 5, 21)),
    project: "QR Code",
    shortTask: "Gegenüberstellung prüfen, ergänzen und aufbereiten",
    description:
      "Durchsicht der QR-Tool-Gegenüberstellung, Ergänzung offener Punkte und Aufbereitung der Inhalte für eine verständliche Entscheidungsgrundlage.",
    value:
      "Die Gegenüberstellung ist für Robert klarer nutzbar: Bewertung, Annahmen, Risiken und nächste Schritte sind konsistenter herausgearbeitet.",
    hours: 0.5,
    category: "Analyse / Recherche",
    status: "Abgeschlossen",
  },
];

// Einstellungen
settings.showGridLines = false;
styleTitle(settings, "A1:F1", "Einstellungen", "Monat und Stundensatz hier ändern; alle Auswertungen und der Tätigkeitsschein greifen darauf zurück.");
settings.getRange("A4:B11").values = [
  ["Monat beginnt am", new Date(Date.UTC(2026, 5, 1))],
  ["Stundensatz", 85],
  ["Auftraggeber", "Robert"],
  ["Auftragnehmer/in", "Maria"],
  ["Währung", "EUR"],
  ["Max. Tracking-Zeilen", 200],
  ["Hinweis", "Zeiterfassung ist als Screenshot-Ansicht für Robert formatiert. Details/Kategorien liegen in der Datenbasis."],
  ["Datei-Zweck", "Laufendes Time Tracking + monatlicher Tätigkeitsschein"],
];
settings.getRange("A4:A11").format = { fill: COLORS.headerFill, font: { bold: true }, borders: { preset: "all", style: "thin", color: COLORS.lightBorder } };
settings.getRange("B4:B11").format = { borders: { preset: "all", style: "thin", color: COLORS.lightBorder }, wrapText: true };
settings.getRange("B4").format.numberFormat = 'dd"."mm"."yyyy';
settings.getRange("B5").setNumberFormat("#,##0.00");
settings.getRange("D4:F7").values = [
  ["Kategorie-Liste", "Status-Liste", "Monatslabel"],
  ["Analyse / Recherche", "Initial", ""],
  ["Technische Konzeption", "In Arbeit", ""],
  ["Projektplanung", "Abgeschlossen", ""],
];
settings.getRange("D8:D9").values = [["Setup / Administration"], ["Umsetzung / Dokumentation"]];
settings.getRange("F5").formulas = [["=CHOOSE(MONTH(B4),\"Januar\",\"Februar\",\"März\",\"April\",\"Mai\",\"Juni\",\"Juli\",\"August\",\"September\",\"Oktober\",\"November\",\"Dezember\")&\" \"&YEAR(B4)"]];
settings.getRange("D4:F4").format = { fill: COLORS.teal, font: { bold: true, color: COLORS.white }, horizontalAlignment: "center" };
settings.getRange("D5:F9").format = { borders: { preset: "all", style: "thin", color: COLORS.lightBorder } };
setColumnWidths(settings, [["A", 24], ["B", 44], ["D", 28], ["E", 22], ["F", 22]]);

// Zeiterfassung: sichtbare Screenshot-Ansicht für Robert
tracking.showGridLines = false;
tracking.getRange("A1:C1").values = [["Datum", "Aufgabe", "Arbeitszeit\n(Stunden)"]];
tracking.getRange("A1:C1").format = {
  fill: "#F2F2F2",
  font: { bold: true, color: "#000000", size: 18 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "medium", color: "#666666" },
};
tracking.getRange("A1:C1").format.rowHeightPx = 64;

const visibleRows = entries.map((e) => [
  formatGermanDate(e.date),
  `${e.project}: ${e.description} Ergebnis: ${e.value}`,
  formatGermanNumber(e.hours),
]);
tracking.getRange(`A2:C${1 + visibleRows.length}`).values = visibleRows;
tracking.getRange(`A2:C${1 + visibleRows.length}`).format = {
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#666666" },
};
tracking.getRange(`A2:A${1 + visibleRows.length}`).format = {
  font: { bold: true },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: "#666666" },
};
tracking.getRange(`C2:C${1 + visibleRows.length}`).format = {
  horizontalAlignment: "right",
  verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: "#666666" },
};
tracking.getRange("A2:C2").format.rowHeightPx = 92;
tracking.getRange("A3:C6").format.rowHeightPx = 52;
tracking.getRange("A7:C7").format.rowHeightPx = 72;
tracking.getRange("A8:C8").format.rowHeightPx = 52;

tracking.getRange("B9:C10").values = [
  ["Summe Stunden aktuelle Woche", null],
  ["Summe Stunden Monat Juni 2026", null],
];
const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
const totalAmount = totalHours * 85;
tracking.getRange("C9:C10").values = [[formatGermanNumber(totalHours)], [formatGermanNumber(totalHours)]];
tracking.getRange("E10").values = [[`${formatGermanNumber(totalAmount)} €`]];
tracking.getRange("B9:C10").format = {
  font: { bold: true, size: 14 },
  verticalAlignment: "center",
  borders: { preset: "all", style: "thin", color: "#666666" },
};
tracking.getRange("C9:C10").format = { horizontalAlignment: "right", font: { bold: true, size: 14 }, borders: { preset: "all", style: "thin", color: "#666666" } };
tracking.getRange("E10").format = { horizontalAlignment: "right", font: { size: 14 } };
tracking.getRange("B9:C10").format.rowHeightPx = 34;
setColumnWidths(tracking, [["A", 27], ["B", 98], ["C", 22], ["D", 4], ["E", 22]]);

// Datenbasis: interne Struktur für Auswertung und Tätigkeitsschein
data.showGridLines = false;
styleTitle(
  data,
  "A1:K1",
  "Datenbasis",
  "Interne Arbeitsdaten für Auswertung und Tätigkeitsschein. Roberts Screenshot wird aus dem Blatt Zeiterfassung erstellt."
);
data.getRange("A4:D4").values = [["Monat", "Stundensatz", "Monatsstunden", "Monatsbetrag"]];
data.getRange("A5").formulas = [["='Einstellungen'!F5"]];
data.getRange("B5").formulas = [["='Einstellungen'!B5"]];
data.getRange("C5").formulas = [["=SUMIFS(E13:E212,A13:A212,\">=\"&'Einstellungen'!B4,A13:A212,\"<\"&DATE(YEAR('Einstellungen'!B4),MONTH('Einstellungen'!B4)+1,1))"]];
data.getRange("D5").formulas = [["=SUMIFS(G13:G212,A13:A212,\">=\"&'Einstellungen'!B4,A13:A212,\"<\"&DATE(YEAR('Einstellungen'!B4),MONTH('Einstellungen'!B4)+1,1))"]];
data.getRange("A4:D4").format = { fill: COLORS.navy, font: { bold: true, color: COLORS.white }, horizontalAlignment: "center" };
data.getRange("A5:D5").format = { fill: COLORS.paleBlue, font: { bold: true }, borders: { preset: "all", style: "thin", color: COLORS.border }, horizontalAlignment: "center" };
data.getRange("A5").format.numberFormat = "@";
data.getRange("B5").setNumberFormat("#,##0.00");
data.getRange("C5").setNumberFormat("#,##0.00");
data.getRange("D5").setNumberFormat("#,##0.00 [$EUR]");

const dataHeaders = [
  "Datum",
  "Bereich",
  "Aufgabe kurz",
  "Tätigkeit",
  "Zeit (Std.)",
  "Stundensatz",
  "Betrag",
  "KW",
  "Monat",
  "Kategorie",
  "Status",
];
data.getRange("A12:K12").values = [dataHeaders];
data.getRange("A12:K12").format = {
  fill: "#F2F2F2",
  font: { bold: true, color: "#000000" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { preset: "all", style: "medium", color: "#666666" },
};
const dataRows = entries.map((e) => [
  e.date,
  e.project,
  e.shortTask,
  `${e.description} Ergebnis: ${e.value}`,
  e.hours,
  null,
  null,
  null,
  null,
  e.category,
  e.status,
]);
data.getRange(`A13:K${12 + dataRows.length}`).values = dataRows;
data.getRange("F13").formulas = [["=IF(A13=\"\",\"\",'Einstellungen'!$B$5)"]];
data.getRange("F13:F212").fillDown();
data.getRange("G13").formulas = [["=IF(E13=\"\",\"\",E13*F13)"]];
data.getRange("G13:G212").fillDown();
data.getRange("H13").formulas = [["=IF(A13=\"\",\"\",WEEKNUM(A13,21))"]];
data.getRange("H13:H212").fillDown();
data.getRange("I13").formulas = [["=IF(A13=\"\",\"\",CHOOSE(MONTH(A13),\"Januar\",\"Februar\",\"März\",\"April\",\"Mai\",\"Juni\",\"Juli\",\"August\",\"September\",\"Oktober\",\"November\",\"Dezember\")&\" \"&YEAR(A13))"]];
data.getRange("I13:I212").fillDown();
data.getRange("A13:K212").format = {
  fill: "#FFFFFF",
  verticalAlignment: "top",
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#A6A6A6" },
};
data.getRange("A13:A212").format.numberFormat = 'dd"."mm"."yyyy';
data.getRange("E13:E212").setNumberFormat("#,##0.00");
data.getRange("F13:G212").setNumberFormat("#,##0.00");
data.getRange("H13:H212").setNumberFormat("0");
data.getRange("A12:K212").format.borders = { preset: "all", style: "thin", color: "#A6A6A6" };
data.getRange("A12:K12").format.borders = { preset: "all", style: "medium", color: "#666666" };
data.getRange("A13:A212").format.horizontalAlignment = "center";
data.getRange("E13:H212").format.horizontalAlignment = "right";
data.getRange("J13:J212").dataValidation = { rule: { type: "list", formula1: "='Einstellungen'!$D$5:$D$9" } };
data.getRange("K13:K212").dataValidation = { rule: { type: "list", formula1: "='Einstellungen'!$E$5:$E$7" } };
data.freezePanes.freezeRows(12);
setColumnWidths(data, [
  ["A", 14],
  ["B", 18],
  ["C", 30],
  ["D", 84],
  ["E", 12],
  ["F", 12],
  ["G", 13],
  ["H", 8],
  ["I", 18],
  ["J", 22],
  ["K", 16],
]);
data.getRange("D13:D212").format.rowHeightPx = 72;

// Auswertung
summary.showGridLines = false;
styleTitle(summary, "A1:H1", "Auswertung", "Kurzer Plausibilitätscheck und Monatsübersicht aus der Zeiterfassung.");
summary.getRange("A4:B6").values = [
  ["Monat", null],
  ["Gesamtstunden", null],
  ["Betrag", null],
];
summary.getRange("B4").formulas = [["='Einstellungen'!F5"]];
summary.getRange("B5").formulas = [["='Datenbasis'!C5"]];
summary.getRange("B6").formulas = [["='Datenbasis'!D5"]];
summary.getRange("A4:A6").format = { fill: COLORS.navy, font: { bold: true, color: COLORS.white }, borders: { preset: "all", style: "thin", color: COLORS.navy } };
summary.getRange("B4:B6").format = { fill: COLORS.paleBlue, font: { bold: true }, borders: { preset: "all", style: "thin", color: COLORS.border }, horizontalAlignment: "right" };
summary.getRange("B4").format.numberFormat = "@";
summary.getRange("B5:B6").setNumberFormat("#,##0.00");
summary.getRange("B6").setNumberFormat("#,##0.00 [$EUR]");

summary.getRange("D4:F4").values = [["Kategorie", "Stunden", "Anteil"]];
setHeader(summary.getRange("D4:F4"));
summary.getRange("D5:D9").values = [["Analyse / Recherche"], ["Technische Konzeption"], ["Projektplanung"], ["Setup / Administration"], ["Umsetzung / Dokumentation"]];
summary.getRange("E5").formulas = [["=SUMIFS('Datenbasis'!$E$13:$E$212,'Datenbasis'!$J$13:$J$212,D5,'Datenbasis'!$A$13:$A$212,\">=\"&'Einstellungen'!$B$4,'Datenbasis'!$A$13:$A$212,\"<\"&DATE(YEAR('Einstellungen'!$B$4),MONTH('Einstellungen'!$B$4)+1,1))"]];
summary.getRange("E5:E9").fillDown();
summary.getRange("F5").formulas = [["=IF($B$5=0,0,E5/$B$5)"]];
summary.getRange("F5:F9").fillDown();
setTableBody(summary.getRange("D5:F9"));
summary.getRange("E5:E9").setNumberFormat("#,##0.00");
summary.getRange("F5:F9").setNumberFormat("0.0%");

summary.getRange("A11:H11").values = [["Schonungslos ehrlicher Check"]];
summary.getRange("A11:H11").merge();
summary.getRange("A11:H11").format = { fill: COLORS.amber, font: { bold: true, color: COLORS.white }, verticalAlignment: "center" };
summary.getRange("A12:H16").values = [
  ["Gesamteindruck", "10,30 Stunden für Startwoche/Analysephase sind plausibel. Der QR-Code-Anteil ist durch ein konkretes Ergebnis belegt: CMC_QR_Tool_Gegenueberstellung.xlsx plus technische Stack-Klarheit."],
  ["QR-Code-Anteil", "7,90 Stunden QR-Code sind mit diesem Output gut begründbar: Entscheidungsmatrix, Eigenbau-vs.-Markttool-Abgleich, Volumenannahmen, Risiken, Kurzfazit, Ergänzungen und nächste Schritte sind verwertbarer Mehrwert."],
  ["Asana/Monday", "1,65 Stunden sind für eine echte Migration zu wenig, aber als erster Projektplan plus Sichtung plausibel. Bitte nicht als vollständige Migrationsanalyse verkaufen."],
  ["Setup-Zeit", "0,75 Stunden für Accounts/Mail ist normal und unkritisch, sollte aber nicht größer werden, wenn kein technisches Problem dahintersteht."],
  ["Empfehlung", "Für künftige Einträge immer ein Ergebnis ergänzen: Entscheidung, verworfene Option, Nächstes To-do, Risiko oder Vereinfachung. Dann liest Robert Mehrwert statt nur Arbeitszeit."],
];
summary.getRange("A12:A16").format = { fill: COLORS.headerFill, font: { bold: true }, borders: { preset: "all", style: "thin", color: COLORS.lightBorder }, verticalAlignment: "top" };
summary.getRange("B12:H16").merge(true);
summary.getRange("B12:H16").format = { wrapText: true, verticalAlignment: "top", borders: { preset: "all", style: "thin", color: COLORS.lightBorder } };
summary.getRange("A12:H16").format.rowHeightPx = 48;

summary.getRange("A19:D19").values = [["KW", "Stunden", "Betrag", "Hinweis"]];
setHeader(summary.getRange("A19:D19"));
summary.getRange("A20:A28").values = Array.from({ length: 9 }, (_, i) => [25 + i]);
summary.getRange("B20").formulas = [["=SUMIFS('Datenbasis'!$E$13:$E$212,'Datenbasis'!$H$13:$H$212,A20,'Datenbasis'!$A$13:$A$212,\">=\"&'Einstellungen'!$B$4,'Datenbasis'!$A$13:$A$212,\"<\"&DATE(YEAR('Einstellungen'!$B$4),MONTH('Einstellungen'!$B$4)+1,1))"]];
summary.getRange("B20:B28").fillDown();
summary.getRange("C20").formulas = [["=SUMIFS('Datenbasis'!$G$13:$G$212,'Datenbasis'!$H$13:$H$212,A20,'Datenbasis'!$A$13:$A$212,\">=\"&'Einstellungen'!$B$4,'Datenbasis'!$A$13:$A$212,\"<\"&DATE(YEAR('Einstellungen'!$B$4),MONTH('Einstellungen'!$B$4)+1,1))"]];
summary.getRange("C20:C28").fillDown();
summary.getRange("D20").formulas = [["=IF(B20=0,\"\",IF(B20<2,\"kleiner Block / Kontextaufbau\",IF(B20>8,\"hoher Wochenblock - Output sichtbar machen\",\"plausibler Wochenblock\")))"]];
summary.getRange("D20:D28").fillDown();
setTableBody(summary.getRange("A20:D28"));
summary.getRange("B20:B28").setNumberFormat("#,##0.00");
summary.getRange("C20:C28").setNumberFormat("#,##0.00 [$EUR]");
setColumnWidths(summary, [["A", 24], ["B", 18], ["C", 18], ["D", 42], ["E", 16], ["F", 14], ["G", 14], ["H", 14]]);

// Monatstätigkeitsschein
report.showGridLines = false;
styleTitle(report, "A1:F1", "Monatstätigkeitsschein", "Druck-/kopierfähige Version. Die Formulierungen sind nutzenorientiert, aber auf die erfassten Tätigkeiten begrenzt.");
report.getRange("A4:F8").values = [
  ["Monat", null, "Auftraggeber", null, "Auftragnehmer/in", null],
  ["Gesamtstunden", null, "Stundensatz", null, "Betrag", null],
  ["Kurzfazit", null, null, null, null, null],
  ["", null, null, null, null, null],
  ["", null, null, null, null, null],
];
report.getRange("B4").formulas = [["='Einstellungen'!F5"]];
report.getRange("D4").formulas = [["='Einstellungen'!B6"]];
report.getRange("F4").formulas = [["='Einstellungen'!B7"]];
report.getRange("B5").formulas = [["='Datenbasis'!C5"]];
report.getRange("D5").formulas = [["='Einstellungen'!B5"]];
report.getRange("F5").formulas = [["='Datenbasis'!D5"]];
report.getRange("B6:F8").merge();
report.getRange("B6").values = [[
  "Im Juni 2026 lag der Schwerpunkt auf QR-Code-Tool-/Build-Analyse, technischer Arbeitsfähigkeit und erster Asana/Monday-Migrationssichtung. Konkretes QR-Ergebnis ist die Datei CMC_QR_Tool_Gegenueberstellung.xlsx mit Entscheidungsmatrix, Tool-/Eigenbau-Abgleich, Annahmen und nächsten Schritten; zusätzlich wurde Klarheit über den technischen Stack geschaffen."
]];
report.getRange("A4:A8").format = { fill: COLORS.navy, font: { bold: true, color: COLORS.white }, borders: { preset: "all", style: "thin", color: COLORS.navy } };
report.getRange("C4:C5").format = { fill: COLORS.navy, font: { bold: true, color: COLORS.white }, borders: { preset: "all", style: "thin", color: COLORS.navy } };
report.getRange("E4:E5").format = { fill: COLORS.navy, font: { bold: true, color: COLORS.white }, borders: { preset: "all", style: "thin", color: COLORS.navy } };
report.getRange("B4:B5").format = { fill: COLORS.paleBlue, font: { bold: true }, borders: { preset: "all", style: "thin", color: COLORS.border } };
report.getRange("D4:D5").format = { fill: COLORS.paleBlue, font: { bold: true }, borders: { preset: "all", style: "thin", color: COLORS.border } };
report.getRange("F4:F5").format = { fill: COLORS.paleBlue, font: { bold: true }, borders: { preset: "all", style: "thin", color: COLORS.border } };
report.getRange("B6:F8").format = { fill: COLORS.paleGreen, wrapText: true, verticalAlignment: "top", borders: { preset: "outside", style: "thin", color: COLORS.green } };
report.getRange("B4").format.numberFormat = "@";
report.getRange("B5").setNumberFormat("#,##0.00");
report.getRange("D5").setNumberFormat("#,##0.00");
report.getRange("F5").setNumberFormat("#,##0.00 [$EUR]");

report.getRange("A11:E11").values = [["Datum", "Bereich", "Tätigkeit", "Zeit", "Status"]];
setHeader(report.getRange("A11:E11"));
for (let i = 0; i < 60; i += 1) {
  const sourceRow = 13 + i;
  const row = 12 + i;
  report.getRange(`A${row}`).formulas = [[`=IF(AND('Datenbasis'!$A${sourceRow}>=Einstellungen!$B$4,'Datenbasis'!$A${sourceRow}<DATE(YEAR(Einstellungen!$B$4),MONTH(Einstellungen!$B$4)+1,1)),'Datenbasis'!$A${sourceRow},"")`]];
  report.getRange(`B${row}`).formulas = [[`=IF($A${row}="","",'Datenbasis'!$B${sourceRow})`]];
  report.getRange(`C${row}`).formulas = [[`=IF($A${row}="","",'Datenbasis'!$C${sourceRow}&": "&'Datenbasis'!$D${sourceRow})`]];
  report.getRange(`D${row}`).formulas = [[`=IF($A${row}="","",'Datenbasis'!$E${sourceRow})`]];
  report.getRange(`E${row}`).formulas = [[`=IF($A${row}="","",'Datenbasis'!$K${sourceRow})`]];
}
setTableBody(report.getRange("A12:E71"));
report.getRange("A12:A71").format.numberFormat = 'dd"."mm"."yyyy';
report.getRange("D12:D71").setNumberFormat("#,##0.00");
report.getRange("A12:A71").format.horizontalAlignment = "center";
report.getRange("D12:D71").format.horizontalAlignment = "right";
report.getRange("C12:C71").format.rowHeightPx = 72;
report.getRange("A73:F75").values = [
  ["Bestätigung", "", "", "", "", ""],
  ["Die oben aufgeführten Leistungen wurden wahrheitsgemäß dokumentiert und beziehen sich auf den Arbeitsstand des ausgewählten Monats.", "", "", "", "", ""],
  ["Ort/Datum: ______________________________    Unterschrift: ______________________________", "", "", "", "", ""],
];
report.getRange("A73:F73").merge();
report.getRange("A74:F74").merge();
report.getRange("A75:F75").merge();
report.getRange("A73:F75").format = { wrapText: true, borders: { preset: "outside", style: "thin", color: COLORS.border } };
report.getRange("A73:F73").format = { fill: COLORS.headerFill, font: { bold: true } };
report.freezePanes.freezeRows(11);
setColumnWidths(report, [["A", 14], ["B", 20], ["C", 92], ["D", 10], ["E", 16], ["F", 18]]);

// Compact print-friendly styling
for (const ws of [settings, tracking, data, summary, report]) {
  const used = ws.getUsedRange();
  if (used) {
    used.format.font.name = "Aptos";
    used.format.font.size = 10;
  }
}
report.getRange("A1:F1").format.font.size = 18;
tracking.getRange("A1:C1").format.font.size = 18;
data.getRange("A1:K1").format.font.size = 18;
summary.getRange("A1:H1").format.font.size = 18;
settings.getRange("A1:F1").format.font.size = 18;

// Comments clarify assumptions without cluttering visible cells.
workbook.comments.addThread({ cell: settings.getRange("B5") }, "Stundensatz aus Screenshot abgeleitet. Nach Aufnahme der finalen QR-Gegenüberstellungs-Aufbereitung: 10,30 Stunden x 85 EUR = 875,50 EUR.");
workbook.comments.addThread({ cell: summary.getRange("B12") }, "Ehrliche Einordnung: Der QR-Anteil ist plausibel, weil ein konkretes Arbeitsergebnis vorliegt: /Users/mariaake/Documents/CMC/outputs/CMC_QR_Tool_Gegenueberstellung.xlsx.");

await fs.mkdir(outputDir, { recursive: true });

const check = await workbook.inspect({
  kind: "table",
  range: "Auswertung!A4:H16",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 10,
  maxChars: 4000,
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 3000,
});
console.log(errors.ndjson);

for (const [sheetName, fileName] of [
  ["Zeiterfassung", "preview_zeiterfassung.png"],
  ["Datenbasis", "preview_datenbasis.png"],
  ["Auswertung", "preview_auswertung.png"],
  ["Monatstätigkeitsschein", "preview_monatstaetigkeitsschein.png"],
  ["Einstellungen", "preview_einstellungen.png"],
]) {
  const preview = await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(`${outputDir}/${fileName}`, new Uint8Array(await preview.arrayBuffer()));
}

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(`Saved ${outputPath}`);

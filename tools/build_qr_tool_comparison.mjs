import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = path.resolve("outputs");
const outputPath = path.join(outputDir, "CMC_QR_Tool_Gegenueberstellung.xlsx");

function writeTable(sheet, startCell, headers, rows) {
  const range = sheet.getRange(startCell).getResizedRange(rows.length, headers.length - 1);
  range.values = [headers, ...rows];
  styleTable(range);
  return range;
}

function styleTitle(range) {
  range.format.font = { bold: true, size: 18, color: "#1F2937" };
}

function styleSubtitle(range) {
  range.format.font = { bold: true, size: 12, color: "#374151" };
}

function styleHeader(range) {
  range.format.font = { bold: true, color: "#FFFFFF" };
  range.format.fill = "#1F4E78";
  range.format.horizontalAlignment = "center";
  range.format.verticalAlignment = "middle";
}

function styleTable(range) {
  styleHeader(range.getRow(0));
  range.format.wrapText = true;
  range.format.verticalAlignment = "top";
  range.format.borders = { preset: "all", style: "thin", color: "#D9E2F3" };
}

function styleTotalRow(range) {
  range.format.font = { bold: true };
  range.format.borders.getItem("EdgeTop").style = "medium";
  range.format.borders.getItem("EdgeTop").color = "#1F4E78";
}

function setWidths(sheet, widths) {
  widths.forEach((width, i) => {
    sheet.getRangeByIndexes(0, i, 1, 1).format.columnWidthPx = width;
  });
}

function addTitle(sheet, title) {
  sheet.getRange("A1").values = [[title]];
  styleTitle(sheet.getRange("A1"));
}

const workbook = Workbook.create();

const decision = workbook.worksheets.add("Entscheidungsmatrix");
const summary = workbook.worksheets.add("Zusammenfassung");
const opportunities = workbook.worksheets.add("Vorteile & Chancen");
const buildVsBuy = workbook.worksheets.add("Entwicklung vs Markttool");
const requirements = workbook.worksheets.add("Anforderungsmatrix");
const providers = workbook.worksheets.add("Anbieter-Vergleich");
const risks = workbook.worksheets.add("Risiken & nächste Schritte");
const sources = workbook.worksheets.add("Quellen");

addTitle(decision, "Entscheidungsmatrix für Robert");
decision.getRange("A3").values = [["Bewertung: 1 = schwach / riskant, 5 = stark / passend. Gewichtung dient als Orientierung, nicht als finale Entscheidung."]];
decision.getRange("A3").format.wrapText = true;
writeTable(decision, "A5", ["Kriterium", "Gewicht", "Eigenbau", "Markttool", "Kommentar"], [
  ["Fit zum CSM/Data/Produktion-Prozess", 25, 5, 3, "Eigenbau kann exakt auf Input, Exporte, Freigaben und QR-Prozess zugeschnitten werden. Markttools erfordern voraussichtlich Anpassungen/Workarounds."],
  ["Initialaufwand / Time-to-Value", 15, 2, 5, "Markttools können schneller getestet werden. Eigenbau braucht Entwicklung, Testbetrieb und Abnahme."],
  ["Laufende Kosten planbar", 15, 4, 3, "Eigenbau ist bei Managed Hosting grob planbar. Markttools sind bei diesem Volumen häufig Enterprise/Custom Pricing."],
  ["Betriebsrisiko beherrschbar", 15, 3, 4, "Markttools übernehmen Betrieb und Skalierung. Eigenbau braucht Hosting, Monitoring, Backups und klare Verantwortlichkeiten."],
  ["Datenschutz/Kontrolle", 10, 4, 3, "Beim Eigenbau sind EU-Hosting, Datenminimierung und Speicherfristen direkter steuerbar. Bei Markttools müssen AVV/DPA und Serverstandorte geprüft werden."],
  ["Anbieter-/Plattformabhängigkeit", 10, 4, 2, "Eigenbau reduziert die Abhängigkeit von Preismodell, Support und Produktentscheidungen eines Drittanbieters. Markttools können dafür Betrieb entlasten."],
  ["Langfristige Wartbarkeit/Übergabe", 10, 4, 3, "CMC-Eigentum ist kein Muss, bleibt aber strategischer Vorteil. Wichtig ist in beiden Fällen eine saubere Dokumentation und Übergabe."],
  ["Gewichtete Summe", "=SUM(B6:B12)", "=SUMPRODUCT($B$6:$B$12,C6:C12)", "=SUMPRODUCT($B$6:$B$12,D6:D12)", "Höchster Wert = aktuell stärkste Tendenz"],
]);
styleTotalRow(decision.getRange("A13:E13"));
decision.getRange("A16").values = [["Interpretation"]];
styleSubtitle(decision.getRange("A16"));
decision.getRange("A17").values = [["Vorschlag"]];
decision.getRange("B17:E17").merge(false);
decision.getRange("B17:E17").values = [["Beide Wege bleiben möglich. Eigenbau punktet bei Prozess-Fit, Kontrolle und langfristiger Unabhängigkeit. Ein Markttool punktet bei schnellerem Start und ausgelagertem Betrieb. Für eine belastbare Entscheidung fehlen vor allem verbindliche Anbieterpreise, Datenschutzfreigabe und ein klares Zielbild für Betrieb und Wartung."]];
decision.getRange("A17:E17").format.wrapText = true;
decision.getRange("A17:E17").format.rowHeightPx = 72;
setWidths(decision, [300, 90, 140, 140, 640]);

addTitle(summary, "QR-Code-/Tracking-Link-Tool: Eigenbau vs. externe Lösung");
summary.getRange("A3:B5").values = [
  ["Stand", "20.06.2026"],
  ["Ziel", "Malin langfristig ablösen und eine zuverlässige, kontrollierbare Lösung für Tracking-Links und QR-Codes schaffen."],
  ["Aktuelles Malin", "ca. 8 €/Monat, fachlich passend, aber schwierige Zusammenarbeit und Anbieterabhängigkeit."],
];
summary.getRange("A7").values = [["Grundannahmen"]];
styleSubtitle(summary.getRange("A7"));
writeTable(summary, "A8", ["Annahme", "Wert"], [
  ["Kampagnen pro Monat", 20],
  ["Links je Kampagne niedrig", 10000],
  ["Links je Kampagne hoch", 100000],
  ["Links pro Monat niedrig", "=B9*B10"],
  ["Links pro Monat mittel", "=B9*((B10+B11)/2)"],
  ["Links pro Monat hoch", "=B9*B11"],
  ["Scan-/Klickvolumen", "Noch offen; für Anbieterangebote separat anfragen"],
]);
summary.getRange("A17").values = [["Kurzfazit"]];
styleSubtitle(summary.getRange("A17"));
summary.getRange("A18:B18").values = [[
  "Einordnung",
  "Der Eigenbau hätte Einmalkosten für Entwicklung, wäre aber stärker kontrollierbar und langfristig gut übergabefähig. Externe Tools müssen bei 200.000-2.000.000 neuen Links/Monat sehr genau geprüft werden. Short.io wirkt nach öffentlicher Recherche am nächsten an den Anforderungen, aber der Preis ist nur als Mindestwert ab ca. 148 €/Monat zu verstehen und muss für unser Volumen schriftlich bestätigt werden.",
]];
summary.getRange("A19:B19").values = [[
  "Chancen",
  "Ein Markttool kann ein schneller, unkomplizierter Testpfad mit wenig Anfangs-Commitment sein. Ein Eigenbau ist voraussichtlich der beste Prozess-Fit und kann später gezielt um weitere Funktionen erweitert werden.",
]];
summary.getRange("A20").values = [["Empfehlung"]];
styleSubtitle(summary.getRange("A20"));
summary.getRange("A21:B21").values = [[
  "Nächster Schritt",
  "Short.io konkret anfragen, Dub kritisch gegen den Use Case prüfen und ein Enterprise-Benchmark-Angebot von Bitly/Rebrandly einholen. Parallel Eigenbau als Referenzoption konkretisieren und Datenschutz/Betrieb klären.",
]];
summary.getRange("A18:B21").format.wrapText = true;
setWidths(summary, [260, 780]);

addTitle(opportunities, "Vorteile & Chancen: Eigenbau vs. Markttool");
opportunities.getRange("A3").values = [["Einordnung"]];
styleSubtitle(opportunities.getRange("A3"));
opportunities.getRange("A4:D4").values = [[
  "Beide Optionen haben echte Vorteile. Ein Markttool eignet sich besonders gut, um schnell und mit geringem Anfangs-Commitment zu testen. Ein Eigenbau ist die stärkere Zielarchitektur, wenn der Prozess exakt passen, langfristig kontrollierbar und später erweiterbar sein soll.",
  null,
  null,
  null,
]];
opportunities.getRange("A4:D4").merge(false);
opportunities.getRange("A4:D4").format.wrapText = true;
opportunities.getRange("A4:D4").format.rowHeightPx = 58;
writeTable(opportunities, "A7", ["Option", "Vorteile / Opportunities", "Warum relevant", "Mögliche Erweiterungen"], [
  ["Markttool", "Schneller Start; wenig technischer Initialaufwand; unkomplizierter Test ohne festes langfristiges Commitment; Betrieb, Skalierung und Grund-Monitoring liegen beim Anbieter.", "Gut geeignet, um kurzfristig zu validieren, ob ein externer Anbieter den Link-/QR-Prozess zuverlässig abbildet und welche echten Kosten bei unserem Volumen entstehen.", "Kurzfristige Pilotkampagne, Vergleich von Reporting/Exporten, SLA- und Datenschutzprüfung, Preisbenchmark für Eigenbau-Entscheidung."],
  ["Eigenbau", "Sehr hoher Prozess-Fit; Eingaben, Validierung, Exporte und Reporting können exakt auf CSM/Data/Produktion zugeschnitten werden; weniger Produkt- und Preisabhängigkeit von Drittanbietern.", "Der Eigenbau wäre voraussichtlich der beste Fit, wenn der heutige Malin-Prozess sauber ersetzt und perspektivisch verbessert werden soll.", "Rollen/Rechte, Freigabe-Workflow, Kampagnen-Dashboard, automatische Plausibilitätschecks, QR-Export als ZIP, Data-Export, Historie/Audit-Log, Warnungen bei fehlerhaften Ziel-URLs."],
]);
opportunities.getRange("A13").values = [["Professionelle Einordnung"]];
styleSubtitle(opportunities.getRange("A13"));
writeTable(opportunities, "A14", ["Frage", "Einschätzung"], [
  ["Ist ein Markttool trotzdem sinnvoll?", "Ja, als schneller Test- und Vergleichspfad. Es reduziert den Startaufwand und schafft Preistransparenz, wenn Anbieter verbindliche Angebote für 200.000-2.000.000 neue Links/Monat abgeben."],
  ["Ist Eigenbau der bessere Zielzustand?", "Wahrscheinlich ja, wenn Prozess-Fit, spätere Erweiterbarkeit, Datenkontrolle und langfristige Steuerbarkeit höher gewichtet werden als der schnellste Start."],
  ["Kann das Tool später erweitert werden?", "Ja. Wenn die Basis sauber gebaut wird, kann das Tool modular wachsen: erst Upload, Linkgenerierung, QR-Ausgabe und Exporte; später Reporting, Rechte/Rollen, Freigaben, Monitoring und weitere Kampagnenfunktionen."],
]);
setWidths(opportunities, [170, 430, 470, 520]);

addTitle(buildVsBuy, "Gesamtkosten: Eigenbau vs. Markttool");
buildVsBuy.getRange("A3").values = [["Annahmen Eigenbau"]];
styleSubtitle(buildVsBuy.getRange("A3"));
writeTable(buildVsBuy, "A4", ["Parameter", "Niedrig", "Hoch", "Kommentar"], [
  ["Entwicklungsstunden Maria", 40, 60, "inkl. Abstimmung, Entwicklung, Tests und Dokumentation"],
  ["Stundensatz Maria", 85, 85, "€ pro Stunde"],
  ["Einmalige Entwicklungskosten", "=B5*B6", "=C5*C6", "Arbeitszeit; interne KI-/Toolkosten nicht eingerechnet"],
]);
styleTotalRow(buildVsBuy.getRange("A7:D7"));
buildVsBuy.getRange("A10").values = [["Laufende Kosten Eigenbau"]];
styleSubtitle(buildVsBuy.getRange("A10"));
writeTable(buildVsBuy, "A11", ["Kostenblock", "Niedrig/Monat", "Hoch/Monat", "Kommentar"], [
  ["Managed Server inkl. Web-App/Datenbank", 20, 50, "ca. €/Monat; Annahme ohne zusätzlichen Admin"],
  ["Backups/Storage", 5, 20, "ca. €/Monat; abhängig vom Hostingpaket"],
  ["Monitoring/Uptime Checks", 0, 30, "ca. €/Monat; Basis bis externer Dienst"],
  ["Domain/DNS", 0, 10, "€/Monat; falls vorhandene CMC-Domain genutzt wird, ggf. 0"],
  ["Optional externer Betrieb", 0, 500, "€/Monat; z. B. Rent your Admin, nur falls gewünscht"],
  ["Summe Eigenbau Betrieb ohne externen Admin", "=SUM(B12:B15)", "=SUM(C12:C15)", "Managed Server + Backups + Monitoring + Domain"],
  ["Summe Eigenbau Betrieb mit externem Admin", "=B17+B16", "=C17+C16", "nur falls Betrieb ausgelagert wird"],
]);
styleTotalRow(buildVsBuy.getRange("A17:D18"));
buildVsBuy.getRange("A21").values = [["Vergleich über 12 Monate"]];
styleSubtitle(buildVsBuy.getRange("A21"));
writeTable(buildVsBuy, "A22", ["Variante", "Einmalig niedrig", "Einmalig hoch", "Monatlich niedrig", "Monatlich hoch", "12 Monate niedrig", "12 Monate hoch", "Hinweis"], [
  ["Eigenbau ohne externen Admin", "=B7", "=C7", "=B17", "=C17", "=B23+D23*12", "=C23+E23*12", "Betrieb intern/managed"],
  ["Eigenbau mit externem Admin", "=B7", "=C7", "=B18", "=C18", "=B24+D24*12", "=C24+E24*12", "inkl. optionaler Betriebsunterstützung"],
  ["Markttool: günstigster öffentlicher Mindestwert", 0, 0, 148, "offen", "=D25*12", "offen", "Short.io Enterprise ab ca. 148 €/Monat als interne Vergleichsgröße; tatsächlicher Preis für unser Volumen offen"],
  ["Markttool: Enterprise-Angebot", 0, 0, "Custom", "Custom", "Custom", "Custom", "Dub, Bitly, Rebrandly und BL.INK müssen individuell angefragt werden"],
]);
buildVsBuy.getRange("B5:C5").format.numberFormat = "#,##0";
buildVsBuy.getRange("B6:C7").format.numberFormat = "#,##0 €";
buildVsBuy.getRange("B12:C18").format.numberFormat = "#,##0 €";
buildVsBuy.getRange("B23:G26").format.numberFormat = "#,##0 €";
setWidths(buildVsBuy, [260, 150, 150, 390, 140, 140, 150, 500]);

addTitle(requirements, "Anforderungsmatrix");
writeTable(requirements, "A3", ["Anforderung", "Gewichtung", "Eigenbau", "Short.io", "Dub", "Bitly", "Rebrandly", "BL.INK", "T2M", "Linkly", "Kommentar"], [
  ["200k-2M neue Links/Monat", "Muss", "Ja, gezielt baubar", "Wahrscheinlich, aber Preis/Volumen bestätigen", "Nur Enterprise; Standard Advanced 50k/Monat", "Nur Enterprise", "Nur High Volume/Enterprise", "Nur Enterprise", "Nur Custom", "Nur Enterprise/teuer", "größter Kostentreiber"],
  ["Custom Tracking-Domain", "Muss", "Ja", "Ja", "Ja", "Ja", "Ja", "Ja", "Ja", "Ja", "bei allen grundsätzlich möglich"],
  ["Bulk/API Link-Erstellung", "Muss", "Ja", "Ja", "Ja", "Enterprise/High Volume", "Ja/High Volume", "Ja", "Premium/Custom", "Pro/Business", "genaue API-Limits anfragen"],
  ["Redirects stabil ohne Ads/Delay", "Muss", "Ja, selbst kontrolliert", "Ja", "Ja", "Ja", "Ja", "Ja", "Ja", "Ja", "SLA/Verfügbarkeit prüfen"],
  ["Klicktracking/Reporting", "Muss", "Ja", "Ja", "Ja, aber Eventlimits", "Ja", "Ja", "Ja", "Ja", "Ja", "Reporting-Detailtiefe vergleichen"],
  ["Datenexport", "Muss", "Ja", "Ja, Support/S3 je Plan", "Ja/Webhooks/API", "Enterprise/Export", "Ja", "Ja", "Ja", "Enterprise/Sync", "Exportrechte vertraglich absichern"],
  ["AVV/DPA verfügbar/zu prüfen", "Muss", "Ja, CMC kontrolliert", "Ja laut Pricing/GDPR-Hinweis; Details prüfen", "Anfragen", "Trust/DPA prüfen", "Trust Center prüfen", "GDPR genannt", "GDPR/Regionen genannt", "Enterprise DPA", "DPA = Data Processing Agreement; deutsch: AVV, also Auftragsverarbeitungsvertrag"],
  ["QR-Code-Bilder", "Optional", "Ja, baubar", "Ja laut Pricing", "Ja, Custom QR codes", "Ja", "Ja", "Ja", "Ja", "Ja", "optional, nicht kaufentscheidend"],
  ["Kontrolle & Wartbarkeit", "Strategischer Vorteil", "hoch", "abhängig vom Anbieter", "abhängig vom Anbieter", "abhängig vom Anbieter", "abhängig vom Anbieter", "abhängig vom Anbieter", "abhängig vom Anbieter", "abhängig vom Anbieter", "kein Muss mehr, aber relevant für Übergabe, Abhängigkeit und langfristige Steuerbarkeit"],
  ["Prozess passend für CSM/Data/Produktion", "Muss", "Ja, exakt baubar", "Teilweise, Workarounds nötig", "Fraglich; eher Partner-/Affiliate-Fokus", "Teilweise", "Teilweise", "Teilweise", "Teilweise", "Teilweise", "Eigenbau passt am besten zum Prozess"],
]);
requirements.getRange("A16").values = [["Quellenhinweise zur Matrix"]];
styleSubtitle(requirements.getRange("A16"));
writeTable(requirements, "A17", ["Anbieter", "Quelle", "Wofür verwendet"], [
  ["Short.io", "https://short.io/pricing", "Link Automation, Redirects, Tracked Clicks, QR-Code, GDPR-Hinweis, SLA, Export"],
  ["Dub", "https://dub.co/pricing", "Neue Links/Monat, Enterprise, QR-Codes, API, Events, Partner-/Affiliate-Fokus"],
  ["Bitly", "https://bitly.com/pages/pricing", "Links/Monat, QR-Codes/Monat, Enterprise at-scale, API, SLA"],
  ["Rebrandly", "https://www.rebrandly.com/pricing", "Links/QR-Codes/Monat, High-Volume-Pläne, API/Tracking"],
  ["BL.INK", "https://www.bl.ink/pricing", "Aktive Links, Dynamic Links, GDPR, QR/Short Links, Enterprise"],
  ["T2M", "https://t2mio.com/pricing/", "Short URLs/Monat, Redirects/Monat, QR-Codes, AWS-Region/Custom Plan"],
  ["Linkly", "https://linklyhq.com/pricing", "Links/Monat, Add-ons, QR-Codes, Enterprise/DPA/SLA"],
]);
setWidths(requirements, [260, 110, 190, 230, 230, 190, 210, 190, 170, 190, 400]);

addTitle(providers, "Anbieter-Vergleich");
providers.getRange("A3").values = [["Einordnung"]];
providers.getRange("B3:F3").merge(false);
providers.getRange("B3:F3").values = [["Die Anbieter sind keine finale Bestenliste, sondern eine erste Shortlist und Benchmark-Auswahl: Short.io wirkt nach öffentlichen Informationen am nächsten am Use Case, Dub ist ein moderner Link-Management-Anbieter mit kritisch zu prüfendem Fit, Bitly/Rebrandly sind etablierte Enterprise-Benchmarks. BL.INK, T2M und Linkly dienen als zusätzliche Vergleichspunkte. QR Code Generator Pro ist bewusst als eher unpassende QR-Speziallösung aufgeführt."]];
providers.getRange("A3:F3").format.wrapText = true;
providers.getRange("A3:F3").format.rowHeightPx = 72;
writeTable(providers, "A5", ["Anbieter", "Rolle in der Prüfung", "Öffentlicher Plan / Preis", "Relevante Limits", "Eignung für CMC", "Bewertung / nächster Schritt"], [
  ["Short.io", "Priorität hoch", "Enterprise ab ca. 148 €/Monat; Team ca. 48 €/Monat mit 100.000 Link-Automation/Jahr", "Enterprise: Link Automation unlimited laut Pricing; Team reicht nicht für unser Monatsvolumen", "Am nächsten dran: Bulk/API, QR, Tracking, Custom Domains, GDPR-Hinweis, SLA ab Team.", "Als erstes anfragen: 2 Mio neue Links/Monat, AVV/DPA, SLA, Export, Kündigungsfall. Der öffentliche Preis ist nur Mindestwert und nach oben offen."],
  ["Dub", "Priorität mittel / kritisch prüfen", "Advanced ca. 250 €/Monat; Enterprise Custom", "Business 10k neue Links/Monat, Advanced 50k, Enterprise unlimited", "Technisch Links/QR/API/Analytics, aber öffentlicher Auftritt wirkt stark auf Partner-/Affiliate-Programme ausgelegt.", "Nicht als passend voraussetzen. Use Case schildern und bestätigen lassen, ob reine Gutschein-/Mailing-Massenlinks ohne Partnerprogramm sinnvoll unterstützt werden."],
  ["Bitly", "Enterprise-Benchmark", "Premium ca. 300 €/Monat; Enterprise Custom", "Premium 3.000 Links/Monat, 200 QR Codes/Monat; Enterprise at-scale", "Sehr etablierter Anbieter, aber Standardpläne viel zu klein.", "Enterprise-Angebot als Preisanker anfragen."],
  ["Rebrandly", "Enterprise-Benchmark", "Professional ca. 39 €/Monat; High Volume/Enterprise", "Professional 1.500 Links/Monat; High Volume für größere Mengen", "Funktional grundsätzlich passend, aber unser Volumen ist High-Volume/Enterprise.", "High-Volume-Angebot für 200k/1,1M/2M neue Links/Monat anfragen."],
  ["BL.INK", "Zusätzlicher Enterprise-Vergleich", "Business ca. 599 €/Monat; Enterprise Custom", "Business 250.000+ aktive Links, aber Dynamic Links 1.000; Enterprise Custom", "Enterprise-orientiert, Compliance stark, aber Standardplan unklar/unpassend für Dynamic/Massenlinks.", "Nur anfragen, wenn ein weiterer Enterprise-Vergleich gewünscht ist."],
  ["T2M", "Zusätzlicher Vergleich", "Premium ca. 90 €/Monat; Custom Plan", "Premium 50.000 Short URLs/Monat und 250.000 Redirects/Monat", "Funktional viel dabei, aber Standardlimit reicht nicht.", "Custom-Angebot nur anfragen, falls Short.io/Dub nicht passen."],
  ["Linkly", "Nicht priorisiert", "Business ca. 107 €/Monat; Add-ons", "5.000 Links/Monat, +1.000 Links für ca. 20,50 €", "Funktional gut für kleinere Kampagnen, aber bei unserem Volumen rechnerisch teuer.", "Nur als Vergleich behalten."],
  ["QR Code Generator Pro", "Nicht priorisiert", "Professional/Enterprise", "Professional eher auf wenige dynamische QR-Codes ausgelegt", "Zu QR-Code-fokussiert; unser Kernproblem sind Massen-Tracking-Links.", "Nicht weiter priorisieren."],
]);
providers.getRange("A16").values = [["Direkte Quellen"]];
styleSubtitle(providers.getRange("A16"));
writeTable(providers, "A17", ["Anbieter", "Quelle"], [
  ["Short.io", "https://short.io/pricing"],
  ["Dub", "https://dub.co/pricing"],
  ["Bitly", "https://bitly.com/pages/pricing"],
  ["Rebrandly", "https://www.rebrandly.com/pricing"],
  ["BL.INK", "https://www.bl.ink/pricing"],
  ["T2M", "https://t2mio.com/pricing/"],
  ["Linkly", "https://linklyhq.com/pricing"],
  ["QR Code Generator Pro", "https://www.qr-code-generator.com/pricing/"],
]);
setWidths(providers, [160, 210, 260, 330, 360, 420]);

addTitle(risks, "Risiken, Datenschutz und nächste Schritte");
risks.getRange("A3").values = [["Risiken"]];
styleSubtitle(risks.getRange("A3"));
writeTable(risks, "A4", ["Risiko/Frage", "Mögliche Auswirkung", "Mitigation / Entscheidung"], [
  ["Hosting und Infrastruktur", "Links aus Mailings werfen Fehler oder sind nicht erreichbar.", "Managed Server mit Monitoring/Backups; optional Betrieb an Rent your Admin geben."],
  ["Datenschutz", "Trackingdaten dürfen ggf. nicht in geplanter Form gespeichert werden.", "Vor Produktivstart klären: Datenarten, Speicherfristen, IP/User-Agent, AVV/DPA."],
  ["Server im Ausland", "Für Links technisch meist kein Problem, aber datenschutzrechtlich relevant, wenn personenbezogene Trackingdaten verarbeitet werden.", "EU-Hosting bevorzugen oder AVV/DPA, SCC/TIA und Datenminimierung klären. Reine Redirect-Ziel-URL ist weniger kritisch als Klicktracking mit IP/User-Agent."],
  ["Linkgenerierung fällt aus", "Mailings können nicht rechtzeitig rausgehen.", "Fallback-Prozess, Tests, Staging, Export-Wiederholung, klare Verantwortlichkeit."],
  ["Reporting unvollständig", "Kampagnenauswertung ist nicht belastbar.", "Tracking asynchron, Plausibilitätschecks, Exportprüfung."],
  ["Falsche Ziel-URLs", "QR-Codes leiten falsch weiter.", "Validierung, Preview, Scan-Test vor Produktionsfreigabe."],
  ["Anbieterabhängigkeit extern", "Kosten/Verfügbarkeit/Support liegen außerhalb CMC-Kontrolle.", "SLA/AVV/DPA/Exportrechte/Kündigungsfall vertraglich prüfen; Eigenbau als Alternative."],
]);
risks.getRange("A14").values = [["Nächste Schritte auf Management-Ebene"]];
styleSubtitle(risks.getRange("A14"));
writeTable(risks, "A15", ["Frage", "Was fehlt für die Entscheidung?", "Priorität"], [
  ["Sollen die Preise externer Anbieter genauer werden?", "Short.io, Dub und Bitly/Rebrandly mit identischem Volumenprofil anfragen.", "hoch"],
  ["Welche Anbieter kommen auf die Shortlist?", "Vorschlag: Short.io priorisieren, Dub kritisch prüfen, Bitly/Rebrandly als Benchmark nutzen.", "hoch"],
  ["Eigenbau vs. Markttool?", "Entscheiden, ob Prozess-Fit, Kontrolle und Wartbarkeit wichtiger sind als schneller Start und ausgelagerter Betrieb.", "hoch"],
  ["Welcher technische Ansatz beim Eigenbau?", "Web-App mit Datenbank, CSV-Upload, Tracking-Link-Erstellung, QR-Ausgabe, Reporting und Exporten konkretisieren.", "hoch"],
  ["Datenschutzfreigabe?", "AVV/DPA, Serverstandort, Trackingdaten, Speicherfristen und Datenminimierung klären.", "hoch"],
  ["Welche Praxisdaten fehlen?", "Beispielkampagnen, echte Exporte, gewünschtes Reporting, geschätzte Klick-/Scanmengen.", "mittel"],
]);
setWidths(risks, [330, 560, 430]);

addTitle(sources, "Quellen / Pricing-Seiten");
writeTable(sources, "A3", ["Thema", "Quelle", "Notiz"], [
  ["Short.io", "https://short.io/pricing", "Enterprise ab ca. 148 €/Monat; Link Automation unlimited; QR-Code, API, Export, GDPR-Hinweis"],
  ["Dub", "https://dub.co/pricing", "Business 10k, Advanced 50k neue Links/Monat, Enterprise unlimited; QR/API/Analytics vorhanden"],
  ["Bitly", "https://bitly.com/pages/pricing", "Premium 3.000 Links/Monat, Enterprise Custom mit at-scale Link/QR und API"],
  ["Rebrandly", "https://www.rebrandly.com/pricing", "Standardpläne klein; High Volume/Enterprise für große Mengen"],
  ["BL.INK", "https://www.bl.ink/pricing", "Business/Enterprise, QR/Short Links, GDPR, Dynamic Links Limits"],
  ["Linkly", "https://linklyhq.com/pricing", "Business 5.000 Links/Monat, Add-on 1.000 Links"],
  ["T2M", "https://t2mio.com/pricing/", "Premium 50.000 Short URLs/Monat; Custom Plan für größere Limits; AWS-Regionen erwähnt"],
  ["QR Code Generator", "https://www.qr-code-generator.com/pricing/", "QR-Code-Plattform, weniger passend für Millionen individuelle Tracking-Links"],
]);
setWidths(sources, [180, 430, 650]);

for (const sheet of workbook.worksheets) {
  const used = sheet.getUsedRange();
  used.format.font.name = "Arial";
  used.format.font.size = 10;
  used.format.wrapText = true;
  used.format.autofitRows();
}

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);

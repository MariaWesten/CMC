/*
  CMC Print-Mailing-Studie 2027
  Automatisierungstest: benannte InDesign-Rahmen aus JSON befüllen

  Nutzung:
  1. InDesign-Dokument öffnen.
  2. Script in den InDesign-Skripte-Ordner legen.
  3. Fenster > Hilfsprogramme > Skripte öffnen.
  4. Script im Skripte-Bedienfeld doppelklicken.
  5. Im Dialog die passende JSON-Datei auswählen, z.B. ankerkraut_data.json.

  Erwartung an das InDesign-Dokument:
  - Textrahmen/Bildrahmen sind über Fenster > Ebene oder Script Label mit Namen versehen.
  - Beispiele: partner_logo, partner_url, offer_value_amount, sender_name.
*/

#target "InDesign"

(function () {
  if (app.documents.length === 0) {
    alert("Bitte zuerst das InDesign-Dokument öffnen.");
    return;
  }

  var doc = app.activeDocument;
  var jsonFile = File.openDialog("JSON-Daten für die Befüllung auswählen", "*.json");
  if (!jsonFile) {
    return;
  }

  var data = readJson(jsonFile);
  if (!data) {
    alert("Die JSON-Datei konnte nicht gelesen werden.");
    return;
  }
  var jsonFolder = jsonFile.parent;

  var report = {
    partner: data.partner || "",
    textUpdated: [],
    textSkippedEmpty: [],
    textMissing: [],
    imageUpdated: [],
    imageMissing: [],
    imageFileMissing: [],
    textOptionalMissing: [],
    imageOptionalMissing: [],
    placeholderUpdates: 0,
    oversetFrames: [],
    savedCopy: "",
    warnings: []
  };

  fillTextFrames(doc, data.text || {}, report, data.options || {});
  fillImageFrames(doc, data.images || {}, report, data.options || {}, jsonFolder);

  if (data.options && data.options.replacePlaceholdersInStories) {
    report.placeholderUpdates = replaceStoryPlaceholders(doc, data.text || {});
  }
  report.oversetFrames = collectOversetTextFrames(doc);

  if (data.options && (data.options.saveCopySuffix || data.options.saveAsStudyFilename || data.options.outputFileName)) {
    try {
      var target = File(doc.filePath + "/" + buildSaveCopyName(doc, data));
      doc.saveACopy(target);
      report.savedCopy = target.name;
    } catch (e) {
      report.warnings.push("Kopie konnte nicht gespeichert werden: " + e.message);
    }
  }

  var reportText = buildReport(report);
  if (data.options && data.options.saveReportFile) {
    saveReportFile(jsonFile, reportText, report);
  }
  alert(reportText);

  function readJson(file) {
    try {
      file.encoding = "UTF-8";
      file.open("r");
      var raw = file.read();
      file.close();

      if (typeof JSON !== "undefined" && JSON.parse) {
        return JSON.parse(raw);
      }

      return eval("(" + raw + ")");
    } catch (e) {
      try {
        file.close();
      } catch (_) {}
      alert("JSON-Fehler: " + e.message);
      return null;
    }
  }

  function normalizeName(value) {
    return String(value || "").replace(/^\s+|\s+$/g, "");
  }

  function allNamedItems(documentRef, wantedName) {
    var matches = [];
    var normalizedWanted = normalizeName(wantedName);
    var items = documentRef.allPageItems;

    for (var i = 0; i < items.length; i++) {
      var itemName = normalizeName(items[i].name);
      if (itemName === normalizedWanted) {
        matches.push(items[i]);
      }
    }

    return matches;
  }

  function fillTextFrames(documentRef, textData, reportRef, options) {
    for (var key in textData) {
      if (!textData.hasOwnProperty(key)) {
        continue;
      }

      if (listContains(options.skipTextFrameKeys, key)) {
        continue;
      }

      var normalizedValue = normalizeTextValue(textData[key], options);
      if (options.preserveTemplateTextForEmptyValues !== false && isBlankText(normalizedValue)) {
        reportRef.textSkippedEmpty.push(key);
        continue;
      }

      var items = allNamedItems(documentRef, key);
      if (items.length === 0) {
        if (listContains(options.optionalTextFrameKeys, key)) {
          reportRef.textOptionalMissing.push(key);
        } else {
          reportRef.textMissing.push(key);
        }
        continue;
      }

      for (var i = 0; i < items.length; i++) {
        try {
          try {
            items[i].contents = normalizedValue;
          } catch (_) {
            if (items[i].texts && items[i].texts.length > 0) {
              items[i].texts[0].contents = normalizedValue;
            } else {
              reportRef.warnings.push(key + ": gefunden, aber kein Textrahmen.");
            }
          }
        } catch (e) {
          reportRef.warnings.push(key + ": Text konnte nicht gesetzt werden (" + e.message + ").");
        }
      }

      reportRef.textUpdated.push(key + " (" + items.length + "x)");
    }
  }

  function fillImageFrames(documentRef, imageData, reportRef, options, baseFolder) {
    for (var key in imageData) {
      if (!imageData.hasOwnProperty(key)) {
        continue;
      }

      var items = allNamedItems(documentRef, key);
      if (items.length === 0) {
        if (listContains(options.optionalImageFrameKeys, key)) {
          reportRef.imageOptionalMissing.push(key);
        } else {
          reportRef.imageMissing.push(key);
        }
        continue;
      }

      for (var i = 0; i < items.length; i++) {
        var imagePath = imagePathForIndex(imageData[key], i);
        var imageFile = resolveFile(String(imagePath), baseFolder);
        if (!imageFile.exists) {
          reportRef.imageFileMissing.push(key + "[" + (i + 1) + "] -> " + imagePath);
          continue;
        }

        try {
          clearExistingGraphics(items[i]);
          prepareFrameFitting(items[i]);
          items[i].place(imageFile);

          if (options.fitImagesProportionally) {
            fitFrameFullBleed(items[i]);
          }
        } catch (e) {
          reportRef.warnings.push(key + ": Bild konnte nicht platziert werden (" + e.message + ").");
        }
      }

      reportRef.imageUpdated.push(key + " (" + items.length + "x)");
    }
  }

  function imagePathForIndex(value, index) {
    if (value && value.length !== undefined && typeof value !== "string") {
      if (value.length === 0) {
        return "";
      }
      return String(value[index < value.length ? index : value.length - 1]);
    }

    if (typeof value === "string" && value.indexOf(",") !== -1) {
      var parts = value.split(",");
      return String(parts[index < parts.length ? index : parts.length - 1]).replace(/^\s+|\s+$/g, "");
    }

    return String(value);
  }

  function resolveFile(path, baseFolder) {
    var file = File(path);
    if (file.exists) {
      return file;
    }

    file = File(baseFolder.fsName + "/" + path);
    if (file.exists) {
      return file;
    }

    file = File(baseFolder.fsName + "/../" + path);
    return file;
  }

  function clearExistingGraphics(item) {
    try {
      while (item.graphics && item.graphics.length > 0) {
        item.graphics[0].remove();
      }
    } catch (_) {}
  }

  function prepareFrameFitting(item) {
    try {
      item.frameFittingOptions.fittingOnEmptyFrame = EmptyFrameFittingOptions.FILL_PROPORTIONALLY;
      item.frameFittingOptions.fittingAlignment = AnchorPoint.CENTER_ANCHOR;
      item.frameFittingOptions.autoFit = false;
      item.frameFittingOptions.topCrop = 0;
      item.frameFittingOptions.leftCrop = 0;
      item.frameFittingOptions.bottomCrop = 0;
      item.frameFittingOptions.rightCrop = 0;
    } catch (_) {}
  }

  function fitFrameFullBleed(item) {
    try {
      item.fit(FitOptions.APPLY_FRAME_FITTING_OPTIONS);
    } catch (_) {}
    try {
      item.fit(FitOptions.FILL_PROPORTIONALLY);
    } catch (_) {}
    try {
      item.fit(FitOptions.CENTER_CONTENT);
    } catch (_) {}
  }

  function replaceStoryPlaceholders(documentRef, textData) {
    var count = 0;

    for (var key in textData) {
      if (!textData.hasOwnProperty(key)) {
        continue;
      }

      count += replaceOnePlaceholder(documentRef, "{{" + key + "}}", normalizeTextValue(textData[key], {}));
      count += replaceOnePlaceholder(documentRef, "[" + key + "]", normalizeTextValue(textData[key], {}));
    }

    return count;
  }

  function normalizeTextValue(value, options) {
    var text = String(value || "");

    if (!options || options.collapseParagraphBreaks !== false) {
      text = text.replace(/\r\n/g, "\n");
      text = text.replace(/\r/g, "\n");
      text = text.replace(/\n{2,}/g, "\n");
    }

    return text.replace(/\n/g, "\r");
  }

  function isBlankText(value) {
    return String(value || "").replace(/[\r\n\s]+/g, "") === "";
  }

  function replaceOnePlaceholder(documentRef, placeholder, replacement) {
    var count = 0;

    app.findTextPreferences = NothingEnum.NOTHING;
    app.changeTextPreferences = NothingEnum.NOTHING;
    try {
      app.findChangeTextOptions.includeFootnotes = true;
      app.findChangeTextOptions.includeHiddenLayers = true;
      app.findChangeTextOptions.includeLockedLayersForFind = true;
      app.findChangeTextOptions.includeLockedStoriesForFind = true;
      app.findChangeTextOptions.includeMasterPages = true;
    } catch (_) {}
    app.findTextPreferences.findWhat = placeholder;
    app.changeTextPreferences.changeTo = replacement;

    try {
      var changed = documentRef.changeText();
      count += changed.length;
    } catch (_) {}

    app.findTextPreferences = NothingEnum.NOTHING;
    app.changeTextPreferences = NothingEnum.NOTHING;

    return count;
  }

  function collectOversetTextFrames(documentRef) {
    var overset = [];
    var items = documentRef.allPageItems;

    for (var i = 0; i < items.length; i++) {
      try {
        if (items[i].constructor && String(items[i].constructor.name) === "TextFrame" && items[i].overflows) {
          overset.push(normalizeName(items[i].name) || items[i].id);
        }
      } catch (_) {}
    }

    return overset;
  }

  function buildSaveCopyName(documentRef, dataRef) {
    var options = dataRef.options || {};

    if (options.outputFileName) {
      return ensureInddExtension(String(options.outputFileName));
    }

    if (options.saveAsStudyFilename) {
      var dateCode = normalizeDateCode(options.mailingDate || options.dateCode || new Date());
      var brand = normalizeBrandForFilename(options.brandForFilename || dataRef.brand || dataRef.partner || "Marke");
      return "PAL" + dateCode + "_" + brand + "_PrintMailingStudie_00.indd";
    }

    var baseName = documentRef.name.replace(/\.indd$/i, "");
    return baseName + options.saveCopySuffix + ".indd";
  }

  function ensureInddExtension(fileName) {
    return /\.indd$/i.test(fileName) ? fileName : fileName + ".indd";
  }

  function normalizeDateCode(value) {
    try {
      if (value && value.getFullYear) {
        return String(value.getFullYear()).substr(2, 2) + pad2(value.getMonth() + 1) + pad2(value.getDate());
      }
    } catch (_) {}

    var digits = String(value || "").replace(/[^0-9]/g, "");
    if (digits.length === 8) {
      return digits.substr(2, 6);
    }
    if (digits.length === 6) {
      return digits;
    }
    return "YYMMDD";
  }

  function pad2(value) {
    value = String(value);
    return value.length < 2 ? "0" + value : value;
  }

  function normalizeBrandForFilename(value) {
    var brand = String(value || "Marke");
    brand = brand.replace(/[–—]/g, "-");
    brand = brand.replace(/\s+-\s+.*$/g, "");
    brand = brand.replace(/Variante\s+[A-D].*$/i, "");
    brand = brand.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
    brand = brand.replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue");
    brand = brand.replace(/^\s+|\s+$/g, "");
    brand = brand.replace(/\s+/g, "_");
    brand = brand.replace(/[^A-Za-z0-9_]+/g, "");
    brand = brand.replace(/_+/g, "_");
    brand = brand.replace(/^_+|_+$/g, "");
    return brand || "Marke";
  }

  function listContains(list, value) {
    if (!list || !list.length) {
      return false;
    }
    for (var i = 0; i < list.length; i++) {
      if (String(list[i]) === String(value)) {
        return true;
      }
    }
    return false;
  }

  function saveReportFile(jsonFileRef, reportText, reportRef) {
    try {
      var baseName = jsonFileRef.name.replace(/\.json$/i, "");
      var reportFile = File(jsonFileRef.parent.fsName + "/" + baseName + "_report.txt");
      reportFile.encoding = "UTF-8";
      reportFile.open("w");
      reportFile.write(reportText);
      reportFile.close();
      reportRef.warnings.push("Report gespeichert: " + reportFile.name);
    } catch (e) {
      reportRef.warnings.push("Report-Datei konnte nicht gespeichert werden: " + e.message);
    }
  }

  function buildReport(reportRef) {
    var lines = [];
    lines.push("Automatisierungstest abgeschlossen");
    if (reportRef.partner) {
      lines.push("Partner: " + reportRef.partner);
    }
    lines.push("");
    lines.push("Texte gesetzt: " + (reportRef.textUpdated.length ? reportRef.textUpdated.join(", ") : "keine"));
    if (reportRef.textSkippedEmpty.length) {
      lines.push("Leere Textwerte übersprungen, Template-Inhalt erhalten: " + reportRef.textSkippedEmpty.join(", "));
    }
    lines.push("Bilder gesetzt: " + (reportRef.imageUpdated.length ? reportRef.imageUpdated.join(", ") : "keine"));
    lines.push("Platzhalter im Fließtext ersetzt: " + reportRef.placeholderUpdates);
    lines.push("Textrahmen mit Übersatz: " + (reportRef.oversetFrames.length ? reportRef.oversetFrames.join(", ") : "keine"));
    if (reportRef.savedCopy) {
      lines.push("Gespeicherte Kopie: " + reportRef.savedCopy);
    }

    if (reportRef.textMissing.length) {
      lines.push("");
      lines.push("Nicht gefundene Textfelder: " + reportRef.textMissing.join(", "));
    }
    if (reportRef.textOptionalMissing.length) {
      lines.push("");
      lines.push("Optionale/nur als Platzhalter genutzte Textfelder nicht gefunden: " + reportRef.textOptionalMissing.join(", "));
    }
    if (reportRef.imageMissing.length) {
      lines.push("");
      lines.push("Nicht gefundene Bildfelder: " + reportRef.imageMissing.join(", "));
    }
    if (reportRef.imageOptionalMissing.length) {
      lines.push("");
      lines.push("Optionale Bildfelder nicht gefunden: " + reportRef.imageOptionalMissing.join(", "));
    }
    if (reportRef.imageFileMissing.length) {
      lines.push("");
      lines.push("Fehlende Bilddateien: " + reportRef.imageFileMissing.join(", "));
    }
    if (reportRef.warnings.length) {
      lines.push("");
      lines.push("Hinweise: " + reportRef.warnings.join(" | "));
    }

    return lines.join("\n");
  }
})();

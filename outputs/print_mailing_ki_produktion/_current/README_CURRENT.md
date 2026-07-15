# Aktueller Stand: KI-gestützte Print-Mailing-Produktion

Diese Ablage ist der verbindliche aktuelle Arbeitsstand für den Mailing-Assistenten, das InDesign-Skript und die Prozessdokumentation.

## Latest-Dateien

- `json_builder_tool_latest.zip`  
  Aktueller Mailing-Assistent / JSON-Builder.

- `cmc_fill_named_frames_latest.jsx`  
  Passendes InDesign-Skript zur Befüllung benannter Text- und Bildrahmen.

- `CMC_KI_Prozess_Print_Mailing_Studie_2027_latest.docx`  
  Aktuelle Prozessdokumentation ohne sichtbares Standdatum.

## Versionierter Stand

Archivordner:

- `../_archive/2026-07-14_simone_feedback/`

Enthält die Version nach Simones Feedback vom 14.07.2026.

## Inhaltlicher Stand 14.07.2026

Im Builder umgesetzt:

- Template-Felder werden nicht frei KI-generiert, sondern im InDesign-Template erhalten.
- Template-Felder werden beim Export leer gesetzt, damit das InDesign-Skript vorhandene Template-Texte nicht überschreibt.
- `a_front_copy`: Ziel mind. 600 Zeichen, max. 700 Zeichen.
- `c_front_copy`: Ziel mind. 270 Zeichen, max. 310 Zeichen.
- `b_sub_headline_CTA`: emotionaler und konkreter, sinngemäß "Scanne den QR-Code und erlebe selbst, wie ...".
- `d_front_quote`: Absender-/Autorenzitat, kein Kundenzitat.
- Fixe Felder wie `partner_url`, `offer_value_amount`, `offer_value_friends_amount`, `offer_value_type` bleiben feste Angebots-/Platzhalterwerte.

Im InDesign-Skript relevant:

- Leere Textwerte überschreiben Template-Texte nicht.
- Platzhalter wie `{{partner_name}}`, `{{Vorname}}`, `{{offer_value_amount}}` werden im Fließtext ersetzt.
- Bilder werden proportional/mittig eingesetzt.
- Die befüllte InDesign-Kopie wird nach Studien-Dateinamenslogik gespeichert.

## Hinweis

Bei weiteren Änderungen zuerst diese `latest`-Dateien verwenden und anschließend neue Archivversion anlegen.


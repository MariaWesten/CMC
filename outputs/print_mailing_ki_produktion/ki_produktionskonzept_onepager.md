# KI-gestützte Variantenproduktion für die CMC Print-Mailing-Studie 2027

## Ziel

Die Erstellung der vier Layoutvarianten pro Partner soll von aktuell ca. 8-12 Stunden auf maximal 6 Stunden pro Partner reduziert werden. Der Hebel ist nicht die reine Texterstellung mit ChatGPT, sondern die Kombination aus standardisierten InDesign-Templates, strukturierter KI-Ausgabe und automatisiertem Befüllen der Layouts.

## Grundprinzip

InDesign bleibt das finale Produktionssystem für Layout, Druckdaten, Beschnitt, Bildplatzierung, Korrekturen und Export. Die KI ersetzt nicht die Art Direction von Simone und Juliane, sondern liefert partnerindividuelle Inhalte slotgenau für vordefinierte Layoutbereiche. Ein InDesign-Script befüllt anschließend die benannten Text- und Bildrahmen automatisch.

## Zielprozess

1. Partnerbriefing
   - Partner füllt Microsoft Forms aus.
   - Brand Guidelines, Logos, Bilder, Produktdaten und Pflichttexte liegen nach und nach im SharePoint-Partnerordner.
   - In den meisten Fällen erhalten die Partner einen SharePoint-Link und laden Bilddaten/Assets dort selbst hoch. Teilweise kommen Bilder per Mail und werden anschließend manuell im SharePoint abgelegt.
   - CMC prüft, ob Briefing und Assets vollständig sind.

2. Datenaufbereitung
   - Die Forms-Antworten werden in eine strukturierte Partnerdatei überführt.
   - RFM-relevante Merkmale und Gutscheincodes kommen separat über den Data-/Operations-Prozess und werden ebenfalls im SharePoint abgelegt. Für das Design sind sie nur teilweise relevant.
   - RFM-relevante Merkmale kommen aus den Shop-/Kundendaten; die RFM-Scores werden daraus abgeleitet.
   - Angebot, Produktfokus und Incentive bleiben pro Partner für alle vier Varianten identisch.

3. KI-Inhaltserstellung
   - Die KI erzeugt keine freien Fließtexte, sondern feste Felder pro Variante.
   - Beispiel: Headline, Einstieg, Nutzenargumente, CTA, Gutscheintext, P.S., Rückseitenmodule, Bildbriefing, Pflichttext-Hinweise.
   - Die Variantenlogik wird über feste Prompt-Vorlagen bzw. ein Prompt-Script gesteuert: Klassischer Werbebrief, Visual Storytelling, Snackable, Editorial.
   - Ausgabeformat: strukturierte Tabelle oder JSON, passend zu den InDesign-Platzhaltern.

4. InDesign-Automation
   - Pro Variante gibt es eine standardisierte Vorder- und Rückseitenvorlage.
   - Alle variablen Textrahmen und Bildrahmen sind eindeutig benannt.
   - Ein Script liest die Partnerdaten und KI-Texte ein und befüllt die InDesign-Templates automatisch.
   - QR-Code-Grafiken werden separat durch Data Management/Operations erzeugt bzw. bereitgestellt und später in die vorgesehenen Rahmen eingesetzt.

5. Menschliche QA und Export
   - Simone/Jule prüfen Bildauswahl, Layoutwirkung, Textüberläufe, CI, Tonalität und Druckdaten.
   - Danach Export von Korrektur-PDFs bzw. Produktionsdaten.

## Wie die KI die Texte erstellt

Kurzfristig kann die KI über ein festes Prompt-Set oder ein kleines Prompt-Script arbeiten. Entscheidend ist, dass die Prompts pro Variante nicht frei formuliert, sondern standardisiert sind:

- Variante A: Klassischer Werbebrief
- Variante B: Visual Storytelling
- Variante C: Snackable
- Variante D: Editorial

Die KI bekommt pro Partner die normalisierten Briefingdaten und erzeugt daraus für jede Variante exakt definierte Textslots. Perspektivisch kann das über ein kleines internes Tool oder Script laufen, das die Partnerdaten einliest, die Prompts automatisch ausführt und die Ergebnisse als JSON/CSV für InDesign speichert.

## Erwarteter Effekt

Der bisherige manuelle Aufwand verschiebt sich:

- weniger Copy-Paste zwischen ChatGPT und InDesign
- weniger manueller Layoutaufbau
- weniger Suchen nach wiederkehrenden Text-/Bildbausteinen
- mehr Fokus auf Art Direction, Korrektur und Qualitätssicherung

## Pilot

Pilotpartner:

- shape labs
- Taiga Naturkost
- Doktor Health

Gemessen wird je Partner:

- Briefing- und Assetcheck
- KI-Erstellung der Inhalte
- automatische Befüllung der InDesign-Templates
- manuelles Layout-Finishing
- QA und Export

Ergebnis für Robert:

- Zeit je Partner
- Durchschnitt über drei Partner
- Bewertung, ob 6 Stunden pro Partner realistisch erreichbar sind
- Engpässe und notwendige Anpassungen

## Was noch benötigt wird

- InDesign-Vorlage(n) mit Platzhaltern/Bausteinen von Simone/Jule
- Liste der fixen und variablen Elemente je Variante
- Assetordnerstruktur pro Partner
- finale Entscheidung, welche Felder aus dem Fragebogen für welche InDesign-Slots genutzt werden
- ein Pilotdatensatz für jeden der drei Partner

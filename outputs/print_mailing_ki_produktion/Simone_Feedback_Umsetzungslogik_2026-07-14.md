# Simone-Feedback: Umsetzungslogik fuer Builder/Skript

Stand: 2026-07-14

## Grundregel

Die Spalte `text_logik` aus der Rahmentabelle ist fuehrend:

- `ki_generiert`: Text darf durch KI neu erstellt werden.
- `standard_anpassen`: Template-Text bleibt im Kern erhalten. Es werden nur Platzhalter, Name, Du/Sie-Ansprache, Gendering und partnerbezogene Variablen angepasst.
- `pflichttext_fix` bzw. globale Felder: Werte werden aus Partner-/Offer-Daten uebernommen, nicht frei getextet.

## Feldanpassungen laut Simone

### Variante A

`a_front_headline`
- Nicht frei generieren.
- Nur Platzhalter/Partnerbezug im bestehenden Template setzen.
- `text_logik`: `standard_anpassen`.

`a_front_copy`
- KI-generiert.
- Maximal laut Tabelle: 700 Zeichen.
- Neu: mindestens ca. 600 Zeichen anstreben.
- Struktur: 3 Absaetze: Anlass, Produkte, CTA.
- Text beginnt mit kleinem Buchstaben, wenn er nach der Anrede direkt weiterlaeuft.

`a_back_product_headline`
- Nicht frei generieren.
- Nur Platzhalter/Partnerbezug im bestehenden Template setzen.
- `text_logik`: `standard_anpassen`.

### Variante B

`b_headline_CTA`
- Nicht frei generieren.
- Nur Platzhalter/Partnerbezug im bestehenden Template setzen.
- Du/Sie-Ansprache beachten.

`b_sub_headline_CTA`
- KI-generiert, aber emotionaler und konkreter.
- Soll sinngemaess starten bzw. wirken wie: "Scanne den QR-Code und erlebe selbst, wie ..."
- Nicht generisch formulieren.

### Variante C

`c_front_headline`
- Nicht frei generieren.
- Nur Name/Personalisierung einsetzen.
- Template-Logik erhalten.
- Maximal laut Tabelle: 30 Zeichen.

`c_front_copy`
- KI-generiert.
- Maximal laut Tabelle: 310 Zeichen.
- Neu: mindestens ca. 270 Zeichen anstreben.
- Kein doppelter Einstieg zum Gutschein.
- Fokus: Produkte, Marken-USP, Vorteilskommunikation.
- Struktur: 2 Absaetze: Marke/Produkte, Rabatt-Info + CTA.

`c_back_product_headline`
- Nicht frei generieren.
- Nur Platzhalter/Partnerbezug im bestehenden Template setzen.
- Du/Sie-Ansprache beachten.

### Variante D

`d_front_quote`
- KI-generiert.
- Kein Kundenzitat.
- Es soll ein Zitat vom Absender/Autor sein.
- Bezug auf Marke bzw. Thema, mit faktischer Begruendung.
- Maximal laut Tabelle: 220 Zeichen.

`d_back_headline`
- KI-generiert.
- Empfehlung vom Absender, die den Produktnutzen betont.
- Maximal laut Tabelle: 35 Zeichen.

`d_back_quote`
- KI-generiert.
- Absender-/Autoren-Zitat zur Marke oder zum Thema.
- Maximal laut Tabelle: 380 Zeichen.

## Globale/fixe Felder

Diese Felder werden nicht KI-generiert, sondern aus Partner-/Offer-Daten uebernommen:

- `partner_url`
- `offer_value_amount`
- `offer_value_friends_amount`
- `offer_value_type`
- `friend_offer_value_amount`

## Prompt-Regeln fuer KI-Textauftrag

1. Harte maximale Zeichenlaengen aus der Rahmentabelle duerfen nicht ueberschritten werden.
2. Mindestlaengen nur dort als Ziel verwenden, wo Simone es ergaenzt hat:
   - `a_front_copy`: Ziel 600 bis 700 Zeichen.
   - `c_front_copy`: Ziel 270 bis 310 Zeichen.
3. Felder mit `standard_anpassen` nicht neu formulieren, sondern im JSON leer lassen oder nur die konkret benoetigten Platzhalter-/Anredewerte liefern, je nach Builder-Implementierung.
4. Keine doppelten Gutschein-Einstiege in Variante C.
5. Keine Kundenzitate fuer `d_front_quote`; stattdessen Absender-/Autoren-Zitat.

## Empfehlung fuer Builder-Implementierung

Der Builder sollte `standard_anpassen`-Felder visuell anders behandeln als `ki_generiert`:

- Label: "Template-Text / nur Platzhalter"
- Nicht in den KI-Textauftrag als frei zu formulierendes Textfeld aufnehmen.
- Im Checkreport nicht als fehlender KI-Text werten, wenn kein neuer Text geliefert wird.
- Beim InDesign-Skript darf ein leerer Wert bestehende Template-Texte nicht ueberschreiben.


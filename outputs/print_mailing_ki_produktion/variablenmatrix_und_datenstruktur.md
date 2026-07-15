# Variablenmatrix und Datenstruktur

## Bewertung des vorhandenen Designbriefings

Der aktuelle Fragebogen ist als KI-Briefing gut nutzbar. Er liefert bereits viele zentrale Informationen:

- Unternehmen und Absenderadresse
- Brand Guidelines / Corporate Design
- visuelle Vorgaben
- Anredeform und Tonalität
- zentrale Botschaft und gewünschte Emotion
- Zielgruppe
- Pflichtbegriffe, Werte, USPs
- kreative Einschränkungen und rechtliche Hinweise
- parallele Kampagnen
- Learnings aus bisherigen Mailings
- QR-Code-Link und Text-URL
- Gutscheinbedingungen / Sternchentext
- bevorzugte Anrede und Grußformel
- Vorstellungen zum Marketingtext
- Vorderseitenvariante
- flexible Module für Vorder- und Rückseite
- Rückseitenmodule und Materialien

Für einen automatisierten Workflow reicht das inhaltlich als Basis. Für ein robustes Script braucht es zusätzlich eine technische Normalisierung.

## Inputquellen

Die Produktionsdaten kommen aus mehreren Quellen:

- Designbriefing über Microsoft Forms
- Bilddaten, Logos, Brand Guidelines und weitere Assets im SharePoint-Partnerordner
- teilweise Bilddaten per Mail, die danach manuell im SharePoint abgelegt werden
- RFM-relevante Merkmale und Gutscheincodes separat über Data/Operations
- QR-Code-Grafiken bzw. QR-Code-Daten separat aus dem Data-Management-Prozess

Für die Automatisierung ist deshalb wichtig, dass am Ende pro Partner ein eindeutiger Produktionsordner existiert, aus dem Script/KI alle benötigten Daten und Assets eindeutig referenzieren können.

## Was im Fragebogen noch nicht maschinenfertig ist

Viele Antworten sind Freitext oder verweisen auf externe Datenpakete. Für Automatisierung brauchen wir daraus standardisierte Felder:

- eindeutiger Partnername ohne Adresse
- getrennte Absenderadresse
- feste Asset-Pfade für Logo, Bilder, Brand Guidelines, Fonts
- klares Angebot, Produktfokus und Incentive
- strukturierte Gutscheinlogik
- eindeutiger QR-Link je Variante oder je Incentive
- konkrete Produktdaten: Name, URL, Preis, ggf. Streichpreis, Bild
- eindeutige Modul-Auswahl für Vorder- und Rückseite
- rechtliche Pflichttexte und No-Go-Begriffe
- Bildfreigaben / Nutzungsrechte
- finale Textlängen je Slot

## Wichtig: RFM und Gutscheincodes

Die Shops liefern nicht fertige RFM-Scores. Sie liefern RFM-relevante Merkmale, z.B.:

- letztes Kaufdatum
- Kaufhäufigkeit
- Umsatz / Kundenwert
- ggf. Produktgruppenhistorie

Die RFM-Scores werden daraus durch CMC bzw. im Studien-Setup abgeleitet.

Gutscheincodes und QR-Code-Daten sind für das finale Mailing relevant, aber nicht der Kern der Designautomatisierung. Für InDesign braucht es am Ende vor allem eindeutige Platzhalter bzw. Bilddateien für QR-Codes und klar formulierte Gutschein-/Sternchentexte.

## Ziel-Datenstruktur pro Partner

Die zentrale Produktionsdatei sollte pro Partner etwa so aufgebaut sein:

```json
{
  "partner": {
    "name": "Beispielshop",
    "sender_address": "Beispiel GmbH, Musterstraße 1, 12345 Berlin",
    "tone_of_voice": "Du, persönlich und wertschätzend",
    "brand_guidelines_path": "assets/brand/brandbook.pdf",
    "logo_path": "assets/logo/logo.svg",
    "font_paths": ["assets/fonts/font.otf"],
    "visual_notes": "CI-Farben und Bildwelt laut Brandbook nutzen"
  },
  "campaign": {
    "main_message": "Zentrale Botschaft",
    "desired_emotion": "Gewünschte Emotion",
    "target_audience": "Zielgruppe",
    "offer": "15 Prozent Rabatt",
    "product_focus": "Produktgruppe oder Produkt",
    "incentive": "Gutschein / Zusatzangebot",
    "qr_url": "https://example.com",
    "print_url": "www.example.com",
    "coupon_conditions": "Sternchentext",
    "legal_restrictions": ["No-Go-Begriff", "Pflichthinweis"]
  },
  "assets": {
    "hero_images": ["assets/images/hero1.jpg"],
    "product_images": ["assets/images/product1.png"],
    "certifications": ["Trusted Shops"],
    "review_sources": ["Trustpilot"]
  },
  "variants": {
    "A_classic": {},
    "B_visual_storytelling": {},
    "C_snackable": {},
    "D_editorial": {}
  }
}
```

## Slots je Variante

Jede Variante braucht feste Text- und Bildslots. Die Namen müssen später mit den InDesign-Rahmen übereinstimmen.

| Slot | Bedeutung | Quelle | Automatisierung |
| --- | --- | --- | --- |
| partner_logo | Logo | Assetordner | automatisch |
| sender_address | Absender | Fragebogen | automatisch |
| salutation | Anrede | Fragebogen + Kundendaten | automatisch |
| headline | Hauptheadline | KI | automatisch |
| subheadline | Unterzeile | KI | automatisch |
| intro_text | Einstieg | KI | automatisch |
| benefit_block | Nutzenargumente | KI + USPs | automatisch |
| offer_block | Angebot/Incentive | Fragebogen + KI | automatisch |
| cta_text | Call-to-Action | KI | automatisch |
| coupon_text | Gutscheintext | Fragebogen + KI | automatisch |
| legal_text | Sternchentext/Pflichttext | Fragebogen | automatisch |
| qr_code | QR-Code-Platzhalter | Data Management / QR-Workflow | automatisch/halbautomatisch |
| hero_image | Hauptbild | Assetordner + manuelle Auswahl | halbautomatisch |
| product_images | Produktbilder | Assetordner | halbautomatisch |
| backside_module_1 | Rückseitenmodul 1 | Fragebogen + KI | automatisch |
| backside_module_2 | Rückseitenmodul 2 | Fragebogen + KI | automatisch |
| backside_module_3 | Rückseitenmodul 3 | Fragebogen + KI | automatisch |
| signoff | Grußformel / Unterschrift | Fragebogen + Assetordner | automatisch/halbautomatisch |

## Nächster Schritt mit Simone und Jule

Simone und Jule sollten an einer InDesign-Vorlage zeigen:

1. Welche Bausteine sind fix?
2. Welche Bausteine sind pro Partner variabel?
3. Welche Rahmen können eindeutig benannt werden?
4. Welche Textlängen sind je Slot realistisch?
5. Welche Bildentscheidungen müssen weiterhin manuell bleiben?
6. Welche Varianten unterscheiden sich wirklich strukturell, und welche nur in Textlogik/Tonalität?

Sobald diese Vorlage vorliegt, kann daraus ein erster Script-Prototyp entstehen.

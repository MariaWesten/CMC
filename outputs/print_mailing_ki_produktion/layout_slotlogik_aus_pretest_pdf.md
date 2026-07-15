# Layout-Slotlogik aus dem Pretest-PDF

Quelle: `CMC_Studie_2027_PrintMailing_DE_Layouttypen_Pretest.pdf`

## Grundbeobachtung

Im PDF sind die Platzhalter nicht technisch als InDesign-Slots benannt. Inhaltlich ist die Slotstruktur aber gut erkennbar. Für die Automatisierung sollte daraus eine eindeutige InDesign-Namenslogik abgeleitet werden.

## Globale Slots für alle Varianten

Diese Slots kommen grundsätzlich in allen Varianten vor oder sollten zumindest als globale Platzhalter in den Templates vorgesehen werden:

| Slotname | Inhalt | Quelle |
| --- | --- | --- |
| `partner_logo` | Logo des Partners | SharePoint-Assetordner |
| `sender_line` | Absenderzeile über Adressfeld | Partnerbriefing |
| `address_block` | Empfängeradresse nach DIN 5008 | Data Management |
| `salutation` | Anrede, z.B. Hallo Maxi | Kundendaten + Briefing |
| `main_headline` | Hauptheadline | KI |
| `body_copy` | Haupttext | KI |
| `offer_value` | Rabatt/Incentive, z.B. 18 % | Briefing/Gutscheinlogik |
| `coupon_code` | Gutscheincode | Data/Operations |
| `coupon_conditions` | Sternchentext | Briefing |
| `qr_code` | QR-Code-Grafik | Data Management/Operations |
| `qr_subline` | Text am QR-Code | KI/Template |
| `print_url` | sichtbare URL | Briefing |
| `cta_text` | Aktivierungsaufforderung | KI |
| `signoff_text` | Grußformel, Name, Position | Briefing |
| `signature_image` | Unterschrift/Foto, falls genutzt | SharePoint-Assetordner |
| `legal_footer` | Datenschutz/Impressum/Einlösebedingungen | Briefing/Standardtext |

## Variante A – Klassischer Werbebrief

Erkennbare Struktur:

- Adressfeld oben links nach DIN 5008
- klassischer Briefaufbau
- Logo/Absender
- Headline oder Angebotszeile
- mittellanger Fließtext
- Gutschein als Störer/Badge oder Angebotsblock
- QR-Code mit kurzer Anleitung
- Trust-/Siegel-/Vorteilsbereich
- ggf. Johnson Box in Version 2
- Grußformel mit Foto/Unterschrift möglich

Empfohlene InDesign-Slots:

| Slotname | Funktion |
| --- | --- |
| `a_logo` | Partnerlogo |
| `a_sender_line` | Absenderzeile |
| `a_address_block` | Empfängeradresse |
| `a_johnson_box` | Optionaler Angebotskasten / Kernangebot |
| `a_main_headline` | Hauptheadline |
| `a_intro_copy` | Einstieg |
| `a_body_copy` | Hauptargumentation |
| `a_offer_badge` | Gutschein-Störer |
| `a_qr_code` | QR-Code |
| `a_qr_instruction` | QR-Anleitung |
| `a_trust_elements` | Siegel, Bewertungen, Zertifikate |
| `a_side_module` | Zusatzmodul, z.B. Produkt-/Markeninfo |
| `a_signoff` | Grußformel |
| `a_signature_image` | Unterschrift/Foto |
| `a_legal_footer` | Sternchen-/Pflichttext |

## Variante B – Visual Storytelling

Erkennbare Struktur:

- Adressfeld oben links
- großflächiges Hero-Image oder mehrere Moodbilder
- kurze emotionale Headline unter dem Bild
- narrativer Fließtext: Problem -> Lösung -> Ergebnis
- Gutschein dezent im Fließtext oder als First-View-Feld
- QR-Code mit emotionalem CTA
- Tonalität persönlich, erzählend

Empfohlene InDesign-Slots:

| Slotname | Funktion |
| --- | --- |
| `b_logo` | Partnerlogo |
| `b_sender_line` | Absenderzeile |
| `b_address_block` | Empfängeradresse |
| `b_hero_image_1` | Hauptbild |
| `b_hero_image_2` | optionales Moodbild |
| `b_hero_image_3` | optionales Moodbild |
| `b_emotional_headline` | emotionale Headline |
| `b_story_intro` | Problem-/Moment-Einstieg |
| `b_story_solution` | Lösung/Produktbezug |
| `b_story_result` | Ergebnis/Gefühl |
| `b_coupon_inline` | dezenter Gutscheincode |
| `b_offer_line` | Angebotszeile |
| `b_cta_text` | emotionaler CTA |
| `b_qr_code` | QR-Code |
| `b_legal_footer` | Sternchen-/Pflichttext |

## Variante C – Snackable Kurzbrief

Erkennbare Struktur:

- Adressfeld oben links
- sehr viel Whitespace
- große plakative Headline
- maximal 3-5 Sätze Fließtext
- Gutschein als zentrales Badge
- großer QR-Code, zentral
- kurze QR-Subline
- optional Produktbild im First-View-Bereich

Empfohlene InDesign-Slots:

| Slotname | Funktion |
| --- | --- |
| `c_logo` | Partnerlogo |
| `c_sender_line` | Absenderzeile |
| `c_address_block` | Empfängeradresse |
| `c_product_image` | optionales Produktbild |
| `c_big_headline` | plakative Headline |
| `c_short_copy` | maximal 3-5 Sätze |
| `c_coupon_badge` | zentrales Gutschein-Badge |
| `c_offer_line` | Angebotszeile |
| `c_qr_code` | großer QR-Code |
| `c_qr_subline` | z.B. Jetzt scannen & profitieren |
| `c_legal_footer` | Sternchen-/Pflichttext |

## Variante D – Editorial

Erkennbare Struktur:

- Adressfeld oben links
- magazinartige Titelzeile
- Autorenbereich mit Foto, Name und Funktion
- zweispaltiger redaktioneller Aufbau
- Zwischenüberschriften
- Themenbild im Inhalt
- Pull-Quote im Seitenrand
- Faktenbox / Gut-zu-wissen-Kasten
- separater Gutschein-/Angebotsblock im unteren Seitenbereich
- QR-Code mit Aktivierungsaufforderung

Empfohlene InDesign-Slots:

| Slotname | Funktion |
| --- | --- |
| `d_logo` | Partnerlogo |
| `d_sender_line` | Absenderzeile |
| `d_address_block` | Empfängeradresse |
| `d_kicker` | kleine redaktionelle Dachzeile |
| `d_editorial_headline` | magazinartige Titelzeile |
| `d_author_photo` | Autorenfoto |
| `d_author_name` | Name |
| `d_author_role` | Funktion |
| `d_section_1_heading` | Zwischenüberschrift 1 |
| `d_section_1_copy` | Textspalte 1 |
| `d_section_2_heading` | Zwischenüberschrift 2 |
| `d_section_2_copy` | Textspalte 2 |
| `d_topic_image` | inhaltliches Themenbild |
| `d_pull_quote` | hervorgehobenes Zitat |
| `d_fact_box` | Fakten/Trust-Elemente |
| `d_offer_block` | Gutschein-/Angebotsblock |
| `d_coupon_badge` | Gutschein-Badge |
| `d_qr_code` | QR-Code |
| `d_qr_cta` | Aktivierungsaufforderung |
| `d_legal_footer` | Sternchen-/Pflichttext |

## Rückseiten-Logik

Das PDF zeigt primär Layouttypen für die Vorderseite. Für die Studie sollen laut Robert alle vier Varianten individuelle Rückseiten passend zum Testansatz erhalten. Dafür sollte je Variante ebenfalls eine Slotlogik definiert werden:

- Variante A: Angebots-/Vorteilsrückseite, Trust, Produktvorteile, Shop-Vorteile
- Variante B: emotionale Marken-/Anwendungswelt, Moodbilder, Story-Fortsetzung
- Variante C: stark reduzierte Rückseite mit klaren Produkt-/Angebotsmodulen
- Variante D: redaktionelle Rückseite mit Info-Modulen, Faktenboxen, Experten-/Autorenlogik

## Empfehlung für Simone/Jule

Die PDF reicht aus, um die Platzhalter vorzudefinieren. Für die technische Automatisierung muss Simone/Jule diese Slots aber in InDesign in echte, eindeutig benannte Rahmen übersetzen. Pro Rahmen sollte festgelegt werden:

- Slotname
- maximale Zeichenanzahl
- Quelle: Fragebogen, KI, SharePoint-Asset, Data Management
- Pflicht oder optional
- automatisierbar oder manuell zu prüfen

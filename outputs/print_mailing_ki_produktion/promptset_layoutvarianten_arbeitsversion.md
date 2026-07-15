# Promptset Arbeitsversion – CMC Print-Mailing-Studie 2027

Stand: 29.06.2026

## Grundlogik

Alle Varianten werden aus demselben Partnerbriefing erzeugt. Angebot, Produktfokus, Incentive, Pflichttexte und CTA bleiben konstant. Unterschiedlich sind Layoutlogik, Textlogik und Ansprache.

Die Varianten werden nicht aus Variante A umgeschrieben, sondern parallel aus demselben Input erzeugt. So bleiben die Testvarianten inhaltlich vergleichbar, aber kommunikativ ausreichend unterschiedlich.

## Gemeinsamer Input je Partner

```text
Partner:
{partner_name}

Marke / CI / Tonalität:
{brand_notes}

Zielgruppe:
{target_audience}

Zentrale Botschaft:
{central_message}

Produktfokus:
{product_focus}

USPs:
{usps}

Angebot / Incentive:
{offer_value_amount} {offer_value_type}

Gültigkeit:
{offer_expire_date}

CTA / Ziel-URL:
{partner_url}

QR-Link:
{qr_link}

Pflichttext / Disclaimer:
{offer_disclaimer}

Absender:
{sender_name}, {sender_description}

Einschränkungen / No-Gos:
{restrictions}
```

## Gemeinsame Qualitätsregeln

```text
Bitte beachte:
- Angebot, Produktfokus und Incentive dürfen nicht verändert werden.
- Keine neuen Claims, Produktversprechen oder Rabatte erfinden.
- Keine medizinischen, rechtlichen oder wissenschaftlichen Versprechen ergänzen, wenn sie nicht im Briefing stehen.
- Pflichttexte nicht umformulieren, außer ausdrücklich erlaubt.
- Texte so schreiben, dass sie in einem Print-Mailing funktionieren.
- Keine Meta-Erklärungen ausgeben.
- Ausgabe nur in den definierten Outputfeldern.
```

## Variante A – Klassischer Werbebrief

Ziel: Bewährte Direct-Mail-Mechanik mit klarer Angebotsführung, Nutzenargumentation, CTA, Gutscheinlogik und Response-Elementen.

```text
Erstelle Textbausteine für Variante A: Klassischer Werbebrief.

Kommunikationslogik:
- angebotsorientiert
- aktivierend
- klarer Nutzen
- klassische Direct-Mail-Struktur
- vertrauensbildende Argumente
- CTA gut sichtbar vorbereiten

Nutze den gemeinsamen Partnerinput und gib folgende Felder aus:

a_front_headline:
a_front_intro:
a_front_body_copy:
a_front_offer_line:
a_front_cta:
a_back_headline:
a_back_body_copy:
a_back_trust_module:
a_back_cta:

Textlängen:
- Headline kurz bis mittel
- Body Copy mittel
- CTA klar und handlungsorientiert
```

## Variante B – Visual Storytelling

Ziel: Emotionale Aktivierung über Bildwelt, Geschichte und persönliche Nähe. Das Angebot bleibt konstant, wird aber erzählerischer eingebettet.

```text
Erstelle Textbausteine für Variante B: Visual Storytelling.

Kommunikationslogik:
- emotional
- erzählend
- bildstark
- persönliche Nähe
- Problem – Lösung – Ergebnis
- CTA mit emotionalem Anker

Nutze den gemeinsamen Partnerinput und gib folgende Felder aus:

b_front_headline:
b_front_story_intro:
b_front_emotional_anchor:
b_front_offer_line:
b_front_cta:
b_back_headline:
b_back_story_problem:
b_back_story_solution:
b_back_story_result:
b_back_cta:

Textlängen:
- Headline emotional, aber nicht werblich überladen
- Story in kurzen Abschnitten
- CTA weiterhin eindeutig
```

## Variante C – Snackable Kurzbrief

Ziel: Maximale Reduktion, schnelle Erfassbarkeit, sehr geringe Entscheidungshürde. Die Variante muss in wenigen Sekunden verständlich sein.

```text
Erstelle Textbausteine für Variante C: Snackable Kurzbrief.

Kommunikationslogik:
- extrem klar
- reduziert
- schnell erfassbar
- wenig Text
- starke Angebotsklarheit
- QR-/Gutscheinaktion im Fokus

Nutze den gemeinsamen Partnerinput und gib folgende Felder aus:

c_front_big_headline:
c_front_short_copy:
c_front_offer_badge_text:
c_front_qr_cta:
c_back_headline:
c_back_three_bullets:
c_back_final_cta:

Textlängen:
- Short Copy maximal 3-5 kurze Sätze
- Bullets sehr knapp
- Keine erklärenden Langtexte
```

## Variante D – Editorial-Brief

Ziel: Redaktionelle, glaubwürdige und beratende Aufbereitung. Mehr Informationswert, mehr Vertrauen, hochwertiger Ton.

```text
Erstelle Textbausteine für Variante D: Editorial-Brief.

Kommunikationslogik:
- informativ
- glaubwürdig
- beratend
- redaktionelle Anmutung
- persönliche Empfehlung
- Vertrauen und Warenkorbqualität stärken

Nutze den gemeinsamen Partnerinput und gib folgende Felder aus:

d_front_kicker:
d_front_editorial_headline:
d_front_intro:
d_front_author_line:
d_back_headline:
d_back_section_1_heading:
d_back_section_1_copy:
d_back_section_2_heading:
d_back_section_2_copy:
d_back_fact_box:
d_back_offer_block:
d_back_cta:

Textlängen:
- Headline hochwertig/editorial
- Abschnitte informativ, aber nicht ausufernd
- Fact Box kurz und konkret
```

## Review-Prompt

```text
Prüfe die folgenden Varianten auf Testsauberkeit.

Bitte prüfe:
- Bleiben Angebot, Produktfokus und Incentive in allen Varianten identisch?
- Sind die Varianten kommunikativ klar unterscheidbar?
- Enthalten die Texte keine erfundenen Produktversprechen?
- Sind Pflichtinformationen unverändert?
- Ist Variante C wirklich kurz genug?
- Ist Variante B ausreichend emotional/storytelling-orientiert?
- Ist Variante D ausreichend editorial/informativ?
- Ist Variante A klassisch angebots- und responseorientiert?

Gib nur Auffälligkeiten und konkrete Korrekturvorschläge aus.
```

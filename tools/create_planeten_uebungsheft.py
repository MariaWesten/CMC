from __future__ import annotations

import math
import random
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "planeten-uebungsheft-8-jahre.pdf"

WIDTH, HEIGHT = A4
MARGIN = 17 * mm
RANDOM = random.Random(42)


PALETTE = {
    "navy": colors.HexColor("#17213f"),
    "deep": colors.HexColor("#101830"),
    "ink": colors.HexColor("#24304d"),
    "muted": colors.HexColor("#5d6886"),
    "paper": colors.HexColor("#fffaf0"),
    "blush": colors.HexColor("#fff6e8"),
    "cream": colors.HexColor("#fff3cc"),
    "mint": colors.HexColor("#c9f2dd"),
    "sky": colors.HexColor("#cfe9ff"),
    "rose": colors.HexColor("#ffd5dc"),
    "orange": colors.HexColor("#ffb85c"),
    "yellow": colors.HexColor("#ffe27a"),
    "green": colors.HexColor("#7bd88f"),
    "blue": colors.HexColor("#65b7ff"),
    "purple": colors.HexColor("#a88bef"),
    "red": colors.HexColor("#ff7a66"),
    "line": colors.HexColor("#d6dcef"),
    "gold": colors.HexColor("#f6c85f"),
}


PLANETS = [
    ("Merkur", "#a8a9ad", 7, "kleinster Planet"),
    ("Venus", "#e6b35d", 10, "heißester Planet"),
    ("Erde", "#4f9af0", 10, "unser Zuhause"),
    ("Mars", "#d36b45", 8, "der rote Planet"),
    ("Jupiter", "#d99b63", 18, "größter Planet"),
    ("Saturn", "#e7cb83", 16, "mit tollen Ringen"),
    ("Uranus", "#79d3d8", 13, "liegt auf der Seite"),
    ("Neptun", "#4169d8", 13, "am weitesten weg"),
]


def register_fonts() -> None:
    font_dir = Path("/System/Library/Fonts/Supplemental")
    pdfmetrics.registerFont(TTFont("Kid", str(font_dir / "Verdana.ttf")))
    pdfmetrics.registerFont(TTFont("Kid-Bold", str(font_dir / "Verdana Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Kid-Round", str(font_dir / "Arial Rounded Bold.ttf")))


def text_width(text: str, font: str, size: float) -> float:
    return pdfmetrics.stringWidth(text, font, size)


def wrap_text(text: str, font: str, size: float, max_width: float) -> list[str]:
    lines: list[str] = []
    for paragraph in text.split("\n"):
        words = paragraph.split()
        current = ""
        for word in words:
            trial = f"{current} {word}".strip()
            if text_width(trial, font, size) <= max_width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = word
        if current:
            lines.append(current)
    return lines


def draw_wrapped(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font: str = "Kid",
    size: float = 10,
    leading: float | None = None,
    color=PALETTE["ink"],
) -> float:
    c.setFillColor(color)
    c.setFont(font, size)
    leading = leading or size * 1.35
    for line in wrap_text(text, font, size, max_width):
        c.drawString(x, y, line)
        y -= leading
    return y


def rounded_rect(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, stroke=PALETTE["line"], r: float = 8) -> None:
    c.setFillColor(fill)
    c.setStrokeColor(stroke)
    c.setLineWidth(1)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1)


def shadow_rect(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, stroke=PALETTE["line"], r: float = 8, shadow=True) -> None:
    if shadow:
        c.saveState()
        c.setFillColor(colors.Color(0.10, 0.13, 0.25, alpha=0.10))
        c.roundRect(x + 2.4, y - 2.4, w, h, r, fill=1, stroke=0)
        c.restoreState()
    rounded_rect(c, x, y, w, h, fill, stroke=stroke, r=r)


def pill(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, label: str, size: float = 9) -> None:
    c.setFillColor(fill)
    c.setStrokeColor(colors.white)
    c.roundRect(x, y, w, h, h / 2, fill=1, stroke=0)
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Bold", size)
    c.drawCentredString(x + w / 2, y + h / 2 - size * 0.35, label)


def sticker(c: canvas.Canvas, x: float, y: float, w: float, h: float, fill, label: str, size: float = 8.5) -> None:
    c.saveState()
    c.setFillColor(colors.Color(0.10, 0.13, 0.25, alpha=0.14))
    c.roundRect(x + 1.8, y - 1.8, w, h, 7, fill=1, stroke=0)
    c.setFillColor(fill)
    c.setStrokeColor(colors.white)
    c.setLineWidth(1.4)
    c.roundRect(x, y, w, h, 7, fill=1, stroke=1)
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Bold", size)
    c.drawCentredString(x + w / 2, y + h / 2 - size * 0.35, label)
    c.restoreState()


def stars(c: canvas.Canvas, count: int = 42) -> None:
    c.saveState()
    for _ in range(count):
        x = RANDOM.uniform(8 * mm, WIDTH - 8 * mm)
        y = RANDOM.uniform(13 * mm, HEIGHT - 8 * mm)
        radius = RANDOM.choice([0.7, 0.9, 1.1, 1.4])
        c.setFillColor(colors.Color(1, 1, 1, alpha=RANDOM.uniform(0.35, 0.85)))
        c.circle(x, y, radius, fill=1, stroke=0)
    c.restoreState()


def draw_planet(c: canvas.Canvas, x: float, y: float, r: float, color_hex: str, name: str | None = None, ring: bool = False, label_size: float = 7) -> None:
    base = colors.HexColor(color_hex)
    if ring:
        c.saveState()
        c.translate(x, y)
        c.rotate(-12)
        c.setStrokeColor(colors.HexColor("#caa96b"))
        c.setLineWidth(max(1.2, r * 0.12))
        c.ellipse(-r * 1.7, -r * 0.45, r * 1.7, r * 0.45, fill=0, stroke=1)
        c.restoreState()
    c.setFillColor(base)
    c.setStrokeColor(colors.white)
    c.setLineWidth(1.4)
    c.circle(x, y, r, fill=1, stroke=1)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.28))
    c.circle(x - r * 0.25, y + r * 0.28, r * 0.35, fill=1, stroke=0)
    if name:
        c.setFillColor(PALETTE["ink"])
        c.setFont("Kid-Bold", label_size)
        c.drawCentredString(x, y - r - 10, name)


def draw_tiny_rocket(c: canvas.Canvas, x: float, y: float, scale: float = 1.0) -> None:
    c.saveState()
    c.translate(x, y)
    c.rotate(18)
    c.setFillColor(colors.white)
    c.setStrokeColor(PALETTE["navy"])
    c.setLineWidth(1.1)
    c.roundRect(-5 * scale, -10 * scale, 10 * scale, 20 * scale, 5 * scale, fill=1, stroke=1)
    c.setFillColor(PALETTE["red"])
    p = c.beginPath()
    p.moveTo(-5 * scale, 6 * scale)
    p.lineTo(0, 15 * scale)
    p.lineTo(5 * scale, 6 * scale)
    p.close()
    c.drawPath(p, fill=1, stroke=1)
    c.setFillColor(PALETTE["sky"])
    c.circle(0, 1 * scale, 3 * scale, fill=1, stroke=1)
    c.setFillColor(PALETTE["orange"])
    p = c.beginPath()
    p.moveTo(-3 * scale, -10 * scale)
    p.lineTo(0, -18 * scale)
    p.lineTo(3 * scale, -10 * scale)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.restoreState()


def page_background(c: canvas.Canvas, page_no: int, title: str, subtitle: str = "") -> None:
    c.setFillColor(PALETTE["blush"])
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#fff1cf"))
    c.circle(WIDTH - 15 * mm, 26 * mm, 38 * mm, fill=1, stroke=0)
    c.setFillColor(PALETTE["deep"])
    c.rect(0, HEIGHT - 34 * mm, WIDTH, 34 * mm, fill=1, stroke=0)
    c.setFillColor(PALETTE["navy"])
    c.rect(0, HEIGHT - 38 * mm, WIDTH, 6 * mm, fill=1, stroke=0)
    stars(c, 26)
    c.setFillColor(colors.white)
    c.setFont("Kid-Round", 22)
    c.drawString(MARGIN, HEIGHT - 18 * mm, title)
    if subtitle:
        c.setFont("Kid", 9.5)
        c.drawString(MARGIN, HEIGHT - 25 * mm, subtitle)
    draw_tiny_rocket(c, WIDTH - 22 * mm, HEIGHT - 18 * mm, 0.75)
    c.setFillColor(PALETTE["muted"])
    c.setFont("Kid", 8)
    c.drawRightString(WIDTH - MARGIN, 10 * mm, f"Planeten üben - Seite {page_no}")


def checkbox(c: canvas.Canvas, x: float, y: float, label: str) -> None:
    c.setStrokeColor(PALETTE["muted"])
    c.setLineWidth(1.2)
    c.roundRect(x, y - 2, 9, 9, 2, fill=0, stroke=1)
    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid", 9)
    c.drawString(x + 13, y, label)


def blank_line(c: canvas.Canvas, x: float, y: float, w: float, label: str = "") -> None:
    c.setStrokeColor(PALETTE["muted"])
    c.setLineWidth(0.9)
    c.line(x, y, x + w, y)
    if label:
        c.setFillColor(PALETTE["muted"])
        c.setFont("Kid", 7.5)
        c.drawString(x, y + 4, label)


def draw_fun_facts(c: canvas.Canvas) -> None:
    page_background(c, 1, "Planeten-Forscherheft", "Lernen, rätseln, malen und staunen")
    sticker(c, WIDTH - MARGIN - 48 * mm, HEIGHT - 45 * mm, 48 * mm, 10 * mm, PALETTE["gold"], "Für Weltraumprofis", size=7.8)
    sticker(c, MARGIN, HEIGHT - 45 * mm, 38 * mm, 10 * mm, PALETTE["mint"], "A4 Druckheft", size=8)

    # Cover solar system strip
    strip_y = HEIGHT - 82 * mm
    shadow_rect(c, MARGIN, strip_y, WIDTH - 2 * MARGIN, 35 * mm, colors.white, r=10)
    sun_x, sun_y = MARGIN + 17 * mm, strip_y + 18 * mm
    c.setFillColor(PALETTE["yellow"])
    c.circle(sun_x, sun_y, 16 * mm, fill=1, stroke=0)
    c.setFillColor(PALETTE["orange"])
    c.circle(sun_x - 5 * mm, sun_y + 4 * mm, 5 * mm, fill=1, stroke=0)
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Bold", 10)
    c.drawCentredString(sun_x, sun_y - 22 * mm, "Sonne")

    x = MARGIN + 47 * mm
    for name, hex_color, size, _ in PLANETS:
        draw_planet(c, x, sun_y, size * 0.9, hex_color, name, ring=(name == "Saturn"), label_size=6.4)
        x += 18 * mm if name not in ("Jupiter", "Saturn") else 22 * mm

    y = HEIGHT - 99 * mm
    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Round", 18)
    c.drawString(MARGIN, y, "Fun Facts für kluge Weltraumköpfe")

    cards = [
        ("Größter Planet", "Jupiter ist so riesig, dass mehr als 1.300 Erden in ihn hineinpassen würden.", PALETTE["sky"]),
        ("Kleinster Planet", "Merkur ist der kleinste Planet und flitzt am nächsten an der Sonne entlang.", PALETTE["mint"]),
        ("Heißester Planet", "Venus ist heißer als Merkur, weil ihre dichte Luft die Wärme festhält.", PALETTE["rose"]),
        ("Kältester Rekord", "Uranus hat die kälteste gemessene Temperatur unter den Planeten.", colors.HexColor("#d9f7f7")),
        ("Weitester Planet", "Neptun ist der Planet, der am weitesten von der Sonne entfernt ist.", colors.HexColor("#d7ddff")),
        ("Unser Zuhause", "Die Erde ist der einzige Planet, von dem wir sicher wissen, dass dort Leben ist.", colors.HexColor("#d9f4cf")),
    ]
    card_w = (WIDTH - 2 * MARGIN - 8 * mm) / 2
    card_h = 28 * mm
    start_y = y - 8 * mm
    for i, (headline, body, fill) in enumerate(cards):
        col = i % 2
        row = i // 2
        x0 = MARGIN + col * (card_w + 8 * mm)
        y0 = start_y - row * (card_h + 7 * mm) - card_h
        shadow_rect(c, x0, y0, card_w, card_h, fill)
        c.setFillColor(PALETTE["navy"])
        c.setFont("Kid-Bold", 10.5)
        c.drawString(x0 + 7 * mm, y0 + card_h - 10 * mm, headline)
        draw_wrapped(c, body, x0 + 7 * mm, y0 + card_h - 17 * mm, card_w - 14 * mm, size=8.6, leading=10.5)

    memo_y = 30 * mm
    shadow_rect(c, MARGIN, memo_y, WIDTH - 2 * MARGIN, 27 * mm, PALETTE["cream"], stroke=colors.HexColor("#f1cf74"))
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Bold", 12)
    c.drawString(MARGIN + 7 * mm, memo_y + 18 * mm, "Merksatz für die Reihenfolge")
    draw_wrapped(
        c,
        "Mein Vater erklärt mir jeden Sonntag unseren Nachthimmel. "
        "Die Anfangsbuchstaben helfen: Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun.",
        MARGIN + 7 * mm,
        memo_y + 11 * mm,
        WIDTH - 2 * MARGIN - 14 * mm,
        size=9.2,
        leading=11.2,
    )


def draw_planet_families_page(c: canvas.Canvas) -> None:
    page_background(c, 2, "Planeten-Familien", "Warum manche Planeten Gas- oder Eisriesen heißen")

    intro_y = HEIGHT - 50 * mm
    shadow_rect(c, MARGIN, intro_y - 31 * mm, WIDTH - 2 * MARGIN, 31 * mm, colors.white, r=10)
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Round", 16)
    c.drawString(MARGIN + 7 * mm, intro_y - 10 * mm, "Ganz einfach gemerkt")
    draw_wrapped(
        c,
        "Die vier inneren Planeten sind eher feste Gesteinsplaneten. Danach kommen vier riesige äußere Planeten. "
        "Jupiter und Saturn sind Gasriesen. Uranus und Neptun nennt man Eisriesen. Viele Kinderbücher sagen zu allen vier kurz: Gasplaneten.",
        MARGIN + 7 * mm,
        intro_y - 18 * mm,
        WIDTH - 2 * MARGIN - 14 * mm,
        size=8.9,
        leading=11.2,
    )

    left_x = MARGIN
    right_x = WIDTH / 2 + 4 * mm
    card_y = HEIGHT - 173 * mm
    card_w = (WIDTH - 2 * MARGIN - 8 * mm) / 2
    card_h = 78 * mm
    shadow_rect(c, left_x, card_y, card_w, card_h, PALETTE["mint"], r=10)
    shadow_rect(c, right_x, card_y, card_w, card_h, PALETTE["sky"], r=10)

    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Round", 15)
    c.drawString(left_x + 7 * mm, card_y + card_h - 12 * mm, "Feste Nachbarn")
    c.setFont("Kid-Bold", 9)
    c.drawString(left_x + 7 * mm, card_y + card_h - 22 * mm, "Merkur, Venus, Erde, Mars")
    draw_wrapped(
        c,
        "Sie sind kleiner, haben eine feste Oberfläche und liegen näher an der Sonne.",
        left_x + 7 * mm,
        card_y + card_h - 33 * mm,
        card_w - 14 * mm,
        size=8.8,
        leading=11,
    )
    px = left_x + 16 * mm
    for name, hex_color, size, _ in PLANETS[:4]:
        draw_planet(c, px, card_y + 17 * mm, size * 0.82, hex_color, name, label_size=6.2)
        px += 20 * mm

    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Round", 15)
    c.drawString(right_x + 7 * mm, card_y + card_h - 12 * mm, "Riesen weit draußen")
    c.setFont("Kid-Bold", 9)
    c.drawString(right_x + 7 * mm, card_y + card_h - 22 * mm, "Jupiter, Saturn, Uranus, Neptun")
    draw_wrapped(
        c,
        "Sie sind viel größer. Außen bestehen sie nicht aus festem Boden wie die Erde.",
        right_x + 7 * mm,
        card_y + card_h - 33 * mm,
        card_w - 14 * mm,
        size=8.8,
        leading=11,
    )
    px = right_x + 15 * mm
    for name, hex_color, size, _ in PLANETS[4:]:
        draw_planet(c, px, card_y + 17 * mm, size * 0.82, hex_color, name, ring=(name == "Saturn"), label_size=6.2)
        px += 20 * mm

    fact_y = 54 * mm
    shadow_rect(c, MARGIN, fact_y, WIDTH - 2 * MARGIN, 45 * mm, PALETTE["cream"], stroke=colors.HexColor("#efc85d"), r=10)
    sticker(c, MARGIN + 7 * mm, fact_y + 29 * mm, 32 * mm, 9 * mm, PALETTE["orange"], "Merke!", size=8)
    draw_wrapped(
        c,
        "Für dieses Heft gilt: Wenn nach den Gasplaneten gefragt wird, sind die vier großen äußeren Planeten gemeint: "
        "Jupiter, Saturn, Uranus und Neptun. Extra klug: Uranus und Neptun heißen genauer Eisriesen.",
        MARGIN + 7 * mm,
        fact_y + 22 * mm,
        WIDTH - 2 * MARGIN - 14 * mm,
        font="Kid-Bold",
        size=9.4,
        leading=12.2,
    )

    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Bold", 11)
    c.drawString(MARGIN, 31 * mm, "Mini-Aufgabe: Male um die vier Riesen einen Ring oder Wirbel.")


def draw_order_page(c: canvas.Canvas) -> None:
    page_background(c, 3, "1. Planeten-Reise", "Bringe die Planeten in die richtige Reihenfolge")

    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Bold", 12)
    c.drawString(MARGIN, HEIGHT - 45 * mm, "Aufgabe A: Schreibe die Namen an die Stationen.")
    draw_wrapped(
        c,
        "Starte bei der Sonne. Die Umlaufbahnen werden nach außen immer größer. "
        "Tipp: Nutze den Merksatz von Seite 1.",
        MARGIN,
        HEIGHT - 52 * mm,
        WIDTH - 2 * MARGIN,
        size=9.3,
    )

    center_x, center_y = WIDTH / 2, HEIGHT - 125 * mm
    c.setFillColor(PALETTE["yellow"])
    c.circle(MARGIN + 13 * mm, center_y + 18 * mm, 13 * mm, fill=1, stroke=0)
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Bold", 9)
    c.drawCentredString(MARGIN + 13 * mm, center_y, "Sonne")

    station_positions = []
    for i in range(8):
        x = MARGIN + 42 * mm + i * 16.8 * mm
        y = center_y + math.sin(i * 0.9) * 18 * mm
        station_positions.append((x, y))
        c.setStrokeColor(PALETTE["line"])
        c.setLineWidth(1.3)
        c.circle(x, y, 9 * mm, fill=0, stroke=1)
        c.setFillColor(PALETTE["muted"])
        c.setFont("Kid-Bold", 10)
        c.drawCentredString(x, y - 3, str(i + 1))
        blank_line(c, x - 12 * mm, y - 16 * mm, 24 * mm)
    c.setStrokeColor(colors.HexColor("#f1cf74"))
    c.setLineWidth(2)
    pts = [(MARGIN + 25 * mm, center_y + 18 * mm)] + station_positions
    for a, b in zip(pts, pts[1:]):
        c.line(a[0], a[1], b[0], b[1])

    bank_y = 66 * mm
    shadow_rect(c, MARGIN, bank_y, WIDTH - 2 * MARGIN, 32 * mm, PALETTE["sky"])
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Bold", 10.5)
    c.drawString(MARGIN + 6 * mm, bank_y + 23 * mm, "Wortbank")
    names = [p[0] for p in PLANETS]
    for i, name in enumerate(names):
        row = i // 4
        col = i % 4
        x = MARGIN + 6 * mm + col * 41 * mm
        y = bank_y + 13 * mm - row * 10 * mm
        pill(c, x, y, 31 * mm, 8 * mm, colors.white, name, size=8.1)

    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Bold", 12)
    c.drawString(MARGIN, 48 * mm, "Aufgabe B: Bonus")
    draw_wrapped(c, "Male um jeden Gasplaneten einen kleinen Wirbel. Welche vier großen äußeren Planeten sind gemeint?", MARGIN, 41 * mm, WIDTH - 2 * MARGIN, size=9.3)
    for idx, label in enumerate(["Jupiter", "Saturn", "Uranus", "Neptun"]):
        checkbox(c, MARGIN + idx * 42 * mm, 27 * mm, label)


def draw_profile_page(c: canvas.Canvas) -> None:
    page_background(c, 4, "2. Planeten-Steckbrief", "Wähle einen Planeten und werde Expertin")

    x0, y0 = MARGIN, 35 * mm
    w, h = WIDTH - 2 * MARGIN, HEIGHT - 77 * mm
    shadow_rect(c, x0, y0, w, h, colors.white, r=10)

    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Round", 18)
    c.drawString(x0 + 8 * mm, y0 + h - 15 * mm, "Mein Planet heißt:")
    blank_line(c, x0 + 63 * mm, y0 + h - 13 * mm, 78 * mm)

    left = x0 + 8 * mm
    right = x0 + w / 2 + 5 * mm
    top = y0 + h - 34 * mm
    labels = [
        ("Farbe:", left, top),
        ("Größe: klein / mittel / riesig:", left, top - 18 * mm),
        ("Besonderheit:", left, top - 36 * mm),
        ("So merke ich ihn mir:", left, top - 54 * mm),
        ("Ein Planetenjahr dauert:", right, top),
        ("Eine Frage, die ich habe:", right, top - 18 * mm),
        ("Mein liebster Fun Fact:", right, top - 36 * mm),
    ]
    for label, x, y in labels:
        c.setFillColor(PALETTE["muted"])
        c.setFont("Kid-Bold", 8.6)
        c.drawString(x, y + 4, label)
        blank_line(c, x, y - 2, 70 * mm)

    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Bold", 11)
    c.drawString(left, y0 + 47 * mm, "Kreuze an:")
    checkbox(c, left, y0 + 37 * mm, "Gesteinsplanet")
    checkbox(c, left + 48 * mm, y0 + 37 * mm, "Gas- oder Eisriese")
    checkbox(c, left, y0 + 26 * mm, "hat Ringe")
    checkbox(c, left + 48 * mm, y0 + 26 * mm, "hat Monde")

    c.setStrokeColor(PALETTE["line"])
    c.setLineWidth(1.3)
    c.roundRect(right, y0 + 15 * mm, 68 * mm, 55 * mm, 8, fill=0, stroke=1)
    c.setFillColor(PALETTE["muted"])
    c.setFont("Kid-Bold", 9)
    c.drawCentredString(right + 34 * mm, y0 + 62 * mm, "Zeichne deinen Planeten")
    for i in range(4):
        c.setStrokeColor(colors.HexColor("#eef1fa"))
        c.line(right + 5 * mm, y0 + 25 * mm + i * 8 * mm, right + 63 * mm, y0 + 25 * mm + i * 8 * mm)

    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Bold", 12)
    c.drawString(MARGIN, 24 * mm, "Forscherfrage: Warum sieht dein Planet wohl genau so aus?")


def draw_riddle_page(c: canvas.Canvas) -> None:
    page_background(c, 5, "3. Welcher Planet bin ich?", "Lies genau und trage den Namen ein")

    riddles = [
        ("Ich bin der kleinste Planet und der Sonne am nächsten.", "Merkur", PALETTE["mint"]),
        ("Ich bin sehr heiß und von dicken Wolken eingepackt.", "Venus", PALETTE["rose"]),
        ("Auf mir gibt es Ozeane, Wolken und dich.", "Erde", PALETTE["sky"]),
        ("Ich bin rot, staubig und habe den höchsten Vulkan.", "Mars", colors.HexColor("#ffd8c8")),
        ("Ich bin der größte Planet und habe einen großen roten Fleck.", "Jupiter", PALETTE["cream"]),
        ("Meine Ringe sehen aus wie ein Hula-Hoop-Reifen aus Eis und Stein.", "Saturn", colors.HexColor("#f8e7ad")),
        ("Ich rolle fast auf der Seite um die Sonne.", "Uranus", colors.HexColor("#daf7f4")),
        ("Ich bin tiefblau und am weitesten von der Sonne entfernt.", "Neptun", colors.HexColor("#d7ddff")),
    ]
    card_w = (WIDTH - 2 * MARGIN - 7 * mm) / 2
    card_h = 37 * mm
    start_y = HEIGHT - 50 * mm
    for i, (question, answer, fill) in enumerate(riddles):
        col = i % 2
        row = i // 2
        x = MARGIN + col * (card_w + 7 * mm)
        y = start_y - row * (card_h + 6 * mm) - card_h
        shadow_rect(c, x, y, card_w, card_h, fill)
        pill(c, x + 6 * mm, y + card_h - 11 * mm, 18 * mm, 7 * mm, colors.white, f"{i + 1}", size=7)
        draw_wrapped(c, question, x + 7 * mm, y + card_h - 18 * mm, card_w - 14 * mm, size=8.8, leading=10.5)
        blank_line(c, x + 7 * mm, y + 8 * mm, card_w - 14 * mm)
        c.setFillColor(PALETTE["muted"])
        c.setFont("Kid", 6.8)
        c.drawRightString(x + card_w - 7 * mm, y + 3.5 * mm, f"Lösung: {answer}")

    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Bold", 11)
    c.drawString(MARGIN, 24 * mm, "Extra-Spaß: Male neben jedes Rätsel ein kleines Symbol für den Planeten.")


def make_word_search() -> list[list[str]]:
    words = ["MERKUR", "VENUS", "ERDE", "MARS", "JUPITER", "SATURN", "URANUS", "NEPTUN", "SONNE", "MOND", "RINGE", "RAKETE"]
    size = 13
    grid = [["" for _ in range(size)] for _ in range(size)]
    placements = [
        ("MERKUR", 0, 0, 1, 0),
        ("VENUS", 2, 2, 1, 1),
        ("ERDE", 8, 0, 0, 1),
        ("MARS", 0, 6, 1, 0),
        ("JUPITER", 5, 12, 1, 0),
        ("SATURN", 12, 1, 0, 1),
        ("URANUS", 1, 11, 1, 0),
        ("NEPTUN", 6, 6, 1, -1),
        ("SONNE", 0, 12, 1, -1),
        ("MOND", 9, 8, 0, 1),
        ("RINGE", 3, 4, 1, 0),
        ("RAKETE", 7, 3, 1, 1),
    ]
    for word, x, y, dx, dy in placements:
        for idx, letter in enumerate(word):
            grid[y + dy * idx][x + dx * idx] = letter
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for y in range(size):
        for x in range(size):
            if not grid[y][x]:
                grid[y][x] = alphabet[(x * 7 + y * 5 + 3) % len(alphabet)]
    return grid


def draw_wordsearch_page(c: canvas.Canvas) -> None:
    page_background(c, 6, "4. Weltraum-Suchsel", "Finde die versteckten Wörter")
    words = ["MERKUR", "VENUS", "ERDE", "MARS", "JUPITER", "SATURN", "URANUS", "NEPTUN", "SONNE", "MOND", "RINGE", "RAKETE"]
    grid = make_word_search()
    cell = 10.7 * mm
    grid_x = MARGIN
    grid_y = HEIGHT - 64 * mm - len(grid) * cell
    shadow_rect(c, grid_x - 4 * mm, grid_y - 4 * mm, cell * len(grid) + 8 * mm, cell * len(grid) + 8 * mm, colors.white)
    c.setFont("Kid-Bold", 13)
    for row, letters in enumerate(grid):
        for col, letter in enumerate(letters):
            x = grid_x + col * cell
            y = grid_y + (len(grid) - 1 - row) * cell
            c.setFillColor(colors.HexColor("#f3f6ff") if (row + col) % 2 == 0 else colors.white)
            c.rect(x, y, cell, cell, fill=1, stroke=0)
            c.setStrokeColor(PALETTE["line"])
            c.rect(x, y, cell, cell, fill=0, stroke=1)
            c.setFillColor(PALETTE["navy"])
            c.drawCentredString(x + cell / 2, y + cell / 2 - 4.2, letter)

    right_x = grid_x + cell * len(grid) + 15 * mm
    c.setFillColor(PALETTE["ink"])
    c.setFont("Kid-Round", 16)
    c.drawString(right_x, HEIGHT - 55 * mm, "Wörter")
    for i, word in enumerate(words):
        yy = HEIGHT - 69 * mm - i * 10.5 * mm
        checkbox(c, right_x, yy, word.title())

    quiz_y = 28 * mm
    shadow_rect(c, MARGIN, quiz_y, WIDTH - 2 * MARGIN, 32 * mm, PALETTE["mint"])
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Bold", 11)
    c.drawString(MARGIN + 6 * mm, quiz_y + 22 * mm, "Mini-Quiz")
    qx = MARGIN + 6 * mm
    blank_line(c, qx + 67 * mm, quiz_y + 17 * mm, 62 * mm, "1. Der größte Planet heißt")
    blank_line(c, qx + 67 * mm, quiz_y + 8 * mm, 62 * mm, "2. Der rote Planet heißt")


def draw_answer_certificate_page(c: canvas.Canvas) -> None:
    page_background(c, 7, "5. Lösungen & Urkunde", "Zum Nachschauen und Feiern")

    shadow_rect(c, MARGIN, HEIGHT - 112 * mm, WIDTH - 2 * MARGIN, 61 * mm, colors.white)
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Round", 17)
    c.drawString(MARGIN + 8 * mm, HEIGHT - 66 * mm, "Lösungen")
    draw_wrapped(
        c,
        "Reihenfolge: Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun.\n"
        "Gas- und Eisriesen: Jupiter, Saturn, Uranus, Neptun.\n"
        "Rätsel: 1 Merkur, 2 Venus, 3 Erde, 4 Mars, 5 Jupiter, 6 Saturn, 7 Uranus, 8 Neptun.\n"
        "Mini-Quiz: 1 Jupiter, 2 Mars.",
        MARGIN + 8 * mm,
        HEIGHT - 78 * mm,
        WIDTH - 2 * MARGIN - 16 * mm,
        size=9.2,
        leading=12,
    )

    cert_x, cert_y = MARGIN, 34 * mm
    cert_w, cert_h = WIDTH - 2 * MARGIN, 116 * mm
    shadow_rect(c, cert_x, cert_y, cert_w, cert_h, PALETTE["cream"], stroke=colors.HexColor("#efc85d"), r=10)
    for x, y, r, col, name in [
        (cert_x + 17 * mm, cert_y + cert_h - 18 * mm, 8 * mm, "#4f9af0", None),
        (cert_x + cert_w - 18 * mm, cert_y + cert_h - 20 * mm, 10 * mm, "#e7cb83", None),
        (cert_x + 18 * mm, cert_y + 36 * mm, 6 * mm, "#d36b45", None),
        (cert_x + cert_w - 24 * mm, cert_y + 42 * mm, 7 * mm, "#4169d8", None),
    ]:
        draw_planet(c, x, y, r, col, name, ring=(col == "#e7cb83"))
    c.setFillColor(PALETTE["navy"])
    c.setFont("Kid-Round", 25)
    c.drawCentredString(WIDTH / 2, cert_y + cert_h - 30 * mm, "Weltraum-Urkunde")
    c.setFont("Kid-Bold", 13)
    c.drawCentredString(WIDTH / 2, cert_y + cert_h - 46 * mm, "für")
    blank_line(c, cert_x + 43 * mm, cert_y + cert_h - 62 * mm, cert_w - 86 * mm)
    draw_wrapped(
        c,
        "Du hast Planeten sortiert, Rätsel gelöst und echte Weltraum-Fakten gesammelt. "
        "Damit bist du jetzt eine geprüfte Planeten-Forscherin!",
        cert_x + 27 * mm,
        cert_y + 47 * mm,
        cert_w - 54 * mm,
        font="Kid-Bold",
        size=11,
        leading=15,
        color=PALETTE["ink"],
    )
    blank_line(c, cert_x + 18 * mm, cert_y + 18 * mm, 49 * mm, "Datum")
    blank_line(c, cert_x + cert_w - 67 * mm, cert_y + 18 * mm, 49 * mm, "Unterschrift")


def build_pdf() -> None:
    register_fonts()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Planeten üben - Übungsheft für Kinder")
    c.setAuthor("Codex")
    draw_fun_facts(c)
    c.showPage()
    draw_planet_families_page(c)
    c.showPage()
    draw_order_page(c)
    c.showPage()
    draw_profile_page(c)
    c.showPage()
    draw_riddle_page(c)
    c.showPage()
    draw_wordsearch_page(c)
    c.showPage()
    draw_answer_certificate_page(c)
    c.save()


if __name__ == "__main__":
    build_pdf()
    print(OUT)

"""Regenerate committed branding assets; optional dependency: Pillow==11.3.0."""

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SITE = json.loads((ROOT / "src/info/site.json").read_text())
PUBLIC = ROOT / "public"


def font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default(size=size)


def gradient(width, height):
    image = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(image)
    start, end = (0, 255, 164), (166, 104, 255)
    for x in range(width):
        t = x / max(width - 1, 1)
        color = tuple(round(a + (b - a) * t) for a, b in zip(start, end))
        draw.line((x, 0, x, height), fill=color)
    return image


def monogram(size):
    scale = 4
    edge = size * scale
    canvas = gradient(edge, edge).convert("RGBA")
    mask = Image.new("L", (edge, edge))
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, edge - 1, edge - 1), radius=edge * 0.22, fill=255)
    canvas.putalpha(mask)
    draw = ImageDraw.Draw(canvas)
    inset = edge * 0.047
    draw.rounded_rectangle((inset, inset, edge - inset, edge - inset), radius=edge * 0.17, fill="#1f1f1f")
    draw.text((edge / 2, edge / 2), "MT", font=font(round(edge * 0.45), True), fill="white", anchor="mm")
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


card = Image.new("RGB", (1200, 630), "#f8f8f8")
draw = ImageDraw.Draw(card)
card.paste(gradient(220, 7), (80, 64))
draw.text((80, 112), SITE["name"], font=font(72, True), fill="#1f1f1f")
draw.text((84, 204), SITE["jobTitle"] + " · " + SITE["affiliation"]["name"], font=font(27), fill="#4a4a4a")
for y, line in zip((292, 363), SITE["socialHeadline"]):
    draw.text((80, y), line, font=font(62, True), fill="#1f1f1f")
draw.text((84, 480), SITE["socialDomains"], font=font(28), fill="#4a4a4a")
draw.text((84, 558), SITE["url"].removeprefix("https://").rstrip("/"), font=font(23), fill="#555555")
badge = monogram(128)
card.paste(badge, (992, 112), badge)
card.save(PUBLIC / "social-card.png", optimize=True)
monogram(32).save(PUBLIC / "favicon-32.png", optimize=True)
monogram(180).save(PUBLIC / "apple-touch-icon.png", optimize=True)
print("Generated social-card.png (1200×630), favicon-32.png and apple-touch-icon.png.")

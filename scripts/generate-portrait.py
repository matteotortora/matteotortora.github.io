"""Regenerate the responsive portrait with Pillow 11.3.0 (WebP support)."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
source = ImageOps.exif_transpose(Image.open(root / "src/img/self.png"))
destination = root / "src/img/portrait"
destination.mkdir(exist_ok=True)

for width in (320, 640, 960):
    height = round(source.height * width / source.width)
    image = source.resize((width, height), Image.Resampling.LANCZOS)
    target = destination / f"matteo-tortora-{width}.webp"
    image.save(target, format="WEBP", quality=86, method=6)
    print(f"{target.name}: {width}x{height}, {target.stat().st_size} bytes")

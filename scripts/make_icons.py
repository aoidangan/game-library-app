"""앱 아이콘(주사위)을 public/icons/에 만들어요. 다시 만들 때: python scripts/make_icons.py"""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"
BLUE = (79, 107, 237)
WHITE = (255, 255, 255)


def dice(size: int, maskable: bool) -> Image.Image:
    img = Image.new("RGB", (size, size), BLUE)
    d = ImageDraw.Draw(img)
    # maskable 아이콘은 가장자리가 잘릴 수 있어서 주사위를 더 작게 그려요.
    box = size * (0.56 if maskable else 0.68)
    x0 = (size - box) / 2
    d.rounded_rectangle([x0, x0, x0 + box, x0 + box], radius=box * 0.18, fill=WHITE)
    r = box * 0.085
    for fx, fy in [(0.27, 0.27), (0.73, 0.27), (0.5, 0.5), (0.27, 0.73), (0.73, 0.73)]:
        cx, cy = x0 + box * fx, x0 + box * fy
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BLUE)
    return img


OUT.mkdir(parents=True, exist_ok=True)
dice(192, False).save(OUT / "icon-192.png")
dice(512, False).save(OUT / "icon-512.png")
dice(512, True).save(OUT / "icon-512-maskable.png")
dice(180, False).save(OUT / "apple-touch-icon.png")
print("아이콘 4개 저장:", OUT)

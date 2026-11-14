"""Animate the portfolio's original laptop illustration."""
from math import cos, pi, sin
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
base = Image.open(root / "assets" / "studio-base.png").convert("RGBA")
frames = []
for index in range(18):
    phase = index * 2 * pi / 18
    frame = base.copy()
    layer = Image.new("RGBA", frame.size)
    pen = ImageDraw.Draw(layer)
    # A gently pulsing heart on the laptop display.
    scale = 1 + .08 * sin(phase)
    cx, cy = 233, 146
    pts = [(cx + (x - cx) * scale, cy + (y - cy) * scale)
           for x, y in [(233, 172), (201, 143), (202, 132), (212, 126),
                        (224, 130), (233, 137), (242, 130), (254, 126),
                        (265, 132), (265, 143)]]
    pen.polygon(pts, fill=(245, 171, 205, 255), outline=(157, 88, 119, 255), width=3)
    # Twinkles, bow and cup steam drift on their own short loops.
    for cx, cy, offset, radius in [(387, 102, 0, 12), (366, 150, 2, 7),
                                    (280, 58, 5, 5), (73, 143, 7, 4)]:
        pulse = max(2, radius + int(3 * sin(phase + offset)))
        points = []
        for arm in range(8):
            angle = -pi / 2 + arm * pi / 4
            reach = pulse if arm % 2 == 0 else pulse * .25
            points.append((cx + cos(angle) * reach, cy + sin(angle) * reach))
        pen.polygon(points, fill=(255, 239, 182, 230))
    drift = int(3 * sin(phase))
    pen.arc((71, 173 + drift, 92, 192 + drift), 160, 330, fill=(181, 115, 149, 190), width=2)
    pen.arc((87, 164 - drift, 105, 186 - drift), 160, 330, fill=(181, 115, 149, 170), width=2)
    frame.alpha_composite(layer)
    frames.append(frame.convert("RGB"))
destination = root / "assets" / "studio-loop.gif"
frames[0].save(destination, save_all=True, append_images=frames[1:], duration=110, loop=0, optimize=True)
print(destination, destination.stat().st_size, "bytes")
(root / "assets" / "studio-base.png").unlink()

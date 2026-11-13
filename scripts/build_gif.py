"""Draw a tiny looping pastel sticker GIF for the portfolio."""

from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw


def star(draw, cx, cy, radius, fill, glow=False):
    points = []
    for step in range(8):
        angle = -pi / 2 + step * pi / 4
        reach = radius if step % 2 == 0 else radius * 0.28
        points.append((cx + cos(angle) * reach, cy + sin(angle) * reach))
    if glow:
        draw.ellipse((cx-radius-5,cy-radius-5,cx+radius+5,cy+radius+5), fill="#f9e9f2")
    draw.polygon(points, fill=fill)


frames = []
for index in range(24):
    phase = index / 24 * 2 * pi
    image = Image.new("RGB", (208, 108), "#fffbfd")
    pen = ImageDraw.Draw(image)
    pen.rounded_rectangle((3, 3, 205, 105), radius=25, fill="#fff3fa", outline="#edc9da", width=2)
    pen.ellipse((13, 8, 195, 100), fill="#fff8fc")
    lift = int(3 * sin(phase))
    # A soft looping heart and a handful of twinkling stars.
    pen.polygon([(80, 80+lift), (52, 56+lift), (55, 37+lift), (68, 31+lift),
                 (80, 39+lift), (92, 31+lift), (105, 37+lift), (108, 56+lift)],
                fill="#f6c4d9", outline="#b9799b", width=2)
    pen.ellipse((55, 29+lift, 82, 58+lift), fill="#f6c4d9")
    pen.ellipse((79, 29+lift, 106, 58+lift), fill="#f6c4d9")
    pen.line([(54, 47+lift), (80, 80+lift), (107, 47+lift)], fill="#b9799b", width=2)
    star(pen, 139, 47, 14 + int(3 * sin(phase)), "#d8bdf1", glow=True)
    star(pen, 166, 70, 7 + int(2 * cos(phase)), "#f3d595")
    star(pen, 38, 72, 6 + int(2 * sin(phase + 1)), "#d7e8fc")
    frames.append(image)

destination = Path(__file__).resolve().parents[1] / "assets" / "sparkle-loop.gif"
frames[0].save(destination, save_all=True, append_images=frames[1:],
               duration=90, loop=0, optimize=True)
print(destination, destination.stat().st_size, "bytes")

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = Path(r"C:\Users\aleyya\.zcode\cli\image-cache\sess_0e0051f8-8e9f-4eb7-b098-6393a4514757\image-5946c33351c9e50570593136d53c5db1.png")
OUT = Path(r"C:\Users\aleyya\Downloads\pawfox\assets\logo")
OUT.mkdir(parents=True, exist_ok=True)
STROKE = (71, 36, 30, 255)

img = Image.open(SRC).convert("RGBA")
w, h = img.size
print("original:", img.size, img.mode)
img.save(OUT / "pawfox-logo-original.png")

arr = np.asarray(img).copy()
rgb = arr[..., :3].astype(int)
nonwhite = np.abs(rgb - 255).sum(axis=2) > 24

# Stray-artifact scan on a quarter-scale mask; only blobs that are tiny AND
# far from the main artwork are candidates, design details stay untouched.
scale = 4
sw, sh = w // scale, h // scale
small = np.asarray(
    Image.fromarray(nonwhite.astype(np.uint8) * 255).resize((sw, sh), Image.LANCZOS)
) > 40

visited = np.zeros_like(small, bool)
components = []
for sy in range(sh):
    for sx in range(sw):
        if small[sy, sx] and not visited[sy, sx]:
            queue = deque([(sy, sx)])
            visited[sy, sx] = True
            cells = []
            while queue:
                cy, cx = queue.popleft()
                cells.append((cy, cx))
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = cy + dy, cx + dx
                    if 0 <= ny < sh and 0 <= nx < sw and small[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))
            components.append(cells)

components.sort(key=len, reverse=True)
main_cells = components[0]
print("components:", len(components), "| main size:", len(main_cells))

dist = np.full((sh, sw), 10**6, int)
queue = deque()
for cy, cx in main_cells:
    dist[cy, cx] = 0
    queue.append((cy, cx))
while queue:
    cy, cx = queue.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = cy + dy, cx + dx
        if 0 <= ny < sh and 0 <= nx < sw and dist[ny, nx] > dist[cy, cx] + 1:
            dist[ny, nx] = dist[cy, cx] + 1
            queue.append((ny, nx))

for cells in components[1:]:
    ys = [c[0] for c in cells]
    xs = [c[1] for c in cells]
    y0, y1 = min(ys) * scale, min(max(ys) * scale + scale, h)
    x0, x1 = min(xs) * scale, min(max(xs) * scale + scale, w)
    fullres_area = int(nonwhite[y0:y1, x0:x1].sum())
    min_dist = min(dist[c] for c in cells)
    print(f"  small component: cells={len(cells)} fullres_px={fullres_area} dist_to_main={min_dist}")
    if len(cells) < 80 and fullres_area < 2500 and min_dist > 10:
        arr[y0:y1, x0:x1][nonwhite[y0:y1, x0:x1]] = (255, 255, 255, 255)
        print(f"  -> stray removed at bbox x={x0}-{x1} y={y0}-{y1}")

quantized = Image.fromarray(arr[..., :3].astype(np.uint8)).quantize(colors=10)
palette = quantized.getpalette()
print("dominant colors:")
for count, idx in sorted(quantized.getcolors(), reverse=True)[:10]:
    r, g, b = palette[idx * 3:idx * 3 + 3]
    print(f"  #{r:02X}{g:02X}{b:02X}  {count}")


def erode(mask, steps):
    out = mask.copy()
    for _ in range(steps):
        n = out.copy()
        n[1:, :] &= out[:-1, :]
        n[:-1, :] &= out[1:, :]
        n[:, 1:] &= out[:, :-1]
        n[:, :-1] &= out[:, 1:]
        out = n
    return out


def dilate(mask, steps):
    out = mask.copy()
    for _ in range(steps):
        n = out.copy()
        n[1:, :] |= out[:-1, :]
        n[:-1, :] |= out[1:, :]
        n[:, 1:] |= out[:, :-1]
        n[:, :-1] |= out[:, 1:]
        out = n
    return out


def label(mask):
    labels = np.zeros(mask.shape, np.int32)
    current = 0
    for sy, sx in map(tuple, np.argwhere(mask)):
        if labels[sy, sx]:
            continue
        current += 1
        queue = deque([(sy, sx)])
        labels[sy, sx] = current
        while queue:
            cy, cx = queue.popleft()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = cy + dy, cx + dx
                if 0 <= ny < mask.shape[0] and 0 <= nx < mask.shape[1] and mask[ny, nx] and not labels[ny, nx]:
                    labels[ny, nx] = current
                    queue.append((ny, nx))
    return labels


def bfs_distance(seeds, blocked=None):
    dist = np.full(seeds.shape, 10**6, np.int32)
    queue = deque()
    for sy, sx in map(tuple, np.argwhere(seeds)):
        dist[sy, sx] = 0
        queue.append((sy, sx))
    hh, hw = seeds.shape
    while queue:
        cy, cx = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = cy + dy, cx + dx
            if 0 <= ny < hh and 0 <= nx < hw and dist[ny, nx] > dist[cy, cx] + 1:
                if blocked is not None and blocked[ny, nx]:
                    continue
                dist[ny, nx] = dist[cy, cx] + 1
                queue.append((ny, nx))
    return dist


# The circle stroke is not drawn behind the paws and the tail, so exterior and
# interior white connect through wide gaps. Find those gaps by eroding deeply,
# then dam each gap along the midline between the outer white and the kept
# inner whites, drawing it in stroke color so the circle reads as continuous.
s = 2
hw, hh = w // s, h // s
white = np.abs(arr[..., :3].astype(int) - 255).sum(axis=2) < 45
white_small = np.asarray(
    Image.fromarray(white.astype(np.uint8) * 255).resize((hw, hh), Image.LANCZOS)
) > 127

K = 20
eroded = erode(white_small, K)
labels = label(eroded)
border_ids = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])).tolist()) - {0}
seed_point = None
for fy in (0.40, 0.35, 0.45, 0.30):
    py, px = int(hh * fy), hw // 2
    if white_small[py, px]:
        seed_point = (py, px)
        break
seed_label = labels[seed_point]
print("deep-erosion scan: border_ids", sorted(border_ids), "seed_label", seed_label)
assert seed_label not in border_ids, "interior still connected at deep erosion"

keep = ~np.isin(labels, list(border_ids)) & eroded
ext = np.isin(labels, list(border_ids))
bands = white_small & ~eroded
d_ext = bfs_distance(ext)
d_keep = bfs_distance(keep)
channel = bands & (d_ext <= K) & (d_keep <= K)
print("channel cells:", int(channel.sum()))

ch_labels = label(channel)
dams = []
for cid in range(1, ch_labels.max() + 1):
    cells = list(map(tuple, np.argwhere(ch_labels == cid)))
    if len(cells) < 4:
        continue
    mid = [c for c in cells if abs(d_ext[c] - d_keep[c]) <= 1]
    if len(mid) < 3:
        continue
    start = mid[0]
    order = {start: 0}
    queue = deque([start])
    while queue:
        cur = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            nxt = (cur[0] + dy, cur[1] + dx)
            if nxt in set(mid) and nxt not in order:
                order[nxt] = order[cur] + 1
                queue.append(nxt)
    path = sorted(order, key=order.get)
    pts = [(int(c[1] * s + s / 2), int(c[0] * s + s / 2)) for c in path]
    if len(pts) >= 2:
        dams.append(pts)
        print(f"  dam {cid}: {len(pts)} points, from {pts[0]} to {pts[-1]}")

draw = ImageDraw.Draw(arr)
for pts in dams:
    smooth = []
    for i in range(len(pts)):
        win = pts[max(0, i - 2):i + 3]
        smooth.append((sum(p[0] for p in win) / len(win), sum(p[1] for p in win) / len(win)))
    if len(smooth) == 2:
        draw.line(smooth, fill=STROKE, width=12)
    else:
        draw.line(smooth, fill=STROKE, width=12, joint="curve")
print("dams drawn:", len(dams))

# With the gaps dammed, a light erosion now cleanly separates the outer white
# from the white disc inside the paw circle; only border-reaching components
# become transparent.
white = np.abs(arr[..., :3].astype(int) - 255).sum(axis=2) < 45
white_small = np.asarray(
    Image.fromarray(white.astype(np.uint8) * 255).resize((hw, hh), Image.LANCZOS)
) > 127

separated = None
for k in (4, 6, 8, 10):
    eroded = np.pad(erode(white_small, k), 2, constant_values=True)
    labels = label(eroded)
    border_ids = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])).tolist()) - {0}
    seed_label = labels[seed_point[0] + 2, seed_point[1] + 2]
    print(f"  erosion {k}: border={sorted(border_ids)} seed_label={seed_label}")
    if seed_label and seed_label not in border_ids:
        separated = (k, np.isin(labels, list(border_ids))[2:-2, 2:-2])
        break
assert separated, "separation failed even with dams"
k, exterior_small = separated
print("separated at erosion", k)

exterior_full = dilate(exterior_small, 3)
exterior_full = np.kron(exterior_full, np.ones((s, s), bool))[:h, :w] & white
alpha = arr[..., 3].copy()
alpha[exterior_full] = 0
print("exterior pixels cleared:", int((alpha == 0).sum()))

ta = arr.copy()
ta[..., 3] = alpha
near_white = np.abs(ta[..., :3].astype(int) - 255).sum(axis=2) < 45
allowed = dilate((alpha == 0), 3)
for _ in range(3):
    trans = ta[..., 3] == 0
    neighbor = np.zeros_like(trans)
    neighbor[1:, :] |= trans[:-1, :]
    neighbor[:-1, :] |= trans[1:, :]
    neighbor[:, 1:] |= trans[:, :-1]
    neighbor[:, :-1] |= trans[:, 1:]
    fringe = neighbor & near_white & (ta[..., 3] != 0) & allowed
    if not fringe.any():
        break
    ta[..., 3][fringe] = 0
transparent = Image.fromarray(ta)

print("alpha checks: corner(5,5)=", ta[5, 5, 3], " interior=", ta[int(h * 0.40), int(w * 0.5), 3])

target = 3200
factor = max(1, round(target / max(w, h)))
print("upscale factor:", factor)

hd_transparent = transparent.resize((w * factor, h * factor), Image.LANCZOS)
hd_transparent.save(OUT / "pawfox-logo-hd-transparent.png")

clean = Image.fromarray(arr)
hd_white = clean.resize((w * factor, h * factor), Image.LANCZOS)
r, g, b, a = hd_white.split()
sharp = Image.merge("RGB", (r, g, b)).filter(ImageFilter.UnsharpMask(radius=2, percent=50, threshold=3))
hd_white = Image.merge("RGBA", (*sharp.split(), a))
hd_white.save(OUT / "pawfox-logo-hd.png")

cream = Image.new("RGBA", hd_transparent.size, (251, 243, 228, 255))
cream.alpha_composite(hd_transparent)
cream.convert("RGB").save(OUT / "preview-on-cream.png")

print("saved:", *[p.name for p in sorted(OUT.glob("*.png"))])

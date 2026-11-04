"""UI impressions for Sketch Deck: pixel-perfect pictures of the screens of a
product to build, placed on slides in a device frame.

Claude writes each screen as a standalone HTML page (real layout, real CSS,
plausible data) at the device's size; render_screens() photographs them in
headless Chromium at 2x and returns images as data: URIs; device() draws one
in a phone or browser frame as plain SVG, for any kit's slide. The HTML stays
in the working directory as the spec for building the product.

Usage (from a deck script, next to slide_kit.py):
    from ui_kit import Screen, render_screens, device
    shots = render_screens([Screen("rooms", "screens/rooms.html", PHONE)])
    svg = device(shots["rooms"], x=120, y=80, width=300, kind="phone")
    # reveal it over the sketched screen: step("ui", "Product", svg)

See "UI impressions" in SKILL.md.
"""
import base64, html, os, ssl, urllib.request
from dataclasses import dataclass

E = html.escape
PHONE = (390, 844)        # CSS px of the screens, before the 2x photograph
TABLET = (834, 1194)
DESKTOP = (1440, 900)
_n = [0]


def _uid(p):
    _n[0] += 1
    return f"{p}{_n[0]}"


@dataclass
class Screen:
    id: str                 # key in the result, e.g. "rooms"
    html: str               # path of the screen's HTML file
    size: tuple = PHONE     # CSS width and height of the screen
    full_page: bool = False # photograph the whole scrolling page, not just the first screen


def _fetch(route):
    """Fetch web fonts from Python, so rendering honours the system's proxy and CA settings."""
    try:
        ctx = ssl.create_default_context(cafile=os.environ.get('SSL_CERT_FILE') or None)
        req = urllib.request.Request(route.request.url, headers={'User-Agent': route.request.headers.get('user-agent', '')})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            route.fulfill(status=r.status, body=r.read(),
                          headers={'content-type': r.headers.get('content-type', ''), 'access-control-allow-origin': '*'})
    except Exception:
        route.abort()


# measured in the page: the problems that make a screen look unfinished
_CHECK = r'''() => {
  const W = innerWidth, out = [];
  if (document.documentElement.scrollWidth > W + 1) out.push(`the page is ${document.documentElement.scrollWidth}px wide on a ${W}px screen`);
  for (const el of document.querySelectorAll('body *')){
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width && r.right > W + 1 && cs.position !== 'fixed') { out.push(`<${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''}> sticks out ${Math.round(r.right - W)}px on the right`); }
    if (el.children.length === 0 && el.textContent.trim() && el.scrollWidth > el.clientWidth + 1 && cs.overflow !== 'visible' && cs.textOverflow !== 'ellipsis')
      out.push(`text cut off: "${el.textContent.trim().slice(0, 40)}"`);
    if (el.tagName === 'IMG' && !(el.complete && el.naturalWidth)) out.push(`image did not load: ${el.getAttribute('src')}`);
  }
  for (const f of document.fonts) if (f.status === 'error') out.push(`font did not load: ${f.family}`);
  if (/lorem ipsum/i.test(document.body.innerText)) out.push('placeholder text (lorem ipsum)');
  return [...new Set(out)].slice(0, 12);
}'''


def render_screens(screens, scale=2, fmt="jpeg", quality=88, strict=True):
    """Photograph each Screen; returns {id: data URI}. fmt "jpeg" keeps decks small,
    "png" keeps flat colours exact. With strict, a screen that is wider than its
    device, has text cut off, a font or image that did not load, or lorem ipsum
    stops the render with every problem listed; strict=False only prints them."""
    from playwright.sync_api import sync_playwright
    out, problems = {}, []
    with sync_playwright() as p:
        exe = os.environ.get('CHROMIUM')
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        for s in screens:
            w, h = s.size
            pg = b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=scale)
            pg.route('https://fonts.googleapis.com/**', _fetch)
            pg.route('https://fonts.gstatic.com/**', _fetch)
            pg.goto('file://' + os.path.abspath(s.html))
            pg.evaluate('document.fonts.ready')
            pg.wait_for_load_state('networkidle')
            for msg in pg.evaluate(_CHECK):
                problems.append(f'{s.id}: {msg}')
            shot = pg.screenshot(type=fmt, quality=quality if fmt == 'jpeg' else None, full_page=s.full_page)
            out[s.id] = f'data:image/{fmt};base64,' + base64.b64encode(shot).decode()
            pg.close()
        b.close()
    if problems:
        msg = 'UI screens need fixing:\n  ' + '\n  '.join(problems)
        if strict:
            raise SystemExit(msg)
        print(msg)
    return out


def image_size(uri):
    """Pixel size of a PNG or JPEG data URI."""
    data = base64.b64decode(uri.split(',', 1)[1])
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return int.from_bytes(data[16:20], 'big'), int.from_bytes(data[20:24], 'big')
    i = 2
    while i < len(data):
        if data[i] != 0xFF:
            i += 1; continue
        m, L = data[i + 1], int.from_bytes(data[i + 2:i + 4], 'big')
        if m in (0xC0, 0xC1, 0xC2):
            return int.from_bytes(data[i + 7:i + 9], 'big'), int.from_bytes(data[i + 5:i + 7], 'big')
        i += 2 + L
    raise ValueError('not a PNG or JPEG')


def device(uri, x, y, width, kind="phone", url="", shadow=True, body="#16181d"):
    """The screen image in a device frame, as an SVG group; width is the outer
    width in the caller's units, the height follows the image. kind: "phone"
    (rounded body, camera island), "browser" (window bar with an address
    pill showing url), or "bare" (the image with a hairline edge)."""
    iw, ih = image_size(uri)
    clip = _uid('ui-clip')
    s = []
    if kind == "phone":
        pad = width * 0.035
        sw = width - 2 * pad
        sh = sw * ih / iw
        H = sh + 2 * pad
        r_out, r_in = width * 0.15, width * 0.12
        if shadow:
            s.append(f'<rect x="{x + width * .03:.1f}" y="{y + width * .04:.1f}" width="{width:.1f}" height="{H:.1f}" rx="{r_out:.1f}" fill="#000" opacity=".16"/>')
        s.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{width:.1f}" height="{H:.1f}" rx="{r_out:.1f}" fill="{body}"/>')
        s.append(f'<clipPath id="{clip}"><rect x="{x + pad:.1f}" y="{y + pad:.1f}" width="{sw:.1f}" height="{sh:.1f}" rx="{r_in:.1f}"/></clipPath>')
        s.append(f'<image x="{x + pad:.1f}" y="{y + pad:.1f}" width="{sw:.1f}" height="{sh:.1f}" href="{uri}" clip-path="url(#{clip})" preserveAspectRatio="xMidYMid slice"/>')
        iw2 = sw * .3
        s.append(f'<rect x="{x + width / 2 - iw2 / 2:.1f}" y="{y + pad + sw * .025:.1f}" width="{iw2:.1f}" height="{sw * .085:.1f}" rx="{sw * .0425:.1f}" fill="{body}"/>')
    elif kind == "browser":
        bar = width * 0.045
        sh = width * ih / iw
        H = bar + sh
        r = width * 0.012
        if shadow:
            s.append(f'<rect x="{x + width * .012:.1f}" y="{y + width * .016:.1f}" width="{width:.1f}" height="{H:.1f}" rx="{r:.1f}" fill="#000" opacity=".14"/>')
        s.append(f'<clipPath id="{clip}"><rect x="{x:.1f}" y="{y:.1f}" width="{width:.1f}" height="{H:.1f}" rx="{r:.1f}"/></clipPath>')
        s.append(f'<g clip-path="url(#{clip})"><rect x="{x:.1f}" y="{y:.1f}" width="{width:.1f}" height="{bar:.1f}" fill="#eceef1"/>')
        for k, c in enumerate(("#ff5f57", "#febc2e", "#28c840")):
            s.append(f'<circle cx="{x + bar * (.6 + .5 * k):.1f}" cy="{y + bar / 2:.1f}" r="{bar * .14:.1f}" fill="{c}"/>')
        pw = width * .42
        s.append(f'<rect x="{x + width / 2 - pw / 2:.1f}" y="{y + bar * .2:.1f}" width="{pw:.1f}" height="{bar * .6:.1f}" rx="{bar * .3:.1f}" fill="#fff"/>')
        if url:
            s.append(f'<text x="{x + width / 2:.1f}" y="{y + bar * .62:.1f}" font-size="{bar * .36:.1f}" text-anchor="middle" fill="#5f6670" '
                     f'style="font-family:\'IBM Plex Sans\',Arial,sans-serif">{E(url)}</text>')
        s.append(f'<image x="{x:.1f}" y="{y + bar:.1f}" width="{width:.1f}" height="{sh:.1f}" href="{uri}" preserveAspectRatio="xMidYMid slice"/></g>')
        s.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{width:.1f}" height="{H:.1f}" rx="{r:.1f}" fill="none" stroke="#c9ced6" stroke-width="{max(1, width * .0012):.2f}"/>')
    elif kind == "bare":
        sh = width * ih / iw
        s.append(f'<image x="{x:.1f}" y="{y:.1f}" width="{width:.1f}" height="{sh:.1f}" href="{uri}"/>')
        s.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{width:.1f}" height="{sh:.1f}" fill="none" stroke="#c9ced6" stroke-width="{max(1, width * .002):.2f}"/>')
    else:
        raise ValueError(f'kind must be phone, browser or bare, not {kind!r}')
    return '<g class="ui-impression">' + ''.join(s) + '</g>'


def device_height(uri, width, kind="phone"):
    """The outer height device() will give an image at this width, for layout."""
    iw, ih = image_size(uri)
    if kind == "phone":
        pad = width * 0.035
        return (width - 2 * pad) * ih / iw + 2 * pad
    if kind == "browser":
        return width * 0.045 + width * ih / iw
    return width * ih / iw

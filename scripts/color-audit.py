#!/usr/bin/env python3
"""Contrast audit for the color tokens in src/styles/tailwind.css.

Resolves every text token (brand, session, callout, theme text) against the
page surfaces and tints in both themes, then prints WCAG ratio / APCA Lc for
each pair. A trailing ~ marks a pair under 4.5:1, ! marks under 3:1. Run from
the repo root:

    python3 -I scripts/color-audit.py
"""
css = open("src/styles/tailwind.css").read()
root = css[:css.index(".dark {")]
dark = css[css.index(".dark {"):]
def tokens(block):
    return dict(re.findall(r"--([a-z0-9-]+):\s*([^;]+);", block))
L = tokens(root); D = {**L, **tokens(dark)}

def srgb_to_lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lin_to_srgb(c):
    c=max(0,min(1,c)); return 12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055
def oklch_to_rgb(l,c,h):
    a=c*math.cos(math.radians(h)); b=c*math.sin(math.radians(h))
    l_=l+0.3963377774*a+0.2158037573*b; m_=l-0.1055613458*a-0.0638541728*b; s_=l-0.0894841775*a-1.2914855480*b
    l3,m3,s3=l_**3,m_**3,s_**3
    r=4.0767416621*l3-3.3077115913*m3+0.2309699292*s3
    g=-1.2684380046*l3+2.6097574011*m3-0.3413193965*s3
    bb=-0.0041960863*l3-0.7034186147*m3+1.7076147010*s3
    return tuple(lin_to_srgb(x) for x in (r,g,bb))
def parse(v, bg=None):
    v=v.strip()
    m=re.match(r"var\(--([a-z0-9-]+)\)", v)
    if m: return None  # resolved by caller
    if v.startswith("#"):
        v=v.lstrip("#"); return tuple(int(v[i:i+2],16)/255 for i in (0,2,4))
    m=re.match(r"oklch\(([\d.]+)% ([\d.]+) ([\d.]+)\)", v)
    if m: return oklch_to_rgb(float(m[1])/100,float(m[2]),float(m[3]))
    m=re.match(r"rgba\((\d+),(\d+),(\d+),([\d.]+)\)", v)
    if m and bg:
        a=float(m[4]); fg=(int(m[1])/255,int(m[2])/255,int(m[3])/255)
        return tuple(a*f+(1-a)*b for f,b in zip(fg,bg))
    return None
def resolve(T, name, bg=None, depth=0):
    v=T.get(name)
    if v is None or depth>6: return None
    m=re.match(r"var\(--([a-z0-9-]+)\)", v.strip())
    if m: return resolve(T, m[1], bg, depth+1)
    return parse(v, bg)
def lum(rgb): r,g,b=(srgb_to_lin(c) for c in rgb); return 0.2126*r+0.7152*g+0.0722*b
def wcag(fg,bg):
    l1,l2=lum(fg),lum(bg); return (max(l1,l2)+0.05)/(min(l1,l2)+0.05)
def apca(fg,bg):
    # APCA 0.0.98G-4g
    def sc(rgb): r,g,b=rgb; return 0.2126729*r**2.4+0.7151522*g**2.4+0.0721750*b**2.4
    def clamp(y): return y+ (0.022-y)**1.414 if y<0.022 else y
    yt,yb=clamp(sc(fg)),clamp(sc(bg))
    if abs(yb-yt)<0.0005: return 0
    if yb>yt: s=(yb**0.56-yt**0.57)*1.14; return 0 if s<0.1 else (s-0.027)*100
    else: s=(yb**0.65-yt**0.62)*1.14; return 0 if s>-0.1 else (s+0.027)*100
hexs=lambda rgb: "#%02x%02x%02x"%tuple(round(c*255) for c in rgb)

def surfaces(T, paper):
    out={"paper":paper}
    for k in ["theme-card-bg","tint-purple","tint-blue","tint-green","tint-amber","tint-red","tint-neutral","callout-info-bg","callout-warning-bg","callout-success-bg","callout-error-bg"]:
        v=resolve(T,k,paper)
        if v: out[k]=v
    return out
checks=[("session-1","Session 1 hue"),("session-2","Session 2 hue"),("session-3","Session 3 hue"),("session-4","Session 4 hue"),("session-5","Session 5 hue"),
        ("brand-neutral-text","neutral text"),("brand-amber-text","amber text"),("brand-red-text","red text"),("brand-green-text","green text"),("brand-purple-text","purple text"),
        ("theme-text","body text"),("theme-text-muted","muted text"),("callout-info-fg","info callout fg"),("callout-warning-fg","warning fg")]
for theme,T,paper in [("LIGHT",L,parse(L["color-paper"])),("DARK",D,parse(D["color-ink"]))]:
    S=surfaces(T,paper)
    print(f"\n=== {theme}  paper={hexs(paper)}")
    for key,label in checks:
        fg=resolve(T,key,paper)
        if not fg: print(f"  {label}: unresolved"); continue
        row=[]
        for sname in ["paper","theme-card-bg","tint-purple","tint-blue","tint-amber","tint-red","tint-green"]:
            bg=S.get(sname)
            if bg is None: continue
            w=wcag(fg,bg); a=abs(apca(fg,bg))
            flag="" if w>=4.5 else ("~" if w>=3 else "!")
            row.append(f"{sname.replace('theme-','').replace('tint-','')}:{w:.1f}/{a:.0f}{flag}")
        print(f"  {label:18} {hexs(fg)}  " + "  ".join(row))

#!/usr/bin/env python3
# フロー型ダイアグラムSVG決定論生成器。
# 入力: scripts/diagram-specs/<slug>.json (エージェントが設計したスペック)
# 出力: public/dictionary/diagram/<slug>.svg (一貫したビジュアルシステム)
#
# スペックスキーマ:
# {
#   "header": "1行のヘッドライン(30文字以内推奨)",
#   "subcaption": "補足説明1行",
#   "nodes": [ {"title":"自分のアプリ","sub":"お客さん","accent":false,"icon":"app"}, ... ],  # 2〜4個
#   "steps": ["リクエスト","処理"],            # ノード数-1、矢印上の段階ラベル
#   "ret":   {"label":"レスポンス・決まった形式"}  # 任意: 結果を返す矢印(下側、テラコッタ)。null可
# }
import json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPECS = os.path.join(ROOT, "scripts", "diagram-specs")
OUT = os.path.join(ROOT, "public", "dictionary", "diagram")

PAPER="#fbfaf7"; INK="#241f18"; INKSOFT="#8d8579"; MUTE="#a8a194"
ACC="#b8543a"; ACCD="#9a5640"; ACCTINT="#fcf1ec"; ACCLINE="#eccabd"; LINE="#e7e3da"
W,H=1200,660

DEFS=(
 '<defs>'
 '<filter id="soft" x="-40%" y="-40%" width="180%" height="200%">'
 '<feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#2a2118" flood-opacity="0.10"/></filter>'
 '<marker id="ai" markerWidth="13" markerHeight="13" refX="8.5" refY="6" orient="auto">'
 '<path d="M2.5 2.5 L9.5 6 L2.5 9.5" fill="none" stroke="'+INK+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></marker>'
 '<marker id="aa" markerWidth="13" markerHeight="13" refX="8.5" refY="6" orient="auto">'
 '<path d="M2.5 2.5 L9.5 6 L2.5 9.5" fill="none" stroke="'+ACC+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></marker>'
 '<pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">'
 '<circle cx="2" cy="2" r="1.2" fill="'+INK+'" fill-opacity="0.04"/></pattern>'
 '</defs>'
)

def esc(s):
    return (str(s).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
            .replace('"',"&quot;"))

def icon(name, cx, cy, col):
    s='<g stroke="%s" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(%g %g)">'%(col,cx,cy)
    P={
    "app":'<rect x="-13" y="-20" width="26" height="40" rx="6"/><line x1="-13" y1="9" x2="13" y2="9"/><circle cx="0" cy="14.5" r="1.6" fill="%s" stroke="none"/>'%col,
    "server":'<rect x="-20" y="-16" width="40" height="15" rx="3"/><rect x="-20" y="3" width="40" height="15" rx="3"/><circle cx="-12" cy="-8.5" r="1.7" fill="%s" stroke="none"/><circle cx="-12" cy="10.5" r="1.7" fill="%s" stroke="none"/>'%(col,col),
    "db":'<ellipse cx="0" cy="-14" rx="17" ry="6"/><path d="M-17 -14 V14 a17 6 0 0 0 34 0 V-14"/><path d="M-17 0 a17 6 0 0 0 34 0"/>',
    "user":'<circle cx="0" cy="-9" r="8"/><path d="M-14 18 a14 13 0 0 1 28 0"/>',
    "users":'<circle cx="-7" cy="-9" r="7"/><path d="M-20 16 a13 12 0 0 1 26 0"/><path d="M10 -14 a7 7 0 0 1 0 14"/><path d="M14 16 a13 12 0 0 0 -8 -11"/>',
    "cloud":'<path d="M-16 8 a11 11 0 0 1 3 -21 a14 14 0 0 1 26 4 a9 9 0 0 1 -3 17 z"/>',
    "gear":'<circle cx="0" cy="0" r="8"/><g>%s</g>'%("".join('<line x1="%g" y1="%g" x2="%g" y2="%g"/>'%(11*__import__("math").cos(a),11*__import__("math").sin(a),15*__import__("math").cos(a),15*__import__("math").sin(a)) for a in [i*3.14159/4 for i in range(8)])),
    "doc":'<path d="M-12 -20 H6 l8 8 V20 H-12 Z"/><path d="M6 -20 V-12 H14"/><line x1="-6" y1="-2" x2="8" y2="-2"/><line x1="-6" y1="7" x2="8" y2="7"/>',
    "lock":'<rect x="-13" y="-2" width="26" height="20" rx="4"/><path d="M-8 -2 V-9 a8 8 0 0 1 16 0 V-2"/><circle cx="0" cy="8" r="2.4" fill="%s" stroke="none"/>'%col,
    "key":'<circle cx="-8" cy="-8" r="8"/><path d="M-2 -2 L16 16"/><line x1="10" y1="10" x2="16" y2="4"/><line x1="6" y1="14" x2="12" y2="20"/>',
    "clock":'<circle cx="0" cy="0" r="16"/><path d="M0 -8 V0 L7 6"/>',
    "code":'<path d="M-6 -12 L-18 0 L-6 12"/><path d="M6 -12 L18 0 L6 12"/>',
    "box":'<path d="M0 -18 L18 -8 V12 L0 22 L-18 12 V-8 Z"/><path d="M-18 -8 L0 2 L18 -8"/><line x1="0" y1="2" x2="0" y2="22"/>',
    "mail":'<rect x="-18" y="-12" width="36" height="24" rx="4"/><path d="M-18 -8 L0 6 L18 -8"/>',
    "bolt":'<path d="M3 -20 L-12 4 H-1 L-3 20 L13 -4 H1 Z"/>',
    "globe":'<circle cx="0" cy="0" r="16"/><path d="M-16 0 H16"/><path d="M0 -16 a22 16 0 0 1 0 32 a22 16 0 0 1 0 -32"/>',
    "link":'<path d="M-4 -8 a8 8 0 0 1 11 0 l5 5 a8 8 0 0 1 -11 11"/><path d="M4 8 a8 8 0 0 1 -11 0 l-5 -5 a8 8 0 0 1 11 -11"/>',
    "shield":'<path d="M0 -19 L16 -12 V2 a18 20 0 0 1 -16 18 a18 20 0 0 1 -16 -18 V-12 Z"/><path d="M-6 0 L-1 6 L8 -6"/>',
    "search":'<circle cx="-3" cy="-3" r="11"/><line x1="5" y1="5" x2="17" y2="17"/>',
    "queue":'<rect x="-18" y="-13" width="11" height="26" rx="2"/><rect x="-4" y="-13" width="11" height="26" rx="2"/><rect x="10" y="-13" width="9" height="26" rx="2"/>',
    "layers":'<path d="M0 -16 L18 -6 L0 4 L-18 -6 Z"/><path d="M-18 4 L0 14 L18 4"/>',
    "terminal":'<rect x="-18" y="-14" width="36" height="28" rx="4"/><path d="M-10 -4 L-3 2 L-10 8"/><line x1="0" y1="8" x2="9" y2="8"/>',
    "check":'<circle cx="0" cy="0" r="15"/><path d="M-7 0 L-1 6 L8 -6"/>',
    "branch":'<circle cx="-10" cy="-12" r="4"/><circle cx="-10" cy="12" r="4"/><circle cx="10" cy="-2" r="4"/><path d="M-10 -8 V8"/><path d="M-10 0 a10 10 0 0 0 16 0"/>',
    "folder":'<path d="M-18 -10 H-4 l4 6 H18 V14 H-18 Z"/>',
    "filter":'<path d="M-16 -12 H16 L4 2 V16 L-4 12 V2 Z"/>',
    "file-img":'<rect x="-14" y="-18" width="28" height="36" rx="3"/><circle cx="-3" cy="-6" r="3"/><path d="M-10 12 L-1 2 L5 8 L9 4 L10 12 Z" fill="%s" stroke="none"/>'%col,
    }
    return s+P.get(name,"")+'</g>' if name and name!="none" and name in P else ""

def lin(a,b,n):
    if n<=1: return [(a+b)/2]
    return [a+(b-a)*i/(n-1) for i in range(n)]

WID={1:240,2:240,3:210,4:180}

def build(spec):
    nodes=spec.get("nodes",[])[:4]
    n=len(nodes)
    if n<2: raise ValueError("need >=2 nodes")
    steps=list(spec.get("steps") or [])
    while len(steps)<n-1: steps.append("")
    header=spec.get("header","")
    sub=spec.get("subcaption","")
    ret=spec.get("ret") or None

    hsize=27 if len(header)<=26 else (23 if len(header)<=34 else 20)
    centers=lin(200,1000,n)
    nw=WID.get(n,200)

    out=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 660" width="1200" height="660" role="img" font-family="Noto Sans JP, sans-serif">']
    out.append(DEFS)
    out.append('<rect width="1200" height="660" fill="%s"/>'%PAPER)
    out.append('<rect width="1200" height="660" fill="url(#dots)"/>')
    # header
    out.append('<rect x="80" y="62" width="30" height="3" rx="1.5" fill="%s"/>'%ACC)
    out.append('<text x="122" y="70" font-size="15" font-weight="700" letter-spacing="2" fill="%s">FLOW · フロー</text>'%ACC)
    out.append('<text x="80" y="118" font-size="%d" font-weight="800" fill="%s" letter-spacing="-0.5">%s</text>'%(hsize,INK,esc(header)))
    out.append('<text x="80" y="150" font-size="18" font-weight="500" fill="%s">%s</text>'%(INKSOFT,esc(sub)))

    cy=362
    # nodes
    for i,nd in enumerate(nodes):
        cx=centers[i]; acc=bool(nd.get("accent"))
        nh=176 if acc else 150
        y=cy-nh/2
        fill=ACCTINT if acc else "#ffffff"; bd=ACC if acc else INK; bw=3 if acc else 2.5
        out.append('<g filter="url(#soft)"><rect x="%g" y="%g" width="%g" height="%g" rx="20" fill="%s" stroke="%s" stroke-width="%g"/></g>'%(cx-nw/2,y,nw,nh,fill,bd,bw))
        ic=nd.get("icon","")
        ttl=esc(nd.get("title","")); subl=esc(nd.get("sub",""))
        ic_svg=icon(ic, cx, cy-30, ACC if acc else INK)
        out.append(ic_svg)
        tcol=ACC if acc else INK
        tsize=24 if len(nd.get("title",""))<=6 else (20 if len(nd.get("title",""))<=10 else 17)
        out.append('<text x="%g" y="%g" text-anchor="middle" font-size="%d" font-weight="800" fill="%s">%s</text>'%(cx,cy+(14 if ic_svg else 4),tsize,tcol,ttl))
        if subl:
            out.append('<text x="%g" y="%g" text-anchor="middle" font-size="15" font-weight="500" fill="%s">%s</text>'%(cx,cy+(38 if ic_svg else 28),ACCD if acc else MUTE,subl))
    # arrows + step labels
    for i in range(n-1):
        x1=centers[i]+nw/2+8; x2=centers[i+1]-nw/2-8
        out.append('<line x1="%g" y1="%g" x2="%g" y2="%g" stroke="%s" stroke-width="2.6" marker-end="url(#ai)"/>'%(x1,cy,x2,cy,INK))
        mx=(x1+x2)/2
        out.append('<g transform="translate(%g %g)"><circle r="11" fill="%s"/><text y="5" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">%d</text>'%(mx-((len(esc(steps[i]))*9+20)/2 if steps[i] else 0),cy-32,INK,i+1))
        if steps[i]:
            out.append('<text x="20" y="5" font-size="17" font-weight="600" fill="%s">%s</text>'%(INK,esc(steps[i])))
        out.append('</g>')
    # return arrow
    if ret:
        cx_f=centers[0]; cx_l=centers[-1]
        out.append('<path d="M%g 450 V540 H%g V450" fill="none" stroke="%s" stroke-width="2.6" marker-end="url(#aa)"/>'%(cx_l,cx_f,ACC))
        mid=(cx_f+cx_l)/2; lab=esc(ret.get("label","レスポンス"))
        cw=max(150, len(ret.get("label",""))*15+70)
        out.append('<g transform="translate(%g 540)"><rect x="%g" y="-19" width="%g" height="38" rx="19" fill="%s" stroke="%s" stroke-width="1.5"/>'%(mid,-cw/2,cw,ACCTINT,ACCLINE))
        out.append('<circle cx="%g" r="11" fill="%s"/><text x="%g" y="5" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">%d</text>'%(-cw/2+24,ACC,-cw/2+24,n))
        out.append('<text x="%g" y="5" text-anchor="middle" font-size="16" font-weight="600" fill="%s">%s</text></g>'%(12,ACCD,lab))
    out.append('</svg>')
    return "".join(out)

def main():
    only=sys.argv[1:] or None
    os.makedirs(OUT, exist_ok=True)
    files=[f for f in os.listdir(SPECS) if f.endswith(".json")] if os.path.isdir(SPECS) else []
    made=0; errs=[]
    for f in sorted(files):
        slug=f[:-5]
        if only and slug not in only: continue
        try:
            spec=json.load(open(os.path.join(SPECS,f),encoding="utf-8"))
            svg=build(spec)
            open(os.path.join(OUT,slug+".svg"),"w",encoding="utf-8").write(svg)
            made+=1
        except Exception as e:
            errs.append("%s: %s"%(slug,e))
    print("svg made:",made,"| errors:",len(errs))
    for e in errs[:30]: print("  ERR",e)

if __name__=="__main__":
    main()

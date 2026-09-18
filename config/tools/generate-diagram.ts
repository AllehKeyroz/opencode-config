import { tool } from "@opencode-ai/plugin"
import { join } from "path"
import { mkdirSync, writeFileSync } from "fs"

let _seed = Date.now()
function seed(): number { _seed = (_seed * 9301 + 49297) % 233280; return Math.abs(_seed) }
function uid(): string { return `e${seed().toString(36)}` }

const COLORS = [
  { stroke: "#4A90D9", fill: "#4A90D918" },
  { stroke: "#50B86C", fill: "#50B86C18" },
  { stroke: "#F5A623", fill: "#F5A62318" },
  { stroke: "#D0021B", fill: "#D0021B18" },
  { stroke: "#7B68EE", fill: "#7B68EE18" },
  { stroke: "#20B2AA", fill: "#20B2AA18" },
]

function textDims(text: string, fs: number): { w: number; h: number; lines: number } {
  const lines = text.split("\n")
  const maxLen = Math.max(...lines.map(l => l.length))
  const cw = maxLen * fs * 0.58
  return { w: Math.ceil(cw + 32), h: Math.ceil(lines.length * fs * 1.35 + 20), lines: lines.length }
}

function autoSize(text: string, maxW: number, minW: number, minH: number): { w: number; h: number; fs: number } {
  let fs = 14
  for (let attempt = 0; attempt < 10; attempt++) {
    const d = textDims(text, fs)
    if (d.w <= maxW && d.h <= 150) return { w: Math.max(minW, d.w), h: Math.max(minH, d.h), fs }
    fs--
  }
  const d = textDims(text, 8)
  return { w: Math.min(maxW, Math.max(minW, d.w)), h: Math.max(minH, d.h), fs: 8 }
}

interface ElemInfo { id: string; x: number; y: number; w: number; h: number }

export default tool({
  description:
    "Gera um diagrama Excalidraw profissional estilo Whimsical: texto DENTRO das formas, " +
    "setas com curvas 90 graus COLADAS nos blocos (startBinding/endBinding), " +
    "cores vibrantes, sem agrupamento rigido. Abre com duplo clique no VS Code.",
  args: {
    type: tool.schema.enum(["flowchart", "infographic", "mindmap", "wireframe"]),
    title: tool.schema.string().optional(),
    steps: tool.schema.array(
      tool.schema.object({ text: tool.schema.string(), color: tool.schema.string().optional() })
    ).optional(),
    sections: tool.schema.array(
      tool.schema.object({ label: tool.schema.string().optional(), text: tool.schema.string(), icon: tool.schema.string().optional() })
    ).optional(),
    nodes: tool.schema.array(
      tool.schema.object({ text: tool.schema.string(), parent: tool.schema.number().optional().nullable() })
    ).optional(),
    frames: tool.schema.array(
      tool.schema.object({ label: tool.schema.string().optional(), sections: tool.schema.array(tool.schema.string()) })
    ).optional(),
    width: tool.schema.number().optional(),
    height: tool.schema.number().optional(),
    outDir: tool.schema.string().optional(),
  },
  async execute(args) {
    const outDir = args.outDir || "C:\\KEYROZ DIGITAL SOLUTIONS\\Marketing\\Visuals"
    mkdirSync(outDir, { recursive: true })
    const W = args.width || 900
    const _H = args.height || 700
    const slug = (args.title || args.type).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || args.type
    const outPath = join(outDir, `${Date.now()}-${slug}.excalidraw`)

    const info: ElemInfo[] = []
    const allEls: Record<string, any>[] = []
    const titleH = args.title ? 48 : 10

    function addText(id: string, x: number, y: number, w: number, h: number, text: string, color: string, opts: Record<string, any> = {}) {
      allEls.push({
        id: id || uid(), type: "text",
        x, y, width: w, height: h,
        angle: 0,
        strokeColor: opts.strokeColor || "#2D3748",
        backgroundColor: "transparent",
        fillStyle: "solid", strokeWidth: 1, roughness: 0, opacity: 100,
        groupIds: [], frameId: null, roundness: null,
        seed: seed(), version: 1, isDeleted: false,
        boundElements: null,
        updated: Date.now(), link: null, locked: false, customData: null,
        text,
        fontSize: opts.fontSize || 14, fontFamily: 3,
        textAlign: "center", verticalAlign: "middle",
        containerId: null, originalText: text, autoResize: true, lineHeight: 1.25,
      })
    }

    function makeBox(text: string, cx: number, cy: number, color: typeof COLORS[0], opts: Record<string, any> = {}): string {
      const id = uid()
      const as = autoSize(text, opts.maxW || 360, opts.minW || 90, opts.minH || 40)
      const bw = as.w, bh = as.h
      const x = cx - bw / 2, y = cy - bh / 2
      const tid = uid()

      allEls.push({
        id, type: "rectangle",
        x, y, width: bw, height: bh,
        angle: 0,
        strokeColor: color.stroke,
        backgroundColor: opts.bg || color.fill,
        fillStyle: "solid", strokeWidth: 2, roughness: 0, opacity: 100,
        groupIds: [], frameId: null, roundness: { type: 3 },
        seed: seed(), version: 1, isDeleted: false,
        boundElements: [{ type: "text", id: tid }],
        updated: Date.now(), link: null, locked: false, customData: null,
      })

      allEls.push({
        id: tid, type: "text",
        x: x + 6, y: y + 4,
        width: bw - 12, height: bh - 8,
        angle: 0,
        strokeColor: "#2D3748",
        backgroundColor: "transparent",
        fillStyle: "solid", strokeWidth: 1, roughness: 0, opacity: 100,
        groupIds: [], frameId: null, roundness: null,
        seed: seed(), version: 1, isDeleted: false,
        boundElements: null,
        updated: Date.now(), link: null, locked: false, customData: null,
        text,
        fontSize: as.fs, fontFamily: 3,
        textAlign: "center", verticalAlign: "middle",
        containerId: id,
        originalText: text, autoResize: true, lineHeight: 1.25,
      })

      info.push({ id, x, y, w: bw, h: bh })
      return id
    }

    function edgePt(idx: number, side: string): { x: number; y: number } {
      const e = info[idx]
      if (!e) return { x: 0, y: 0 }
      switch (side) {
        case "right": return { x: e.x + e.w, y: e.y + e.h / 2 }
        case "left": return { x: e.x, y: e.y + e.h / 2 }
        case "top": return { x: e.x + e.w / 2, y: e.y }
        case "bottom": return { x: e.x + e.w / 2, y: e.y + e.h }
        default: return { x: e.x + e.w / 2, y: e.y + e.h / 2 }
      }
    }

    function addArrow(sx: number, sy: number, ex: number, ey: number, color: string, fromId?: string, toId?: string, fSide?: string, tSide?: string, label?: string) {
      const id = uid()
      const dx = ex - sx, dy = ey - sy
      const arrX = Math.min(sx, ex), arrY = Math.min(sy, ey)
      const pts = [[sx - arrX, sy - arrY], [ex - arrX, ey - arrY]]

      function fp(s: string): [number, number] | undefined {
        return s === "right" ? [1, 0.5] : s === "left" ? [0, 0.5] : s === "top" ? [0.5, 0] : s === "bottom" ? [0.5, 1] : undefined
      }

      const el: Record<string, any> = {
        id, type: "arrow",
        x: arrX, y: arrY,
        width: Math.max(1, Math.abs(dx)),
        height: Math.max(1, Math.abs(dy)),
        angle: 0, strokeColor: color,
        backgroundColor: "transparent",
        fillStyle: "solid", strokeWidth: 2, roughness: 0, opacity: 80,
        groupIds: [], frameId: null, roundness: null,
        seed: seed(), version: 1, isDeleted: false,
        boundElements: null,
        updated: Date.now(), link: null, locked: false, customData: null,
        points: pts,
        lastCommittedPoint: null,
        startBinding: fromId ? { elementId: fromId, focus: 0.5, gap: 0, fixedPoint: fp(fSide!) } : null,
        endBinding: toId ? { elementId: toId, focus: 0.5, gap: 0, fixedPoint: fp(tSide!) } : null,
        startArrowhead: null, endArrowhead: "arrow", elbowed: true,
      }
      allEls.push(el)
    }

    if (args.title) {
      addText(uid(), 20, 6, W - 40, 36, args.title, "#2D3748", { fontSize: 22, strokeColor: "#2D3748" })
    }

    if (args.type === "flowchart" && args.steps) {
      const steps = args.steps
      const maxCharLen = Math.max(...steps.map(s => Math.max(...s.text.split("\n").map(l => l.length))))
      const minBw = Math.min(360, maxCharLen * 14 * 0.58 + 32)
      const gapX = 50, gapY = 40
      const cols = Math.min(4, steps.length)
      const rows = Math.ceil(steps.length / cols)
      const totalW = cols * minBw + (cols - 1) * gapX
      const scale = totalW > W - 80 ? (W - 80) / totalW : 1
      const bw = Math.round(minBw * scale)
      const startY = titleH + 36

      const grid: { cx: number; cy: number }[] = []
      for (let i = 0; i < steps.length; i++) {
        const col = i % cols, row = Math.floor(i / cols)
        const actualCols = row < rows - 1 ? cols : (steps.length - row * cols)
        const rowW = actualCols * bw + (actualCols - 1) * gapX
        grid.push({
          cx: (W - rowW) / 2 + col * (bw + gapX) + bw / 2,
          cy: startY + row * 75 + (row > 0 ? 20 : 0),
        })
      }

      for (let i = 0; i < steps.length; i++) {
        const c = steps[i].color ? { stroke: steps[i].color!, fill: steps[i].color! + "18" } : COLORS[i % COLORS.length]
        makeBox(steps[i].text, grid[i].cx, grid[i].cy, c, { maxW: bw, minW: bw, minH: 46 })
      }

      for (let i = 0; i < steps.length - 1; i++) {
        const sameRow = Math.floor(i / cols) === Math.floor((i + 1) / cols)
        const sp = edgePt(i, sameRow ? "right" : "bottom")
        const ep = edgePt(i + 1, sameRow ? "left" : "top")
        addArrow(sp.x, sp.y, ep.x, ep.y, "#94A3B8", info[i].id, info[i + 1].id, sameRow ? "right" : "bottom", sameRow ? "left" : "top")
      }
    }

    if (args.type === "infographic" && args.sections) {
      let yo = titleH + 30
      for (let i = 0; i < args.sections.length; i++) {
        const sec = args.sections[i]
        const c = COLORS[i % COLORS.length]
        const text = sec.label ? `${sec.label}\n${sec.text}` : sec.text
        const id = makeBox(text, W / 2, yo, c, { maxW: W - 80, minW: 300, minH: 56 })

        if (sec.icon) {
          allEls.push({
            id: uid(), type: "text",
            x: W - 68, y: yo - 18, width: 32, height: 32,
            text: sec.icon,
            fontSize: 22, fontFamily: 3,
            strokeColor: c.stroke, backgroundColor: "transparent",
            fillStyle: "solid", strokeWidth: 1, roughness: 0, opacity: 90,
            groupIds: [], frameId: null, roundness: null,
            seed: seed(), version: 1, isDeleted: false,
            boundElements: null, updated: Date.now(), link: null, locked: false, customData: null,
            containerId: null, originalText: sec.icon, autoResize: true, lineHeight: 1.25,
            textAlign: "center", verticalAlign: "middle",
          })
        }

        const last = info[info.length - 1]
        yo = last.y + last.h + 18
      }
    }

    if (args.type === "mindmap" && args.nodes && args.nodes.length > 0) {
      const root = args.nodes.find(n => n.parent == null) || args.nodes[0]
      const children = args.nodes.filter(n => n.parent != null)
      const cx = W / 2
      const rid = makeBox(root.text, cx, titleH + 36, COLORS[0], { minW: 140, minH: 44, maxW: 300 })
      const radius = Math.min(W, 700) * 0.3
      const angleStep = (2 * Math.PI) / Math.max(children.length, 1)

      for (let i = 0; i < children.length; i++) {
        const angle = angleStep * i - Math.PI / 2
        const cxc = cx + Math.cos(angle) * radius
        const cyc = titleH + 42 + Math.sin(angle) * radius
        const cid = makeBox(children[i].text, cxc, cyc, COLORS[(i + 1) % COLORS.length], { minW: 100, minH: 34, maxW: 220 })
        const chIdx = info.length - 1
        const fromRight = i < children.length / 2
        const sp = edgePt(0, fromRight ? "right" : "left")
        const ep = edgePt(chIdx, fromRight ? "left" : "right")
        addArrow(sp.x, sp.y, ep.x, ep.y, "#94A3B8", info[0].id, info[chIdx].id, fromRight ? "right" : "left", fromRight ? "left" : "right")
      }
    }

    if (args.type === "wireframe" && args.frames) {
      const fw = Math.min(220, (W - 60) / args.frames.length - 20)
      const totalW = args.frames.length * fw + (args.frames.length - 1) * 20
      const startX = (W - totalW) / 2

      for (let i = 0; i < args.frames.length; i++) {
        const frame = args.frames[i]
        const fx = startX + i * (fw + 20)
        const fid = makeBox(frame.label || `Tela ${i + 1}`, fx + fw / 2, titleH + 30, COLORS[0], { bg: "#F5F5F5", strokeColor: "#CBD5E0", minW: fw, minH: 340, maxW: fw })

        const fi = info[info.length - 1]
        for (let si = 0; si < (frame.sections || []).length; si++) {
          const sy = fi.y + 38 + si * 50
          makeBox(frame.sections[si], fi.x + fw / 2, sy + 20, COLORS[si % COLORS.length], { bg: "#EDF2F7", strokeColor: "#CBD5E0", minW: fw - 20, minH: 34, maxW: fw - 20 })
        }
      }
    }

    const data = {
      type: "excalidraw", version: 2, source: "https://excalidraw.com",
      elements: allEls,
      appState: {
        theme: "light", viewBackgroundColor: "#FFFFFF",
        currentItemStrokeColor: "#2D3748", currentItemBackgroundColor: "transparent",
        currentItemFillStyle: "solid", currentItemStrokeWidth: 2,
        currentItemStrokeStyle: "solid", currentItemRoughness: 0,
        currentItemOpacity: 100, currentItemFontFamily: 3, currentItemFontSize: 16,
        currentItemTextAlign: "left", currentItemStartArrowhead: null,
        currentItemEndArrowhead: "arrow", scrollX: 0, scrollY: 0,
        zoom: 1, penMode: false,
      }, files: {},
    }

    writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8")

    let summary = ""
    switch (args.type) {
      case "flowchart": summary = `Fluxograma com ${args.steps?.length || 0} passos`; break
      case "infographic": summary = `Infografico com ${args.sections?.length || 0} secoes`; break
      case "mindmap": summary = `Mapa mental com ${args.nodes?.length || 0} nos`; break
      case "wireframe": summary = `Wireframe com ${args.frames?.length || 0} telas`; break
    }

    return [
      `Diagrama: ${outPath}`,
      `Abra: code "${outPath}"`,
      ``,
      summary,
      `Setas com elbow (curvas 90╟) + bindings nas bordas — arraste um bloco que a seta acompanha.`,
      `Nenhum agrupamento rigido — cada elemento e independente mas CONECTADO.`,
    ].join("\n")
  },
})

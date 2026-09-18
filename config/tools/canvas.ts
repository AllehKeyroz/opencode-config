import { tool } from "@opencode-ai/plugin"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

function load(file) {
  const p = file.startsWith("~")
    ? join(process.env.USERPROFILE || "C:\\Users\\User", file.slice(1))
    : file
  if (!existsSync(p)) {
    return { nodes: [], edges: [] }
  }
  return JSON.parse(readFileSync(p, "utf-8"))
}

function save(file, data) {
  const p = file.startsWith("~")
    ? join(process.env.USERPROFILE || "C:\\Users\\User", file.slice(1))
    : file
  writeFileSync(p, JSON.stringify(data, null, 2), "utf-8")
}

function boxesOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y
}

function smartRoute(from, to) {
  if (to.y > from.y + from.height + 10) return { fromSide: "bottom", toSide: "top" }
  if (to.y + to.height + 10 < from.y) return { fromSide: "top", toSide: "bottom" }
  const dx = (to.x + to.width / 2) - (from.x + from.width / 2)
  if (dx > 0) return { fromSide: "right", toSide: "left" }
  return { fromSide: "left", toSide: "right" }
}

export const inspect = tool({
  description: "Le um arquivo .canvas e retorna a estrutura completa, deteccao de overlaps e problemas de roteamento",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
  },
  async execute(args) {
    const data = load(args.file)
    const issues = []
    const overlaps = []

    for (let i = 0; i < data.nodes.length; i++) {
      for (let j = i + 1; j < data.nodes.length; j++) {
        if (boxesOverlap(data.nodes[i], data.nodes[j])) {
          overlaps.push({ node1: data.nodes[i].id, node2: data.nodes[j].id })
          issues.push(`Overlap entre "${data.nodes[i].id}" e "${data.nodes[j].id}"`)
        }
      }
    }

    for (const e of data.edges) {
      const from = data.nodes.find(n => n.id === e.fromNode)
      const to = data.nodes.find(n => n.id === e.toNode)
      if (!from) issues.push(`Aresta "${e.id}" referencia no inexistente: "${e.fromNode}"`)
      if (!to) issues.push(`Aresta "${e.id}" referencia no inexistente: "${e.toNode}"`)
      if (from && to) {
        const r = smartRoute(from, to)
        if (e.fromSide !== r.fromSide || e.toSide !== r.toSide) {
          issues.push(`Aresta "${e.id}" roteamento subotimo: ${e.fromSide || "?"}→${e.toSide || "?"} (sugerido: ${r.fromSide}→${r.toSide})`)
        }
      }
    }

    return JSON.stringify({
      status: issues.length === 0 ? "ok" : "warn",
      nodes: data.nodes.length,
      edges: data.edges.length,
      overlaps: overlaps.length,
      issues,
      data,
    }, null, 2)
  },
})

export const add_node = tool({
  description: "Adiciona um no ao canvas com predicao de overlap. Recusa se sobrepor e sugere posicao alternativa",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
    id: tool.schema.string().describe("ID unico do no"),
    text: tool.schema.string().describe("Texto do no (markdown)"),
    x: tool.schema.number().describe("Posicao X"),
    y: tool.schema.number().describe("Posicao Y"),
    w: tool.schema.number().optional().describe("Largura (padrao 180)"),
    h: tool.schema.number().optional().describe("Altura (padrao 60)"),
    color: tool.schema.string().optional().describe("Cor (1-6)"),
    connectFrom: tool.schema.string().optional().describe("ID do no pai para conexao automatica"),
  },
  async execute(args) {
    const data = load(args.file)
    const w = args.w || 180
    const h = args.h || 60

    if (data.nodes.find(n => n.id === args.id)) {
      return JSON.stringify({ status: "error", message: `No "${args.id}" ja existe` })
    }

    const novo = { id: args.id, type: "text", text: args.text, x: args.x, y: args.y, width: w, height: h }
    if (args.color) novo.color = args.color

    for (const n of data.nodes) {
      if (boxesOverlap(novo, n)) {
        const suggestions = [
          { label: "direita", x: n.x + n.width + 20, y: args.y },
          { label: "abaixo", x: args.x, y: n.y + n.height + 20 },
        ]
        return JSON.stringify({
          status: "error",
          message: `Sobreposicao com "${n.id}" (x:${n.x}, y:${n.y}, w:${n.width}, h:${n.height})`,
          suggestions,
        }, null, 2)
      }
    }

    data.nodes.push(novo)

    if (args.connectFrom) {
      const parent = data.nodes.find(n => n.id === args.connectFrom)
      if (parent) {
        const r = smartRoute(parent, novo)
        data.edges.push({
          id: `e_${args.connectFrom}_${args.id}`,
          fromNode: args.connectFrom,
          toNode: args.id,
          fromSide: r.fromSide,
          toSide: r.toSide,
        })
      }
    }

    save(args.file, data)
    return JSON.stringify({
      status: "ok",
      operation: "add_node",
      node: novo,
      totalNodes: data.nodes.length,
      totalEdges: data.edges.length,
    }, null, 2)
  },
})

export const move_node = tool({
  description: "Move ou redimensiona um no existente no canvas",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
    id: tool.schema.string().describe("ID do no"),
    x: tool.schema.number().optional().describe("Nova posicao X"),
    y: tool.schema.number().optional().describe("Nova posicao Y"),
    w: tool.schema.number().optional().describe("Nova largura"),
    h: tool.schema.number().optional().describe("Nova altura"),
  },
  async execute(args) {
    const data = load(args.file)
    const node = data.nodes.find(n => n.id === args.id)
    if (!node) {
      return JSON.stringify({ status: "error", message: `No "${args.id}" nao encontrado` })
    }

    if (args.x !== undefined) node.x = args.x
    if (args.y !== undefined) node.y = args.y
    if (args.w !== undefined) node.width = args.w
    if (args.h !== undefined) node.height = args.h

    save(args.file, data)
    return JSON.stringify({
      status: "ok",
      operation: "move_node",
      node,
    }, null, 2)
  },
})

export const remove_node = tool({
  description: "Remove um no e todas as arestas conectadas a ele",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
    id: tool.schema.string().describe("ID do no a remover"),
  },
  async execute(args) {
    const data = load(args.file)
    const idx = data.nodes.findIndex(n => n.id === args.id)
    if (idx === -1) {
      return JSON.stringify({ status: "error", message: `No "${args.id}" nao encontrado` })
    }

    data.nodes.splice(idx, 1)
    const removedEdges = []
    for (let i = data.edges.length - 1; i >= 0; i--) {
      if (data.edges[i].fromNode === args.id || data.edges[i].toNode === args.id) {
        removedEdges.push(data.edges[i].id)
        data.edges.splice(i, 1)
      }
    }

    save(args.file, data)
    return JSON.stringify({
      status: "ok",
      operation: "remove_node",
      removedNode: args.id,
      removedEdges,
      totalNodes: data.nodes.length,
      totalEdges: data.edges.length,
    }, null, 2)
  },
})

export const add_edge = tool({
  description: "Adiciona uma aresta entre dois nos com smart route automatico",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
    fromNode: tool.schema.string().describe("ID do no de origem"),
    toNode: tool.schema.string().describe("ID do no de destino"),
    label: tool.schema.string().optional().describe("Rotulo da aresta"),
    color: tool.schema.string().optional().describe("Cor (1-6)"),
    fromSide: tool.schema.string().optional().describe("Lado de origem (top/bottom/left/right)"),
    toSide: tool.schema.string().optional().describe("Lado de destino (top/bottom/left/right)"),
  },
  async execute(args) {
    const data = load(args.file)
    const from = data.nodes.find(n => n.id === args.fromNode)
    const to = data.nodes.find(n => n.id === args.toNode)

    if (!from) return JSON.stringify({ status: "error", message: `No origem "${args.fromNode}" nao encontrado` })
    if (!to) return JSON.stringify({ status: "error", message: `No destino "${args.toNode}" nao encontrado` })

    let fs = args.fromSide
    let ts = args.toSide
    if (!fs || !ts) {
      const r = smartRoute(from, to)
      fs = fs || r.fromSide
      ts = ts || r.toSide
    }

    const edge = {
      id: `e_${args.fromNode}_${args.toNode}`,
      fromNode: args.fromNode,
      toNode: args.toNode,
      fromSide: fs,
      toSide: ts,
    }
    if (args.label) edge.label = args.label
    if (args.color) edge.color = args.color

    data.edges.push(edge)
    save(args.file, data)

    const warnings = []
    const r = smartRoute(from, to)
    if (fs !== r.fromSide || ts !== r.toSide) {
      warnings.push(`Roteamento sugerido: ${r.fromSide}→${r.toSide} (atual: ${fs}→${ts})`)
    }

    return JSON.stringify({
      status: "ok",
      operation: "add_edge",
      edge,
      warnings,
      totalEdges: data.edges.length,
    }, null, 2)
  },
})

export const remove_edge = tool({
  description: "Remove uma aresta pelo ID",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
    id: tool.schema.string().describe("ID da aresta a remover"),
  },
  async execute(args) {
    const data = load(args.file)
    const idx = data.edges.findIndex(e => e.id === args.id)
    if (idx === -1) {
      return JSON.stringify({ status: "error", message: `Aresta "${args.id}" nao encontrada` })
    }

    data.edges.splice(idx, 1)
    save(args.file, data)
    return JSON.stringify({
      status: "ok",
      operation: "remove_edge",
      removedEdge: args.id,
      totalEdges: data.edges.length,
    }, null, 2)
  },
})

export const auto_route = tool({
  description: "Corrige o roteamento de todas as arestas do canvas usando smart route",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
  },
  async execute(args) {
    const data = load(args.file)
    let fixed = 0

    for (const e of data.edges) {
      const from = data.nodes.find(n => n.id === e.fromNode)
      const to = data.nodes.find(n => n.id === e.toNode)
      if (from && to) {
        const r = smartRoute(from, to)
        if (e.fromSide !== r.fromSide || e.toSide !== r.toSide) {
          e.fromSide = r.fromSide
          e.toSide = r.toSide
          fixed++
        }
      }
    }

    save(args.file, data)
    return JSON.stringify({
      status: "ok",
      operation: "auto_route",
      fixedEdges: fixed,
      totalEdges: data.edges.length,
    }, null, 2)
  },
})

export const suggest = tool({
  description: "Sugere uma posicao ideal para um novo no abaixo de um no pai, sem overlap",
  args: {
    file: tool.schema.string().describe("Caminho do arquivo .canvas"),
    parentId: tool.schema.string().describe("ID do no pai"),
    text: tool.schema.string().describe("Texto do no (para estimar tamanho)"),
    w: tool.schema.number().optional().describe("Largura (padrao 180)"),
    h: tool.schema.number().optional().describe("Altura (padrao 60)"),
  },
  async execute(args) {
    const data = load(args.file)
    const parent = data.nodes.find(n => n.id === args.parentId)
    if (!parent) {
      return JSON.stringify({ status: "error", message: `No pai "${args.parentId}" nao encontrado` })
    }

    const w = args.w || 180
    const h = args.h || 60
    const candidates = [
      { label: "abaixo (centralizado)", x: parent.x + (parent.width - w) / 2, y: parent.y + parent.height + 20 },
      { label: "direita", x: parent.x + parent.width + 20, y: parent.y },
      { label: "esquerda", x: parent.x - w - 20, y: parent.y },
    ]

    const valid = []
    for (const c of candidates) {
      const box = { x: c.x, y: c.y, width: w, height: h }
      let hasOverlap = false
      for (const n of data.nodes) {
        if (boxesOverlap(box, n)) { hasOverlap = true; break }
      }
      if (!hasOverlap) {
        valid.push(c)
      }
    }

    if (valid.length === 0) {
      const lastY = Math.max(...data.nodes.map(n => n.y + n.height)) + 20
      return JSON.stringify({
        status: "warn",
        message: "Nenhuma posicao sem overlap encontrada nas proximidades",
        suggestion: { label: "final do canvas", x: 50, y: lastY },
      }, null, 2)
    }

    return JSON.stringify({
      status: "ok",
      operation: "suggest",
      suggestions: valid,
      parentId: args.parentId,
      recommended: valid[0],
    }, null, 2)
  },
})

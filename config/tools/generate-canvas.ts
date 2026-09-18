import { tool } from "@opencode-ai/plugin"
import { join } from "path"
import { mkdirSync, writeFileSync } from "fs"

export default tool({
  description:
    "Gera um fluxograma interativo e editavel no formato Obsidian Canvas (.canvas). " +
    "O arquivo e salvo diretamente na sua vault do Obsidian. Abra o Obsidian para ve-lo.",
  args: {
    title: tool.schema.string().optional().describe("Titulo do fluxograma"),
    nodes: tool.schema.array(tool.schema.object({
      id: tool.schema.string().describe("ID unico do no"),
      text: tool.schema.string().describe("Texto do no (aceita markdown: **negrito**, listas)"),
      x: tool.schema.number().describe("Posicao X em pixels"),
      y: tool.schema.number().describe("Posicao Y em pixels"),
      w: tool.schema.number().optional().describe("Largura (padrao 160)"),
      h: tool.schema.number().optional().describe("Altura (padrao 60)"),
      color: tool.schema.enum(["1","2","3","4","5","6"]).optional().describe("Cor: 1=vermelho, 2=laranja, 3=amarelo, 4=verde, 5=ciano, 6=roxo"),
    })).describe("Nos do fluxograma"),
    edges: tool.schema.array(tool.schema.object({
      fromNode: tool.schema.string().describe("ID do no de origem"),
      toNode: tool.schema.string().describe("ID do no de destino"),
      label: tool.schema.string().optional().describe("Rotulo da conexao"),
      color: tool.schema.enum(["1","2","3","4","5","6"]).optional().describe("Cor da conexao"),
      fromSide: tool.schema.enum(["top","right","bottom","left"]).optional().describe("Lado de origem"),
      toSide: tool.schema.enum(["top","right","bottom","left"]).optional().describe("Lado de destino"),
    })).describe("Conexoes entre os nos"),
    vaultDir: tool.schema.string().optional().describe("Caminho da vault Obsidian (padrao: ~/Documents/Obsidian Vault)"),
  },
  async execute(args) {
    const vaultDir = args.vaultDir || join(process.env.USERPROFILE || "C:\\Users\\User", "Documents", "Obsidian Vault")
    mkdirSync(vaultDir, { recursive: true })

    const slug = (args.title || "fluxograma")
      .toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "fluxograma"
    const filename = `${slug}.canvas`
    const outPath = join(vaultDir, filename)

    const data = {
      nodes: (args.nodes || []).map(n => ({
        id: n.id,
        type: "text",
        text: n.text,
        x: n.x,
        y: n.y,
        width: n.w || 160,
        height: n.h || 60,
        ...(n.color ? { color: n.color } : {}),
      })),
      edges: (args.edges || []).map(e => ({
        id: `e_${e.fromNode}_${e.toNode}`,
        fromNode: e.fromNode,
        toNode: e.toNode,
        ...(e.label ? { label: e.label } : {}),
        ...(e.color ? { color: e.color } : {}),
        ...(e.fromSide ? { fromSide: e.fromSide } : {}),
        ...(e.toSide ? { toSide: e.toSide } : {}),
      })),
    }

    writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8")

    return [
      `Fluxograma criado: ${outPath}`,
      `Abra o Obsidian e veja o arquivo "${filename}" na sua vault.`,
      "",
      `📊 ${data.nodes.length} nos, ${data.edges.length} conexoes`,
      "💡 Clique no arquivo no Obsidian para abrir o Canvas interativo.",
    ].join("\n")
  },
})

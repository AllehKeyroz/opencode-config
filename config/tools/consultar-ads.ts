import { tool } from "@opencode-ai/plugin"
import { execSync } from "child_process"
import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"

const SCRIPT = process.env.CONSULTAR_ADS_SCRIPT ?? ""

export default tool("consultar-ads", {
  description: "Consulta a Biblioteca de Anúncios do Meta (Meta Ads Library) via navegador headless. Pesquisa anúncios ativos/inativos de qualquer anunciante ou palavra-chave e extrai dados estruturados (ID, página, status, texto, link, CTA, tipo).",
  parameters: {
    type: "object",
    properties: {
      termo: { type: "string", description: "Termo de busca (ex: 'canal do holder', 'curso criptomoedas')" }
    },
    required: ["termo"]
  }
}, async ({ termo }: { termo: string }) => {
  if (!SCRIPT) return "Erro: defina a variavel de ambiente CONSULTAR_ADS_SCRIPT com o caminho do script consultar_ads.py"
  const outDir = join(process.env.USERPROFILE!, "Documents", "consultas-ads")
  mkdirSync(outDir, { recursive: true })

  const cmd = `python "${SCRIPT}" "${termo.replace(/"/g, '\\"')}"`
  const stdout = execSync(cmd, { encoding: "utf-8", timeout: 60000 })

  const linhas = stdout.split("\n")
  const resumo = linhas.filter(l =>
    l.includes("Total:") || l.includes("[ATIVO]") || l.includes("[INATIVO]") || l.includes("[Salvo]")
  ).join("\n")

  return { resumo, log: stdout.slice(0, 3000) }
})
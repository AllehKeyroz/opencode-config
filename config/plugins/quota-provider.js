import { tool } from "@opencode-ai/plugin"
import * as fs from "node:fs/promises"
import * as path from "node:path"
import { homedir } from "node:os"

const AUTH_PATH = path.join(homedir(), ".local", "share", "opencode", "auth.json")
const STATE_DIR = path.join(homedir(), ".cache", "opencode-quota")
const STATE_FILE = path.join(STATE_DIR, "state.json")

async function readAuth() {
  try {
    const raw = await fs.readFile(AUTH_PATH, "utf-8")
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeState(state) {
  try {
    await fs.mkdir(STATE_DIR, { recursive: true })
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8")
  } catch {
  }
}

function calcPct(raw, limit) {
  if (limit === "unlimited" || limit === null || limit === undefined) return 0
  if (typeof raw !== "number" || typeof limit !== "number" || limit === 0) return 0
  return Math.min(100, Math.round((raw / limit) * 100))
}

function formatUsage(raw) {
  if (typeof raw !== "number") return "$0"
  if (raw < 0.01) return "$0"
  if (raw < 1) return `$${raw.toFixed(4)}`
  return `$${raw.toFixed(2)}`
}

function enrichForTui(raw) {
  if (raw.noBilling) {
    return {
      name: raw.provider,
      plan: raw.plan ?? "",
      usagePct: 0,
      usageLabel: "N/A",
      limitLabel: "",
      error: null,
      noBilling: true
    }
  }
  if (raw.remainingFraction !== undefined) {
    const pct = Math.round(raw.remainingFraction * 100)
    return {
      name: raw.provider,
      plan: raw.plan,
      usagePct: 100 - pct,
      usageLabel: `${100 - pct}% usado`,
      limitLabel: `${pct}% restante`,
      error: raw.error ?? null,
      noBilling: false
    }
  }
  const pct = calcPct(raw.usage?.monthly ?? raw.usage?.total, raw.limit === "unlimited" ? null : raw.limit)
  return {
    name: raw.provider,
    plan: raw.plan,
    usagePct: pct === 0 && raw.limit !== "unlimited" ? 1 : pct,
    usageLabel: `\$${((raw.usage?.monthly ?? raw.usage?.total ?? 0)).toFixed(typeof raw.usage?.monthly === "number" ? 2 : 4)}`,
    limitLabel: raw.limit === "unlimited" ? "ilimitado" : raw.limit === "estourado" ? "estourado" : `\$${raw.limit}`,
    error: raw.error ?? null,
    noBilling: false
  }
}

const IMAGEGEN_STATE = path.join(STATE_DIR, "imagegen.json")

function formatDate(epochSec) {
  const d = new Date(epochSec * 1000)
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC"
}

async function checkGptImagegen() {
  try {
    const raw = await fs.readFile(IMAGEGEN_STATE, "utf-8")
    const state = JSON.parse(raw)
    const now = Math.floor(Date.now() / 1000)
    const remaining = state.resetsAt - now
    if (remaining <= 0) {
      return { provider: "GPT Imagegen", plan: "Free (Codex)", usage: {}, limit: "disponivel", noBilling: false, error: null, limitReset: null }
    }
    const days = Math.floor(remaining / 86400)
    const hours = Math.floor((remaining % 86400) / 3600)
    return {
      provider: "GPT Imagegen",
      plan: "Free (Codex)",
      usage: {},
      limit: "estourado",
      limitReset: formatDate(state.resetsAt),
      limitResetSeconds: remaining,
      limitResetLabel: `~${days}d ${hours}h`,
      error: null,
      noBilling: false
    }
  } catch {
    return { provider: "GPT Imagegen", noBilling: true }
  }
}

async function checkOpenRouter(auth) {
  const key = auth?.openrouter?.key
  if (!key) return null
  try {
    const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
      headers: { Authorization: `Bearer ${key}` }
    })
    if (!res.ok) return { provider: "OpenRouter", error: `HTTP ${res.status}` }
    const json = await res.json()
    const d = json.data
    const result = {
      provider: "OpenRouter",
      plan: d.is_free_tier ? "Free" : "Paid",
      usage: {
        total: d.usage ?? 0,
        daily: d.usage_daily ?? 0,
        weekly: d.usage_weekly ?? 0,
        monthly: d.usage_monthly ?? 0
      },
      limit: d.limit ?? "unlimited",
      limitRemaining: d.limit_remaining ?? "unlimited",
      limitReset: d.limit_reset
    }
    return result
  } catch (err) {
    return { provider: "OpenRouter", error: err.message }
  }
}

async function checkAntigravityImagegen() {
  try {
    const acctsPath = path.join(homedir(), "AppData", "Roaming", "opencode", "antigravity-accounts.json")
    const raw = await fs.readFile(acctsPath, "utf-8")
    const data = JSON.parse(raw)
    const quota = data?.accounts?.[0]?.cachedQuota?.["gemini-image"]
    if (!quota) return { provider: "Gemini Image", noBilling: true }
    const pct = Math.round(quota.remainingFraction * 100)
    const label = `${pct}% restante`
    const resetLabel = quota.resetTime ? `${new Date(quota.resetTime).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC` : null
    return {
      provider: "Gemini Image",
      plan: "Antigravity",
      remainingFraction: quota.remainingFraction,
      limit: label,
      limitRemaining: label,
      limitReset: resetLabel,
      error: null,
      noBilling: false
    }
  } catch {
    return { provider: "Gemini Image", noBilling: true }
  }
}

const PROVIDERS = [checkOpenRouter, checkGptImagegen, checkAntigravityImagegen]

const QuotaPlugin = async () => {
  return {
    tool: {
      check_quotas: tool({
        description: "Check usage quotas and billing status for all connected AI providers. Returns current usage, limits, and plan information.",
        args: {
          refresh: tool.schema.boolean().optional().describe("Force refresh instead of using cached data")
        },
        async execute(args, ctx) {
          const auth = await readAuth()
          let results = []
          for (const check of PROVIDERS) {
            const r = await check(auth)
            if (r) {
              results.push(r)
            }
          }
          const stateForTui = {
            timestamp: new Date().toISOString(),
            providers: results.map(r => enrichForTui(r))
          }
          await writeState(stateForTui)
          if (results.length === 0) {
            return "Nenhum provider encontrado no auth.json."
          }
          let lines = ["┌──────────────────────────────────────────┐"]
          lines.push("│          CHECK_QUOTAS - RESULTADO         │")
          lines.push("├──────────────────────────────────────────┤")
          for (const p of results) {
            if (p.noBilling) {
              lines.push(`│ ${(p.provider || "").padEnd(40)} │`)
              lines.push(`│   Sem API de billing pública         │`)
            } else if (p.error) {
              lines.push(`│ ${(p.provider || "").padEnd(40)} │`)
              lines.push(`│   Erro: ${(p.error || "").padEnd(35)} │`)
            } else {
              lines.push(`│ ${(p.provider || "").padEnd(40)} │`)
              lines.push(`│   Plano: ${(p.plan || "").padEnd(34)} │`)
              if (typeof p.usage?.total === "number") {
                const total = `Uso total: $${p.usage.total.toFixed(4)}`
                lines.push(`│   ${total.padEnd(42)} │`)
              }
              if (typeof p.usage?.monthly === "number") {
                const monthly = `Uso mensal: $${p.usage.monthly.toFixed(4)}`
                lines.push(`│   ${monthly.padEnd(42)} │`)
              }
              if (typeof p.usage?.weekly === "number") {
                const weekly = `Uso semanal: $${p.usage.weekly.toFixed(4)}`
                lines.push(`│   ${weekly.padEnd(42)} │`)
              }
              const limit = p.limit === "unlimited" ? "Limite: Ilimitado" : p.limit === "estourado" ? "Limite: Estourado" : p.remainingFraction !== undefined ? `Dispon�vel: ${p.limit}` : `Limite: $${p.limit}`
              lines.push(`�"'   ${limit.padEnd(42)} �"'`)
              if (p.limitReset) {
                lines.push(`�"'   Reset: ${(`~${p.limitReset}`).padEnd(40)} �"'`)
              }
            }
            lines.push("├──────────────────────────────────────────┤")
          }
          return lines.join("\n")
        }
      })
    }
  }
}

export default QuotaPlugin

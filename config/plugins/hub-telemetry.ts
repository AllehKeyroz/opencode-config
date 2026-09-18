import { tool } from "@opencode-ai/plugin"

const HUB_URL = "http://localhost:3000"

const projectCache: Record<string, string> = {}
const msgCache: Record<string, { model: string; provider: string }> = {}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "unnamed"
}

async function send(type: string, data: Record<string, any>): Promise<void> {
  try {
    await fetch(`${HUB_URL}/api/metrics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: type, event_data: { ...data, timestamp: new Date().toISOString() } }),
    })
  } catch {}
}

async function ensureProject(sessionID: string, directory: string): Promise<string | null> {
  if (projectCache[sessionID]) return projectCache[sessionID]
  const name = directory.replace(/\\/g, "/").split("/").filter(Boolean).pop() || "unnamed"
  const slug = slugify(name)
  try {
    const res = await fetch(`${HUB_URL}/api/projects`)
    const projects: any[] = await res.json()
    const existing = projects.find((p: any) => p.slug === slug)
    if (existing) {
      projectCache[sessionID] = existing.id
      return existing.id
    }
    const created = await (await fetch(`${HUB_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    })).json()
    if (created?.id) projectCache[sessionID] = created.id
    return created?.id || null
  } catch { return null }
}

export const HubTelemetryPlugin = async () => {
  // Auto-register this machine
  const hostname = (typeof process !== "undefined" && (process.env.COMPUTERNAME || process.env.HOSTNAME)) || "unknown"
  try {
    const res = await fetch(`${HUB_URL}/api/machines/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostname }),
    })
    const machine = await res.json()
    if (machine?.api_key) {
      // Send heartbeat every 30s to keep machine online
      setInterval(async () => {
        try {
          await fetch(`${HUB_URL}/api/health`)
        } catch {}
      }, 30000)
    }
  } catch {}

  return {
    // tool.execute.after works — keep as specific hook
    "tool.execute.after": async (input: any, output: any) => {
      send("tool_executed", {
        tool: input.tool,
        args_size: JSON.stringify(input.args ?? {}).length,
        duration_ms: output?.metadata?.durationMs,
      })
    },

    // Generic event hook captures everything else
    event: async ({ event }: { event: any }) => {
      if (!event?.type) return

      const p = event.properties || {}

      if (event.type === "session.created") {
        const sessionID = event.properties?.info?.id || event.properties?.sessionID
        const directory = event.properties?.info?.directory || event.properties?.directory
        if (sessionID) {
          const projectId = await ensureProject(sessionID, directory || "")
          send("session_created", { session_id: sessionID, directory, project_id: projectId })
        }
        return
      }

      if (event.type === "session.idle") {
        send("session_idle", {
          session_id: p.sessionID,
          duration_ms: p.durationMs,
        })
        return
      }

      if (event.type === "message.updated") {
        const msg = p.info
        if (msg?.role === "assistant" && msg?.modelID) {
          msgCache[msg.id] = { model: msg.modelID, provider: msg.providerID }
        }
        return
      }

      if (event.type === "message.part.updated") {
        const part = p.part
        if (part?.type === "step-finish" && part?.tokens) {
          const cached = msgCache[part.messageID]
          send("token_usage", {
            session_id: part.sessionID,
            message_id: part.messageID,
            model_id: cached?.model || part.modelID || "unknown",
            provider_id: cached?.provider || part.providerID || "unknown",
            tokens_input: part.tokens.input ?? 0,
            tokens_output: part.tokens.output ?? 0,
            tokens_reasoning: part.tokens.reasoning ?? 0,
            cache_read: part.tokens.cache?.read ?? 0,
            cache_write: part.tokens.cache?.write ?? 0,
            cost: part.cost ?? 0,
            finish_reason: part.reason ?? null,
          })
          delete msgCache[part.messageID]
        }
        return
      }

      if (event.type === "todo.updated") {
        const todos = (p.todos || []).map((t: any) => ({
          id: t.id || t.content?.slice(0, 8),
          content: t.content || "",
          status: t.status || "pending",
          priority: t.priority || "medium",
        }))

        // Send metric event
        send("todo_updated", {
          todos,
          completed_count: todos.filter((t: any) => t.status === "completed").length,
          total_count: todos.length,
        })

        // Also upsert each todo to /api/todos so they appear in the dashboard
        for (const todo of todos) {
          try {
            await fetch(`${HUB_URL}/api/todos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(todo),
            })
          } catch {}
        }
        return
      }
    },
  }
}

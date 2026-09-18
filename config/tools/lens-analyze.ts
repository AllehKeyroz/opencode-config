import { tool } from "@opencode-ai/plugin"
import { readFileSync, existsSync } from "fs"

// ============================================================
// PROTOBUF MANUAL
// Field numbers do proto compilado (chrome-lens-py)
// ============================================================

function vi(n: number): Buffer {
  const b: number[] = []
  while (n > 0x7f) { b.push((n & 0x7f) | 0x80); n >>>= 7 }
  b.push(n & 0x7f)
  return Buffer.from(b)
}

function fVarint(tag: number, v: number): Buffer {
  return Buffer.concat([vi((tag << 3) | 0), vi(v)])
}

function f64(tag: number, v: number): Buffer {
  const b = Buffer.alloc(8)
  b.writeBigInt64LE(BigInt(v), 0)
  return Buffer.concat([vi((tag << 3) | 1), b])
}

function fStr(tag: number, s: string): Buffer {
  const b = Buffer.from(s, "utf-8")
  return Buffer.concat([vi((tag << 3) | 2), vi(b.length), b])
}

function fBytes(tag: number, b: Buffer): Buffer {
  return Buffer.concat([vi((tag << 3) | 2), vi(b.length), b])
}

// ============================================================
// BUILD OCR PAYLOAD
// ============================================================

function buildOcr(img: Buffer, w: number, h: number): Buffer {
  const uuid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

  // ObjectsRequest (field 1)
  //   request_context (field 1)
  //     request_id (field 3) = wrapper msg { uuid(1), seq_id(2), img_seq_id(3) }
  //     client_context (field 4)
  //       platform(1)=3, surface(2)=4, locale_context(4)={ region(2), time_zone(3) }
  //   image_data (field 2)
  //     payload(1)={ image_bytes(1) }
  //     image_metadata(2)={ width(1), height(2) }
  //     zoom_level(3)

  const rid = fBytes(3, Buffer.concat([
    f64(1, uuid), fVarint(2, 1), fVarint(3, 1),
  ]))

  const locale = Buffer.concat([
    fStr(2, "US"), fStr(3, "America/New_York"),
  ])

  const cc = Buffer.concat([
    fVarint(1, 3), fVarint(2, 4), fBytes(4, locale),
  ])

  const rctx = Buffer.concat([
    fBytes(3, rid), fBytes(4, cc),
  ])

  const pl = fBytes(1, img)
  // ImageMetadata at field 3, ImageData at field 3
  const meta = Buffer.concat([fVarint(1, w), fVarint(2, h)])
  const imgd = Buffer.concat([fBytes(1, pl), fBytes(3, meta), fVarint(3, 0)])

  return fBytes(1, Buffer.concat([fBytes(1, rctx), fBytes(3, imgd)]))
}

// ============================================================
// PARSE RESPONSE
// ============================================================

function* fields(data: Buffer): Generator<{ tag: number; val: Buffer }> {
  let pos = 0
  while (pos < data.length) {
    const key = data[pos++]; const tag = key >> 3, wt = key & 0x7
    if (wt === 2) {
      const l = readV(data, pos)[0]; const vpos = pos + vi(l).length
      yield { tag, val: data.subarray(vpos, vpos + l) }
      pos = vpos + l
    } else if (wt === 0) { const [, p] = readV(data, pos); pos = p }
    else if (wt === 1) { pos += 8 }
    else if (wt === 5) { pos += 4 }
    else break
  }
}

function readV(data: Buffer, pos: number): [number, number] {
  let val = 0, shift = 0
  while (pos < data.length) {
    const b = data[pos++]
    val |= (b & 0x7f) << shift; shift += 7
    if (!(b & 0x80)) break
  }
  return [val, pos]
}

function parseResp(data: Buffer): string {
  // Estrutura real (field numbers confirmados por analise binaria):
  //   root tag 2 = objects_response
  //     tag 3 = Text (nao tag 2!)
  //       tag 1 = text_layout
  //         tag 1 = paragraph (repeated)
  //           tag 2 = line (repeated)
  //             tag 1 = word (repeated)
  //               tag 1 = plain_text
  //               tag 2 = text_separator
  for (const f of fields(data)) {
    if (f.tag !== 2) continue
    for (const sf of fields(f.val)) {
      if (sf.tag !== 3) continue
      for (const tf of fields(sf.val)) {
        if (tf.tag !== 1) continue
        const words: { t: string; s: string }[] = []
        for (const pf of fields(tf.val)) {
          if (pf.tag !== 1) continue
          for (const lf of fields(pf.val)) {
            if (lf.tag !== 2) continue
            for (const wf of fields(lf.val)) {
              if (wf.tag !== 1) continue
              let text = "", sep = " "
              for (const wsf of fields(wf.val)) {
                if (wsf.tag === 2) text = wsf.val.toString("utf-8")
                if (wsf.tag === 3) sep = wsf.val.toString("utf-8")
              }
              if (text) words.push({ t: text, s: sep })
            }
          }
        }
        if (words.length) return words.map(w => w.t + w.s).join("").trim()
      }
    }
  }
  return ""
}

// ============================================================
// HTTP
// ============================================================

const ENDPOINT = "https://lensfrontend-pa.googleapis.com/v1/crupload"
const API_KEY = process.env.GOOGLE_LENS_API_KEY ?? ""

async function send(payload: Buffer): Promise<Buffer> {
  const resp = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-protobuf",
      "X-Goog-Api-Key": API_KEY,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: payload,
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${(await resp.text()).substring(0, 200)}`)
  return Buffer.from(await resp.arrayBuffer())
}

// ============================================================
// IMAGE DIMENSIONS
// ============================================================

function dims(path: string): [number, number] {
  const b = readFileSync(path)
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i < b.length - 1;) {
      if (b[i] === 0xff && (b[i + 1] === 0xc0 || b[i + 1] === 0xc1 || b[i + 1] === 0xc2))
        return [(b[i + 7] << 8) | b[i + 8], (b[i + 5] << 8) | b[i + 6]]
      i += 2 + ((b[i + 2] << 8) | b[i + 3])
    }
  }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return [b.readUInt32BE(16), b.readUInt32BE(20)]
  return [0, 0]
}

// ============================================================
// TOOL
// ============================================================

export default tool({
  description: "Analisa uma imagem usando Google Lens. Extrai texto (OCR) da imagem.",
  args: {
    imagePath: {
      type: "string",
      description: "Caminho absoluto da imagem (png, jpg, webp)"
    },
  },
  async execute({ imagePath }) {
    if (!API_KEY) return "Erro: defina a variavel de ambiente GOOGLE_LENS_API_KEY"
    if (!existsSync(imagePath)) return `Arquivo nao encontrado: ${imagePath}`

    try {
      const [w, h] = dims(imagePath)
      const img = readFileSync(imagePath)
      const payload = buildOcr(img, w, h)
      const raw = await send(payload)
      const text = parseResp(raw)
      return text || "(nenhum texto detectado)"
    } catch (err) {
      return `Erro: ${err instanceof Error ? err.message : String(err)}`
    }
  },
})

import { tool } from "@opencode-ai/plugin"
import { join } from "path"

export default tool({
  description: "Salva imagem da area de transferencia do usuario para um arquivo temporario e retorna o caminho completo. Use SEMPRE que o usuario colar uma imagem e voce nao conseguir processa-la diretamente",
  args: {},
  async execute() {
    const tmpdir = join(
      process.env.USERPROFILE || "C:\\Users\\User",
      "AppData", "Local", "Temp", "opencode"
    )
    const outPath = join(tmpdir, "clipboard_image.png")
    const psScript = join(tmpdir, "save_clipboard.ps1")

    const code = [
      'Add-Type -AssemblyName System.Windows.Forms,System.Drawing',
      'if ([System.Windows.Forms.Clipboard]::ContainsImage()) {',
      "  $img = [System.Windows.Forms.Clipboard]::GetImage()",
      "  $w = $img.Width",
      "  $h = $img.Height",
      `  $img.Save('${outPath}', [System.Drawing.Imaging.ImageFormat]::Png)`,
      "  $img.Dispose()",
      '  Write-Host "OK ${w}x${h}"',
      '} else {',
      '  Write-Host "NO_IMAGE"',
      '}'
    ].join("\n")

    await Bun.write(psScript, code)
    const proc = Bun.$`powershell -NoProfile -ExecutionPolicy Bypass -File ${psScript}`
    const out = (await proc.text()).trim()

    if (out === "NO_IMAGE") {
      return "Nenhuma imagem na area de transferencia"
    }

    return outPath
  },
})

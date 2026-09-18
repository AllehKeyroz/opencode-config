' OpenCode Hub — Silent Launcher (no windows, no terminals)
' Uses full paths to avoid PATH issues in wscript.exe context

Dim shell, serverDir, dashDir, nodeJs, npxExe
Set shell = CreateObject("WScript.Shell")

serverDir = "C:\KEYROZ DIGITAL SOLUTIONS\opencode\packages\server"
dashDir   = "C:\KEYROZ DIGITAL SOLUTIONS\opencode\packages\dashboard"
nodeJs    = "C:\Program Files\nodejs\node.exe"
npxExe    = "C:\Program Files\nodejs\npx.cmd"

' Start Hub Server (hidden window, no terminal)
shell.CurrentDirectory = serverDir
shell.Run """" & nodeJs & """ --import tsx/esm src/index.ts", 0, False

' Wait for server to be ready
WScript.Sleep 5000

' Start Dashboard (hidden window, no terminal)
shell.CurrentDirectory = dashDir
shell.Run """" & npxExe & """ vite --port 5173", 0, False

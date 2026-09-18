# opencode-config

Configurações personalizadas do OpenCode (Keyroz), prontas para replicar em qualquer máquina Windows.

## Estrutura

```
opencode-config/
├── config/          → conteúdo de ~/.config/opencode
│   ├── opencode.jsonc      # config principal (MCP, providers, plugins, permissões)
│   ├── opencode.json       # provider 9router (apiKey via env)
│   ├── tui.json            # sidebar de quota
│   ├── cursor.js           # cursor visual do Playwright
│   ├── AGENTS.md           # regras globais
│   ├── agents/             # ask, build, critico-logica
│   ├── command/            # comando generate-image
│   ├── skills/             # whimsical-mermaid
│   ├── tools/              # canvas, clipboard-image, consultar-ads, generate-*, lens-analyze
│   └── plugins/            # keyroz, quota-provider, quota-sidebar, hub-telemetry, antigravity-image
├── dot-opencode/    → conteúdo selecionado de ~/.opencode
│   ├── opencode.json
│   ├── hub/                # scripts do Hub
│   ├── scripts/            # trigger-task, ai_news_summary, check-gbp-api
│   ├── tasks/              # tasks.json + histórico (completed/)
│   └── tools/              # gbp-manager (código) + ghl-search
├── skills/          → skills pessoais (de ~/.agents/skills), sem duplicatas
│   ├── comfy-image-generator, funnel-architect, gerar-estrategia-keyroz,
│   ├── gerar-implementacao-ghl, niche-research
│   └── maestri, maestri-manager, maestri-portal, maestri-portal-devices,
│       maestri-routines, maestri-workspace
├── install.ps1      → script de instalação com backup
└── .env.example     → template das variáveis de ambiente
```

## Instalação em outra máquina

```powershell
# 1. Clonar
git clone https://github.com/AllehKeyroz/opencode-config.git
cd opencode-config

# 2. Instalar (faz backup do que já existir)
powershell -ExecutionPolicy Bypass -File .\install.ps1

# 3. Configurar segredos
Copy-Item .env.example $env:USERPROFILE\.config\opencode\.env
# ...edite o .env e preencha as chaves reais
```

### Dependências (após instalar)

```powershell
# Config principal (plugins/tools TS)
cd $env:USERPROFILE\.config\opencode; npm install

# Plugin antigravity-image (instalar + buildar o dist)
cd $env:USERPROFILE\.config\opencode\plugins\opencode-antigravity-image
bun install
bun build src/index.ts --outdir dist --target node

# gbp-manager (Google Business Profile)
cd $env:USERPROFILE\.opencode\tools\gbp-manager; npm install
```

## O que NÃO está no repo (de propósito)

- **Segredos**: `secrets/`, `antigravity-accounts.json`, `.env`, apiKey do 9router e Google Lens key (substituídos por env vars).
- **`plugins/opencode-antigravity-image/dist/`**: o bundle embute o client id/secret OAuth do Antigravity. Só o `src/` foi versionado — o `dist/` é gerado no build (`bun build src/index.ts --outdir dist --target node`).
- **node_modules/** (em qualquer lugar).
- **browser-profile/** (~450 MB de perfil do navegador).
- **generated-images/** e dumps de dados do gbp-manager (`assets-catalog.json`, `ghl-schemas-complete.json`, `ghl-saved-workflow.json`, etc.).
- **projects/** e `tasks/temp/` (artefatos, não são personalização).
- Plugins `opencode-nordy-auth` e `opencode-comet-auth` (excluídos por escolha — só o antigravity foi versionado).

## Avisos

1. **Caminhos absolutos**: `opencode.jsonc`, `tui.json` e `hub/hub.ps1` contêm paths com `C:\Users\User\`. Se o usuário do Windows for diferente, ajuste antes de usar.
2. **`opencode.json` vs `opencode.jsonc`**: ambos existem na pasta config. O OpenCode prioriza um deles — se o provider 9router não aparecer, verifique qual está sendo carregado.
3. **`consultar-ads.ts`** referencia um script Python externo (`C:\KEYROZ DIGITAL SOLUTIONS\Agents skills\...\consultar_ads.py`) que não está versionado aqui.
4. **Referências a plugins ausentes**: `opencode.jsonc` ainda lista `opencode-nordy-auth` e `opencode-comet-auth`. Como esses plugins não foram versionados, remova essas linhas ou instale os plugins na máquina de destino.

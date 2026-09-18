# opencode-config

Configurações personalizadas do OpenCode (Keyroz), prontas para replicar em qualquer máquina Windows.

## Estrutura

```
opencode-config/
├── config/          → conteúdo de ~/.config/opencode
│   ├── opencode.jsonc      # config principal (MCP, providers, plugins, permissões)
│   ├── opencode.json       # provider 9router (apiKey via env)
│   ├── cursor.js           # cursor visual do Playwright
│   ├── AGENTS.md           # regras globais
│   ├── agents/             # ask, build, critico-logica
│   ├── command/            # comando generate-image
│   ├── skills/             # whimsical-mermaid
│   ├── tools/              # canvas, consultar-ads, generate-canvas, generate-diagram
│   └── plugins/            # opencode-antigravity-image (somente src/)
├── dot-opencode/    → conteúdo selecionado de ~/.opencode
│   ├── opencode.json       # plugin 9router
│   └── tools/              # gbp-manager (código) + ghl-search
├── skills/          → skills pessoais (de ~/.agents/skills)
│   ├── gerar-estrategia-keyroz
│   ├── gerar-implementacao-ghl
│   └── niche-research
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

- **Segredos**: `secrets/`, `antigravity-accounts.json`, `.env`, apiKey do 9router (substituído por env var).
- **`plugins/opencode-antigravity-image/dist/`**: o bundle embute o client id/secret OAuth do Antigravity. Só o `src/` foi versionado — o `dist/` é gerado no build.
- **node_modules/** (em qualquer lugar).
- **browser-profile/** (~450 MB de perfil do navegador).
- **generated-images/** e dumps de dados do gbp-manager (`assets-catalog.json`, `ghl-schemas-complete.json`, `ghl-saved-workflow.json`, etc.).

## Avisos

1. **Caminhos absolutos**: `opencode.jsonc` contém paths com `C:\Users\User\`. Se o usuário do Windows for diferente, ajuste antes de usar.
2. **`opencode.json` vs `opencode.jsonc`**: ambos existem na pasta config. O OpenCode prioriza um deles — se o provider 9router não aparecer, verifique qual está sendo carregado.
3. **`consultar-ads.ts`** referencia um script Python externo (`C:\KEYROZ DIGITAL SOLUTIONS\Agents skills\...\consultar_ads.py`) que não está versionado aqui.

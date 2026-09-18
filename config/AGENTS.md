# Global Rules

## Clipboard Image

Quando o usuario tentar colar uma imagem que voce nao consegue ver (erro "Cannot read clipboard"), use a ferramenta `clipboard-image` para salvar a imagem da area de transferencia em um arquivo temporario. Depois, invoque o subagente `vision` (Kimi K2.7 Code, modelo `opencode-go/kimi-k2.7-code`) passando o caminho do arquivo para processar a imagem com visao nativa.

Fluxo:
1. Chame `clipboard-image` â†’ retorna o caminho da imagem salva
2. Invoque `task` com `subagent_type: "vision"` passando o caminho da imagem
3. Entregue o resultado da analise ao usuario

Isso funciona em QUALQUER conversa, independente do modelo principal.

## Geracao de Imagens

Para gerar imagens, SEMPRE use a ferramenta `generate_image` (fornecida pelo plugin opencode-antigravity-image).
NUNCA use Pollinations.ai.

### Como funciona:
1. O usuario pede uma imagem no chat.
2. Voce invoca a ferramenta `generate_image({ prompt: "descrio detalhada" })`.
3. A imagem sera gerada via Gemini Flash e salva localmente.
4. DEPOIS que a ferramenta retornar o caminho do arquivo, use a ferramenta `read` lendo o caminho da imagem gerada para exibi-la no chat.

## Playwright MCP (Navegador)

O servidor MCP `playwright` esta disponivel. Use-o quando o usuario pedir para:
- Testar uma aplicacao web
- Navegar em um site e extrair informacoes
- Preencher formularios e simular fluxos
- Capturar screenshot de paginas
- Debugar problemas de frontend

Configurado com:
- `--viewport-size 1280x720` (tamanho padrao)
- `--init-script cursor.js` (cursor visual automatico em toda pagina)
- `--caps devtools` (destaque visual)

O cursor azul e injetado automaticamente em TODAS as paginas via `--init-script`, sem necessidade de chamar `browser_evaluate`.

Fluxo:
1. Use as ferramentas `browser_navigate`, `browser_click`, `browser_type`, etc. para interagir com a pagina
2. **Antes de comecar**, maximize a janela: `browser_evaluate` com `() => window.moveTo(0,0) || window.resizeTo(screen.availWidth, screen.availHeight)`
3. Prefira `browser_snapshot` para ler conteudo textual do DOM. So use `browser_take_screenshot` + subagente `vision` quando precisar de analise VISUAL (cores, layout, imagens)
4. Para interagir: use `browser_snapshot` com `boxes: true` para coordenadas, `browser_mouse_move_xy` para mover o cursor, `browser_mouse_click_xy` para clicar
5. Evite snapshots profundos desnecessarios. Use `depth: 3-4` para leitura rapida, aumento apenas quando precisar de mais detalhes

## Geracao de Diagramas (Excalidraw)

A ferramenta `generate-diagram` esta disponivel para criar diagramas visuais editaveis no VS Code.

### Tipos suportados
- **flowchart** â€” Fluxograma com passos, setas e cores
- **infographic** â€” Infografico com secoes, icones e cores
- **mindmap** â€” Mapa mental com nos e conexoes
- **wireframe** â€” Esboco de telas para apps/sites

### Fluxo
1. Identifique a necessidade de um diagrama (ex: explicar fluxo, mostrar dados)
2. Use `generate-diagram` com o tipo adequado
3. O arquivo `.excalidraw` sera criado em `C:\KEYROZ DIGITAL SOLUTIONS\Marketing\Visuals\`
4. Informe o usuario que pode abrir com duplo clique no VS Code

### Regras IMPORTANTES ao usar

1. **SEMPRE passe textos descritivos** â€” a forma auto-dimensiona com base no texto. Evite textos muito longos (max 4 linhas por passo).
2. **Tudo fica agrupado** â€” todos os elementos compartilham o mesmo grupo. Arraste QUALQUER peca que tudo se move junto.
3. **Setas ficam COLADAS nas bordas** â€” use `startBinding` + `endBinding` com `fixedPoint`. Arrastar um bloco faz a seta acompanhar.

### Exemplo de uso
```
generate-diagram({
  type: "flowchart",
  title: "Meu Processo",
  steps: [
    { text: "Pesquisa de Mercado", color: "#74b9ff" },
    { text: "Criacao de Conteudo", color: "#81ecec" },
    { text: "Distribuicao", color: "#ffeaa7" },
    { text: "Analise de Dados", color: "#fab1a0" },
  ]
})
```

## Canvas Tools (canvas_*)

Para edicao incremental de arquivos .canvas, use as tools `canvas_*`:

- `canvas_inspect` â€” Le .canvas e retorna estrutura + problemas
- `canvas_add_node` â€” Adiciona no com validacao de overlap (recusa se sobrepor)
- `canvas_move_node` â€” Move/redimensiona no
- `canvas_remove_node` â€” Remove no + arestas
- `canvas_add_edge` â€” Adiciona aresta com smart route automatico
- `canvas_remove_edge` â€” Remove aresta pelo ID
- `canvas_auto_route` â€” Corrige roteamento de todas as arestas
- `canvas_suggest` â€” Sugere posicao ideal para novo no

**Smart route:** usa connectFrom e detecta automaticamente bottomâ†’top, topâ†’bottom, etc.

**Overlap detection:** ao usar canvas_add_node, recusa se houver sobreposicao e sugere posicoes alternativas.

**Stream build:** use `canvas_add_node` repetidamente para construir fluxogramas no por no.

**Cores padrao:** 2=laranja (inicio/topo), 4=verde (acao/positivo), 5=ciano (decisao/analise), 6=roxo (premium/venda/destaque), 1=vermelho (exclusao/erro), 3=amarelo (aviso/alerta)

## Obsidian Canvas (Diagramas Interativos)

A ferramenta `generate-canvas` cria fluxogramas no formato **Obsidian Canvas** (.canvas) em modo batch. **Usar sob demanda do usuario.**

### Regras
- Arquivos salvos em `~/Documents/OpenCode Memory/_ðŸ“_diagramas/` (ou `KDS/<Cliente>/projetos/<projeto>/` para projetos)
- Se solicitado, no diretorio de trabalho atual
- `.mmd` correspondente deve ser salvo no **mesmo diretorio** que o `.canvas`

### Formatos suportados
- **`.canvas`** â€” Canvas nativo (editor visual interativo)
- **`.mmd`** â€” Mermaid puro para exportar ao Whimsical (mesmo diretorio)

### Exemplo
```
generate-canvas({
  title: "meu-fluxo",
  nodes: [
    { id: "n1", text: "**Inicio**", x: 50, y: 50, color: "2" },
    { id: "n2", text: "Decisao?", x: 300, y: 50, color: "5" },
  ],
  edges: [
    { fromNode: "n1", toNode: "n2", label: "vai" }
  ]
})
```

### Cores semanticas
| Cor | Uso |
|-----|-----|
| 1 vermelho | Exclusao/erro |
| 2 laranja | Inicio/topo |
| 3 amarelo | Aviso/alerta |
| 4 verde | Acao/positivo |
| 5 ciano | Decisao/analise |
| 6 roxo | Premium/venda/destaque |

## Second Brain (Memoria Persistente)

Existe uma vault do Obsidian em `~/Documents/OpenCode Memory/` com todo o contexto
do usuario e seus aprendizados.

**SEMPRE** ao iniciar uma sessao:
1. Leia `~/Documents/OpenCode Memory/Home.md` para contexto geral
2. Se trabalhando em um projeto especifico, leia a nota correspondente em `_ðŸ§ _keyroz/projetos/`
3. Consulte `_ðŸ¤–_aprendizados/` para tecnicas e preferencias relevantes

**SEMPRE** ao finalizar uma tarefa relevante:
- Atualize as notas de projeto em `_ðŸ§ _keyroz/projetos/`
- Se descobriu algo novo, escreva em `_ðŸ¤–_aprendizados/`

## Fluxogramas para Whimsical (Formato Final)

**Quando usar:** Fluxo finalizado, pronto para entrega ao cliente ou apresentacao.

### Processo
1. Desenvolvimento em `.canvas` com `canvas_*` tools (stream build)
2. Ao finalizar, gerar `.mmd` no **mesmo diretorio** do `.canvas`
3. Abrir no VS Code para o usuario copiar e colar no Whimsical

### Formato de saida
- Arquivo `.mmd` com sintaxe Mermaid pura (sem markdown em volta)
- Salvar no **mesmo diretorio** do `.canvas` correspondente
- Se nao houver `.canvas`, salvar em `~/Documents/OpenCode Memory/_ðŸ“_diagramas/`
- Se solicitado, no diretorio de trabalho atual

### Regras de estilo Whimsical
1. **Diamantes `{ }`** para decisoes, **retangulos arredondados `( )`** para acoes/funis
2. **Labels nas setas** com `-->|texto|` â€” sempre PT-BR: SIM, NAO, GRATIS, etc.
3. **Cores outline** (fundo claro + borda grossa 2px, texto #293845):
   - Decisoes: `fill:#D4F5F2,stroke:#1AAE9F` (menta)
   - Acoes: `fill:#FFF7D6,stroke:#FFD93D` (amarelo)
   - Funis: `fill:#E3F0FF,stroke:#74B9FF` (azul)
   - Inicio: `fill:#F4D0D0,stroke:#C62828` (vermelho)
   - Consultoria: `fill:#ECEAFE,stroke:#730FC3` (roxo)
   - Exclusao: `fill:#FFE0E0,stroke:#FF6B6B` (rosa)
4. **Sem subgraphs** â€” fluxo plano
5. **Layout**: `graph TD` (top-down)
6. **Acentos preservados** (UTF-8)

## Task System (Tarefas Agendadas)

O usuario pode criar tarefas que sao disparadas automaticamente pelo Windows Task Scheduler.
Quando o horario chega, o scheduler abre um **novo terminal com OpenCode** e ja envia o comando `#task <id>` como primeira mensagem.

### Estrutura
- `C:\Users\User\.opencode\tasks\tasks.json` â€” registro mestre de todas as tarefas
- `C:\Users\User\.opencode\tasks\pending\*.json` â€” tarefas aguardando execucao (ja existem desde a criacao)
- `C:\Users\User\.opencode\tasks\completed\*.json` â€” tarefas concluidas
- `C:\Users\User\.opencode\scripts\trigger-task.ps1` â€” script que dispara a task

### Gatilho
Quando o scheduler dispara, o script `trigger-task.ps1`:
1. Le o pending file (instrucoes)
2. Abre TUI com `opencode --prompt "#task <task-id>"` â€” sessao nova, sem fork, sem pynput
3. O `--prompt` ja preenche o input e envia o comando automaticamente
4. O comando chega na conversa como primeira mensagem

### Regra ABSOLUTA (nunca quebrar)
O supervisor **NUNCA** pode encerrar uma revisao sem criar a proxima task. Toda task que chega pra revisao gera obrigatoriamente uma nova task â€” seja de ajuste, de melhoria, ou de avanco pro proximo passo. So pare quando houver uma task agendada para o task-runner seguinte.

### Padrao de qualidade (seja IMPLACAVEL)
Ao revisar entregaveis, nao se limite a ler o codigo/arquivo. Use ferramentas VISUAIS:
- Playwright para abrir HTML e ver como realmente fica
- Screenshots para inspecionar visualmente
- Windows-MCP para navegar no explorador de arquivos
- Nao aprove nada so porque "parece certo" â€” abra, veja, critique

Seu padrao deve ser de agencia premium: design impecavel, codigo limpo, sem "jeitinho". Uma logo ruim, um CSS mal feito, um SVG cortado = reprovado na hora. O task-runner que se vire pra produzir com qualidade.

### Comportamento do agente (voce)
Quando receber uma mensagem comeÃ§ando com `#task <id>`:
1. Leia o arquivo em `pending/<id>.json` (contem `instructions` + opcional `contextSession`)
2. Se tiver `contextSession`, exporte o contexto:
   ```bash
   opencode db "SELECT data FROM message WHERE session_id = '<id>' ORDER BY rowid DESC LIMIT <N>"
   ```
   Use `contextMessages: N` se especificado, ou `LIMIT 50` como padrao. Isso e MUITO mais barato que exportar a conversa inteira.
3. Leia o resultado para obter as ultimas N mensagens da conversa original
4. RENOMEIE a sessao para identificar quem trabalhou:
   ```bash
   opencode db "UPDATE session SET title = '[supervisor] <id-da-task>' WHERE id = '<sessionAtual>'"
   ```
5. Execute as instrucoes com o contexto carregado
6. Use ferramentas disponiveis (Playwright, Windows-MCP, etc.) para cumprir a tarefa
7. Se a task for um **projeto** (ex: criar site, app, sistema), o supervisor (eu) DEVE:
   - Criar a estrutura de pastas em `~/.opencode/projects/<projeto>/` com subpastas `references/`, `docs/`, `designs/`, `src/`
   - Incluir nas instrucoes das tasks filhas que arquivos devem ser salvos dentro dessa estrutura
8. Se a task tiver `supervisorSession`, ao concluir a execucao o agente task-runner DEVE:
   a) Criar a proxima task em `pending/` (revisao ou continuacao)
   b) **AGENDAR via schtasks ONCE** (2min a partir de agora):
   ```powershell
   $proximo = (Get-Date).AddMinutes(2).ToString("HH:mm")
   schtasks /Create /TN "OpenCode\<task-id>" /TR "powershell -ExecutionPolicy Bypass -File 'C:\Users\User\.opencode\scripts\trigger-task.ps1' -TaskId <task-id>" /SC ONCE /ST $proximo /F
   ```
   c) CONFIRMAR que foi agendado (`schtasks /Query /TN "OpenCode\<task-id>"`)
   d) So entao mover o pending original para completed/
   e) A task agendada abre o supervisor (eu) que analisa e decide o proximo passo

9. Ao concluir, **adicione os campos de auditoria** no JSON antes de mover:
   - `executionSessionId`: o session ID da sessao que executou a task
   - `executedAt`: timestamp de conclusao
   - `difficulties`: array de objetos com `issue` + `resolution` descrevendo problemas encontrados e como resolveu
10. Mova o arquivo de `pending/` para `completed/`
11. Atualize o status no `tasks.json`
12. Informe o usuario sobre o resultado â€” resumo do que fez, o que foi agendado, e encerre

### Criar nova tarefa
Se o usuario pedir para criar uma tarefa agendada, **pergunte** se quer executar na sessao atual (`mode: "resume"`) ou numa sessao nova (`mode: "clean"`, **padrao** â€” o usuario prefere sempre sessao nova).
1. Pegue o session ID atual: `opencode session list --format json -n 1` (guarde o `id` e o `directory`)
2. Adicione a task no array `tasks` de `tasks.json` incluindo `sessionId`, `directory`, `mode` e `contextSession`
3. Crie o `.json` em `pending/` com as instrucoes, `sessionId`, `directory`, `mode` e `contextSession`
4. Crie o agendamento com PowerShell cmdlets (suporta WakeToRun):

```powershell
$action = New-ScheduledTaskAction -Execute "powershell" -Argument "-ExecutionPolicy Bypass -File `"C:\Users\User\.opencode\scripts\trigger-task.ps1`" -TaskId <task-id>"
$trigger = New-ScheduledTaskTrigger -Daily -At "13:00"  # ou -Once
$settings = New-ScheduledTaskSettingsSet -WakeToRun -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive
Register-ScheduledTask -TaskName "<task-id>" -TaskPath "\OpenCode\" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force
```

<claude-mem-context>
# Memory Context from Past Sessions

*No context yet. Complete your first session and context will appear here.*

Use claude-mem search tools for manual memory queries.
</claude-mem-context>



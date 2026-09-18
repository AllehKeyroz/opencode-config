# Skill: Gerar Implementação GHL
## Blueprint de Configuração GHL para qualquer negócio
## Gera 15 documentos .md + 15 fluxos .mmd completos

---

## ⚠️ REGRA ABSOLUTA — NÃO PULE ETAPAS

**Esta skill é projetada para ser RIGOROSA ao extremo.** Cada documento exige:

1. **ESTUDAR o documento de estratégia** — ler a estratégia do negócio para entender o que precisa ser configurado
2. **PESQUISAR na documentação oficial da HighLevel** — consultar help.gohighlevel.com e ideas.gohighlevel.com/changelog para cada tópico
3. **CRIAR o documento completo** — sem resumos, sem "etc", sem "a definir"
4. **SÓ ENTÃO passar para o próximo documento**

### PROIBIDO:
- ❌ Pular a pesquisa na documentação oficial da HighLevel
- ❌ Usar "etc", "e outros", "similar", "a definir", "depende" sem explicação
- ❌ Condensar ou resumir conteúdo — cada documento deve ser COMPLETO
- ❌ Pedir aprovação no meio da geração dos 15 .md — gere todos de uma vez
- ❌ Usar informações desatualizadas — pesquise o changelog antes de escrever

### OBRIGATÓRIO:
- ✅ Pesquisar help.gohighlevel.com para CADA tópico antes de escrever
- ✅ Pesquisar ideas.gohighlevel.com/changelog para features recentes
- ✅ Documentos com TODAS as seções preenchidas, sem lacunas
- ✅ Cada ação/configuração deve ter: o que faz, quando usar e como configurar
- ✅ Gaste quantos tokens e tempo forem necessários — qualidade > velocidade

---

## 1. FLUXO DE EXECUÇÃO

```
1. Carregar esta SKILL.md + referencias/ (15 documentos modelo)
2. Carregar os documentos de estratégia do negócio (12 docs de estratégia)
3. Aplicar TEMPLATE DE ENTREVISTA (pergunta por pergunta)
4. Com base nas respostas + estratégia, gerar Documento 01 a 15 em UMA EXECUÇÃO
5. Perguntar: "Os 15 documentos foram gerados. Deseja gerar os 15 fluxos .mmd?"
6. Se sim: gerar todos os 15 .mmd de uma vez
7. Se não: encerrar com resumo
8. Salvar em: projeto-do-cliente/implementacao-ghl/
```

---

## 2. TEMPLATE DE ENTREVISTA

Faça as perguntas UMA POR UMA. Só avance quando o usuário responder.

### Bloco 1: Identidade e Produtos

| # | Pergunta | Para que documento |
|---|----------|-------------------|
| 1 | Qual o nome da empresa? | Identidade |
| 2 | Qual o nome do(s) produto(s) principal(is)? | 01, 08 |
| 3 | Liste cada produto/servico com descricao e preco | 01, 08 |
| 4 | Quais os precos de cada produto/servico? (implantacao, recorrencia, consumo) | 01, 11 |
| 5 | Existe receita recorrente? Se sim, qual o valor medio? | 01, 11 |

### Bloco 2: Segmentos e Clientes

| # | Pergunta | Para que documento |
|---|----------|-------------------|
| 6 | Quem sao seus clientes? (descreva os segmentos) | 02, 03 |
| 7 | Onde seus clientes te encontram hoje? (canais de aquisicao) | 03, 07 |
| 8 | Qual o processo de vendas atual? (etapas) | 04, 12 |
| 9 | Quem sao seus concorrentes? | 02 |

### Bloco 3: Operação e CS

| # | Pergunta | Para que documento |
|---|----------|-------------------|
| 10 | Quanto tempo leva para implementar cada produto? | 05, 12 |
| 11 | Como e o pos-venda hoje? (suporte, CS) | 06 |
| 12 | Como voce mede satisfacao do cliente? (NPS, pesquisa) | 09 |
| 13 | Quais situacoes inesperadas ja aconteceram com clientes? | 08 |

### Bloco 4: Infraestrutura GHL

| # | Pergunta | Para que documento |
|---|----------|-------------------|
| 14 | Quais plataformas de pagamento voce usa? (Mercado Pago, Stripe) | 08 |
| 15 | Qual o custo do GHL por mes? (USD) | 11 |
| 16 | Quais redes sociais voce usa? | 07 |
| 17 | Ja tem algum snapshot criado? | 15 |

---

## 3. ESTRUTURA DOS 15 DOCUMENTOS

**Regra de ouro:** CADA documento exige PESQUISA na documentação oficial da HighLevel ANTES de ser escrito. Os termos de pesquisa estão listados em cada documento.

---

### Documento 01 — Launchpad

**Referência na estratégia:** Docs 03 (Marketing), 08 (Marketing/GMB)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "launchpad" + "integrations" + "WhatsApp connect" + "Google My Business"
- ideas.gohighlevel.com/changelog → buscar "launchpad" + "whatsapp" + "integrations"

**O que este documento deve conter (seguir exatamente esta estrutura):**
1. O que é o Launchpad (painel de status de integrações)
2. Lista de integrações disponíveis com: o que desbloqueia, quando usar, como configurar
3. Conexões exigidas pela estratégia (com referência ao documento de estratégia)
4. Conexões que NÃO fazem parte da estratégia (com justificativa)
5. Resumo do que precisa ser feito (prioridades)

**Arquivo de referência:** `referencias/01 - Launchpad.md`

---

### Documento 02 — Dashboard

**Referência na estratégia:** Doc 09 (Métricas)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "dashboard widgets" + "custom fields dashboard" + "payments widgets" + "contacts widgets"
- ideas.gohighlevel.com/changelog → buscar "dashboard" + "widgets" + "AI summary"

**O que este documento deve conter:**
1. O que é o Dashboard
2. Painéis obrigatórios (mínimo 3: Comercial, Financeiro, Operacional)
3. Widgets de cada painel com: tipo de gráfico, métrica da estratégia, configuração (filtros, período)
4. Custom Values que alimentam os widgets
5. Permissões por painel
6. Tema e identidade visual (cores)

**Arquivo de referência:** `referencias/02 - Dashboard.md`

---

### Documento 03 — Pipelines e Leads

**Referência na estratégia:** Docs 04 (Vendas), 05 (Entrega), 06 (CS), 07 (Expansão)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "pipelines" + "opportunities" + "stages" + "custom fields"
- API: marketplace.gohighlevel.com/docs/ → seção "Opportunities"

**O que este documento deve conter:**
1. Pipeline de Vendas (7 estágios: Lead Novo → Ganho/Perdido)
2. Pipeline de Onboarding (6 estágios: Contrato → Concluído)
3. Pipeline de CS (5 estágios: Ativo → Cancelado)
4. Pipeline de Agências (opcional, 4 estágios)
5. Campos personalizados de cada pipeline
6. Tags automáticas por estágio
7. Regras de movimentação entre pipelines

**Arquivo de referência:** `referencias/03 - Pipelines e Leads.md`

---

### Documento 04 — Calendários

**Referência na estratégia:** Docs 03 (Marketing), 04 (Vendas), 06 (CS)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "calendars" + "appointments" + "calendar groups" + "services"
- API: marketplace.gohighlevel.com/docs/ → seção "Calendar"

**O que este documento deve conter:**
1. Calendário de Diagnóstico (público, com link)
2. Calendário Pessoal (privado, uso interno)
3. Calendário de Distribuição (opcional, quando houver equipe)
4. Configuração de disponibilidade, lead time, buffer
5. Notificações e lembretes
6. Integrações (Google Meet, Zoom)
7. Workflows associados (agendou → confirmação → lembrete → não compareceu)

**Arquivo de referência:** `referencias/04 - Calendarios.md`

---

### Documento 05 — Conversas e WhatsApp

**Referência na estratégia:** Docs 03 (Marketing), 04 (Vendas), 06 (CS)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "WhatsApp templates" + "conversations" + "snippets" + "message templates"
- ideas.gohighlevel.com/changelog → buscar "whatsapp" + "template" + "conversation"

**O que este documento deve conter:**
1. Horário comercial e regras de envio
2. Templates de WhatsApp (mínimo 15) com: gatilho, timing, modelo de mensagem COMPLETO e workflow associado
3. Snips (respostas rápidas) — mínimo 8
4. Workflows de conversa (lead respondeu, lead não respondeu, inatividade)
5. Campos personalizados de conversa

**Arquivo de referência:** `referencias/05 - Conversas e WhatsApp.md`

---

### Documento 06 — Sites e Funis

**Referência na estratégia:** Docs 03 (Marketing), 04 (Vendas)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "funnels" + "websites" + "landing pages" + "forms"
- ideas.gohighlevel.com/changelog → buscar "funnels" + "sites"

**O que este documento deve conter:**
1. Landing page de diagnóstico gratuito (estrutura completa da página)
2. Página de proposta (funil de fechamento)
3. Página de obrigado (pós-formulário)
4. Configurações globais (domínio, SSL, tema, tracking)
5. Tracking e pixels (Meta, Google Ads, UTM)
6. Workflows associados

**Arquivo de referência:** `referencias/06 - Sites e Funis.md`

---

### Documento 07 — Marketing (Social Planner + GMB)

**Referência na estratégia:** Docs 03 (Marketing), 07 (Marketing)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "social planner" + "google business profile" + "posts" + "review management"
- ideas.gohighlevel.com/changelog → buscar "social planner" + "GMB"

**O que este documento deve conter:**
1. Social Planner — conexões obrigatórias (Facebook, Instagram, LinkedIn)
2. Calendário editorial semanal (mínimo 6 posts)
3. Templates de post por tipo (carrossel, reels, texto, case) com exemplos COMPLETOS
4. Google Meu Negócio — posts semanais, gestão de avaliações
5. Templates de resposta para avaliações (positiva e negativa)
6. Workflows associados
7. Métricas de marketing

**Arquivo de referência:** `referencias/07 - Marketing.md`

---

### Documento 08 — Pagamentos

**Referência na estratégia:** Docs 01 (Modelo), 11 (Precificação)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "payments" + "subscriptions" + "products" + "Mercado Pago" + "Stripe Connect"
- ideas.gohighlevel.com/changelog → buscar "payments" + "subscriptions"

**O que este documento deve conter:**
1. Produtos no GHL Payments (mínimo 3: implantação, assinatura, subconta)
2. Provedor de pagamento (Mercado Pago ou Stripe) com passos de configuração
3. Formas de pagamento aceitas
4. Cupons de desconto (mínimo 4)
5. Workflows de pagamento (recebido, falhou, cancelado)
6. Checkout (configuração)
7. Métricas de pagamentos

**Arquivo de referência:** `referencias/08 - Pagamentos.md`

---

### Documento 09 — Reputação e Avaliações

**Referência na estratégia:** Docs 06 (CS), 07 (Expansão)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "reputation management" + "reviews AI" + "review requests" + "NPS" + "video testimonials"
- ideas.gohighlevel.com/changelog → buscar "reputation" + "reviews" + "video testimonials"

**O que este documento deve conter:**
1. Reviews AI (Suggestive Mode, Auto-Pilot Mode, Drip Mode)
2. Review Requests (pedir avaliações por e-mail/SMS/WhatsApp)
3. Manual Reviews (adicionar avaliações offline)
4. Video Testimonials (coletor com perguntas)
5. Competitor Analysis (comparar concorrentes)
6. Pesquisa NPS (via Surveys) com workflows por nota
7. Templates COMPLETOS de mensagens para cada ação
8. Métricas de reputação

**Arquivo de referência:** `referencias/09 - Reputacao e Avaliacoes.md`

---

### Documento 10 — Media Drive

**Referência na estratégia:** Docs 03 (Marketing), 05 (Entrega), 06 (CS)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "media storage" + "media drive" + "canva integration" + "google drive integration" + "image editor"
- ideas.gohighlevel.com/changelog → buscar "media" + "canva" + "storage"

**O que este documento deve conter:**
1. O que é o Media Drive
2. Estrutura de pastas (com árvore completa)
3. Arquivos obrigatórios por pasta (nome, formato, uso)
4. Onde cada arquivo é usado (mapeamento)
5. Integrações (Google Drive, Canva, Image Editor)
6. Boas práticas

**Arquivo de referência:** `referencias/10 - Media Drive.md`

---

### Documento 11 — Configurações Globais

**Referência na estratégia:** Todos os documentos

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "custom fields" + "tags" + "users permissions" + "business profile" + "snapshots"
- API: marketplace.gohighlevel.com/docs/ → seção "Custom Fields"

**O que este documento deve conter:**
1. Business Profile (dados da empresa)
2. Custom Fields (todos os campos de contato, oportunidade, appointment)
3. Tags (sistema de marcação completo: estágio, CS, origem)
4. Users & Permissions
5. Timezone & Language
6. Integrations (status de cada uma)
7. Security
8. Snapshot Settings (o que incluir e não incluir)

**Arquivo de referência:** `referencias/11 - Configuracoes Globais.md`

---

### Documento 12 — Workflows e Automações

**Referência na estratégia:** Docs 04 (Vendas), 05 (Entrega), 06 (CS), 08 (Exceções)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "workflows" + "automations" + "triggers" + "actions" + "trigger links"
- API: marketplace.gohighlevel.com/docs/ → seção "Workflows" + "Trigger Links"
- ideas.gohighlevel.com/changelog → buscar "workflow" + "trigger" + "automation"

**O que este documento deve conter:**
1. Workflow 1: Lead Novo → Qualificação (Contact Created)
2. Workflow 2: Diagnóstico Agendado (Appointment Created)
3. Workflow 3: Diagnóstico Realizado (Appointment Completed)
4. Workflow 4: Lembrete D-1 (Scheduler)
5. Workflow 5: Lembrete H-1 (Scheduler)
6. Workflow 6: Não Compareceu (No Show)
7. Workflow 7: Proposta D3 (Scheduler)
8. Workflow 8: Proposta D7 (Scheduler)
9. Workflow 9: Pagamento Recebido (Payment Received)
10. Workflow 10: CS Inatividade 7 dias (Scheduler)
11. Workflow 11: CS Inatividade 15 dias (Scheduler)
12. Workflow 12: NPS Trimestral (Scheduler)
13. Workflows adicionais (Indicação, Renovação, Avaliação)
14. Trigger Links
15. Workflows externos (n8n)

**Cada workflow deve ter:** gatilho, condições, timing, ações completas (tag, pipeline, mensagem, campo)

**Arquivo de referência:** `referencias/12 - Workflows e Automacoes.md`

---

### Documento 13 — Conversation AI

**Referência na estratégia:** Docs 03 (Marketing), 04 (Vendas)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "conversation AI" + "auto-pilot" + "bot goals" + "bot training" + "human handover" + "appointment booking conversation AI"
- ideas.gohighlevel.com/changelog → buscar "conversation AI" + "AI bot"

**O que este documento deve conter:**
1. O que é Conversation AI (modo Auto-Pilot)
2. **PROMPT COMPLETO do bot** (system prompt com personalidade, objetivos, regras)
3. **Brand Voice** (tom, estilo, formalidade, extensão)
4. **Bot Goals**:
   - Information Collection (campos + perguntas + skip if filled + mapeamento)
   - Appointment Booking
   - Trigger Workflow (condições)
   - Email Notification
   - Conversation Summary
5. **Ações disponíveis** (Add Contact Info, Appointment Booking, Trigger Workflow, Human Handover, Auto Follow-Up, Stop Bot, Transfer Bot) — cada uma com: o que faz, quando usar
6. **Condições de Human Handover** (quando transferir para humano)
7. **Bot Training**:
   - Web Crawler (URLs)
   - **Custom Bot Responses (FAQs) COMPLETAS** — mínimo 10 perguntas com respostas completas
8. Configurações avançadas do Auto-Pilot (wait time, limite de mensagens, sleep)
9. Dashboard e métricas
10. Precificação
11. Bot Snapshots

**Arquivo de referência:** `referencias/13 - Conversation AI.md`

---

### Documento 14 — AI Agents

**Referência na estratégia:** Docs 04 (Vendas), 06 (CS)

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "AI agent action" + "workflow AI agent" + "agent studio"
- ideas.gohighlevel.com/changelog → buscar "AI agent" + "agent action" + "workflow AI"

**O que este documento deve conter:**
1. O que é o AI Agent Action in Workflows (diferença do Conversation AI)
2. Capacidades: Full CRM Awareness, Natural Language, Enhance Prompt, Tools (até 10), Conversation Memory, Structured Output, Execution Logs
3. Modelos disponíveis (GPT-5.2, GPT-5.1, GPT-5 Nano)
4. Agente 1 — SDR Qualifier (instrução COMPLETA, tools, output JSON esperado)
5. Agente 2 — No-Show Recovery (instrução COMPLETA, tools)
6. Agente 3 — Stale Deal Nudge (instrução COMPLETA)
7. Templates prontos do marketplace (mínimo 5)
8. Bridge: Workflow → AI Agent
9. Execution Logs
10. Precificação

**Arquivo de referência:** `referencias/14 - AI Agents.md`

---

### Documento 15 — Snapshots

**Referência na estratégia:** Todos os documentos

**Pesquisar na HighLevel antes de escrever:**
- help.gohighlevel.com → buscar "snapshots" + "account snapshots" + "conversation AI bot snapshots"
- ideas.gohighlevel.com/changelog → buscar "snapshots" + "dashboard snapshot"

**O que este documento deve conter:**
1. O que é Snapshot (template completo de subconta)
2. O que o snapshot inclui (tabela completa: pipelines, CFs, tags, calendários, funis, workflows, dashboard, Conversation AI)
3. O que o snapshot NÃO inclui (conexões manuais)
4. Comportamento do Conversation AI no snapshot (primary bot, conflito de nomes)
5. Snapshots por segmento (opcional)
6. Fluxo de criação (passo a passo)
7. Fluxo de aplicação (passo a passo)
8. Atualização do snapshot (frequência recomendada)

**Arquivo de referência:** `referencias/15 - Snapshots.md`

---

## 4. REGRAS DE GERAÇÃO DOS .mmd

### Quando Gerar

**APENAS** após TODOS os 15 documentos .md estarem prontos e o usuário autorizar.

Pergunta exata: *"Os 15 documentos foram gerados em [pasta]. Deseja que eu gere os 15 fluxos .mmd agora?"*

### Regras Whimsical

**Cores:**
- Início/topo: `fill:#F4D0D0,stroke:#C62828` (vermelho)
- Decisões: `fill:#D4F5F2,stroke:#1AAE9F` (menta)
- Ações: `fill:#FFF7D6,stroke:#FFD93D` (amarelo)
- Funis/processos: `fill:#E3F0FF,stroke:#74B9FF` (azul)
- Consultoria/premium: `fill:#ECEAFE,stroke:#730FC3` (roxo)
- Exceções/risco: `fill:#FFE0E0,stroke:#FF6B6B` (rosa)
- Templates (copy & paste): `fill:#FFFFFF,stroke:#2C88D9,stroke-dasharray: 3 3` (branco com borda azul tracejada)

**Formas:**
- Decisões: `{ }` (diamante)
- Ações/ofertas: `[ ]` (retângulo)
- Processos/funis: `( )` (retângulo arredondado)
- Templates: `("texto")` com aspas e style template

**Labels:** PT-BR, sempre maiúsculo: `-->|SIM|`, `-->|NÃO|`

**Layout:** `graph TD` (top-down). Sem subgraphs no fluxo principal (usar subgraphs APENAS para painéis de template lateral).

**Estrutura de cada .mmd:**
- Fluxo principal no centro (esquerda)
- Painéis de template/consulta lateral (direita) usando subgraph
- Setas tracejadas conectando o fluxo principal aos painéis

**Prefixos de ID:** Usar prefixos ÚNICOS em cada nó para evitar conflitos (ex: `LP_`, `PG_`, `WH_`, `CFG_`, etc.). NUNCA usar IDs de uma letra só.

---

## 5. ESTRUTURA DE PASTAS DE SAÍDA

```
projeto-do-cliente/
  implementacao-ghl/
    01 - Launchpad.md
    01 - Launchpad - Fluxo.mmd (se autorizado)
    02 - Dashboard.md
    02 - Dashboard - Fluxo.mmd (se autorizado)
    ...
    15 - Snapshots.md
    15 - Snapshots - Fluxo.mmd (se autorizado)
```

Perguntar ao usuário o caminho do projeto. Se não informar, usar o diretório atual.

---

## 6. CHECKLIST PÓS-GERAÇÃO (NÃO PULE)

Antes de encerrar:

- [ ] 15 documentos .md criados?
- [ ] Cada um com TODAS as seções obrigatórias preenchidas?
- [ ] Sem "etc", "e outros", "similar", "a definir" em nenhum documento?
- [ ] Sem seções vazias?
- [ ] Pesquisa na HighLevel realizada antes de cada documento?
- [ ] Custom Bot Responses com respostas COMPLETAS?
- [ ] Templates de WhatsApp com mensagens COMPLETAS?
- [ ] Se autorizado: 15 fluxos .mmd criados?
- [ ] Fluxos .mmd seguem as regras Whimsical?
- [ ] Nenhum nó com ID de letra única?
- [ ] Pergunta final feita sobre os .mmd?

Se QUALQUER item falhar: corrigir antes de encerrar.

---

## 7. REFERÊNCIAS

### Documentos modelo (na pasta `referencias/`)

Os 15 arquivos `01 - Launchpad.md` a `15 - Snapshots.md` contêm o padrão exato de estrutura, tom e profundidade que cada documento deve seguir. O agente DEVE lê-los antes de começar a criar qualquer documento.

### Documentos de estratégia do negócio

Os 12 documentos de estratégia (fornecidos pelo usuário na pasta de estratégia) contêm as definições de posicionamento, segmentos, precificação, métricas e operação que alimentam a implementação GHL.

### Documentação oficial HighLevel

A documentação oficial deve ser consultada para CADA tópico, usando os termos de pesquisa listados em cada documento acima.

- Documentação help: https://help.gohighlevel.com/
- Changelog: https://ideas.gohighlevel.com/changelog
- API Docs: https://marketplace.gohighlevel.com/docs/

---

*Skill gerada em 08/07/2026 — Propriedade intelectual de Keyroz Digital Solutions*
*Versão 1.0 — Proibida reprodução sem autorização*

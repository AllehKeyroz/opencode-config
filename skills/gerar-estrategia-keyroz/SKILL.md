# Skill: Gerar Estratégia Keyroz
## Geração completa de planejamento estratégico em 12 documentos + 12 fluxos Whimsical
## Baseada nos frameworks de Kotler, Gerber, Lippert, Bryar & Carr, Savaget, Marçal e Freitas

---

## ⚠️ REGRA ABSOLUTA — ANTIPREGUIÇA (LEIA ANTES DE EXECUTAR)

Esta skill foi projetada para gerar estratégias COMPLETAS, sem atalhos, sem resumos, sem condensação.

### O que é ESTRITAMENTE PROIBIDO:

1. **PROIBIDO** pular etapas ou encurtar perguntas da entrevista
2. **PROIBIDO** gerar documento parcial com "etc", "e outros", "similar" — escreva TUDO
3. **PROIBIDO** condensar frameworks dos autores — use o texto completo das referências
4. **PROIBIDO** deixar lacunas — se uma seção não se aplica, escreva explicitamente "Não se aplica porque [motivo]"
5. **PROIBIDO** gerar menos de 12 documentos. Sempre 12. Cada um com todas as seções obrigatórias
6. **PROIBIDO** pedir aprovação no meio da geração dos .md. Gere todos os 12 de uma vez
7. **PROIBIDO** sugerir que "o usuário pode preencher depois". PREENCHA AGORA com base na entrevista

### O que é OBRIGATÓRIO:

1. **GASTE QUANTOS TOKENS PRECISAR** — não há limite de custo para esta skill
2. **GASTE QUANTO TEMPO PRECISAR** — o usuário prefere esperar dias a receber um documento com lacuna
3. **CADA DOCUMENTO** deve ter no mínimo 3 páginas de conteúdo útil (não contagem de páginas, mas densidade de informação)
4. **APÓS gerar os 12 .md**, pergunte: *"Os 12 documentos estão prontos. Deseja que eu gere os 12 fluxos .mmd agora?"*
5. **NÃO gere os .mmd antes da autorização.** Só após o "sim" do usuário

---

## 1. FLUXO DE EXECUÇÃO

```
1. Carregar esta SKILL.md + todas as referências dos 7 autores
2. Aplicar TEMPLATE DE ENTREVISTA (pergunta por pergunta)
3. Com base nas respostas, gerar Documento 01 a 12 em UMA ÚNICA EXECUÇÃO
4. Exibir: "Os 12 documentos foram gerados em [pasta]. Deseja gerar os 12 fluxos .mmd?"
5. Se sim: gerar todos os 12 .mmd
6. Se não: encerrar com resumo do que foi criado
7. Salvar na pasta do projeto do cliente
```

### 1.1 Regras de Geração dos Documentos

| Passo | Ação | Detalhes |
|-------|------|----------|
| 1 | Entrevistar | Pergunta por pergunta do template. Só avança quando o usuário responder |
| 2 | Compilar respostas | Montar um "perfil do negócio" estruturado |
| 3 | Gerar 12 documentos | Em uma única execução, sem pausas |
| 4 | Perguntar sobre .mmd | Só após os 12 prontos |
| 5 | Gerar fluxos | Se autorizado, 12 .mmd de uma vez |

### 1.2 Onde Salvar

Criar pasta `estratégia-oficial/` dentro do projeto do cliente (perguntar o caminho ou usar o diretório atual).

---

## 2. TEMPLATE DE ENTREVISTA (GENÉRICO — QUALQUER NEGÓCIO)

**Instrução:** Faça as perguntas UMA POR UMA. Aguarde a resposta antes de passar para a próxima. Ao final, compile as respostas em um "perfil do negócio" que alimentará os 12 documentos.

### Bloco 1: Identidade e Modelo de Negócio

| # | Pergunta | Exemplo de Resposta |
|---|----------|-------------------|
| 1 | Qual o nome da empresa? | "Keyroz Digital Solutions" |
| 2 | Qual o nome do(s) produto(s) ou serviço(s) principal(is)? | "KDS CRM" |
| 3 | Liste cada produto/serviço com descrição, para quem é e preço. Pode ser em tabela. | "Produto A — CRM white-label — R$ 197/mês" |
| 4 | Qual o modelo de receita? (recorrência? implantação? comissão? taxa? consumo? todos?) | "Implantação única + recorrência mensal + consumo" |
| 5 | Quais são seus custos fixos mensais? (liste todos) | "Plataforma US$ 497, IA R$ 800, etc." |
| 6 | Qual sua meta de faturamento mensal em 6 meses? | "R$ 18.000/mês" |

### Bloco 2: Clientes e Mercado

| # | Pergunta | Exemplo |
|---|----------|---------|
| 7 | Quem são seus clientes? (descreva os segmentos em detalhe) | "Agências de marketing e empresas de médio porte" |
| 8 | Quem são seus concorrentes diretos? | "JOVIA, Digitai, 360 Sales" |
| 9 | Qual seu diferencial competitivo? (seja específico) | "IA nativa + snapshots prontos + suporte PT-BR" |
| 10 | Qual o ticket médio dos seus clientes? | "R$ 5.121/mês (recorrência) + R$ 6.000 (implantação)" |
| 11 | Quantos clientes ativos você tem hoje? | "5" |
| 12 | Como os clientes te encontram hoje? | "Indicação, LinkedIn, comunidades" |

### Bloco 3: Vendas, Marketing e Operação

| # | Pergunta | Exemplo |
|---|----------|---------|
| 13 | Como você vende hoje? Descreva o processo atual. | "Diagnóstico gratuito → proposta → fechamento" |
| 14 | Quanto tempo leva para entregar cada produto/serviço? | "Setup: 4h. Projeto completo: 8 semanas" |
| 15 | Como é o pós-venda hoje? | "Suporte por WhatsApp, CS mensal" |
| 16 | Quanto pode investir em marketing por mês? | "R$ 1.000-3.500/mês" |
| 17 | Já aconteceu algo inesperado com clientes? Exemplos. | "Cliente pediu cancelamento, outro não pagou" |
| 18 | Existe receita recorrente no modelo? Se sim, qual o valor médio mensal por cliente? | "Sim, R$ 5.121/mês médio" |

---

## 3. FRAMEWORKS DOS AUTORES (REFERÊNCIAS COMPLETAS)

Os textos completos estão nos arquivos em `referencias/`. O agente DEVE ler cada um antes de gerar os documentos.

| Autor | Arquivo | Aplicação Principal |
|-------|---------|-------------------|
| **Philip Kotler** | `referencias/kotler-completo.md` | Segmentação, posicionamento, 4Ps, STP, Marketing 3.0/4.0/5.0, marketing holístico, marketing de serviços profissionais |
| **Michael Gerber** | `referencias/resumo_o_mito_do_empreendedor.md` | 3 papéis (técnico/gerente/empreendedor), modelo de franquia, trabalhar SOBRE o negócio, BDP, Power Point Selling |
| **Dener Lippert** | `referencias/resumo_cientista_do_marketing.md` | Método V4 (tráfego/engajamento/conversão/retenção), abordagem científica, 9 leis, neuromarketing, ROI |
| **Bryar & Carr** | `referencias/resumo_obsessao_pelo_cliente.md` | Working Backwards, PR/FAQ, input vs output metrics, WBR, Bar Raiser, single-threaded leaders |
| **Paulo Savaget** | `referencias/resumo_saia_pela_rangente.md` | 4 workarounds: bypass, piggybacking, loophole, hacking — aplicados a marketing e aquisição |
| **Pablo Marçal** | `referencias/resumo_a_arte_de_negociar.md` | Objeção é ouro, perguntas nos 5 min, autogoverno, 40 chaves, fechamento |
| **Marcos Freitas** | `referencias/resumo_coragem_para_crescer.md` | Método Alta Performance, gestão de fluxo de caixa, cultura de crescimento, time engajado |

**Instrução:** Use o texto COMPLETO de cada referência. Não condense, não resuma, não "pegue só o principal". O Framework completo do autor DEVE estar presente nos documentos gerados, aplicado ao negócio do cliente.

---

## 4. ESTRUTURA DOS 12 DOCUMENTOS

Cada documento deve seguir obrigatoriamente a estrutura abaixo. Não pule seções — se uma não se aplica, marque explicitamente "Não se aplica" com justificativa.

### Documento 01 — Modelo de Negócio: Anatomia Completa
**Baseado em:** Kotler (mix de produtos) + Gerber (sistemas)
- Catálogo de produtos/serviços (com preços, margens, para quem)
- Add-ons e consumo
- O que NÃO vendemos
- Segmentos de clientes
- As 3 receitas (se aplicável: implantação, recorrência, consumo)
- Economia unitária (por tipo de cliente)
- Estrutura de custos
- Ponto de equilíbrio (break-even)
- Canais de distribuição
- Regras de precificação e descontos
- Métricas-chave do modelo de negócio
- Glossário do modelo

### Documento 02 — Segmentação e Posicionamento
**Baseado em:** Kotler (STP) + Gerber (nichos)
- Segmentação de mercado (subsegmentos detalhados)
- Critérios de qualificação por segmento
- O que NÃO é público-alvo
- Posicionamento por segmento
- Posicionamento único (mensagem mestra)
- Diferenciais competitivos
- Matriz de posicionamento vs concorrência
- Personas (mínimo 2)
- Estratégia de go-to-market por segmento
- Mapa de prioridade
- Glossário de posicionamento

### Documento 03 — Marketing e Aquisição
**Baseado em:** Lippert (Funil V4) + Savaget (workarounds)
- Funil V4 completo para todos os segmentos
- Tráfego: canais para cada segmento
- Savaget Workarounds aplicados (piggybacking, bypass, loophole, hacking)
- Engajamento: nurture sequences (com temporização D1-D90)
- Calendário de conteúdo
- Conversão: diagnóstico/lead magnet, proposta
- Retenção (parte de marketing): conteúdo para ativos, gatilhos de upsell, programa de indicação, preventivo de churn
- Orçamento de marketing por canal
- Métricas do funil
- Plano de ação 30-60-90 dias

### Documento 04 — Processo de Vendas e Fechamento
**Baseado em:** Gerber (Power Point Selling) + Marçal (objeções)
- Visão geral do processo
- Qualificação de leads (BANT adaptado)
- O processo de 3 reuniões (compromisso emocional, análise de necessidades, proposta e fechamento)
- Estrutura da proposta
- Tabela de objeções com respostas completas (mínimo 7)
- Sinais de compra (verde/amarelo/vermelho)
- Gatilhos de fechamento
- Script de fechamento
- Pós-fechamento imediato
- Gestão do funil de vendas (etapas, pipeline, rotina diária)
- Follow-up disciplinado
- Vendas específicas para cada segmento (se houver)
- Métricas de vendas

### Documento 05 — Entrega e Operação
**Baseado em:** Gerber (modelo franquia) + Freitas (alta performance)
- Princípio fundamental (Gerber)
- Os serviços de entrega (mapeados por esforço vs margem)
- Playbook de entrega passo a passo para cada serviço
- Sistema de documentação (checklists, templates)
- Padrão de qualidade
- Gestão de capacidade
- Quando contratar
- Handoff vendas → entrega
- Métricas de operação

### Documento 06 — Pós-Venda e Customer Success
**Baseado em:** Bryar & Carr (Working Backwards) + Kotler (customer centric)
- A jornada do cliente pós-venda (marcos)
- Onboarding (D0-D7) com checklists
- Customer Success ativo (D7-D90) com cadência
- Prevenção de churn (matriz de risco, processo de retenção, ofertas escalonadas)
- Programa de indicação (mecanismo, gatilhos, incentivos)
- Upsell liderado pelo CS
- NPS e pesquisa de satisfação (modelos)
- Métricas de CS

### Documento 07 — Expansão de Receita e Upsell
**Baseado em:** Kotler (produto expandido) + Bryar & Carr (NRR)
- Rotas de expansão por perfil de cliente
- Tabela de upsell por tempo de cliente
- Programa de parceria (se aplicável) com níveis
- Expansão por consumo
- Renovação de contratos (cadência e ofertas)
- Métricas de expansão (NRR, MRR de expansão, etc.)

### Documento 08 — Tratamento de Cenários e Exceções
**Baseado em:** Savaget (workarounds para problemas)
- Tabela de cenários com respostas prontas (mínimo 15)
- Matriz de decisão rápida
- Respostas prontas para situações críticas (processo, review negativo, erro seu, cliente sumiu)
- Cenários de crise macro (econômica, plataforma, saúde)

### Documento 09 — Métricas e Inputs
**Baseado em:** Bryar & Carr (WBR, input vs output) + Lippert (ROI)
- As 12 métricas principais com meta e frequência
- Inputs vs outputs
- Cadência de revisão (daily, WBR, monthly, quarterly)
- Template de WBR
- Metas por fase (validação, operação, escala)
- Glossário de métricas

### Documento 10 — Plano de Implementação 90 Dias
**Baseado em:** Gerber (execução sistemática) + Freitas (metas)
- Visão geral dos 3 meses
- Semana a semana (D1-D90 com tarefas diárias)
- Planilha de acompanhamento (semanal com metas)
- Checkpoints de cada mês

### Documento 11 — Precificação e Economia Unitária
**Baseado em:** Kotler (precificação baseada em valor) + Gerber (precificação de sistemas)
- Estrutura de custo (fixo + variável)
- Margem por produto
- Economia unitária por tipo de cliente
- Relação LTV vs CAC
- Cenários de receita (conservador, realista, otimista)
- Análise de break-even

### Documento 12 — Cultura e Metodologia
**Baseado em:** Gerber (propósito principal) + Bryar & Carr (princípios de liderança) + Freitas (alta performance)
- Valores da empresa (mínimo 5, cada um com "o que significa", "na prática", "o que NÃO significa")
- Metodologia proprietária (etapas do processo de trabalho)
- Manifesto da empresa

---

## 5. GERAÇÃO DOS FLUXOS .mmd

### 5.1 Quando Gerar

**APENAS** após TODOS os 12 documentos .md estarem prontos e o usuário autorizar.

Pergunta exata: *"Os 12 documentos estão prontos em [pasta]. Deseja que eu gere os 12 fluxos .mmd agora?"*

### 5.2 Regras Whimsical

**Cores:**
- Início/topo: `fill:#F4D0D0,stroke:#C62828` (vermelho)
- Decisões: `fill:#D4F5F2,stroke:#1AAE9F` (menta)
- Ações: `fill:#FFF7D6,stroke:#FFD93D` (amarelo)
- Funis/processos: `fill:#E3F0FF,stroke:#74B9FF` (azul)
- Consultoria/premium: `fill:#ECEAFE,stroke:#730FC3` (roxo)
- Exceções/risco: `fill:#FFE0E0,stroke:#FF6B6B` (rosa)

**Formas:**
- Decisões: `{ }` (diamante)
- Ações/ofertas: `[ ]` (retângulo)
- Processos/funis: `( )` (retângulo arredondado)

**Labels:** PT-BR, sempre maiúsculo: `-->|SIM|`, `-->|NÃO|`

**Layout:** `graph TD` (top-down). Sem subgraphs.

### 5.3 Mapeamento Documento → Fluxo

| Documento | Nome do Arquivo .mmd | Conteúdo do Fluxo |
|-----------|---------------------|-------------------|
| 01 | `01 - Modelo de Negocio - Fluxo.mmd` | Segmentos → Produtos → Receitas → Custos → Break-even |
| 02 | `02 - Segmentacao e Posicionamento - Fluxo.mmd` | Árvore de decisão "quem é o cliente" → persona → posicionamento |
| 03 | `03 - Marketing e Aquisicao - Fluxo.mmd` | Funil V4 com canais, nurture, orçamento |
| 04 | `04 - Vendas e Fechamento - Fluxo.mmd` | Jornada de vendas + tratamento de objeções |
| 05 | `05 - Entrega e Operacao - Fluxo.mmd` | Playbooks, handoff, capacidade, qualidade |
| 06 | `06 - Pos-Venda e CS - Fluxo.mmd` | Onboarding → CS → Retenção → Indicação |
| 07 | `07 - Expansao de Receita - Fluxo.mmd` | Upsell, consumo, renovação, parceria |
| 08 | `08 - Cenarios de Excecao - Fluxo.mmd` | Matriz de 15+ cenários com respostas |
| 09 | `09 - Metricas e Inputs - Fluxo.mmd` | 12 métricas, WBR, inputs vs outputs, fases |
| 10 | `10 - Plano 90 Dias - Fluxo.mmd` | Timeline semana a semana com checkpoints |
| 11 | `11 - Precificacao - Fluxo.mmd` | Custos, margens, economia unitária, break-even |
| 12 | `12 - Cultura e Metodologia - Fluxo.mmd` | Valores, método, manifesto |

---

## 6. ESTRUTURA DE PASTAS DE SAÍDA

```
projeto-do-cliente/
  estratégia-oficial/
    01 - Modelo de Negocio - Anatomia Completa.md
    01 - Modelo de Negocio - Fluxo.mmd (se autorizado)
    02 - Segmentacao e Posicionamento.md
    02 - Segmentacao e Posicionamento - Fluxo.mmd (se autorizado)
    ...
    12 - Cultura e Metodologia Keyroz.md
    12 - Cultura e Metodologia - Fluxo.mmd (se autorizado)
```

Perguntar ao usuário o caminho do projeto. Se não informar, usar o diretório atual da conversa.

---

## 7. CHECKLIST PÓS-GERAÇÃO (NÃO PULE)

Antes de encerrar, verificar:

- [ ] 12 documentos .md criados?
- [ ] Cada um com TODAS as seções obrigatórias?
- [ ] Sem "etc", "e outros", "similar" em nenhum documento?
- [ ] Sem seções vazias ou "a definir"?
- [ ] Frameworks dos autores aplicados explicitamente?
- [ ] Se autorizado: 12 fluxos .mmd criados?
- [ ] Fluxos .mmd seguem as regras Whimsical?
- [ ] Pergunta final feita sobre os .mmd?

Se qualquer item falhar: corrigir antes de encerrar.

---

*Skill gerada em 06/07/2026 — Propriedade intelectual de Keyroz Digital Solutions*
*Versão 1.0 — Proibida reprodução sem autorização*

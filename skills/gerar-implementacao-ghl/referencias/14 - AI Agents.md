# 14 — AI Agents (Workflow AI Agent Action)
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

O AI Agent Action é uma **ação dentro de workflows** que usa IA para tomar decisões autônomas. Diferente do Conversation AI (que conversa com leads), o AI Agent Action executa tarefas: qualificar leads, enriquecer contatos, recuperar no-shows, nutrir deals parados.

Lançado em Abril de 2026. Substitui dezenas de branches If/Else por uma única ação que decide o que fazer com base no contexto.

**Localização:** Workflows → Add Action → Workflow AI → AI Agent

**Diferença para o Conversation AI:**

| Conversation AI | AI Agent Action |
|----------------|----------------|
| Atende conversas em canais (WhatsApp, Chat) | Executa tarefas dentro de workflows |
| Modo sugestivo ou automático | Autônomo (decide o que fazer) |
| Foco em diálogo | Foco em ações (criar contato, atualizar campo, disparar WhatsApp) |
| Usa Bot Training (KB) | Usa ferramentas (tools) do CRM |

---

## CAPACIDADES

| Capacidade | Descrição |
|-----------|-----------|
 | **Full CRM Awareness** | O agente busca contexto de contatos, pipelines, calendário, custom fields automaticamente — sem mapeamento manual |
| **Natural Language Instructions** | Escreva em português: "qualifique o lead e se for quente agende um diagnóstico" — o agente interpreta |
| **Enhance Prompt** | Escreva instruções informais e clique em "Enhance Prompt" — a IA estrutura em um prompt profissional |
| **Tools (até 10 por agente)** | Update Custom Field, Knowledge Base Search, contatos, pipeline, calendário, WhatsApp |
| **Per Tool Control** | Cada ferramenta pode ser "Let AI decide" ou fixa (ex: sempre usar o campo X) |
| **Conversation Memory** | Mantém resumo de execuções anteriores para o mesmo contato — evolui de decisão única para relacionamento contínuo |
| **Structured Output** | Retorna JSON com schema definido (ex: `{"qualified": true, "score": 85}`) |
| **Multiple Models** | GPT-5.2 (Low/Medium/High thinking), GPT-5.1, GPT-5 Nano |
| **Execution Logs** | Log detalhado de cada execução: raciocínio, tools chamadas, timestamps, tokens |

---

## MODELOS DISPONÍVEIS

| Modelo | Custo | Indicação |
|--------|-------|-----------|
| **GPT-5.2 Low thinking** | Padrão | Recomendado para a maioria dos casos |
| **GPT-5.2 Medium thinking** | Médio | Casos que exigem mais raciocínio |
| **GPT-5.2 High thinking** | Alto | Problemas complexos |
| **GPT-5.1** | Médio | Boa relação custo-benefício |
| **GPT-5 Nano** | Baixo | Tarefas simples, maior velocidade |

---

## AGENTE 1 — SDR (QUALIFICAÇÃO DE LEADS)

**Gatilho:** W1 — Lead Novo (Contact Created)

**Instrução:**
```
Voce e um SDR especializado em qualificar leads para o KDS CRM.

Quando um lead entrar, siga estes passos:
1. Analise os dados do contato (nome, empresa, origem)
2. Se tiver telefone, envie uma mensagem de boas-vindas perguntando qual a maior dificuldade com vendas
3. Classifique a resposta do lead em: "processo", "tecnologia", "equipe" ou "ia"
4. Pergunte o faturamento mensal
5. Se faturamento > R$ 200k: classifique como "qualificado" e agende diagnostico
6. Se faturamento < R$ 200k: ofereca CRM autogerenciado
7. Salve a classificacao no custom field diagnostic_data
```

**Tools necessárias:**
- Send WhatsApp Message
- Update Contact Custom Field
- Calendar (criar appointment)

**Output estruturado:**
```json
{
  "qualified": true/false,
  "score": 0-100,
  "pain_point": "processo|tecnologia|equipe|ia",
  "recommended_product": "projeto_completo|crm_autogerenciado|ai_agent"
}
```

---

## AGENTE 2 — NO-SHOW RECOVERY

**Gatilho:** W6 — Não Compareceu (Appointment No Show)

**Instrução:**
```
O lead nao compareceu ao diagnostico.

Sua missao e recuperar esse lead:

1. Envie uma mensagem amigavel perguntando se quer reagendar
2. Se responder sim, mostre os proximos horarios disponiveis no calendario
3. Se responder nao, pergunte se prefere receber material por escrito
4. Se nao responder em 48h, envie um ultimo contato com um case de sucesso
5. Se ainda assim nao responder, marque como "frio" e mova para nurture
```

**Tools necessárias:**
- Send SMS
- Calendar (check availability)
- Update Contact Custom Field

---

## AGENTE 3 — STALE DEAL NUDGE

**Gatilho:** Scheduler (7 dias sem atividade no pipeline com proposta enviada)

**Instrução:**
```
Um lead esta parado no estagio "Proposta Enviada" ha 7 dias.

Sua missao:
1. Analise o historico da conversa para entender o contexto
2. Envie uma mensagem personalizada perguntando se teve duvidas
3. Se responder com objecao de preco, ofereca o plano anual com desconto
4. Se responder com objecao de escopo, ofereca um plano menor
5. Se nao responder em 3 dias, mova para o estagio "Perdido"
```

---

## TEMPLATES PRONTOS (MERCADO)

O GHL já inclui templates prontos de AI Agents que podem ser usados diretamente:

| Template | Uso | Trigger Sugerido |
|----------|-----|-----------------|
| **Form Lead Follow Up** | Qualificar leads de formulário | Form Submission |
| **No Show Appointment Recovery** | Recuperar no-shows | Appointment No Show |
| **Facebook Lead Nurturing** | Nutrir leads do Facebook | Facebook Lead Gen |
| **Stale Deal Nudge Agent** | Re-engajar oportunidades paradas | Scheduler |
| **Lead Research & Enrichment** | Pesquisar e enriquecer leads | Contact Created |
| **Call Transcript Summary** | Resumir chamadas + extrair ações | Call Completed |
| **Lead Pipeline Tracker** | Acompanhar leads com check-ins periódicos | Scheduler |

---

## BRIDGE: WORKFLOW → AI AGENT

Para usar o AI Agent Action, basta adicionar a ação "AI Agent" dentro de qualquer workflow.

**Workflow que usam AI Agent:**

| Workflow | Agente | Instrução |
|----------|--------|-----------|
| W1 — Lead Novo | SDR Qualifier | "Qualifique este lead e agende diagnostico se for qualificado" |
| W6 — Não Compareceu | No-Shot Recovery | "Recupere este lead com mensagem personalizada" |
| W8 — Lead Perdido | Stale Deal Nudge | "Tente re-engajar antes de mover para perdido" |

---

## EXECUTION LOGS

O agente produz logs detalhados de cada execução:

| Informação | Descrição |
|-----------|-----------|
| **LLM reasoning** | Passo a passo do raciocínio da IA |
| **Tool calls** | Quais ferramentas foram chamadas, inputs e outputs |
| **Timestamps** | Quando cada ação foi executada |
| **Token count** | Quantos tokens foram consumidos |
| **Status** | Sucesso ou falha |

---

## PRECIFICAÇÃO DO AI AGENT

| Componente | Custo |
|-----------|-------|
| **LLM tokens** | Baseado no modelo escolhido (GPT-5 Nano é o mais barato) |
| **Premium tool executions** | Se usar integrações pagas (ClickUp, Airtable, Notion) |
| **Ferramentas CRM padrão** | Send SMS, Update Contact, Add Tag — sem custo adicional |

---

## LIMITAÇÕES

| Limitação | Detalhe |
|-----------|---------|
| **Até 10 tools por agente** | Não é possível adicionar mais de 10 ferramentas |
| **Depende de workflow** | O AI Agent só executa dentro de um workflow, não é autônomo |
| **Modelo mais caro** | GPT-5.2 High thinking custa mais tokens |
| **Conversation Memory** | Resumos são mantidos, mas não o histórico completo |

---

## PRÓXIMO MÓDULO

**15 — Snapshots** (Template completo KDS CRM)

---

*Documento 14/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

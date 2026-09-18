# 05 — Conversas e WhatsApp
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

O módulo de Conversas centraliza toda a comunicação com leads e clientes: WhatsApp, e-mail, SMS. A estratégia usa WhatsApp como canal principal.

**Canais que serão ativados:**
- **WhatsApp** — Canal principal (nurture, vendas, CS)
- **E-mail** — Suporte (propostas, documentos, relatórios)
- **SMS** — Não será usado (custo alto, baixo engajamento vs WhatsApp)

---

## HORÁRIO COMERCIAL E REGRAS DE ENVIO

| Parâmetro | Configuração |
|-----------|-------------|
| **Fuso horário** | Brasília (GMT-3) |
| **Horário de envio** | Seg-Sex, 8h — 19h |
| **Sábado** | 9h — 13h (apenas automático) |
| **Domingo** | Sem envio |
| **Silent hours** | 20h — 8h (mensagens acumulam, não disparam) |
| **Fuso do cliente** | Respeitar o fuso do contato (se disponível) |

---

## TEMPLATES DE WHATSAPP

### Template 1 — Boas-vindas (Lead Novo)

**Gatilho:** Lead acabou de ser criado no CRM (formulário, trial, indicação).
**Timing:** Imediato (assim que o lead entra).
**Onde cai:** Pipeline de Vendas, estágio "Lead Novo".

```
Oi {{contact_name}}, tudo bem?

Aqui é o Alessandro, da Keyroz Digital Solutions. Vi que você se interessou pelo KDS CRM.

Queria entender melhor seu momento: qual a maior dificuldade que você tem com vendas hoje?

Se quiser, a gente pode marcar 30 minutos pra eu te mostrar como o KDS CRM pode ajudar.
```

**Workflow associado:**
- 5 min sem resposta → enviar template 2 (qualificação)
- 24h sem resposta → mover para nurture frio

---

### Template 2 — Qualificação Rápida

**Gatilho:** Lead não respondeu à boas-vindas em 5 min.
**Timing:** D0 + 5 min.
**Onde cai:** Pipeline de Vendas, estágio "Lead Novo".

```
{{contact_name}}, sem pressão! 

Só pra entender melhor: você trabalha com vendas? Já usou algum CRM antes?

É rapidinho, 2 perguntas só.
```

**Workflow associado:**
- Respondeu → avaliar resposta e mover para próximo estágio ou agendar diagnóstico
- 24h sem resposta → template 3 (valor)

---

### Template 3 — Gatilho de Valor

**Gatilho:** Lead não respondeu à qualificação em 24h.
**Timing:** D0 + 24h.
**Onde cai:** Pipeline de Vendas, estágio "Lead Novo" (nurture automático).

```
{{contact_name}}, tudo bem?

Sabia que empresas que usam CRM aumentam em média 30% a conversão de leads?

E com o KDS CRM, você ainda ganha IA integrada pra qualificar os leads antes da sua equipe perder tempo.

TOP 1min? Me chama aqui.
```

**Workflow associado:**
- 48h sem resposta → mover para nurture frio (sequência D1-D30)
- Respondeu → agendar diagnóstico

---

### Template 4 — Confirmação de Diagnóstico

**Gatilho:** Lead agendou o diagnóstico pelo calendário.
**Timing:** Imediato após o agendamento.
**Onde cai:** Pipeline de Vendas, estágio "Diagnóstico Agendado".

```
{{contact_name}}!

Seu diagnóstico de maturidade digital está confirmado:

📅 Data: {{appointment_date}}
⏰ Horário: {{appointment_time}}
📍 Onde: Google Meet (link na confirmação)

Vamos passar 30 minutos juntos analisando onde sua empresa mais perde vendas e o que dá pra fazer com IA.

Já separa aí: quantos leads entram por mês hoje e quantos você fecha?

Até lá!
```

**Workflow associado:**
- Nenhum (é uma confirmação)

---

### Template 5 — Lembrete de Diagnóstico (D-1)

**Gatilho:** 24h antes do diagnóstico.
**Timing:** D-1, 9h.
**Onde cai:** Pipeline de Vendas, estágio "Diagnóstico Agendado".

```
{{contact_name}}, lembrando do nosso diagnóstico amanhã:

📅 {{appointment_date}} às {{appointment_time}}
🔗 Link: {{meet_link}}

É rapidinho — 30 minutos. Já valeu a pena para várias empresas que atendi.

Confirmado?
```

**Workflow associado:**
- Respondeu "confirmado" → manter agendamento
- Não respondeu até 2h antes → template 6
- Respondeu "cancelar" → remarcar

---

### Template 6 — Lembrete de Diagnóstico (H-1)

**Gatilho:** 1h antes do diagnóstico.
**Timing:** 1h antes.
**Onde cai:** Pipeline de Vendas, estágio "Diagnóstico Agendado".

```
{{contact_name}}, estamos chegando!

Daqui 1 hora a gente se encontra. O link é o mesmo:

🔗 {{meet_link}}

Te espero lá!
```

**Workflow associado:**
- Não compareceu → template 7 (15 min após horário)

---

### Template 7 — Não Compareceu (Re-agendamento)

**Gatilho:** Lead não entrou na call 15 min após o horário agendado.
**Timing:** D0 + 15 min.
**Onde cai:** Pipeline de Vendas, estágio "Diagnóstico Agendado".

```
{{contact_name}}, não consegui te encontrar na call.

Acontece! Se quiser, a gente remarca. É só escolher outro horário aqui:

🔗 {{reschedule_link}}

Se não for o momento, tudo bem — mas se mudar de ideia, me chama.
```

**Workflow associado:**
- Remarcou → voltar ao estágio "Diagnóstico Agendado"
- Não remarcou em 7 dias → mover para nurture frio
- Ignorou por 30 dias → tag `lead_perdido`, estágio "Perdido"

---

### Template 8 — Pós-Diagnóstico (Follow-up D1)

**Gatilho:** Diagnóstico foi realizado (appointment marcado como concluído).
**Timing:** D+1, 10h.
**Onde cai:** Pipeline de Vendas, estágio "Diagnóstico Realizado".

```
{{contact_name}}, obrigado pela conversa de ontem!

Como comentei, os 3 gaps que identificamos foram:

1️⃣ {{gap_1}}
2️⃣ {{gap_2}}
3️⃣ {{gap_3}}

To preparando uma proposta com base nisso. Te envio até amanhã. Combinado?
```

**Workflow associado:**
- Nenhum (preparação manual da proposta)

---

### Template 9 — Proposta Enviada

**Gatilho:** Proposta foi enviada ao lead (movido para estágio "Proposta Enviada").
**Timing:** Imediato após envio da proposta.
**Onde cai:** Pipeline de Vendas, estágio "Proposta Enviada".

```
{{contact_name}}, acabei de te enviar a proposta completa.

Segue o resumo:

📋 Projeto: {{project_name}}
💰 Investimento: R$ {{investment_value}}
📆 Prazo de implantação: {{implementation_days}} dias
🚀 Resultado esperado em 90 dias: {{expected_result}}

Dá uma olhada e me fala se bater com o que você esperava.

A proposta fica válida por 7 dias.
```

**Workflow associado:**
- 3 dias sem resposta → template 10 (warm)
- 7 dias sem resposta → mover para nurture (perdeu validade)

---

### Template 10 — Follow-up Proposta (D3)

**Gatilho:** Proposta enviada há 3 dias sem retorno.
**Timing:** D+3, 14h.
**Onde cai:** Pipeline de Vendas, estágio "Proposta Enviada".

```
{{contact_name}}, conseguiu dar uma olhada na proposta?

Qualquer duvida, pode perguntar. Posso ajustar o que precisar.

Se quiser, a gente pode se falar por 10 min pra alinhar.
```

**Workflow associado:**
- Respondeu → negociar / ajustar / fechar
- 7 dias sem resposta → template 11

---

### Template 11 — Follow-up Proposta (D7)

**Gatilho:** Proposta enviada há 7 dias sem retorno.
**Timing:** D+7, 10h.
**Onde cai:** Pipeline de Vendas, estágio "Proposta Enviada".

```
{{contact_name}}, tudo bem?

Vi que a proposta que enviei nao teve retorno. Sem problemas se nao for o momento.

So pra saber: foi o valor, o escopo ou o timing?

Sua resposta me ajuda a melhorar. E se quiser reativar depois, e so chamar.
```

**Workflow associado:**
- Respondeu com objeção → tratar manualmente
- Não respondeu → mover para estágio "Perdido" + nurture D1-D90

---

### Template 12 — Suporte / CS Check-in Semanal

**Gatilho:** Cliente completou 7 dias de uso.
**Timing:** D+7, 10h.
**Onde cai:** Pipeline de CS, estágio "Ativo".

```
{{contact_name}}, tudo bem?

Completou 1 semana com o KDS CRM! Como esta sendo a experiencia?

Alguma dificuldade? Posso ajudar com algo.

Ah, e uma dica: {{weekly_tip}}
```

**Workflow associado:**
- Respondeu com problema → abrir ticket de suporte
- Não respondeu → CS normal (repetir D14, D21, D30 com dicas diferentes)

---

### Template 13 — Alerta de Inatividade (7 dias)

**Gatilho:** Cliente não logou no KDS CRM nos últimos 7 dias.
**Timing:** D+7 sem login, 14h.
**Onde cai:** Pipeline de CS, estágio "Ativo" → alerta de risco.

```
{{contact_name}}, vi que você não acessa o KDS CRM há alguns dias.

Esta tudo bem? Algum problema com o sistema?

Se precisar de ajuda, to aqui. Posso revisar o que estiver travando.
```

**Workflow associado:**
- Respondeu → resolver problema, ajustar
- Não respondeu → repetir em D+14 (template 14)

---

### Template 14 — Alerta de Inatividade (15 dias)

**Gatilho:** Cliente não logou nos últimos 15 dias.
**Timing:** D+15 sem login, 10h.
**Onde cai:** Pipeline de CS, estágio "Em Risco".

```
{{contact_name}}, notei que ja faz um tempo que voce nao usa o KDS CRM.

Se o sistema nao esta ajudando como deveria, a gente pode ajustar. Se for outra coisa, tudo bem tambem.

Vale uma call de 10 min pra gente alinhar?
```

**Workflow associado:**
- Aceitar call → CS agenda e revisa
- Recusar → perguntar se quer cancelar ou manter
- Não responder → template 15 em D+30

---

### Template 15 — Call de Retenção (Risco Crítico)

**Gatilho:** Cliente sinalizou cancelamento ou 30+ dias sem login.
**Timing:** Imediato.
**Onde cai:** Pipeline de CS, estágio "Em Risco" ou "Cancelado".

```
{{contact_name}}, recebi seu pedido de cancelamento.

Antes de processar, gostaria de entender: o que aconteceu?

Se foi algum problema com o sistema, posso resolver. Se for questao de budget, podemos ajustar o plano.

Vale 10 min pra conversarmos?
```

**Workflow associado:**
- Aceitar → call de retenção (ver doc 06 — CS)
- Recusar → processar cancelamento, exportar dados

---

### Template 16 — Pedido de Indicação

**Gatilho:** Cliente completou 90 dias com NPS 9-10.
**Timing:** D+90, 10h.
**Onde cai:** Pipeline de CS, estágio "Ativo".

```
{{contact_name}}, fico feliz em saber que o KDS CRM esta ajudando!

Uma coisa que faz toda diferenca pra gente e a indicacao. Se voce conhece algum empresario que esta passando pelo mesmo problema que voce tinha antes do KDS, me indica?

Tanto voce quanto quem indicar ganham um bonus de {{bonus_value}}.
```

**Workflow associado:**
- Indicou → criar lead com origem "indicacao", tag `indicado_por_{{contact_name}}`
- Não indicou → repetir em D+180

---

### Template 17 — Proposta de Renovação (D-60)

**Gatilho:** Faltam 60 dias para o vencimento do contrato.
**Timing:** D-60, 10h.
**Onde cai:** Pipeline de CS, estágio "Renovação".

```
{{contact_name}}, o contrato do KDS CRM esta perto de vencer.

Preparamos um relatorio dos ultimos 12 meses pra voce ver os resultados:

📊 {{report_link}}

E ja vamos enviar a proposta de renovacao nos proximos dias. Se quiser antecipar e garantir um desconto, me avisa.
```

**Workflow associado:**
- Nenhum (preparação manual da renovação)

---

## SNIPS (RESPOSTAS RÁPIDAS)

Snips são respostas prontas para situações recorrentes. Digite `/` na caixa de texto do WhatsApp no GHL e o comando aparece.

| Comando | Texto | Quando usar |
|---------|-------|-------------|
| `/diagnostico` | "Vamos marcar 30 min pra eu analisar sua operação? Me manda seu melhor horário." | Lead perguntou sobre o KDS CRM |
| `/preco` | "O valor depende do escopo. Fazemos um diagnóstico gratuito de 30 min pra entender o que você precisa e dai te passo o valor certo." | Lead perguntou quanto custa |
| `/objecao_caro` | "Entendo. Deixa eu te perguntar: quanto você acha que está perdendo por mês com leads que ninguém acompanha? Se o KDS CRM custar menos que isso, ele se paga sozinho." | Lead disse "é caro" |
| `/objecao_pensar` | "Claro. O que exatamente você precisa pensar? Posso ajudar com informações." | Lead disse "vou pensar" |
| `/objecao_crm` | "Já usou algum CRM antes? O que não funcionou? No KDS CRM a diferença é que a gente implementa processo + ferramenta juntos — 90% dos CRMs falham porque tentam colocar tecnologia em processo bagunçado." | Lead disse "já tentei CRM" |
| `/indicacao` | "Fico feliz que você gostou! Se conhecer alguém que precise, me indica. Você ganha um bônus e a pessoa também." | Cliente satisfeito |
| `/cancelar` | "Entendi. Vou processar o cancelamento. Se mudar de ideia, estou aqui." | Cliente quer cancelar |
| `/reagendar` | "Sem problemas! Segue o link pra escolher um novo horário: {{reschedule_link}}" | Lead não compareceu |

---

## WORKFLOWS DE CONVERSA

### Workflow 1 — Lead Respondeu

**Trigger:** Customer Reply (inbound WhatsApp message).
**Ação:**
- Se não tem tag → aguardar resposta manual
- Se conteúdo contém "preço", "quanto custa" → aplicar tag `interesse_preco`
- Se conteúdo contém "não", "obrigado" → aplicar tag `frio`

### Workflow 2 — Lead Não Respondeu em 24h

**Trigger:** Scheduler (24h após última mensagem enviada).
**Condição:** Última mensagem foi enviada e sem resposta.
**Ação:**
- Enviar template de follow-up correspondente ao estágio

### Workflow 3 — Conversa Sem Atividade por 7 Dias

**Trigger:** Scheduler (7 dias sem atividade na conversa).
**Condição:** Nenhuma mensagem de nenhum dos lados.
**Ação:**
- Mover para nurture frio (estágio "Lead Perdido" se for lead, ou alerta de risco se for cliente)

---

## CAMPOS PERSONALIZADOS DE CONVERSA

| Campo | Tipo | Uso |
|-------|------|-----|
| `last_outbound_date` | Data | Última data que enviamos mensagem |
| `last_inbound_date` | Data | Última data que o cliente respondeu |
| `response_time_avg` | Número | Tempo médio de resposta (min) |
| `conversation_status` | Seleção | "ativa", "fria", "bloqueada" |

---

## PRÓXIMO MÓDULO

**06 — Sites e Funis** (Landing page de diagnóstico, página de proposta, página de obrigado)

---

*Documento 05/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

# 12 — Workflows e Automações
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE SÃO

Workflows são automações que executam ações quando um gatilho (trigger) é ativado. Cada workflow tem: um trigger, condições (opcionais) e uma sequência de ações.

A estratégia exige **12 workflows obrigatórios**.

**Como criar:** Automations → Workflows → Add New Workflow

---

## LISTA COMPLETA DE WORKFLOWS

| # | Workflow | Trigger | Ações | Ref. Estratégia |
|---|----------|---------|-------|-----------------|
| 1 | Lead Novo → Qualificação | Contact Created | Tag + Pipeline + WhatsApp | Doc 04 |
| 2 | Diagnóstico Agendado | Appointment Created | Tag + Pipeline + Confirmação | Doc 04 |
| 3 | Diagnóstico Realizado | Appointment Completed | Tag + Pipeline + Segue Proposta | Doc 04 |
| 4 | Lembrete Diagnóstico D-1 | Scheduler | WhatsApp template T5 | Doc 04 |
| 5 | Lembrete Diagnóstico H-1 | Scheduler | WhatsApp template T6 | Doc 04 |
| 6 | Não Compareceu | Appointment No Show | Tag + WhatsApp T7 + Re-agendamento | Doc 04 |
| 7 | Proposta Sem Retorno (D3) | Scheduler | WhatsApp template T10 | Doc 04 |
| 8 | Proposta Sem Retorno (D7) | Scheduler | WhatsApp template T11 + Pipeline Perdido | Doc 04 |
| 9 | Pagamento Recebido | Payment Received | Tag + Pipeline Onboarding + Recibo | Doc 08 |
| 10 | CS Inatividade (7 dias) | Scheduler | Tag + WhatsApp T13 | Doc 06 |
| 11 | CS Inatividade (15 dias) | Scheduler | Tag + Pipeline Risco + WhatsApp T14 | Doc 06 |
| 12 | NPS Trimestral | Scheduler | Survey + Workflow por nota | Doc 09 |

---

## WORKFLOW 1 — LEAD NOVO → QUALIFICAÇÃO

**Gatilho:** Contact Created

**Condições:** Nenhuma (todos os leads passam por aqui)

**Ações:**
1. Aplicar tag: `lead`
2. Adicionar ao pipeline: Vendas (estágio: Lead Novo)
3. Se `lead_source` = "meta_ads" → tag: `origem_meta_ads`
4. Se `lead_source` = "google_ads" → tag: `origem_google_ads`
5. Se `lead_source` = "indicacao" → tag: `origem_indicacao`
6. Se segment = "agencia" → mover para pipeline: Agencias (estágio: Trial)
7. Enviar WhatsApp template T1 (Boas-vindas)
8. Se não houver resposta em 5 min → enviar T2 (Qualificação)
9. Se não houver resposta em 24h → enviar T3 (Gatilho de Valor)

---

## WORKFLOW 2 — DIAGNÓSTICO AGENDADO

**Gatilho:** Appointment Created (serviço = "Diagnóstico Gratuito")

**Condições:** Calendar = "Diagnóstico de Maturidade Digital"

**Ações:**
1. Aplicar tag: `diagnostico_agendado`
2. Mover para estágio: Diagnóstico Agendado (pipeline: Vendas)
3. Atualizar campo: `appointment_type` = "diagnostico"
4. Enviar WhatsApp template T4 (Confirmação)

---

## WORKFLOW 3 — DIAGNÓSTICO REALIZADO

**Gatilho:** Appointment Completed (appointment de diagnóstico)

**Condições:** appointment_type = "diagnostico"

**Ações:**
1. Aplicar tag: `diagnosticado`
2. Mover para estágio: Diagnóstico Realizado (pipeline: Vendas)
3. Enviar WhatsApp template T8 (Pós-diagnóstico D1)
4. Aguardar 24h
5. Se nenhuma oportunidade foi criada → notificar você (ação manual)

---

## WORKFLOW 4 — LEMBRETE DIAGNÓSTICO D-1

**Gatilho:** Scheduler (24h antes do appointment)

**Condições:** Appointment status = "confirmed" e tipo = "diagnostico"

**Ações:**
1. Se appointment confirmado → enviar WhatsApp template T5 (Lembrete D-1)
2. Se appointment cancelado → remover tag + mover para nurture

---

## WORKFLOW 5 — LEMBRETE DIAGNÓSTICO H-1

**Gatilho:** Scheduler (1h antes do appointment)

**Condições:** Appointment status = "confirmed" e tipo = "diagnostico"

**Ações:**
1. Enviar WhatsApp template T6 (Lembrete H-1)

---

## WORKFLOW 6 — NÃO COMPARECEU

**Gatilho:** Appointment No Show (appointment não ocorreu)

**Condições:** appointment_type = "diagnostico"

**Ações:**
1. Aplicar tag: `no_show`
2. Enviar WhatsApp template T7 (Re-agendamento)
3. Se reagendar em 7 dias → remover tag + mover para estágio anterior
4. Se não reagendar em 7 dias → mover para estágio: Perdido (pipeline: Vendas)
5. Se não reagendar em 30 dias → tag: `lead_perdido` + nurture frio

---

## WORKFLOW 7 — PROPOSTA SEM RETORNO (D3)

**Gatilho:** Scheduler (3 dias após estágio "Proposta Enviada")

**Condições:** Ainda está no estágio "Proposta Enviada"

**Ações:**
1. Enviar WhatsApp template T10 (Follow-up D3)

---

## WORKFLOW 8 — PROPOSTA SEM RETORNO (D7)

**Gatilho:** Scheduler (7 dias após estágio "Proposta Enviada")

**Condições:** Ainda está no estágio "Proposta Enviada"

**Ações:**
1. Enviar WhatsApp template T11 (Follow-up D7)
2. Mover para estágio: Perdido (pipeline: Vendas)
3. Aplicar tag: `lead_perdido`
4. Iniciar nurture frio (sequência D1-D30)

---

## WORKFLOW 9 — PAGAMENTO RECEBIDO

**Gatilho:** Payment Received

**Condições:** Nenhuma

**Ações:**
1. Aplicar tag: `cliente`
2. Mover para pipeline: Onboarding (estágio: Contrato Assinado)
3. Se tipo = "subscription" → mover para pipeline: CS (estágio: Ativo)
4. Se tipo = "one_time" (implantação) → notificar você para iniciar setup
5. Enviar e-mail de recibo

---

## WORKFLOW 10 — CS INATIVIDADE (7 DIAS)

**Gatilho:** Scheduler (7 dias sem login no CRM)

**Condições:** Pipeline CS = "Ativo"

**Ações:**
1. Aplicar tag: `alerta_7dias`
2. Enviar WhatsApp template T13 (Alerta 7 dias)
3. Se responder → resolver + remover tag
4. Se não responder em mais 7 dias → workflow 11

---

## WORKFLOW 11 — CS INATIVIDADE (15 DIAS)

**Gatilho:** Scheduler (15 dias sem login)

**Condições:** Pipeline CS = "Ativo" com tag `alerta_7dias`

**Ações:**
1. Aplicar tag: `alerta_15dias`
2. Mover pipeline CS para estágio: Em Risco
3. Enviar WhatsApp template T14 (Alerta 15 dias)
4. Se responder → call de CS
5. Se não responder em mais 15 dias → template T15 (Retenção)

---

## WORKFLOW 12 — NPS TRIMESTRAL

**Gatilho:** Scheduler (a cada 90 dias para clientes com CS = "Ativo")

**Condições:** Pipeline CS = "Ativo"

**Ações:**
1. Enviar pesquisa NPS via WhatsApp (link do survey)
2. Se resposta NPS 9-10 → tag: `promotor` + pedir avaliação Google + template T16 (indicação)
3. Se resposta NPS 7-8 → tag: `neutro` + "o que podemos melhorar?"
4. Se resposta NPS 0-6 → tag: `detrator` + mover CS para "Em Risco" + notificar retenção
5. Se não responder em 7 dias → re-enviar 1x

---

## WORKFLOWS ADICIONAIS (RECOMENDADOS)

### W13 — INDICAÇÃO CONVERTIDA

**Gatilho:** Contact Created com lead_source = "indicacao"

**Condições:** Nenhuma

**Ações:**
1. Aplicar tag: `indicado_por_{{contact_name_indicou}}`
2. Notificar você para aplicar bônus a quem indicou
3. Enviar agradecimento personalizado

### W14 — CONTRATO PRÓXIMO DO VENCIMENTO (D-90)

**Gatilho:** Scheduler (90 dias antes de contract_end_date)

**Condições:** Pipeline CS = "Ativo" e contract_end_date = X

**Ações:**
1. Enviar WhatsApp template T17 (Renovação)
2. Mover CS para estágio: Renovação

### W15 — AVALIAÇÃO RECEBIDA (GOOGLE)

**Gatilho:** Reputation Review Received

**Condições:** Nenhuma

**Ações:**
1. Se rating 4-5 → responder com template de agradecimento (Reviews AI ou manual)
2. Se rating 1-3 → responder com oferta de solução + notificar CS

---

## RESUMO DOS WORKFLOWS

| # | Workflow | Trigger | Timing | Ações |
|---|----------|---------|--------|-------|
| 1 | Lead Novo | Contact Created | Imediato | Tag + Pipeline + WhatsApp |
| 2 | Diag. Agendado | Appointment Created | Imediato | Tag + Pipeline + Confirmação |
| 3 | Diag. Realizado | Appointment Completed | Imediato | Tag + Pipeline + T8 |
| 4 | Lembrete D-1 | Scheduler | 24h antes | T5 |
| 5 | Lembrete H-1 | Scheduler | 1h antes | T6 |
| 6 | Não Compareceu | No Show | Imediato | T7 + re-agendamento |
| 7 | Proposta D3 | Scheduler | D+3 | T10 |
| 8 | Proposta D7 | Scheduler | D+7 | T11 + Perdido |
| 9 | Pagamento | Payment Received | Imediato | Tag + Pipeline + Recibo |
| 10 | CS Inatividade 7d | Scheduler | 7 dias | T13 + tag |
| 11 | CS Inatividade 15d | Scheduler | 15 dias | T14 + Risco |
| 12 | NPS Trimestral | Scheduler | 90 dias | Survey + workflow por nota |
| 13 | Indicação | Contact Created | Imediato | Bonus + agradecimento |
| 14 | Renovação D-90 | Scheduler | D-90 | T17 + estágio |
| 15 | Avaliação GMB | Review Received | Imediato | Resposta + notificação |

---

## TRIGGER LINKS

Trigger Links são URLs que disparam workflows quando clicados. Usados para automações externas.

| Link | Dispara workflow | Quando usar |
|------|-----------------|-------------|
| `link-reagendar-diagnostico` | W6 — Não Compareceu | Lead clica para reagendar |
| `link-aceitar-proposta` | W9 — Pagamento Recebido | Cliente aceita proposta |
| `link-solicitar-suporte` | Abrir ticket de suporte | Cliente precisa de ajuda |

**Onde criar:** Automations → Trigger Links

---

## WORKFLOWS EXTERNOS (n8n)

Para automações mais complexas que o GHL não consegue fazer nativamente:

| Automação | O que faz | Gatilho GHL | Ação n8n |
|-----------|-----------|-------------|----------|
| Qualificação por IA | Lead é analisado por GPT antes de entrar no pipeline | Webhook (Contact Created) | OpenAI → classificação → atualiza custom field |
| Relatório mensal | Gera PDF com resultados do cliente | Scheduler (mensal) | Busca dados no GHL via API → gera PDF → salva no Media Drive |
| Enriquecimento de lead | Busca dados públicos do lead (CNPJ, rede social) | Webhook (Contact Created) | API externa → atualiza contato no GHL |

---

## PRÓXIMO MÓDULO

**13 — Conversation AI** (Assistente de IA, base de conhecimento, ferramentas, transferência humana)

---

*Documento 12/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

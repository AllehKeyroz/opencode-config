# 03 — Pipelines e Leads
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE SÃO

Pipelines são os funis por onde os contatos (leads, clientes) avançam em estágios. Cada pipeline representa um processo de negócio: vendas, implantação, pós-venda.

A estratégia exige **3 pipelines** obrigatórios e **1 opcional**.

---

## PIPELINE 1 — VENDAS

**Finalidade:** Controlar o processo comercial desde o contato inicial até o fechamento.

**Referência na estratégia:** Doc 04 (Processo de Vendas)

### Estágios

| # | Estágio | O que acontece | Quem move | Automatização |
|---|---------|---------------|-----------|--------------|
| 1 | **Lead Novo** | Contato criado no CRM (formulário, indicação, trial) | Automático (trigger) | Criar contato → adicionar ao pipeline |
| 2 | **Diagnóstico Agendado** | Lead marcou call de diagnóstico | Vendas (manual) | Mudar estágio quando appointment for criado |
| 3 | **Diagnóstico Realizado** | Call de 30-60 min concluída | Vendas (manual) | Mudar estágio quando appointment for completed |
| 4 | **Proposta Enviada** | Proposta de 1 página enviada ao lead | Vendas (manual) | Mudar estágio + disparar workflow de follow-up |
| 5 | **Negociação** | Lead com objeções abertas | Vendas (manual) | Workflow de follow-up D1, D3, D7 |
| 6 | **Ganho** | Contrato assinado + pagamento confirmado | Vendas (manual) | Mudar para pipeline de Onboarding |
| 7 | **Perdido** | Lead não fechou (com motivo) | Vendas (manual) | Mover para nurture D1-D90 |

### Campos Personalizados do Pipeline

| Campo | Tipo | Obrigatório? | Uso |
|-------|------|-------------|-----|
| `diagnostic_data` | Texto | Não | Anotações do diagnóstico (5 pilares) |
| `diagnostic_score` | Número | Não | Nota média dos 5 pilares (0-10) |
| `pipeline_value` | Monetário | Sim | Valor do projeto (R$ 6k + R$ 5.121/mês) |
| `segment` | Seleção | Sim | "agência" ou "cliente_final" |
| `product_type` | Seleção | Sim | "subconta", "projeto_completo", "ai_agent" |
| `lead_source` | Seleção | Sim | "meta_ads", "google_ads", "indicacao", "linkedin", "comunidade" |
| `lost_reason` | Texto | Não | Motivo da perda (preencha se estágio = Perdido) |

### Tags Automáticas por Estágio

| Estágio | Tag aplicada |
|---------|-------------|
| Lead Novo | `lead` |
| Diagnóstico Agendado | `diagnostico_agendado` |
| Diagnóstico Realizado | `diagnosticado` |
| Proposta Enviada | `propostado` |
| Ganho | `cliente` |
| Perdido | `lead_perdido` |

---

## PIPELINE 2 — ONBOARDING

**Finalidade:** Acompanhar a implantação do cliente desde o contrato até o go-live.

**Referência na estratégia:** Doc 05 (Entrega e Operação)

### Estágios

| # | Estágio | O que acontece | Prazo máximo |
|---|---------|---------------|-------------|
| 1 | **Contrato Assinado** | Cliente fechou, contrato enviado e pago | D0 |
| 2 | **Setup Técnico** | Criação de subconta, branding, configurações | D1-D4 |
| 3 | **Treinamento** | Call de treinamento com a equipe do cliente | D5-D6 |
| 4 | **Go-Live** | Sistema em produção, cliente usando | D7 |
| 5 | **Suporte Pós** | Acompanhamento de 30 dias pós go-live | D8-D30 |
| 6 | **Concluído** | Onboarding finalizado, cliente ativo | D30 |

### Campos Personalizados do Pipeline

| Campo | Tipo | Obrigatório? | Uso |
|-------|------|-------------|-----|
| `ghl_subaccount_id` | Texto | Sim | ID da subconta criada para o cliente |
| `snapshot_applied` | Booleano | Sim | Snapshot foi aplicado? |
| `training_date` | Data | Sim | Data do treinamento |
| `go_live_date` | Data | Sim | Data do go-live |
| `client_whatsapp` | Telefone | Sim | WhatsApp do contato principal |

---

## PIPELINE 3 — CS (PÓS-VENDA)

**Finalidade:** Acompanhar a saúde do cliente ativo, identificar riscos de churn e oportunidades de expansão.

**Referência na estratégia:** Doc 06 (CS), Doc 07 (Expansão)

### Estágios

| # | Estágio | O que significa | Ação |
|---|---------|---------------|------|
| 1 | **Ativo** | Cliente usando o KDS CRM normalmente | CS padrão (check-in mensal) |
| 2 | **Em Risco** | Cliente não logou nos últimos 15 dias | CS intensivo (semanal) |
| 3 | **Oportunidade de Upsell** | Cliente maduro para AI Agent ou upgrade | Apresentar oferta |
| 4 | **Renovação** | Contato próximo do vencimento (D-90) | Iniciar cadência de renovação |
| 5 | **Cancelado** | Cliente encerrou a conta | Exportar dados + porta aberta |

### Campos Personalizados do Pipeline

| Campo | Tipo | Obrigatório? | Uso |
|-------|------|-------------|-----|
| `nps_score` | Número | Não | Última nota NPS do cliente |
| `last_login_date` | Data | Sim | Último acesso do cliente ao KDS CRM |
| `contract_end_date` | Data | Sim | Data de vencimento do contrato |
| `churn_risk` | Seleção | Sim | "baixo", "medio", "alto", "critico" |
| `upsell_offered` | Booleano | Não | Já recebeu oferta de upsell? |
| `customer_since` | Data | Sim | Data de início do cliente |

### Tags Automáticas

| Situação | Tag |
|----------|-----|
| NPS 9-10 | `promotor` |
| NPS 7-8 | `neutro` |
| NPS 0-6 | `detrator` |
| Não loga há 7 dias | `alerta_7dias` |
| Não loga há 15 dias | `alerta_15dias` |
| +12 meses de contrato | `veterano` |

---

## PIPELINE 4 — AGÊNCIAS (OPCIONAL)

**Finalidade:** Acompanhar agências parceiras que revendem o KDS CRM.

**Referência na estratégia:** Doc 02 (Segmentação), Doc 07 (Parceria Premium)

### Estágios

| # | Estágio | O que significa |
|---|---------|---------------|
| 1 | **Trial** | Agência testando o KDS CRM (30 dias) |
| 2 | **Ativa** | Agência com subconta ativa |
| 3 | **Parceiro Premium** | Agência com 6+ subcontas (plano Elite) |
| 4 | **Inativa** | Agência cancelou ou não renovou |

### Campos Personalizados

| Campo | Tipo | Uso |
|-------|------|-----|
| `agency_level` | Seleção | "standard", "premium", "elite" |
| `active_subaccounts` | Número | Quantas subcontas a agência tem ativas |
| `agency_commission` | Monetário | Comissão acumulada |

---

## RESUMO DOS PIPELINES

| Pipeline | Estágios | Finalidade | Contatos |
|----------|---------|-----------|---------|
| **Vendas** | 7 | Do lead ao fechamento | Todos os leads |
| **Onboarding** | 6 | Da implantação ao go-live | Clientes que fecharam |
| **CS** | 5 | Acompanhamento pós-venda | Clientes ativos |
| **Agências (opcional)** | 4 | Gestão de parceiros | Agências revendedoras |

---

## REGRAS DE MOVIMENTAÇÃO ENTRE PIPELINES

```
Pipeline de Vendas
  │
  ├── Ganho → Pipeline de Onboarding (estágio: Contrato Assinado)
  │              │
  │              └── Concluído → Pipeline de CS (estágio: Ativo)
  │
  └── Perdido → Nurture automático (fora do pipeline)
```

---

## TAGS GLOBAIS (USADAS EM TODOS OS PIPELINES)

| Tag | Finalidade | Automática? |
|-----|-----------|-------------|
| `lead` | Lead bruto | Sim (na criação) |
| `diagnosticado` | Diagnóstico realizado | Sim (mudança de estágio) |
| `cliente` | Cliente ativo | Sim (quando fecha) |
| `lead_perdido` | Lead que não fechou | Sim (estágio Perdido) |
| `alerta_7dias` | Sem login por 7 dias | Automática (workflow) |
| `alerta_15dias` | Sem login por 15 dias | Automática (workflow) |
| `promotor` | NPS 9-10 | Manual (CS) |
| `detrator` | NPS 0-6 | Manual (CS) |
| `cancelado` | Cliente cancelou | Sim (estágio Cancelado) |

---

## PRÓXIMO MÓDULO

**04 — Calendários** (Calendário de diagnóstico, calendário pessoal, calendário de distribuição)

---

*Documento 03/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

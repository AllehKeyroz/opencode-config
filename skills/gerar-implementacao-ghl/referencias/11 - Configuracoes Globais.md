# 11 — Configurações Globais
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

O módulo de Configurações (Settings) centraliza todas as definições da subconta: campos personalizados, tags, permissões, provedores de e-mail e dados da empresa.

**Acesso:** Sidebar → Settings (ícone de engrenagem)

**Seções abordadas neste documento:**
- Business Profile (dados da empresa)
- Custom Fields (campos personalizados)
- Tags (sistema de marcação)
- Users & Permissions (usuários e permissões)
- Timezone & Language (fuso e idioma)
- Integrations (visão geral do que já foi conectado)
- Security (autenticação)
- Snapshot Settings (configuração de snapshots)

---

## BUSINESS PROFILE

**Finalidade:** Dados cadastrais da Keyroz Digital Solutions que aparecem em templates, e-mails e documentos.

| Campo | Valor |
|-------|-------|
| **Nome da empresa** | Keyroz Digital Solutions |
| **Nome do produto (CRM)** | KDS CRM |
| **E-mail de suporte** | suporte@kdscrm.com.br |
| **WhatsApp** | Número conectado no Launchpad |
| **Endereço** | Luis Eduardo Magalhaes, BA |
| **Horário de funcionamento** | Seg-Sex 8h-19h, Sab 9h-13h |
| **Fuso horário** | Brasilia (GMT-3) |
| **Idioma** | Portugues (Brasil) |
| **Logo** | Upload do logo do KDS CRM (PNG) |
| **Favicon** | Upload do favicon |

---

## CUSTOM FIELDS (CAMPOS PERSONALIZADOS)

### Campos de Contato

Usados em: pipeline de Vendas, CS e formulários.

| Nome | Tipo | Valores / Exemplo | Pipeline | Obrigatório |
|------|------|-------------------|----------|-------------|
| `segment` | Seleção | "agencia", "cliente_final" | Vendas | Sim |
| `product_type` | Seleção | "subconta", "projeto_completo", "ai_agent" | Vendas | Sim |
| `lead_source` | Seleção | "meta_ads", "google_ads", "indicacao", "linkedin", "comunidade", "site", "whatsapp" | Vendas | Sim |
| `diagnostic_score` | Número | 0-10 | Vendas | Não |
| `diagnostic_data` | Texto (multi-linha) | Anotacoes do diagnostico | Vendas | Não |
| `company_size` | Número | Funcionarios | Vendas | Não |
| `monthly_revenue` | Monetário | Faturamento mensal | Vendas | Sim (qualificacao) |
| `lost_reason` | Texto | Motivo da perda | Vendas | Se estagio = Perdido |
| `churn_risk` | Seleção | "baixo", "medio", "alto", "critico" | CS | Sim |
| `nps_score` | Número | 0-10 | CS | Não |
| `last_login_date` | Data | Ultimo acesso | CS | Sim |
| `contract_end_date` | Data | Vencimento do contrato | CS | Sim |
| `customer_since` | Data | Data de inicio | CS | Sim |
| `upsell_offered` | Booleano | Sim/Nao | CS | Não |
| `ghl_subaccount_id` | Texto | ID da subconta criada | Onboarding | Sim |
| `snapshot_applied` | Booleano | Sim/Nao | Onboarding | Sim |
| `training_date` | Data | Data do treinamento | Onboarding | Sim |
| `go_live_date` | Data | Data do go-live | Onboarding | Sim |
| `agency_level` | Selecao | "standard", "premium", "elite" | Agencias | Sim |
| `active_subaccounts` | Numero | Quantidade ativa | Agencias | Sim |
| `agency_commission` | Monetario | Comissao acumulada | Agencias | Nao |

### Campos de Oportunidade

Usados em: pipelines de Vendas, Onboarding, CS.

| Nome | Tipo | Valores / Exemplo | Pipeline |
|------|------|-------------------|----------|
| `project_value` | Monetario | Valor do projeto | Vendas |
| `monthly_value` | Monetario | Valor da recorrencia | Vendas |
| `implementation_status` | Selecao | "pendente", "em_andamento", "concluido" | Onboarding |
| `onboarding_progress` | Numero | % de progresso | Onboarding |
| `total_tickets_opened` | Numero | Tickets de suporte | CS |

### Campos de Appointment

Usados em: calendario de diagnostico.

| Nome | Tipo | Uso |
|------|------|-----|
| `appointment_type` | Selecao | "diagnostico", "cs_call", "onboarding" |
| `contact_phone` | Telefone | WhatsApp para lembrete |

---

## TAGS

### Tags de Estagio (Automaticas)

Aplicadas por workflow conforme o contato avanca no pipeline.

| Tag | Aplicada em | Gatilho |
|-----|------------|---------|
| `lead` | Lead criado | Criacao de contato |
| `diagnostico_agendado` | Diagnostico marcado | Appointment criado |
| `diagnosticado` | Diagnostico realizado | Appointment completed |
| `propostado` | Proposta enviada | Mudanca de estagio |
| `cliente` | Contrato assinado | Pagamento recebido |
| `lead_perdido` | Lead nao fechou | Estagio = Perdido |
| `cancelado` | Cliente cancelou | Assinatura cancelada |

### Tags de CS (Automaticas)

| Tag | Aplicada em | Gatilho |
|-----|------------|---------|
| `alerta_7dias` | Sem login por 7 dias | Workflow scheduler |
| `alerta_15dias` | Sem login por 15 dias | Workflow scheduler |
| `promotor` | NPS 9-10 | Survey response |
| `neutro` | NPS 7-8 | Survey response |
| `detrator` | NPS 0-6 | Survey response |
| `veterano` | 12+ meses de contrato | Workflow scheduler |
| `indicou` | Cliente indicou outro | Workflow de indicacao |

### Tags de Origem (Automaticas)

| Tag | Aplicada em | Gatilho |
|-----|------------|---------|
| `origem_meta_ads` | Lead veio de anúncio | lead_source = meta_ads |
| `origem_google_ads` | Lead veio do Google Ads | lead_source = google_ads |
| `origem_linkedin` | Lead veio do LinkedIn | lead_source = linkedin |
| `origem_indicacao` | Lead foi indicado | lead_source = indicacao |
| `origem_site` | Lead veio do site | lead_source = site |

---

## USERS & PERMISSIONS

### Usuários da Subconta

| Usuario | Papel | Acesso |
|---------|-------|--------|
| Alessandro (Keyroz) | Admin | Full access |

*(A medida que a equipe crescer, novos usuarios serao adicionados.)*

### Permissoes por Modulo

| Modulo | Admin | User (futuro) |
|--------|-------|---------------|
| Dashboard | Full | View |
| Conversations | Full | Edit (proprias) |
| Calendar | Full | View |
| Contacts | Full | Edit |
| Pipelines | Full | View |
| Payments | Full | Sem acesso |
| Marketing (Social Planner) | Full | Edit |
| Websites/Funnels | Full | Edit |
| Automations (Workflows) | Full | Sem acesso |
| Conversation AI | Full | Sem acesso |
| AI Agents | Full | Sem acesso |
| Reputation | Full | Edit |
| Media Storage | Full | View |
| Settings | Full | Sem acesso |

---

## TIMEZONE & LANGUAGE

| Parametro | Configuracao |
|-----------|-------------|
| **Fuso horario** | America/Sao_Paulo (GMT-3) |
| **Idioma** | Portugues (Brasil) |
| **Formato de data** | DD/MM/AAAA |
| **Formato de hora** | HH:MM (24h) |
| **Moeda** | BRL (R$) |
| **Primeiro dia da semana** | Segunda-feira |

---

## INTEGRAÇÕES (VISÃO GERAL)

Status atual de todas as integrações configuradas:

| Integracao | Local | Status |
|-----------|-------|--------|
| WhatsApp Business | Launchpad | Conectado |
| Google My Business | Launchpad | Pendente |
| Facebook / Instagram | Launchpad | Pendente |
| Mercado Pago | Settings → Payments | Pendente |
| Google Drive | Media Storage | Pendente |
| Canva | Media Storage | Pendente |

---

## SECURITY

| Parametro | Configuracao |
|-----------|-------------|
| **Autenticacao de 2 fatores (2FA)** | Ativado (recomendado) |
| **Sessoes simultaneas** | Permitido |
| **Tempo de sessao** | 24h |
| **Notificacoes de login** | Ativado (e-mail) |
| **IP permitido** | Nao configurado (acesso de qualquer lugar) |

---

## SNAPSHOT SETTINGS

O Snapshot é o template completo da subconta KDS CRM. Ele contém todas as configurações acima e pode ser aplicado em novas subcontas de clientes (agências) para acelerar o onboarding.

**O que o Snapshot deve incluir:**
- [ ] Pipelines (Vendas, Onboarding, CS, Agencias)
- [ ] Custom Fields (todos os campos acima)
- [ ] Tags (todas as tags acima)
- [ ] Calendários (Diagnóstico + Pessoal)
- [ ] Funis / Sites (Landing page de diagnóstico)
- [ ] Templates de WhatsApp (se aplicável)
- [ ] Workflows (se aplicável)
- [ ] Dashboard (painéis padrão)

**O que o Snapshot NÃO inclui:**
- Conexões do Launchpad (WhatsApp, GMB, Facebook — precisam ser conectadas manualmente em cada subconta)
- Payments (Mercado Pago precisa ser conectado manualmente)

---

## PRÓXIMO MÓDULO

**12 — Workflows e Automações** (Todos os workflows necessários: triggers, ações, condições, integrações com n8n)

---

*Documento 11/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

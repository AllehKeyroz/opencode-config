# 04 — Calendários
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE SÃO

Calendários no GHL gerenciam agendamentos. Cada calendário tem um serviço associado (ex: "Diagnóstico de Maturidade Digital") com duração, disponibilidade e regras de agendamento.

A estratégia exige **2 calendários obrigatórios** e **1 opcional**.

---

## CALENDÁRIO 1 — DIAGNÓSTICO DE MATURIDADE DIGITAL

**Finalidade:** Permitir que leads agendem o diagnóstico gratuito de 30-60 min diretamente pelo link público, sem precisar falar com você.

**Referência na estratégia:** Doc 03 (Marketing — lead magnet), Doc 04 (Vendas — primeira reunião)

### Configuração

| Parâmetro | Valor |
|-----------|-------|
| **Nome do calendário** | Diagnóstico de Maturidade Digital |
| **Serviço** | Diagnóstico Gratuito — 30 min |
| **Tipo de agendamento** | Público (link compartilhável) |
| **Duração** | 30 min (prorrogável para 60 se necessário) |
| **Local** | Google Meet / Zoom (link gerado automaticamente) |
| **Buffer antes** | 5 min |
| **Buffer depois** | 5 min |
| **Disponibilidade** | Seg-Sex, 8h-12h e 14h-18h |
| **Lead time mínimo** | 2 horas |
| **Lead time máximo** | 30 dias |
| **Confirmação automática** | Sim |
| **Lembrete automático** | 24h antes + 1h antes |

### Como os leads encontram este calendário

| Origem | Caminho |
|--------|---------|
| **Formulário do site** | Lead preenche → redirecionado ao calendário |
| **Link no final de post do LinkedIn** | CTA → link direto do calendário |
| **QR code em apresentações** | Escaneia → agenda |
| **Link enviado por WhatsApp** | Conversa → link direto |

### Integrações

| Integração | O que faz |
|-----------|-----------|
| **Google Meet / Zoom** | Gera link de videochamada automaticamente |
| **Workflow de lead** | Lead agenda → contato criado no CRM → adicionado ao pipeline de Vendas (estágio: Diagnóstico Agendado) |
| **Workflow de confirmação** | Confirmação enviada por e-mail e WhatsApp |
| **Workflow de lembrete** | Lembrete enviado 24h e 1h antes |
| **Workflow de não comparecimento** | Se não comparecer: mover para nurture + re-agendar |

---

## CALENDÁRIO 2 — PESSOAL (INTERNO)

**Finalidade:** Gerenciar sua disponibilidade para calls internas, reuniões de CS, follow-ups e blocos de trabalho focado.

**Referência na estratégia:** Doc 05 (Entrega — calls de onboarding), Doc 06 (CS — check-ins)

### Configuração

| Parâmetro | Valor |
|-----------|-------|
| **Nome do calendário** | Keyroz — Interno |
| **Visibilidade** | Privado (apenas você vê os detalhes) |
| **Serviços** | Call de CS (15 min), Check-in Mensal (30 min), Reunião Interna |
| **Blocos de trabalho** | "Setup" (bloqueado, sem agendamento) |
| **Disponibilidade** | iguais ao calendário de diagnóstico |

### Serviços Internos

| Serviço | Duração | Uso |
|---------|---------|-----|
| **Call de CS** | 15 min | Check-in rápido com cliente ativo |
| **Check-in trimestral** | 30 min | Revisão de resultados + NPS |
| **Onboarding call** | 1h | Kickoff de novos clientes |
| **Bloco de Setup** | 2-4h | Tempo bloqueado para configuração técnica |

### Regras

- Blocos de Setup são bloqueados manualmente, sem agendamento público
- Calls de CS são agendadas manualmente por você (não tem link público)
- O calendário pessoal não aparece para clientes agendarem diretamente

---

## CALENDÁRIO 3 — DISTRIBUIÇÃO (OPCIONAL)

**Finalidade:** Criado quando houver equipe para distribuir leads, tarefas ou agendamentos entre múltiplos membros (ex: Head de Vendas, Head de CS).

**Referência na estratégia:** Doc 05 (Entrega — capacidade), Doc 09 (Métricas — tempo de resposta)

**Quando criar:** Quando a operação tiver mais de 1 pessoa atendendo clientes.

**Exemplo de uso:**
- Lead agenda diagnóstico → sistema distribui para o membro disponível
- Cliente solicita suporte → sistema encaminha para quem tem menor carga

---

## REGRAS DE CONFIGURAÇÃO DOS CALENDÁRIOS

### Disponibilidade

| Dia | Horário |
|-----|---------|
| Segunda a Sexta | 8h — 12h e 14h — 18h |
| Sábado | Fechado |
| Domingo | Fechado |
| **Fuso horário** | Configurar para Brasília (GMT-3) |

### Notificações

| Evento | Disparo | Canal |
|--------|---------|-------|
| Novo agendamento | Imediato | E-mail + WhatsApp |
| Confirmação ao lead | Automático | E-mail + WhatsApp |
| Lembrete D-1 | 24h antes | E-mail |
| Lembrete H-1 | 1h antes | WhatsApp |
| Não comparecimento | 15 min após horário | Sistema (para ação manual) |

### Recursos (Resources)

N/D — Não há recursos físicos para gerenciar (salas, equipamentos).

---

## RESUMO DOS CALENDÁRIOS

| Calendário | Tipo | Serviços | Público? |
|-----------|------|---------|----------|
| **Diagnóstico** | Público | Diagnóstico Gratuito | Sim (link) |
| **Pessoal** | Privado | CS calls, check-ins, blocos de setup | Não |
| **Distribuição** | Opcional | Depende da equipe | Quando houver time |

---

## CAMPOS PERSONALIZADOS DO APPOINTMENT

| Campo | Tipo | Obrigatório? | Calendário |
|-------|------|-------------|-----------|
| `appointment_type` | Seleção | Sim | Diagnóstico: "diagnostico" / CS: "cs_call" |
| `lead_source` | Texto | Sim | Origem do agendamento (link, formulário, whatsapp) |
| `contact_phone` | Telefone | Sim | WhatsApp do lead |
| `diagnostic_notes` | Texto | Não | Anotações do diagnóstico (preenchido após) |

---

## PRÓXIMO MÓDULO

**05 — Conversas e WhatsApp** (Templates de mensagem, snippets, integração WhatsApp, canais de comunicação)

---

*Documento 04/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

# 01 — Launchpad
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

Painel que lista as integrações disponíveis no GHL e permite conectá-las. Cada integração conectada aqui desbloqueia funcionalidades usadas na estratégia.

Nem tudo que está no Launchpad vai ser usado. Abaixo está o filtro do que a estratégia exige.

---

## CONEXÕES EXIGIDAS PELA ESTRATÉGIA

### WhatsApp

**O que desbloqueia:** Canal principal de comunicação da estratégia. Toda a sequência de nurture (doc 03), o diagnóstico gratuito, as conversas de vendas (doc 04) e o suporte ao cliente (doc 06) passam por aqui.

**Referência na estratégia:**
- Doc 03 — Marketing: nurture sequences D1-D90 automatizadas via WhatsApp
- Doc 04 — Vendas: follow-up pós-diagnóstico e propostas
- Doc 06 — CS: check-in semanal com clientes ativos

**O que configurar aqui:** Conectar o número de WhatsApp Business. O resto (templates, automações, horário) é feito nos módulos específicos (Settings → WhatsApp e Workflows).

**Status:** Já conectado.

---

### Google My Business

**O que desbloqueia:** Permite gerenciar o perfil do Google Meu Negócio diretamente do GHL — responder avaliações, ver estatísticas, publicar posts.

**Referência na estratégia:**
- Doc 03 — Marketing: canal de aquisição orgânica, prioridade máxima
- Doc 08 — Marketing (Social Planner + GMB): gestão de reputação

**O que configurar aqui:** Conectar a conta Google associada ao perfil empresarial da Keyroz.

---

### Facebook

**O que desbloqueia:** Leads de anúncios do Facebook/Instagram caem automaticamente no CRM. Mensagens do Messenger podem ser respondidas da página de Conversas. Permite agendar posts no Social Planner.

**Referência na estratégia:**
- Doc 03 — Marketing: campanhas de Meta Ads (diagnóstico gratuito + trial) desde o dia 1
- Doc 03 — Marketing: Social Planner para agendamento de conteúdo orgânico

**O que configurar aqui:** Conectar a página do Facebook e a conta do Instagram da Keyroz.

---

### Chat Widget

**O que desbloqueia:** Um código JavaScript que adiciona um chat ao site. Visitantes iniciam conversas que caem direto no CRM.

**Referência na estratégia:**
- Doc 03 — Marketing: captura de leads do site da Keyroz (quando o site estiver no ar)

**O que configurar aqui:** Gerar o código e instalar no site. A verificação de status pode não ser precisa — testar manualmente.

---

## CONEXÕES QUE NÃO FAZEM PARTE DA ESTRATÉGIA ATUAL

| Integração | Por que não usar |
|-----------|-----------------|
| **Stripe** | O provedor de pagamento definido na estratégia é Mercado Pago (ver doc 09 — Pagamentos). Stripe não será usado. |
| **WordPress** | A estratégia não prevê hospedagem de sites WordPress. O site da Keyroz usa outra plataforma. |
| **Listagens** | Gestão de presença online em diretórios não está no escopo dos 12 documentos. Pode ser ativado futuramente. |
| **App Mobile** | Não é uma integração, é um link para baixar o app. Útil depois que a operação estiver rodando. |
| **Adicionar Usuário** | Não é uma integração de serviço externo. Usado quando houver equipe para convidar. |

---

## RESUMO DO QUE PRECISA SER FEITO

| Prioridade | Integração | Ação | Status |
|-----------|-----------|------|--------|
| 🔴 | WhatsApp | Já conectado | ✅ Feito |
| 🔴 | Google My Business | Conectar conta Google | ⏳ Pendente |
| 🔴 | Facebook | Conectar página + Instagram | ⏳ Pendente |
| 🟡 | Chat Widget | Instalar código no site | ⏳ Quando site estiver no ar |

---

## PRÓXIMO MÓDULO

**02 — Dashboard** (Painel de métricas, widgets do WBR semanal, Custom Values com indicadores da estratégia)

---

*Documento 01/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*
*Data: 08/07/2026*

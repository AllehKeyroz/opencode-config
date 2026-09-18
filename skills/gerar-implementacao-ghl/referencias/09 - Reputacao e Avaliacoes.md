# 09 — Reputação e Avaliações
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

O módulo de Reputação no GHL gerencia avaliações recebidas (Google, Facebook), envia pedidos de avaliação, coleta depoimentos em vídeo, responde automaticamente com IA e mede concorrência.

**Acesso:** Sidebar → Reputation

**Funcionalidades principais:**
- Reviews AI (respostas automáticas com IA)
- Drip Mode (resposta em lote para avaliações antigas)
- Review Requests (pedir avaliações por e-mail, SMS, WhatsApp)
- Manual Reviews (adicionar avaliações offline)
- Video Testimonials (coletar depoimentos em vídeo)
- Competitor Analysis (comparar concorrentes)
- NPS / Pesquisas de satisfação (via Surveys)

---

## REVIEWS AI

**O que faz:** Responde avaliações automaticamente usando IA. Dois modos:

| Modo | Funcionamento | Quando usar |
|------|--------------|-------------|
| **Suggestive Mode** | IA sugere uma resposta. Você revisa e clica em "Enviar" | Quando quer controle sobre o tom da resposta |
| **Auto-Pilot Mode** | IA responde automaticamente baseada na quantidade de estrelas e na configuração de tom | Alto volume de avaliações, confiança na IA |

**Preço:** US$ 0,08 por resposta (após 3 respostas grátis no Suggestive Mode)

**Drip Mode (dentro do Reviews AI):**
- Responde avaliações antigas (backlog) em um ritmo configurável
- Define: respostas por dia, janela de horário, tom do AI Agent
- Evita parecer spam (responde aos poucos, não tudo de uma vez)

**Configuração sugerida para a Keyroz:**
- Modo: Suggestive (revisar antes de enviar)
- Tom: Profissional e cordial
- Drip Mode: 5 respostas/dia, horário comercial, apenas avaliações com mais de 30 dias

---

## REVIEW REQUESTS (PEDIR AVALIAÇÕES)

**O que faz:** Envia um pedido para o cliente deixar uma avaliação no Google ou Facebook.

**Canais de envio:**
- E-mail (com Email Builder — template personalizado com logo e cores)
- SMS
- WhatsApp (com link da avaliação)

**Quando disparar:** Cliente NPS 9-10 + 60 dias de uso.

**Template de WhatsApp para pedido de avaliação:**
```
{{contact_name}}, que bom que voce esta satisfeito com o KDS CRM!

Se puder, deixa uma avaliacao no Google — isso ajuda outros empresarios a nos encontrar: {{google_review_link}}

Leva so 1 minuto. Obrigado!
```

---

## MANUAL REVIEWS

**O que faz:** Adiciona avaliações recebidas fora das plataformas integradas (boca a boca, WhatsApp, ligação) manualmente no GHL.

**Disponibilidade:** Labs (Settings → Labs → Manual Reviews)

**Como usar:**
1. Ativar Manual Reviews no Labs
2. Reputation → Reviews → Add Reviews
3. Preencher: Nome, Nota, Texto, Data, Plataforma
4. Opcional: importar CSV com múltiplas avaliações

**Por que usar:** Centralizar TODAS as avaliações (Google + Facebook + manuais) em um único lugar e exibir nos widgets de prova social.

---

## VIDEO TESTIMONIALS

**O que faz:** Cria um "coletor de vídeos" com até 3 perguntas. O cliente grava a resposta pelo celular ou desktop (sem app). O vídeo pode ser exibido nos widgets de prova social.

**Disponibilidade:** Labs (Settings → Labs → Video Testimonials)

**Passos:**
1. Criar coletor: Nome, Logo, Perguntas (máx 3)
2. Compartilhar link (via WhatsApp, e-mail ou SMS)
3. Cliente grava vídeo (máx 2min30)
4. Vídeo aparece no módulo de Video Testimonials
5. Opcional: exibir nos Review Widgets do site

**Uso na estratégia:** Cliente promotor (NPS 9-10) recebe link do Video Testimonial. O vídeo vira prova social na landing page e nas propostas.

---

## COMPETITOR ANALYSIS

**O que faz:** Compara as avaliações da Keyroz com concorrentes no Google.

**Métricas comparadas:**
- Ratings médios
- Volume de avaliações
- Palavras-chave mais mencionadas
- Tendências ao longo do tempo

**Uso na estratégia:** Acompanhar concorrentes como JOVIA, Digitai, 360 Sales. Saber onde eles estão se saindo melhor e pior.

---

## PESQUISA NPS (VIA SURVEYS)

O NPS não é nativo do módulo de Reputação — é feito via Surveys (pesquisas). Mas o resultado alimenta o módulo de Reputação (cliente promotor → pedido de avaliação).

**Configuração:**
- Survey: Pesquisa de Satisfação KDS CRM
- Pergunta: "De 0 a 10, o quanto você recomendaria a Keyroz Digital Solutions para um amigo?"
- Disparo: Trimestral, automático (workflow) via WhatsApp
- Workflows por nota:
  - 9-10 (Promotor) → tag `promotor` → pedir avaliação Google + pedir indicação
  - 7-8 (Neutro) → tag `neutro` → CS preventivo
  - 0-6 (Detrator) → tag `detrator` → call de retenção

---

## WORKFLOWS DE REPUTAÇÃO

| Gatilho | Ação |
|---------|------|
| Nova avaliação recebida | Notificação em tempo real + classificar por nota |
| Avaliação 4-5 estrelas | Responder com agradecimento (Reviews AI ou manual) |
| Avaliação 1-3 estrelas | Responder com educação + notificar CS |
| NPS 9-10 (Promotor) | Disparar pedido de avaliação Google + pedido de indicação |
| NPS 7-8 (Neutro) | CS preventivo |
| NPS 0-6 (Detrator) | Call de retenção |
| Cliente com 60+ dias + Promotor | Disparar Video Testimonial |
| Drip Mode (backlog) | Responder avaliações antigas aos poucos |

---

## MÉTRICAS DE REPUTAÇÃO

| Métrica | Onde medir | Meta |
|---------|-----------|------|
| **NPS médio** | Surveys | > 70 |
| **% Promotores** | Surveys | > 50% |
| **% Detratores** | Surveys | < 10% |
| **Nota média Google** | Reputation → Overview | > 4,5 |
| **Avaliações novas/semana** | Reputation → Reviews | > 1/semana |
| **Tempo médio de resposta** | Reputation → Reviews | < 24h |
| **Taxa de resposta** | Reputation → Reviews | 100% |
| **Reviews AI — respostas automáticas** | Reviews AI settings | Ativado em Suggestive Mode |

---

## PRÓXIMO MÓDULO

**10 — Media Drive** (Arquivos, manuais, vídeos, templates, imagens para uso na operação)

---

*Documento 09/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

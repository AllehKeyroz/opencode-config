# 06 — Sites e Funis
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE SÃO

Sites e funis são páginas web criadas dentro do GHL para capturar leads, apresentar propostas e confirmar agendamentos. A estratégia exige 3 páginas obrigatórias.

**Diferença entre Site e Funil no GHL:**
- **Site:** Página avulsa (ex: landing page de diagnóstico)
- **Funil:** Conjunto de páginas com fluxo de navegação (ex: formulário → obrigado)

---

## PÁGINA 1 — LANDING PAGE DE DIAGNÓSTICO GRATUITO

**Finalidade:** Capturar leads qualificados oferecendo o diagnóstico de maturidade digital em troca de nome, empresa e WhatsApp.

**Referência na estratégia:** Doc 03 (Marketing — lead magnet), Doc 04 (Vendas — entrada do funil)

**Tipo:** Página única (site)

### Estrutura da Página

| Seção | Conteúdo |
|-------|----------|
| **Headline** | "Descubra onde sua empresa está perdendo vendas" |
| **Subheadline** | "Diagnóstico gratuito de 30 minutos. Você descobre os gaps de processos, vendas, marketing, tecnologia e IA do seu negócio." |
| **Formulário** | Nome, Empresa, WhatsApp, E-mail |
| **CTA** | "Quero meu diagnóstico gratuito" |
| **Prova social** | "Já atendemos mais de X empresas" / "NPS médio de Y" |
| **Como funciona** | 3 passos: 1. Preenche o formulário 2. Escolhe o horário 3. Recebe o diagnóstico |
| **Rodapé** | Keyroz Digital Solutions — CNPJ |

### Comportamento

| Ação | Resultado |
|------|-----------|
| Lead preenche o formulário | Contato criado no CRM com tag `lead_site` |
| Lead clica em CTA | Redirecionado ao calendário de diagnóstico (modal ou nova aba) |
| Lead agenda | Dispara template T4 (confirmação) |
| Lead não agenda em 24h | Workflow automático envia link do calendário via WhatsApp |

### Campos do Formulário

| Campo | Tipo | Obrigatório | Mapeamento no CRM |
|-------|------|-------------|-------------------|
| Nome | Texto | Sim | contact_name |
| Empresa | Texto | Sim | company_name |
| WhatsApp | Telefone | Sim | phone |
| E-mail | E-mail | Sim | email |

---

## PÁGINA 2 — PÁGINA DE PROPOSTA

**Finalidade:** Apresentar a proposta comercial de forma visual e profissional, com link para aceite e pagamento.

**Referência na estratégia:** Doc 04 (Vendas — proposta)

**Tipo:** Funil (página de proposta + página de obrigado)

### Estrutura da Página

| Seção | Conteúdo |
|-------|----------|
| **Logo** | KDS CRM / Keyroz Digital Solutions |
| **Para** | Nome do cliente + empresa |
| **Data** | Data da proposta |
| **O que encontramos** | 3 gaps do diagnóstico (custom fields do pipeline) |
| **O que recomendamos** | Resumo do projeto |
| **Investimento** | Implantação: R$ X.XXX (único) + Recorrência: R$ X.XXX/mês |
| **Resultado esperado** | 3 benefícios em 90 dias |
| **CTA** | "Aceitar proposta" (link de pagamento) |
| **Rodapé** | Válida por 7 dias |

### Comportamento

| Ação | Resultado |
|------|-----------|
| Cliente clica em "Aceitar" | Redirecionado ao checkout / pagamento |
| Pagamento confirmado | Contrato assinado automaticamente |
| Cliente não clica em 3 dias | Workflow dispara template T10 |
| Cliente não clica em 7 dias | Workflow dispara template T11 + estágio "Perdido" |

---

## PÁGINA 3 — PÁGINA DE OBRIGADO (PÓS-FORMULÁRIO)

**Finalidade:** Confirmar que o formulário foi enviado com sucesso e direcionar o lead para o calendário de agendamento.

**Referência na estratégia:** Doc 03 (Marketing — pós-formulário)

**Tipo:** Página única (site)

### Estrutura da Página

| Seção | Conteúdo |
|-------|----------|
| **Headline** | "Próximo passo: agende seu diagnóstico" |
| **Subtítulo** | "Escolha o melhor horário para sua call de 30 minutos." |
| **Calendário** | Embed do calendário de diagnóstico |
| **CTA opcional** | "Enquanto isso, conheça o KDS CRM" (link para material) |

---

## CONFIGURAÇÕES GLOBAIS DAS PÁGINAS

| Parâmetro | Configuração |
|-----------|-------------|
| **Domínio** | Subdomínio do KDS CRM (ex: app.kdscrm.com.br) |
| **SSL** | Obrigatório (padrão GHL) |
| **Tema** | Cores da Keyroz (vermelho #C62828, branco, cinza) |
| **Fonte** | Padrão do GHL |
| **Responsivo** | Sim (mobile + desktop) |
| **Tracking** | Pixel do Meta + Google Analytics |
| **UTM** | Capturar utm_source, utm_medium, utm_campaign |

---

## TRACKING E PIXELS

| Pixel / Tag | Onde instalar | Para quê |
|-------------|--------------|----------|
| **Meta Pixel** | Landing page + página de obrigado | Remarketing de leads, otimização de anúncios |
| **Google Ads Tag** | Landing page + página de confirmação | Conversão de leads, otimização de campanhas |
| **UTM params** | Todos os links externos | Rastrear origem dos leads no CRM |

---

## WORKFLOWS ASSOCIADOS

| Trabalho Trabalho | Gatilho | Ação |
|------------------|---------|------|
| Lead preencheu formulário | Form Submission | Criar contato + tag `lead_site` + lead_source = utm ou "site" |
| Lead não agendou em 24h | Scheduler 24h | Enviar link do calendário via WhatsApp (template T3) |
| Lead não agendou em 7 dias | Scheduler 7d | Mover para nurture frio |
| Proposta aceita | Pagamento recebido | Mover para pipeline de Onboarding |
| Proposta não aceita em 7 dias | Scheduler 7d | Disparar template T11 + mover para Perdido |

---

## RESUMO DAS PÁGINAS

| Página | Tipo | Finalidade | URL sugerida |
|--------|------|-----------|-------------|
| **Landing Page Diagnóstico** | Site | Capturar leads | app.kdscrm.com.br/diagnostico |
| **Página de Proposta** | Funil | Apresentar e fechar | app.kdscrm.com.br/proposta/{{id}} |
| **Página de Obrigado** | Site | Confirmar + redirecionar ao calendário | app.kdscrm.com.br/obrigado |

---

## PRÓXIMO MÓDULO

**07 — Marketing (Social Planner + GMB)** (Agendamento de posts, conexão de redes sociais, gestão de reputação)

---

*Documento 06/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

# 02 — Dashboard
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

O Dashboard do GHL exibe widgets visuais com métricas da operação. Cada widget pode ser configurado como gráfico (linha, barra, donut, tabela ou numérico) e filtrado por condições.

A estratégia define 12 métricas principais (doc 09). Elas estão distribuídas em 3 painéis:

- **Painel Comercial** — métricas de vendas e diagnósticos
- **Painel Financeiro** — métricas de receita e expansão
- **Painel Operacional** — métricas de CS e suporte

---

## PAINEL 1 — COMERCIAL

**Finalidade:** Acompanhar o funil de vendas em tempo real: quantos leads entram, quantos diagnosticos são feitos, quantos fecham e em quanto tempo.

**Referência na estratégia:** Doc 04 (Vendas), Doc 09 (Métricas)

### Widgets

| Widget | Tipo | Métrica da Estratégia | Configuração |
|--------|------|----------------------|-------------|
| **Leads novos (este mês)** | Numérico | Leads por semana > 10 | Contagem de contatos criados no período. Filtro: data de criação = este mês |
| **Diagnósticos realizados** | Numérico | > 5/semana | Contagem de appointment com status "completed" no período. Filtro: serviço = "Diagnóstico de Maturidade Digital" |
| **Propostas enviadas** | Numérico | > 3/semana | Contagem de oportunidades no estágio "Proposta Enviada". Filtro: pipeline = "Vendas Keyroz" |
| **Taxa de conversão (diagnóstico → venda)** | Donut | > 15% | Opportunities ganhas / total de oportunidades no período. Filtro: pipeline = "Vendas Keyroz", data de criação |
| **Ciclo médio de venda (dias)** | Numérico | < 30 dias | Média de dias entre criação da oportunidade e mudança para estágio "fechado". Filtro: pipeline = "Vendas Keyroz" |
| **Funil de vendas por estágio** | Barra | — | Quantidade de oportunidades em cada estágio do pipeline. Filtro: pipeline = "Vendas Keyroz" |

**Total de widgets:** 6

---

## PAINEL 2 — FINANCEIRO

**Finalidade:** Monitorar a saúde financeira: receita recorrente, churn, expansão e relação LTV/CAC.

**Referência na estratégia:** Doc 01 (Modelo de Negócio), Doc 07 (Expansão), Doc 09 (Métricas), Doc 11 (Precificação)

### Widgets

| Widget | Tipo | Métrica da Estratégia | Configuração |
|--------|------|----------------------|-------------|
| **Receita Recorrente Mensal (MRR)** | Numérico | > R$ 10k em 6 meses | Soma de pagamentos recorrentes no mês atual. Filtro: tipo = "subscription", status = "active" |
| **Receita de Consumo** | Numérico | > 10% do MRR | Soma de pagamentos de consumo (créditos WhatsApp, SMS) no mês. Filtro: tipo = "one-time", categoria = "consumo" |
| **MRR vs Consumo (%)** | Donut | Consumo > 10% | Proporção entre receita recorrente e receita de consumo no mês |
| **Churn de clientes** | Numérico | < 3% ao mês | Contagem de cancelamentos de assinatura no mês / total de assinantes ativos |
| **Novas assinaturas vs Cancelamentos** | Linha | NRR > 100% | Tendência mensal de novas assinaturas vs cancelamentos. Filtro: data de criação |
| **Clientes ativos** | Numérico | — | Total de assinaturas ativas no momento |

**Total de widgets:** 6

---

## PAINEL 3 — OPERACIONAL

**Finalidade:** Acompanhar a adoção dos clientes, tempo de onboarding, satisfação e eficiência do suporte.

**Referência na estratégia:** Doc 05 (Entrega), Doc 06 (CS)

### Widgets

| Widget | Tipo | Métrica da Estratégia | Configuração |
|--------|------|----------------------|-------------|
| **Onboarding concluídos (este mês)** | Numérico | < 7 dias | Contagem de oportunidades que atingiram o estágio "Go-Live" no período. Filtro: pipeline = "Onboarding" |
| **Tempo médio de onboarding** | Numérico | < 7 dias | Média de dias entre criação da oportunidade e estágio "Go-Live". Filtro: pipeline = "Onboarding" |
| **Conversas não lidas** | Numérico | — | Total de conversas com status "unread" no momento |
| **Tempo médio de resposta (suporte)** | Numérico | < 4h | Média de tempo entre a mensagem do cliente e a primeira resposta da equipe. Filtro: canal = "WhatsApp", "email" |
| **Contatos por tag** | Donut | — | Distribuição de contatos por tag (lead, diagnóstico, cliente, cancelado). Ajuda a visualizar a base ativa |
| **Tickets de suporte abertos** | Numérico | < 3/mês por cliente | Contagem de conversas com tag "suporte" abertas no período |

**Total de widgets:** 6

---

## RESUMO DOS 3 PAINÉIS

| Painel | Widgets | Atualização | Quem usa |
|--------|---------|------------|----------|
| **Comercial** | 6 | Diária (WBR semanal) | Você (vendas) |
| **Financeiro** | 6 | Semanal (WBR) | Você (gestão) |
| **Operacional** | 6 | Diária | Você (CS) |
| **Total** | **18** | — | — |

---

## CUSTOM VALUES (VARIÁVEIS DO DASHBOARD)

Os Custom Values são valores reutilizáveis que alimentam os widgets. Eles devem ser criados em **Settings → Custom Values** antes de configurar os painéis.

| Chave | Valor | Uso |
|-------|-------|-----|
| `meta_mrr_6meses` | 10000 | Alerta visual no painel financeiro |
| `meta_churn_mensal` | 3 | Alerta visual de churn máximo aceitável |
| `meta_conversao_diag` | 15 | Meta de conversão diagnóstico → venda |
| `meta_onboarding_dias` | 7 | Meta de tempo de onboarding |
| `custo_ghl_mensal` | 2930 | Cálculo de margem no painel financeiro |
| `custo_ia_mensal` | 800 | Custo de IA para cálculo de margem |

---

## PERMISSÕES DOS PAINÉIS

| Painel | Admin | User |
|--------|-------|------|
| Comercial | Full | View |
| Financeiro | Full | No Access |
| Operacional | Full | Edit |

Os painéis Financeiro é restrito a admin por conter dados sensíveis de receita e custos.

---

## TEMA E IDENTIDADE VISUAL

Aplicar o tema personalizado da Keyroz nos 3 painéis para consistência visual:

| Elemento | Cor |
|---------|-----|
| **Cor de fundo do widget** | #FFF7D6 (amarelo claro — ações) |
| **Cor do título** | #293845 (texto padrão) |
| **Cor das métricas** | #C62828 (vermelho — destaque Keyroz) |
| **Cor dos gráficos** | #1AAE9F (menta — decisões) |
| **Cor de fundo do painel** | #FFFFFF (branco) |

---

## PRÓXIMO MÓDULO

**03 — Pipelines e Leads** (Pipeline de vendas, estágios, campos personalizados e sistema de tags)

---

*Documento 02/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

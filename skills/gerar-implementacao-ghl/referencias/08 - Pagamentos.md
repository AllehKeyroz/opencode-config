# 08 — Pagamentos
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

O módulo de Pagamentos no GHL processa transações financeiras: cobranças únicas, assinaturas recorrentes e links de pagamento. A estratégia usa pagamentos para receber implantação, recorrência mensal e consumo de créditos.

**Provedor de pagamento definido na estratégia:** Mercado Pago

---

## PRODUTOS (NO GHL PAYMENTS)

### Produto 1 — Implantação Keyroz

**Finalidade:** Cobrança única pela implantação do projeto completo.

**Referência na estratégia:** Doc 01 (Modelo de Negócio), Doc 11 (Precificação)

| Parâmetro | Configuração |
|-----------|-------------|
| **Nome** | Implantação KDS CRM |
| **Tipo** | Produto físico (serviço) |
| **Preço** | R$ 6.000,00 |
| **Pagamento** | Único (uma vez) |
| **Formas de pagamento** | Cartão de crédito (à vista ou parcelado), Boleto, PIX |
| **Parcelamento** | Até 6x sem juros ou 12x com juros |

### Produto 2 — Assinatura KDS CRM (Recorrência)

**Finalidade:** Cobrança mensal recorrente pelo serviço prestado + IA.

**Referência na estratégia:** Doc 01 (Modelo de Negócio), Doc 11 (Precificação)

| Parâmetro | Configuração |
|-----------|-------------|
| **Nome** | KDS CRM — Plano Mensal |
| **Tipo** | Assinatura (subscription) |
| **Preço** | R$ 5.121,00/mês |
| **Ciclo** | Mensal (todo dia X do mês) |
| **Período de teste** | Não |
| **Cancelamento** | A qualquer momento (sem multa) |
| **Formas de pagamento** | Cartão de crédito (recorrente) |

### Produto 3 — Subconta KDS (Agências)

**Finalidade:** Cobrança mensal de agências que revendem o KDS CRM.

**Referência na estratégia:** Doc 02 (Segmentação — Agências)

| Parâmetro | Configuração |
|-----------|-------------|
| **Nome** | KDS CRM — Subconta Agência |
| **Tipo** | Assinatura (subscription) |
| **Preço** | R$ 197,00/mês (plano Standard) ou R$ 297,00/mês (plano Premium) |
| **Ciclo** | Mensal |
| **Cancelamento** | A qualquer momento |

### Produto 4 — Créditos de Consumo

**Finalidade:** Cobrança de créditos WhatsApp/SMS consumidos pelo cliente.

**Referência na estratégia:** Doc 01 (Consumo), Doc 11 (Precificação)

| Parâmetro | Configuração |
|-----------|-------------|
| **Nome** | Créditos KDS CRM |
| **Tipo** | Produto digital (recarga) |
| **Preço** | Variável (conforme consumo) |
| **Cobrança** | Pós-pago (fatura no mês seguinte) ou pré-pago (recarga) |

---

## MERCADO PAGO (PROVEDOR)

### Configuração

| Parâmetro | Configuração |
|-----------|-------------|
| **Provedor** | Mercado Pago |
| **Integração** | Mercado Pago Connect (via GHL Payments) |
| **Access Token** | Gerado no dashboard do Mercado Pago |
| **Webhook** | Configurado automaticamente pelo GHL |
| **Ambiente** | Produção (após testes em Sandbox) |

### Passos para Conectar

1. Settings → Payments → Integrations → Mercado Pago
2. Clicar em "Connect"
3. Fazer login na conta do Mercado Pago
4. Autorizar as permissões solicitadas
5. Selecionar a conta de recebimento
6. Pronto — produtos e assinaturas podem ser criados

---

## FORMAS DE PAGAMENTO ACEITAS

| Forma | Produto 1 (Implantação) | Produto 2 (Assinatura) | Produto 3 (Subconta) |
|-------|------------------------|----------------------|---------------------|
| **Cartão de crédito** | ✅ (à vista ou parcelado) | ✅ (recorrente) | ✅ (recorrente) |
| **Boleto** | ✅ | ❌ (não suportado para assinatura) | ❌ |
| **PIX** | ✅ | ✅ | ✅ |
| **Link de pagamento** | ✅ | ✅ | ✅ |

---

## CUPONS DE DESCONTO

| Cupom | Desconto | Condição | Validade |
|-------|----------|----------|----------|
| `INDICACAO20` | 20% no 1º mês | Cliente foi indicado | 30 dias |
| `ANUAL15` | 15% no plano anual | Pagamento único de 12 meses | Indeterminado |
| `PRIMEIRO10` | 10% na implantação | Fechamento no diagnóstico | 7 dias |
| `CASE25` | 25% na implantação | Autorização para case público | 30 dias |

---

## WORKFLOWS DE PAGAMENTO

| Gatilho | Ação |
|---------|------|
| **Pagamento recebido** (implantação) | Mover pipeline para "Setup Técnico" + disparar onboarding |
| **Assinatura criada** | Tag `cliente` + mover para pipeline de CS (estágio "Ativo") |
| **Assinatura cancelada** | Tag `cancelado` + mover pipeline de CS (estágio "Cancelado") + disparar template T15 |
| **Pagamento falhou** | Notificar cliente + tentar nova cobrança em 3 dias |
| **Cupom resgatado** | Aplicar desconto na primeira cobrança |

---

## CHECKOUT

**Configuração do checkout:**
- **Página única** com resumo do pedido
- **Campos:** Nome, E-mail, Telefone, Endereço (se boleto)
- **Opções de pagamento:** Cartão, Boleto, PIX
- **Redirecionamento pós-pagamento:** Página de confirmação
- **E-mail de confirmação:** Automático

---

## MÉTRICAS DE PAGAMENTOS

| Métrica | Onde medir | Meta |
|---------|-----------|------|
| **MRR (Receita Recorrente Mensal)** | Dashboard → Payments Widgets | > R$ 10k em 6 meses |
| **Receita de consumo** | Dashboard → Payments Widgets | > 10% do MRR |
| **Churn de pagamento** | Dashboard → Payments Widgets | < 3% ao mês |
| **Pagamentos bem-sucedidos** | Dashboard → Payments Widgets | > 95% |
| **Novas assinaturas** | Dashboard → Payments Widgets | > 5/mês |
| **Cancelamentos** | Dashboard → Payments Widgets | < 3/mês |

---

## PRÓXIMO MÓDULO

**09 — Reputação e Avaliações** (Gestão de reviews, resposta automática, NPS, pesquisa de satisfação)

---

*Documento 08/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

# 15 — Snapshots
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

Snapshot é um template completo de uma subconta GHL. Ele captura toda a configuração (pipelines, custom fields, tags, calendários, funis, workflows, dashboard, Conversation AI bots) e permite aplicar em novas subcontas instantaneamente.

**Localização:** Agency View → Snapshots

**Snapshots não podem ser editados após a criação.** Se alterar a configuração original, crie um novo snapshot.

---

## O QUE O SNAPSHOT INCLUI

| Módulo | Inclui? | Detalhes |
|--------|---------|----------|
| **Pipelines** | ✅ | Vendas (7 estágios), Onboarding (6), CS (5), Agências (4) |
| **Custom Fields** | ✅ | Todos os campos de contato, oportunidade e appointment |
| **Tags** | ✅ | Todas as tags de estágio, CS e origem |
| **Calendários** | ✅ | Diagnóstico (público) + Pessoal (privado) |
| **Funis / Sites** | ✅ | Landing page + página de obrigado |
| **Templates de WhatsApp** | ✅ | (Depende de aprovação da Meta ao aplicar) |
| **Workflows** | ✅ | W1 a W15 |
| **Dashboard** | ✅ | 3 painéis (Comercial, Financeiro, Operacional) |
| **Conversation AI Bot** | ✅ | Configuração completa: prompts, ações, settings, treinamento, URLs de web crawler, FAQs personalizadas |
| **Media Drive** | ⚠️ | Apenas arquivos de branding (logo, favicon). Documentos e vídeos são grandes demais |
| **AI Agent Action** | ❌ | Não é parte do snapshot — é uma ação dentro de workflows que já estão incluídos |

---

## O QUE O SNAPSHOT NÃO INCLUI

| Item | Motivo |
|------|--------|
| **WhatsApp Business** | Conexão precisa ser feita manualmente em cada subconta |
| **Google My Business** | Conexão precisa ser feita manualmente |
| **Facebook / Instagram** | Conexão precisa ser feita manualmente |
| **Mercado Pago** | Conexão precisa ser feita manualmente |
| **Números de telefone** | Cada subconta tem seu próprio número |
| **Contatos** | Dados de clientes não devem ser replicados |
| **Histórico de conversas** | Específico de cada subconta |

---

## COMPORTAMENTO DO CONVERSATION AI NO SNAPSHOT

Quando o snapshot inclui um Conversation AI bot:

| Situação | Comportamento |
|----------|--------------|
| **Subconta de destino não tem bot primário** | O bot importado assume como primário automaticamente |
| **Subconta de destino já tem bot primário** | É possível definir manualmente após importação |
| **Conflito de nome (bot com mesmo nome já existe)** | Opções: Overwrite (substituir) ou Skip (manter o existente) |
| **Treinamento do bot** | URLs de Web Crawler e Custom Bot Responses/FAQs são preservados |

---

## SNAPSHOTS POR SEGMENTO (PARA AGÊNCIAS)

A Keyroz pode criar snapshots especializados para agências revenderem:

| Snapshot | Segmento | Pipeline Inicial | Preço Sugerido |
|----------|---------|-----------------|---------------|
| **KDS Imobiliário** | Imobiliárias | Lead → Visita → Fechamento | R$ 97-197 |
| **KDS Serviços** | Prestadores de serviço | Lead → Orçamento → Fechamento | R$ 97-197 |
| **KDS Agro** | Produtores rurais | Lead → Proposta → Fechamento | R$ 97-197 |

Cada snapshot segmentado contém:
- Pipeline específico do segmento (3-5 estágios)
- Custom Fields específicos
- Calendário de diagnóstico
- Landing page adaptada

---

## FLUXO DE CRIAÇÃO

```
1. Configurar subconta de origem com todas as configuracoes desejadas
2. Agency View → Snapshots → Create new snapshot
3. Nomear: "KDS CRM — Template Mestre v1.0"
4. Selecionar subconta de origem
5. Revisar modulos selecionados (incluindo Conversation AI, se aplicavel)
6. Criar snapshot
7. Testar: aplicar em subconta de staging
8. Ajustar o que faltar na origem e criar nova versao
```

---

## FLUXO DE APLICAÇÃO

```
1. Criar nova subconta para o cliente
2. Agency View → Snapshots → Load Snapshot
3. Selecionar snapshot desejado
4. Escolher modulos a aplicar
5. Se houver conflito de nomes: escolher Overwrite ou Skip
6. Aguardar aplicacao (2-5 minutos)
7. Verificar se tudo foi aplicado corretamente
8. Personalizar: dados da empresa, cores, dominio
9. Conectar manualmente: WhatsApp, GMB, Facebook, Pagamentos
10. Pronto para uso
```

---

## ATUALIZAÇÃO DO SNAPSHOT

Snapshots **não podem ser editados** após criados. Para atualizar:

1. Alterar a configuração na subconta de origem
2. Criar novo snapshot com versão incrementada ("v1.1", "v2.0")
3. Testar
4. Publicar

**Frequência recomendada de atualização:**

| Mudança | Frequência |
|---------|-----------|
| Novo campo personalizado | Mensal |
| Novo workflow | Mensal |
| Novo template de WhatsApp | Mensal |
| Alteração no Conversation AI | Mensal |
| Mudança no dashboard | Trimestral |
| Mudança na landing page | Por demanda |

---

*Documento 15/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

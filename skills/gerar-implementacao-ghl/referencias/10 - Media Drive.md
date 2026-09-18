# 10 — Media Drive
## Blueprint de Configuração GHL — Keyroz Digital Solutions

---

## O QUE É

O Media Drive (Media Storage) é o repositório central de arquivos do GHL. Ele armazena imagens, vídeos, PDFs e áudios que são reutilizados em templates de WhatsApp, e-mails, funis, posts do Social Planner e formulários.

**Acesso:** Sidebar esquerda → Media Storage (nome antigo: Media Library)

**Capacidades:**
- Upload de arquivos individuais ou pastas inteiras
- Download de pastas como .zip
- Suporte a: JPG, PNG, MP4, PDF, MP3
- Integração com Google Drive e Canva
- Busca e filtro por tipo de arquivo
- Visualização em grade ou lista
- Organização em pastas e subpastas

---

## ESTRUTURA DE PASTAS

```
/media/
├── 01_branding/
│   ├── logo-kds-crm.png
│   ├── logo-kds-crm.svg
│   ├── logo-kds-crm-branco.png
│   ├── favicon.ico
│   └── pattern-background.png
│
├── 02_templates/
│   ├── manual-do-usuario-kds-crm.pdf
│   ├── guia-rapido-kds-crm.pdf
│   ├── proposta-modelo.pdf
│   ├── diagnostico-modelo.pdf
│   └── contrato-padrao.pdf
│
├── 03_videos/
│   ├── boas-vindas-kds-crm.mp4
│   ├── tutorial-pipeline.mp4
│   └── tutorial-ia-agent.mp4
│
├── 04_social-planner/
│   ├── posts-linkedin/
│   │   ├── post-dor-crm.jpg
│   │   └── post-case-sucesso.jpg
│   └── posts-instagram/
│       ├── reels-capa-ia.jpg
│       └── carrossel-5-sinais.jpg
│
├── 05_landing-page/
│   ├── hero-bg-diagnostico.jpg
│   ├── icone-processos.svg
│   ├── icone-vendas.svg
│   ├── icone-marketing.svg
│   ├── icone-tecnologia.svg
│   └── icone-ia.svg
│
├── 06_depoimentos/
│   ├── foto-cliente-01.jpg
│   └── foto-cliente-02.jpg
│
└── 07_documentos-legais/
    ├── termo-de-uso.pdf
    └── politica-privacidade.pdf
```

---

## ARQUIVOS OBRIGATÓRIOS

### Branding

| Arquivo | Formato | Uso | Criado por |
|---------|---------|-----|-----------|
| Logo KDS CRM principal | PNG + SVG | Landing page, proposta, e-mails | Design (já existe) |
| Logo KDS CRM branco | PNG | Fundo escuro, Social Planner | Design |
| Favicon | ICO | Site / funis | Design |
| Pattern de fundo (opcional) | PNG | Landing page | Design |

### Templates e Documentos

| Arquivo | Formato | Uso | Conteúdo |
|---------|---------|-----|----------|
| **Manual do Usuário KDS CRM** | PDF | Entregue ao cliente no onboarding | Como usar o CRM, pipelines, integrações, IA |
| **Guia Rápido KDS CRM** | PDF | Anexado no WhatsApp de boas-vindas | 1 página com os 5 passos iniciais |
| **Template de Proposta** | PDF | Modelo para preencher e enviar | Estrutura de proposta comercial |
| **Template de Diagnóstico** | PDF | Entregue após a call | Notas dos 5 pilares + gaps |
| **Contrato Padrão** | PDF | Assinatura digital | Termos de serviço e confidencialidade |

### Vídeos

| Vídeo | Duração | Uso | Conteúdo |
|-------|---------|-----|----------|
| **Boas-vindas KDS CRM** | 3 min | Enviado no onboarding | "Bem-vindo ao KDS CRM — visão geral de 3 min" |
| **Tutorial: Pipeline** | 2 min | Base de conhecimento | "Como criar e mover leads no pipeline" |
| **Tutorial: AI Agent** | 3 min | Base de conhecimento | "Como o AI Agent qualifica leads automaticamente" |

### Imagens para Social Planner

| Arquivo | Formato | Uso |
|---------|---------|-----|
| Post carrossel — "5 sinais que precisa de IA" | JPG (5 slides) | LinkedIn, Segunda |
| Post case — "De zero a máquina de vendas" | JPG | LinkedIn, Quarta |
| Capa de Reels — "Ative o KDS em 5 min" | JPG | Instagram, Terça |
| Post carrossel — "O que automatizar com IA" | JPG (5 slides) | Instagram, Sábado |

### Imagens para Landing Page

| Arquivo | Uso |
|---------|-----|
| Hero background | Seção principal da landing page |
| Ícone Processos | Seção "Como funciona" |
| Ícone Vendas | Seção "Como funciona" |
| Ícone Marketing | Seção "Como funciona" |
| Ícone Tecnologia | Seção "Como funciona" |
| Ícone IA | Seção "Como funciona" |

---

## ONDE CADA ARQUIVO É USADO

| Arquivo | Usado em |
|---------|----------|
| Logo KDS CRM | Template de e-mail, landing page, proposta, GMB |
| Manual do Usuário | Onboarding (WhatsApp + e-mail) |
| Guia Rápido | Boas-vindas (WhatsApp) |
| Vídeo de boas-vindas | Onboarding (WhatsApp) |
| Post carrossel "5 sinais" | Social Planner (LinkedIn) |
| Post case | Social Planner (LinkedIn) |
| Reels | Social Planner (Instagram) |
| Hero background | Landing page de diagnóstico |
| Ícones | Landing page de diagnóstico |

---

## INTEGRAÇÕES DO MEDIA DRIVE

| Integração | O que faz |
|-----------|-----------|
| **Google Drive** | Importar arquivos diretamente do Google Drive para o Media Storage |
| **Canva** | Criar e editar imagens no Canva e salvar direto no Media Storage |
| **WhatsApp Templates** | Selecionar imagens, vídeos, PDFs e áudios do Media Storage para templates |
| **Email Builder** | Inserir imagens do Media Storage em templates de e-mail |
| **Social Planner** | Selecionar imagens do Media Storage para posts agendados |
| **Funis / Sites** | Inserir imagens do Media Storage em páginas |

---

## BOAS PRÁTICAS

| Prática | Recomendação |
|---------|-------------|
| **Nomenclatura** | Usar kebab-case (ex: `logo-kds-crm.png`) |
| **Pastas** | Manter a estrutura de pastas organizada por categoria |
| **Arquivos duplicados** | Subir uma vez e reutilizar (não duplicar) |
| **Tamanho de imagem** | Otimizar para web (máx 200KB para landing page) |
| **Vídeos** | MP4, H.264, máximo 50MB |
| **Docs** | PDF, máximo 10MB |
| **Backup** | Manter cópia local dos arquivos originais |

---

## PRÓXIMO MÓDULO

**11 — Configurações Globais** (Custom Fields, Tags, Permissões, Timezone, Settings gerais)

---

*Documento 10/15 do Blueprint de Configuração GHL — Keyroz Digital Solutions*

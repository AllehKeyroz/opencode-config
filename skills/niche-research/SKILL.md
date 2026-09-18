---
name: Pesquisa de Nicho e Inteligência Competitiva
description: Super-Skill para pesquisa de mercado, análise de concorrentes e mineração de criativos via Meta Ads Library (Apify) e dados demográficos (IBGE API).
---

# Skill: Pesquisa de Nicho e Inteligência Competitiva (Março 2026)

Esta Skill capacita o assistente a operar como um **Analista de Mercado**, cobrindo desde a investigação de nicho até a mineração de criativos validados via **Meta Ads Library** (usando Apify) e obtenção de dados demográficos via **IBGE API**.

---

## 🔑 Configuração e Ambiente

### Arquivo `.env` obrigatório:
```
APIFY_API_TOKEN=seu_token_apify
IBGE_API_URL=https://servicodados.ibge.gov.br/api/v1
```

**Token Apify:** configure no arquivo `.env` (variável `APIFY_API_TOKEN`).

### ⚠️ LIMITAÇÕES DA API OFICIAL META ADS LIBRARY
A API oficial do Meta Ads Library (`/ads_archive`) só permite acesso a anúncios políticos e de interesse público na UE. Para anúncios comerciais, **usamos o scraper da Apify** (pago por resultado).

---

## ⚡ REGRAS OBRIGATÓRIAS

### 💰 CUSTOS
- **Apify:** $0.0015–0.005 por anúncio extraído (varia por scraper)
- **Recomendação:** Limitar a 50-100 anúncios por pesquisa para controlar custos
- **Monitorar uso:** Verificar saldo na Apify regularmente

### 🔒 ÉTICA E LEGAL
- Apenas dados públicos (anúncios ativos, não perfis privados)
- Respetar termos de uso do Meta e Apify
- Não armazenar dados pessoais (CPF, email, telefone)

### 🔄 EXECUÇÃO PASSO A PASSO
- Cada chamada à API deve ser feita separadamente
- Aguardar resposta antes da próxima chamada
- Logs de todas as requisições para auditoria

---

## 🎯 PESQUISA DE NICHO

### 1. Mineração de Criativos via Apify

**Endpoint Apify:**
```
POST https://api.apify.com/v2/acts/leadsbrary~meta-ads-library-scraper/runs?token={APIFY_TOKEN}
```

**Parâmetros:**
- `startUrls`: Array de URLs do Meta Ads Library (com filtros)
- `maxResults`: Número máximo de anúncios por URL (recomendado: 20-50)
- `country`: Código do país (ex: "BR")
- `activeStatus`: "active" ou "any"

**Exemplo Node.js:**
```javascript
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;

async function pesquisarAnuncios(palavraChave, maxResults = 30) {
  const url = `https://api.apify.com/v2/acts/leadsbrary~meta-ads-library-scraper/runs?token=${APIFY_TOKEN}`;
  const payload = {
    startUrls: [`https://www.facebook.com/ads/library/?q=${encodeURIComponent(palavraChave)}&country=BR&active_status=active`],
    maxResults: maxResults
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const { data: { id: runId } } = await response.json();
  
  // Aguardar conclusão (polling)
  let status = 'RUNNING';
  let datasetId;
  while (status !== 'SUCCEEDED') {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const statusResponse = await fetch(`https://api.apify.com/v2/acts/leadsbrary~meta-ads-library-scraper/runs/${runId}?token=${APIFY_TOKEN}`);
    const statusData = await statusResponse.json();
    status = statusData.data.status;
    datasetId = statusData.data.defaultDatasetId;
  }
  
  // Obter resultados
  const itemsResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`);
  const items = await itemsResponse.json();
  
  return items.map(ad => ({
    id: ad.adArchiveID,
    texto: ad.adText,
    criativo: ad.adSnapshotUrl,
    plataformas: ad.publisherPlatforms,
    dataInicio: ad.startDate,
    dataFim: ad.endDate,
    urlDestino: ad.ctaDomain,
    headline: ad.ctaHeadline,
    pagina: ad.pageName,
    categoria: ad.pageCategory
  }));
}
```

**Exemplo de uso:**
```javascript
const anunciosPizza = await pesquisarAnuncios('pizza', 20);
console.log(`Encontrados ${anunciosPizza.length} anúncios de pizza`);
```

### 2. Análise de Resultados

**Métricas a extrair:**
- Frequência de palavras-chave na copy
- Formatos mais usados (vídeo, imagem, carrossel)
- CTAs mais comuns (WhatsApp, Saiba Mais, Compre)
- Dias da semana com mais anúncios ativos
- Plataformas predominantes (Facebook, Instagram)

**Função auxiliar:**
```javascript
function analisarTendencias(anuncios) {
  const contagem = {
    ctas: {},
    plataformas: {},
    diasSemana: {},
    palavrasChave: {}
  };
  
  anuncios.forEach(ad => {
    // Contar CTAs
    const cta = ad.ctaHeadline || 'Não identificado';
    contagem.ctas[cta] = (contagem.ctas[cta] || 0) + 1;
    
    // Contar plataformas
    ad.plataformas.forEach(p => {
      contagem.plataformas[p] = (contagem.plataformas[p] || 0) + 1;
    });
    
    // Extrair dia da semana
    if (ad.dataInicio) {
      const dia = new Date(ad.dataInicio).toLocaleDateString('pt-BR', { weekday: 'long' });
      contagem.diasSemana[dia] = (contagem.diasSemana[dia] || 0) + 1;
    }
  });
  
  return contagem;
}
```

---

## 🏙️ PESQUISA DE CIDADE (IBGE API)

### 1. Busca Precisa por UF

A API de localidades retorna muitas correspondências ao buscar por nome. **Use a busca por UF** para maior precisão:

**Endpoint por UF:**
```
GET https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios
```

**Exemplo Node.js (busca por UF + filtro local):**
```javascript
const IBGE_URL = process.env.IBGE_API_URL || 'https://servicodados.ibge.gov.br/api/v1';

async function pesquisarMunicipioPreciso(nomeCidade, siglaUF) {
  // 1. Buscar todos os municípios do estado
  const url = `${IBGE_URL}/localidades/estados/${siglaUF}/municipios`;
  const response = await fetch(url);
  const municipios = await response.json();
  
  // 2. Normalizar nomes para comparação
  const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  const nomeBusca = normalize(nomeCidade);
  
  // 3. Encontrar correspondência exata ou parcial
  const encontrados = municipios.filter(m => {
    const nomeMunicipio = normalize(m.nome);
    return nomeMunicipio.includes(nomeBusca) || nomeBusca.includes(nomeMunicipio);
  });
  
  // 4. Ordenar por similaridade (nome mais curto = mais provável)
  encontrados.sort((a, b) => a.nome.length - b.nome.length);
  
  if (encontrados.length === 0) return null;
  
  const cidade = encontrados[0];
  return {
    id: cidade.id,
    nome: cidade.nome,
    estado: cidade.microrregiao.mesorregiao.UF.nome,
    uf: cidade.microrregiao.mesorregiao.UF.sigla,
    codigoIBGE: cidade.id
  };
}

// Exemplo: pesquisar Luís Eduardo Magalhães (BA)
const lem = await pesquisarMunicipioPreciso('LUIS EDUARDO MAGALHAES', 'BA');
console.log(lem); // { id: 2919553, nome: "Luís Eduardo Magalhães", uf: "BA", ... }
```

### 2. Obter Dados Demográficos

**API SIDRA (IBGE) - Mais confiável:**
```
GET https://apisidra.ibge.gov.br/values/t/{tabela}/n{nivel}/{codigo}/v/{variavel}/p/{periodo}
```

**Tabelas importantes:**
| Tabela | Dados | Variável |
|--------|-------|----------|
| 793 | População residente | 2910 (verificar) |
| 5938 | PIB per capita | 37 |
| 4714 | Densidade demográfica | 2910 |

**⚠️ Nota:** Os códigos de variáveis podem variar. Verifique na [API SIDRA](https://apisidra.ibge.gov.br/).

**Exemplo para população:**
```javascript
async function obterPopulacao(codigoIBGE) {
  const url = `https://apisidra.ibge.gov.br/values/t/793/n6/${codigoIBGE}/v/2910/p/last`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.length > 1) {
    return parseInt(data[1].V) || null;
  }
  return null;
}
```

### 3. Dados Não Disponíveis via API

Para dados como **IDH, extensão territorial, renda per capita**, que não estão disponíveis em APIs simples:

**Opção 1: Web Search via LLM**
```
Pesquisar: "Luís Eduardo Magalhães Bahia IDH renda per capita extensão"
```

**Opção 2: Web Scraping do IBGE Cidades**
```
GET https://cidades.ibge.gov.br/brasil/ba/luis-eduardo-magalhaes/panorama
```

**Opção 3: Web Search via LLM (Recomendado para dados específicos)**
Quando as APIs não fornecerem dados específicos (IDH, renda per capita, extensão), use uma busca web:

```
Pesquisar: "[nome cidade] [estado] IDH renda per capita extensão territorial população 2024"
```

**Exemplo de consulta para LLM:**
```
"Quais são os principais indicadores socioeconômicos de Luís Eduardo Magalhães BA? Preciso de: população, extensão territorial, IDH, PIB per capita, renda média."
```

A LLM deve retornar os dados mais recentes disponíveis publicamente.

**Opção 4: APIs de terceiros**
- Atlas do Desenvolvimento Humano (IDH)
- API Brasil API (dados agregados)

### 4. Coordenadas (Geocoding)

Para coordenadas precisas, use **OpenStreetMap Nominatim** (gratuito):

```javascript
async function obterCoordenadas(cidade, estado) {
  const query = `${cidade}, ${estado}, Brasil`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const response = await fetch(url, { headers: { 'User-Agent': 'SkillPesquisa/1.0' } });
  const data = await response.json();
  
  if (data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  }
  return null;
}
```

### 2. Obter Dados Demográficos (IBGE SIDRA)

**API SIDRA (IBGE):**
```
GET https://apisidra.ibge.gov.br/values/t/{tabela}/n{nivel}/{codigo}/v/{variavel}/p/{periodo}
```

**Tabelas úteis:**
| Tabela | Descrição | Variável |
|--------|-----------|----------|
| 793 | População residente | 2910 |
| 5938 | PIB per capita | 37 |
| 4714 | Densidade demográfica | 2910 |

**Exemplo Node.js (População):**
```javascript
async function obterPopulacao(codigoIBGE) {
  // Tabela 793: População residente, nível 6 (municípios), variável 2910
  const url = `https://apisidra.ibge.gov.br/values/t/793/n6/${codigoIBGE}/v/2910/p/last`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.length > 1) {
    return parseInt(data[1].V) || null;
  }
  return null;
}
```

**⚠️ Nota:** Os códigos de variáveis podem variar. Verifique na [API SIDRA](https://apisidra.ibge.gov.br/).

**Fontes alternativas:**
- **IBGE Cidades:** Web scraping do site cidades.ibge.gov.br
- **API Agregados v3:** `https://servicodados.ibge.gov.br/api/v3/agregados/{id}/periodos/-1/variaveis/{var}?localidades=N6[{codigo}]`

### 3. Obter Coordenadas (Geocoding)

Para coordenadas precisas (latitude/longitude), use APIs de geocoding:

**Google Maps Geocoding API (requer API key):**
```
GET https://maps.googleapis.com/maps/api/geocode/json?address={cidade}&key={API_KEY}
```

**OpenStreetMap Nominatim (gratuito):**
```
GET https://nominatim.openstreetmap.org/search?q={cidade}&format=json&limit=1
```

**Exemplo Node.js (OpenStreetMap):**
```javascript
async function obterCoordenadas(cidade, estado, pais = 'Brasil') {
  const query = `${cidade}, ${estado}, ${pais}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const response = await fetch(url, { headers: { 'User-Agent': 'SkillPesquisa/1.0' } });
  const data = await response.json();
  
  if (data.length === 0) return null;
  
  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
    enderecoCompleto: data[0].display_name
  };
}

// Exemplo:
const coords = await obterCoordenadas('Luís Eduardo Magalhães', 'Bahia');
console.log(coords);
```

### 3. Obter Indicadores Econômicos (via SIDRA/IBGE)

Para dados como PIB per capita, IDH, população, é necessário usar a **API SIDRA** (mais complexa). Alternativa: usar **web scraping** do site IBGE Cidades.

**Endpoint SIDRA (exemplo para população):**
```
GET https://sidra.ibge.gov.br/value/4714/0/0/0?n=1&v=4714&p=max&d=d&c=29
```

**Recomendação:** Para simplificar, a skill pode focar em coordenadas e nomes, e o usuário pode complementar com fontes como **Sebrae**, **Prefeituras**, ou **Google Maps**.

---

## 🏪 PESQUISA DE CONCORRENTES LOCAIS (Google Meu Negócio / Web Search)

Para concorrentes locais (pizzarias, restaurantes, etc.), a **Meta Ads Library** pode não capturar todos os players, pois muitos não anunciam. Use **web search** e **Google Maps** para mapear o mercado local:

### 1. Web Search para Concorrentes

**Estratégia:** Buscar por termos como "pizzarias em [cidade]", "restaurantes [cidade]", "delivery [cidade]".

**Exemplo de consulta:**
```
"pizzarias Luís Eduardo Magalhães Bahia"
```

**Dados a extrair:**
- Nomes de pizzarias/restaurants
- Avaliações (Google, TripAdvisor)
- Endereços
- Tipos de cozinha
- Faixas de preço

### 2. Função de Pesquisa de Concorrentes (Web Search)

```javascript
async function pesquisarConcorrentesLocais(cidade, estado, nicho = 'pizzaria') {
  console.log(`🔍 Buscando concorrentes: "${nicho}" em ${cidade}, ${estado}`);
  
  // Consulta à LLM ou API de busca
  const query = `${nicho} ${cidade} ${estado} avaliações endereço`;
  console.log(`   Consultando: "${query}"`);
  
  // Em produção, isso chamaria uma API de web search
  // Por exemplo, Google Places API, SerpApi, ou web scraping ético
  
  // Retorno simulado com dados reais de LEM:
  const concorrentes = [
    {
      nome: 'Pizza Nova Premium',
      avaliacao: 4.5,
      votos: 208,
      tipo: 'Pizzaria',
      preco: 'R$40-60',
      endereco: 'Luís Eduardo Magalhães'
    },
    {
      nome: 'Dai-Suki Pizzaria',
      avaliacao: 3.3,
      votos: null,
      tipo: 'Pizzaria, Japonesa',
      preco: 'R$20-40',
      endereco: 'Rua Burle Marx, 565'
    },
    {
      nome: 'Restaurante e Pizzaria Paknoosh',
      avaliacao: 4.5,
      votos: 141,
      tipo: 'Pizzaria, Restaurante',
      preco: 'R$20-60',
      endereco: 'Luís Eduardo Magalhães'
    },
    {
      nome: 'Trattoria Pozza',
      avaliacao: 3.8,
      votos: null,
      tipo: 'Italiana',
      preco: 'R$30-50',
      endereco: 'Luís Eduardo Magalhães'
    },
    {
      nome: 'Pitada Gaúcha Pizzaria',
      avaliacao: 1.3,
      votos: null,
      tipo: 'Pizzaria, Buffet',
      preco: 'R$20-40',
      endereco: 'Luís Eduardo Magalhães'
    },
    {
      nome: 'Pizzaria La Plaza',
      avaliacao: null,
      votos: null,
      tipo: 'Pizzaria',
      preco: null,
      endereco: 'Luís Eduardo Magalhães'
    },
    {
      nome: 'Pizzaria Itacarambi',
      avaliacao: null,
      votos: null,
      tipo: 'Pizzaria',
      preco: null,
      endereco: 'Luís Eduardo Magalhães'
    }
  ];
  
  return concorrentes;
}

### 5. Exemplo: Análise Competitiva para D'Tália Pizzaria (LEM)

**Mercado local de pizzarias em Luís Eduardo Magalhães:**

| Concorrente | Avaliação | Votos | Preço | Tipo |
|-------------|-----------|-------|-------|------|
| Pizza Nova Premium | 4.5/5 | 208 | R$40-60 | Pizzaria |
| Restaurante e Pizzaria Paknoosh | 4.5/5 | 141 | R$20-60 | Pizzaria/Restaurante |
| Trattoria Pozza | 3.8/5 | - | R$30-50 | Italiana |
| Dai-Suki Pizzaria | 3.3/5 | - | R$20-40 | Pizzaria/Japonesa |
| Pitada Gaúcha Pizzaria | 1.3/5 | - | R$20-40 | Pizzaria/Buffet |

**Insights:**
- **70+ pizzarias** na cidade (alta concorrência)
- **Faixa de preço média:** R$20-60 por pessoa
- **Líderes:** Pizza Nova Premium e Paknoosh (4.5 estrelas)
- **Oportunidade:** D'Tália pode se diferenciar com rodízio completo, ambiente familiar, e programas de fidelidade

**Fontes de dados:**
- RestaurantGuru
- Google Maps
- TripAdvisor
- ClickDisk
```

### 3. Fontes de Dados Recomendadas

| Fonte | Dados | API |
|-------|-------|-----|
| **Google Places** | Nome, avaliação, endereço, horário | Paga |
| **SerpApi** | Resultados Google estruturados | Paga |
| **TripAdvisor** | Avaliações, preços | Web scraping |
| **RestaurantGuru** | Avaliações, menu, preços | Web scraping |
| **ClickDisk** | Lista de comércios | Web scraping |

### 4. Análise Competitiva Local

**Métricas a coletar:**
- Número de concorrentes
- Faixa de preço médio
- Avaliação média
- Tipos de cozinha predominantes
- Presença digital (site, redes sociais)

---

## 👥 ANÁLISE DE CONCORRENTES (Meta Ads Library)

### 1. Identificar Concorrentes

**Estratégia:**
1. Buscar por palavras-chave do nicho no Meta Ads Library
2. Extrair `pageName` e `pageID` dos resultados
3. Agrupar por página para identificar anunciantes ativos

**Função:**
```javascript
async function identificarConcorrentes(nicheKeyword, maxResults = 50) {
  const anuncios = await pesquisarAnuncios(nicheKeyword, maxResults);
  
  const concorrentes = {};
  anuncios.forEach(ad => {
    const id = ad.pageID;
    if (!concorrentes[id]) {
      concorrentes[id] = {
        pageID: ad.pageID,
        pageName: ad.pageName,
        totalAnuncios: 0,
        primeiroAnuncio: ad.dataInicio,
        ultimoAnuncio: ad.dataFim || 'Em andamento',
        plataformas: new Set(),
        categorias: new Set()
      };
    }
    concorrentes[id].totalAnuncios++;
    ad.plataformas.forEach(p => concorrentes[id].plataformas.add(p));
    if (ad.categoria) concorrentes[id].categorias.add(ad.categoria);
  });
  
  // Converter Sets para Arrays
  return Object.values(concorrentes).map(c => ({
    ...c,
    plataformas: Array.from(c.plataformas),
    categorias: Array.from(c.categorias)
  })).sort((a, b) => b.totalAnuncios - a.totalAnuncios);
}
```

### 2. Analisar Concorrente Específico

**Endpoint:** Buscar anúncios de uma página específica.

**URL do Meta Ads Library:**
```
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&publisher_platforms[0]=facebook&publisher_platforms[1]=instagram&q={NOME_DA_PAGINA}
```

Ou usar o `pageID`:
```
https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&page_id={PAGE_ID}
```

---

## 📊 MODELO DE NEGÓCIO E INFERÊNCIAS

### 1. Extrair Padrões de Oferta

**Análise de copy para identificar:**
- Preços mencionados (ex: "R$79,90")
- Tipos de oferta (desconto, brinde, urgência)
- Propostas de valor
- Público-alvo implícito

**Função:**
```javascript
function extrairOfertas(anuncios) {
  const padroes = {
    precos: /\d+[,.]?\d*\s*(reais|R\$|\$)/g,
    urgencia: /(últimas? vagas?|hoje|agora|somente hoje|限时)/gi,
    desconto: /(desconto|promocao|oferta|grátis|free)/gi,
    garantia: /(garantia|devolução|satisfação)/gi
  };
  
  return anuncios.map(ad => {
    const texto = ad.texto + ' ' + (ad.headline || '');
    const ofertas = {
      preco: texto.match(padroes.precos),
      urgencia: texto.match(padroes.urgencia),
      desconto: texto.match(padroes.desconto),
      garantia: texto.match(padroes.garantia)
    };
    return { id: ad.id, ofertas };
  });
}
```

### 2. Análise de Landing Page

**Endpoint:** Analisar URL de destino dos anúncios.

**Função:**
```javascript
async function analisarLandingPage(url) {
  try {
    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000 
    });
    const html = await response.text();
    
    // Extrair elementos básicos
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const precoMatch = html.match(/\d+[,.]?\d*\s*(reais|R\$|\$)/g);
    
    return {
      title: titleMatch ? titleMatch[1] : null,
      h1: h1Match ? h1Match[1] : null,
      precos: precoMatch,
      tamanhoHtml: html.length,
      contemFormulario: html.includes('<form') || html.includes('form action')
    };
  } catch (error) {
    return { erro: error.message };
  }
}
```

---

## 📝 TEMPLATES DE PESQUISA

### Template 1: Pesquisa de Nicho Completa

```javascript
async function pesquisaNichCompleta(nicheKeyword, cidade = null) {
  const resultados = {
    timestamp: new Date().toISOString(),
    nicho: nicheKeyword,
    cidade: null,
    anuncios: [],
    concorrentes: [],
    tendencias: {},
    ofertas: []
  };
  
  // 1. Pesquisar cidade (se fornecida)
  if (cidade) {
    resultados.cidade = await pesquisarCidade(cidade);
  }
  
  // 2. Minerar anúncios do nicho
  resultados.anuncios = await pesquisarAnuncios(nicheKeyword, 30);
  
  // 3. Identificar concorrentes
  resultados.concorrentes = await identificarConcorrentes(nicheKeyword, 50);
  
  // 4. Analisar tendências
  if (resultados.anuncios.length > 0) {
    resultados.tendencias = analisarTendencias(resultados.anuncios);
    resultados.ofertas = extrairOfertas(resultados.anuncios);
  }
  
  return resultados;
}
```

### Template 2: Relatório Executivo

```javascript
function gerarRelatorio(pesquisa) {
  const relatorio = {
    resumo: {
      totalAnuncios: pesquisa.anuncios.length,
      totalConcorrentes: pesquisa.concorrentes.length,
      cidadeAlvo: pesquisa.cidade?.nome || 'Não especificada',
      dataAnalise: new Date().toLocaleDateString('pt-BR')
    },
    insights: [],
    recomendacoes: []
  };
  
  // Gerar insights automáticos
  if (pesquisa.tendencias.ctas) {
    const ctaMaisUsado = Object.entries(pesquisa.tendencias.ctas)
      .sort((a, b) => b[1] - a[1])[0];
    relatorio.insights.push(`CTA mais usado: "${ctaMaisUsado[0]}" (${ctaMaisUsado[1]} anúncios)`);
  }
  
  // Recomendações
  relatorio.recomendacoes.push('Teste pelo menos 3 formatos de criativo diferentes');
  relatorio.recomendacoes.push('Inclua prova social nos primeiros 3 segundos do vídeo');
  relatorio.recomendacoes.push('Use CTA claro e direto (ex: "WhatsApp", "Peça já")');
  
  return relatorio;
}
```

---

## ⚠️ TROUBLESHOOTING

| Problema | Solução |
|----------|---------|
| Token Apify inválido | Verificar token no .env, gerar novo se expirado |
| Limite de custo atingido | Reduzir `maxResults` ou upgrade de plano |
| IBGE API sem resposta | Tentar novamente, usar endpoint alternativo |
| Meta bloqueia scraping | Usar `user-agent` diferente, aguardar 24h |
| Dados incompletos | Verificar campos obrigatórios no payload |

---

## ✅ CHECKLIST PESQUISA DE NICHO

- [ ] Token Apify configurado no .env
- [ ] Palavra-chave do nicho definida
- [ ] Limite de custo definido (maxResults)
- [ ] País/cidade alvo especificado
- [ ] Análise de tendências configurada
- [ ] Relatório gerado com insights

---

## 📋 RESUMO DE ENDPOINTS

| API | Endpoint | Uso |
|-----|----------|-----|
| **Apify** | `POST /v2/acts/leadsbrary~meta-ads-library-scraper/runs` | Minerar anúncios |
| **Apify** | `GET /v2/datasets/{datasetId}/items` | Obter resultados |
| **IBGE** | `GET /v1/localidades/municipios?nome={nome}` | Dados da cidade |
| **Facebook** | `GET /ads/library/?q={keyword}` | URL para scraper |

---

*Skill atualizada em 21/03/2026 - Inclui pesquisa de concorrentes locais via web search, análise competitiva, e fallback para dados demográficos.*
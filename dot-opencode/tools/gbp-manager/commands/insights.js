import { authenticate } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleInsights(args) {
  const auth = await authenticate();
  const locId = args[0];
  const daysBack = parseInt(args[1]) || 30;

  if (!locId) {
    console.error('Uso: gbp insights <locationId> [dias=30]');
    return;
  }

  const { default: axios } = await import('axios');
  const token = await auth.getAccessToken();
  const headers = {
    Authorization: `Bearer ${token.token}`,
    'Content-Type': 'application/json',
  };

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const fmt = (d) => d.toISOString().split('T')[0];

  const body = {
    basicMetricsRequest: {
      metricRequests: [
        'ALL',
      ],
      timeRange: {
        startTime: fmt(startDate),
        endTime: fmt(endDate),
      },
    },
  };

  try {
    const res = await axios.post(
      `${API_BASE.v4}/${locId}:reportInsights`,
      body,
      { headers },
    );

    const metrics = res.data?.reportInsightResponses?.[0]?.basicMetricsResponse?.metricValues || [];
    console.log(`\n📊 Insights (${fmt(startDate)} a ${fmt(endDate)})`);
    console.log('─'.repeat(50));

    for (const m of metrics) {
      const metricName = m.metric || 'desconhecido';
      const total = m.totalValue?.value ?? m.dimensionalValues?.[0]?.value ?? '-';
      console.log(`   ${padMetric(metricName)}: ${total}`);
    }

    if (metrics.length === 0) {
      console.log('   Nenhum dado disponível para o período.');
    }
  } catch (err) {
    if (err.response?.status === 404 || err.response?.status === 403) {
      console.log('Insights não disponíveis para este local ou período.');
    } else if (err.response) {
      console.error(`Erro ${err.response.status}:`, JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Erro:', err.message);
    }
  }
}

function padMetric(name) {
  const labels = {
    'QUERIES_DIRECT': 'Buscas diretas',
    'QUERIES_INDIRECT': 'Buscas indiretas',
    'QUERIES_CHAIN': 'Buscas por rede',
    'VIEWS_MAPS': 'Visualizações no Maps',
    'VIEWS_SEARCH': 'Visualizações na Pesquisa',
    'ACTIONS_WEBSITE': 'Cliques no site',
    'ACTIONS_PHONE': 'Chamadas telefônicas',
    'ACTIONS_DRIVING_DIRECTIONS': 'Rotas',
    'ACTIONS': 'Ações totais',
    'PHOTOS_VIEWS': 'Visualizações de fotos',
    'PHOTOS_COUNT': 'Total de fotos',
    'ALL': 'Total de interações',
  };
  const label = labels[name] || name;
  return label.padEnd(20);
}

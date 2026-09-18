import { authenticate } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleServices(args) {
  const auth = await authenticate();
  const sub = args[0];

  if (!['list', 'update'].includes(sub)) {
    console.error('Uso: gbp services <list|update> [args...]');
    return;
  }

  const { default: axios } = await import('axios');
  const token = await auth.getAccessToken();
  const headers = {
    Authorization: `Bearer ${token.token}`,
    'Content-Type': 'application/json',
  };

  switch (sub) {
    case 'list': {
      const locId = args[1];
      if (!locId) { console.error('Uso: gbp services list <locationId>'); return; }
      try {
        const res = await axios.get(`${API_BASE.v4}/${locId}/serviceList`, { headers });
        const services = res.data?.services || [];
        if (services.length === 0) {
          console.log('Nenhum serviço cadastrado.');
          return;
        }
        for (const s of services) {
          console.log(`\n🔧 ${s.serviceName || s.name}`);
          console.log(`   ID: ${s.serviceId || s.name}`);
          if (s.price) console.log(`   Preço: ${s.price.currencyCode} ${s.price.amountMicros / 1000000}`);
          if (s.description) console.log(`   Descrição: ${s.description}`);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log('Serviços não configurados para este local.');
        } else {
          throw err;
        }
      }
      break;
    }

    case 'update': {
      const locId = args[1];
      if (!locId) {
        console.error('Uso: gbp services update <locationId> <serviço1>,<serviço2>,...');
        console.error('Ex: gbp services update <locId> "Consultoria em Marketing","Gestão de Tráfego","SEO"');
        return;
      }
      const serviceNames = args.slice(2).join(' ').split(',').map(s => s.trim()).filter(Boolean);
      const services = serviceNames.map(name => ({
        serviceName: name,
        serviceId: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      }));
      const res = await axios.patch(
        `${API_BASE.v4}/${locId}/serviceList`,
        { services },
        { headers, params: { updateMask: 'services' } },
      );
      console.log('✅ Serviços atualizados com sucesso!');
      for (const s of res.data.services || []) {
        console.log(`   - ${s.serviceName}`);
      }
      break;
    }
  }
}

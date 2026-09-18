import { authenticate, makeRequest } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleLocations(args) {
  const auth = await authenticate();
  const sub = args[0] || 'list';

  try {
    const { default: axios } = await import('axios');
    const token = await auth.getAccessToken();

    const headers = {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    };

    switch (sub) {
      case 'list': {
        const res = await axios.get(`${API_BASE.accountManagement}/accounts`, { headers });
        const accounts = res.data.accounts || [];
        if (accounts.length === 0) {
          console.log('Nenhuma conta encontrada.');
          return;
        }
        for (const acc of accounts) {
          console.log(`\n📍 Conta: ${acc.accountName} (${acc.name})`);
          const locRes = await axios.get(`${API_BASE.accountManagement}/${acc.name}/locations`, { headers });
          const locations = locRes.data.locations || [];
          if (locations.length === 0) {
            console.log('  Nenhum local vinculado.');
          } else {
            for (const loc of locations) {
              console.log(`  ├─ ${loc.locationName || loc.locationKey?.locationName || 'Sem nome'}`);
              console.log(`  │  ID: ${loc.name}`);
              console.log(`  │  Endereço: ${formatAddress(loc.address)}`);
              console.log(`  │  Status: ${loc.metadata?.duplicate || 'ativo'}`);
              console.log('');
            }
          }
        }
        break;
      }

      case 'get': {
        const locId = args[1];
        if (!locId) { console.error('Uso: gbp locations get <locationId>'); return; }
        const res = await axios.get(`${API_BASE.businessInformation}/${locId}`, {
          headers,
          params: { readMask: '*' },
        });
        const loc = res.data;
        console.log(`\n📍 ${loc.title || loc.locationName || 'Local'}`);
        console.log(`   ID: ${loc.name}`);
        console.log(`   Nome: ${loc.title}`);
        console.log(`   Telefone: ${loc.phoneNumbers?.primaryPhone || '-'}`);
        console.log(`   Website: ${loc.websiteUri || '-'}`);
        console.log(`   Categoria: ${loc.category?.displayName || '-'}`);
        console.log(`   Endereço: ${formatAddress(loc.address)}`);
        if (loc.regularHours?.periods) {
          console.log('\n   Horários:');
          for (const p of loc.regularHours.periods) {
            console.log(`   ${p.openDay}: ${p.openTime}-${p.closeTime}`);
          }
        }
        console.log(`   Status: ${loc.metadata?.duplicate || 'ativo'}`);
        break;
      }

      case 'update': {
        const locId = args[1];
        const field = args[2];
        const value = args.slice(3).join(' ');
        if (!locId || !field || !value) {
          console.error('Uso: gbp locations update <locationId> <campo> <valor>');
          return;
        }
        const patch = {};
        if (field === 'title') patch.title = value;
        else if (field === 'phone') patch.phoneNumbers = { primaryPhone: value };
        else if (field === 'website') patch.websiteUri = value;
        else {
          console.error(`Campo '${field}' não suportado. Use: title, phone, website`);
          return;
        }
        const res = await axios.patch(
          `${API_BASE.businessInformation}/${locId}`,
          patch,
          { headers, params: { updateMask: field, validateOnly: false } },
        );
        console.log('✅ Local atualizado com sucesso!');
        console.log(JSON.stringify(res.data, null, 2));
        break;
      }

      case 'search': {
        const query = args.slice(1).join(' ');
        if (!query) { console.error('Uso: gbp locations search <query>'); return; }
        const res = await axios.post(
          `${API_BASE.businessInformation}/googleLocations:search`,
          { location: { locationName: query } },
          { headers },
        );
        const matches = res.data?.matchingLocations || [];
        if (matches.length === 0) {
          console.log('Nenhum local encontrado.');
        } else {
          console.log(`\n${matches.length} local(is) encontrado(s):`);
          for (const m of matches) {
            const loc = m.location;
            console.log(`\n  📍 ${loc.locationName}`);
            console.log(`     ID: ${loc.name}`);
            console.log(`     Endereço: ${formatAddress(loc.address)}`);
          }
        }
        break;
      }

      default:
        console.error('Subcomando desconhecido. Use: list, get, update, search');
    }
  } catch (err) {
    handleError(err);
  }
}

function formatAddress(addr) {
  if (!addr) return '-';
  const parts = [addr.addressLines?.[0], addr.locality, addr.regionCode].filter(Boolean);
  return parts.join(', ') || '-';
}

function handleError(err) {
  if (err.response) {
    console.error(`Erro ${err.response.status}:`, JSON.stringify(err.response.data, null, 2));
  } else {
    console.error('Erro:', err.message);
  }
}

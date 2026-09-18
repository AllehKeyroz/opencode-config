import { authenticate } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleManagers(args) {
  const auth = await authenticate();
  const sub = args[0];

  if (!['list', 'add', 'remove'].includes(sub)) {
    console.error('Uso: gbp managers <list|add|remove> [args...]');
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
      if (!locId) { console.error('Uso: gbp managers list <locationId>'); return; }
      const res = await axios.get(`${API_BASE.v4}/${locId}/admins`, { headers });
      const admins = res.data?.admins || [];
      if (admins.length === 0) {
        console.log('Nenhum administrador encontrado.');
        return;
      }
      for (const a of admins) {
        console.log(`\n👤 ${a.name || a.adminName || 'Admin'}`);
        console.log(`   Email: ${a.adminName || '-'}`);
        console.log(`   Papel: ${a.role || 'UNKNOWN_ROLE'}`);
      }
      break;
    }

    case 'add': {
      const locId = args[1];
      const email = args[2];
      const role = args[3]?.toUpperCase() || 'MANAGER';

      if (!locId || !email) {
        console.error('Uso: gbp managers add <locationId> <email> [role]');
        console.error('Roles: MANAGER (padrão), OWNER, SITE_MANAGER');
        return;
      }

      const validRoles = ['MANAGER', 'OWNER', 'SITE_MANAGER'];
      if (!validRoles.includes(role)) {
        console.error(`Role inválida: ${role}. Use: ${validRoles.join(', ')}`);
        return;
      }

      const res = await axios.post(
        `${API_BASE.v4}/${locId}/admins`,
        { adminName: email, role },
        { headers },
      );
      console.log(`✅ ${email} adicionado como ${role} com sucesso!`);
      console.log(`   ID: ${res.data.name}`);
      break;
    }

    case 'remove': {
      const adminId = args[1];
      if (!adminId) {
        console.error('Uso: gbp managers remove <adminId>');
        return;
      }
      await axios.delete(`${API_BASE.v4}/${adminId}`, { headers });
      console.log('✅ Administrador removido com sucesso.');
      break;
    }
  }
}

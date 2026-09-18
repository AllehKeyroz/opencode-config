import { authenticate, makeRequest } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handlePosts(args) {
  const auth = await authenticate();
  const sub = args[0];

  if (!['list', 'create', 'delete'].includes(sub)) {
    console.error('Uso: gbp posts <list|create|delete> [args...]');
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
      if (!locId) { console.error('Uso: gbp posts list <locationId>'); return; }
      const res = await axios.get(`${API_BASE.v4}/${locId}/localPosts`, { headers });
      const posts = res.data?.localPosts || [];
      if (posts.length === 0) {
        console.log('Nenhum post encontrado.');
        return;
      }
      for (const p of posts) {
        console.log(`\n📝 ${p.summary || '(sem resumo)'}`);
        console.log(`   ID: ${p.name}`);
        console.log(`   Tipo: ${p.topicType}`);
        console.log(`   Criado: ${p.createTime}`);
        console.log(`   URL: ${p.callToAction?.url || '-'}`);
        console.log(`   Estado: ${p.state || 'publicado'}`);
      }
      break;
    }

    case 'create': {
      const locId = args[1];
      const type = args[2]?.toLowerCase();
      const summary = args.slice(3).join(' ');
      if (!locId || !type || !summary) {
        console.error('Uso: gbp posts create <locationId> <tipo> <texto>');
        console.error('Tipos: offer, event, what-new, product');
        return;
      }
      const typeMap = { offer: 'OFFER', event: 'EVENT', 'what-new': 'WHAT_NEW', product: 'PRODUCT' };
      const topicType = typeMap[type];
      if (!topicType) { console.error(`Tipo inválido: ${type}. Use: offer, event, what-new, product`); return; }

      const body = {
        summary,
        topicType,
        callToAction: { actionType: 'LEARN_MORE', url: 'https://keyrozdigital.com' },
      };

      const res = await axios.post(`${API_BASE.v4}/${locId}/localPosts`, body, { headers });
      console.log('✅ Post criado com sucesso!');
      console.log(`   ID: ${res.data.name}`);
      console.log(`   URL: https://business.google.com/posts/${res.data.name.split('/').pop()}`);
      break;
    }

    case 'delete': {
      const postId = args[1];
      if (!postId) { console.error('Uso: gbp posts delete <postId>'); return; }
      await axios.delete(`${API_BASE.v4}/${postId}`, { headers });
      console.log('✅ Post excluído com sucesso.');
      break;
    }
  }
}

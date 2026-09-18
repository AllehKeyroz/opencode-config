import { authenticate } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleReviews(args) {
  const auth = await authenticate();
  const sub = args[0];

  if (!['list', 'reply', 'delete-reply'].includes(sub)) {
    console.error('Uso: gbp reviews <list|reply|delete-reply> [args...]');
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
      if (!locId) { console.error('Uso: gbp reviews list <locationId>'); return; }
      const res = await axios.get(`${API_BASE.v4}/${locId}/reviews`, { headers });
      const reviews = res.data?.reviews || [];
      if (reviews.length === 0) {
        console.log('Nenhuma avaliação encontrada.');
        return;
      }
      for (const r of reviews) {
        console.log(`\n⭐ ${r.starRating ?? 0}/5 — ${r.reviewer?.displayName || 'Anônimo'}`);
        console.log(`   ID: ${r.name}`);
        console.log(`   Comentário: ${r.comment || '(sem texto)'}`);
        console.log(`   Data: ${r.createTime}`);
        if (r.comment && r.comment.substring(0, 100).length < r.comment.length) {
          console.log(`   (comentário truncado, use get para ver completo)`);
        }
        if (r.reply) {
          console.log(`   ↪ Sua resposta: ${r.reply.comment?.substring(0, 100)}`);
        } else {
          console.log(`   ↪ Sem resposta`);
        }
      }
      break;
    }

    case 'reply': {
      const reviewId = args[1];
      const replyText = args.slice(2).join(' ');
      if (!reviewId || !replyText) {
        console.error('Uso: gbp reviews reply <reviewId> <texto>');
        return;
      }
      const res = await axios.patch(
        `${API_BASE.v4}/${reviewId}/reply`,
        { comment: replyText },
        { headers },
      );
      console.log('✅ Resposta publicada com sucesso!');
      console.log(`   ID da resposta: ${res.data.name}`);
      break;
    }

    case 'delete-reply': {
      const reviewId = args[1];
      if (!reviewId) { console.error('Uso: gbp reviews delete-reply <reviewId>'); return; }
      await axios.delete(`${API_BASE.v4}/${reviewId}/reply`, { headers });
      console.log('✅ Resposta excluída com sucesso.');
      break;
    }
  }
}

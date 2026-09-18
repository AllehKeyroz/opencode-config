import { authenticate } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleQA(args) {
  const auth = await authenticate();
  const sub = args[0];

  if (!['list', 'answer'].includes(sub)) {
    console.error('Uso: gbp qa <list|answer> [args...]');
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
      if (!locId) { console.error('Uso: gbp qa list <locationId>'); return; }
      const res = await axios.get(`${API_BASE.v4}/${locId}/questions`, { headers });
      const questions = res.data?.questions || [];
      if (questions.length === 0) {
        console.log('Nenhuma pergunta encontrada.');
        return;
      }
      for (const q of questions) {
        console.log(`\n❓ ${q.text}`);
        console.log(`   ID: ${q.name}`);
        console.log(`   Autor: ${q.author?.displayName || 'Anônimo'}`);
        console.log(`   Data: ${q.createTime}`);
        if (q.answers && q.answers.length > 0) {
          for (const a of q.answers) {
            console.log(`   ↪ Resposta: ${a.text}`);
          }
        } else {
          console.log(`   ↪ Sem resposta`);
        }
      }
      break;
    }

    case 'answer': {
      const questionId = args[1];
      const answerText = args.slice(2).join(' ');
      if (!questionId || !answerText) {
        console.error('Uso: gbp qa answer <questionId> <texto>');
        return;
      }
      const res = await axios.post(
        `${API_BASE.v4}/${questionId}/answers:upsert`,
        { text: answerText },
        { headers },
      );
      console.log('✅ Resposta publicada com sucesso!');
      console.log(`   ID: ${res.data.name}`);
      break;
    }
  }
}

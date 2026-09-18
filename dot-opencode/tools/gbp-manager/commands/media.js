import { authenticate } from '../auth.js';
import { API_BASE } from '../config.js';

export async function handleMedia(args) {
  const auth = await authenticate();
  const sub = args[0];

  if (!['list', 'upload'].includes(sub)) {
    console.error('Uso: gbp media <list|upload> [args...]');
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
      if (!locId) { console.error('Uso: gbp media list <locationId>'); return; }
      const res = await axios.get(`${API_BASE.v4}/${locId}/media`, { headers });
      const media = res.data?.mediaItems || [];
      if (media.length === 0) {
        console.log('Nenhuma mídia encontrada.');
        return;
      }
      for (const m of media) {
        console.log(`\n🖼️  ${m.googleUrl || '(sem URL)'}`);
        console.log(`   ID: ${m.name}`);
        console.log(`   Tipo: ${m.mediaFormat?.name || m.mimeType || '-'}`);
        console.log(`   Descrição: ${m.description || '-'}`);
      }
      break;
    }

    case 'upload': {
      const locId = args[1];
      const filePath = args[2];
      if (!locId || !filePath) {
        console.error('Uso: gbp media upload <locationId> <caminho-do-arquivo>');
        return;
      }

      const fs = await import('fs');
      if (!fs.existsSync(filePath)) {
        console.error(`Arquivo não encontrado: ${filePath}`);
        return;
      }

      const mimeType = filePath.endsWith('.mp4') || filePath.endsWith('.mov')
        ? 'video/mp4' : 'image/jpeg';

      const startUploadRes = await axios.post(
        `${API_BASE.v4}/${locId}/media:startUpload`,
        {},
        { headers },
      );
      const uploadUrl = startUploadRes.data?.uploadUri;
      if (!uploadUrl) {
        console.error('Erro ao iniciar upload.');
        return;
      }

      const fileBuffer = fs.readFileSync(filePath);
      const uploadRes = await axios.put(uploadUrl, fileBuffer, {
        headers: {
          'Content-Type': mimeType,
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'upload, finalize',
          'X-Goog-Upload-Offset': '0',
        },
      });

      const createRes = await axios.post(
        `${API_BASE.v4}/${locId}/media`,
        {
          mediaFormat: { name: mimeType.startsWith('video') ? 'video' : 'photo' },
          sourceUrl: uploadRes.config?.url || uploadUrl,
          thumbnailUrl: uploadRes.config?.url || uploadUrl,
        },
        { headers },
      );
      console.log('✅ Mídia enviada com sucesso!');
      console.log(`   ID: ${createRes.data.name}`);
      console.log(`   URL: ${createRes.data.googleUrl || '-'}`);
      break;
    }
  }
}

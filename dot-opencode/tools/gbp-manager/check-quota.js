import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { google } from 'googleapis';

async function check() {
  const secretsDir = join(process.env.USERPROFILE, '.opencode', 'secrets');
  const credsPath = join(secretsDir, 'gbp-credentials.json');
  const tokenPath = join(secretsDir, 'gbp-token.json');

  if (!existsSync(credsPath) || !existsSync(tokenPath)) {
    console.log('❌ Credenciais não encontradas. Execute o setup primeiro.');
    process.exit(1);
  }

  const creds = JSON.parse(readFileSync(credsPath, 'utf-8'));
  const token = JSON.parse(readFileSync(tokenPath, 'utf-8'));

  const oauth2Client = new google.auth.OAuth2(creds.clientId, creds.clientSecret, creds.redirectUri);
  oauth2Client.setCredentials(token);

  if (token.expiry_date && token.expiry_date < Date.now()) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      oauth2Client.setCredentials(credentials);
      token.access_token = credentials.access_token;
      token.expiry_date = credentials.expiry_date;
      if (credentials.refresh_token) token.refresh_token = credentials.refresh_token;
      writeFileSync(tokenPath, JSON.stringify(token, null, 2));
      console.log('✅ Token renovado com sucesso');
    } catch (err) {
      console.log('❌ Token expirado e não foi possível renovar.');
      console.log('   Detalhe:', err.message);
      console.log('   ⚠️  Re-autentique executando: gbp auth');
      process.exit(1);
    }
  }

  const accessToken = await oauth2Client.getAccessToken();
  const { default: axios } = await import('axios');

  try {
    const res = await axios.get(
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
      { headers: { Authorization: 'Bearer ' + accessToken.token } }
    );
    console.log(`✅ API GBP APROVADA! Status: ${res.status}`);
    console.log(`📋 Contas encontradas:`, JSON.stringify(res.data.accounts?.length || 0));
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response?.status === 429) {
      const body = err.response?.data;
      const msg = body?.error?.message || body?.error?.status || '429';
      console.log(`⏳ Quota: ${msg}`);
      console.log(`📅 Próxima verificação automática: amanhã às 10:00`);
      process.exit(0);
    } else if (err.response?.status === 403) {
      const body = err.response?.data;
      console.log('❌ Permissão negada (403). API pode não estar ativada.');
      console.log('   Ative em: https://console.cloud.google.com/apis/library/mybusinessaccountmanagement.googleapis.com');
      console.log('   Detalhe:', body?.error?.message || err.message);
      process.exit(1);
    } else if (err.response?.status === 400) {
      const body = err.response?.data;
      console.log('❌ Token inválido/expirado. Re-autentique: gbp auth');
      console.log('   Detalhe:', body?.error_description || body?.error || err.message);
      process.exit(1);
    } else {
      console.log(`❌ Erro ${err.response?.status}: ${err.message}`);
      if (err.response?.data) console.log('   Resposta:', JSON.stringify(err.response.data));
      process.exit(1);
    }
  }
}

check();

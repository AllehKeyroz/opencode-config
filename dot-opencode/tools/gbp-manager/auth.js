import { readFileSync, writeFileSync, existsSync } from 'fs';
import { google } from 'googleapis';
import { createInterface } from 'readline';
import { SCOPES, getTokenPath, getCredentialsPath, loadCredentials, saveCredentials } from './config.js';

export async function authenticate() {
  let creds = loadCredentials();
  if (!creds) {
    console.error('Credenciais OAuth não encontradas. Execute: gbp setup');
    process.exit(1);
  }

  const { clientId, clientSecret, redirectUri } = creds;
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  if (existsSync(getTokenPath())) {
    const token = JSON.parse(readFileSync(getTokenPath(), 'utf-8'));
    oauth2Client.setCredentials(token);
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log('Token expirado. Renovando...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        writeFileSync(getTokenPath(), JSON.stringify(credentials, null, 2));
        console.log('Token renovado com sucesso.');
      } catch (err) {
        console.error('Erro ao renovar token:', err.message);
        console.error('Execute: gbp setup (reautenticação necessária)');
        process.exit(1);
      }
    }
  } else {
    console.log('Token não encontrado. Iniciando fluxo OAuth...');
    await getAccessToken(oauth2Client, creds);
  }

  return oauth2Client;
}

async function getAccessToken(oauth2Client, creds) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('\n⚠️  Autorize o acesso abrindo esta URL no navegador:');
  console.log('\n' + authUrl + '\n');
  console.log('Após autorizar, cole o código de autorização aqui.\n');

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise((resolve) => {
    rl.question('Código de autorização: ', (answer) => resolve(answer.trim()));
  });
  rl.close();

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    writeFileSync(getTokenPath(), JSON.stringify(tokens, null, 2));
    console.log('Token salvo com sucesso em: ' + getTokenPath());
  } catch (err) {
    console.error('Erro ao obter token:', err.message);
    process.exit(1);
  }
}

export async function setupOAuth(clientId, clientSecret) {
  const redirectUri = 'http://localhost:3000/oauth2callback';
  const creds = { clientId, clientSecret, redirectUri };
  saveCredentials(creds);
  console.log('Credenciais salvas em: ' + getCredentialsPath());

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  await getAccessToken(oauth2Client, creds);
  console.log('Setup OAuth concluído com sucesso!');
}

export async function makeRequest(oauth2Client, method, url, body = null) {
  const token = await oauth2Client.getAccessToken();
  const config = {
    method,
    url,
    headers: {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    },
  };
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.data = body;
  }

  try {
    const { default: axios } = await import('axios');
    const response = await axios(config);
    return response.data;
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;
      if (status === 429) {
        console.error('Limite de quota excedido. Aguarde e tente novamente.');
      } else if (status === 403) {
        console.error('Permissão negada. Verifique se o email tem acesso ao GBP.');
      } else if (status === 404) {
        console.error('Recurso não encontrado.');
      }
      console.error(`Erro ${status}:`, JSON.stringify(data, null, 2));
    } else {
      console.error('Erro na requisição:', err.message);
    }
    return null;
  }
}

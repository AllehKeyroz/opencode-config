import { setupOAuth } from '../auth.js';
import { getTokenPath, getCredentialsPath } from '../config.js';
import { existsSync } from 'fs';

export async function handleSetup(args) {
  const clientId = args[0];
  const clientSecret = args[1];

  if (existsSync(getTokenPath())) {
    console.log('⚠️  Já existe um token de acesso salvo.');
    console.log('   Para reautenticar, delete o arquivo:');
    console.log('   ' + getTokenPath());
    console.log('   E execute novamente: gbp setup <clientId> <clientSecret>');
    return;
  }

  if (!clientId || !clientSecret) {
    console.log('\n🔧 GBP Manager - Setup Inicial\n');
    console.log('Primeiro, crie um projeto no Google Cloud Console:');
    console.log('  1. Acesse https://console.cloud.google.com');
    console.log('  2. Crie um projeto (ex: "gbp-manager")');
    console.log('  3. Ative as seguintes APIs:');
    console.log('     - Google My Business API');
    console.log('     - My Business Account Management API');
    console.log('     - My Business Business Information API');
    console.log('     - My Business Notifications API');
    console.log('     - My Business Verifications API');
    console.log('     - My Business Performance API');
    console.log('     - My Business Q&A API');
    console.log('     - My Business Place Actions API');
    console.log('  4. Crie uma credencial OAuth 2.0 (Web Application)');
    console.log('     Redirect URI: http://localhost:3000/oauth2callback');
    console.log('  5. Configure o console de consentimento OAuth');
    console.log();
    console.log('Após criar as credenciais, execute:');
    console.log('  gbp setup <CLIENT_ID> <CLIENT_SECRET>\n');
    return;
  }

  console.log('Iniciando setup OAuth...');
  await setupOAuth(clientId, clientSecret);
  console.log('\n✅ Setup concluído! Agora você pode usar os comandos:');
  console.log('   gbp locations list');
  console.log('   gbp locations get <id>');
  console.log('   gbp hours get <id>');
  console.log('   gbp reviews list <id>');
  console.log('   gbp posts list <id>');
  console.log('   gbp insights <id>');
  console.log('   gbp services list <id>');
  console.log('   gbp qa list <id>');
  console.log('   gbp media list <id>');
  console.log('   gbp managers list <id>');
}

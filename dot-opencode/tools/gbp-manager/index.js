#!/usr/bin/env node

import { handleLocations } from './commands/locations.js';
import { handlePosts } from './commands/posts.js';
import { handleReviews } from './commands/reviews.js';
import { handleQA } from './commands/qa.js';
import { handleMedia } from './commands/media.js';
import { handleHours } from './commands/hours.js';
import { handleServices } from './commands/services.js';
import { handleInsights } from './commands/insights.js';
import { handleManagers } from './commands/managers.js';
import { handleSetup } from './commands/setup.js';

const [,, command, ...args] = process.argv;

const commands = {
  'setup': handleSetup,
  'locations': handleLocations,
  'loc': handleLocations,
  'posts': handlePosts,
  'reviews': handleReviews,
  'review': handleReviews,
  'qa': handleQA,
  'media': handleMedia,
  'hours': handleHours,
  'services': handleServices,
  'service': handleServices,
  'insights': handleInsights,
  'insight': handleInsights,
  'managers': handleManagers,
  'manager': handleManagers,
  'admins': handleManagers,
  'admin': handleManagers,
};

function showHelp() {
  console.log(`
🔧 GBP Manager v1.0 — Google Business Profile Manager

Uso:
  gbp <comando> [subcomando] [args...]

Comandos:
  setup [clientId] [clientSecret]    Configuração inicial OAuth
  locations list                     Lista todas as contas e locais
  locations get <id>                 Detalhes de um local
  locations update <id> <campo> <v>  Atualiza dados do local
  locations search <query>           Busca locais no Google
  posts list <locationId>            Lista posts
  posts create <locId> <tipo> <txt>  Cria post (tipos: offer, event, what-new, product)
  posts delete <postId>              Exclui post
  reviews list <locationId>          Lista avaliações
  reviews reply <reviewId> <txt>     Responde avaliação
  reviews delete-reply <reviewId>    Remove resposta
  qa list <locationId>               Lista perguntas
  qa answer <questionId> <txt>       Responde pergunta
  media list <locationId>            Lista mídias
  media upload <locId> <arquivo>     Envia mídia
  hours get <locationId>             Ver horários
  hours update <locId> <dias...>     Atualiza horários
  services list <locationId>         Lista serviços
  services update <locId> <svcs>     Atualiza serviços
  insights <locationId> [dias]       Métricas do local
  managers list <locationId>         Lista administradores
  managers add <locId> <email> [rol] Adiciona admin
  managers remove <adminId>          Remove admin
  help                               Mostra esta ajuda
`);
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

const handler = commands[command];
if (!handler) {
  console.error(`Comando desconhecido: ${command}`);
  console.error('Use: gbp help');
  process.exit(1);
}

try {
  await handler(args);
} catch (err) {
  console.error('Erro:', err.message);
  process.exit(1);
}

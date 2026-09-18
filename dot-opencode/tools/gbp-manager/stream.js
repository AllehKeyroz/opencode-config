#!/usr/bin/env node

// Stream Tool - GHL Workflow Builder via API
// Usage: node stream.js <command> [args...]
// Must have Playwright browser tab open at app.kdsbrasil.com

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const STATE_FILE = join(dirname(new URL(import.meta.url).pathname), '.stream-state.json');
const LOCATION_ID = 'vFfGeLPM2doz9F88pGAa';

function getState() {
  if (!existsSync(STATE_FILE)) return null;
  return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
}

function saveState(state) {
  const dir = dirname(STATE_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function genId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Build API call script that runs inside page.evaluate
function buildApiScript(method, path, body = null) {
  const parts = [`const jwt = document.cookie.match(/access-token-v2=([^;]+)/);`];
  parts.push(`if (!jwt) return JSON.stringify({ error: 'no jwt' });`);
  parts.push(`const token = decodeURIComponent(jwt[1]);`);
  parts.push(`const locId = '${LOCATION_ID}';`);
  
  const url = `'https://backend.leadconnectorhq.com' + '${path}'`;
  const opts = `{ method: '${method}', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Version: '2021-07-28' }`;
  
  if (body) {
    parts.push(`const body = ${JSON.stringify(JSON.stringify(body))};`);
    parts.push(`const r = await fetch(${url}, ${opts}, body: JSON.parse(body) });`);
  } else {
    parts.push(`const r = await fetch(${url}, ${opts} });`);
  }
  
  parts.push(`const text = await r.text();`);
  parts.push(`try { return JSON.stringify({ status: r.status, data: JSON.parse(text) }); }`);
  parts.push(`catch { return JSON.stringify({ status: r.status, data: text }); }`);
  
  return parts.join('\n');
}

const commands = {};

commands.create = async (args) => {
  const name = args.join(' ') || 'Stream Workflow ' + Date.now();
  
  const script = `(async () => {
    const jwt = document.cookie.match(/access-token-v2=([^;]+)/);
    if (!jwt) return JSON.stringify({ error: 'no jwt' });
    const token = decodeURIComponent(jwt[1]);
    const body = JSON.parse('${JSON.stringify({ name, type: 'workflow', locationId: LOCATION_ID, status: 'draft', allowMultiple: true, timezone: 'account', permission: 380, meta: { advanceCanvasMeta: { enabled: true } }, workflowData: { templates: [] }, trigger: { value: [] } })}');
    const r = await fetch('https://backend.leadconnectorhq.com/workflow/' + '${LOCATION_ID}', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', Version: '2021-07-28' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    return JSON.stringify({ status: r.status, id: data.id });
  })()`;

  // This can't run from Node.js directly - it needs Playwright
  // So we output the script to be run via playwright_browser_run_code_unsafe
  console.log(JSON.stringify({ action: 'create', name, script }));
};

commands['add-trigger'] = async (args) => {
  const type = args[0];
  if (!type) { console.error('Uso: add-trigger <type>'); process.exit(1); }

  const state = getState() || { triggers: [], templates: [], nextY: 0 };
  const triggerId = genId();
  const yPos = state.nextY || 0;
  state.nextY = (state.nextY || 0) + 75;

  const name = type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const trigger = {
    name,
    type,
    filters: [],
    trigger: {
      _id: triggerId,
      _locationId: LOCATION_ID,
      _data: {
        id: triggerId, name, type,
        masterType: 'highlevel',
        workflow_id: state.workflowId,
        location_id: LOCATION_ID,
        belongs_to: 'workflow',
        conditions: [],
        actions: [{ workflow_id: state.workflowId, type: 'add_to_workflow' }],
        schedule_config: {},
        advanceCanvasMeta: { position: { x: 12, y: yPos } },
        active: true, status: 'draft'
      }
    },
    isMarketplaceTrigger: false,
    workflowsTriggerType: 'INTERNAL'
  };

  console.log(JSON.stringify({ action: 'add-trigger', type, name, triggerId, trigger, script: null }));
};

commands.status = async () => {
  const state = getState();
  if (!state) { console.log('Nenhum workflow ativo.'); return; }
  console.log(JSON.stringify(state, null, 2));
};

commands['set-workflow'] = async (args) => {
  const wfId = args[0];
  if (!wfId) { console.error('Uso: set-workflow <workflowId>'); process.exit(1); }
  const state = getState() || {};
  state.workflowId = wfId;
  saveState(state);
  console.log(`Workflow ID setado: ${wfId}`);
};

const cmd = process.argv[2];
const handler = commands[cmd];
if (!handler) {
  console.log(`
Stream Tool - GHL Workflow Builder

Uso: node stream.js <comando> [args]

Comandos:
  create <nome>           Gera script para criar workflow
  add-trigger <type>      Adiciona trigger (gera dados locais)
  set-workflow <id>       Define workflowId ativo
  status                  Mostra estado atual
`);
  process.exit(0);
}

await handler(process.argv.slice(3));

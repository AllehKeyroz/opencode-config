#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';

const STATE_FILE = join(dirname(new URL(import.meta.url).pathname), '.workflow-state.json');
const SECRETS_FILE = join(process.env.USERPROFILE, '.opencode', 'secrets', 'keyroz-ai-credentials.json');
const LOCATION_ID = 'vFfGeLPM2doz9F88pGAa';
const BASE_URL = 'https://services.leadconnectorhq.com';

let token = '';
try {
  const secrets = JSON.parse(readFileSync(SECRETS_FILE, 'utf-8'));
  token = secrets.ghl.api.token;
} catch {
  console.error('Erro: credenciais GHL não encontradas em', SECRETS_FILE);
  process.exit(1);
}

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
  return randomUUID().replace(/-/g, '').substring(0, 20);
}

async function api(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Version: '2021-07-28',
  };
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) {
      console.error(`[ERRO ${res.status}]`, JSON.stringify(data, null, 2));
      return null;
    }
    return data;
  } catch (err) {
    console.error('Erro na requisição:', err.message);
    return null;
  }
}

const commands = {};

commands.start = async (args) => {
  const name = args[0] || 'Stream Workflow';
  const wfId = randomUUID();

  const body = {
    id: wfId,
    name,
    type: 'workflow',
    locationId: LOCATION_ID,
    status: 'draft',
    allowMultiple: true,
    timezone: 'America/Sao_Paulo',
    permission: 380,
    meta: { advanceCanvasMeta: { enabled: true } },
    workflowData: { templates: [], connections: [] },
    trigger: { value: [] },
  };

  console.log(`Criando workflow "${name}" (${wfId})...`);
  const result = await api('PUT', `/workflow/${LOCATION_ID}/${wfId}`, body);
  if (!result) { process.exit(1); }

  const state = {
    workflowId: wfId,
    name,
    nextOrder: 0,
    nextY: 0,
    nodes: {},
    connections: [],
    triggers: [],
  };
  saveState(state);
  console.log(`Workflow criado: ${wfId}`);
  console.log(`State salvo em: ${STATE_FILE}`);
};

commands['add-trigger'] = async (args) => {
  const state = getState();
  if (!state) { console.error('Nenhum workflow ativo. Use "start" primeiro.'); process.exit(1); }

  const type = args[0];
  if (!type) { console.error('Uso: add-trigger <type> [--name <name>]'); process.exit(1); }

  const nameIdx = args.indexOf('--name');
  const name = nameIdx >= 0 ? args.slice(nameIdx + 1, nameIdx + 2).join(' ') : type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const triggerId = genId();
  const yPos = state.nextY;
  state.nextY += 75;

  const trigger = {
    id: triggerId,
    name,
    type,
    masterType: 'highlevel',
    workflow_id: state.workflowId,
    location_id: LOCATION_ID,
    belongs_to: 'workflow',
    conditions: [],
    actions: [{ workflow_id: state.workflowId, type: 'add_to_workflow' }],
    advanceCanvasMeta: { position: { x: 12, y: yPos } },
    active: true,
  };

  state.triggers.push(trigger);
  state.nodes[triggerId] = { type: 'trigger', name, triggerType: type };
  saveState(state);
  console.log(`Trigger adicionado: ${name} (${type}) [${triggerId}] at y=${yPos}`);
};

commands['add-action'] = async (args) => {
  const state = getState();
  if (!state) { console.error('Nenhum workflow ativo. Use "start" primeiro.'); process.exit(1); }

  const type = args[0];
  if (!type) { console.error('Uso: add-action <type> [--name <name>] [--attrs <json>]'); process.exit(1); }

  const nameIdx = args.indexOf('--name');
  const name = nameIdx >= 0 ? args.slice(nameIdx + 1, nameIdx + 2).join(' ') : type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const attrsIdx = args.indexOf('--attrs');
  let attributes = {};
  if (attrsIdx >= 0) {
    try { attributes = JSON.parse(args.slice(attrsIdx + 1).join(' ')); }
    catch { console.error('--attrs precisa ser JSON válido'); process.exit(1); }
  }

  const nodeId = genId();
  const order = state.nextOrder;
  state.nextOrder++;
  const yPos = state.nextY;
  state.nextY += 75;

  const node = {
    id: nodeId,
    name: `${order + 1}. ${name}`,
    type,
    order,
    attributes,
    advanceCanvasMeta: { position: { y: yPos, x: 302 } },
    next: null,
  };

  const nodeList = state.nodes;
  if (Object.keys(nodeList).length > 0) {
    const lastKey = Object.keys(nodeList).filter(k => nodeList[k].type !== 'trigger').pop();
    if (lastKey) {
      node.parentKey = lastKey;
    }
  }

  state.nodes[nodeId] = { type: 'action', name, actionType: type, order, id: nodeId };
  if (!state.templates) state.templates = [];
  state.templates.push(node);

  saveState(state);
  console.log(`Action adicionada: ${name} (${type}) [${nodeId}] order=${order}`);
};

commands.connect = async (args) => {
  const state = getState();
  if (!state) { console.error('Nenhum workflow ativo.'); process.exit(1); }

  const [fromId, toId] = args;
  if (!fromId || !toId) { console.error('Uso: connect <fromId> <toId>'); process.exit(1); }

  state.connections.push({ from: fromId, to: toId });
  saveState(state);
  console.log(`Conexão: ${fromId} -> ${toId}`);
};

commands.save = async () => {
  const state = getState();
  if (!state) { console.error('Nenhum workflow ativo.'); process.exit(1); }

  const wfId = state.workflowId;
  console.log(`Salvando workflow ${wfId}...`);

  const existing = await api('GET', `/workflow/${LOCATION_ID}/${wfId}`);
  if (!existing) { process.exit(1); }

  const wf = existing.workflow || existing;

  wf.trigger = { value: state.triggers };

  wf.workflowData = wf.workflowData || { templates: [], connections: [] };
  wf.workflowData.templates = state.templates || [];

  if (state.connections.length > 0) {
    wf.workflowData.connections = state.connections;
  }

  const result = await api('PUT', `/workflow/${LOCATION_ID}/${wfId}`, wf);
  if (!result) { process.exit(1); }

  console.log('Workflow salvo com sucesso!');
  console.log(`  Triggers: ${state.triggers.length}`);
  console.log(`  Actions: ${(state.templates || []).length}`);
};

commands.status = async () => {
  const state = getState();
  if (!state) { console.error('Nenhum workflow ativo.'); return; }

  console.log(`Workflow: ${state.name} (${state.workflowId})`);
  console.log(`Triggers: ${state.triggers.length}`);
  state.triggers.forEach(t => console.log(`  - ${t.name} (${t.type}) [${t.id}]`));
  console.log(`Actions: ${(state.templates || []).length}`);
  (state.templates || []).forEach(t => console.log(`  [${t.order}] ${t.name} (${t.type}) [${t.id}]`));
  console.log(`Connections: ${state.connections.length}`);
  state.connections.forEach(c => console.log(`  ${c.from} -> ${c.to}`));
};

commands.publish = async () => {
  const state = getState();
  if (!state) { console.error('Nenhum workflow ativo.'); process.exit(1); }

  const wfId = state.workflowId;
  const existing = await api('GET', `/workflow/${LOCATION_ID}/${wfId}`);
  if (!existing) { process.exit(1); }

  const wf = existing.workflow || existing;
  wf.status = 'published';
  wf.trigger = { value: state.triggers };
  wf.workflowData = wf.workflowData || { templates: [], connections: [] };
  wf.workflowData.templates = state.templates || [];
  if (state.connections.length > 0) {
    wf.workflowData.connections = state.connections;
  }

  const result = await api('PUT', `/workflow/${LOCATION_ID}/${wfId}`, wf);
  if (!result) { process.exit(1); }
  console.log('Workflow publicado!');
};

commands['get-schema'] = async () => {
  const state = getState();
  if (!state) { console.error('Nenhum workflow ativo.'); process.exit(1); }

  const wfId = state.workflowId;
  const result = await api('GET', `/workflow/${LOCATION_ID}/${wfId}`);
  if (!result) { process.exit(1); }

  const wf = result.workflow || result;
  console.log(JSON.stringify(wf, null, 2));
};

commands.reset = async () => {
  if (existsSync(STATE_FILE)) {
    writeFileSync(STATE_FILE, JSON.stringify({}, null, 2));
    console.log('State resetado.');
  }
};

const cmd = process.argv[2];
const handler = commands[cmd];
if (!handler) {
  console.log(`
Stream Tool - GHL Workflow Builder

Uso:
  node workflow.js start <name>             Cria novo workflow
  node workflow.js add-trigger <type>        Adiciona trigger
    [--name <nome>]
  node workflow.js add-action <type>         Adiciona action node
    [--name <nome>] [--attrs '{"json"}']
  node workflow.js connect <fromId> <toId>   Conecta dois nodes
  node workflow.js save                      Salva no GHL
  node workflow.js publish                   Publica workflow
  node workflow.js status                    Mostra estado atual
  node workflow.js get-schema                Le workflow completo do GHL
  node workflow.js reset                     Limpa estado local
`);
  process.exit(0);
}

await handler(process.argv.slice(3));

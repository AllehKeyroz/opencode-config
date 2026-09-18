import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SECRETS_DIR = join(process.env.USERPROFILE, '.opencode', 'secrets');
const TOKEN_PATH = join(SECRETS_DIR, 'gbp-token.json');
const CREDENTIALS_PATH = join(SECRETS_DIR, 'gbp-credentials.json');

export const SCOPES = ['https://www.googleapis.com/auth/business.manage'];

export const API_BASE = {
  accountManagement: 'https://mybusinessaccountmanagement.googleapis.com/v1',
  businessInformation: 'https://mybusinessbusinessinformation.googleapis.com/v1',
  v4: 'https://mybusiness.googleapis.com/v4',
  post: 'https://mybusiness.googleapis.com/v4',
  reviews: 'https://mybusiness.googleapis.com/v4',
  qa: 'https://mybusiness.googleapis.com/v4',
  media: 'https://mybusiness.googleapis.com/v4',
  notifications: 'https://mybusinessnotifications.googleapis.com/v1',
  verifications: 'https://mybusinessverifications.googleapis.com/v1',
  performance: 'https://mybusinessperformance.googleapis.com/v1',
  placeActions: 'https://mybusinessplaceactions.googleapis.com/v1',
};

export function getTokenPath() { return TOKEN_PATH; }
export function getCredentialsPath() { return CREDENTIALS_PATH; }
export function getSecretsDir() { return SECRETS_DIR; }

export function loadCredentials() {
  if (!existsSync(CREDENTIALS_PATH)) return null;
  return JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'));
}

export function saveCredentials(creds) {
  if (!existsSync(SECRETS_DIR)) mkdirSync(SECRETS_DIR, { recursive: true });
  mkdirSync(dirname(CREDENTIALS_PATH), { recursive: true });
  writeFileSync(CREDENTIALS_PATH, JSON.stringify(creds, null, 2), 'utf-8');
}

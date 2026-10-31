import 'server-only';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Encrypted record store (AES-256-GCM, one file per record).
 * Development: local filesystem under DATA_DIR. Production: DATA_DIR must be persistent,
 * access-controlled storage (see README, Storage). Swap `FileStore` for a database
 * adapter implementing `RecordStore` without touching callers.
 */
export type Collection = 'applications' | 'takedowns' | 'ledger' | 'accounts' | 'tokens';

export interface StoredRecord<T> { id: string; createdAt: string; data: T }

export interface RecordStore {
  put<T>(collection: Collection, id: string, data: T): Promise<void>;
  get<T>(collection: Collection, id: string): Promise<StoredRecord<T> | null>;
  list<T>(collection: Collection): Promise<StoredRecord<T>[]>;
  remove(collection: Collection, id: string): Promise<void>;
}

function key(): Buffer {
  const raw = process.env.DATA_KEY;
  if (!raw) {
    if (process.env.NODE_ENV === 'production') throw new Error('DATA_KEY is required in production.');
    // Development only: deterministic throwaway key so local records stay readable between restarts.
    return Buffer.alloc(32, 7);
  }
  const k = Buffer.from(raw, 'base64');
  if (k.length !== 32) throw new Error('DATA_KEY must be 32 bytes, base64-encoded.');
  return k;
}

function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key(), iv);
  const body = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64');
}

function decrypt(blob: string): string {
  const buf = Buffer.from(blob, 'base64');
  const d = createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12));
  d.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8');
}

const SAFE_ID = /^[A-Za-z0-9_-]{1,96}$/;

class FileStore implements RecordStore {
  private dir(collection: Collection) {
    // Runtime data directory, not source: excluded from build-time file tracing.
    // resolve, not join: an absolute DATA_DIR (a mounted volume) must be used as-is.
    return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.DATA_DIR || '.data', collection);
  }
  private file(collection: Collection, id: string) {
    if (!SAFE_ID.test(id)) throw new Error('Invalid record id.');
    return path.join(this.dir(collection), `${id}.enc`);
  }
  async put<T>(collection: Collection, id: string, data: T) {
    await fs.mkdir(this.dir(collection), { recursive: true, mode: 0o700 });
    const rec: StoredRecord<T> = { id, createdAt: new Date().toISOString(), data };
    await fs.writeFile(this.file(collection, id), encrypt(JSON.stringify(rec)), { mode: 0o600 });
  }
  async get<T>(collection: Collection, id: string) {
    try {
      return JSON.parse(decrypt(await fs.readFile(this.file(collection, id), 'utf8'))) as StoredRecord<T>;
    } catch {
      return null;
    }
  }
  async list<T>(collection: Collection) {
    let names: string[] = [];
    try {
      names = await fs.readdir(this.dir(collection));
    } catch {
      return [];
    }
    const out: StoredRecord<T>[] = [];
    for (const n of names) {
      if (!n.endsWith('.enc')) continue;
      const r = await this.get<T>(collection, n.slice(0, -4));
      if (r) out.push(r);
    }
    return out;
  }
  async remove(collection: Collection, id: string) {
    await fs.rm(this.file(collection, id), { force: true });
  }
}

export const store: RecordStore = new FileStore();

export function newId(prefix: string): string {
  const d = new Date();
  const ymd = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  return `${prefix}-${ymd}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

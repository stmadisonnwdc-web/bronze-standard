export interface VersionLogEntry { version: string; date: string; change: string; reason: string }

/** Site changelog, newest first. Baseline versions are logged separately in content/baseline.ts. */
export const changelog: VersionLogEntry[] = [
  { version: '0.1.0', date: '2026-10-30', change: 'Preview build: Baseline v0.1 methodology, method, trust and gate status, application and takedown intake, private Ledger shell.', reason: 'Prepare the site for counsel review under Gate 6. Not public.' },
];

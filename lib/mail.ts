import 'server-only';

/**
 * Outbound mail is a single seam. "console" prints to the server log and is refused in
 * production so a misconfigured deploy fails loudly instead of silently dropping notices.
 * Production: replace `send` with your transactional provider (see README, Mail).
 */
export interface Mail { to: string; subject: string; text: string }

export async function send(mail: Mail): Promise<void> {
  const transport = process.env.MAIL_TRANSPORT || 'console';
  if (transport === 'console') {
    if (process.env.NODE_ENV === 'production') throw new Error('MAIL_TRANSPORT=console is not allowed in production.');
    console.info(`\n[mail] to=${mail.to}\nsubject: ${mail.subject}\n${mail.text}\n`);
    return;
  }
  throw new Error(`Unknown MAIL_TRANSPORT "${transport}". Configure a provider in lib/mail.ts.`);
}

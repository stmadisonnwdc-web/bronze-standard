import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';

/** Rejects cross-site form posts. Browsers send Origin on POST; absent Origin falls back to Referer. */
export function sameOrigin(req: NextRequest): boolean {
  const host = req.headers.get('host');
  const origin = req.headers.get('origin') ?? req.headers.get('referer');
  if (!host || !origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** 303 See Other so the browser follows a POST with a GET. */
export function seeOther(req: NextRequest, path: string): NextResponse {
  return NextResponse.redirect(new URL(path, req.url), 303);
}

export function text(form: FormData, name: string, max: number): string {
  const v = form.get(name);
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

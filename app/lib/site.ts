/** Site-wide constants and env access. All values are baked at build time. */

export const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN as string | undefined)?.replace(/\/$/, "") ?? "https://harmonia-baila.vercel.app";

export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "";

export const CONTACT_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) ?? "";

export const WEB3FORMS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) ?? "";

export const INSTAGRAM_URL = "https://www.instagram.com/harmonia.baila";
export const INSTAGRAM_HANDLE = "@harmonia.baila";

/** wa.me deep link with a pre-filled message. */
export function waLink(message: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function mailtoLink(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

import { useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { Trans, useTranslation } from "react-i18next";
import { pathFor, type Locale } from "../i18n/routing";
import { breadcrumbJsonLd, metaFor, studioJsonLd } from "../lib/seo";
import { CONTACT_EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, mailtoLink, waLink, WEB3FORMS_KEY } from "../lib/site";
import { Reveal } from "../components/Reveal";
import { RuffleDivider } from "../components/RuffleDivider";
import { JsonLd } from "../components/JsonLd";

export const meta = metaFor("contact");

type Status = "idle" | "submitting" | "success" | "error";
const THROTTLE_MS = 60_000;
const THROTTLE_KEY = "hb-last-submit";

export default function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: bots fill the invisible field → pretend success, send nothing.
    if ((data.get("website") as string)?.length) {
      setStatus("success");
      return;
    }

    const name = (data.get("name") as string)?.trim() ?? "";
    const email = (data.get("email") as string)?.trim() ?? "";
    const message = (data.get("message") as string)?.trim() ?? "";
    const consent = data.get("consent") === "on";

    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = t("contact.form.validation.nameRequired");
    if (!email) nextErrors.email = t("contact.form.validation.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) nextErrors.email = t("contact.form.validation.emailInvalid");
    if (!message) nextErrors.message = t("contact.form.validation.messageRequired");
    if (!consent) nextErrors.consent = t("contact.form.validation.consentRequired");

    // Basic client-side throttle against accidental double-sends.
    try {
      const last = Number(localStorage.getItem(THROTTLE_KEY) ?? 0);
      if (Date.now() - last < THROTTLE_MS) nextErrors.throttle = t("contact.form.validation.throttled");
    } catch {
      /* storage unavailable */
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (!WEB3FORMS_KEY) {
      // No endpoint configured yet → guide the visitor to the direct channels.
      setStatus("error");
      statusRef.current?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Harmonia Baila — ${name}`,
          from_name: "harmoniabaila.com",
          name,
          email,
          phone: (data.get("phone") as string)?.trim() ?? "",
          interest: data.get("interest"),
          message,
          consent: "authorized",
          language: locale,
        }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error("submit failed");
      try {
        localStorage.setItem(THROTTLE_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      statusRef.current?.focus();
    }
  }

  const inputCls =
    "w-full rounded-xl border-2 border-noche/20 bg-crudo px-4 py-3 text-noche placeholder:text-noche/45 focus:border-fucsia";
  const labelCls = "block text-sm font-bold uppercase tracking-wide";
  const errCls = "mt-1.5 text-sm font-semibold text-fucsia-deep";

  return (
    <>
      <JsonLd
        data={[
          studioJsonLd(locale),
          breadcrumbJsonLd(locale, [
            { name: t("nav.home"), path: pathFor("home", locale) },
            { name: t("nav.contact"), path: pathFor("contact", locale) },
          ]),
        ]}
      />

      <section className="field-noche pt-32 sm:pt-36">
        <div className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">
          <Reveal>
            <h1 className="display text-5xl sm:text-7xl">{t("contact.heading")}</h1>
            <p className="lead muted mt-6 max-w-2xl">{t("contact.intro")}</p>
          </Reveal>
          <Reveal beats={2} className="mt-8 flex flex-wrap items-center gap-5 pb-16">
            <a
              href={waLink(t("whatsapp.prefill"))}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-wa px-8 py-4 text-lg font-bold text-noche transition-transform hover:scale-105 motion-reduce:transition-none"
            >
              {t("contact.waCta")}
            </a>
            <div>
              <p className="font-bold">{t("contact.waHeading")}</p>
              <p className="muted text-sm">{t("contact.waBody")}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="field-crudo" aria-labelledby="form-heading">
        <RuffleDivider from="noche" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[3fr_2fr]">
          <div>
            <Reveal>
              <h2 id="form-heading" className="display text-3xl sm:text-4xl">
                {t("contact.formHeading")}
              </h2>
            </Reveal>

            <div ref={statusRef} tabIndex={-1} aria-live="polite" className="mt-6 focus:outline-none">
              {status === "success" && (
                <div className="rounded-2xl bg-mar/20 p-6">
                  <h3 className="display-mid text-xl">{t("contact.form.success.title")}</h3>
                  <p className="mt-2">{t("contact.form.success.body")}</p>
                </div>
              )}
              {status === "error" && (
                <div className="rounded-2xl bg-fucsia/15 p-6">
                  <h3 className="display-mid text-xl">{t("contact.form.error.title")}</h3>
                  <p className="mt-2">{t("contact.form.error.body")}</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <a href={waLink(t("whatsapp.prefill"))} target="_blank" rel="noopener noreferrer" className="font-bold text-fucsia-deep underline underline-offset-4">
                      {t("contact.form.error.waFallback")}
                    </a>
                    {CONTACT_EMAIL && (
                      <a href={mailtoLink("Harmonia Baila")} className="font-bold text-fucsia-deep underline underline-offset-4">
                        {t("contact.form.error.mailFallback")}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {status !== "success" && (
              <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
                {/* Honeypot — visually hidden, ignored by humans */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div>
                  <label htmlFor="name" className={labelCls}>
                    {t("contact.form.name")}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={t("contact.form.namePlaceholder")}
                    className={`${inputCls} mt-2`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                  {errors.name && (
                    <p id="err-name" className={errCls}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className={labelCls}>
                      {t("contact.form.email")}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder={t("contact.form.emailPlaceholder")}
                      className={`${inputCls} mt-2`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                    />
                    {errors.email && (
                      <p id="err-email" className={errCls}>
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelCls}>
                      {t("contact.form.phone")}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder={t("contact.form.phonePlaceholder")}
                      className={`${inputCls} mt-2`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="interest" className={labelCls}>
                    {t("contact.form.interest")}
                  </label>
                  <select id="interest" name="interest" className={`${inputCls} mt-2`} defaultValue="group">
                    <option value="group">{t("contact.form.interestOptions.group")}</option>
                    <option value="private">{t("contact.form.interestOptions.private")}</option>
                    <option value="kids">{t("contact.form.interestOptions.kids")}</option>
                    <option value="other">{t("contact.form.interestOptions.other")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={labelCls}>
                    {t("contact.form.message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder={t("contact.form.messagePlaceholder")}
                    className={`${inputCls} mt-2`}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "err-message" : undefined}
                  />
                  {errors.message && (
                    <p id="err-message" className={errCls}>
                      {errors.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-start gap-3">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      className="mt-1 h-5 w-5 shrink-0 accent-fucsia"
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? "err-consent" : undefined}
                    />
                    <label htmlFor="consent" className="text-sm leading-relaxed">
                      <Trans
                        i18nKey="contact.form.consentLabel"
                        components={{
                          policyLink: (
                            <Link to={pathFor("dataPolicy", locale)} className="font-bold underline underline-offset-2" />
                          ),
                        }}
                      />
                    </label>
                  </div>
                  {errors.consent && (
                    <p id="err-consent" className={errCls}>
                      {errors.consent}
                    </p>
                  )}
                </div>

                {errors.throttle && <p className={errCls}>{errors.throttle}</p>}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="rounded-full bg-fucsia px-8 py-4 text-lg font-bold text-crudo transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 motion-reduce:transition-none"
                >
                  {status === "submitting" ? t("contact.form.submitting") : t("contact.form.submit")}
                </button>
              </form>
            )}
          </div>

          <aside className="self-start md:sticky md:top-24">
            <Reveal>
              <h2 className="display-mid text-2xl">{t("contact.info.heading")}</h2>
              <address className="mt-4 space-y-2 not-italic">
                <p className="font-bold">{t("contact.info.cityLine")}</p>
                <p className="muted text-sm">{t("contact.info.addressNote")}</p>
              </address>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 font-bold text-fucsia-deep underline underline-offset-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" />
                </svg>
                {t("contact.info.igLabel")} — {INSTAGRAM_HANDLE}
              </a>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}

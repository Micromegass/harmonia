import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { pathFor, type Locale } from "../i18n/routing";
import { breadcrumbJsonLd, metaFor } from "../lib/seo";
import { waLink } from "../lib/site";
import { Reveal } from "../components/Reveal";
import { RuffleDivider } from "../components/RuffleDivider";
import { JsonLd } from "../components/JsonLd";

export const meta = metaFor("schedule");

/** Reference schedule — placeholder until the client confirms real times
 *  (flagged in DECISIONS.md; the page says so via schedule.disclaimer). */
const WEEK: { day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat"; slots: { time: string; slot: string }[] }[] = [
  { day: "mon", slots: [{ time: "5:00 pm", slot: "kidsAfternoon" }, { time: "6:30 pm", slot: "salsaBeginner" }, { time: "8:00 pm", slot: "salsaInter" }] },
  { day: "tue", slots: [{ time: "6:30 pm", slot: "bachataBeginner" }, { time: "8:00 pm", slot: "bachataInter" }] },
  { day: "wed", slots: [{ time: "5:00 pm", slot: "kidsAfternoon" }, { time: "6:30 pm", slot: "urbano" }, { time: "8:00 pm", slot: "salsaBeginner" }] },
  { day: "thu", slots: [{ time: "6:30 pm", slot: "contemporaneo" }, { time: "8:00 pm", slot: "bachataBeginner" }] },
  { day: "fri", slots: [{ time: "6:30 pm", slot: "tropical" }, { time: "8:00 pm", slot: "salsaInter" }] },
  { day: "sat", slots: [{ time: "10:00 am", slot: "kidsAfternoon" }, { time: "11:30 am", slot: "salsaBeginner" }, { time: "2:00 pm", slot: "private" }] },
];

export default function Schedule() {
  const { t } = useTranslation();
  const location = useLocation();
  const locale: Locale = location.pathname.startsWith("/en") ? "en" : "es";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t("nav.home"), path: pathFor("home", locale) },
          { name: t("nav.schedule"), path: pathFor("schedule", locale) },
        ])}
      />
      <section className="field-noche pt-32 sm:pt-36">
        <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
          <Reveal>
            <h1 className="display text-5xl sm:text-7xl">{t("schedule.heading")}</h1>
            <p className="lead muted mt-6 max-w-2xl">{t("schedule.intro")}</p>
            <p className="mt-4 inline-block rounded-full bg-lima/15 px-4 py-2 text-sm font-semibold text-lima">
              {t("schedule.disclaimer")}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WEEK.map(({ day, slots }, i) => (
              <Reveal key={day} beats={i}>
                <section aria-labelledby={`day-${day}`} className="h-full rounded-2xl bg-noche-2 p-6">
                  <h2 id={`day-${day}`} className="display-mid text-2xl text-lima">
                    {t(`schedule.days.${day}`)}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {slots.map(({ time, slot }) => (
                      <li key={time} className="flex items-baseline justify-between gap-3 border-b border-crudo/10 pb-3 last:border-0 last:pb-0">
                        <span className="font-bold tabular-nums">{time}</span>
                        <span className="muted text-right text-sm">{t(`schedule.slots.${slot}`)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <p className="muted max-w-xl leading-relaxed">{t("schedule.privateNote")}</p>
          </Reveal>
        </div>
      </section>

      <section className="field-petrol">
        <RuffleDivider from="noche" />
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-16">
          <Reveal>
            <h2 className="display text-3xl sm:text-4xl">{t("schedule.ctaHeading")}</h2>
          </Reveal>
          <Reveal beats={2} className="mt-7">
            <a
              href={waLink(t("whatsapp.prefill"))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-noche px-8 py-4 text-lg font-bold text-crudo transition-transform hover:scale-105 active:scale-95 motion-reduce:transition-none"
            >
              {t("schedule.cta")}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

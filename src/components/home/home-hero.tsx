import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

interface HomeHeroProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Full-bleed startup-style homepage hero (shadcn/Magic UI hero-block pattern).
 * The glow is a radial gradient whose ellipse is centered *above* the viewport
 * (`at 50% -30%`), so the light appears to emanate from behind the sticky
 * header and fades out smoothly — nothing is ever clipped, unlike a blurred
 * halo inside an `overflow-hidden` box. A masked dot grid adds texture that
 * dissolves before the content ends. Both layers derive from theme tokens
 * (`--color-primary`, `--color-border`) so light and dark mode both work.
 */
export function HomeHero({ locale, dict }: HomeHeroProps) {
  const { hero } = dict.home;

  return (
    <section className="relative isolate">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_50%_-30%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] bg-[size:22px_22px] opacity-40 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_-5%,black_25%,transparent_75%)]"
      />

      <div className="mx-auto max-w-3xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pb-16 sm:pt-24">
        <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
          {hero.titleLead}{" "}
          <span className="text-primary">{hero.titleHighlight}</span>{" "}
          {hero.titleTail}
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          {hero.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="shadow-md shadow-primary/20">
            <Link href={`/${locale}/tools`}>
              <Compass className="size-4" aria-hidden="true" />
              {hero.ctaTools}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-background/60 backdrop-blur-sm"
          >
            <Link href={`/${locale}/transparency`}>
              {hero.ctaTransparency}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <p className="mt-9 text-sm font-medium text-muted-foreground">
          {hero.stats}
        </p>
      </div>
    </section>
  );
}

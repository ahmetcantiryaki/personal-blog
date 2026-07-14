import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryChips } from "@/components/blog/category-chips";
import { FeaturedPost } from "@/components/blog/featured-post";
import { LoadMorePosts } from "@/components/blog/load-more-posts";
import { PostGrid } from "@/components/blog/post-grid";
import { HomeHero } from "@/components/home/home-hero";
import { HomeShowcase } from "@/components/home/home-showcase";
import { JsonLd } from "@/components/seo/json-ld";
import { getDictionary } from "@/i18n";
import { isLocale, LOCALES, type Locale } from "@/i18n/config";
import { websiteJsonLd } from "@/lib/json-ld";
import { getFeaturedPost, listPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";
import { listCategories } from "@/lib/taxonomy";
import { routes } from "@/lib/routes";

export const revalidate = 300;

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    title: dict.tagline,
    description: dict.tagline,
    paths: Object.fromEntries(
      LOCALES.map((l) => [l, routes.home(l)]),
    ) as Record<Locale, string>,
    type: "website",
  });
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  // The newest post is the featured hero. It is excluded from the grid so the
  // grid is a consistent window over the remaining posts — no post duplicated.
  // The home feed grows downward (progressive "load more"); there are no
  // ?page= URLs here, so any legacy ?page param is simply ignored (batch 1).
  const [featuredPost, categories] = await Promise.all([
    getFeaturedPost(locale),
    listCategories(locale),
  ]);

  const { posts: gridPosts, totalPages } = await listPosts({
    locale,
    page: 1,
    excludeId: featuredPost?.id,
  });

  const featured = featuredPost;

  return (
    <>
      <JsonLd data={websiteJsonLd(locale, routes.search(locale))} />
      {/* Full-bleed hero — its glow backdrop must run edge-to-edge and flow
          from under the sticky header, so it lives outside the container. */}
      <HomeHero locale={locale} dict={dict} />

      <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 sm:pb-14">
        <div className="mb-10">
          <CategoryChips
            categories={categories}
            locale={locale}
            dict={dict}
            activeSlug={null}
          />
        </div>

        {featured ? (
          <section aria-label={dict.home.featured} className="mb-14">
            <FeaturedPost post={featured} locale={locale} dict={dict} />
          </section>
        ) : null}

        <HomeShowcase
          locale={locale}
          dict={dict}
          listenHref={
            featured ? routes.post(locale, featured.slug ?? "") : undefined
          }
        />

        <section aria-label={dict.home.latest}>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {dict.home.latest}
          </h2>
          <PostGrid posts={gridPosts} locale={locale} dict={dict} />
          <LoadMorePosts
            locale={locale}
            excludeId={featuredPost?.id ?? undefined}
            initialHasMore={totalPages > 1}
            labels={{
              loadMore: dict.home.loadMore,
              loading: dict.home.loading,
            }}
          />
        </section>
      </div>
    </>
  );
}

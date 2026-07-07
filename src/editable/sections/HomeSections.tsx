import Link from 'next/link'
import { ArrowLeft, ArrowRight, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'
const fallbackImage = '/placeholder.svg?height=900&width=1400'

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
}

function getExcerpt(post?: SitePost | null, limit = 155) {
  const content = getContent(post)
  const raw = (typeof content.description === 'string' && content.description) || (typeof content.summary === 'string' && content.summary) || post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null, fallback = 'Article') {
  const content = getContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function allPosts(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function FeaturedCard({ post, href }: { post?: SitePost; href: string }) {
  const image = post ? getEditablePostImage(post) : fallbackImage
  return (
    <Link href={post ? href : '/article'} className="group grid overflow-hidden rounded-xl bg-white shadow-[0_28px_80px_rgba(16,10,79,0.12)] md:grid-cols-2">
      <div className="relative h-[280px] overflow-hidden bg-[var(--slot4-media-bg)] sm:h-[340px] lg:h-[390px]">
        <img src={image} alt={post?.title || ''} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{categoryOf(post, 'Featured')}</p>
        <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[var(--slot4-page-text)] sm:text-4xl">{post?.title || 'Fresh perspectives for curious readers'}</h2>
        <p className="mt-5 max-w-md text-base font-semibold leading-8 text-[var(--slot4-muted-text)]">
          {post ? getExcerpt(post, 170) : 'Read practical ideas, profiles, guides, and field notes from across the community.'}
        </p>
      
      </div>
    </Link>
  )
}

function OverlayStoryCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative block min-h-[210px] overflow-hidden rounded-xl bg-[var(--slot4-dark-bg)] shadow-[0_18px_44px_rgba(16,10,79,0.12)]">
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,85,0.92),rgba(18,13,85,0.38))]" />
      <div className="relative flex min-h-[210px] items-end p-7">
        <h3 className="max-w-md text-2xl font-extrabold leading-tight text-white sm:text-3xl">{post.title}</h3>
      </div>
    </Link>
  )
}

function CompactCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block w-full overflow-hidden rounded-lg bg-white shadow-[0_18px_42px_rgba(16,10,79,0.09)] transition duration-300 hover:-translate-y-1">
      <div className="h-52 overflow-hidden bg-[var(--slot4-media-bg)] sm:h-56 xl:h-60">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-lg font-extrabold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}

function HorizontalCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-lg bg-white shadow-[0_16px_42px_rgba(16,10,79,0.08)] transition duration-300 hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="p-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')} / {categoryOf(post)}</p>
        <h3 className="mt-3 line-clamp-2 text-xl font-extrabold leading-tight text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm font-semibold leading-7 text-[var(--slot4-muted-text)]">{getExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-5 border-b border-[var(--editable-border)] py-5">
      <span className="mt-1 text-3xl font-extrabold text-[var(--slot4-accent)]/35">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{categoryOf(post)}</p>
        <h3 className="mt-2 text-xl font-extrabold leading-snug text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

function ProfileTile({ post, href }: { post: SitePost; href: string }) {
  const content = getContent(post)
  const role = typeof content.role === 'string' ? content.role : typeof content.company === 'string' ? content.company : categoryOf(post, 'Profile')
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-lg bg-white p-5 shadow-[0_16px_42px_rgba(16,10,79,0.08)] transition duration-300 hover:-translate-y-1">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-lg font-extrabold text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-1 truncate text-sm font-semibold text-[var(--slot4-muted-text)]">{role}</p>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const featured = pool[0]
  return (
    <section className="bg-white">
      <div className={`${container} py-14 sm:py-20`}>
        <div className="max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{pagesContent.home.hero.badge}</p>
          <h1 className="mt-8 max-w-3xl text-5xl font-extrabold leading-[1.08] text-[var(--slot4-page-text)] sm:text-6xl lg:text-7xl">
            {pagesContent.home.hero.title.join(' ')}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
        </div>
        <form action="/search" className="editable-hero-float mt-10 flex max-w-2xl overflow-hidden rounded-full bg-white shadow-[0_18px_55px_rgba(16,10,79,0.13)]">
          <label className="flex min-w-0 flex-1 items-center gap-3 px-5">
            <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
            <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-4 text-sm font-bold text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]" />
          </label>
          <button className="bg-[var(--slot4-accent)] px-6 text-sm font-extrabold text-white sm:px-8">Search</button>
        </form>
        <div className="mt-12">
          <FeaturedCard post={featured} href={featured ? postHref(primaryTask, featured, primaryRoute) : primaryRoute} />
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections).slice(1, 5)
  if (!pool.length) return null
  return (
    <section className="bg-white">
      <div className={`${container} py-10`}>
        <div className="grid gap-6 md:grid-cols-2">
          {pool.slice(0, 2).map((post) => <OverlayStoryCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const rail = pool.slice(2, 10)
  const list = pool.slice(10, 14)
  if (!pool.length) return null
  return (
    <section className="overflow-hidden bg-white">
      <div className={`${container} py-16`}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold text-[var(--slot4-page-text)]">Free e-learning</h2>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-[var(--slot4-muted-text)]">Guides, useful resources for readers, professionals, students, and researchers.</p>
          </div>
          <Link href={primaryRoute} className="hidden items-center gap-2 text-base font-extrabold text-[var(--slot4-accent)] sm:inline-flex">View all {taskLabel(primaryTask).toLowerCase()} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {rail.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rail.map((post) => <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
        ) : null}
        {list.length ? (
          <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-xl bg-[var(--slot4-dark-bg)] p-7 text-white">
              <Sparkles className="h-8 w-8 text-[var(--slot4-accent)]" />
              <h2 className="mt-5 text-3xl font-extrabold leading-tight">Ideas and profiles that help people keep moving.</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/70">Browse practical reading, professional perspectives, and community-focused stories from {SITE_CONFIG.name}.</p>
            </div>
            <div>
              {list.map((post, index) => <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = allPosts(posts, timeSections)
  const events = pool.slice(4, 8)
  const profiles = pool.slice(8, 12)
  if (!pool.length) return null
  return (
    <>
      <section className="bg-[var(--slot4-dark-bg)] py-16 text-white">
        <div className={container}>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-4xl font-extrabold">Training, events & opportunities</h2>
            <Link href={primaryRoute} className="hidden items-center gap-2 font-extrabold text-[var(--slot4-accent)] sm:inline-flex">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((post, index) => <HorizontalCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
          </div>
          <div className="mt-9 flex justify-center gap-4">
            <ArrowLeft className="h-10 w-10 text-white/35" />
            <ArrowRight className="h-10 w-10 text-white" />
          </div>
        </div>
      </section>
      <section className="bg-white py-16">
        <div className={container}>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-4xl font-extrabold text-[var(--slot4-page-text)]">Case studies</h2>
            <Link href="/profile" className="hidden items-center gap-2 font-extrabold text-[var(--slot4-accent)] sm:inline-flex">View all profiles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(profiles.length ? profiles : pool.slice(0, 4)).map((post) => <ProfileTile key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />)}
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-white">
      <div className={`${container} pb-0 pt-10`}>
        <div className="rounded-t-xl bg-[var(--slot4-accent)] px-8 py-12 text-white sm:px-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em]">Newsletter</p>
              <h2 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight">Get our latest articles, updates and opportunities delivered directly to your inbox.</h2>
            </div>
            <Link href="/signup" className="inline-flex w-fit items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-extrabold text-[var(--slot4-accent)]">Sign up now <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </div>
    </section>
  )
}

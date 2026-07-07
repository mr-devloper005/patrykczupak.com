'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Menu, PlusCircle, UserPlus, LogIn, UserRound, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Search', href: '/search' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const authItems = [
    { label: 'Sign in', href: '/login', icon: LogIn, variant: 'plain' },
    { label: 'Sign up', href: '/signup', icon: UserPlus, variant: 'filled' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)]">
      <nav className="mx-auto flex min-h-[96px] w-full max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3 pr-4">
          <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-14 w-auto object-contain" />
          <span className="hidden text-xl font-extrabold text-[var(--slot4-page-text)] transition group-hover:text-[var(--slot4-accent)] sm:inline-block">
            patrykczupak
          </span>
        </Link>

        <div className="hidden items-stretch gap-0 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center px-4 text-base font-extrabold transition ${
                  active ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                }`}
              >
                {item.label}
                {active ? <span className="absolute inset-x-3 bottom-0 h-[2px] bg-[var(--slot4-accent)]" /> : null}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <span className="hidden max-w-[190px] items-center gap-2 rounded-full bg-[var(--slot4-panel-bg)] px-3 py-2 text-sm font-extrabold text-[var(--slot4-page-text)] sm:inline-flex">
                <UserRound className="h-4 w-4" />
                <span className="truncate">{session.name || session.email}</span>
              </span>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-sm border border-[var(--slot4-accent)] bg-[var(--editable-cta-bg)] px-4 py-2 text-sm font-extrabold text-[var(--editable-cta-text)] transition hover:opacity-90 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-2 px-3 py-2 text-sm font-extrabold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)] sm:inline-flex"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </>
          ) : (
            authItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hidden items-center gap-2 px-3 py-2 text-sm font-extrabold transition sm:inline-flex ${
                    item.variant === 'filled'
                      ? 'rounded-sm border border-[var(--slot4-accent)] bg-[var(--editable-cta-bg)] text-[var(--editable-cta-text)] hover:opacity-90'
                      : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {item.label}
                </Link>
              )
            })
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-sm border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-border)]" />

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--editable-nav-bg)] px-4 py-5 lg:hidden">
          {session ? (
            <p className="mb-4 rounded-sm bg-[var(--slot4-panel-bg)] px-4 py-3 text-sm font-extrabold text-[var(--slot4-page-text)]">
              Signed in as {session.name || session.email}
            </p>
          ) : null}
          <div className="grid gap-1">
            {[...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : authItems)].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`border-l-2 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'border-[var(--slot4-accent)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)]'
                      : 'border-transparent text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-surface-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="border-l-2 border-transparent px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] hover:border-[var(--slot4-accent)]/40 hover:bg-[var(--slot4-surface-bg)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}

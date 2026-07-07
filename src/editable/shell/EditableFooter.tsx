'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Search', href: '/search' },
]

const signedOutFooterLinks = [
  { label: 'Sign in', href: '/login' },
  { label: 'Sign up', href: '/signup' },
]

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.25fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="inline-flex rounded-sm bg-white p-2">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-14 w-auto object-contain" />
            </span>
            <span className="text-2xl font-extrabold text-white">patrykczupak</span>
          </Link>
          <p className="mt-8 max-w-sm text-sm font-semibold leading-7 text-white/65">
            {globalContent.footer?.description || SITE_CONFIG.description}
          </p>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white">Site links</h3>
          <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {[...footerLinks, ...(session ? [] : signedOutFooterLinks)].map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-extrabold text-white transition hover:text-[var(--slot4-accent)]">
                {item.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="text-sm font-extrabold text-white transition hover:text-[var(--slot4-accent)]">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[var(--editable-container)] border-t border-white/15 px-4 py-8 text-center text-xs font-semibold text-white/55 sm:px-6 lg:px-8">
        &copy; {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}

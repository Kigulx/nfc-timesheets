'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { type FormEvent, useState } from 'react'
import { useLocaleSetting } from '@/components/IntlProvider'
import { ApiError, apiFetch } from '@/lib/api'
import type { Locale } from '@/lib/locale'
import { LOGIN_PATH } from '@/lib/nav'
import './product.css'

type TrialState = 'idle' | 'sending' | 'success' | 'invalid' | 'limited' | 'error'

function TapStory() {
  const t = useTranslations('landing')
  return (
    <div className="landing-story" aria-label={t('visualDescription')} role="img">
      <div className="landing-story-grain" aria-hidden="true" />
      <div className="landing-story-caption" aria-hidden="true">
        <span className="landing-story-caption-dot" />
        {t('visualCaption')}
      </div>
      <svg className="landing-story-art" viewBox="0 0 640 480" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id="landingPhone"
            x1="330"
            y1="93"
            x2="486"
            y2="388"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#203A54" />
            <stop offset="1" stopColor="#0C1F33" />
          </linearGradient>
          <linearGradient
            id="landingScreen"
            x1="340"
            y1="116"
            x2="472"
            y2="364"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F6F5F0" />
            <stop offset="1" stopColor="#DDE6DF" />
          </linearGradient>
          <filter id="landingShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <ellipse
          cx="330"
          cy="397"
          rx="208"
          ry="24"
          fill="#0C2534"
          opacity=".23"
          filter="url(#landingShadow)"
        />
        <path
          d="M95 337C125 354 166 362 210 360"
          stroke="#9ADDBD"
          strokeOpacity=".6"
          strokeWidth="2"
          strokeDasharray="4 8"
        />
        <g className="landing-building">
          <rect x="90" y="138" width="190" height="239" rx="20" fill="#F3F0E6" />
          <rect x="105" y="153" width="160" height="207" rx="12" fill="#E3E9E1" />
          <path d="M105 282H265" stroke="#CBD9CE" strokeWidth="2" />
          <path d="M142 153V282M226 153V282" stroke="#CBD9CE" strokeWidth="2" />
          <rect x="126" y="177" width="37" height="59" rx="5" fill="#AACABE" />
          <rect x="207" y="177" width="37" height="59" rx="5" fill="#AACABE" />
          <rect x="169" y="300" width="49" height="60" rx="7" fill="#325D58" />
          <circle cx="209" cy="329" r="3" fill="#D9E7D7" />
          <rect x="224" y="297" width="27" height="29" rx="6" fill="#214A48" />
          <path
            d="M232 308c5-5 10-5 14 0m-11 4c3-3 6-3 8 0"
            stroke="#B8ECCC"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g className="landing-cleaner">
          <path d="M286 251c-13 3-22 13-23 28l-5 73h61l-6-73c-1-15-11-25-27-28Z" fill="#D8EC9E" />
          <path
            d="M272 284 247 302l-8 12m67-29 29 21"
            stroke="#D8EC9E"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="m271 352-5 29m41-29 9 29"
            stroke="#163A3A"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <circle cx="288" cy="224" r="26" fill="#E0B78E" />
          <path
            d="M262 223c-1-22 11-34 27-34 18 0 29 13 25 34-12-1-20-6-25-14-7 9-16 13-27 14Z"
            fill="#163C3B"
          />
          <circle cx="279" cy="226" r="2" fill="#29413B" />
          <circle cx="298" cy="226" r="2" fill="#29413B" />
          <path d="M280 236c5 5 12 5 17 0" stroke="#9B5C43" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="landing-phone">
          <rect x="308" y="66" width="212" height="346" rx="35" fill="#081C2C" />
          <rect x="316" y="74" width="196" height="330" rx="29" fill="url(#landingPhone)" />
          <rect x="329" y="91" width="170" height="296" rx="20" fill="url(#landingScreen)" />
          <rect x="377" y="99" width="74" height="16" rx="8" fill="#0C2032" />
          <circle cx="414" cy="164" r="29" fill="#DAE8DA" />
          <path
            d="m403 164 8 8 15-17"
            stroke="#277958"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="351" y="212" width="126" height="9" rx="4.5" fill="#9FB9B1" />
          <rect x="370" y="231" width="88" height="6" rx="3" fill="#C1D2C7" />
          <rect x="348" y="271" width="132" height="72" rx="12" fill="#F7F8F2" />
          <rect x="361" y="285" width="62" height="5" rx="2.5" fill="#ADC1B3" />
          <rect x="361" y="301" width="88" height="8" rx="4" fill="#324F4B" />
          <rect x="361" y="318" width="75" height="5" rx="2.5" fill="#AEC3B7" />
          <circle cx="414" cy="393" r="3" fill="#708486" />
        </g>
        <g className="landing-tap-pulse">
          <circle cx="238" cy="311" r="33" stroke="#B1EEC8" strokeWidth="3" />
          <circle cx="238" cy="311" r="47" stroke="#B1EEC8" strokeOpacity=".45" strokeWidth="2" />
        </g>
        <g className="landing-spark">
          <path d="m276 230 7 12 13 4-13 4-7 12-5-12-13-4 13-4 5-12Z" fill="#D4F0C8" />
        </g>
      </svg>
      <div className="landing-story-status" aria-hidden="true">
        <span className="landing-story-check">✓</span>
        <span>
          <strong>{t('visualStatus')}</strong>
          <small>{t('visualSubstatus')}</small>
        </span>
      </div>
    </div>
  )
}

export default function ProductPage() {
  const t = useTranslations('landing')
  const locale = useLocale()
  const { setLocale } = useLocaleSetting()
  const [state, setState] = useState<TrialState>('idle')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    setState('sending')
    try {
      await apiFetch<{ ok: true }>('/public/trial-requests', {
        method: 'POST',
        body: {
          email: String(values.get('email') ?? '').trim(),
          company: String(values.get('company') ?? '').trim(),
          locale,
        },
      })
      form.reset()
      setState('success')
    } catch (cause) {
      if (cause instanceof ApiError && (cause.status === 400 || cause.status === 422))
        setState('invalid')
      else if (cause instanceof ApiError && cause.status === 429) setState('limited')
      else setState('error')
    }
  }

  return (
    <div className="landing">
      <a className="landing-skip" href="#landing-main">
        {t('skip')}
      </a>
      <header className="landing-header">
        <a href="#top" className="landing-logo" aria-label={t('brandHome')}>
          <span className="landing-logo-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            NFC <strong>TimeSheets</strong>
          </span>
        </a>
        <nav className="landing-nav" aria-label={t('navLabel')}>
          <a href="#how">{t('navHow')}</a>
          <a href="#benefits">{t('navBenefits')}</a>
          <a href="#pricing">{t('navPricing')}</a>
        </nav>
        <div className="landing-header-actions">
          <label className="landing-locale-label" htmlFor="landing-locale">
            {t('language')}
          </label>
          <select
            id="landing-locale"
            className="landing-locale"
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
          >
            <option value="de">DE</option>
            <option value="en">EN</option>
          </select>
          <Link className="landing-login" href={LOGIN_PATH}>
            {t('login')}
          </Link>
        </div>
      </header>

      <main id="landing-main" tabIndex={-1}>
        <section className="landing-hero" id="top" aria-labelledby="landing-title">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">
              <span />
              {t('eyebrow')}
            </p>
            <h1 id="landing-title">{t('heroTitle')}</h1>
            <p className="landing-hero-lede">{t('heroLead')}</p>
            <div className="landing-hero-actions">
              <a href="#trial" className="landing-button landing-button-primary">
                {t('heroCta')} <span aria-hidden="true">↗</span>
              </a>
              <a href="#how" className="landing-text-link">
                {t('heroSecondary')} <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="landing-proof">
              <span className="landing-proof-icon" aria-hidden="true">
                ✓
              </span>
              {t('proof')}
            </div>
          </div>
          <TapStory />
        </section>

        <section
          className="landing-process landing-section"
          id="how"
          aria-labelledby="landing-how-title"
        >
          <div className="landing-section-intro">
            <p className="landing-kicker">{t('howKicker')}</p>
            <h2 id="landing-how-title">{t('howTitle')}</h2>
            <p>{t('howLead')}</p>
          </div>
          <div className="landing-steps">
            <article className="landing-step">
              <span className="landing-step-number">01</span>
              <span className="landing-step-symbol" aria-hidden="true">
                ⌁
              </span>
              <h3>{t('step1Title')}</h3>
              <p>{t('step1Body')}</p>
            </article>
            <article className="landing-step">
              <span className="landing-step-number">02</span>
              <span className="landing-step-symbol" aria-hidden="true">
                ◉
              </span>
              <h3>{t('step2Title')}</h3>
              <p>{t('step2Body')}</p>
            </article>
            <article className="landing-step">
              <span className="landing-step-number">03</span>
              <span className="landing-step-symbol" aria-hidden="true">
                ▤
              </span>
              <h3>{t('step3Title')}</h3>
              <p>{t('step3Body')}</p>
            </article>
          </div>
        </section>

        <section
          className="landing-benefits landing-section"
          id="benefits"
          aria-labelledby="landing-benefits-title"
        >
          <div className="landing-benefits-copy">
            <p className="landing-kicker">{t('benefitsKicker')}</p>
            <h2 id="landing-benefits-title">{t('benefitsTitle')}</h2>
            <p>{t('benefitsLead')}</p>
            <ul className="landing-benefit-list">
              <li>
                <span aria-hidden="true">✓</span>
                {t('benefit1')}
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                {t('benefit2')}
              </li>
              <li>
                <span aria-hidden="true">✓</span>
                {t('benefit3')}
              </li>
            </ul>
          </div>
          <div className="landing-dashboard" aria-label={t('dashboardA11y')} role="img">
            <div className="landing-dashboard-head">
              <span>{t('dashboardTitle')}</span>
              <small>{t('dashboardExample')}</small>
            </div>
            <div className="landing-dashboard-cards">
              <div>
                <small>{t('dashboardHours')}</small>
                <strong>
                  124,5 <em>h</em>
                </strong>
                <span>{t('dashboardMonth')}</span>
              </div>
              <div>
                <small>{t('dashboardPeople')}</small>
                <strong>8</strong>
                <span>{t('dashboardActive')}</span>
              </div>
            </div>
            <div className="landing-chart" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="landing-dashboard-foot">
              <span className="landing-green-dot" />
              {t('dashboardFoot')}
            </div>
          </div>
        </section>

        <section
          className="landing-pricing landing-section"
          id="pricing"
          aria-labelledby="landing-pricing-title"
        >
          <div className="landing-section-intro">
            <p className="landing-kicker">{t('pricingKicker')}</p>
            <h2 id="landing-pricing-title">{t('pricingTitle')}</h2>
            <p>{t('pricingLead')}</p>
          </div>
          <div className="landing-price-card">
            <div className="landing-price-main">
              <span className="landing-price-label">{t('pricingPlan')}</span>
              <p>
                <strong>€300</strong>
                <span>{t('pricingPeriod')}</span>
              </p>
            </div>
            <div className="landing-price-details">
              <span className="landing-free-badge">{t('pricingFree')}</span>
              <ul>
                <li>{t('pricingUsers')}</li>
                <li>{t('pricingIncluded')}</li>
                <li>{t('pricingExtra')}</li>
              </ul>
              <a className="landing-button landing-button-primary" href="#trial">
                {t('pricingCta')} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="landing-trial landing-section"
          id="trial"
          aria-labelledby="landing-trial-title"
        >
          <div>
            <p className="landing-kicker">{t('trialKicker')}</p>
            <h2 id="landing-trial-title">{t('trialTitle')}</h2>
            <p>{t('trialLead')}</p>
          </div>
          <form className="landing-trial-form" onSubmit={submit}>
            <div className="landing-form-grid">
              <label htmlFor="trial-company">
                {t('companyLabel')}
                <input
                  id="trial-company"
                  name="company"
                  required
                  maxLength={200}
                  autoComplete="organization"
                  placeholder={t('companyPlaceholder')}
                  disabled={state === 'sending'}
                />
              </label>
              <label htmlFor="trial-email">
                {t('emailLabel')}
                <input
                  id="trial-email"
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  autoComplete="email"
                  placeholder={t('emailPlaceholder')}
                  disabled={state === 'sending'}
                />
              </label>
            </div>
            <button
              className="landing-button landing-button-dark"
              type="submit"
              disabled={state === 'sending'}
            >
              {state === 'sending' ? t('sending') : t('submit')} <span aria-hidden="true">↗</span>
            </button>
            <p className="landing-form-note">{t('formNote')}</p>
            {state === 'success' && (
              <p className="landing-form-message landing-form-success" role="status">
                {t('success')}
              </p>
            )}
            {state === 'invalid' && (
              <p className="landing-form-message landing-form-error" role="alert">
                {t('invalid')}
              </p>
            )}
            {state === 'limited' && (
              <p className="landing-form-message landing-form-error" role="alert">
                {t('limited')}
              </p>
            )}
            {state === 'error' && (
              <p className="landing-form-message landing-form-error" role="alert">
                {t('error')}
              </p>
            )}
          </form>
        </section>
      </main>
      <footer className="landing-footer">
        <span>
          NFC <strong>TimeSheets</strong>
        </span>
        <span>{t('footer')}</span>
        <a href="#top">{t('backTop')} ↑</a>
      </footer>
    </div>
  )
}

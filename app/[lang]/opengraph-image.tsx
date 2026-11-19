import { ImageResponse } from 'next/og';
import { i18n } from '../../i18n-config';
import { getDictionary } from '../get-dictionary';
import { site } from '../site';

export const alt = `${site.firstName} ${site.lastName} · Senior Full-stack Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

const ACCENT = '#34d399';

/** Social card: name, title, stats and the dashboard builder's pipeline. */
export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const d = await getDictionary(lang === 'pt' ? 'pt' : 'en');
  const pipeline = ['Fields', 'Malloy', 'TanStack Query', 'Vega', 'Widget'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#0a0e13',
          color: '#e9eef3',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 24, letterSpacing: 4, color: ACCENT, textTransform: 'uppercase' }}>
            {d.hero.eyebrow}
          </div>
          <div style={{ display: 'flex', fontSize: 88, fontWeight: 700, marginTop: 24, lineHeight: 1 }}>
            {site.firstName} {site.lastName}
          </div>
          <div style={{ display: 'flex', fontSize: 30, marginTop: 24, color: '#c3ced8', maxWidth: 1000, lineHeight: 1.35 }}>
            {d.hero.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {pipeline.map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {index > 0 ? <div style={{ display: 'flex', color: ACCENT, fontSize: 26 }}>→</div> : null}
              <div
                style={{
                  display: 'flex',
                  border: `2px solid ${ACCENT}66`,
                  background: `${ACCENT}14`,
                  borderRadius: 12,
                  padding: '10px 18px',
                  fontSize: 22,
                  color: ACCENT,
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', borderTop: '2px solid #1f2a35', paddingTop: 28 }}>
          {d.hero.stats.slice(0, 3).map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', marginRight: 56 }}>
              <div style={{ display: 'flex', fontSize: 48, fontWeight: 700 }}>{stat.value}</div>
              <div style={{ display: 'flex', fontSize: 18, letterSpacing: 2, color: '#8fa0ae', textTransform: 'uppercase', marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', marginLeft: 'auto', alignSelf: 'flex-end', fontSize: 20, whiteSpace: 'nowrap', color: '#8fa0ae' }}>
            vinicius-albuquerque.com.br
          </div>
        </div>
      </div>
    ),
    size,
  );
}

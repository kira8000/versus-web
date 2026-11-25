import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { dateLabel, getEdition } from '@/lib/api';
import { bracketFromMatches, phaseLabel, type PublicMatch } from '@/lib/bracket';

export const revalidate = 300;

// Nenhuma pré-gerada (são muitas e crescem): cada uma é gerada no primeiro acesso e fica em cache.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<'/e/[id]'>): Promise<Metadata> {
  const e = await getEdition((await params).id);
  if (!e) return { title: 'Edição não encontrada' };
  const title = `${e.name} · ${e.organization.name}`;
  const description = e.champion ? `Campeão: ${e.champion} · ${dateLabel(e.eventDate)}` : dateLabel(e.eventDate);
  return { title, description, openGraph: { title, description } };
}

export default async function EditionPage({ params }: PageProps<'/e/[id]'>) {
  const e = await getEdition((await params).id);
  if (!e) notFound();
  const bracket = bracketFromMatches(e.matches);

  return (
    <main className="wrap">
      <p>
        <Link className="link" href={`/b/${e.organization.slug}`}>
          {e.organization.name}
        </Link>
      </p>
      <h1>{e.name}</h1>
      <p className="muted">{dateLabel(e.eventDate)}</p>
      {e.champion ? <p className="display champion">🏆 {e.champion}</p> : null}

      {bracket ? (
        <div className="bracket" aria-label="Chave da edição">
          {bracket.columns.map((col) => (
            <section key={col.phase} className="phase">
              <h3>{phaseLabel(col.phase)}</h3>
              <div className="matches">
                {col.matches.map((m) => (
                  <MatchBox key={`${m.phase}${m.sortOrder}`} m={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        // Palco antigo (repescagem, fase "primeira"): lista, sem desenhar chave errada.
        <ul className="list">
          {[...e.matches]
            .sort((x, y) => x.phase.localeCompare(y.phase) || x.sortOrder - y.sortOrder)
            .map((m) => (
              <li key={`${m.phase}${m.sortOrder}`} className="row">
                <span className="muted" style={{ minWidth: 110 }}>
                  {phaseLabel(m.phase)}
                </span>
                <span>{`${m.a ?? '—'} ${m.scoreA} × ${m.scoreB} ${m.b ?? '—'}`}</span>
              </li>
            ))}
        </ul>
      )}
    </main>
  );
}

function MatchBox({ m }: { m: PublicMatch }) {
  const side = (name: string | null) => (!m.winner ? undefined : name === m.winner ? 'win' : 'lose');
  return (
    <div className="match">
      <div className={`slot ${side(m.a) ?? ''}`}>
        <span>{m.a ?? '—'}</span>
        <span>{m.scoreA}</span>
      </div>
      <div className={`slot ${side(m.b) ?? ''}`}>
        <span>{m.b ?? '—'}</span>
        <span>{m.scoreB}</span>
      </div>
    </div>
  );
}

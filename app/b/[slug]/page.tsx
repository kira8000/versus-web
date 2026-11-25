import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { dateLabel, getOrganization, listOrganizations, mapUrl } from '@/lib/api';

export const revalidate = 300;

// Pré-gera as batalhas que existem no build; novas são geradas no primeiro acesso.
export async function generateStaticParams() {
  return (await listOrganizations()).map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<'/b/[slug]'>): Promise<Metadata> {
  const page = await getOrganization((await params).slug);
  if (!page) return { title: 'Batalha não encontrada' };
  const { organization: o } = page;
  const description = [o.city, o.scheduleText, o.address].filter(Boolean).join(' · ');
  return { title: o.name, description, openGraph: { title: o.name, description } };
}

export default async function OrganizationPage({ params }: PageProps<'/b/[slug]'>) {
  const page = await getOrganization((await params).slug);
  if (!page) notFound();
  const { organization: o, ranking, editions } = page;

  return (
    <main className="wrap">
      <h1>{o.name}</h1>
      <p className="muted">{o.city}</p>
      {o.scheduleText ? <p>{o.scheduleText}</p> : null}
      {o.address ? (
        <p className="row">
          <span>{o.address}</span>
          <a className="link" href={mapUrl(o)} target="_blank" rel="noopener noreferrer">
            ver no mapa
          </a>
        </p>
      ) : null}

      <h2 className="section">Ranking</h2>
      {ranking.length === 0 ? (
        <p className="muted">Sem ranking ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>MC</th>
              <th className="num">Vitórias</th>
              <th className="num">Títulos</th>
              <th className="num">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.slice(0, 20).map((r) => (
              <tr key={r.name}>
                <td className={r.rank === 1 ? 'champion' : undefined}>{r.rank}</td>
                <td>{r.name}</td>
                <td className="num">{r.wins}</td>
                <td className="num">{r.titles}</td>
                <td className="num">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 className="section">Edições</h2>
      {editions.length === 0 ? <p className="muted">Nenhuma edição concluída ainda.</p> : null}
      <ul className="list">
        {editions.map((e) => (
          <li key={e.id}>
            <Link href={`/e/${e.id}`} className="card row">
              <span style={{ flex: 1 }}>
                <strong>{e.name}</strong>
                <br />
                <span className="muted">{dateLabel(e.eventDate)}</span>
              </span>
              {e.champion ? <span className="champion">🏆 {e.champion}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

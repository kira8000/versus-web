import Link from 'next/link';

import { listOrganizations, mapUrl } from '@/lib/api';

// Igual a REVALIDATE_SECONDS: o segment config precisa ser literal.
export const revalidate = 300;

export default async function BattlesPage() {
  const orgs = await listOrganizations();
  return (
    <main className="wrap">
      <h1>Batalhas</h1>
      {orgs.length === 0 ? <p className="muted">Nenhuma batalha cadastrada ainda.</p> : null}
      <ul className="list">
        {orgs.map((org) => (
          <li key={org.id} className="card">
            <Link href={`/b/${org.slug}`}>
              <h2>{org.name}</h2>
              <p className="muted">
                {org.city} · {org.editionCount === 1 ? '1 edição' : `${org.editionCount} edições`}
              </p>
            </Link>
            {org.scheduleText ? <p>{org.scheduleText}</p> : null}
            {org.address ? (
              <p className="row">
                <span>{org.address}</span>
                <a className="link" href={mapUrl(org)} target="_blank" rel="noopener noreferrer">
                  ver no mapa
                </a>
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}

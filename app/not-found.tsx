import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap">
      <h1>Não encontrado</h1>
      <p className="muted">O link pode estar errado, ou a edição ainda não terminou.</p>
      <p>
        <Link className="link" href="/">
          Ver batalhas
        </Link>
      </p>
    </main>
  );
}

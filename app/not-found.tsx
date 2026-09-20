import Link from 'next/link';

export default function NotFound() {
  return <main><section className="page-hero"><div className="container"><div className="eyebrow">404</div><h1>That page does not exist.</h1><p>Try a project, event, idea, resource, or the chapter home page.</p><div className="hero-actions"><Link href="/" className="btn btn--primary">Back home</Link><Link href="/ideas" className="btn">Browse ideas</Link></div></div></section></main>;
}

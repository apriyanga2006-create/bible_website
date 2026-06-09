import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero">
      <h1>Read, Reflect & Grow Spiritually</h1>
      <p>Modern Holy Bible experience with full scripture access. Start reading to explore the sacred texts in a beautiful, distraction-free environment designed for reflection.</p>
      <Link to="/bible" className="btn">Open Bible Reader</Link>
    </section>
  );
}

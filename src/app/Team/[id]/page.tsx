import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;
const parser = new Parser({ headers: { 'User-Agent': 'Mozilla/5.0' } });

// En enkel oversikt over feeder
const TEAM_FEEDS: { [key: string]: string } = {
  'man-utd': 'https://www.theguardian.com/football/manchester-united/rss',
  'arsenal': 'https://www.theguardian.com/football/arsenal/rss',
  'liverpool': 'https://www.theguardian.com/football/liverpool/rss',
  'chelsea': 'https://www.theguardian.com/football/chelsea/rss',
  'man-city': 'https://www.theguardian.com/football/manchester-city/rss',
};

export default async function TeamPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const feedUrl = TEAM_FEEDS[id] || `https://www.theguardian.com/football/${id}/rss`;

  let news = [];
  try {
    const res = await parser.parseURL(feedUrl);
    news = res.items;
  } catch (e) {
    console.error("Feed error", e);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#3d195b] text-white p-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">{id.replace('-', ' ')}</h1>
          <Link href="/" className="text-[10px] font-bold border border-[#00ff87] text-[#00ff87] px-4 py-2 rounded-full uppercase">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="grid gap-4">
          {news.length > 0 ? news.map((item, i) => (
            <article key={i} className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <a href={item.link} target="_blank" className="text-blue-600 font-bold text-xs uppercase">Read more →</a>
            </article>
          )) : (
            <p className="py-20 text-center text-gray-400">No news found for this team. Check back later.</p>
          )}
        </div>
      </main>
    </div>
  );
}
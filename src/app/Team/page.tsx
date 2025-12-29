import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;
const parser = new Parser({ headers: { 'User-Agent': 'Mozilla/5.0' } });

async function getUnitedNews() {
  try {
    // Vi henter nyheter om United fra en stabil kilde
    const res = await parser.parseURL('https://www.theguardian.com/football/manchester-united/rss');
    return res.items.slice(0, 15);
  } catch (e) { return []; }
}

export default async function UnitedPage() {
  const news = await getUnitedNews();

  return (
    <div className="min-h-screen bg-[#FBECEB]">
      {/* Lag-spesifikk header (Manchester United Rød) */}
      <header className="bg-[#DA291C] text-white p-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src="https://resources.premierleague.com/premierleague/badges/t1.svg" alt="Man Utd" className="w-20 h-20 shadow-2xl rounded-full bg-white p-1" />
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Manchester United</h1>
              <p className="text-black font-bold text-xs uppercase tracking-widest mt-1">Latest Updates • Official & UK Sources</p>
            </div>
          </div>
          <Link href="/" className="text-white text-xs font-bold border border-white/30 px-4 py-2 rounded-full hover:bg-white/10 transition">
            ← Back to All News
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <h2 className="text-2xl font-black text-[#DA291C] uppercase italic mb-8 border-b-4 border-[#DA291C] inline-block">Recent Headlines</h2>
        
        <div className="grid gap-6">
          {news.map((item, i) => (
            <article key={i} className="bg-white rounded-2xl shadow-sm border-l-8 border-[#DA291C] p-6 hover:shadow-md transition-all">
              <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">{new Date(item.pubDate || '').toLocaleDateString('en-GB')}</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-6 line-clamp-3">{item.contentSnippet}</p>
              <a href={item.link} target="_blank" className="bg-[#DA291C] text-white px-6 py-2 rounded-full text-xs font-black uppercase hover:bg-black transition-colors inline-block">
                Read Full Article
              </a>
            </article>
          ))}
          
          {news.length === 0 && (
            <p className="text-center py-20 text-gray-500 italic">Connecting to Old Trafford servers... Please refresh.</p>
          )}
        </div>
      </main>
    </div>
  );
}
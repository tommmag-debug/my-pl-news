import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;
const parser = new Parser({ headers: { 'User-Agent': 'Mozilla/5.0' } });

const TEAM_FEEDS: { [key: string]: string } = {
  'man-utd': 'https://www.theguardian.com/football/manchester-united/rss',
  'arsenal': 'https://www.theguardian.com/football/arsenal/rss',
  'liverpool': 'https://www.theguardian.com/football/liverpool/rss',
  'chelsea': 'https://www.theguardian.com/football/chelsea/rss',
  'man-city': 'https://www.theguardian.com/football/manchester-city/rss',
};

// Vi definerer hva en artikkel er for TypeScript
interface NewsItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  pubDate?: string;
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const feedUrl = TEAM_FEEDS[id] || `https://www.theguardian.com/football/${id}/rss`;

  // HER ER FIKSEN: Vi sier at news er en liste av NewsItem
  let news: NewsItem[] = []; 
  
  try {
    const res = await parser.parseURL(feedUrl);
    news = res.items as NewsItem[];
  } catch (e) {
    console.error("Feed error", e);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#3d195b] text-white p-8 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {id.replace('-', ' ')}
            </h1>
          </div>
          <Link href="/" className="bg-[#00ff87] text-[#3d195b] px-6 py-2 rounded-full font-bold uppercase text-xs hover:bg-white transition-colors">
            ← Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10 w-full">
        <div className="grid gap-6">
          {news.length > 0 ? news.map((item, i) => (
            <article key={i} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-[#3d195b] hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight">{item.title}</h2>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.contentSnippet}</p>
              <a href={item.link} target="_blank" className="text-[#3d195b] font-black text-[10px] uppercase border-b-2 border-[#00ff87] pb-0.5">
                Read full coverage →
              </a>
            </article>
          )) : (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed">
              <p className="text-gray-400 italic font-medium">No official UK news found for this club right now.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
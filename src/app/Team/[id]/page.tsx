import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;
const parser = new Parser({ 
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
  } 
});

const TEAM_CONFIG: { [key: string]: { name: string, color: string, logo: string, feed: string } } = {
  'man-utd': { 
    name: 'Manchester United', 
    color: '#DA291C', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg',
    feed: 'https://www.theguardian.com/football/manchester-united/rss' // Guardian sin United-feed er mer stabil enn manutd.com sin
  },
  'liverpool': { 
    name: 'Liverpool', 
    color: '#C8102E', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg',
    feed: 'https://www.theguardian.com/football/liverpool/rss'
  },
  'man-city': { 
    name: 'Manchester City', 
    color: '#6CABDD', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg',
    feed: 'https://www.theguardian.com/football/manchester-city/rss'
  }
};

export default async function TeamPage(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;
  
  const config = TEAM_CONFIG[id] || { 
    name: id.replace(/-/g, ' '), 
    color: '#3d195b', 
    logo: 'https://resources.premierleague.com/premierleague/badges/rb/t3.svg',
    feed: `https://www.theguardian.com/football/${id}/rss`
  };

  let items: any[] = [];
  try {
    const feed = await parser.parseURL(config.feed);
    items = feed.items;
  } catch (error) {
    console.error("Feil ved henting av feed:", error);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header style={{ backgroundColor: config.color }} className="p-8 text-white shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-full shadow-inner">
              <img src={config.logo} alt="" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">{config.name}</h1>
          </div>
          <Link href="/" className="bg-black/20 hover:bg-black/40 px-4 py-2 rounded text-xs font-bold uppercase">← Tilbake</Link>
        </div>
      </header>

      {/* NYHETER */}
      <main className="max-w-5xl mx-auto p-6 w-full flex-1">
        <div className="grid gap-6">
          {items.length > 0 ? items.map((item, i) => (
            <article key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-bold text-gray-400 mb-2">{new Date(item.pubDate).toLocaleDateString('no-NO')}</p>
              <h2 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.contentSnippet || item.content?.replace(/<[^>]*>?/gm, '')}</p>
              <a href={item.link} target="_blank" style={{ color: config.color }} className="font-bold text-xs uppercase border-b-2 border-transparent hover:border-current pb-0.5">Les hele saken →</a>
            </article>
          )) : (
            <div className="bg-white p-20 text-center rounded-xl border-2 border-dashed">
              <p className="text-gray-500">Klarte ikke å hente nyheter for {config.name} akkurat nå. Prøv igjen senere.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
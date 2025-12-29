import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 300;
const parser = new Parser({ 
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } 
});

// Konfigurasjon for hvert lag: Farger, Logo og Offisielle feeder
const TEAM_CONFIG: { [key: string]: { name: string, color: string, logo: string, feed: string } } = {
  'man-utd': { 
    name: 'Manchester United', 
    color: '#DA291C', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg',
    feed: 'https://www.manutd.com/rssfeed/news' // Direkte fra manutd.com
  },
  'arsenal': { 
    name: 'Arsenal', 
    color: '#EF0107', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg',
    feed: 'https://www.theguardian.com/football/arsenal/rss' 
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
  },
  'chelsea': { 
    name: 'Chelsea', 
    color: '#034694', 
    logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg',
    feed: 'https://www.theguardian.com/football/chelsea/rss'
  }
};

interface NewsItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  pubDate?: string;
}

export default async function TeamPage(props: { params: Promise<{ id: string }> }) {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;
  
  // Hent lagets spesifikke config, eller bruk standard hvis den mangler
  const config = TEAM_CONFIG[id] || { 
    name: id.replace(/-/g, ' '), 
    color: '#3d195b', 
    logo: 'https://resources.premierleague.com/premierleague/badges/rb/t3.svg',
    feed: `https://www.theguardian.com/football/${id}/rss`
  };

  let news: NewsItem[] = [];

  try {
    const res = await parser.parseURL(config.feed);
    news = (res.items as NewsItem[]) || [];
  } catch (e) {
    console.error("RSS Fetch Error:", e);
    news = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Lag-spesifikk Header med riktig farge */}
      <header style={{ backgroundColor: config.color }} className="text-white p-8 shadow-xl transition-colors duration-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-full shadow-lg">
                <img src={config.logo} alt={config.name} className="w-16 h-16 object-contain" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                {config.name}
              </h1>
              <p className="text-white/80 font-bold text-xs uppercase tracking-widest mt-2">Official Club Feed & UK Updates</p>
            </div>
          </div>
          <Link href="/" className="bg-white/20 hover:bg-white/40 text-white px-6 py-2 rounded-full font-bold uppercase text-xs backdrop-blur-sm border border-white/30 transition-all">
            ← All Teams
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10 w-full flex-1">
        <div className="grid gap-6">
          {news.length > 0 ? (
            news.map((item, i) => (
              <article key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : 'Recent'}
                    </p>
                    <div style={{ backgroundColor: config.color }} className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h2>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">{item.contentSnippet}</p>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: config.color, borderColor: config.color }}
                  className="inline-block font-black text-xs uppercase border-b-2 pb-1 hover:opacity-70 transition-all"
                >
                  Read full story on {config.name} →
                </a>
              </article>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic font-medium">No live news found for {config.name}. Check back later.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="p-10 text-center text-gray-400 text-[10px] uppercase tracking-widest font-bold">
        Data aggregated for My PL News • {config.name} Edition
      </footer>
    </div>
  );
}
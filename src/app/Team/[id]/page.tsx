import Parser from 'rss-parser';
import Link from 'next/link';

export const revalidate = 3600;
const parser = new Parser({ 
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } 
});

const TEAM_CONFIG: { [key: string]: { name: string, color: string, logo: string, feed: string, source: string } } = {
  'man-utd': { name: 'Man Utd', color: '#DA291C', logo: 'https://resources.premierleague.com/premierleague/badges/t1.svg', feed: 'https://www.theguardian.com/football/manchester-united/rss', source: 'The Guardian' },
  'liverpool': { name: 'Liverpool', color: '#C8102E', logo: 'https://resources.premierleague.com/premierleague/badges/t14.svg', feed: 'https://www.theguardian.com/football/liverpool/rss', source: 'The Guardian' },
  'arsenal': { name: 'Arsenal', color: '#EF0107', logo: 'https://resources.premierleague.com/premierleague/badges/t3.svg', feed: 'https://www.theguardian.com/football/arsenal/rss', source: 'The Guardian' },
  'man-city': { name: 'Man City', color: '#6CABDD', logo: 'https://resources.premierleague.com/premierleague/badges/t43.svg', feed: 'https://www.theguardian.com/football/manchester-city/rss', source: 'The Guardian' },
  'chelsea': { name: 'Chelsea', color: '#034694', logo: 'https://resources.premierleague.com/premierleague/badges/t8.svg', feed: 'https://www.theguardian.com/football/chelsea/rss', source: 'The Guardian' },
  'tottenham': { name: 'Tottenham', color: '#132257', logo: 'https://resources.premierleague.com/premierleague/badges/t6.svg', feed: 'https://www.theguardian.com/football/tottenham-hotspur/rss', source: 'The Guardian' },
  'aston-villa': { name: 'Aston Villa', color: '#95BFE5', logo: 'https://resources.premierleague.com/premierleague/badges/t7.svg', feed: 'https://www.theguardian.com/football/aston-villa/rss', source: 'The Guardian' },
  'newcastle': { name: 'Newcastle', color: '#241F20', logo: 'https://resources.premierleague.com/premierleague/badges/t4.svg', feed: 'https://www.theguardian.com/football/newcastleunited/rss', source: 'The Guardian' },
  'nottm-forest': { name: 'Nottm Forest', color: '#DD0000', logo: 'https://resources.premierleague.com/premierleague/badges/t17.svg', feed: 'https://www.theguardian.com/football/nottinghamforest/rss', source: 'The Guardian' },
};

interface NewsItem { title?: string; link?: string; contentSnippet?: string; content?: string; pubDate?: string; sourceName?: string; }

export default async function TeamPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const config = TEAM_CONFIG[id] || { 
    name: id.replace(/-/g, ' ').toUpperCase(), 
    color: '#3d195b', 
    logo: `https://resources.premierleague.com/premierleague/badges/rb/t3.svg`,
    feed: `https://www.theguardian.com/football/${id.replace(/-/g, '')}/rss`,
    source: 'The Guardian'
  };

  let news: NewsItem[] = [];
  try {
    const res = await parser.parseURL(config.feed);
    news = (res.items as NewsItem[]).map(i => ({ ...i, sourceName: config.source }));
  } catch (e) { news = []; }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
      <header style={{ backgroundColor: config.color }} className="sticky top-0 z-50 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full shadow-sm"><img src={config.logo} alt="" className="w-8 h-8 object-contain" /></div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">{config.name}</h1>
        </div>
        <Link href="/" className="text-[10px] font-black bg-white/20 hover:bg-white hover:text-black px-4 py-1.5 rounded-full uppercase border border-white/30 transition-all">← Home</Link>
      </header>

      <main className="max-w-[1500px] mx-auto p-6 lg:p-10 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item, i) => (
            <article key={i} className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 pt-8 pb-14 hover:border-[#3d195b] hover:shadow-xl transition-all duration-200 group flex flex-col">
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                <a href={item.link} target="_blank">{item.title}</a>
              </h2>
              <p className="text-gray-500 text-sm line-clamp-3 mb-6 group-hover:text-gray-800 transition-colors italic">
                {item.contentSnippet || (item.content ? item.content.replace(/<[^>]*>?/gm, '') : '')}
              </p>
              <div className="absolute bottom-4 left-6 text-[9px] font-bold text-gray-400 uppercase">{item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-GB') : 'RECENT'}</div>
              <div className="absolute bottom-4 right-6 text-[10px] font-black bg-gray-100 text-[#3d195b] px-2 py-1 rounded uppercase group-hover:bg-[#00ff87] transition-colors">{item.sourceName}</div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
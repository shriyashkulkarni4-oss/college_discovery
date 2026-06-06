import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, MapPin, TrendingUp, GraduationCap, Building2, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getColleges } from '../api/colleges';
import SearchBar from '../components/SearchBar';
import CollegeCard from '../components/CollegeCard';
import CollegeSkeleton from '../components/CollegeSkeleton';
import type { CollegeCard as CollegeCardType } from '../types';
import { useState } from 'react';

const FEATURED_LOCATIONS = [
  { city: 'Bangalore', state: 'Karnataka', emoji: '🏙️', tag: 'Silicon Valley of India' },
  { city: 'Mumbai', state: 'Maharashtra', emoji: '🌊', tag: 'Financial Capital' },
  { city: 'Chennai', state: 'Tamil Nadu', emoji: '🌴', tag: 'Top Engineering Hub' },
  { city: 'Hyderabad', state: 'Telangana', emoji: '💊', tag: 'Pharma & Tech City' },
  { city: 'Pune', state: 'Maharashtra', emoji: '📚', tag: 'Oxford of the East' },
  { city: 'New Delhi', state: 'Delhi', emoji: '🏛️', tag: "India's Capital" },
];

const STATS = [
  { label: 'Colleges Listed', value: '150+', icon: <Building2 className="w-5 h-5" /> },
  { label: 'Courses Available', value: '500+', icon: <GraduationCap className="w-5 h-5" /> },
  { label: 'Student Reviews', value: '1000+', icon: <Star className="w-5 h-5" /> },
  { label: 'States Covered', value: '20+', icon: <MapPin className="w-5 h-5" /> },
];

export default function Home() {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = () => {
    if (searchVal.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/colleges');
    }
  };

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['colleges-featured'],
    queryFn: () => getColleges({ sortBy: 'rating', sortOrder: 'desc', limit: 6 }),
    staleTime: 1000 * 60 * 10,
  });

  const { data: topRatedData, isLoading: topRatedLoading } = useQuery({
    queryKey: ['colleges-top-rated'],
    queryFn: () => getColleges({ sortBy: 'placement', sortOrder: 'desc', limit: 6 }),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div>
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-accent-950" />
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(99,102,241,0.4) 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, rgba(217,70,239,0.3) 0%, transparent 50%)`,
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-white/80 mb-6 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            India's Premier College Discovery Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Find Your{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
              Dream College
            </span>
            <br />in India
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Explore 150+ colleges across India. Compare IITs, NITs, BITS and top private
            universities. Read real reviews, check placements, and make the right choice.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search colleges, cities, courses..."
                  className="w-full pl-12 pr-4 py-4 text-base rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-xl"
                  style={{ background: 'rgba(255,255,255,0.95)', color: '#0f172a' }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white font-semibold hover:from-primary-400 hover:to-accent-400 transition-all shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {['IITs', 'NITs', 'BITS Pilani', 'VIT', 'Government Colleges', 'Top Placements'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/colleges?search=${encodeURIComponent(tag)}`)}
                className="px-4 py-1.5 rounded-full text-sm text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────── */}
      <section className="border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2 text-primary-600">{stat.icon}</div>
                <div className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Colleges ─────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="⭐ Top Rated"
            title="Featured Colleges"
            subtitle="Handpicked top-rated institutions across India"
            link="/colleges"
            linkLabel="View All"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {featuredLoading
              ? [...Array(6)].map((_, i) => <CollegeSkeleton key={i} />)
              : (featuredData?.items ?? []).map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Locations ─────────────────────────────────────── */}
      <section className="py-16" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="📍 Locations"
            title="Popular Education Hubs"
            subtitle="Discover colleges in India's top educational cities"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            {FEATURED_LOCATIONS.map((loc) => (
              <Link
                key={loc.city}
                to={`/colleges?city=${encodeURIComponent(loc.city)}&state=${encodeURIComponent(loc.state)}`}
                className="group rounded-2xl p-4 border text-center transition-all hover:border-primary-400 hover:shadow-lg hover:-translate-y-0.5"
                style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
              >
                <div className="text-3xl mb-2">{loc.emoji}</div>
                <div className="font-semibold text-sm group-hover:text-primary-600 transition-colors" style={{ color: 'var(--text-primary)' }}>
                  {loc.city}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {loc.tag}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Best Placements ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="💼 Placements"
            title="Top Placement Colleges"
            subtitle="Colleges with the highest average placement packages"
            link="/colleges?sortBy=placement&sortOrder=desc"
            linkLabel="View All"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {topRatedLoading
              ? [...Array(6)].map((_, i) => <CollegeSkeleton key={i} />)
              : (topRatedData?.items ?? []).map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 p-10 md:p-16 text-center">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)',
              }}
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Ready to Find Your College?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Compare colleges side by side, read real student reviews, and make an informed decision.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/colleges"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold hover:bg-primary-50 transition-colors shadow-lg"
                >
                  <Search className="w-4 h-4" />
                  Explore Colleges
                </Link>
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/30 font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <TrendingUp className="w-4 h-4" />
                  Compare Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  badge,
  title,
  subtitle,
  link,
  linkLabel,
}: {
  badge: string;
  title: string;
  subtitle: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 mb-2 inline-block">
          {badge}
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      </div>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:underline flex-shrink-0"
        >
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

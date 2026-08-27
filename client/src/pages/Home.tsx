/*
  SUNLIT CITRUS ATLAS — homepage.
  A cinematic, low-key Southern California opening moves into tactile editorial routes and practical action paths.
*/
import { ArrowDown, ArrowRight, ArrowUpRight, Building2, ChevronRight, Compass, Home as HomeIcon, KeyRound, MapPin, Search, Sprout, TrendingUp } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { SiteShell } from "../components/SiteShell";

const heroImage = "/manus-storage/c21-citrus-hero-estate_b43f73af.jpg";
const interiorImage = "/manus-storage/c21-citrus-interior_dc2ded1c.jpg";
const neighbourhoodImage = "/manus-storage/c21-citrus-neighbourhood_881ec5cd.jpg";
const detailImage = "/manus-storage/c21-citrus-detail_b3fce7fb.jpg";

const pathways = [
  { number: "01", icon: KeyRound, title: "Find a place", body: "Start with a search that reflects the way you want to live, not just the number of bedrooms.", href: "/buy", cta: "Explore buying" },
  { number: "02", icon: TrendingUp, title: "Plan a sale", body: "Bring the right price, presentation, and timing into one informed launch plan.", href: "/sell", cta: "Explore selling" },
  { number: "03", icon: Building2, title: "Build a career", body: "Make your next professional chapter more connected with a locally rooted brokerage.", href: "/careers", cta: "Explore careers" },
];

const communities = [
  { title: "San Dimas", copy: "Foothill views, connected neighborhoods, and a quietly active pace.", route: "Discover the area" },
  { title: "Glendora", copy: "Tree-lined streets and an inviting historic village feel.", route: "Discover the area" },
  { title: "La Verne", copy: "A distinctive blend of campus energy, heritage homes, and open skies.", route: "Discover the area" },
  { title: "San Gabriel Valley", copy: "Many communities, many ways to find the right fit.", route: "Explore communities" },
];

function SearchPanel() {
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("Any home type");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = new URL("https://c21citrus.com/search/");
    if (query.trim()) target.searchParams.set("q", query.trim());
    if (propertyType !== "Any home type") target.searchParams.set("type", propertyType);
    window.location.assign(target.toString());
  };

  return (
    <form className="hero-search" onSubmit={submitSearch}>
      <div className="search-field search-location">
        <MapPin size={18} />
        <label htmlFor="hero-location" className="sr-only">City, neighborhood, or ZIP</label>
        <input id="hero-location" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="City, neighborhood, or ZIP" />
      </div>
      <div className="search-field search-select-wrap">
        <label htmlFor="hero-property" className="sr-only">Property type</label>
        <select id="hero-property" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
          <option>Any home type</option><option>House</option><option>Condominium</option><option>Townhome</option><option>Land</option>
        </select>
        <ChevronRight size={16} />
      </div>
      <button type="submit" className="search-submit"><Search size={17} /><span>Search homes</span></button>
    </form>
  );
}

export default function Home() {
  return (
    <SiteShell tone="dark">
      <main id="main-content">
        <section className="hero-section">
          <img className="hero-image" src={heroImage} alt="A modern Southern California residence in warm evening light" />
          <div className="hero-shade" />
          <div className="hero-route" aria-hidden="true"><span /><span /><span /></div>
          <div className="hero-content">
            <p className="eyebrow light"><span /> Southern California, considered</p>
            <h1>Good moves<br /><em>begin close</em> to home.</h1>
            <p className="hero-copy">Real estate guidance for the places and possibilities ahead.</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/buy">Start your search <ArrowRight size={17} /></Link>
              <Link className="text-action inverse" href="/contact">Talk with a local guide <ArrowUpRight size={16} /></Link>
            </div>
          </div>
          <div className="hero-search-wrap"><span className="search-kicker">Find your place</span><SearchPanel /></div>
          <a className="scroll-cue" href="#your-way"><span>Scroll to explore</span><ArrowDown size={17} /></a>
        </section>

        <section className="intro-section" id="your-way">
          <div className="section-route-label"><span>01</span><p>Start with what matters</p></div>
          <div className="intro-copy">
            <p className="eyebrow"><span /> C21 Citrus Realty</p>
            <h2>Make room for<br /><em>the right next move.</em></h2>
          </div>
          <div className="intro-side">
            <p>There is no single route through real estate. Whether you are narrowing a search, preparing a sale, or growing a business, we make the path feel more informed and more human.</p>
            <Link href="/about" className="text-action">How we work <ArrowUpRight size={16} /></Link>
          </div>
        </section>

        <section className="pathway-section">
          <div className="pathway-intro">
            <p className="eyebrow"><span /> Choose your route</p>
            <p>Practical starting points, shaped around real decisions.</p>
          </div>
          <div className="pathway-list">
            {pathways.map((pathway) => {
              const Icon = pathway.icon;
              return <Link className="pathway" key={pathway.title} href={pathway.href}>
                <span className="pathway-number">{pathway.number}</span>
                <Icon className="pathway-icon" size={27} strokeWidth={1.35} />
                <div><h3>{pathway.title}</h3><p>{pathway.body}</p></div>
                <span className="pathway-link">{pathway.cta} <ArrowUpRight size={16} /></span>
              </Link>;
            })}
          </div>
        </section>

        <section className="feature-split">
          <div className="feature-image-wrap"><img src={interiorImage} alt="Warm contemporary kitchen in a Southern California home" /><div className="image-note"><span>Inside the details</span><span>↗</span></div></div>
          <div className="feature-copy">
            <p className="eyebrow"><span /> A clearer way forward</p>
            <h2>Space to ask<br />the <em>important questions.</em></h2>
            <p>We bring market context, simple explanations, and enough breathing room to make decisions that stand up to the details.</p>
            <div className="feature-links"><Link href="/buy"><HomeIcon size={18} /> A buyer’s wayfinder <ArrowRight size={16} /></Link><Link href="/sell"><TrendingUp size={18} /> A seller’s launch plan <ArrowRight size={16} /></Link></div>
          </div>
        </section>

        <section className="communities-section">
          <div className="community-heading">
            <div><p className="eyebrow light"><span /> A local lens</p><h2>Explore the places<br />that <em>feel like yours.</em></h2></div>
            <Link href="/communities" className="button button-outline-light">All communities <ArrowRight size={17} /></Link>
          </div>
          <div className="community-grid">
            {communities.map((community, index) => <Link href="/communities" className="community-card" key={community.title}>
              <span className="community-index">0{index + 1}</span><span className="community-marker"><Compass size={18} /></span><h3>{community.title}</h3><p>{community.copy}</p><span className="community-cta">{community.route} <ArrowUpRight size={15} /></span>
            </Link>)}
          </div>
        </section>

        <section className="portrait-section">
          <div className="portrait-copy">
            <p className="eyebrow"><span /> Rooted here</p>
            <h2>Local knowledge<br />with a <em>long view.</em></h2>
            <p>We know the conversation rarely stops at the front door. That is why we stay curious about neighborhoods, market shifts, and what comes next for the people who call this region home.</p>
            <Link href="/resources" className="text-action">Open local resources <ArrowUpRight size={16} /></Link>
          </div>
          <figure className="portrait-image"><img src={neighbourhoodImage} alt="A leafy Southern California residential street" /><figcaption><span>Southern California</span><span>33.8° N, 117.9° W</span></figcaption></figure>
          <div className="portrait-detail"><img src={detailImage} alt="Keys and citrus arranged on an architectural surface" /><p>Every move begins as a small, meaningful detail.</p></div>
        </section>

        <section className="contact-ribbon">
          <div><p className="eyebrow light"><span /> Ready when you are</p><h2>Bring your next move<br />into <em>focus.</em></h2></div>
          <div><p>Start with a conversation. We will help you find the most useful next step.</p><Link href="/contact" className="button button-gold">Contact C21 Citrus <ArrowRight size={17} /></Link></div>
        </section>
      </main>
    </SiteShell>
  );
}

/*
Sunlit Citrus Atlas direction for Century 21 Citrus Realty: immersive Southern California lifestyle first impression, rounded MLS search as the central action, editorial numbered sections, expanded practical navigation, warm citrus/olive palette, tactile map-paper textures, and direct IDX property-search access.
*/
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CookieConsent } from "./components/CookieConsent";
import { GoogleAdsBaseTag } from "./components/GoogleAdsBaseTag";
import SiteComplianceFooter from "./components/SiteComplianceFooter";

const Agents = lazy(() => import("./pages/Agents"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const HomeValue = lazy(() => import("./pages/HomeValue"));
const MLSSearch = lazy(() => import("./pages/MLSSearch"));
const ContactAgent = lazy(() => import("./pages/ContactAgent"));
const OpenHouses = lazy(() => import("./pages/OpenHouses"));
const Relocation = lazy(() => import("./pages/Relocation"));
const Home = lazy(() => import("./pages/Home"));
const HomeBuyingProcess = lazy(() => import("./pages/HomeBuyingProcess"));
const HomeSellingProcess = lazy(() => import("./pages/HomeSellingProcess"));
const OurListings = lazy(() => import("./pages/OurListings"));
const Resources = lazy(() => import("./pages/Resources"));
const MyFavorites = lazy(() => import("./pages/MyFavorites"));
const RealEstateSchool = lazy(() => import("./pages/RealEstateSchool"));
const ExperiencedAgents = lazy(() => import("./pages/ExperiencedAgents"));
const About = lazy(() => import("./pages/About"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PrivacyRequest = lazy(() => import("./pages/PrivacyRequest"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const NotFound = lazy(() => import("./pages/NotFound"));

function RouteLoadingFallback() {
  return <main aria-busy="true" style={{ minHeight: "100vh", background: "#fff" }} />;
}

function Router() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/home-buying-process" component={HomeBuyingProcess} />
        <Route path="/home-buying-process/" component={HomeBuyingProcess} />
        <Route path="/home-selling-process" component={HomeSellingProcess} />
        <Route path="/home-selling-process/" component={HomeSellingProcess} />
        <Route path="/our-listings" component={OurListings} />
        <Route path="/our-listings/" component={OurListings} />
        <Route path="/open-houses" component={OpenHouses} />
        <Route path="/open-houses/" component={OpenHouses} />
        <Route path="/relocation" component={Relocation} />
        <Route path="/relocation/" component={Relocation} />
        <Route path="/agents" component={Agents} />
        <Route path="/agents/" component={Agents} />
        <Route path="/careers" component={Careers} />
        <Route path="/careers/" component={Careers} />
        <Route path="/contact" component={Contact} />
        <Route path="/contact/" component={Contact} />
        <Route path="/home-value" component={HomeValue} />
        <Route path="/home-value/" component={HomeValue} />
        <Route path="/mls-search" component={MLSSearch} />
        <Route path="/mls-search/" component={MLSSearch} />
        <Route path="/contact-agent" component={ContactAgent} />
        <Route path="/contact-agent/" component={ContactAgent} />
        <Route path="/resources" component={Resources} />
        <Route path="/resources/" component={Resources} />
        <Route path="/favorites" component={MyFavorites} />
        <Route path="/favorites/" component={MyFavorites} />
        <Route path="/careers/real-estate-school" component={RealEstateSchool} />
        <Route path="/careers/real-estate-school/" component={RealEstateSchool} />
        <Route path="/careers/get-your-license" component={RealEstateSchool} />
        <Route path="/careers/get-your-license/" component={RealEstateSchool} />
        <Route path="/careers/new-agents" component={RealEstateSchool} />
        <Route path="/careers/new-agents/" component={RealEstateSchool} />
        <Route path="/careers/experienced-agents" component={ExperiencedAgents} />
        <Route path="/careers/experienced-agents/" component={ExperiencedAgents} />
        <Route path="/about" component={About} />
        <Route path="/about/" component={About} />
        <Route path="/search-results" component={SearchResults} />
        <Route path="/search-results/" component={SearchResults} />
        <Route path="/listing/:mlsId" component={ListingDetail} />
        <Route path="/listing/:mlsId/" component={ListingDetail} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/privacy-policy/" component={PrivacyPolicy} />
        <Route path="/privacy-request" component={PrivacyRequest} />
        <Route path="/privacy-request/" component={PrivacyRequest} />
        <Route path="/terms-of-use" component={TermsOfUse} />
        <Route path="/terms-of-use/" component={TermsOfUse} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <GoogleAdsBaseTag />
          <Router />
          <SiteComplianceFooter />
          <CookieConsent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

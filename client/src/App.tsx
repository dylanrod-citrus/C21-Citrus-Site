/*
Sunlit Citrus Atlas direction for Century 21 Citrus Realty: immersive Southern California lifestyle first impression, rounded MLS search as the central action, editorial numbered sections, expanded practical navigation, warm citrus/olive palette, tactile map-paper textures, and direct IDX property-search access.
*/
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Agents from "./pages/Agents";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import HomeValue from "./pages/HomeValue";
import MLSSearch from "./pages/MLSSearch";
import ContactAgent from "./pages/ContactAgent";
import OpenHouses from "./pages/OpenHouses";
import Relocation from "./pages/Relocation";
import Home from "./pages/Home";
import HomeBuyingProcess from "./pages/HomeBuyingProcess";
import HomeSellingProcess from "./pages/HomeSellingProcess";
import OurListings from "./pages/OurListings";
import Resources from "./pages/Resources";
import MyFavorites from "./pages/MyFavorites";
import GetYourLicense from "./pages/GetYourLicense";
import NewAgents from "./pages/NewAgents";
import RealEstateSchool from "./pages/RealEstateSchool";
import ExperiencedAgents from "./pages/ExperiencedAgents";
import About from "./pages/About";
import SearchResults from "./pages/SearchResults";
import ListingDetail from "./pages/ListingDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import PrivacyRequest from "./pages/PrivacyRequest";
import TermsOfUse from "./pages/TermsOfUse";
import { CookieConsent } from "./components/CookieConsent";
import { GoogleAdsBaseTag } from "./components/GoogleAdsBaseTag";
import SiteComplianceFooter from "./components/SiteComplianceFooter";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/home-buying-process"} component={HomeBuyingProcess} />
      <Route path={"/home-buying-process/"} component={HomeBuyingProcess} />
      <Route path={"/home-selling-process"} component={HomeSellingProcess} />
      <Route path={"/home-selling-process/"} component={HomeSellingProcess} />
      <Route path={"/our-listings"} component={OurListings} />
      <Route path={"/our-listings/"} component={OurListings} />
      <Route path={"/open-houses"} component={OpenHouses} />
      <Route path={"/open-houses/"} component={OpenHouses} />
      <Route path={"/relocation"} component={Relocation} />
      <Route path={"/relocation/"} component={Relocation} />
      <Route path={"/agents"} component={Agents} />
      <Route path={"/agents/"} component={Agents} />
      <Route path={"/careers"} component={Careers} />
      <Route path={"/careers/"} component={Careers} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/contact/"} component={Contact} />
      <Route path={"/home-value"} component={HomeValue} />
      <Route path={"/home-value/"} component={HomeValue} />
      <Route path={"/mls-search"} component={MLSSearch} />
      <Route path={"/mls-search/"} component={MLSSearch} />
      <Route path={"/contact-agent"} component={ContactAgent} />
      <Route path={"/contact-agent/"} component={ContactAgent} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/resources/"} component={Resources} />
      <Route path={"/favorites"} component={MyFavorites} />
      <Route path={"/favorites/"} component={MyFavorites} />
      <Route path={"/careers/real-estate-school"} component={RealEstateSchool} />
      <Route path={"/careers/real-estate-school/"} component={RealEstateSchool} />
      {/* Legacy redirects — old URLs now point to Real Estate School */}
      <Route path={"/careers/get-your-license"} component={RealEstateSchool} />
      <Route path={"/careers/get-your-license/"} component={RealEstateSchool} />
      <Route path={"/careers/new-agents"} component={RealEstateSchool} />
      <Route path={"/careers/new-agents/"} component={RealEstateSchool} />
      <Route path={"/careers/experienced-agents"} component={ExperiencedAgents} />
      <Route path={"/careers/experienced-agents/"} component={ExperiencedAgents} />
      <Route path={"/about"} component={About} />
      <Route path={"/about/"} component={About} />
      <Route path={"/search-results"} component={SearchResults} />
      <Route path={"/search-results/"} component={SearchResults} />
      <Route path={"/listing/:mlsId"} component={ListingDetail} />
      <Route path={"/listing/:mlsId/"} component={ListingDetail} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/privacy-policy/"} component={PrivacyPolicy} />
      <Route path={"/privacy-request"} component={PrivacyRequest} />
      <Route path={"/privacy-request/"} component={PrivacyRequest} />
      <Route path={"/terms-of-use"} component={TermsOfUse} />
      <Route path={"/terms-of-use/"} component={TermsOfUse} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// DESIGN NOTE: Citrus Flow MLS Studio uses a warm light default theme with immersive glass navigation, scroll-led content blocks, featured listing CTAs, and persistent IDX/MLS access. Keep future routes and components aligned with this premium single-page real estate journey instead of old-style page-hopping.

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
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

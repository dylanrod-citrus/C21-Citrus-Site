/*
  SUNLIT CITRUS ATLAS — application routes.
  The site reads as a cohesive, local real-estate field guide instead of disconnected utility pages.
*/
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SectionPage from "./pages/SectionPage";

const BuyPage = () => <SectionPage type="buy" />;
const SellPage = () => <SectionPage type="sell" />;
const SearchPage = () => <SectionPage type="search" />;
const CommunitiesPage = () => <SectionPage type="communities" />;
const AgentsPage = () => <SectionPage type="agents" />;
const ResourcesPage = () => <SectionPage type="resources" />;
const CareersPage = () => <SectionPage type="careers" />;
const AboutPage = () => <SectionPage type="about" />;
const ContactPage = () => <SectionPage type="contact" />;
const PrivacyPage = () => <SectionPage type="privacy-policy" />;
const TermsPage = () => <SectionPage type="terms-of-use" />;
const NotFoundPage = () => <SectionPage type="notfound" />;

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/buy" component={BuyPage} /><Route path="/sell" component={SellPage} />
    <Route path="/search" component={SearchPage} /><Route path="/communities" component={CommunitiesPage} />
    <Route path="/agents" component={AgentsPage} /><Route path="/resources" component={ResourcesPage} />
    <Route path="/careers" component={CareersPage} /><Route path="/about" component={AboutPage} />
    <Route path="/contact" component={ContactPage} /><Route path="/privacy-policy" component={PrivacyPage} />
    <Route path="/terms-of-use" component={TermsPage} /><Route component={NotFoundPage} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteSkeleton from "./components/RouteSkeleton";
import CommandPaletteMount from "./components/CommandPaletteMount";
import CookieConsent from "./components/CookieConsent";
import Analytics from "./components/Analytics";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Home and NotFound stay eager — the landing route shouldn't wait on a chunk.
// Every other page is split so its dependencies (jsPDF, JSZip, html2canvas…)
// only download when that route is actually visited.
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Vision = lazy(() => import("./pages/Vision"));
const Founders = lazy(() => import("./pages/Founders"));
const Gurukul = lazy(() => import("./pages/Gurukul"));
const Ayurveda = lazy(() => import("./pages/Ayurveda"));
const Apps = lazy(() => import("./pages/Apps"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const Press = lazy(() => import("./pages/Press"));
const Impact = lazy(() => import("./pages/Impact"));
const Volunteer = lazy(() => import("./pages/Volunteer"));
const Events = lazy(() => import("./pages/Events"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const FAQs = lazy(() => import("./pages/FAQs"));
const Contact = lazy(() => import("./pages/Contact"));
const Hub = lazy(() => import("./pages/Hub"));
const FinancialReports = lazy(() => import("./pages/FinancialReports"));
const Collaborations = lazy(() => import("./pages/Collaborations"));

const GurukuFoundation = lazy(() => import("@/pages/GurukuFoundation"));
const GurukuPrograms = lazy(() => import("@/pages/GurukuPrograms"));
const GurukuDigital = lazy(() => import("@/pages/GurukuDigital"));
const MetaGurukul = lazy(() => import("./pages/MetaGurukul"));
const GurukuAyurveda = lazy(() => import("@/pages/GurukuAyurveda"));
const GurukuJoin = lazy(() => import("@/pages/GurukuJoin"));
const Campus = lazy(() => import("@/pages/Campus"));
const Books = lazy(() => import("@/pages/Books"));
const MemberDashboard = lazy(() => import("@/pages/MemberDashboard"));
const DonateSuccess = lazy(() => import("@/pages/DonateSuccess"));
const Search = lazy(() => import("@/pages/Search"));

// Donate exports the page as default and the wall as a named export; compose
// them inside the lazy factory so both land in the same chunk.
const DonatePage = lazy(async () => {
  const { default: Donate, DonorWall } = await import("./pages/Donate");
  return {
    default: () => (
      <>
        <Donate />
        <DonorWall />
      </>
    ),
  };
});

// LegalPages has four named exports — one shared chunk, four entry points.
const PrivacyPolicy = lazy(() =>
  import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPolicy })),
);
const TermsOfService = lazy(() =>
  import("./pages/LegalPages").then((m) => ({ default: m.TermsOfService })),
);
const CookiePolicy = lazy(() =>
  import("./pages/LegalPages").then((m) => ({ default: m.CookiePolicy })),
);
const AccessibilityStatement = lazy(() =>
  import("./pages/LegalPages").then((m) => ({ default: m.AccessibilityStatement })),
);

function Router() {
  return (
    <Switch>
      {/* Core */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/hub" component={Hub} />
      <Route path="/vision" component={Vision} />
      <Route path="/founders" component={Founders} />
      <Route path="/gurukul" component={Gurukul} />
      <Route path="/gurukul/foundation" component={GurukuFoundation} />
      <Route path="/gurukul/programs" component={GurukuPrograms} />
      <Route path="/gurukul/digital" component={GurukuDigital} />
      <Route path="/gurukul/meta-gurukul" component={MetaGurukul} />
      <Route path="/gurukul/ayurveda" component={GurukuAyurveda} />
      <Route path="/gurukul/join" component={GurukuJoin} />
      <Route path="/ayurveda" component={Ayurveda} />
      <Route path="/apps" component={Apps} />

      {/* Newsroom */}
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogArticle} />
      <Route path="/press" component={Press} />
      <Route path="/impact" component={Impact} />
      <Route path="/faqs" component={FAQs} />
      <Route path="/contact" component={Contact} />

      {/* Resources */}
      <Route path="/volunteer" component={Volunteer} />
      <Route path="/events" component={Events} />

      {/* Stubs */}
      <Route path="/donate" component={DonatePage} />
      <Route path="/marketplace" component={() => <ComingSoon title="Marketplace" desc="Organic essentials, curated. Launching soon with authentic products imported from India." category="marketplace" />} />
      <Route path="/financial-reports" component={FinancialReports} />
      <Route path="/collaborations" component={Collaborations} />
      <Route path="/campus" component={Campus} />
      <Route path="/ebooks" component={Books} />
      <Route path="/books" component={Books} />
      <Route path="/dashboard" component={MemberDashboard} />
      <Route path="/donate/success" component={DonateSuccess} />
      <Route path="/search" component={Search} />
      <Route path="/scriptures" component={() => <ComingSoon title="Digital Scriptures" desc="Classical Sanskrit scriptures in digital format. Coming soon." category="scriptures" />} />
      <Route path="/auth/signin" component={() => { window.location.replace("/gurukul/join"); return null; }} />
      <Route path="/auth/signup" component={() => { window.location.replace("/gurukul/join"); return null; }} />
      <Route path="/login" component={() => { window.location.replace("/gurukul/join"); return null; }} />
      <Route path="/register" component={() => { window.location.replace("/gurukul/join"); return null; }} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/accessibility" component={AccessibilityStatement} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
      <ThemeProvider switchable>
        <TooltipProvider>
          <Toaster />
          {/* Mounted outside Suspense so Cmd/Ctrl-K works even mid route load. */}
          <CommandPaletteMount />
          <CookieConsent />
          <Analytics />
          <Suspense fallback={<RouteSkeleton />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;

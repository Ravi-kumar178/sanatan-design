import { useLocation } from 'wouter';
import Navbar from './Navbar';
import Footer from './Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import FloatingShare from './FloatingShare';
import WhatsAppFAB from './WhatsAppFAB';

export default function Layout({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1" role="main" aria-label="Main content">
        {/*
          Page transition is a plain CSS animation rather than a motion library:
          framer-motion added ~29 kB gzip to the eager entry chunk, which is a
          poor trade for a fade. Changing `key` remounts this node on navigation,
          which replays the animation. Reduced-motion is handled globally in
          index.css.

          It also sits inside <main> on purpose — animating the whole page would
          fade the navbar and footer on every navigation, which reads as a
          flicker since neither actually changes.
        */}
        <div key={location} className="page-enter">
          {children}
        </div>
      </main>
      <Footer />
      <WhatsAppFAB />
      <FloatingShare />
    </div>
  );
}

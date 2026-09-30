import { useState, useEffect, useCallback } from 'react';
import App from './App.jsx';
import LandingPage from './components/LandingPage.jsx';

function isStudioRoute() {
  if (typeof window === 'undefined') return false;
  const hash = (window.location.hash || '').replace(/^#/, '').split('?')[0].trim();
  if (hash === 'studio') return true;
  const params = new URLSearchParams(window.location.search);
  return params.get('studio') === '1';
}

export default function Root() {
  const [showStudio, setShowStudio] = useState(() => isStudioRoute());

  useEffect(() => {
    const sync = () => setShowStudio(isStudioRoute());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const goStudio = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('studio');
    url.hash = 'studio';
    window.history.pushState({}, '', url.pathname + url.search + '#studio');
    setShowStudio(true);
  }, []);

  const goHome = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('studio');
    url.hash = '';
    window.history.pushState({}, '', url.pathname + url.search);
    setShowStudio(false);
    window.scrollTo(0, 0);
  }, []);

  if (showStudio) {
    return <App onGoHome={goHome} />;
  }

  return <LandingPage onOpenStudio={goStudio} />;
}

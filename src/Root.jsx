import { useState, useEffect, useCallback } from 'react';
import App from './App.jsx';
import LandingPage from './components/LandingPage.jsx';

function parseStudioRoute() {
  if (typeof window === 'undefined') return { isStudio: false, options: null };
  const rawHash = (window.location.hash || '').replace(/^#/, '');
  const [hashPath, hashQuery] = rawHash.split('?');
  const searchParams = new URLSearchParams(hashQuery || window.location.search);

  const isStudio = hashPath.trim() === 'studio' || searchParams.get('studio') === '1';
  const theme = searchParams.get('theme') || null;
  const mode = searchParams.get('mode') || null;
  const layout = searchParams.get('layout') || null;

  return {
    isStudio,
    options: isStudio ? { themeId: theme, mode, layout } : null,
  };
}

export default function Root() {
  const [routeState, setRouteState] = useState(() => parseStudioRoute());
  const [launchCount, setLaunchCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      setRouteState(parseStudioRoute());
    };
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const goStudio = useCallback((opts) => {
    let themeId = null;
    let mode = null;
    let layout = null;

    if (typeof opts === 'string') {
      themeId = opts;
    } else if (opts && typeof opts === 'object') {
      themeId = opts.themeId || opts.id || null;
      mode = opts.mode || null;
      layout = opts.layout || null;
    }

    const params = new URLSearchParams();
    if (themeId) params.set('theme', themeId);
    if (mode) params.set('mode', mode);
    if (layout) params.set('layout', layout);

    const qs = params.toString();
    const hashVal = qs ? `studio?${qs}` : 'studio';

    const url = new URL(window.location.href);
    url.searchParams.delete('studio');
    window.history.pushState({}, '', url.pathname + url.search + '#' + hashVal);

    setRouteState({
      isStudio: true,
      options: { themeId, mode, layout },
    });
    setLaunchCount((c) => c + 1);
    window.scrollTo(0, 0);
  }, []);

  const goHome = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('studio');
    url.hash = '';
    window.history.pushState({}, '', url.pathname + url.search);
    setRouteState({ isStudio: false, options: null });
    window.scrollTo(0, 0);
  }, []);

  if (routeState.isStudio) {
    return (
      <App
        key={`studio-${launchCount}-${routeState.options?.themeId || 'default'}-${routeState.options?.layout || 'default'}`}
        onGoHome={goHome}
        initialThemeId={routeState.options?.themeId}
        initialMode={routeState.options?.mode}
        initialLayout={routeState.options?.layout}
      />
    );
  }

  return <LandingPage onOpenStudio={goStudio} />;
}

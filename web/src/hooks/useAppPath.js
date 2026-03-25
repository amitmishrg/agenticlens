import { useCallback, useEffect, useState } from 'react';

export function isAppPath(pathname) {
  return pathname === '/app' || pathname.startsWith('/app/');
}

export function useAppPath() {
  const [pathname, setPathname] = useState(
    () => (typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  const navigate = useCallback((to) => {
    if (typeof window === 'undefined') return;
    window.history.pushState({}, '', to);
    setPathname(to);
  }, []);

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return {
    pathname,
    navigate,
    isApp: isAppPath(pathname),
  };
}

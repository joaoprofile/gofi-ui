import { useEffect, useState } from 'react';

/** Simple hash-based routing (#/button). No router dependency. */
export function useHashRoute(): [string, (id: string) => void] {
  const read = () => window.location.hash.replace(/^#\/?/, '') || 'introducao';
  const [route, setRoute] = useState<string>(read);

  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (id: string) => {
    window.location.hash = `/${id}`;
    window.scrollTo({ top: 0 });
  };

  return [route, navigate];
}

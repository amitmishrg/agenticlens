import { Analytics } from '@vercel/analytics/react';

import LandingPage from '@/pages/LandingPage';
import AppWorkspace from '@/AppWorkspace';
import { useAppPath } from '@/hooks/useAppPath';

export default function App() {
  const { isApp, navigate } = useAppPath();

  return (
    <>
      {isApp ? <AppWorkspace /> : <LandingPage onOpenWorkspace={() => navigate('/app')} />}
      <Analytics />
    </>
  );
}

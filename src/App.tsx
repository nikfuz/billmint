import { ProProvider } from './lib/pro';
import { useRoute } from './lib/router';
import { Landing } from './pages/Landing';
import { PricingPage } from './pages/Pricing';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { SettingsPage } from './pages/Settings';
import { ClientsPage } from './pages/Clients';
import { UpgradeSuccess } from './pages/UpgradeSuccess';
import { AppShell, MarketingShell } from './components/Shell';

function Router() {
  const route = useRoute();
  const [path, query = ''] = route.split('?');
  const q = new URLSearchParams(query);

  if (path === '/' || path === '') return <MarketingShell><Landing /></MarketingShell>;
  if (path === '/pricing') return <MarketingShell><PricingPage /></MarketingShell>;
  if (path === '/upgrade/success') return <MarketingShell><UpgradeSuccess /></MarketingShell>;
  if (path === '/app') return <AppShell active="docs"><Dashboard /></AppShell>;
  if (path === '/app/new') return <AppShell active="docs" wide><Editor key={route} kind={q.get('kind') === 'quote' ? 'quote' : 'invoice'} /></AppShell>;
  if (path.startsWith('/app/edit/')) return <AppShell active="docs" wide><Editor key={path} id={path.slice('/app/edit/'.length)} /></AppShell>;
  if (path === '/app/clients') return <AppShell active="clients"><ClientsPage /></AppShell>;
  if (path === '/app/settings') return <AppShell active="settings"><SettingsPage /></AppShell>;
  return (
    <MarketingShell>
      <div className="max-w-xl mx-auto py-32 text-center px-6">
        <h1 className="font-display text-5xl">Page not found</h1>
        <a href="#/" className="btn-dark mt-8">Back home</a>
      </div>
    </MarketingShell>
  );
}

export default function App() {
  return (
    <ProProvider>
      <Router />
    </ProProvider>
  );
}

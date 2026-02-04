import { type Locale } from '../../i18n-config';
import { getDictionary } from '../get-dictionary';
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import AppContent from '../components/AppContent';

export default async function IndexPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <ThemeRegistry>
       {/* 
          We need to pass client-side props to client components.
          Theme toggle logic is inside ThemeRegistry, but we need to expose controls to Header.
          Header is a client component, so it can manage its own state or consume a context.
          For simplicity in this setup, ThemeRegistry wraps everything and provides the ThemeProvider.
          But to toggle the theme from the Header, we might need a context inside ThemeRegistry.
          
          However, our ThemeRegistry is a wrapper. Let's make a slight adjustment:
          We will assume ThemeRegistry handles the providing of the theme context.
          For the Toggle button in Header to work, it needs access to the setMode from ThemeRegistry.
          
          Since ThemeRegistry is a Client Component that renders children, we can pass the toggle function down 
          ONLY if we lift the state up or use a Context.
          
          Refactoring ThemeRegistry to export a Context or simple prop drilling isn't easy across Server/Client boundary 
          if ThemeRegistry wraps the Server Component page.
          
          A better approach for Next.js App Dir:
          Create a 'ThemeContext.tsx' or similar inside ThemeRegistry directory and use it.
          
          For now, I'll update ThemeRegistry to provide a Context that Header can consume.
        */}
      <AppContent dictionary={dictionary} />
    </ThemeRegistry>
  );    
}

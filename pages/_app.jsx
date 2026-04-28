// pages/_app.jsx
import Head from 'next/head';
import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { I18nProvider } from '../hooks/useI18n';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>GraamVidya — Learn, Grow, Achieve</title>
        <meta name="description" content="GraamVidya — India's learning platform for students. Free courses, AI mentor, certificates." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <AuthProvider>
        <I18nProvider>
          <Component {...pageProps} />
        </I18nProvider>
      </AuthProvider>
    </>
  );
}

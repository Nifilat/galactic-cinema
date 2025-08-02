import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Providers from '../components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Galactic Cinema - Star Wars Movie Portal',
  description:
    'Explore the complete Star Wars movie collection with detailed information about each film in the saga.',
  keywords: 'Star Wars, movies, films, space, sci-fi, entertainment',
  authors: [{ name: 'Galactic Cinema Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Galactic Cinema - Star Wars Movie Portal',
    description: 'Explore the complete Star Wars movie collection',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
            <Providers>
              {children}
            </Providers>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

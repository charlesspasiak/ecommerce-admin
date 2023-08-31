import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

import '../globals.css';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center h-full">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}

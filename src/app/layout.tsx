import '@/styles/global.css';

import type { Metadata } from 'next';

import { AuthProvider } from '@/components/AuthProvider';
import { AppConfig } from '@/utils/AppConfig';

export const metadata: Metadata = {
  title: AppConfig.name,
  description: AppConfig.description,
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{props.children}</AuthProvider>
      </body>
    </html>
  );
}

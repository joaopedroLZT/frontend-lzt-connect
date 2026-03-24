import Link from 'next/link';
import { type ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

const BaseTemplate = (props: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8">
        <header className="mb-10 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Link href="/" className="text-xl font-semibold tracking-tight">
                {AppConfig.name}
              </Link>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {AppConfig.description}
              </p>
            </div>

            <nav aria-label="Navegacao principal">
              <ul className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {AppConfig.navigation.map(item => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-1">{props.children}</main>

        <footer className="mt-10 border-t border-white/10 py-6 text-sm text-slate-400">
          <p>
            {new Date().getFullYear()} {AppConfig.name}. Base frontend focada em
            clareza, manutencao e evolucao rapida.
          </p>
        </footer>
      </div>
    </div>
  );
};

export { BaseTemplate };

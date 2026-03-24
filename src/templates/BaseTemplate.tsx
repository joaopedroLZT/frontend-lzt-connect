'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

import type { UserRole } from '@/types/auth';

import { Button } from '@/components/Button';
import { useAuth } from '@/components/AuthProvider';
import { AppConfig } from '@/utils/AppConfig';

const BaseTemplate = (props: {
  children: ReactNode;
  currentPath?: string;
}) => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#1d2433] antialiased">
      <div className="flex min-h-screen w-full">
        <aside className="hidden min-h-screen w-64 flex-none border-r border-slate-200 bg-white px-6 py-8 lg:flex lg:flex-col">
          <div className="flex items-center">
            <Image
              src="/assets/logo/lzt-connect.svg"
              alt="LZT Connect"
              width={140}
              height={30}
              priority
            />
          </div>

          <div className="mt-12 space-y-10">
            {AppConfig.sidebarGroups.map(group => {
              const visibleItems = group.items.filter(item => {
                if (!item.roles?.length) {
                  return true;
                }

                return item.roles.includes((user?.role ?? 'USER') as UserRole);
              });

              if (!visibleItems.length) {
                return null;
              }

              return (
                <section key={group.title}>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {group.title}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {visibleItems.map(item => {
                      const isActive = item.href === props.currentPath;

                      return (
                        <li key={`${group.title}-${item.label}`}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                              isActive
                                ? 'bg-[#e8f0ff] text-[#2463eb]'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs ${
                                isActive
                                  ? 'bg-white text-[#2463eb] shadow-sm'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              {item.label.charAt(0)}
                            </span>
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
            <div className="flex items-center lg:hidden">
              <Image
                src="/assets/logo/lzt-connect.svg"
                alt="LZT Connect"
                width={124}
                height={26}
                priority
              />
            </div>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 md:block">
                {user ? `${user.firstname} ${user.lastname}`.trim() : 'Sessao'}
              </div>

              <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 shadow-sm">
                {user?.role ?? 'USER'}
              </div>

              <Link
                href="/minha-conta"
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-slate-300 hover:text-slate-600"
                aria-label="Perfil"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M3.75 14.25C4.7 11.95 6.54 10.8 9 10.8C11.46 10.8 13.3 11.95 14.25 14.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>

              <Button variant="secondary" onClick={logout} className="py-2">
                Sair
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 pb-8 sm:px-6 lg:px-8 xl:px-10">{props.children}</main>
        </div>
      </div>
    </div>
  );
};

export { BaseTemplate };

import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode } from 'react';

type AuthShellProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  footer?: ReactNode;
  heroDescription: string;
  heroTitle: string;
  title: string;
};

const AuthShell = (props: AuthShellProps) => {
  return (
    <main className="flex min-h-screen bg-[#f7f8fc]">
      <section className="hidden flex-1 bg-[#131c29] lg:flex lg:items-center lg:justify-center lg:p-10">
        <div className="relative flex h-full w-full max-w-3xl overflow-hidden rounded-[2rem] bg-[#111827]">
          <Image
            src="/assets/background/background-5.webp"
            alt=""
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(12,18,31,0.96)_0%,rgba(12,18,31,0.78)_100%)]" />

          <div className="relative z-10 flex flex-col justify-between p-10 text-white">
            <div>
              <Link href="/login" className="inline-flex">
                <Image
                  src="/assets/logo/lzt-connect.svg"
                  alt="LZT Connect"
                  width={150}
                  height={32}
                  priority
                />
              </Link>
              <h1 className="mt-10 max-w-lg text-4xl font-semibold leading-tight">
                {props.heroTitle}
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                {props.heroDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full items-center justify-center px-6 py-10 lg:max-w-xl lg:px-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_1.25rem_3rem_rgba(15,23,42,0.08)] sm:p-10">
          <Link href="/login" className="inline-flex lg:hidden">
            <Image
              src="/assets/logo/lzt-connect.svg"
              alt="LZT Connect"
              width={144}
              height={30}
              priority
            />
          </Link>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#2463eb]">
            {props.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">
            {props.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {props.description}
          </p>

          <div className="mt-8">{props.children}</div>

          {props.footer ? (
            <div className="mt-6 border-t border-slate-100 pt-5 text-sm text-slate-500">
              {props.footer}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
};

export { AuthShell };

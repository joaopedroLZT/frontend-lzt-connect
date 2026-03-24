import Image from 'next/image';

import { AuthGuard } from '@/components/AuthGuard';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function Home() {
  return (
    <AuthGuard>
      <BaseTemplate currentPath="/">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.85fr)_minmax(18rem,22rem)] xl:items-stretch">
          <article className="relative overflow-hidden rounded-[1.75rem] bg-[#131c29] px-6 py-5 text-white shadow-[0_1.5rem_4rem_rgba(15,23,42,0.18)] sm:px-8 sm:py-6 lg:px-10 xl:min-h-[12rem]">
            <Image
              src="/assets/background/background-5.webp"
              alt=""
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,18,31,0.97)_0%,rgba(12,18,31,0.9)_36%,rgba(12,18,31,0.62)_100%)]" />

            <div className="relative z-10 grid min-h-[12rem] gap-4 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center xl:min-h-[12rem]">
              <div className="max-w-md">
                <p className="text-sm font-medium text-slate-300">
                  Painel inicial
                </p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[1.85rem]">
                  Seja bem-vindo
                  <br />
                  ao LZT Connect
                </h1>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300 sm:max-w-sm sm:text-[0.9375rem]">
                  Mantenha-se atualizado(a) sobre suas vendas, acompanhe metas e
                  visualize rapidamente o que precisa de atencao.
                </p>
              </div>

              <div className="relative flex min-h-[7rem] items-end justify-center lg:justify-end">
                <div className="absolute bottom-2 left-1/2 h-14 w-14 -translate-x-1/2 rounded-full bg-[#2d6eff]/25 blur-3xl lg:left-auto lg:right-7 lg:translate-x-0" />
                <Image
                  src="/assets/illustrations/character-3.webp"
                  alt="Personagem de apoio visual"
                  width={240}
                  height={240}
                  className="relative z-10 h-auto w-24 sm:w-28 lg:w-32"
                  priority
                />
              </div>
            </div>
          </article>

          <aside className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1.5rem_4rem_rgba(15,23,42,0.08)] xl:min-h-[12rem]">
            <div className="relative min-h-[12rem] h-full w-full xl:min-h-[12rem]">
              <Image
                src="/assets/images/imagem1.png"
                alt="Oferta da semana do usuario"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </aside>
        </section>
      </BaseTemplate>
    </AuthGuard>
  );
}

import { FeatureCard } from '@/components/FeatureCard';
import { SectionTitle } from '@/components/SectionTitle';
import { BaseTemplate } from '@/templates/BaseTemplate';

const highlights = [
  {
    title: 'Estrutura clara',
    description:
      'Uma base pequena, organizada e facil de navegar para acelerar alteracoes sem carregar regras desnecessarias.',
  },
  {
    title: 'Componentizacao simples',
    description:
      'Componentes reaproveitaveis e estilos consistentes para manter padrao visual e evolucao segura.',
  },
  {
    title: 'Responsividade desde o inicio',
    description:
      'Layout preparado para desktop e mobile com foco em legibilidade, ritmo e manutencao.',
  },
];

const workflow = [
  'Criar novas secoes e componentes com Tailwind de forma padronizada.',
  'Consumir dados do seu backend sem acoplar regras de banco ao frontend.',
  'Adaptar o visual por pagina sem lutar contra um boilerplate excessivo.',
];

export default function Home() {
  return (
    <BaseTemplate>
      <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-transparent px-6 py-10 sm:px-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            Frontend puro
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Uma base mais leve para construir a interface do seu projeto com
            velocidade e consistencia.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            O projeto agora esta focado no que interessa para esta etapa:
            interface responsiva, organizacao de componentes e liberdade para
            integrar com o backend que voce ja possui.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            O que ficou
          </p>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
            <li>Next.js com App Router</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Estrutura preparada para crescer sem bagunca</li>
          </ul>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle
          eyebrow="Base visual"
          title="O boilerplate foi reduzido ao essencial."
          description="Removemos banco, migrations, autenticacao, testes, monitoramento e referencias ao repositorio original para voce comecar com uma fundacao mais limpa."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {highlights.map(item => (
            <FeatureCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 sm:px-8">
        <SectionTitle
          eyebrow="Proximo passo"
          title="Pronto para receber seu design e as chamadas ao backend."
          description="A partir daqui, a evolucao natural e criar os componentes reais do seu produto e conectar as telas as APIs que ja existem."
        />

        <ul className="mt-8 grid gap-4 text-sm leading-6 text-slate-300 md:grid-cols-3">
          {workflow.map(item => (
            <li
              key={item}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
    </BaseTemplate>
  );
}

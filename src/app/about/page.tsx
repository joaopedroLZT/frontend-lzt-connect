import { SectionTitle } from '@/components/SectionTitle';
import { BaseTemplate } from '@/templates/BaseTemplate';

const principles = [
  'Padrao visual consistente para facilitar manutencao.',
  'Componentes pequenos e reaproveitaveis.',
  'Layout responsivo como comportamento padrao, nao excecao.',
  'Integracao pensada para consumir um backend ja existente.',
];

export default function AboutPage() {
  return (
    <BaseTemplate>
      <section className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 sm:px-8">
        <SectionTitle
          eyebrow="Sobre a base"
          title="Um ponto de partida mais simples e profissional."
          description="Esta estrutura foi preparada para servir como frontend desacoplado, sem responsabilidades de banco, autenticacao interna ou rotinas de teste herdadas do boilerplate original."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {principles.map(item => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm leading-6 text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </BaseTemplate>
  );
}

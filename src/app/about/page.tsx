import { AuthGuard } from '@/components/AuthGuard';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function AboutPage() {
  return (
    <AuthGuard>
      <BaseTemplate currentPath="/about">
        <section className="rounded-[26px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#2463eb]">
            Sobre
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Base inicial do frontend
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
            Esta pagina pode ser adaptada depois com o conteudo real do projeto.
            Por enquanto, ela serve como segunda rota para a navegacao lateral e
            para manter a estrutura do dashboard organizada.
          </p>
        </section>
      </BaseTemplate>
    </AuthGuard>
  );
}

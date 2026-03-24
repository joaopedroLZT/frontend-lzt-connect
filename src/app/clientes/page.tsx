import { AuthGuard } from '@/components/AuthGuard';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function ClientesPage() {
  return (
    <AuthGuard>
      <BaseTemplate currentPath="/clientes">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_1.25rem_3rem_rgba(15,23,42,0.05)]">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2463eb]">
            Clientes
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Modulo em preparacao
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
            Esta area ficou separada da listagem de usuarios para respeitar as
            permissoes do backend. Quando voce me passar o endpoint de clientes,
            eu conecto essa tela ao dado real seguindo o mesmo padrao visual.
          </p>
        </section>
      </BaseTemplate>
    </AuthGuard>
  );
}

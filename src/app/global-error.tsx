'use client';

export default function GlobalError(props: { error: Error & { digest?: string } }) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-100">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              Algo saiu do esperado
            </p>
            <h1 className="mt-4 text-3xl font-semibold">
              O frontend encontrou um erro inesperado.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Revise o componente ou a rota que esta em desenvolvimento e tente
              novamente.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}

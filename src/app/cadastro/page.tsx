import { AuthShell } from '@/components/AuthShell';
import { SignupForm } from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Cadastro"
      title="Crie seu usuario"
      description="Preencha os dados abaixo para registrar um novo acesso no sistema."
      heroTitle="Comece seu acesso com uma base simples e segura."
      heroDescription="Cadastro publico integrado ao backend, com estrutura pronta para seguir o mesmo padrao visual do restante do sistema."
    >
      <SignupForm />
    </AuthShell>
  );
}

import { AuthShell } from '@/components/AuthShell';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Login"
      title="Entre na sua conta"
      description="Use seu e-mail e senha para acessar o sistema."
      heroTitle="Acesse o painel e gerencie tudo com seguranca."
      heroDescription="Login com JWT, refresh automatico de sessao e visibilidade de funcionalidades por perfil."
    >
      <LoginForm />
    </AuthShell>
  );
}

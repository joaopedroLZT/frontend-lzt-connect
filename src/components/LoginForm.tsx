'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { useAuth } from '@/components/AuthProvider';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasRegistrationSuccess = searchParams.get('registered') === '1';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.replace('/');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Nao foi possivel entrar.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
          placeholder="Digite sua senha"
          required
        />
      </div>

      {errorMessage ? (
        <p className="rounded-xl bg-[#ffe0db] px-4 py-3 text-sm text-[#b93c2c]">
          {errorMessage}
        </p>
      ) : null}

      {hasRegistrationSuccess ? (
        <p className="rounded-xl bg-[#e8f8ee] px-4 py-3 text-sm text-[#227a4b]">
          Cadastro realizado com sucesso. Agora voce ja pode entrar.
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Ainda nao tem conta?{' '}
        <Link href="/cadastro" className="font-semibold text-[#2463eb]">
          Criar usuario
        </Link>
      </p>
    </form>
  );
};

export { LoginForm };

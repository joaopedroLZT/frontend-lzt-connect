'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { useAuth } from '@/components/AuthProvider';
import { API_BASE_URL } from '@/utils/api';

const formatBirthday = (value: string) => {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');

  return `${day}/${month}/${year}`;
};

const SignupForm = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    birthday: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm(current => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (form.password.length < 7) {
      setErrorMessage('A senha deve ter no minimo 7 caracteres.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('A confirmacao de senha nao confere.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstname: form.firstname,
          lastname: form.lastname,
          birthday: formatBirthday(form.birthday),
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          zip_code: form.zip_code,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(error?.message ?? 'Nao foi possivel cadastrar o usuario.');
      }

      router.push('/login?registered=1');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel cadastrar o usuario.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="firstname">
            Nome
          </label>
          <input
            id="firstname"
            type="text"
            value={form.firstname}
            onChange={event => updateField('firstname', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="Joao"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="lastname">
            Sobrenome
          </label>
          <input
            id="lastname"
            type="text"
            value={form.lastname}
            onChange={event => updateField('lastname', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="Silva"
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="birthday">
            Data de nascimento
          </label>
          <input
            id="birthday"
            type="date"
            value={form.birthday}
            onChange={event => updateField('birthday', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="phone">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={event => updateField('phone', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="11999999999"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600" htmlFor="street">
          Rua
        </label>
        <input
          id="street"
          type="text"
          value={form.street}
          onChange={event => updateField('street', event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
          placeholder="Rua das Flores, 123"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_7rem_9rem]">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="city">
            Cidade
          </label>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={event => updateField('city', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="Sao Paulo"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="state">
            UF
          </label>
          <input
            id="state"
            type="text"
            maxLength={2}
            value={form.state}
            onChange={event => updateField('state', event.target.value.toUpperCase())}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="SP"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="zip_code">
            CEP
          </label>
          <input
            id="zip_code"
            type="text"
            value={form.zip_code}
            onChange={event => updateField('zip_code', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="01310-100"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-600" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={event => updateField('email', event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
          placeholder="seu@email.com"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={event => updateField('password', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="Minimo de 7 caracteres"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-600" htmlFor="confirmPassword">
            Confirmar senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={event => updateField('confirmPassword', event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
            placeholder="Repita a senha"
            required
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="rounded-xl bg-[#ffe0db] px-4 py-3 text-sm text-[#b93c2c]">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Ja tem conta?{' '}
        <Link href="/login" className="font-semibold text-[#2463eb]">
          Entrar no sistema
        </Link>
      </p>
    </form>
  );
};

export { SignupForm };

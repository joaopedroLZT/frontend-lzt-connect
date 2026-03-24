'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { useAuth } from '@/components/AuthProvider';
import { apiFetch } from '@/utils/api';

const formatBirthdayForInput = (value: string) => {
  if (!value) {
    return '';
  }

  if (value.includes('T')) {
    return value.slice(0, 10);
  }

  const [day, month, year] = value.split('/');

  if (day && month && year) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return '';
};

const formatBirthdayForApi = (value: string) => {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');

  return `${day}/${month}/${year}`;
};

const AccountSettings = () => {
  const { refreshProfile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [profileForm, setProfileForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    birthday: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirmPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      firstname: user.firstname ?? '',
      lastname: user.lastname ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      birthday: formatBirthdayForInput(user.birthday ?? ''),
      street: user.street ?? '',
      city: user.city ?? '',
      state: user.state ?? '',
      zip_code: user.zip_code ?? '',
    });
  }, [user]);

  const updateProfileField = (
    field: keyof typeof profileForm,
    value: string,
  ) => {
    setProfileForm(current => ({
      ...current,
      [field]: value,
    }));
  };

  const updatePasswordField = (
    field: keyof typeof passwordForm,
    value: string,
  ) => {
    setPasswordForm(current => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setIsSavingProfile(true);

    try {
      const response = await apiFetch('/users', {
        method: 'PATCH',
        body: JSON.stringify({
          firstname: profileForm.firstname,
          lastname: profileForm.lastname,
          email: profileForm.email,
          phone: profileForm.phone,
          birthday: formatBirthdayForApi(profileForm.birthday),
          street: profileForm.street,
          city: profileForm.city,
          state: profileForm.state,
          zip_code: profileForm.zip_code,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(error?.message ?? 'Nao foi possivel atualizar o perfil.');
      }

      await refreshProfile();
      setProfileMessage('Dados atualizados com sucesso.');
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel atualizar o perfil.',
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.new_password.length < 7) {
      setPasswordError('A nova senha deve ter no minimo 7 caracteres.');
      return;
    }

    if (passwordForm.old_password === passwordForm.new_password) {
      setPasswordError('A nova senha deve ser diferente da senha atual.');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirmPassword) {
      setPasswordError('A confirmacao da nova senha nao confere.');
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await apiFetch('/users/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(error?.message ?? 'Nao foi possivel alterar a senha.');
      }

      setPasswordForm({
        old_password: '',
        new_password: '',
        confirmPassword: '',
      });
      setPasswordMessage('Senha alterada com sucesso.');
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : 'Nao foi possivel alterar a senha.',
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2463eb]">
          Minha conta
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Gerencie seus dados e sua seguranca
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Atualize as informacoes do seu perfil e altere sua senha em uma area
          separada do restante do painel.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_1.25rem_3rem_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200 px-4 pt-4 sm:px-6">
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`border-b-2 pb-3 transition ${
                activeTab === 'profile'
                  ? 'border-[#243142] text-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Dados do usuario
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`border-b-2 pb-3 transition ${
                activeTab === 'password'
                  ? 'border-[#243142] text-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Alterar senha
            </button>
          </div>
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="space-y-5 px-4 py-6 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="firstname">
                  Nome
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={profileForm.firstname}
                  onChange={event => updateProfileField('firstname', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="lastname">
                  Sobrenome
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={profileForm.lastname}
                  onChange={event => updateProfileField('lastname', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="email">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={event => updateProfileField('email', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="phone">
                  Telefone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={event => updateProfileField('phone', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_8rem_10rem]">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="city">
                  Cidade
                </label>
                <input
                  id="city"
                  type="text"
                  value={profileForm.city}
                  onChange={event => updateProfileField('city', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
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
                  value={profileForm.state}
                  onChange={event => updateProfileField('state', event.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="zip_code">
                  CEP
                </label>
                <input
                  id="zip_code"
                  type="text"
                  value={profileForm.zip_code}
                  onChange={event => updateProfileField('zip_code', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_12rem]">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="street">
                  Rua
                </label>
                <input
                  id="street"
                  type="text"
                  value={profileForm.street}
                  onChange={event => updateProfileField('street', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="birthday">
                  Nascimento
                </label>
                <input
                  id="birthday"
                  type="date"
                  value={profileForm.birthday}
                  onChange={event => updateProfileField('birthday', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>
            </div>

            {profileError ? (
              <p className="rounded-xl bg-[#ffe0db] px-4 py-3 text-sm text-[#b93c2c]">
                {profileError}
              </p>
            ) : null}

            {profileMessage ? (
              <p className="rounded-xl bg-[#e8f8ee] px-4 py-3 text-sm text-[#227a4b]">
                {profileMessage}
              </p>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? 'Salvando...' : 'Salvar alteracoes'}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-5 px-4 py-6 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="old_password">
                  Senha atual
                </label>
                <input
                  id="old_password"
                  type="password"
                  value={passwordForm.old_password}
                  onChange={event => updatePasswordField('old_password', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="new_password">
                  Nova senha
                </label>
                <input
                  id="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={event => updatePasswordField('new_password', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-600" htmlFor="confirmPassword">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={event => updatePasswordField('confirmPassword', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                />
              </div>
            </div>

            {passwordError ? (
              <p className="rounded-xl bg-[#ffe0db] px-4 py-3 text-sm text-[#b93c2c]">
                {passwordError}
              </p>
            ) : null}

            {passwordMessage ? (
              <p className="rounded-xl bg-[#e8f8ee] px-4 py-3 text-sm text-[#227a4b]">
                {passwordMessage}
              </p>
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? 'Alterando...' : 'Atualizar senha'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export { AccountSettings };

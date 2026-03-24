'use client';

import { useEffect, useState } from 'react';

import { apiFetch } from '@/utils/api';
import { Button } from '@/components/Button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useAuth } from '@/components/AuthProvider';
import { DataTable, type Column } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { TableColumnForm } from '@/components/TableColumnForm';

type UserRole = string;

type ApiUser = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  birthday: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  role: UserRole;
};

type CustomersTableSectionProps = {
  actionLabel: string;
  title: string;
};

const columnOptions = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'E-mail' },
  { key: 'phone', label: 'Telefone' },
  { key: 'location', label: 'Localidade' },
  { key: 'role', label: 'Perfil' },
];

const formatRoleLabel = (role: UserRole) => role;

const formatDateValue = (dateValue: string) => new Date(dateValue).getTime();

const CustomersTableSection = (props: CustomersTableSectionProps) => {
  const { refreshProfile, user: currentUser } = useAuth();
  const [activeStatus, setActiveStatus] = useState<'todos' | UserRole>('todos');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [visibleColumns, setVisibleColumns] = useState(
    columnOptions.map(option => option.key),
  );
  const [sortDraft, setSortDraft] = useState('recentes');
  const [sortApplied, setSortApplied] = useState('recentes');
  const [roleDrafts, setRoleDrafts] = useState<Record<string, string>>({});
  const [savingRoleId, setSavingRoleId] = useState('');
  const [roleMessage, setRoleMessage] = useState('');
  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    nextRole: string;
    previousRole: string;
    userId: string;
    userName: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await apiFetch('/users', {
          method: 'GET',
        });

        if (!response.ok) {
          const error = (await response.json().catch(() => null)) as {
            message?: string;
          } | null;

          throw new Error(
            error?.message ?? 'Nao foi possivel carregar os usuarios.',
          );
        }

        const data = (await response.json()) as ApiUser[];

        if (isMounted) {
          setUsers(data);
          setRoleDrafts(
            data.reduce<Record<string, string>>((accumulator, item) => {
              accumulator[item.id] = item.role;
              return accumulator;
            }, {}),
          );
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Ocorreu um erro ao carregar os usuarios.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const availableRoles = Array.from(
    new Set(['ADMIN', 'USER', ...users.map(item => item.role).filter(Boolean)]),
  ).sort((left, right) => left.localeCompare(right, 'pt-BR'));

  const filteredRows = users
    .filter(user => {
      const matchesStatus =
        activeStatus === 'todos' || user.role === activeStatus;
      const normalizedSearch = search.toLowerCase();
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();
      const cityAndState = `${user.city} ${user.state}`.toLowerCase();
      const matchesSearch =
        !normalizedSearch
        || fullName.includes(normalizedSearch)
        || user.email.toLowerCase().includes(normalizedSearch)
        || user.phone.toLowerCase().includes(normalizedSearch)
        || cityAndState.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    })
    .sort((left, right) => {
      if (sortApplied === 'nome-az') {
        return `${left.firstname} ${left.lastname}`.localeCompare(
          `${right.firstname} ${right.lastname}`,
          'pt-BR',
        );
      }

      if (sortApplied === 'nome-za') {
        return `${right.firstname} ${right.lastname}`.localeCompare(
          `${left.firstname} ${left.lastname}`,
          'pt-BR',
        );
      }

      if (sortApplied === 'antigos') {
        return formatDateValue(left.created_at) - formatDateValue(right.created_at);
      }

      return formatDateValue(right.created_at) - formatDateValue(left.created_at);
    });

  const statusTabs = [
    {
      key: 'todos' as const,
      label: 'Todos',
      count: users.length,
      accent: 'bg-[#243142] text-white',
    },
    ...availableRoles.map(role => ({
      key: role,
      label: role,
      count: users.filter(user => user.role === role).length,
      accent: '',
    })),
  ];

  const handleRoleChange = async () => {
    if (!roleChangeTarget) {
      return;
    }

    const row = users.find(item => item.id === roleChangeTarget.userId);
    const nextRole = roleChangeTarget.nextRole;

    if (!row || !nextRole || nextRole === row.role) {
      setRoleChangeTarget(null);
      return;
    }

    setSavingRoleId(row.id);
    setErrorMessage('');
    setRoleMessage('');

    try {
      const response = await apiFetch('/users/role', {
        method: 'PATCH',
        body: JSON.stringify({
          user_id: row.id,
          role: nextRole,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;

        throw new Error(error?.message ?? 'Nao foi possivel alterar o cargo.');
      }

      setUsers(current =>
        current.map(item => (
          item.id === row.id
            ? {
                ...item,
                role: nextRole,
              }
            : item
        )),
      );
      setRoleMessage(`Cargo de ${row.firstname} atualizado para ${nextRole}.`);
      setRoleChangeTarget(null);

      if (currentUser?.id === row.id) {
        await refreshProfile();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Nao foi possivel alterar o cargo.',
      );
      setRoleDrafts(current => ({
        ...current,
        [row.id]: roleChangeTarget.previousRole,
      }));
    } finally {
      setSavingRoleId('');
    }
  };

  const columns: Column<ApiUser>[] = [
    {
      key: 'name',
      header: 'Nome',
      className: 'min-w-[16rem]',
      render: row => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0ff] text-sm font-semibold text-[#2463eb]">
            {row.firstname.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-800">
              {row.firstname} {row.lastname}
            </p>
            <p className="text-sm text-slate-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'E-mail',
      className: 'min-w-[14rem]',
      render: row => row.email,
    },
    {
      key: 'phone',
      header: 'Telefone',
      className: 'min-w-[11rem]',
      render: row => row.phone,
    },
    {
      key: 'location',
      header: 'Localidade',
      className: 'min-w-[12rem]',
      render: row => `${row.city} - ${row.state}`,
    },
    {
      key: 'role',
      header: 'Perfil',
      className: 'min-w-[12rem]',
      render: row => {
        const selectedRole = roleDrafts[row.id] ?? row.role;
        const roleClassName =
          selectedRole === 'ADMIN'
            ? 'bg-[#ffe0db] text-[#e1503f]'
            : selectedRole === 'USER'
              ? 'bg-[#dff5ff] text-[#0f97ca]'
              : 'bg-[#e8f0ff] text-[#2463eb]';

        return (
        <div className="relative inline-flex">
          <select
            value={selectedRole}
            onChange={event => {
              const nextRole = event.target.value;

              setRoleDrafts(current => ({
                ...current,
                [row.id]: nextRole,
              }));

              if (nextRole !== row.role) {
                setRoleChangeTarget({
                  nextRole,
                  previousRole: row.role,
                  userId: row.id,
                  userName: `${row.firstname} ${row.lastname}`.trim(),
                });
              }
            }}
            className={`min-w-[9rem] appearance-none rounded-xl border-0 px-3 py-2 pr-9 text-sm font-semibold outline-none transition ${roleClassName}`}
          >
            {availableRoles.map(role => (
              <option key={`${row.id}-${role}`} value={role}>
                {role}
              </option>
            ))}
          </select>

          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        );
      },
    },
  ].filter(column => visibleColumns.includes(column.key));

  return (
    <section className="space-y-6">
      <ConfirmDialog
        isOpen={Boolean(roleChangeTarget)}
        isLoading={Boolean(savingRoleId)}
        title="Confirmar alteracao de perfil"
        description={`Deseja realmente promover o perfil de ${roleChangeTarget?.userName ?? 'este usuario'} para ${roleChangeTarget?.nextRole ?? ''}?`}
        confirmLabel="Confirmar alteracao"
        onConfirm={handleRoleChange}
        onCancel={() => {
          if (roleChangeTarget) {
            setRoleDrafts(current => ({
              ...current,
              [roleChangeTarget.userId]: roleChangeTarget.previousRole,
            }));
          }

          setRoleChangeTarget(null);
        }}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">{props.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Listagem protegida por autenticacao com exibicao adaptada ao perfil
            do usuario.
          </p>
        </div>

        <Button
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3.333V12.667M3.333 8H12.667"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          }
        >
          {props.actionLabel}
        </Button>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_1.25rem_3rem_rgba(15,23,42,0.05)]">
        <div className="border-b border-slate-200 px-4 pt-4 sm:px-6">
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            {statusTabs.map(tab => {
              const isActive = tab.key === activeStatus;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveStatus(tab.key)}
                  className={`flex items-center gap-2 border-b-2 pb-3 transition ${
                    isActive
                      ? 'border-[#243142] text-slate-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'todos' ? (
                    <span
                      className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-semibold ${tab.accent}`}
                    >
                      {tab.count}
                    </span>
                  ) : (
                    <StatusBadge status={tab.key} label={String(tab.count)} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 px-4 py-4 sm:px-6">
          <div className="grid gap-3 xl:grid-cols-[12rem_minmax(0,1.8fr)_12rem] xl:items-end">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                Ordenar por
              </span>
              <select
                value={sortDraft}
                onChange={event => setSortDraft(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300"
              >
                <option value="recentes">Mais recentes</option>
                <option value="antigos">Mais antigos</option>
                <option value="nome-az">Nome A-Z</option>
                <option value="nome-za">Nome Z-A</option>
              </select>
            </label>

            <label className="flex items-end xl:justify-self-end xl:w-full">
              <span className="relative block w-full">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <circle
                    cx="7"
                    cy="7"
                    r="4.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10.5 10.5L13.25 13.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Procurar"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300"
                />
              </span>
            </label>

            <div className="flex items-end xl:justify-self-end">
              <Button
                variant="secondary"
                onClick={() => setSortApplied(sortDraft)}
                className="w-full whitespace-nowrap xl:min-w-[12rem]"
              >
                Aplicar filtro
              </Button>
            </div>
          </div>

          <TableColumnForm
            options={columnOptions}
            selected={visibleColumns}
            onChange={setVisibleColumns}
          />

          <div className="text-sm text-slate-500">
            {isLoading ? (
              <span>Carregando usuarios...</span>
            ) : errorMessage ? (
              <span className="text-[#e1503f]">{errorMessage}</span>
            ) : roleMessage ? (
              <span className="text-[#227a4b]">{roleMessage}</span>
            ) : (
              <>
                <span className="font-semibold text-slate-800">
                  {filteredRows.length}
                </span>{' '}
                resultados encontrados
              </>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={isLoading || errorMessage ? [] : filteredRows}
          rowKey={row => row.id}
          emptyMessage={
            errorMessage || 'Nenhum usuario encontrado para os filtros aplicados.'
          }
        />

        <div className="flex items-center justify-end gap-6 border-t border-slate-200 bg-white px-6 py-4 text-sm text-slate-500">
          <span>Pagina 1 de 1</span>

          <div className="flex items-center gap-2 text-slate-400">
            <button type="button" aria-label="Pagina anterior">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M11.25 13.5L6.75 9L11.25 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" aria-label="Proxima pagina">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M6.75 13.5L11.25 9L6.75 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CustomersTableSection };

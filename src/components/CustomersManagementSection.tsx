'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/Button';
import { DataTable, type Column } from '@/components/DataTable';
import { apiFetch } from '@/utils/api';

type ApiCustomer = {
  id: string;
  created_at: string;
  updated_at: string;
  razao_social: string;
  email?: string;
  cpf_cnpj?: string;
  tel?: string;
  celular?: string;
  cidade?: string;
  estado?: string;
};

type CustomerFormState = {
  razao_social: string;
  email: string;
  cpf_cnpj: string;
  tel: string;
  celular: string;
  cidade: string;
  estado: string;
  endereco: string;
};

const emptyForm: CustomerFormState = {
  razao_social: '',
  email: '',
  cpf_cnpj: '',
  tel: '',
  celular: '',
  cidade: '',
  estado: '',
  endereco: '',
};

const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#2463eb] focus:ring-4 focus:ring-[#2463eb]/10';

const CustomersManagementSection = () => {
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [form, setForm] = useState<CustomerFormState>(emptyForm);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await apiFetch('/customers', { method: 'GET' });

        if (!response.ok) {
          const error = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(error?.message ?? 'Nao foi possivel carregar os clientes.');
        }

        const data = (await response.json()) as ApiCustomer[];

        if (isMounted) {
          setCustomers(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel carregar os clientes.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.toLowerCase();

    return customers.filter(customer => (
      !normalizedSearch
      || customer.razao_social.toLowerCase().includes(normalizedSearch)
      || (customer.email ?? '').toLowerCase().includes(normalizedSearch)
      || (customer.cpf_cnpj ?? '').toLowerCase().includes(normalizedSearch)
      || `${customer.cidade ?? ''} ${customer.estado ?? ''}`.toLowerCase().includes(normalizedSearch)
    ));
  }, [customers, search]);

  const columns: Column<ApiCustomer>[] = [
    {
      key: 'name',
      header: 'Cliente',
      className: 'min-w-[16rem]',
      render: row => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0ff] text-sm font-semibold text-[#2463eb]">
            {row.razao_social.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-slate-800">{row.razao_social}</p>
            <p className="text-sm text-slate-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'E-mail',
      className: 'min-w-[14rem]',
      render: row => row.email || '-',
    },
    {
      key: 'document',
      header: 'Documento',
      className: 'min-w-[12rem]',
      render: row => row.cpf_cnpj || '-',
    },
    {
      key: 'phone',
      header: 'Contato',
      className: 'min-w-[12rem]',
      render: row => row.celular || row.tel || '-',
    },
    {
      key: 'location',
      header: 'Localidade',
      className: 'min-w-[12rem]',
      render: row => row.cidade && row.estado ? `${row.cidade} - ${row.estado}` : '-',
    },
  ];

  const handleCreateCustomer = async () => {
    if (!form.razao_social.trim()) {
      setErrorMessage('Razao social e obrigatoria para cadastrar cliente.');
      setSuccessMessage('');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify({
          razao_social: form.razao_social,
          email: form.email || undefined,
          cpf_cnpj: form.cpf_cnpj || undefined,
          tel: form.tel || undefined,
          celular: form.celular || undefined,
          cidade: form.cidade || undefined,
          estado: form.estado || undefined,
          endereco: form.endereco || undefined,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message;
        throw new Error(message ?? 'Nao foi possivel cadastrar o cliente.');
      }

      const createdCustomer = (await response.json()) as ApiCustomer;
      setCustomers(current => [createdCustomer, ...current]);
      setForm(emptyForm);
      setSuccessMessage('Cliente cadastrado com sucesso.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel cadastrar o cliente.');
      setSuccessMessage('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">Clientes</h1>
          <p className="mt-2 text-sm text-slate-500">
            Cadastro e listagem de clientes no mesmo padrao visual do projeto.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(current => !current)}
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
          Adicionar cliente
        </Button>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {isCreateOpen ? (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_1.25rem_3rem_rgba(15,23,42,0.05)]">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Novo cliente</h2>
          <p className="mt-1 text-sm text-slate-500">Os campos principais ficam disponiveis para uso imediato em vendas.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 xl:col-span-2">
            <span className="text-sm font-medium text-slate-700">Razao social *</span>
            <input value={form.razao_social} onChange={event => setForm(current => ({ ...current, razao_social: event.target.value }))} className={inputClassName} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">E-mail</span>
            <input value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} className={inputClassName} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">CPF/CNPJ</span>
            <input value={form.cpf_cnpj} onChange={event => setForm(current => ({ ...current, cpf_cnpj: event.target.value }))} className={inputClassName} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Telefone</span>
            <input value={form.tel} onChange={event => setForm(current => ({ ...current, tel: event.target.value }))} className={inputClassName} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Celular</span>
            <input value={form.celular} onChange={event => setForm(current => ({ ...current, celular: event.target.value }))} className={inputClassName} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Cidade</span>
            <input value={form.cidade} onChange={event => setForm(current => ({ ...current, cidade: event.target.value }))} className={inputClassName} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Estado</span>
            <input value={form.estado} onChange={event => setForm(current => ({ ...current, estado: event.target.value }))} className={inputClassName} />
          </label>
          <label className="space-y-2 xl:col-span-2">
            <span className="text-sm font-medium text-slate-700">Endereco</span>
            <input value={form.endereco} onChange={event => setForm(current => ({ ...current, endereco: event.target.value }))} className={inputClassName} />
          </label>
        </div>

        <div className="mt-5">
          <Button onClick={handleCreateCustomer} disabled={isSaving}>
            {isSaving ? 'Cadastrando...' : 'Cadastrar cliente'}
          </Button>
        </div>
      </div>
      ) : null}

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_1.25rem_3rem_rgba(15,23,42,0.05)]">
        <div className="space-y-4 px-4 py-4 sm:px-6">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_12rem] xl:items-end">
            <label className="flex items-end">
              <span className="relative block w-full">
                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Procurar cliente"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300"
                />
              </span>
            </label>

            <div className="text-sm text-slate-500 xl:text-right">
              {isLoading ? 'Carregando...' : `${filteredCustomers.length} cliente(s)`}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={filteredCustomers}
          rowKey={row => row.id}
          emptyMessage={isLoading ? 'Carregando clientes...' : 'Nenhum cliente encontrado.'}
        />
      </div>
    </section>
  );
};

export { CustomersManagementSection };

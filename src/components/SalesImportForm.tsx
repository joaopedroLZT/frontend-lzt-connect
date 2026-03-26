'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/Button';
import { apiFetch } from '@/utils/api';

type TabId =
  | 'cabecalho'
  | 'cliente'
  | 'venda'
  | 'rateio'
  | 'vendas-originais'
  | 'bilhetes-conjugados'
  | 'aereo'
  | 'trecho-por-bilhete'
  | 'hotel'
  | 'locacao'
  | 'outros'
  | 'pacotes'
  | 'outros-servicos';

type HeaderForm = {
  nr_arquivo: string;
  data_geracao: string;
  hora_geracao: string;
  nome_agencia: string;
  versao_xml: string;
};

type CustomerForm = {
  acao_cli: string;
  razao_social: string;
  tipo_endereco: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  tipo_fj: string;
  dt_nasc: string;
  tel: string;
  celular: string;
  cpf_cnpj: string;
  insc_identidade: string;
  sexo: string;
  dt_cadastro: string;
  email: string;
};

type ApiCustomer = CustomerForm & {
  id: string;
  created_at: string;
  updated_at: string;
};

type ValueForm = {
  codigo: string;
  valor: string;
  valor_df: string;
  valor_mp: string;
};

type ApportionmentForm = {
  ccustos_cliente: string;
  percentual: string;
};

type SalesOriginForm = {
  item: string;
};

type TicketConjugateForm = {
  item: string;
};

type SectionForm = {
  cia_iata: string;
  numero_voo: string;
  aeroporto_origem: string;
  aeroporto_destino: string;
  data_partida: string;
  hora_partida: string;
  data_chegada: string;
  hora_chegada: string;
  classe: string;
  base_tarifaria: string;
  ticket_designator: string;
};

type HotelForm = {
  nr_apts: string;
  categ_apt: string;
  tipo_apt: string;
  dt_check_in: string;
  dt_check_out: string;
  nr_hospedes: string;
  reg_alimentacao: string;
  cod_tipo_pagto: string;
  dt_confirmacao: string;
  confirmado_por: string;
};

type LocationForm = {
  cidade_retirada: string;
  local_retirada: string;
  dt_retirada: string;
  hr_retirada: string;
  local_devolucao: string;
  dt_devolucao: string;
  hr_devolucao: string;
  categ_veiculo: string;
  cod_tipo_pagto: string;
  dt_confirmacao: string;
  confirmado_por: string;
};

type OtherForm = {
  descricao: string;
};

type PackageForm = {
  cid_dest_principal: string;
  descricao_pacote: string;
  data_inicio_pacote: string;
  data_fim_pacote: string;
};

type OtherServicesForm = {
  cid_dest_principal: string;
  descricao_outros_svcs: string;
  data_inicio_outros_svcs: string;
  data_fim_outros_svcs: string;
};

type TicketForm = {
  selected_customer_id: string;
  user_id: string;
  num_bilhete: string;
  localizador: string;
  prestador_svc: string;
  fornecedor: string;
  passageiro: string;
  cliente: string;
  codigo_produto: string;
  forma_de_pagamento: string;
  data_lancamento: string;
  tipo_passageiro: string;
  moeda: string;
  canal_venda: string;
  tipo_roteiro_aereo: string;
  destino_rot_aereo: string;
  co2_kg: string;
  cid_dest_principal: string;
  tarifa_net: string;
  info_adicionais: string;
  info_internas: string;
  values: ValueForm[];
  apportionments: ApportionmentForm[];
  sales_origin: SalesOriginForm[];
  ticket_conjugate: TicketConjugateForm[];
  sections: SectionForm[];
  hotel: HotelForm;
  location: LocationForm;
  other: OtherForm;
  package: PackageForm;
  other_services: OtherServicesForm;
};

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'cabecalho', label: 'Cabecalho' },
  { id: 'cliente', label: 'Cliente' },
  { id: 'venda', label: 'Venda' },
  { id: 'rateio', label: 'Rateio CCustos Cli' },
  { id: 'vendas-originais', label: 'Vendas Originais' },
  { id: 'bilhetes-conjugados', label: 'Bilhetes Conjugados' },
  { id: 'aereo', label: 'Aereo' },
  { id: 'trecho-por-bilhete', label: 'Trecho por Bilhete' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'locacao', label: 'Locacao' },
  { id: 'outros', label: 'Outros' },
  { id: 'pacotes', label: 'Pacotes' },
  { id: 'outros-servicos', label: 'Outros Servicos' },
];

const cardClassName = 'rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_1.25rem_3rem_rgba(15,23,42,0.06)]';
const inputClassName = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#2463eb] focus:ring-4 focus:ring-[#2463eb]/10';
const textareaClassName = `${inputClassName} min-h-[96px] resize-y`;

const createCustomerForm = (): CustomerForm => ({
  acao_cli: '',
  razao_social: '',
  tipo_endereco: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cep: '',
  cidade: '',
  estado: '',
  tipo_fj: '',
  dt_nasc: '',
  tel: '',
  celular: '',
  cpf_cnpj: '',
  insc_identidade: '',
  sexo: '',
  dt_cadastro: '',
  email: '',
});

const createHeaderForm = (): HeaderForm => ({
  nr_arquivo: '',
  data_geracao: '',
  hora_geracao: '',
  nome_agencia: '',
  versao_xml: '5',
});

const createTicketForm = (): TicketForm => ({
  selected_customer_id: '',
  user_id: '',
  num_bilhete: '',
  localizador: '',
  prestador_svc: '',
  fornecedor: '',
  passageiro: '',
  cliente: '',
  codigo_produto: '',
  forma_de_pagamento: '',
  data_lancamento: '',
  tipo_passageiro: '',
  moeda: '',
  canal_venda: '',
  tipo_roteiro_aereo: '',
  destino_rot_aereo: '',
  co2_kg: '',
  cid_dest_principal: '',
  tarifa_net: '',
  info_adicionais: '',
  info_internas: '',
  values: [{ codigo: '', valor: '', valor_df: '', valor_mp: '' }],
  apportionments: [{ ccustos_cliente: '', percentual: '' }],
  sales_origin: [{ item: '' }],
  ticket_conjugate: [{ item: '' }],
  sections: [{
    cia_iata: '',
    numero_voo: '',
    aeroporto_origem: '',
    aeroporto_destino: '',
    data_partida: '',
    hora_partida: '',
    data_chegada: '',
    hora_chegada: '',
    classe: '',
    base_tarifaria: '',
    ticket_designator: '',
  }],
  hotel: {
    nr_apts: '',
    categ_apt: '',
    tipo_apt: '',
    dt_check_in: '',
    dt_check_out: '',
    nr_hospedes: '',
    reg_alimentacao: '',
    cod_tipo_pagto: '',
    dt_confirmacao: '',
    confirmado_por: '',
  },
  location: {
    cidade_retirada: '',
    local_retirada: '',
    dt_retirada: '',
    hr_retirada: '',
    local_devolucao: '',
    dt_devolucao: '',
    hr_devolucao: '',
    categ_veiculo: '',
    cod_tipo_pagto: '',
    dt_confirmacao: '',
    confirmado_por: '',
  },
  other: {
    descricao: '',
  },
  package: {
    cid_dest_principal: '',
    descricao_pacote: '',
    data_inicio_pacote: '',
    data_fim_pacote: '',
  },
  other_services: {
    cid_dest_principal: '',
    descricao_outros_svcs: '',
    data_inicio_outros_svcs: '',
    data_fim_outros_svcs: '',
  },
});

const toIsoString = (value: string) => (value ? new Date(value).toISOString() : undefined);

const toNumber = (value: string) => {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value.replace(',', '.'));
  return Number.isNaN(parsed) ? undefined : parsed;
};

const compactObject = <T extends Record<string, unknown>>(value: T) => (
  Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === undefined || item === null || item === '') {
        return false;
      }

      if (Array.isArray(item)) {
        return item.length > 0;
      }

      if (typeof item === 'object') {
        return Object.keys(item as Record<string, unknown>).length > 0;
      }

      return true;
    }),
  )
);

const Field = (props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'datetime-local';
}) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-slate-700">
      {props.label}
      {props.required ? ' *' : ''}
    </span>
    <input
      type={props.type ?? 'text'}
      value={props.value}
      onChange={event => props.onChange(event.target.value)}
      className={inputClassName}
    />
  </label>
);

const TextareaField = (props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-slate-700">
      {props.label}
      {props.required ? ' *' : ''}
    </span>
    <textarea
      value={props.value}
      onChange={event => props.onChange(event.target.value)}
      className={textareaClassName}
    />
  </label>
);

const SectionHeader = (props: { title: string; description: string }) => (
  <div className="mb-5">
    <h2 className="text-lg font-semibold text-slate-900">{props.title}</h2>
    <p className="mt-1 text-sm text-slate-500">{props.description}</p>
  </div>
);

const SalesImportForm = () => {
  const [activeTab, setActiveTab] = useState<TabId>('cabecalho');
  const [header, setHeader] = useState<HeaderForm>(createHeaderForm);
  const [customerDraft, setCustomerDraft] = useState<CustomerForm>(createCustomerForm);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [ticket, setTicket] = useState<TicketForm>(createTicketForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);

  const selectedCustomer = useMemo(
    () => customers.find(item => item.id === ticket.selected_customer_id) ?? null,
    [customers, ticket.selected_customer_id],
  );

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      try {
        setIsLoadingCustomers(true);

        const response = await apiFetch('/customers', {
          method: 'GET',
        });

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
          setIsLoadingCustomers(false);
        }
      }
    };

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  const payload = useMemo(() => {
    const customerPayload = selectedCustomer
      ? compactObject({
          razao_social: selectedCustomer.razao_social || undefined,
          endereco: selectedCustomer.endereco || undefined,
          numero: selectedCustomer.numero || undefined,
          complemento: selectedCustomer.complemento || undefined,
          bairro: selectedCustomer.bairro || undefined,
          cep: selectedCustomer.cep || undefined,
          cidade: selectedCustomer.cidade || undefined,
          estado: selectedCustomer.estado || undefined,
          tipo_fj: selectedCustomer.tipo_fj || undefined,
          dt_nasc: toIsoString(selectedCustomer.dt_nasc),
          tel: selectedCustomer.tel || undefined,
          celular: selectedCustomer.celular || undefined,
          cpf_cnpj: selectedCustomer.cpf_cnpj || undefined,
          insc_identidade: selectedCustomer.insc_identidade || undefined,
          sexo: selectedCustomer.sexo || undefined,
          dt_cadastro: toIsoString(selectedCustomer.dt_cadastro),
          email: selectedCustomer.email || undefined,
        })
      : undefined;

    return {
      nr_arquivo: header.nr_arquivo,
      data_geracao: header.data_geracao,
      hora_geracao: header.hora_geracao,
      nome_agencia: header.nome_agencia,
      versao_xml: Number(header.versao_xml) || 5,
      tickets: [
        compactObject({
          user_id: ticket.user_id || undefined,
          customer_id: ticket.selected_customer_id || undefined,
          num_bilhete: ticket.num_bilhete || undefined,
          localizador: ticket.localizador || undefined,
          prestador_svc: ticket.prestador_svc || undefined,
          fornecedor: ticket.fornecedor || undefined,
          passageiro: ticket.passageiro || undefined,
          cliente: (selectedCustomer?.razao_social ?? ticket.cliente) || undefined,
          codigo_produto: ticket.codigo_produto || undefined,
          forma_de_pagamento: ticket.forma_de_pagamento || undefined,
          data_lancamento: toIsoString(ticket.data_lancamento),
          tipo_passageiro: ticket.tipo_passageiro || undefined,
          moeda: ticket.moeda || undefined,
          canal_venda: ticket.canal_venda || undefined,
          tipo_roteiro_aereo: ticket.tipo_roteiro_aereo || undefined,
          destino_rot_aereo: ticket.destino_rot_aereo || undefined,
          co2_kg: toNumber(ticket.co2_kg),
          cid_dest_principal: ticket.cid_dest_principal || undefined,
          tarifa_net: toNumber(ticket.tarifa_net),
          info_adicionais: ticket.info_adicionais || undefined,
          info_internas: ticket.info_internas || undefined,
          values: ticket.values.map(item => compactObject({
            codigo: item.codigo || undefined,
            valor: toNumber(item.valor),
            valor_df: toNumber(item.valor_df),
            valor_mp: toNumber(item.valor_mp),
          })).filter(item => Object.keys(item).length > 0),
          apportionments: ticket.apportionments.map(item => compactObject({
            ccustos_cliente: item.ccustos_cliente || undefined,
            percentual: toNumber(item.percentual),
          })).filter(item => Object.keys(item).length > 0),
          sales_origin: ticket.sales_origin.map(item => compactObject({ item: toNumber(item.item) })).filter(item => Object.keys(item).length > 0),
          ticket_conjugate: ticket.ticket_conjugate.map(item => compactObject({ item: item.item || undefined })).filter(item => Object.keys(item).length > 0),
          sections: ticket.sections.map(item => compactObject({
            cia_iata: item.cia_iata || undefined,
            numero_voo: item.numero_voo || undefined,
            aeroporto_origem: item.aeroporto_origem || undefined,
            aeroporto_destino: item.aeroporto_destino || undefined,
            data_partida: toIsoString(item.data_partida),
            hora_partida: item.hora_partida || undefined,
            data_chegada: toIsoString(item.data_chegada),
            hora_chegada: item.hora_chegada || undefined,
            classe: item.classe || undefined,
            base_tarifaria: item.base_tarifaria || undefined,
            ticket_designator: item.ticket_designator || undefined,
          })).filter(item => Object.keys(item).length > 0),
          hotel: compactObject({
            nr_apts: toNumber(ticket.hotel.nr_apts),
            categ_apt: ticket.hotel.categ_apt || undefined,
            tipo_apt: ticket.hotel.tipo_apt || undefined,
            dt_check_in: toIsoString(ticket.hotel.dt_check_in),
            dt_check_out: toIsoString(ticket.hotel.dt_check_out),
            nr_hospedes: toNumber(ticket.hotel.nr_hospedes),
            reg_alimentacao: ticket.hotel.reg_alimentacao || undefined,
            cod_tipo_pagto: ticket.hotel.cod_tipo_pagto || undefined,
            dt_confirmacao: toIsoString(ticket.hotel.dt_confirmacao),
            confirmado_por: ticket.hotel.confirmado_por || undefined,
          }),
          location: compactObject({
            cidade_retirada: ticket.location.cidade_retirada || undefined,
            local_retirada: ticket.location.local_retirada || undefined,
            dt_retirada: toIsoString(ticket.location.dt_retirada),
            hr_retirada: ticket.location.hr_retirada || undefined,
            local_devolucao: ticket.location.local_devolucao || undefined,
            dt_devolucao: toIsoString(ticket.location.dt_devolucao),
            hr_devolucao: ticket.location.hr_devolucao || undefined,
            categ_veiculo: ticket.location.categ_veiculo || undefined,
            cod_tipo_pagto: ticket.location.cod_tipo_pagto || undefined,
            dt_confirmacao: toIsoString(ticket.location.dt_confirmacao),
            confirmado_por: ticket.location.confirmado_por || undefined,
          }),
          other: compactObject({
            descricao: ticket.other.descricao || undefined,
          }),
          package: compactObject({
            cid_dest_principal: ticket.package.cid_dest_principal || undefined,
            descricao_pacote: ticket.package.descricao_pacote || undefined,
            data_inicio_pacote: toIsoString(ticket.package.data_inicio_pacote),
            data_fim_pacote: toIsoString(ticket.package.data_fim_pacote),
          }),
          other_services: compactObject({
            cid_dest_principal: ticket.other_services.cid_dest_principal || undefined,
            descricao_outros_svcs: ticket.other_services.descricao_outros_svcs || undefined,
            data_inicio_outros_svcs: toIsoString(ticket.other_services.data_inicio_outros_svcs),
            data_fim_outros_svcs: toIsoString(ticket.other_services.data_fim_outros_svcs),
          }),
          customer: customerPayload,
        }),
      ],
    };
  }, [header, selectedCustomer, ticket]);

  const saveCustomer = async () => {
    if (!customerDraft.razao_social) {
      setErrorMessage('Informe ao menos a razao social para registrar o cliente na aba Cliente.');
      setSuccessMessage('');
      return;
    }

    try {
      setIsSavingCustomer(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await apiFetch('/customers', {
        method: 'POST',
        body: JSON.stringify({
          razao_social: customerDraft.razao_social,
          acao_cli: customerDraft.acao_cli || undefined,
          tipo_endereco: customerDraft.tipo_endereco || undefined,
          endereco: customerDraft.endereco || undefined,
          numero: customerDraft.numero || undefined,
          complemento: customerDraft.complemento || undefined,
          bairro: customerDraft.bairro || undefined,
          cep: customerDraft.cep || undefined,
          cidade: customerDraft.cidade || undefined,
          estado: customerDraft.estado || undefined,
          tipo_fj: customerDraft.tipo_fj || undefined,
          dt_nasc: customerDraft.dt_nasc ? new Date(customerDraft.dt_nasc).toISOString() : undefined,
          tel: customerDraft.tel || undefined,
          celular: customerDraft.celular || undefined,
          cpf_cnpj: customerDraft.cpf_cnpj || undefined,
          insc_identidade: customerDraft.insc_identidade || undefined,
          sexo: customerDraft.sexo || undefined,
          dt_cadastro: customerDraft.dt_cadastro ? new Date(customerDraft.dt_cadastro).toISOString() : undefined,
          email: customerDraft.email || undefined,
        }),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message;
        throw new Error(message ?? 'Nao foi possivel cadastrar o cliente.');
      }

      const createdCustomer = (await response.json()) as ApiCustomer;

      setCustomers(current => [createdCustomer, ...current]);
      setTicket(current => ({
        ...current,
        selected_customer_id: createdCustomer.id,
        cliente: createdCustomer.razao_social,
      }));
      setCustomerDraft(createCustomerForm());
      setSuccessMessage('Cliente cadastrado no backend e selecionado na venda.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel cadastrar o cliente.');
      setSuccessMessage('');
    } finally {
      setIsSavingCustomer(false);
    }
  };

  const validate = () => {
    if (!header.nr_arquivo || !header.data_geracao || !header.hora_geracao || !header.nome_agencia || !header.versao_xml) {
      return { tab: 'cabecalho' as TabId, message: 'Preencha os campos obrigatorios do cabecalho.' };
    }

    if (!ticket.selected_customer_id) {
      return { tab: 'cliente' as TabId, message: 'Cadastre e selecione um cliente para a venda.' };
    }

    if (ticket.values.some(item => (item.codigo && !item.valor) || (!item.codigo && item.valor))) {
      return { tab: 'venda' as TabId, message: 'Nos valores, codigo e valor andam juntos.' };
    }

    if (ticket.apportionments.some(item => (item.ccustos_cliente && !item.percentual) || (!item.ccustos_cliente && item.percentual))) {
      return { tab: 'rateio' as TabId, message: 'No rateio, informe ccustos_cliente e percentual juntos.' };
    }

    if (ticket.sections.some(item => [item.cia_iata, item.aeroporto_origem, item.aeroporto_destino].some(Boolean)
      && (!item.cia_iata || !item.aeroporto_origem || !item.aeroporto_destino))) {
      return { tab: 'trecho-por-bilhete' as TabId, message: 'No trecho por bilhete, cia_iata, aeroporto_origem e aeroporto_destino sao obrigatorios.' };
    }

    return null;
  };

  const handleSubmit = async () => {
    const validation = validate();

    if (validation) {
      setActiveTab(validation.tab);
      setErrorMessage(validation.message);
      setSuccessMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await apiFetch('/sales/import-wintour', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
        const message = Array.isArray(error?.message) ? error.message.join(', ') : error?.message;
        throw new Error(message ?? 'Nao foi possivel enviar a importacao.');
      }

      setSuccessMessage('Importacao enviada com sucesso.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel enviar a importacao.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className={`${cardClassName} h-fit`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Abas</p>
          <div className="mt-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? 'border-[#2463eb] bg-[#edf4ff] text-[#2463eb]'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          {errorMessage ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}
          {successMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{successMessage}</div> : null}

          {activeTab === 'cabecalho' ? (
            <article className={cardClassName}>
              <SectionHeader title="Cabecalho" description="Primeiro bloco do payload." />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nr. arquivo" required value={header.nr_arquivo} onChange={value => setHeader(current => ({ ...current, nr_arquivo: value }))} />
                <Field label="Data geracao" required value={header.data_geracao} onChange={value => setHeader(current => ({ ...current, data_geracao: value }))} />
                <Field label="Hora geracao" required value={header.hora_geracao} onChange={value => setHeader(current => ({ ...current, hora_geracao: value }))} />
                <Field label="Nome agencia" required value={header.nome_agencia} onChange={value => setHeader(current => ({ ...current, nome_agencia: value }))} />
                <Field label="Versao XML" required type="number" value={header.versao_xml} onChange={value => setHeader(current => ({ ...current, versao_xml: value }))} />
              </div>
            </article>
          ) : null}

          {activeTab === 'cliente' ? (
            <article className={cardClassName}>
              <SectionHeader title="Cliente" description="Registra o cliente no fluxo e seleciona na venda." />
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,22rem)]">
                <div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Razao social" value={customerDraft.razao_social} onChange={value => setCustomerDraft(current => ({ ...current, razao_social: value }))} />
                    <Field label="Email" type="email" value={customerDraft.email} onChange={value => setCustomerDraft(current => ({ ...current, email: value }))} />
                    <Field label="CPF/CNPJ" value={customerDraft.cpf_cnpj} onChange={value => setCustomerDraft(current => ({ ...current, cpf_cnpj: value }))} />
                    <Field label="Cidade" value={customerDraft.cidade} onChange={value => setCustomerDraft(current => ({ ...current, cidade: value }))} />
                    <Field label="Estado" value={customerDraft.estado} onChange={value => setCustomerDraft(current => ({ ...current, estado: value }))} />
                    <Field label="Telefone" value={customerDraft.tel} onChange={value => setCustomerDraft(current => ({ ...current, tel: value }))} />
                    <Field label="Celular" value={customerDraft.celular} onChange={value => setCustomerDraft(current => ({ ...current, celular: value }))} />
                    <Field label="Endereco" value={customerDraft.endereco} onChange={value => setCustomerDraft(current => ({ ...current, endereco: value }))} />
                  </div>
                  <div className="mt-4">
                    <Button variant="secondary" onClick={saveCustomer} disabled={isSavingCustomer}>
                      {isSavingCustomer ? 'Registrando...' : 'Registrar cliente nesta venda'}
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Cliente selecionado</p>
                  <select
                    value={ticket.selected_customer_id}
                    onChange={event => {
                      const customer = customers.find(item => item.id === event.target.value);
                      setTicket(current => ({
                        ...current,
                        selected_customer_id: event.target.value,
                        cliente: customer?.razao_social ?? '',
                      }));
                    }}
                    className={`${inputClassName} mt-3`}
                  >
                    <option value="">{isLoadingCustomers ? 'Carregando clientes...' : 'Selecione um cliente'}</option>
                    {customers.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.razao_social}
                      </option>
                    ))}
                  </select>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Nome: {selectedCustomer?.razao_social || '-'}</p>
                    <p>Email: {selectedCustomer?.email || '-'}</p>
                    <p>Documento: {selectedCustomer?.cpf_cnpj || '-'}</p>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          {activeTab === 'venda' ? (
            <article className={cardClassName}>
              <SectionHeader title="Venda" description="Campos principais do bilhete e lista de valores." />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Numero bilhete" value={ticket.num_bilhete} onChange={value => setTicket(current => ({ ...current, num_bilhete: value }))} />
                <Field label="Localizador" value={ticket.localizador} onChange={value => setTicket(current => ({ ...current, localizador: value }))} />
                <Field label="Prestador servico" value={ticket.prestador_svc} onChange={value => setTicket(current => ({ ...current, prestador_svc: value }))} />
                <Field label="Fornecedor" value={ticket.fornecedor} onChange={value => setTicket(current => ({ ...current, fornecedor: value }))} />
                <Field label="Passageiro" value={ticket.passageiro} onChange={value => setTicket(current => ({ ...current, passageiro: value }))} />
                <Field label="Codigo produto" value={ticket.codigo_produto} onChange={value => setTicket(current => ({ ...current, codigo_produto: value }))} />
                <Field label="Forma pagamento" value={ticket.forma_de_pagamento} onChange={value => setTicket(current => ({ ...current, forma_de_pagamento: value }))} />
                <Field label="Data lancamento" type="datetime-local" value={ticket.data_lancamento} onChange={value => setTicket(current => ({ ...current, data_lancamento: value }))} />
                <Field label="Tipo passageiro" value={ticket.tipo_passageiro} onChange={value => setTicket(current => ({ ...current, tipo_passageiro: value }))} />
                <Field label="Moeda" value={ticket.moeda} onChange={value => setTicket(current => ({ ...current, moeda: value }))} />
                <Field label="Canal venda" value={ticket.canal_venda} onChange={value => setTicket(current => ({ ...current, canal_venda: value }))} />
                <Field label="Tarifa net" type="number" value={ticket.tarifa_net} onChange={value => setTicket(current => ({ ...current, tarifa_net: value }))} />
              </div>

              <div className="mt-6 space-y-4">
                {ticket.values.map((item, index) => (
                  <div key={`value-${index + 1}`} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
                    <Field label="Codigo" required value={item.codigo} onChange={value => setTicket(current => ({ ...current, values: current.values.map((entry, entryIndex) => entryIndex === index ? { ...entry, codigo: value } : entry) }))} />
                    <Field label="Valor" required type="number" value={item.valor} onChange={value => setTicket(current => ({ ...current, values: current.values.map((entry, entryIndex) => entryIndex === index ? { ...entry, valor: value } : entry) }))} />
                    <Field label="Valor DF" type="number" value={item.valor_df} onChange={value => setTicket(current => ({ ...current, values: current.values.map((entry, entryIndex) => entryIndex === index ? { ...entry, valor_df: value } : entry) }))} />
                    <Field label="Valor MP" type="number" value={item.valor_mp} onChange={value => setTicket(current => ({ ...current, values: current.values.map((entry, entryIndex) => entryIndex === index ? { ...entry, valor_mp: value } : entry) }))} />
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setTicket(current => ({ ...current, values: [...current.values, { codigo: '', valor: '', valor_df: '', valor_mp: '' }] }))}>
                  Adicionar valor
                </Button>
              </div>
            </article>
          ) : null}

          {activeTab === 'rateio' ? (
            <article className={cardClassName}>
              <SectionHeader title="Rateio CCustos Cli" description="Subobjeto apportionments." />
              <div className="space-y-4">
                {ticket.apportionments.map((item, index) => (
                  <div key={`apportionment-${index + 1}`} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-2">
                    <Field label="CCustos cliente" required value={item.ccustos_cliente} onChange={value => setTicket(current => ({ ...current, apportionments: current.apportionments.map((entry, entryIndex) => entryIndex === index ? { ...entry, ccustos_cliente: value } : entry) }))} />
                    <Field label="Percentual" required type="number" value={item.percentual} onChange={value => setTicket(current => ({ ...current, apportionments: current.apportionments.map((entry, entryIndex) => entryIndex === index ? { ...entry, percentual: value } : entry) }))} />
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setTicket(current => ({ ...current, apportionments: [...current.apportionments, { ccustos_cliente: '', percentual: '' }] }))}>
                  Adicionar rateio
                </Button>
              </div>
            </article>
          ) : null}

          {activeTab === 'vendas-originais' ? (
            <article className={cardClassName}>
              <SectionHeader title="Vendas Originais" description="Subobjeto sales_origin." />
              <div className="space-y-4">
                {ticket.sales_origin.map((item, index) => (
                  <div key={`sales-origin-${index + 1}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Field label="Item" value={item.item} onChange={value => setTicket(current => ({ ...current, sales_origin: current.sales_origin.map((entry, entryIndex) => entryIndex === index ? { ...entry, item: value } : entry) }))} />
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setTicket(current => ({ ...current, sales_origin: [...current.sales_origin, { item: '' }] }))}>
                  Adicionar venda original
                </Button>
              </div>
            </article>
          ) : null}

          {activeTab === 'bilhetes-conjugados' ? (
            <article className={cardClassName}>
              <SectionHeader title="Bilhetes Conjugados" description="Subobjeto ticket_conjugate." />
              <div className="space-y-4">
                {ticket.ticket_conjugate.map((item, index) => (
                  <div key={`conjugate-${index + 1}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <Field label="Item" value={item.item} onChange={value => setTicket(current => ({ ...current, ticket_conjugate: current.ticket_conjugate.map((entry, entryIndex) => entryIndex === index ? { ...entry, item: value } : entry) }))} />
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setTicket(current => ({ ...current, ticket_conjugate: [...current.ticket_conjugate, { item: '' }] }))}>
                  Adicionar bilhete conjugado
                </Button>
              </div>
            </article>
          ) : null}

          {activeTab === 'aereo' ? (
            <article className={cardClassName}>
              <SectionHeader title="Aereo" description="Campos aereos gerais da venda." />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Tipo roteiro aereo" value={ticket.tipo_roteiro_aereo} onChange={value => setTicket(current => ({ ...current, tipo_roteiro_aereo: value }))} />
                <Field label="Destino rota aerea" value={ticket.destino_rot_aereo} onChange={value => setTicket(current => ({ ...current, destino_rot_aereo: value }))} />
                <Field label="CO2 KG" type="number" value={ticket.co2_kg} onChange={value => setTicket(current => ({ ...current, co2_kg: value }))} />
                <Field label="Destino principal" value={ticket.cid_dest_principal} onChange={value => setTicket(current => ({ ...current, cid_dest_principal: value }))} />
              </div>
            </article>
          ) : null}

          {activeTab === 'trecho-por-bilhete' ? (
            <article className={cardClassName}>
              <SectionHeader title="Trecho por Bilhete" description="Subobjeto sections." />
              <div className="space-y-4">
                {ticket.sections.map((item, index) => (
                  <div key={`section-${index + 1}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <Field label="CIA IATA" required value={item.cia_iata} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, cia_iata: value } : entry) }))} />
                      <Field label="Numero voo" value={item.numero_voo} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, numero_voo: value } : entry) }))} />
                      <Field label="Aeroporto origem" required value={item.aeroporto_origem} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, aeroporto_origem: value } : entry) }))} />
                      <Field label="Aeroporto destino" required value={item.aeroporto_destino} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, aeroporto_destino: value } : entry) }))} />
                      <Field label="Data partida" type="datetime-local" value={item.data_partida} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, data_partida: value } : entry) }))} />
                      <Field label="Hora partida" value={item.hora_partida} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, hora_partida: value } : entry) }))} />
                      <Field label="Data chegada" type="datetime-local" value={item.data_chegada} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, data_chegada: value } : entry) }))} />
                      <Field label="Hora chegada" value={item.hora_chegada} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, hora_chegada: value } : entry) }))} />
                      <Field label="Classe" value={item.classe} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, classe: value } : entry) }))} />
                      <Field label="Base tarifaria" value={item.base_tarifaria} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, base_tarifaria: value } : entry) }))} />
                      <Field label="Ticket designator" value={item.ticket_designator} onChange={value => setTicket(current => ({ ...current, sections: current.sections.map((entry, entryIndex) => entryIndex === index ? { ...entry, ticket_designator: value } : entry) }))} />
                    </div>
                  </div>
                ))}
                <Button variant="secondary" onClick={() => setTicket(current => ({ ...current, sections: [...current.sections, { cia_iata: '', numero_voo: '', aeroporto_origem: '', aeroporto_destino: '', data_partida: '', hora_partida: '', data_chegada: '', hora_chegada: '', classe: '', base_tarifaria: '', ticket_designator: '' }] }))}>
                  Adicionar trecho
                </Button>
              </div>
            </article>
          ) : null}

          {activeTab === 'hotel' ? (
            <article className={cardClassName}>
              <SectionHeader title="Hotel" description="Subobjeto hotel." />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Nr aptos" type="number" value={ticket.hotel.nr_apts} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, nr_apts: value } }))} />
                <Field label="Categoria apto" value={ticket.hotel.categ_apt} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, categ_apt: value } }))} />
                <Field label="Tipo apto" value={ticket.hotel.tipo_apt} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, tipo_apt: value } }))} />
                <Field label="Check in" type="datetime-local" value={ticket.hotel.dt_check_in} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, dt_check_in: value } }))} />
                <Field label="Check out" type="datetime-local" value={ticket.hotel.dt_check_out} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, dt_check_out: value } }))} />
                <Field label="Nr hospedes" type="number" value={ticket.hotel.nr_hospedes} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, nr_hospedes: value } }))} />
                <Field label="Reg alimentacao" value={ticket.hotel.reg_alimentacao} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, reg_alimentacao: value } }))} />
                <Field label="Cod tipo pagto" value={ticket.hotel.cod_tipo_pagto} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, cod_tipo_pagto: value } }))} />
                <Field label="Data confirmacao" type="datetime-local" value={ticket.hotel.dt_confirmacao} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, dt_confirmacao: value } }))} />
                <Field label="Confirmado por" value={ticket.hotel.confirmado_por} onChange={value => setTicket(current => ({ ...current, hotel: { ...current.hotel, confirmado_por: value } }))} />
              </div>
            </article>
          ) : null}

          {activeTab === 'locacao' ? (
            <article className={cardClassName}>
              <SectionHeader title="Locacao" description="Subobjeto location." />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Cidade retirada" value={ticket.location.cidade_retirada} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, cidade_retirada: value } }))} />
                <Field label="Local retirada" value={ticket.location.local_retirada} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, local_retirada: value } }))} />
                <Field label="Data retirada" type="datetime-local" value={ticket.location.dt_retirada} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, dt_retirada: value } }))} />
                <Field label="Hora retirada" value={ticket.location.hr_retirada} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, hr_retirada: value } }))} />
                <Field label="Local devolucao" value={ticket.location.local_devolucao} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, local_devolucao: value } }))} />
                <Field label="Data devolucao" type="datetime-local" value={ticket.location.dt_devolucao} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, dt_devolucao: value } }))} />
                <Field label="Hora devolucao" value={ticket.location.hr_devolucao} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, hr_devolucao: value } }))} />
                <Field label="Categoria veiculo" value={ticket.location.categ_veiculo} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, categ_veiculo: value } }))} />
                <Field label="Cod tipo pagto" value={ticket.location.cod_tipo_pagto} onChange={value => setTicket(current => ({ ...current, location: { ...current.location, cod_tipo_pagto: value } }))} />
              </div>
            </article>
          ) : null}

          {activeTab === 'outros' ? (
            <article className={cardClassName}>
              <SectionHeader title="Outros" description="Subobjeto other." />
              <TextareaField label="Descricao" required value={ticket.other.descricao} onChange={value => setTicket(current => ({ ...current, other: { descricao: value } }))} />
            </article>
          ) : null}

          {activeTab === 'pacotes' ? (
            <article className={cardClassName}>
              <SectionHeader title="Pacotes" description="Subobjeto package." />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Destino principal" value={ticket.package.cid_dest_principal} onChange={value => setTicket(current => ({ ...current, package: { ...current.package, cid_dest_principal: value } }))} />
                <Field label="Descricao pacote" value={ticket.package.descricao_pacote} onChange={value => setTicket(current => ({ ...current, package: { ...current.package, descricao_pacote: value } }))} />
                <Field label="Data inicio pacote" type="datetime-local" value={ticket.package.data_inicio_pacote} onChange={value => setTicket(current => ({ ...current, package: { ...current.package, data_inicio_pacote: value } }))} />
                <Field label="Data fim pacote" type="datetime-local" value={ticket.package.data_fim_pacote} onChange={value => setTicket(current => ({ ...current, package: { ...current.package, data_fim_pacote: value } }))} />
              </div>
            </article>
          ) : null}

          {activeTab === 'outros-servicos' ? (
            <article className={cardClassName}>
              <SectionHeader title="Outros Servicos" description="Subobjeto other_services." />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Destino principal" value={ticket.other_services.cid_dest_principal} onChange={value => setTicket(current => ({ ...current, other_services: { ...current.other_services, cid_dest_principal: value } }))} />
                <Field label="Descricao outros servicos" value={ticket.other_services.descricao_outros_svcs} onChange={value => setTicket(current => ({ ...current, other_services: { ...current.other_services, descricao_outros_svcs: value } }))} />
                <Field label="Data inicio" type="datetime-local" value={ticket.other_services.data_inicio_outros_svcs} onChange={value => setTicket(current => ({ ...current, other_services: { ...current.other_services, data_inicio_outros_svcs: value } }))} />
                <Field label="Data fim" type="datetime-local" value={ticket.other_services.data_fim_outros_svcs} onChange={value => setTicket(current => ({ ...current, other_services: { ...current.other_services, data_fim_outros_svcs: value } }))} />
              </div>
            </article>
          ) : null}

          <div className={`${cardClassName} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
            <p className="text-sm text-slate-500">
              O envio continua sendo unico para `POST /sales/import-wintour`, mas a entrada agora esta separada por abas do dominio.
            </p>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar importacao'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { SalesImportForm };

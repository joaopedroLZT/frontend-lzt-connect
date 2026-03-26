import type { UserRole } from '@/types/auth';

export const AppConfig = {
  name: 'LZT Connect',
  description: 'Painel inicial com acesso rapido aos modulos principais.',
  sidebarGroups: [
    {
      title: 'Visao geral',
      items: [
        {
          label: 'Dashboard',
          href: '/',
        },
      ],
    },
    {
      title: 'Gerenciamento',
      items: [
        {
          label: 'Usuarios',
          href: '/usuarios',
          roles: ['ADMIN'] as UserRole[],
        },
        {
          label: 'Clientes',
          href: '/clientes',
          roles: ['ADMIN', 'USER'] as UserRole[],
        },
        {
          label: 'Vendas',
          href: '/vendas',
          roles: ['ADMIN', 'USER'] as UserRole[],
        },
      ],
    },
  ],
};

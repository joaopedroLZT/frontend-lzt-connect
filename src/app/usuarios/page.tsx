import { AuthGuard } from '@/components/AuthGuard';
import { CustomersTableSection } from '@/components/CustomersTableSection';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function UsuariosPage() {
  return (
    <AuthGuard requireRole="ADMIN">
      <BaseTemplate currentPath="/usuarios">
        <CustomersTableSection
          title="Usuarios"
          actionLabel="Adicionar usuario"
        />
      </BaseTemplate>
    </AuthGuard>
  );
}

import { AuthGuard } from '@/components/AuthGuard';
import { CustomersManagementSection } from '@/components/CustomersManagementSection';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function ClientesPage() {
  return (
    <AuthGuard>
      <BaseTemplate currentPath="/clientes">
        <CustomersManagementSection />
      </BaseTemplate>
    </AuthGuard>
  );
}

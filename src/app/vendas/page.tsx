import { AuthGuard } from '@/components/AuthGuard';
import { SalesImportForm } from '@/components/SalesImportForm';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function SalesPage() {
  return (
    <AuthGuard>
      <BaseTemplate currentPath="/vendas">
        <SalesImportForm />
      </BaseTemplate>
    </AuthGuard>
  );
}

import { AccountSettings } from '@/components/AccountSettings';
import { AuthGuard } from '@/components/AuthGuard';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function MinhaContaPage() {
  return (
    <AuthGuard>
      <BaseTemplate currentPath="/minha-conta">
        <AccountSettings />
      </BaseTemplate>
    </AuthGuard>
  );
}

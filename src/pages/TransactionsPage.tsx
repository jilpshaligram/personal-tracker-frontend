import { ArrowLeftRight } from 'lucide-react';
import PlaceholderPage from '../components/ui/PlaceholderPage';

export default function TransactionsPage() {
  return (
    <PlaceholderPage
      title="Transactions"
      description="Track and categorize all your financial transactions."
      icon={ArrowLeftRight}
      comingSoonText="Transactions functionality will be implemented later."
    />
  );
}

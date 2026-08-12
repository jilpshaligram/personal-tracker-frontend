import { Receipt } from 'lucide-react';
import PlaceholderPage from '../components/ui/PlaceholderPage';

export default function BillsPage() {
  return (
    <PlaceholderPage
      title="Bills"
      description="Keep track of your upcoming and recurring bills."
      icon={Receipt}
      comingSoonText="Bills functionality will be implemented later."
    />
  );
}

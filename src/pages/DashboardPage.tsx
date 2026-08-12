import { LayoutDashboard } from 'lucide-react';
import PlaceholderPage from '../components/ui/PlaceholderPage';

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Your personal finance overview."
      icon={LayoutDashboard}
      comingSoonText="Dashboard content will be implemented later."
    />
  );
}

import React from 'react';
import { AdminCard, AdminCardTitle } from '../common/AdminCard';
import { AdminBadge } from '../common/AdminBadge';
import { EmptyBox } from '../common/EmptyBox';
import type { IncidentItem } from '../../types/superAdmin';

interface AdminIncidentsCardProps {
  incidents: IncidentItem[];
}

export const AdminIncidentsCard: React.FC<AdminIncidentsCardProps> = ({ incidents }) => {
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <AdminCard>
      <AdminCardTitle>Open incidents</AdminCardTitle>
      <div className="flex flex-col gap-3">
        {activeIncidents.map((incident, index) => (
          <div key={index}>
            <div className="text-[12.5px] font-medium text-[#151A26]">{incident.title}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-[#9AA2B1]">{incident.date}</span>
              <AdminBadge tone={incident.severity === 'critical' ? 'red' : 'amber'}>
                {incident.status}
              </AdminBadge>
            </div>
          </div>
        ))}
        {activeIncidents.length === 0 && <EmptyBox>No open incidents.</EmptyBox>}
      </div>
    </AdminCard>
  );
};

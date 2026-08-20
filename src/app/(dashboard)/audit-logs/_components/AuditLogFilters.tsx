import { Search, Filter } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface AuditLogFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  severityFilter: string;
  setSeverityFilter: (value: string) => void;
}

export function AuditLogFilters({
  searchTerm,
  setSearchTerm,
  severityFilter,
  setSeverityFilter,
}: AuditLogFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full">
      <div className="w-full lg:w-96 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-placeholder" />
        <input
          type="text"
          placeholder="Search by event ID, action, user or record..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-border text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      </div>
      <div className="flex w-full lg:w-auto gap-3 items-center">
        <div className="w-full sm:w-48">
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            options={[
              { label: 'All Severities', value: 'all' },
              { label: 'Info', value: 'info' },
              { label: 'Warning', value: 'warning' },
              { label: 'Critical', value: 'critical' },
            ]}
          />
        </div>
        <Button variant="outline" className="justify-center px-3">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

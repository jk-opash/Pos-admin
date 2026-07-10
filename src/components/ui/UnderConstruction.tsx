import { Wrench } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface UnderConstructionProps {
  title?: string;
  message?: string;
}

export function UnderConstruction({ 
  title = "Under Construction", 
  message = "This section will be available in the next release." 
}: UnderConstructionProps) {
  return (
    <EmptyState 
      icon={<Wrench />}
      title={title}
      message={message}
      className="h-64"
    />
  );
}

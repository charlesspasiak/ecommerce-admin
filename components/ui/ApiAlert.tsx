import { Server } from 'lucide-react';

import { Alert, AlertTitle } from './alert';

interface ApiAlertProps {
  title: string;
  description: string;
  variant: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], string> = {
  public: 'secondary',
  admin: 'destructive',
};

const ApiAlert = ({ title, description, variant = 'public' }: ApiAlertProps) => {
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">{title}</AlertTitle>
    </Alert>
  );
};

export default ApiAlert;

import type { ProductionDetailsProps } from './types';

const ProductionDetails = ({ label, value, icon: Icon }: ProductionDetailsProps) => (
  <div className="flex items-center text-foreground">
    <Icon className="h-5 w-5 mr-3 text-primary" />
    <span className="font-medium text-lg">{label}:</span>
    <span className="ml-3 text-lg">{value}</span>
  </div>
);

export default ProductionDetails;

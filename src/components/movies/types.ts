import { LucideIcon } from 'lucide-react';
import type { Movie } from '@/types';

export interface ProductionDetailsProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface EntitySectionProps {
  title: string;
  icon: React.ElementType;
  urls: string[];
  type: string;
}

export interface MovieDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  movie: Movie;
}

export const getToastClass = (variant: 'default' | 'destructive' = 'default') => {
  return variant === 'destructive'
    ? 'bg-destructive text-destructive-foreground border border-destructive'
    : 'bg-background text-foreground border';
};

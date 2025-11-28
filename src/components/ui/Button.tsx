import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn.ts';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ children, className, variant = 'primary', ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'px-8 py-4 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-light-green text-army-green hover:bg-green-300',
        variant === 'secondary' &&
          'bg-white border-2 border-baby-blue text-baby-blue hover:bg-baby-blue hover:text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

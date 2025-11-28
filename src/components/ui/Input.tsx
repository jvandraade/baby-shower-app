import type { InputHTMLAttributes } from 'react';

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`w-full px-6 py-4 rounded-xl border-2 border-baby-blue/30 focus:border-baby-blue focus:outline-none transition-colors text-lg ${className}`}
      {...props}
    />
  );
};

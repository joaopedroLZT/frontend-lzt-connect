import { type ButtonHTMLAttributes, type ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variantClassNames = {
  primary:
    'bg-[#243142] text-white shadow-[0_0.75rem_2rem_rgba(36,49,66,0.18)] hover:bg-[#1b2634]',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100',
};

const Button = (props: ButtonProps) => {
  const {
    children,
    className = '',
    icon,
    type = 'button',
    variant = 'primary',
    ...rest
  } = props;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${variantClassNames[variant]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};

export { Button };

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = ({ children, onClick, className, variant = 'primary', disabled = false, ...props }) => {
  const baseStyles = "px-4 py-2 rounded font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-osrs-panel border-2 border-osrs-text text-osrs-text hover:bg-gray-700",
    gold: "bg-yellow-700 text-yellow-100 border-2 border-yellow-500 hover:bg-yellow-600 shadow-[0_0_10px_rgba(255,215,0,0.3)]",
    danger: "bg-red-900/50 border-2 border-red-500 text-red-100 hover:bg-red-900",
    success: "bg-green-900/50 border-2 border-green-500 text-green-100 hover:bg-green-900",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, title }) => {
  return (
    <div className={cn("bg-osrs-panel border border-gray-600 rounded-lg p-4 shadow-lg", className)}>
      {title && <h3 className="text-xl font-bold text-osrs-gold mb-4 border-b border-gray-600 pb-2">{title}</h3>}
      {children}
    </div>
  );
};

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}

      <input
        className={`
          w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-400 
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
          transition-all duration-200
          ${error ? "border-red-500" : "border-slate-700/50"}
          ${className}
        `}
        {...props}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      {helperText && !error && (
        <p className="text-sm text-slate-400">{helperText}</p>
      )}
    </div>
  );
}

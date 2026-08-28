import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost" | "navy" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium tracking-widest uppercase text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      gold: "bg-gold-500 text-white border-2 border-gold-500 hover:bg-gold-600 hover:border-gold-600 focus:ring-gold-400",
      outline:
        "bg-transparent text-gold-600 border-2 border-gold-500 hover:bg-gold-500 hover:text-white focus:ring-gold-400",
      ghost: "bg-transparent text-gray-700 border-2 border-transparent hover:bg-gray-100 focus:ring-gray-300",
      navy: "bg-navy-800 text-white border-2 border-navy-800 hover:bg-navy-900 hover:border-navy-900 focus:ring-navy-600",
      danger: "bg-red-600 text-white border-2 border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-400",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px]",
      md: "px-6 py-3",
      lg: "px-8 py-4 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

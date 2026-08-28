import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "navy" | "green" | "red" | "gray";
  className?: string;
}

export default function Badge({ children, variant = "gold", className }: BadgeProps) {
  const variants = {
    gold: "bg-gold-100 text-gold-700 border border-gold-200",
    navy: "bg-navy-100 text-navy-700 border border-navy-200",
    green: "bg-green-50 text-green-700 border border-green-200",
    red: "bg-red-50 text-red-600 border border-red-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

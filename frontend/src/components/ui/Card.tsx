import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-card",
        hover && "transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

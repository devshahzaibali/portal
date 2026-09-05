import { forwardRef, type InputHTMLAttributes } from "react";
import { FieldError } from "@/components/auth/FieldError";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted",
          "transition-all duration-200",
          "focus:border-accent focus:outline-none focus:shadow-[0_0_0_4px_var(--color-focus-ring)]",
          error && "border-danger-text focus:border-danger-text focus:shadow-none",
          className
        )}
        {...props}
      />
      <FieldError message={error} />
    </div>
  )
);

Input.displayName = "Input";

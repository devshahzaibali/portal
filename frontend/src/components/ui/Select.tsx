import { forwardRef, type SelectHTMLAttributes } from "react";
import { FieldError } from "@/components/auth/FieldError";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(
          "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground",
          "transition-all duration-200",
          "focus:border-accent focus:outline-none focus:shadow-[0_0_0_4px_var(--color-focus-ring)]",
          error && "border-danger-text focus:border-danger-text focus:shadow-none",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  )
);

Select.displayName = "Select";

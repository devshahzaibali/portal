import { forwardRef, type TextareaHTMLAttributes } from "react";
import { FieldError } from "@/components/auth/FieldError";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          "min-h-[120px] w-full resize-y rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-accent focus:outline-none focus:shadow-[0_0_0_3px_var(--color-focus-ring)]",
          error && "border-danger-text focus:border-danger-text focus:shadow-none",
          className
        )}
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      <FieldError message={error} />
    </div>
  )
);

Textarea.displayName = "Textarea";

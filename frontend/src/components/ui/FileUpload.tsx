"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FieldError } from "@/components/auth/FieldError";

interface FileUploadProps {
  label?: string;
  accept?: string;
  error?: string;
  hint?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export function FileUpload({
  label,
  accept = ".pdf,.doc,.docx",
  error,
  hint,
  file,
  onFileChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileChange(dropped);
  };

  return (
    <div className="w-full">
      {label && <p className="mb-2 text-sm font-medium text-foreground">{label}</p>}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "group cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200",
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border bg-surface hover:border-accent/50 hover:bg-surface-hover",
          error && "border-danger-text"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform group-hover:scale-110">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>
        {file ? (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="mt-1 text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="mt-2 text-xs font-medium text-accent hover:underline"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">
              Drop your resume here or <span className="text-accent">browse</span>
            </p>
            <p className="mt-1 text-xs text-muted">PDF, DOC, DOCX — max 5 MB</p>
          </div>
        )}
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
}

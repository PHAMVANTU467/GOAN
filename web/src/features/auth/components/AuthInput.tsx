import type { ReactNode, RefObject } from "react";

interface AuthInputProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  icon: ReactNode;
  inputRef: RefObject<HTMLInputElement | null>;
  type?: "text" | "email" | "tel" | "password";
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  autoCapitalize?: "none" | "words";
  endAction?: ReactNode;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function AuthInput({
  id,
  label,
  value,
  placeholder,
  error,
  icon,
  inputRef,
  type = "text",
  autoComplete,
  inputMode,
  autoCapitalize = "none",
  endAction,
  onChange,
  onBlur,
}: AuthInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div className={`input-wrap ${error ? "invalid" : ""}`}>
        {icon}
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
        {endAction}
      </div>
      {error && (
        <p className="field-error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

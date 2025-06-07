import React, { ChangeEvent } from "react";

interface InputProps {
  type?: "text" | "password" | "email" | "textarea" | "date";
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label: string;
  labelVisible?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: { message: string } | null;
}

const Input = ({
  type = "text",
  value,
  onChange,
  label,
  labelVisible = true,
  placeholder = "",
  required = false,
  disabled = false,
  readOnly = false,
  error: errorProp = null,
}: InputProps) => {
  const isTextarea = type === "textarea";

  return (
    <fieldset className="fieldset">
      <label
        className={`fieldset-legend justify-start gap-1 text-[0.9rem]  ${
          !labelVisible ? "sr-only" : ""
        }`}
      >
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </label>
      {isTextarea ? (
        <textarea
          className={`textarea w-full`}
          placeholder={placeholder}
          value={value}
          onChange={(e) =>
            onChange && onChange(e as ChangeEvent<HTMLTextAreaElement>)
          }
          disabled={disabled}
          readOnly={readOnly}
          aria-label={label}
          aria-required={!readOnly}
        />
      ) : (
        <input
          type={type}
          className={`input w-full`}
          placeholder={placeholder}
          value={value}
          onChange={(e) =>
            onChange && onChange(e as ChangeEvent<HTMLInputElement>)
          }
          disabled={disabled}
          readOnly={readOnly}
          aria-label={label}
          aria-required={!readOnly}
        />
      )}
      {errorProp && <p className="label validator-hint">{errorProp.message}</p>}
    </fieldset>
  );
};

export default Input;

'use client';

import React from 'react';

interface SelectProps {
  options: {
    [key: string]: {
      text: string;
      [key: string]: string;
    };
  };
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  labelVisible?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: { message: string } | null;
}

const Select = ({
  options,
  value,
  onChange,
  label,
  labelVisible = true,
  required = false,
  disabled = false,
  error: errorProp = null,
}: SelectProps) => {
  return (
    <fieldset className="fieldset">
      <label
        className={`fieldset-legend justify-start gap-1 text-[0.9rem]  ${
          !labelVisible ? 'sr-only' : ''
        }`}
      >
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="select w-full"
        disabled={disabled}
        aria-label={label}
      >
        {Object.entries(options)?.map(([key, value]) => (
          <option key={key} value={key}>
            {value.text}
          </option>
        ))}
      </select>
      {errorProp && <p className="label validator-hint">{errorProp.message}</p>}
    </fieldset>
  );
};

export default Select;

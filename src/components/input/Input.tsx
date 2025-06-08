"use client";

import { format, getDay } from "date-fns";
import React, { ChangeEvent } from "react";
import { DayPicker } from "react-day-picker";

interface InputProps {
  type?: "text" | "password" | "email" | "textarea" | "date";
  value?: string | Date | null;
  onChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | Date
  ) => void;
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
  const isDate = type === "date";

  const calendarFormatter = {
    formatCaption: (date: Date) => format(date, "yyyy년 MM월"),
    formatWeekdayName: (weekDay: Date) => {
      const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
      return weekdays[getDay(weekDay)];
    },
  };

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
          value={value as string}
          onChange={(e) =>
            onChange && onChange(e as ChangeEvent<HTMLTextAreaElement>)
          }
          disabled={disabled}
          readOnly={readOnly}
          aria-label={label}
          aria-required={!readOnly}
        />
      ) : isDate ? (
        <>
          <button
            popoverTarget={`rdp-popover-${label}`}
            className="input input-border w-full"
            style={{ anchorName: `--rdp-${label}` } as React.CSSProperties}
          >
            {value ? (
              format(value as Date, "yyyy-MM-dd")
            ) : (
              <span className="text-gray-400">
                {`${label}을 선택해 주세요`}
              </span>
            )}
          </button>
          <div
            popover="auto"
            id={`rdp-popover-${label}`}
            className="dropdown"
            style={{ positionAnchor: `--rdp-${label}` } as React.CSSProperties}
          >
            <DayPicker
              className="react-day-picker"
              mode={"single"}
              required
              selected={value as Date}
              onSelect={onChange && ((date) => onChange(date as Date))}
              formatters={calendarFormatter}
            />
          </div>
        </>
      ) : (
        <input
          type={type}
          className={`input w-full`}
          placeholder={placeholder}
          value={value as string}
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

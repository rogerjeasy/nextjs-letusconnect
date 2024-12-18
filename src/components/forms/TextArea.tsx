"use client";

import React from "react";
import { Textarea } from "@nextui-org/react";

interface TextAreaProps {
  value: string; // Controlled value
  isReadOnly?: boolean;
  label: string;
  variant?: "bordered" | "faded";
  placeholder: string;
  description: string;
  labelColor?: string;
  isInvalid?: boolean;       // New prop for validation state
  errorMessage?: string;     // New prop for error message
  onChange?: (value: string) => void;
}

export default function TextareaForm({
  value,
  isReadOnly = false,
  label,
  variant = "faded",
  placeholder,
  description,
  labelColor = "font-bold",
  isInvalid = false,
  errorMessage = "",
  onChange,
}: TextAreaProps) {
  return (
    <Textarea
      value={value} // Controlled input
      isReadOnly={isReadOnly}
      variant={variant}
      label={label}
      placeholder={placeholder}
      description={description}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      onChange={(e) => onChange?.(e.target.value)} // Ensure proper onChange handling
      className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4"
      classNames={{
        label: labelColor ? `${labelColor} font-bold` : undefined, // Conditionally apply labelColor
      }}
    />
  );
}

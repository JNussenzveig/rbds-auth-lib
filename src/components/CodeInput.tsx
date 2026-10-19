import React, { useEffect, useRef } from "react";

export type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function CodeInput({
  value,
  onChange,
  disabled = false,
  autoFocus = true,
}: CodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Array de 6 posições
  const chars = Array.from({ length: 6 }, (_, i) => value[i] || "");

  // Foca no primeiro input quando o código é limpo/invalido
  useEffect(() => {
    if (!value && !disabled && autoFocus) {
      inputsRef.current[0]?.focus();
    }
  }, [value, disabled, autoFocus]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      const currentVal = chars[index];
      if (currentVal) {
        // Apaga o caractere atual
        const nextChars = [...chars];
        nextChars[index] = "";
        onChange(nextChars.join("").trim());
      } else if (index > 0) {
        // Volta para o anterior e apaga
        const nextChars = [...chars];
        nextChars[index - 1] = "";
        onChange(nextChars.join("").trim());
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const inputVal = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (!inputVal) return;

    // Se o usuário digitou ou colou um único caractere
    const char = inputVal.slice(-1);
    const nextChars = [...chars];
    nextChars[index] = char;
    const fullCode = nextChars.join("");
    onChange(fullCode);

    // Avança para o próximo campo
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);

    if (pasted) {
      onChange(pasted);
      const targetIndex = Math.min(pasted.length, 5);
      inputsRef.current[targetIndex]?.focus();
    }
  };

  const renderSlot = (index: number) => {
    const val = chars[index];
    return (
      <input
        key={index}
        ref={(el) => {
          inputsRef.current[index] = el;
        }}
        type="text"
        inputMode="text"
        autoComplete="one-time-code"
        maxLength={1}
        value={val}
        disabled={disabled}
        autoFocus={autoFocus && index === 0}
        onChange={(e) => handleChange(index, e)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        onPaste={handlePaste}
        className={`rbds-otp-slot ${val ? "filled" : ""}`}
        aria-label={`Dígito ${index + 1} do código`}
      />
    );
  };

  return (
    <div className="rbds-otp-container" role="group" aria-label="Código de verificação de 6 caracteres">
      {/* Primeiros 3 caracteres */}
      <div className="rbds-otp-group">
        {renderSlot(0)}
        {renderSlot(1)}
        {renderSlot(2)}
      </div>

      {/* Últimos 3 caracteres */}
      <div className="rbds-otp-group">
        {renderSlot(3)}
        {renderSlot(4)}
        {renderSlot(5)}
      </div>
    </div>
  );
}

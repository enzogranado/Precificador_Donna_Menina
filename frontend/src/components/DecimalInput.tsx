import React, { useState, useEffect, useRef } from 'react';

interface DecimalInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | undefined;
  onChange: (val: number | undefined) => void;
}

export default function DecimalInput({ value, onChange, ...props }: DecimalInputProps) {
  const [localValue, setLocalValue] = useState<string>(
    value === undefined || isNaN(value) ? '' : value.toString().replace('.', ',')
  );
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync state if value changes externally (e.g. form reset, loading new product)
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setLocalValue(value === undefined || isNaN(value) ? '' : value.toString().replace('.', ','));
    } else {
      // If we are actively editing, only sync if the values differ numerically
      const parsedLocal = parseFloat(localValue.replace(',', '.'));
      const normalizedLocal = isNaN(parsedLocal) ? undefined : parsedLocal;
      if (normalizedLocal !== value) {
        setLocalValue(value === undefined || isNaN(value) ? '' : value.toString().replace('.', ','));
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9.,-]/g, ''); // Keep numbers, dot, comma, minus
    setLocalValue(rawVal);
    
    const parsed = parseFloat(rawVal.replace(',', '.'));
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      onChange(undefined);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(localValue.replace(',', '.'));
    if (!isNaN(parsed)) {
      setLocalValue(parsed.toString().replace('.', ','));
      onChange(parsed);
    } else {
      setLocalValue('');
      onChange(undefined);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  );
}

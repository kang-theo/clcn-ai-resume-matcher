import { Slider } from "@/components/ui/slider";
import { useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";

interface SalaryRangeFilterProps {
  onChange: (range: [number, number]) => void;
  value: [number, number];
  min?: number;
  max?: number;
  step?: number;
  currency?: string;
}

export function SalaryRangeFilter({
  onChange,
  value,
  min = 0,
  max = 200,
  step = 1,
  currency = "USD",
}: SalaryRangeFilterProps) {
  // Local state for smooth sliding
  const [localValue, setLocalValue] = useState(value);

  // Update local value when parent value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    debounce((newValue: [number, number]) => {
      onChange(newValue);
    }, 300),
    [onChange]
  );

  const handleRangeChange = (newValue: number[]) => {
    const range = newValue as [number, number];
    setLocalValue(range); // Update local state immediately
    debouncedOnChange(range); // Notify parent after debounce
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <h2 className='font-semibold'>Salary Range</h2>
        <span className='text-sm text-gray-500'>{currency}/Year</span>
      </div>

      <div className='pt-6 pb-2'>
        <Slider
          mode='range'
          value={localValue} // Use local value for smooth updates
          min={min}
          max={max}
          step={step}
          onValueChange={handleRangeChange}
          className='w-full'
        />
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex flex-col'>
          <span className='text-sm text-gray-500'>Min</span>
          <span className='font-medium'>${localValue[0]}k</span>
        </div>
        <div className='flex flex-col text-right'>
          <span className='text-sm text-gray-500'>Max</span>
          <span className='font-medium'>${localValue[1]}k</span>
        </div>
      </div>
    </div>
  );
}

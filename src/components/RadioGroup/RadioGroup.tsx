import React from 'react';

interface RadioGroupProps {
  options: string[];
  activeOption: string;
  handleChange: (value: string) => void;
  titleText?: string;
  name?: string;
}

const RadioGroup = ({
  options,
  activeOption,
  handleChange,
  titleText,
  name,
}: RadioGroupProps) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
  };

  return (
    <fieldset>
      {titleText && (
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/90">
          {titleText}
        </h2>
      )}
      <div className="flex flex-wrap gap-1.5">
        {options?.map((option: string, index: number) => {
          const id = `${(name || 'RadioGroup')}-${index}`;
          return (
            <div className="relative" key={`${option}-${index}`}>
              <input
                id={id}
                type="radio"
                name={name || "RadioGroup"}
                value={option}
                className="sr-only peer"
                aria-labelledby={`${option}-${index}`}
                aria-describedby={`${option}-${index}`}
                checked={activeOption === option}
                onChange={onChange}
              />
              <label
                id={`${option}-${index}`}
                htmlFor={id}
                className="select-none cursor-pointer px-2.5 py-1 rounded-md border border-slate-600/50 bg-slate-700/30 text-slate-100 hover:bg-slate-700/60 transition-colors peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 text-xs"
              >
                {option}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default RadioGroup;

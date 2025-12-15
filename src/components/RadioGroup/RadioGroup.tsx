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
      <h2 className="text-white mb-1">{titleText}</h2>
      {options?.map((option: string, index: number) => {
        return (
          <div className="flex items-center mb-2" key={`${option}-${index}`}>
            <input
              type="radio"
              name={name || "RadioGroup"}
              value={option}
              className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
              aria-labelledby={`${option}-${index}`}
              aria-describedby={`${option}-${index}`}
              checked={activeOption === option}
              onChange={onChange}
            />
            <label
              htmlFor={`${option}-${index}`}
              className="text-sm font-medium text-white ml-2 block"
            >
              {option}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
};

export default RadioGroup;

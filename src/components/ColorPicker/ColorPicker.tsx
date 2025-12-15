import React, { useState } from 'react';
import { ColorResult, SketchPicker, RGBColor } from 'react-color';

interface ColorPickerProps {
  className?: string;
  currentColor: RGBColor;
  handleColorChange: (color: ColorResult) => void;
  titleText?: string;
}

const ColorPicker = ({
  className,
  currentColor,
  handleColorChange,
  titleText,
}: ColorPickerProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const backgroundColor = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${currentColor.a})`;

  return (
    <div className={className}>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/90">{titleText}</h4>
      <button
        type="button"
        onClick={handleClick}
        className="relative inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-100 shadow-sm ring-1 ring-inset ring-slate-600 hover:ring-slate-400 transition w-full"
      >
        <span className="inline-block w-4 h-4 rounded border border-slate-500" style={{ backgroundColor }} />
        <span>Pick color</span>
      </button>
      {displayColorPicker ? (
        <div className={'absolute z-10 mt-2 right-3'}>
          <div
            className={'fixed top-0 right-0 bottom-0 left-0'}
            onClick={handleClose}
          />
          <div className="overflow-hidden rounded-md shadow-2xl ring-1 ring-slate-900/20">
            <SketchPicker
              color={currentColor}
              onChange={handleColorChange}
              presetColors={[
                '#D0021B',
                '#F5A623',
                '#F8E71C',
                '#8B572A',
                '#7ED321',
                '#417505',
                'rgba(211, 211, 211, 0.5)',
              ]}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ColorPicker;

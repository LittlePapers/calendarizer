import React, { useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

interface ColorPickerProps {
  currentColor: string;
  handleColorChange: (color: ColorResult) => void;
  titleText?: string;
}

const ColorPicker = ({
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

  return (
    <React.Fragment>
      <h4>{titleText}</h4>
      <div
        className="relative p-2 bg-white rounded-sm shadow inline-block cursor-pointer"
        onClick={handleClick}
      >
        <div
          className={'w-10 h-5 rounded-sm '}
          style={{ backgroundColor: currentColor }}
        />
        {displayColorPicker ? (
          <div className={'absolute z-10 top-10 right-0'}>
            <div
              className={'fixed top-0 right-0 bottom-0 left-0'}
              onClick={handleClose}
            />
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
                '',
                'rgba(211, 211, 211, 0.5)',
              ]}
            />
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default ColorPicker;

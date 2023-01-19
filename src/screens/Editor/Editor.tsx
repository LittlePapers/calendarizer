import { fabric } from 'fabric';
import { useEffect, useState, useRef } from 'react';
import { CanvasEditor, RadioGroup } from '../../components';
import { getNewCalendar, getMonthsGroup } from '../../common/utils';
import { LAYOUT_OPTIONS } from '../../common/types';
import { ColorChangeHandler, ColorResult, SketchPicker } from 'react-color';

const Editor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [calendar, setCalendar] = useState<fabric.Group | null>(null);
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [file, setFile] = useState<string>('');
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const [currentOptions, setCurrentOptions] = useState({
    currentLayout: LAYOUT_OPTIONS.TREEBYFOUR,
    currentColor: '#d3d3d380',
  });

  useEffect(() => {
    const savedFile = localStorage.getItem('fileUrl');
    if (savedFile) {
      setFile(savedFile);
    }
  }, []);

  useEffect(() => {
    updateCalendar();
  }, [currentOptions]);

  const onReady = (canvas: fabric.Canvas) => {
    if (!file) return;
    const imageOptions = {
      width: canvas.width || 300,
      height: canvas.height || 300,
    };

    fabric.Image.fromURL(file, (oImg) => {
      oImg.scaleToWidth(imageOptions.width);
      oImg.scaleToHeight(imageOptions.height);
      canvas.add(oImg);
      canvas.sendToBack(oImg);
    });

    const calendarGroup: fabric.Group = getNewCalendar(2023, currentOptions);

    canvas.add(calendarGroup);
    setCalendar(calendarGroup);
    setCanvas(canvas);
  };

  const exportImage = () => {
    if (!canvas || !buttonRef.current) return;

    buttonRef.current.href = canvas.toDataURL({ format: 'png' });
    buttonRef.current.download = 'Calendar.png';
  };

  const updateCalendar = () => {
    canvas?.remove(calendar as fabric.Object);
    let newCalendar = getNewCalendar(2023, currentOptions);
    canvas?.add(newCalendar);
    setCalendar(newCalendar);
  };

  const handleRadioGroupChange = (layout: string) => {
    setCurrentOptions({
      ...currentOptions,
      currentLayout: layout as LAYOUT_OPTIONS,
    });
  };

  const handleColorChange = (color: ColorResult) => {
    setCurrentOptions({
      ...currentOptions,
      currentColor: color?.hex,
    });
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  return (
    <div className="h-screen">
      {file && (
        <div className="relative bg-slate-800 h-full flex flex-col items-center justify-center p-4">
          <div className="flex flex-col absolute top-5 right-2 z-10">
            <a
              className="mt-2 text-black bg-slate-400 rounded-sm px-2 py-1 z-10"
              ref={buttonRef}
              onClick={exportImage}
            >
              Export
            </a>
            <div className="mt-2 text-white">
              <RadioGroup
                options={[
                  LAYOUT_OPTIONS.TREEBYFOUR,
                  LAYOUT_OPTIONS.SIXBYTWO,
                  LAYOUT_OPTIONS.FOURBYTHREE,
                ]}
                handleChange={handleRadioGroupChange}
                activeOption={currentOptions?.currentLayout}
                titleText={'Layout'}
              />
            </div>

            <div className="mt-2 text-white">
              <div
                className={
                  'p-2 bg-white rounded-sm shadow inline-block cursor-pointer'
                }
                onClick={handleClick}
              >
                <div
                  className={'w-10 h-5 rounded-sm '}
                  style={{ backgroundColor: currentOptions?.currentColor }}
                />
              </div>
              {displayColorPicker ? (
                <div className={'absolute z-10 right-0'}>
                  <div
                    className={'fixed top-0 right-0 bottom-0 left-0'}
                    onClick={handleClose}
                  />
                  <SketchPicker
                    color={currentOptions?.currentColor}
                    onChange={handleColorChange}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <CanvasEditor className="w-full h-full" onReady={onReady} />
        </div>
      )}
    </div>
  );
};

export default Editor;

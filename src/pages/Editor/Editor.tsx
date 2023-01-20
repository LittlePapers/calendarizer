import { fabric } from 'fabric';
import { useEffect, useState, useRef } from 'react';
import { CanvasEditor, ColorPicker, RadioGroup } from '../../components';
import { getNewCalendar } from '../../common/utils';
import { LAYOUT_OPTIONS, ICurrentOptions } from '../../common/types';
import { ColorResult } from 'react-color';
import { useNavigate } from 'react-router';


const Editor = () => {
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [calendar, setCalendar] = useState<fabric.Group | null>(null);
  const [file, setFile] = useState<string>('');
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const [currentOptions, setCurrentOptions] = useState<ICurrentOptions>({
    currentLayout: LAYOUT_OPTIONS.TREEBYFOUR,
    currentColor: { r: 211, g: 211, b: 211, a: .5 },
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
    fabric.Image.fromURL(file, (oImg: fabric.Image, hasError?: boolean) => {
      if (hasError) {
        navigate('/', { replace: true });
        return;
      }
      /* Supress error when dispose was called before this */
      if (!canvas.getContext()) return;
      /* Resize canvas to keep image aspect ratio */
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgWidth = oImg.width || canvas.getWidth();
      const imgHeight = oImg.height || canvas.getHeight();
      const scaleRatio = Math.min(
        canvasWidth / imgWidth,
        canvasHeight / imgHeight
      );
      canvas.setWidth(imgWidth * scaleRatio);
      canvas.setHeight(imgHeight * scaleRatio);
      oImg.scaleToWidth(canvas.getWidth());
      oImg.selectable = false;
      oImg.hoverCursor = 'default';
      canvas.add(oImg);
      canvas.sendToBack(oImg);
    });
    const calendarGroup = getNewCalendar(2023, currentOptions);
    canvas.add(calendarGroup);
    setCanvas(canvas);
    setCalendar(calendarGroup);
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
      currentColor: color?.rgb,
    });
  };
  return (
    <div className="h-screen">
      {file && (
        <div className="relative bg-slate-800 h-full flex flex-col items-center justify-center p-4">
          <div className="flex flex-col absolute top-5 right-3 z-10">
            <a
              className="mt-2 text-black bg-slate-400 rounded-sm px-2 py-1 z-10 text-center"
              ref={buttonRef}
              onClick={exportImage}
            >
              Export
            </a>
            <div className="mt-4 text-white">
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
              <ColorPicker
                currentColor={currentOptions?.currentColor}
                handleColorChange={handleColorChange}
                titleText={'Background '}
              />
            </div>
          </div>
          <CanvasEditor
            className="w-full h-full flex items-center justify-center"
            onReady={onReady}
          />
        </div>
      )}
    </div>
  );
};

export default Editor;

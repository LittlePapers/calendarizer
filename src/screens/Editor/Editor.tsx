import { fabric } from 'fabric';
import { useEffect, useState, useRef, useCallback } from 'react';
import { CanvasEditor, RadioGroup } from '../../components';
import { getMonthsGroup } from '../../common/utils';

const Editor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [calendar, setCalendar] = useState<fabric.Group | null>(null);
  const [currentLayout, setCurrentLayout] = useState<string>('3X4');
  const [file, setFile] = useState<string>('');
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const savedFile = localStorage.getItem('fileUrl');
    if (savedFile) {
      setFile(savedFile);
    }
  }, []);

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

    const calendarGroup: fabric.Group = getMonthsGroup(2023);

    canvas.add(calendarGroup);
    setCalendar(calendarGroup);
    setCanvas(canvas);
  };

  const exportImage = () => {
    if (!canvas || !buttonRef.current) return;

    buttonRef.current.href = canvas.toDataURL({ format: 'png' });
    buttonRef.current.download = 'Calendar.png';
  };

  const handleRadioGroupChange = (value: string) => {
    canvas?.remove(calendar as fabric.Object);
    let newCalendar = null;
    switch (value) {
      case '3X4':
        newCalendar = getMonthsGroup(2023);
        break;
      case '2X2':
        newCalendar = getMonthsGroup(2023, { numberOfMonthsPerRow: 2 });
        break;
      case '4X3':
        newCalendar = getMonthsGroup(2023, { numberOfMonthsPerRow: 3 });
        break;
      default:
        newCalendar = getMonthsGroup(2023);
    }

    canvas?.add(newCalendar);
    setCalendar(newCalendar);
    setCurrentLayout(value);
  };

  return (
    <div className="h-screen">
      {file && (
        <div className="relative bg-slate-800 h-full flex flex-col items-center justify-center p-4">
          <a
            className="absolute top-2 right-2 text-black bg-slate-400 rounded-sm px-2 py-1 z-10"
            ref={buttonRef}
            onClick={exportImage}
          >
            Export
          </a>
          <div className="absolute top-20 right-2 z-10 text-white">
            <RadioGroup
              options={['3X4', '2X2', '4X3']}
              handleChange={handleRadioGroupChange}
              activeOption={currentLayout}
              titleText={'Layout'}
            />
          </div>
          <CanvasEditor className="w-full h-full" onReady={onReady} />
        </div>
      )}
    </div>
  );
};

export default Editor;

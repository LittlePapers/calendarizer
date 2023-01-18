import { fabric } from 'fabric';
import { useEffect, useState, useRef, useCallback } from 'react';
import { CanvasEditor } from '../../components';
import { getMonthsGroup } from '../../common/utils';

const Editor = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
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

    fabric.Image.fromURL(file, (oImg) => {

      /* Supress error when dispose was called before this */
      if (!canvas.getContext()) return;

      /* Resize canvas to keep image aspect ratio */
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();

      const imgWidth = oImg.width || canvas.getWidth();
      const imgHeight = oImg.height || canvas.getHeight();

      const scaleRatio = Math.min(canvasWidth/imgWidth, canvasHeight/imgHeight);

      canvas.setWidth(imgWidth * scaleRatio);
      canvas.setHeight(imgHeight * scaleRatio);

      oImg.scaleToWidth(canvas.getWidth());
      oImg.selectable = false;
      oImg.hoverCursor = 'default';

      canvas.add(oImg);
      canvas.sendToBack(oImg);
    });

    const calendarGroup = getMonthsGroup(2023);
    canvas.add(calendarGroup);

    setCanvas(canvas);
  };

  const exportImage = () => {
    if (!canvas || !buttonRef.current) return;

    buttonRef.current.href = canvas.toDataURL({ format: 'png' });
    buttonRef.current.download = 'Calendar.png';
  };

  return (
    <div className="h-screen">
      {file && (
        <div className="relative bg-slate-800 h-full flex flex-col items-center justify-center p-4">
          <a
            className="absolute top-2 right-2 text-black bg-slate-400 rounded-sm px-2 py-1 z-10 hover:cursor-pointer"
            ref={buttonRef}
            onClick={exportImage}
          >
            Export
          </a>
          <CanvasEditor className="w-full h-full flex items-center justify-center" onReady={onReady} />
        </div>
      )}
    </div>
  );
};

export default Editor;

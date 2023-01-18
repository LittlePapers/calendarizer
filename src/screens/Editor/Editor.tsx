import { fabric } from 'fabric';
import { useEffect, useState, useRef, useCallback } from 'react';
import { CanvasEditor } from '../../components';
import { getMonthsGroup } from '../../common/utils';
import { useNavigate } from 'react-router';

const Editor = () => {
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [file, setFile] = useState<string>('');
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const savedFile = localStorage.getItem('fileUrl');
    if (savedFile) {
      setFile(savedFile);
    }
  }, []);

  const onReady = useCallback(
    (canvas: fabric.Canvas) => {
      if (!file) return;
      const imageOptions = {
        width: canvas.width || 300,
        height: canvas.height || 300,
      };

      fabric.Image.fromURL(file, (oImg: fabric.Object, hasError?: boolean) => {
        if (!hasError) {
          oImg.scaleToWidth(imageOptions.width);
          oImg.scaleToHeight(imageOptions.height);
          canvas.add(oImg);
          canvas.sendToBack(oImg);
        } else {
          navigate('/', { replace: true });
        }
      });

      const calendarGroup = getMonthsGroup(2023);
      canvas.add(calendarGroup);
      setCanvas(canvas);
    },
    [file]
  );

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
            className="absolute top-2 right-2 text-black bg-slate-400 rounded-sm px-2 py-1 z-10"
            ref={buttonRef}
            onClick={exportImage}
          >
            Export
          </a>
          <CanvasEditor className="w-full h-full" onReady={onReady} />
        </div>
      )}
    </div>
  );
};

export default Editor;

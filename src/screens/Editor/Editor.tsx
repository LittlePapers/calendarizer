import { fabric } from 'fabric';
import { useEffect, useState, useRef } from 'react';
import { CanvasEditor } from '../../components';

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
      oImg.scaleToWidth(canvas.width || 300);
      oImg.scaleToHeight(canvas.height || 300);
      canvas.add(oImg);
      canvas.sendToBack(oImg);
    });

    /* Add month calendar */
    // drawMonth(1, 2022)
    // canvas.add(January)

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
            className="absolute top-2 right-2 text-black bg-slate-400 rounded-sm px-2 py-1 z-10" 
            ref={buttonRef} 
            onClick={exportImage}> 
            Export
          </a>
          <CanvasEditor className="w-full h-full" onReady={onReady} />
        </div>
      )}
    </div>
  );
};

export default Editor;

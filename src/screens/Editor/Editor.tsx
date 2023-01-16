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
    });

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
        <div className="bg-slate-800 h-full flex flex-col items-center justify-center p-4">
          <a ref={buttonRef} onClick={exportImage}>Export</a>
          <CanvasEditor className="w-full h-full" onReady={onReady} />
        </div>
      )}
    </div>
  );
};

export default Editor;

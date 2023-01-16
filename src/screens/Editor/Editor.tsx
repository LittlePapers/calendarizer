import { fabric } from 'fabric';
import { useEffect, useState, useRef, useCallback } from 'react';
import { CanvasEditor } from '../../components';

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const drawWeek = (week: string[], top: number) => {

  const objs = week.map((text) => {
    const oText =  new fabric.Text(text, {
      fontSize: 12,
      originX: 'center',
      originY: 'top',
      fontFamily: 'monospace',
      textAlign: 'center',
    });
    oText.width = 20;
    return oText;
  });

  // Space out

  /* This should be fetch from the rect */
  const TOTAL_WIDTH = 200;

  const occupied = objs.reduce((prev, value) => prev + (value.width || 0), 0);
  const space = (TOTAL_WIDTH - occupied) / (objs.length - 1);

  let currentLeft = 0;

  for (let i=0; i < objs.length; i++) {
    const width = objs[i].width || 0;
    objs[i].left = currentLeft; 
    currentLeft = currentLeft + width + space;
  }

  return new fabric.Group(objs, {
    left: 0,
    top,
    originX: 'center',
    originY: 'center'
  });
};

const drawMonth = (year: number, month: number, canvas: fabric.Canvas) => {

  const dt = new Date(year, month)

  const monthName = dt.toLocaleString('en-US', { month: 'long' })

  /* Draw body */
  const rect = new fabric.Rect({
    width: 220,
    height: 190,
    fill: '#d3d3d3',
    originX: 'center',
    originY: 'top',
  });

  const monthLabel = new fabric.Text(monthName, {
    top: 10,
    fontSize: 20,
    originX: 'center',
    originY: 'top',
    fontFamily: 'monospace',
  });

  let top = 48;
  const weekDays = drawWeek(WEEK_DAYS, top);
  const weeks = [];

  do {
    const start = dt.getDay();
    const week = new Array(7).fill(' ');

    for (let i=start; i < 7; i++) {
      week[i] = dt.getDate().toString();
      dt.setDate(dt.getDate() + 1)

      if (dt.getDate() === 1) {
        break
      }
    }

    top += 24;
    const wk = drawWeek(week, top);
    weeks.push(wk);

  } while (dt.getDate() !== 1);


  // drawWeek(['', '', '', '1'])

  const group = new fabric.Group([rect, monthLabel, weekDays, ...weeks], {
    top: 10,
    left: 10,
  });
  canvas.add(group);
};

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

  const onReady = useCallback((canvas: fabric.Canvas) => {
    if (!file) return;

    fabric.Image.fromURL(file, (oImg) => {
      oImg.scaleToWidth(canvas.width || 300);
      oImg.scaleToHeight(canvas.height || 300);
      canvas.add(oImg);
      canvas.sendToBack(oImg);
    });

    /* Add month calendar */
    // canvas.add(January)
    drawMonth(2023, 0, canvas)
    drawMonth(2023, 1, canvas)

    setCanvas(canvas);
  }, [file]);

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

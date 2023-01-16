import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export interface Props {
  className?: string;
  onReady?: (canvas: fabric.Canvas) => void;
}

const CanvasEditor = ({ className, onReady }: Props) => {
  const canvasEl = useRef(null);
  const canvasElParent = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, {
      preserveObjectStacking: true
    });

    const resizeCanvas = () => {
      canvas.setHeight(canvasElParent.current?.clientHeight || 0)
      canvas.setWidth(canvasElParent.current?.clientWidth || 0)
      canvas.renderAll()
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas, false)

    if (onReady) {
      onReady(canvas);
    }

    return () => {
      canvas.dispose()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div ref={canvasElParent} className={className}>
      <canvas ref={canvasEl} />
    </div>
  );

};

export default CanvasEditor;

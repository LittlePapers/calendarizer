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
      preserveObjectStacking: true,
    });

    /* TODO: Keep track of image size instead */
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const scaleCanvas = () => {
      const containerWidth = canvasElParent.current?.clientWidth || 0;
      const containerHeight = canvasElParent.current?.clientHeight || 0;

      const scaleRatio = Math.min(containerWidth/canvasWidth, containerHeight/canvasHeight);

      canvas.setDimensions({ width: canvasWidth * scaleRatio, height: canvasHeight * scaleRatio });
      canvas.setZoom(scaleRatio);
      canvas.renderAll()
    };

    const resizeCanvasToParent = () => {
      canvas.setHeight(canvasElParent.current?.clientHeight || 0)
      canvas.setWidth(canvasElParent.current?.clientWidth || 0)
      canvas.renderAll()
    };

    resizeCanvasToParent();

    window.addEventListener('resize', scaleCanvas, false)

    if (onReady) {
      onReady(canvas);
    }

    return () => {
      canvas.dispose()
      window.removeEventListener('resize', scaleCanvas)
    }
  }, [])

  return (
    <div ref={canvasElParent} className={className}>
      <canvas ref={canvasEl} />
    </div>
  );

};

export default CanvasEditor;

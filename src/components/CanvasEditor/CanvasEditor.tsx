import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export interface Props {
  className?: string;
  onReady?: (canvas: fabric.Canvas) => void;
}

const CanvasEditor = ({ className, onReady }: Props) => {
  const canvasEl = useRef(null);
  const canvasElParent = useRef<HTMLDivElement>(null);

  /* Keep track of canvas size before resize to scale */
  const canvasWidth = useRef(0);
  const canvasHeight = useRef(0);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current, {
      preserveObjectStacking: true,
    });

    /* TODO: Keep track of image size instead */

    const scaleCanvas = () => {

      if (!canvasWidth.current || !canvasHeight.current) {
        canvasWidth.current = canvas.getWidth();
        canvasHeight.current = canvas.getHeight();
      }

      const width = canvasWidth.current;
      const height = canvasHeight.current;
      const containerWidth = canvasElParent.current?.clientWidth || 0;
      const containerHeight = canvasElParent.current?.clientHeight || 0;

      const scaleRatio = Math.min(containerWidth/width, containerHeight/height);

      canvas.setDimensions({ width: width * scaleRatio, height: height * scaleRatio });
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

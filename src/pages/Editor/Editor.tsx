import { fabric } from 'fabric';
import { useEffect, useState, useRef } from 'react';
import { CanvasEditor, ColorPicker, RadioGroup } from '../../components';
import { getNewCalendar } from '../../common/utils';
import { LAYOUT_OPTIONS, ICurrentOptions, LANG_OPTIONS, REGION_OPTIONS } from '../../common/types';
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
    currentLanguage: LANG_OPTIONS.EN,
    currentRegion: REGION_OPTIONS.US,
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
    const currentYear = new Date().getFullYear();
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
    const calendarGroup = getNewCalendar(currentYear, currentOptions);
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
    const currentYear = new Date().getFullYear();
    canvas?.remove(calendar as fabric.Object);
    let newCalendar = getNewCalendar(currentYear, currentOptions);
    canvas?.add(newCalendar);
    setCalendar(newCalendar);
  };

  const handleRadioGroupChange = (layout: string) => {
    setCurrentOptions({
      ...currentOptions,
      currentLayout: layout as LAYOUT_OPTIONS,
    });
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentOptions({
      ...currentOptions,
      currentLanguage: lang as LANG_OPTIONS,
    });
  };

  const handleColorChange = (color: ColorResult) => {
    setCurrentOptions({
      ...currentOptions,
      currentColor: color?.rgb,
    });
  };

  const handleRegionChange = (region: string) => {
    setCurrentOptions({
      ...currentOptions,
      currentRegion: region as REGION_OPTIONS,
    });
  };
  return (
    <div className="h-screen">
      {file && (
        <div className="relative bg-slate-800 h-full flex flex-col items-center justify-center p-4">
          <div className="flex flex-col absolute top-5 right-3 z-10 max-w-[148px]">
            <a
              className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-400 z-10 text-center"
              ref={buttonRef}
              onClick={exportImage}
            >
              Export
            </a>
            <div className="mt-3">
              <RadioGroup
                options={[
                  LAYOUT_OPTIONS.TREEBYFOUR,
                  LAYOUT_OPTIONS.SIXBYTWO,
                  LAYOUT_OPTIONS.FOURBYTHREE,
                ]}
                handleChange={handleRadioGroupChange}
                activeOption={currentOptions?.currentLayout}
                titleText={'Layout'}
                name={'Layout'}
              />
            </div>

            <div className="mt-3">
              <ColorPicker
                className="w-full"
                currentColor={currentOptions?.currentColor}
                handleColorChange={handleColorChange}
                titleText={'Background '}
              />
            </div>

            <div className="mt-3">
              <RadioGroup
                options={[LANG_OPTIONS.EN, LANG_OPTIONS.ES]}
                handleChange={handleLanguageChange}
                activeOption={currentOptions?.currentLanguage}
                titleText={'Language'}
                name={'Language'}
              />
            </div>

            <div className="mt-3">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Region</h2>
              <div className="relative inline-block w-full">
                <select
                  className="appearance-none w-full rounded-md bg-slate-800/80 text-slate-100 px-2.5 py-1.5 pr-8 text-xs shadow-sm ring-1 ring-inset ring-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentOptions.currentRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                >
                  <option value={REGION_OPTIONS.AR}>Argentina</option>
                  <option value={REGION_OPTIONS.US}>USA</option>
                  <option value={REGION_OPTIONS.VE}>Venezuela</option>
                  <option value={REGION_OPTIONS.ES}>Spain</option>
                  <option value={REGION_OPTIONS.MX}>Mexico</option>
                  <option value={REGION_OPTIONS.IT}>Italy</option>
                  <option value={REGION_OPTIONS.JP}>Japan</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </div>
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

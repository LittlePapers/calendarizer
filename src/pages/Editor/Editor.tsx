import { fabric } from 'fabric';
import { useEffect, useState, useRef } from 'react';
import { CanvasEditor, ColorPicker, RadioGroup } from '../../components';
import { getNewCalendar } from '../../common/utils';
import { LAYOUT_OPTIONS, ICurrentOptions, LANG_OPTIONS, REGION_OPTIONS } from '../../common/types';
import { ColorResult, RGBColor } from 'react-color';
import { useNavigate } from 'react-router';


const Editor = () => {
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [calendar, setCalendar] = useState<fabric.Group | null>(null);
  const [file, setFile] = useState<string>('');
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [selectedText, setSelectedText] = useState<fabric.IText | null>(null);
  const [textColor, setTextColor] = useState<RGBColor>({ r: 255, g: 255, b: 255, a: 1 });
  const [textFont, setTextFont] = useState<string>('Arial');
  const [showSettings, setShowSettings] = useState<boolean>(true);

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

    // Selection handling for text objects
    const isTextObject = (obj: fabric.Object | undefined | null): obj is fabric.IText => {
      return !!obj && (obj.type === 'i-text');
    };

    const toRGBColor = (fill: string | undefined): RGBColor => {
      if (!fill) return { r: 255, g: 255, b: 255, a: 1 };
      // rgba(r,g,b,a)
      const rgba = /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\)$/i.exec(fill);
      if (rgba) {
        const r = parseInt(rgba[1], 10);
        const g = parseInt(rgba[2], 10);
        const b = parseInt(rgba[3], 10);
        const a = rgba[4] !== undefined ? Number(rgba[4]) : 1;
        return { r, g, b, a } as RGBColor;
      }
      // #rrggbb or #rgb
      if (fill[0] === '#') {
        let r = 255, g = 255, b = 255;
        if (fill.length === 4) {
          r = parseInt(fill[1] + fill[1], 16);
          g = parseInt(fill[2] + fill[2], 16);
          b = parseInt(fill[3] + fill[3], 16);
        } else if (fill.length === 7) {
          r = parseInt(fill.slice(1, 3), 16);
          g = parseInt(fill.slice(3, 5), 16);
          b = parseInt(fill.slice(5, 7), 16);
        }
        return { r, g, b, a: 1 } as RGBColor;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };

    const updateSelectedFromObject = (obj: fabric.Object | undefined | null) => {
      if (isTextObject(obj)) {
        setSelectedText(obj);
        const fill = (obj.fill as string) || '#ffffff';
        setTextColor(toRGBColor(fill));
        setTextFont((obj.fontFamily as string) || 'Arial');
      } else {
        setSelectedText(null);
      }
    };

    const handleSelectionCreated = (e: any) => {
      const target = e.selected?.[0] || e.target;
      updateSelectedFromObject(target);
    };
    const handleSelectionUpdated = (e: any) => {
      const target = e.selected?.[0] || e.target;
      updateSelectedFromObject(target);
    };
    const handleSelectionCleared = () => {
      setSelectedText(null);
    };

    canvas.on('selection:created', handleSelectionCreated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionCleared);
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

  // Text tools
  const addText = () => {
    if (!canvas) return;
    const rgba = `rgba(${textColor.r}, ${textColor.g}, ${textColor.b}, ${textColor.a ?? 1})`;
    const t = new fabric.IText('Your text', {
      left: canvas.getWidth() / 2,
      top: 80,
      originX: 'center',
      originY: 'top',
      fontFamily: textFont,
      fill: rgba,
      fontSize: 24,
      editable: true,
    });
    canvas.add(t);
    canvas.setActiveObject(t);
    t.enterEditing();
    t.selectAll();
    canvas.renderAll();
  };

  const applyTextChanges = (updates: { text?: string; colorRgb?: RGBColor; font?: string; }) => {
    if (!canvas || !selectedText) return;
    if (updates.text !== undefined) selectedText.text = updates.text;
    if (updates.colorRgb !== undefined) {
      const c = updates.colorRgb;
      selectedText.set('fill', `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a ?? 1})`);
    }
    if (updates.font !== undefined) selectedText.set('fontFamily', updates.font);
    canvas.renderAll();
  };

  const onTextColorChange = (color: ColorResult) => {
    setTextColor(color.rgb);
    applyTextChanges({ colorRgb: color.rgb });
  };

  const onTextFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTextFont(val);
    applyTextChanges({ font: val });
  };
  return (
    <div className="h-screen">
      {file && (
        <div className="relative bg-slate-800 h-full flex flex-col items-center justify-center p-4">
          {/* Settings visibility toggle */}
          {!showSettings && (
            <button
              onClick={() => setShowSettings(true)}
              title={'Show settings'}
              aria-label={'Show settings'}
              className="absolute top-2 right-2 z-30 inline-flex h-7 w-7 items-center justify-center bg-transparent text-white/80 hover:text-white"
            >
              ≡
            </button>
          )}

          {showSettings && (
          <div className="flex flex-col absolute top-5 right-3 z-30 w-44 bg-black/40 text-white/90 backdrop-blur-sm pt-7 px-3 pb-3 ring-1 ring-white/10 shadow-lg">
            <h2 className="absolute top-2 left-3 text-xs font-semibold text-zinc-400">SETTINGS</h2>
            <button
              onClick={() => setShowSettings(false)}
              title={'Hide settings'}
              aria-label={'Hide settings'}
              className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center bg-transparent text-white/80 hover:text-white"
            >
              ×
            </button>
            <a
              className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-400 z-10 text-center"
              ref={buttonRef}
              onClick={exportImage}
            >
              Export
            </a>
            {!selectedText && (
              <></>
            )}

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
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/90">Region</h2>
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

            {/* Text inspector */}
            <div className="mt-3">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/90">Text</h2>
              {selectedText ? (
                <div className="space-y-2">
                  <div className="relative inline-block w-full">
                    <select
                      value={textFont}
                      onChange={onTextFontChange}
                      className="appearance-none w-full rounded-md bg-slate-800/80 text-slate-100 px-2.5 py-1.5 pr-8 text-xs shadow-sm ring-1 ring-inset ring-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Tahoma">Tahoma</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                      <option value="Impact">Impact</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-full">
                    <ColorPicker
                      className="w-full"
                      currentColor={textColor}
                      handleColorChange={onTextColorChange}
                      titleText={'Color'}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-200">Tip: Double‑click a text object on the canvas to edit its content.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={addText}
                    className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-emerald-500 transition focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
                  >
                    Add Text
                  </button>
                  <p className="text-[10px] text-zinc-200">Tip: After adding, double‑click to edit the text on canvas.</p>
                </div>
              )}
            </div>
          </div>
          )}
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

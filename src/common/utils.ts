import { fabric } from 'fabric';
import Holidays from 'date-holidays';
import { DEFAULT_WEEK_OPTIONS, DEFAULT_MONTH_OPTIONS, DEFAULT_GET_MONTHS_OPTIONS, WEEK_DAYS_EN, WEEK_DAYS_ES } from './constants';
import { IGetMonthOptions, IGetMonthsOptions, IGetWeekOptions, LAYOUT_OPTIONS, ICurrentOptions, LANG_OPTIONS, REGION_OPTIONS } from './types';

export const getWeekGroup = (week: string[], pOptions?: IGetWeekOptions): fabric.Group => {
  //Get default options with custom Options
  const options = {...DEFAULT_WEEK_OPTIONS, ...pOptions};

  // Create an array of text objects
  const objs = week.map((text, idx) => {
    const fill = options.weekFills?.[idx] ?? '#000000';
    const objText = new fabric.Text(text, {
      fontSize: options.weekFontSize,
      originX: "center",
      originY: "top",
      fontFamily: options.weekFontFamily,
      textAlign: options.weekTextAlign,
      fill,
    });
    objText.width = 20;
    return objText;
  });

  // Calculate the total width occupied by the text objects
  const occupied = objs.reduce((prev, value) => prev + (value.width || 0), 0);
  // Calculate the space between the text objects
  options.weekSpaceBetween = ((options.weekTotalWidth || 0) - occupied) / (objs.length - 1);

  // Position the text objects on the canvas
  let currentLeft = 0;
  for (let i = 0; i < objs.length; i++) {
    const width = objs[i].width || 0;
    objs[i].left = currentLeft;
    currentLeft = currentLeft + width + options.weekSpaceBetween;
  }

  // Create a group object to hold all the text objects
  // and return it, dah!
  return new fabric.Group(objs, {
    left: 0,
    top: options.top,
    originX: "center",
    originY: "center",
  });
};

export const getMonthGroup = (year: number, month: number, pOptions: IGetMonthOptions): fabric.Group  => {
  //Get default options with custom Options
  const options = {...DEFAULT_MONTH_OPTIONS, ...pOptions};
  //Set the top property for later increment
  let increment = options?.weekDaysTop || 0;
  // Create a date object for the given year and month
  const date = new Date(year, month);

  // Get the full name of the month based on language
  const locale = options.lang === LANG_OPTIONS.ES ? 'es-ES' : 'en-US';
  const monthNameRaw = date.toLocaleString(locale, { month: "long" });
  const monthName = monthNameRaw.charAt(0).toUpperCase() + monthNameRaw.slice(1);

  // Create a rectangle to serve as the background of the month
  const rect = new fabric.Rect({
    width: options.monthRectWidth,
    height: options.monthRectHeight,
    fill: options.monthRectFill,
    originX: "center",
    originY: "top"
  });

  // Create a text object to display the month name
  const monthLabel = new fabric.Text(monthName, {
    top: options.monthNameTop,
    fontSize: options.monthNameFontSize,
    originX: "center",
    originY: "top",
    fontFamily: options.monthNameFontFamily
  });

  // Draw the weekdays based on language
  const weekdayLabels = options.lang === LANG_OPTIONS.ES ? WEEK_DAYS_ES : WEEK_DAYS_EN;
  const weekDays = getWeekGroup(weekdayLabels, { top: options.weekDaysTop || 0, weekFontFamily: options.weekFontFamily });

  // Prepare holiday checker and highlight color
  const highlightColor = options.highlightColor || '#dc2626';
  const isHolidayFn = options.holidayChecker || (() => false);

  // Create an array to store the weeks
  const weeks = [];

  // Draw each week
  do {
    const start = date.getDay();
    const week = new Array(7).fill(" ");
    const fills: (string | undefined)[] = new Array(7).fill(undefined);

    for (let i = start; i < 7; i++) {
      const dateForCell = new Date(date);
      week[i] = dateForCell.getDate().toString();
      const isSaturday = dateForCell.getDay() === 6;
      const isHoliday = isHolidayFn(dateForCell);
      if (isSaturday || isHoliday) {
        fills[i] = highlightColor;
      }
      date.setDate(date.getDate() + 1);

      if (date.getDate() === 1) {
        break;
      }
    }

    increment += options?.weekTopIncrement || 0;
    const wk = getWeekGroup(week, { top: increment, weekFills: fills, weekFontFamily: options.weekFontFamily });
    weeks.push(wk);

  } while (date.getDate() !== 1);

  // Create a group object to hold all the elements of the month
  const group = new fabric.Group([rect, monthLabel, weekDays, ...weeks], options);

  return group;
};

export const getMonthsGroup = (year: number, pOptions?: IGetMonthsOptions): fabric.Group  => {
  //Get default options with custom Options
  const options = {...DEFAULT_GET_MONTHS_OPTIONS, ...pOptions}
  // Store variables that will mutate
  let leftSpacing = options?.monthLeftSpacing || 0;
  let topSpacing = options?.monthTopSpacing || 0;
  // create month array
  const months = [];
  // Get months
  // Prepare holiday checker once for performance
  const holidayChecker = options?.holidayChecker || (options?.region ? getHolidayChecker(options.region) : undefined);
  for (let i = 0; i < (options?.numberOfMonths || 0); i++) {
    const month = getMonthGroup(year, i, {
      top: topSpacing,
      left: leftSpacing,
      monthRectFill: options?.currentColor,
      lang: options?.lang,
      region: options?.region,
      holidayChecker,
      highlightColor: options?.highlightColor,
      monthNameFontFamily: options?.calendarFontFamily,
      weekFontFamily: options?.calendarFontFamily,
    });
    months.push(month);

    leftSpacing += options?.monthWidth || 0;

    if ((i + 1) % (options?.numberOfMonthsPerRow || 0) === 0) {
      topSpacing += options?.monthHeight || 0;
      leftSpacing = 20;
    }
  }

  return new fabric.Group(months, { scaleX: 0.75, scaleY: 0.75 });
}


// Build a holiday checker using date-holidays
function getHolidayChecker(region?: REGION_OPTIONS) {
  if (!region) return undefined;
  try {
    const hd = new Holidays(region as unknown as string);
    return (d: Date) => Boolean(hd.isHoliday(d));
  } catch (_) {
    return undefined;
  }
}

export const getNewCalendar = (year: number, options: ICurrentOptions) => {

  const layoutMapper = {
    [LAYOUT_OPTIONS.TREEBYFOUR]: 4,
    [LAYOUT_OPTIONS.SIXBYTWO]: 2,
    [LAYOUT_OPTIONS.FOURBYTHREE]: 3,
  }

  const color = options.currentColor;
  const currentColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  const numberOfMonthsPerRow = layoutMapper[options.currentLayout];

  return getMonthsGroup(year, {
    currentColor,
    numberOfMonthsPerRow,
    lang: options.currentLanguage,
    region: options.currentRegion,
    calendarFontFamily: options.currentCalendarFont,
  });
}

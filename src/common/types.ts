import { fabric } from 'fabric';
import { RGBColor } from 'react-color';

export interface IGetMonthOptions extends fabric.IGroupOptions {
  monthNameFontFamily?: string;
  monthNameFontSize?: number;
  // Also allow specifying font for weeks (weekday labels and day numbers)
  weekFontFamily?: string;
  monthNameTop?: number;
  monthRectWidth?: number;
  monthRectHeight?: number;
  monthRectFill?: string;
  weekDaysTop?: number;
  weekTopIncrement?: number;
  top?: number;
  left?: number;
  lang?: LANG_OPTIONS;
  region?: REGION_OPTIONS;
  holidayChecker?: (date: Date) => boolean;
  highlightColor?: string;
}

export interface IGetWeekOptions extends fabric.IGroupOptions {
  weekFontSize?: number;
  weekFontFamily?: string;
  weekTextAlign?: string;
  weekTotalWidth?: number;
  weekSpaceBetween?: number;
  weekFills?: (string | undefined)[];
}

export interface IGetMonthsOptions extends fabric.IGradientOptions {
  monthTopSpacing?: number;
  monthLeftSpacing?: number;
  numberOfMonths?: number;
  numberOfMonthsPerRow?: number;
  monthWidth?: number;
  monthHeight?: number;
  currentColor?: string;
  lang?: LANG_OPTIONS;
  region?: REGION_OPTIONS;
  holidayChecker?: (date: Date) => boolean;
  highlightColor?: string;
  // Optional font to apply to both month names and week/day labels
  calendarFontFamily?: string;
}

export enum LAYOUT_OPTIONS {
  TREEBYFOUR = '3X4',
  SIXBYTWO = '6X2',
  FOURBYTHREE = '4X3'
}

export enum LANG_OPTIONS {
  EN = 'EN',
  ES = 'ES',
}

export enum REGION_OPTIONS {
  AR = 'AR',
  US = 'US',
  VE = 'VE',
  ES = 'ES',
  MX = 'MX',
  IT = 'IT',
  JP = 'JP',
}

export interface ICurrentOptions {
  currentLayout: LAYOUT_OPTIONS;
  currentColor: RGBColor;
  currentLanguage: LANG_OPTIONS;
  currentRegion: REGION_OPTIONS;
  currentCalendarFont: string;
};

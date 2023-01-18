import { fabric } from 'fabric';

export interface IGetMonthOptions extends fabric.IGroupOptions {
  monthNameFontFamily?: string;
  monthNameFontSize?: number;
  monthNameTop?: number;
  monthRectWidth?: number;
  monthRectHeight?: number;
  monthRectFill?: string;
  weekDaysTop?: number;
  weekTopIncrement?: number;
  top?: number;
  left?: number;
}

export interface IGetWeekOptions extends fabric.IGroupOptions {
  weekFontSize?: number;
  weekFontFamily?: string;
  weekTextAlign?: string;
  weekTotalWidth?: number;
  weekSpaceBetween?: number;
}

export interface IGetMonthsOptions extends fabric.IGradientOptions {
  monthTopSpacing?: number;
  monthLeftSpacing?: number;
  numberOfMonths?: number;
  numberOfMonthsPerRow?: number;
  monthWidth?: number;
  monthHeight?: number;
}

export enum LAYOUT_OPTIONS {
  TREEBYFOUR = '3X4',
  SIXBYTWO = '6X2',
  FOURBYTHREE = '4X3'
}
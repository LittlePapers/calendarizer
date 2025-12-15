import { IGetWeekOptions, IGetMonthOptions, IGetMonthsOptions } from "./types";

export const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const WEEK_DAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
export const WEEK_DAYS_ES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

export const DEFAULT_WEEK_OPTIONS: IGetWeekOptions = {
  weekFontSize: 12,
  weekFontFamily: "monospace",
  weekTextAlign: "center",
  weekTotalWidth: 200,
  weekSpaceBetween: 0
};

export const DEFAULT_MONTH_OPTIONS: IGetMonthOptions = {
  top: 10,
  left: 10,
  monthNameFontFamily: "monospace",
  monthNameFontSize: 20,
  monthNameTop: 10,
  monthRectWidth: 220,
  monthRectHeight: 210,
  monthRectFill: "rgba(211, 211, 211, 0.5)",
  weekDaysTop: 48,
  weekTopIncrement: 24
};

export const DEFAULT_GET_MONTHS_OPTIONS: IGetMonthsOptions = {
  monthTopSpacing: 20,
  monthLeftSpacing: 20,
  numberOfMonths: 12,
  numberOfMonthsPerRow: 4,
  monthWidth: 240,
  monthHeight: 230,
}

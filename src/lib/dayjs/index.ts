import "dayjs/locale/mn";

import dayjs, { extend, locale } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isLeapYear from "dayjs/plugin/isLeapYear";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

extend(utc);
extend(timezone);
extend(customParseFormat);
dayjs.tz.setDefault("Asia/Ulaanbaatar");
locale("mn");

extend(isLeapYear);

export default dayjs;

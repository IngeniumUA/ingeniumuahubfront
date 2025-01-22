import {PraesidiumGroupI} from "@ingenium/app/shared/models/praesidium";

import _year2425 from "./praesidium_24-25.json";
import _year2324 from "./praesidium_23-24.json";
import _year2223 from "./praesidium_22-23.json";
import _year2122 from "./praesidium_21-22.json";
import _year2021 from "./praesidium_20-21.json";
import _year1920 from "./praesidium_19-20.json";
import _year1819 from "./praesidium_18-19.json";

export default {
  '24-25': _year2425 as unknown as PraesidiumGroupI[],
  '23-24': _year2324 as unknown as PraesidiumGroupI[],
  '22-23': _year2223 as unknown as PraesidiumGroupI[],
  '21-22': _year2122 as unknown as PraesidiumGroupI[],
  '20-21': _year2021 as unknown as PraesidiumGroupI[],
  '19-20': _year1920 as unknown as PraesidiumGroupI[],
  '18-19': _year1819 as unknown as PraesidiumGroupI[]
}



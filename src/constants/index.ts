import type { IconType } from "react-icons";
import { BiHomeAlt } from "react-icons/bi";
import { HiOutlineCalendarDays } from "react-icons/hi2";

export const NAV_ITEMS: { to: string; icon: IconType; title: string }[] = [
  {
    to: "/",
    icon: BiHomeAlt,
    title: "Home",
  },
  {
    to: "/events",
    icon: HiOutlineCalendarDays,
    title: "Events",
  },
];

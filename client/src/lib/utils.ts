import { CallStateType, ConversationStateType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "universal-cookie";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getId() {
  const cookies = new Cookies();
  return cookies.get("id");
}

export function formatAvatarName(name: string): string {
  const words = name.split(" ");
  return words.length > 1 ? words[0][0] + words[1][0] : words[0][0];
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${secondsRemaining
    .toString()
    .padStart(2, "0")}`;
}

export const noConversation: ConversationStateType = {
  conversationId: "",
  name: "",
  avatar: "",
  email: null,
  participants: [],
  conversationType: null,
  hasConversation: null,
};

export const noCall: CallStateType = {
  callId: "",
  name: "",
  avatar: "",
  email: null,
  participants: [],
  callType: null,
};

export const server = import.meta.env.VITE_SERVER_DOMAIN;

export function getFileName(fileName: string): string {
  return fileName.split("---")[1];
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Strip time and compare dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  // Check if the date is today
  if (inputDate.getTime() === today.getTime()) {
    return "Today";
  }

  // Check if the date is tomorrow
  if (inputDate.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  }

  // Day names and month names arrays
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = monthsOfYear[date.getMonth()];
  const year = date.getFullYear();

  // Suffix for the day of the month
  const getDaySuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th"; // 11th, 12th, 13th, etc.
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const daySuffix = getDaySuffix(day);
  const formattedDay = `${day}${daySuffix}`;

  // Check if the year is the current year
  const currentYear = now.getFullYear();
  const formattedDate =
    year === currentYear
      ? `${dayOfWeek}, ${formattedDay} ${month}`
      : `${dayOfWeek}, ${formattedDay} ${month} ${year}`;

  return formattedDate;
}

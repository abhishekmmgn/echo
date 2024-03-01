export function formatAvatarName(name: string): string {
  if (name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  } else {
    return "";
  }
}

export function formatDate(date: string | Date): string {
  if (!date) return "";
  if (date.toString() === new Date().toString()) {
    return "Today";
  } else if (date.toString() === "Yesterday") {
    return "Yesterday";
  } else {
    return new Date(date).toLocaleDateString();
  }
}

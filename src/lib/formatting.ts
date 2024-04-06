export function formatAvatarName(name: string): string {
  if (name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
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

export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}

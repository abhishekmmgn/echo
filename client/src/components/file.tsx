import { Download } from "lucide-react";
import { saveAs } from "file-saver";

export default function File({ name, url }: { name: string; url: string }) {
  function downloadFile() {
    saveAs(url, name);
  }
  return (
    <div className="w-full h-14 flex items-center justify-between border-b px-4 gap-4">
      <p className="line-clamp-1 font-medium text-wrap break-all">{name}</p>
      <Download
        className="text-muted-foreground/70 cursor-pointer hover:text-muted-foreground/90"
        onClick={downloadFile}
      />
    </div>
  );
}

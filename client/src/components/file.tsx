import { Download } from "lucide-react";

export default function File({ name, url }: { name: string; url: string }) {
  function downloadFile() {
    // download file
  }
  return (
    <div className="w-full h-14 flex items-center justify-between border-b px-4 gap-4">
      <div className="">
        <p className="line-clamp-1 font-medium">{name}</p>
      </div>
      <Download
        className="text-muted-foreground/70 cursor-pointer hover:text-muted-foreground/90"
        onClick={downloadFile}
      />
    </div>
  );
}

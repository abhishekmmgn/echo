export default function Header({ title }: { title: string }) {
  return (
    <div className="h-14 flex items-center justify-center">
      <p className="text-lg md:text-lg+ text-primary font-semibold">{title}</p>
    </div>
  );
}

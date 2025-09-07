import StarIcon from "./star-icon";

export default function LoadingFallback({ msg }: { msg: string }) {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="p-4 text-sm animate-pulse text-center">{msg}</div>
      <StarIcon animation="rotate" strokeWidth={0.2} title="" animationDuration={2} variant="primary" />
    </div>
  );
}

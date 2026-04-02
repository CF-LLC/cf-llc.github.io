export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 h-full w-full rounded-full border-8 border-sky-200/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 h-full w-full rounded-full border-t-8 border-sky-400 animate-spin"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-sky-200">
          CF
        </div>
      </div>
    </div>
  )
}
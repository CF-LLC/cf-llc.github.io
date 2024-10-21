export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-indigo-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-8 border-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-500 font-bold">
          CF
        </div>
      </div>
    </div>
  )
}
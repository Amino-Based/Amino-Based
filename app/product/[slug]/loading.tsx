export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 md:pt-36 px-4 sm:px-6 md:px-8 lg:px-12" aria-busy="true">
      <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl bg-gray-200" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-1/4 rounded bg-gray-200" />
            <div className="h-10 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/4 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
            <div className="h-12 w-1/2 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

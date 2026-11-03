export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 md:pt-36 px-4 sm:px-6 md:px-8 lg:px-12" aria-busy="true">
      <div className="animate-pulse">
        <div className="h-64 md:h-80 rounded-[2rem] bg-gray-200 mb-12" />
        <div className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-6rem)] mx-auto">
          <div className="h-14 rounded-2xl bg-gray-200 mb-10" />
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-black/5 p-3">
                <div className="aspect-square rounded-xl bg-gray-200 mb-4" />
                <div className="h-4 w-3/4 rounded bg-gray-200 mb-2" />
                <div className="h-4 w-1/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

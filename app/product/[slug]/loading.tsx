export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-28 md:pt-36 px-4 sm:px-6 md:px-8 lg:px-12" aria-busy="true">
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          <div className="aspect-square rounded-[24px] sm:rounded-[32px] bg-[#E2E8F0]/60 border border-[#E2E8F0]" />
          <div className="flex flex-col gap-5 pt-2">
            <div className="h-6 w-1/3 rounded-full bg-[#E2E8F0]/60" />
            <div className="h-12 w-3/4 rounded-2xl bg-[#E2E8F0]/60" />
            <div className="h-8 w-1/4 rounded-xl bg-[#E2E8F0]/60" />
            <div className="h-20 rounded-2xl bg-[#E2E8F0]/60" />
            <div className="h-12 w-full rounded-full bg-[#E2E8F0]/60" />
          </div>
        </div>
      </div>
    </div>
  );
}

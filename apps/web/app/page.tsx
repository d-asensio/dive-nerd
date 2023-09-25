import {Separator} from "@/components/ui/separator";

const TopBar = () => (
  <div className="hidden h-full flex-col md:flex">
    <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
      <div className="flex items-center space-x-2">
        <span className="text-4xl">
          🤿
        </span>
        <h2 className="text-2xl font-semibold">
          DiveNerd
        </h2>
      </div>
      <div className="ml-auto flex w-full space-x-2 sm:justify-end">
        <div className="hidden space-x-2 md:flex">

        </div>
      </div>
    </div>
    <Separator />
  </div>
)

export default function Home() {
  return (
    <main>
      <TopBar />
    </main>
  )
}

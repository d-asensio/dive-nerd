import { cn } from "@/lib/utils"
import {Button} from "@/components/ui/button";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Learn
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              Gas planning guide
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

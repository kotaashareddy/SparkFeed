import { createFileRoute } from "@tanstack/react-router"
import { SparkFeed } from "@/SparkFeed"

export const Route = createFileRoute("/test-saas")({
  component: TestSaasPage,
})

function TestSaasPage() {
  return (
    <div className="h-screen w-full bg-black p-8">
      <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Library Test Page</h1>
            <p className="text-zinc-500 text-sm">Testing the &lt;SparkFeed /&gt; component with a live API Key</p>
          </div>
          <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-zinc-400 font-mono">
            Key: spark_dev_...
          </div>
        </header>

        {/* This is how another developer will use your project! */}
        <div className="flex-1 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl bg-zinc-950">
          <SparkFeed
            apiKey="spark_dev_22031ec72ff145c0"

            title="My SaaS Feed"
          />
        </div>

      </div>
    </div>
  )
}

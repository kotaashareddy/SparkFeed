import React, { useMemo, useEffect, useState } from "react"
import { SparkFeedProvider } from "./lib/SparkFeedContext"
import { SparkFeedClient } from "./lib/api"
import { RSSShell } from "./components/RSSShell"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Minimal QueryClient since our components use Query internally
const queryClient = new QueryClient()

interface SparkFeedProps {
  apiKey: string
  apiUrl?: string
  title?: string
  className?: string
}

export const SparkFeed = ({
  apiKey,
  apiUrl = "https://spark-feed-z3m9.vercel.app",
  title = "My Feed",
  className,
}: SparkFeedProps) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const client = useMemo(() => new SparkFeedClient(apiKey, apiUrl), [apiKey, apiUrl])

  useEffect(() => {
    client.getAllData()
      .then(setData)
      .finally(() => setLoading(false))
  }, [client])

  if (loading) return <div>Loading SparkFeed...</div>
  if (!data) return <div>Error loading feed. Check API key.</div>

  return (
    <div className={className}>
      <QueryClientProvider client={queryClient}>
        <SparkFeedProvider apiKey={apiKey} apiUrl={apiUrl}>
          <RSSShell
            initialData={data}
            title={title}
            filterArticles={(articles) => articles}
          />
        </SparkFeedProvider>
      </QueryClientProvider>
    </div>
  )
}

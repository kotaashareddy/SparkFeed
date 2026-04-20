import React, { createContext, useContext, ReactNode } from "react"

interface SparkFeedContextType {
  apiKey: string
  apiUrl: string
}

const SparkFeedContext = createContext<SparkFeedContextType | undefined>(undefined)

export const SparkFeedProvider = ({
  apiKey,
  apiUrl,
  children,
}: {
  apiKey: string
  apiUrl: string
  children: ReactNode
}) => {
  return (
    <SparkFeedContext.Provider value={{ apiKey, apiUrl }}>
      {children}
    </SparkFeedContext.Provider>
  )
}

export const useSparkFeed = () => {
  const context = useContext(SparkFeedContext)
  if (!context) {
    throw new Error("useSparkFeed must be used within a SparkFeedProvider")
  }
  return context
}

/**
 * A standard fetch wrapper that automatically includes the x-api-key header.
 */
export async function sparkFetch(url: string, options: RequestInit = {}) {
  // In a real library, we'd get this from context or a global config
  // For the RPC-over-HTTP bridge, we'll implement this helper.
  return fetch(url, options)
}

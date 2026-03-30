import { useState } from "react"
import { Heart, ExternalLink, Share2, Eye } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { ArticleSheet } from "@/components/ArticleSheet"
import { toggleFavorite } from "@/server/rss"
import type { ArticleRow } from "@/components/ArticleGrid"

const PASTEL_COLORS = [
  "#dbeafe",
  "#fce7f3",
  "#dcfce7",
  "#fef9c3",
  "#ede9fe",
  "#ffedd5",
]

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

function formatDate(date: Date | string | null) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(date: Date | string | null) {
  if (!date) return ""
  const d = new Date(date)
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

interface ArticleCardProps {
  article: ArticleRow
  index: number
  onUpdate: () => void
}

export function ArticleCard({ article, index, onUpdate }: ArticleCardProps) {
  const [isFavorite, setIsFavorite] = useState(article.isFavorite ?? false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const domain = article.domain ?? getDomain(article.link)
  const fallbackColor = PASTEL_COLORS[index % PASTEL_COLORS.length]

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !isFavorite
    setIsFavorite(next)
    try {
      await toggleFavorite({ data: { id: article.id, state: next } })
    } catch {
      setIsFavorite(!next)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(article.link)
      toast.success("Link copied")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSheetOpen(true)
  }

  return (
    <>
      <Card
        id={`article-card-${article.id}`}
        className="group relative flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl border-white/5 hover:border-white/10 p-0 rounded-xl"
      >
        {/* Top: Image area — strict 4:3 ratio so it behaves consistently */}
        <div
          className="relative w-full overflow-hidden shrink-0"
          style={{ backgroundColor: fallbackColor, aspectRatio: "4/3" }}
        >
          {article.image && (
            <img
              src={article.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                ; (e.target as HTMLImageElement).style.display = "none"
              }}
            />
          )}

          {/* Heart icon */}
          <button
            onClick={handleFavorite}
            className="absolute top-2.5 right-2.5 z-10 transition-transform hover:scale-110"
            aria-label="Toggle favorite"
          >
            <Heart
              className="h-4 w-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
              style={{
                fill: isFavorite ? "#ef4444" : "transparent",
                color: isFavorite ? "#ef4444" : "white",
              }}
            />
          </button>

          {/* Source domain badge */}
          <span className="absolute bottom-2 left-2.5 z-10 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {domain}
          </span>
        </div>

        {/* Bottom: Info area — auto height prevents text clipping! */}
        <CardContent className="flex flex-col justify-between bg-[#1a1a1a] p-3 grow">
          <div className="flex flex-col gap-1 mb-2">
            {/* Published date */}
            <p className="text-[10px] text-zinc-500 leading-none">
              {formatDate(article.publishedAt)}
            </p>

            {/* Title — max 2 lines */}
            <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white">
              {article.title}
            </h3>
          </div>

          {/* Bottom row */}
          <div className="mt-auto flex items-center justify-between">
            {/* Time */}
            <span className="text-[10px] text-zinc-600">
              {formatTime(article.publishedAt)}
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-0.5">

              {/* Preview (opens Sheet) */}
              <button
                onClick={handlePreview}
                className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Eye className="h-3 w-3" />
                Preview
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition-colors ml-1"
              >
                <Share2 className="h-3 w-3" />
                Share
              </button>

              {/* External link */}
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="ml-1 flex items-center justify-center rounded p-0.5 text-zinc-500 border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Open in new tab"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sheet preview — reuses existing ArticleSheet */}
      <ArticleSheet
        article={sheetOpen ? article : null}
        onClose={() => setSheetOpen(false)}
      />
    </>
  )
}

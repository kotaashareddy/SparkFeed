import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
    id: text('id').primaryKey(), // Usually a clerk or lucia UID
    email: text('email').notNull().unique(),
    apiKey: text('api_key').notNull().unique(),
    name: text('name'),
    createdAt: text('created_at').default(new Date().toISOString()),
})

export const folders = sqliteTable('folders', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').references(() => users.id).notNull(), // Owner of the folder
    createdAt: text('created_at').default(new Date().toISOString()),
})

export const feeds = sqliteTable('feeds', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    userId: text('user_id').references(() => users.id).notNull(), // Owner of the feed
    folderId: text('folder_id').references(() => folders.id),
    includeKeywords: text('include_keywords'),
    excludeKeywords: text('exclude_keywords'),
    createdAt: text('created_at').default(new Date().toISOString()),
})

export const articles = sqliteTable('articles', {
    id: text('id').primaryKey(),
    feedId: text('feed_id').references(() => feeds.id),
    title: text('title').notNull(),
    description: text('description'),
    link: text('link').notNull(),
    image: text('image'),
    publishedAt: text('published_at'),
    isUsed: integer('is_used', { mode: 'boolean' }).default(false),
    visitCount: integer('visit_count').default(0),
    isBookmarked: integer('is_bookmarked', { mode: 'boolean' }).default(false),
    isReadLater: integer('is_read_later', { mode: 'boolean' }).default(false),
    isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
    createdAt: text('created_at').default(new Date().toISOString()),
})
// lib/graphql/index.ts (barrel export for easy imports)
// Queries
export * from './queries/user'
export * from './queries/appointments'
export * from './queries/notifications'

// Mutations
export * from './mutations/user'
export * from './mutations/appointments'
export * from './mutations/notifications'

// Fragments
export * from './fragments/user'
export * from './fragments/appointment'
export * from './fragments/notification'

// Generated types and hooks
export * from './generated/graphql'

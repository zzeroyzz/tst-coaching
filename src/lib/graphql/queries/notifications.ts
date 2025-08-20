// lib/graphql/queries/notifications.ts (queries only)
import { gql, useQuery } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications($unreadOnly: Boolean, $limit: Int) {
    notifications(unreadOnly: $unreadOnly, limit: $limit) {
      id
      title
      message
      type
      read
      archived
      appointmentId
      createdAt
      updatedAt
    }
  }
`
// Custom hooks for notifications
export function useNotifications(options: {
  unreadOnly?: boolean;
  limit?: number;
} = {}) {
  return useQuery(GET_NOTIFICATIONS, {
    variables: {
      unreadOnly: options.unreadOnly || false,
      limit: options.limit || 50,
    },
    errorPolicy: 'all',
    pollInterval: 60000, // Poll every minute for new notifications
  });
}

export function useUnreadNotifications() {
  return useQuery(GET_NOTIFICATIONS, {
    variables: {
      unreadOnly: true,
      limit: 20,
    },
    errorPolicy: 'all',
    pollInterval: 30000, // Poll every 30 seconds for unread notifications
  });
}

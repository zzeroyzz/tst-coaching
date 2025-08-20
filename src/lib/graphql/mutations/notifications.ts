//lib/graphql/mutations/notifications.ts
import { gql, useMutation } from '@apollo/client';

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: String!) {
    markNotificationRead(id: $id) {
      id
      read
      updatedAt
    }
  }
`

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`
// Custom hooks for notification mutations
export function useMarkNotificationRead() {
  return useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
    errorPolicy: 'all',
    optimisticResponse: (vars) => ({
      markNotificationRead: {
        id: vars.id,
        read: true,
        updatedAt: new Date().toISOString(),
        __typename: 'Notification',
      },
    }),
  });
}

export function useMarkAllNotificationsRead() {
  return useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries: [{ query: GET_NOTIFICATIONS }],
    awaitRefetchQueries: true,
    errorPolicy: 'all',
    onCompleted: () => {
      console.log('All notifications marked as read');
    },
  });
}

// Empty for now - we'll add these later
export {}; // Prevents empty file error

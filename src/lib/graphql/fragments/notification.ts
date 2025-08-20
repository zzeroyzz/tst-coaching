// lib/graphql/fragments/notification.ts
import { gql } from '@apollo/client';

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFragment on Notification {
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
`;

export {}; 

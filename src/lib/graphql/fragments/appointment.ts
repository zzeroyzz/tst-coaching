// lib/graphql/fragments/appointment.ts
import { gql } from '@apollo/client';

export const APPOINTMENT_FRAGMENT = gql`
  fragment AppointmentFragment on Appointment {
    id
    title
    description
    scheduledAt
    durationMinutes
    timezone
    type
    status
    createdAt
    updatedAt
  }
`;

export const APPOINTMENT_DETAIL_FRAGMENT = gql`
  fragment AppointmentDetailFragment on Appointment {
    ...AppointmentFragment
    meetingUrl
    meetingId
    clientNotes
    coachNotes
  }
  ${APPOINTMENT_FRAGMENT}
`;

export {}; 

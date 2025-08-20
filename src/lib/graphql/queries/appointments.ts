// lib/graphql/queries/appointments.ts (queries only)
import { gql, useQuery } from '@apollo/client';

export const GET_APPOINTMENTS = gql`
  query GetAppointments($status: AppointmentStatus, $limit: Int) {
    appointments(status: $status, limit: $limit) {
      id
      title
      description
      scheduledAt
      durationMinutes
      timezone
      type
      status
      meetingUrl
      clientNotes
      createdAt
      updatedAt
    }
  }
`
export const GET_APPOINTMENT = gql`
  query GetAppointment($id: String!) {
    appointment(id: $id) {
      id
      title
      description
      scheduledAt
      durationMinutes
      timezone
      type
      status
      meetingUrl
      meetingId
      clientNotes
      coachNotes
      createdAt
      updatedAt
    }
  }
`
// Custom hooks for appointments
export function useAppointments(options: {
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  limit?: number;
} = {}) {
  return useQuery(GET_APPOINTMENTS, {
    variables: {
      status: options.status,
      limit: options.limit || 50,
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });
}

export function useAppointment(id: string) {
  return useQuery(GET_APPOINTMENT, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
  });
}

// Get upcoming appointments
export function useUpcomingAppointments() {
  return useQuery(GET_APPOINTMENTS, {
    variables: {
      status: 'scheduled',
      limit: 10,
    },
    errorPolicy: 'all',
    pollInterval: 30000, // Poll every 30 seconds for updates
  });
}

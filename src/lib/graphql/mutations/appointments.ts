// lib/graphql/mutations/appointments.ts
import { gql, useMutation } from '@apollo/client';

export const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      id
      title
      description
      scheduledAt
      durationMinutes
      type
      status
      createdAt
    }
  }
`
export const UPDATE_APPOINTMENT = gql`
  mutation UpdateAppointment($id: String!, $input: UpdateAppointmentInput!) {
    updateAppointment(id: $id, input: $input) {
      id
      title
      description
      scheduledAt
      durationMinutes
      status
      clientNotes
      updatedAt
    }
  }
`
export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: String!) {
    deleteAppointment(id: $id)
  }
`
// Custom hooks for appointment mutations
export function useCreateAppointment() {
  return useMutation(CREATE_APPOINTMENT, {
    refetchQueries: [
      { query: GET_APPOINTMENTS },
      { query: GET_ME },
    ],
    awaitRefetchQueries: true,
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('Appointment created:', data.createAppointment);
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error);
    },
  });
}

export function useUpdateAppointment() {
  return useMutation(UPDATE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS }],
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('Appointment updated:', data.updateAppointment);
    },
  });
}

export function useDeleteAppointment() {
  return useMutation(DELETE_APPOINTMENT, {
    refetchQueries: [{ query: GET_APPOINTMENTS }],
    awaitRefetchQueries: true,
    errorPolicy: 'all',
    onCompleted: () => {
      console.log('Appointment deleted successfully');
    },
  });
}

// Empty for now - we'll add these later
export {}; // Prevents empty file error

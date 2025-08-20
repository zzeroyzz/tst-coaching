import { builder } from './builder';

// Import all types and mutations
import './types/user';
import './types/habit';
import './mutations/habits';

export const schema = builder.toSchema();

// Make sure these files exist and are empty or have mock functions:
// lib/graphql/queries/appointments.ts (MOCK VERSION)
export function useAppointments() {
  return {
    data: { appointments: [] },
    loading: false,
    error: null
  };
}

export function useAppointment(id: string) {
  return {
    data: null,
    loading: false,
    error: null
  };
}

export function useUpcomingAppointments() {
  return {
    data: { appointments: [] },
    loading: false,
    error: null
  };
}

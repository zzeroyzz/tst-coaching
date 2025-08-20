// lib/graphql/queries/habits.ts
import { gql, useQuery, useMutation } from '@apollo/client';

// Queries
export const GET_HABITS = gql`
  query GetHabits($activeOnly: Boolean = true) {
    habits(activeOnly: $activeOnly) {
      id
      name
      description
      color
      frequency
      targetCount
      isCustom
      isActive
      createdAt
      updatedAt
      progress {
        currentStreak
        longestStreak
        completionRate
        totalCompletions
      }
      recentLogs(days: 7) {
        id
        date
        completed
        count
        notes
      }
    }
  }
`;

export const GET_PREDEFINED_HABITS = gql`
  query GetPredefinedHabits {
    predefinedHabits {
      id
      name
      description
      color
      frequency
      targetCount
    }
  }
`;

export const GET_HABIT = gql`
  query GetHabit($id: ID!) {
    habit(id: $id) {
      id
      name
      description
      color
      frequency
      targetCount
      isCustom
      isActive
      createdAt
      updatedAt
      progress {
        currentStreak
        longestStreak
        completionRate
        totalCompletions
      }
      recentLogs(days: 30) {
        id
        date
        completed
        count
        notes
      }
    }
  }
`;

// Mutations
export const CREATE_HABIT = gql`
  mutation CreateHabit($input: CreateHabitInput!) {
    createHabit(input: $input) {
      id
      name
      description
      color
      frequency
      targetCount
      isCustom
      isActive
    }
  }
`;

export const ADD_PREDEFINED_HABIT = gql`
  mutation AddPredefinedHabit($predefinedHabitId: ID!) {
    addPredefinedHabit(predefinedHabitId: $predefinedHabitId) {
      id
      name
      description
      color
      frequency
      targetCount
      isCustom
      isActive
    }
  }
`;

export const UPDATE_HABIT = gql`
  mutation UpdateHabit($id: ID!, $input: UpdateHabitInput!) {
    updateHabit(id: $id, input: $input) {
      id
      name
      description
      color
      frequency
      targetCount
      isActive
    }
  }
`;

export const DELETE_HABIT = gql`
  mutation DeleteHabit($id: ID!) {
    deleteHabit(id: $id)
  }
`;

export const LOG_HABIT = gql`
  mutation LogHabit($input: LogHabitInput!) {
    logHabit(input: $input) {
      id
      habitId
      date
      completed
      count
      notes
    }
  }
`;

// React Hooks
export function useHabits(activeOnly = true) {
  return useQuery(GET_HABITS, {
    variables: { activeOnly },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });
}

export function usePredefinedHabits() {
  return useQuery(GET_PREDEFINED_HABITS, {
    errorPolicy: 'all',
  });
}

export function useHabit(id: string) {
  return useQuery(GET_HABIT, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
  });
}

export function useCreateHabit() {
  return useMutation(CREATE_HABIT, {
    refetchQueries: [{ query: GET_HABITS }],
  });
}

export function useAddPredefinedHabit() {
  return useMutation(ADD_PREDEFINED_HABIT, {
    refetchQueries: [{ query: GET_HABITS }],
  });
}

export function useUpdateHabit() {
  return useMutation(UPDATE_HABIT, {
    refetchQueries: [{ query: GET_HABITS }],
  });
}

export function useDeleteHabit() {
  return useMutation(DELETE_HABIT, {
    refetchQueries: [{ query: GET_HABITS }],
  });
}

export function useLogHabit() {
  return useMutation(LOG_HABIT, {
    refetchQueries: [{ query: GET_HABITS }],
  });
}
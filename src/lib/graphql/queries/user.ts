// lib/graphql/queries/user.ts (queries only)
import { gql, useQuery } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      displayName
      avatarUrl
      firstName
      lastName
      phone
      timezone
      provider
      isActive
      emailVerified
      fullName
      createdAt
      updatedAt
    }
  }
`

export function useMe() {
  return useQuery(GET_ME, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });
}

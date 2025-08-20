// lib/graphql/mutations/user.ts
import { gql, useMutation } from '@apollo/client';
import { GET_ME } from '../queries/user';

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      displayName
      firstName
      lastName
      phone
      timezone
      fullName
      updatedAt
    }
  }
`;

export function useUpdateUser() {
  return useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GET_ME }],
    awaitRefetchQueries: true,
    errorPolicy: 'all',
  });
}

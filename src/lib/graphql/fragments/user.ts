// lib/graphql/fragments/user.ts
import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    email
    displayName
    avatarUrl
    firstName
    lastName
    fullName
    provider
    isActive
    emailVerified
    createdAt
    updatedAt
  }
`;

export const USER_PROFILE_FRAGMENT = gql`
  fragment UserProfileFragment on User {
    ...UserFragment
    phone
    timezone
  }
  ${USER_FRAGMENT}
`;

export {}; 

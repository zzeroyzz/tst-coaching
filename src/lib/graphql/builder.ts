// lib/graphql/builder.ts (FINAL VERSION)
import SchemaBuilder from '@pothos/core';

export const builder = new SchemaBuilder<{
  Context: {
    user: { id: string } | null;
    supabase: any;
  };
}>({});

builder.queryType({});
// Don't define mutationType until we actually need mutations

// Test your GraphQL by visiting /api/graphql and running this query:
/*
query {
  me {
    id
    email
    fullName
    displayName
    firstName
    lastName
  }
}
*/

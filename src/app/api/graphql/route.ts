import { createYoga } from 'graphql-yoga';
import { schema } from '@/lib/graphql/schema';
import { createServerSupabaseClient } from '@/lib/supabase/server-auth';

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  context: async () => {
    // Get the session from Supabase using server client
    const supabase = await createServerSupabaseClient();

    let user = null;

    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      if (authUser && !error) {
        user = { id: authUser.id };
      }
    } catch (error) {
      console.error('Error getting user from session:', error);
    }

    return {
      user,
      supabase
    };
  }
});

export { handleRequest as GET, handleRequest as POST };

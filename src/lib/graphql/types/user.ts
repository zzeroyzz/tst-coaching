import { builder } from '../builder';

export const User = builder.objectRef<{
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  timezone: string;
  provider: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}>('User');

builder.objectType(User, {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    displayName: t.exposeString('display_name', { nullable: true }),
    avatarUrl: t.exposeString('avatar_url', { nullable: true }),
    firstName: t.exposeString('first_name', { nullable: true }),
    lastName: t.exposeString('last_name', { nullable: true }),
    phone: t.exposeString('phone', { nullable: true }),
    timezone: t.exposeString('timezone'),
    provider: t.exposeString('provider'),
    isActive: t.exposeBoolean('is_active'),
    emailVerified: t.exposeBoolean('email_verified'),
    createdAt: t.exposeString('created_at'),
    updatedAt: t.exposeString('updated_at'),

    fullName: t.string({
      resolve: (user) => {
        if (user.first_name && user.last_name) {
          return `${user.first_name} ${user.last_name}`;
        }
        return user.display_name || user.email.split('@')[0];
      }
    }),
  })
});

builder.queryField('me', (t) =>
  t.field({
    type: User,
    nullable: true,
    resolve: async (_, __, { user, supabase }) => {
      if (!user || !supabase) return null;

      try {
        const { data: authUser, error } = await supabase.auth.getUser();
        
        if (error || !authUser?.user) {
          console.error('Error fetching user:', error);
          return null;
        }

        const userData = authUser.user;
        
        return {
          id: userData.id,
          email: userData.email || '',
          display_name: userData.user_metadata?.display_name || userData.user_metadata?.full_name || null,
          avatar_url: userData.user_metadata?.avatar_url || null,
          first_name: userData.user_metadata?.first_name || null,
          last_name: userData.user_metadata?.last_name || null,
          phone: userData.phone || null,
          timezone: userData.user_metadata?.timezone || 'UTC',
          provider: userData.app_metadata?.provider || 'email',
          is_active: true,
          email_verified: userData.email_confirmed_at ? true : false,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        };
      } catch (error) {
        console.error('Error in me query:', error);
        return null;
      }
    }
  })
);

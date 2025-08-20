// lib/graphql/types/notification.ts
import { builder } from '../builder'
import { supabase } from '@/lib/supabase/server'

export const NotificationType = builder.enumType('NotificationType', {
  values: ['appointment', 'reminder', 'update', 'system'] as const
})

export const Notification = builder.objectRef<{
  id: string
  user_id: string
  title: string
  message: string
  type: 'appointment' | 'reminder' | 'update' | 'system'
  read: boolean
  archived: boolean
  appointment_id: string | null
  created_at: Date
  updated_at: Date
}>('Notification')

builder.objectType(Notification, {
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeString('user_id'),
    title: t.exposeString('title'),
    message: t.exposeString('message'),
    type: t.expose('type', { type: NotificationType }),
    read: t.exposeBoolean('read'),
    archived: t.exposeBoolean('archived'),
    appointmentId: t.exposeString('appointment_id', { nullable: true }),
    createdAt: t.expose('created_at', { type: 'DateTime' }),
    updatedAt: t.expose('updated_at', { type: 'DateTime' }),

    // Relations
    appointment: t.field({
      type: Appointment,
      nullable: true,
      resolve: async (notification) => {
        if (!notification.appointment_id) return null

        const { data } = await supabase
          .from('appointments')
          .select('*')
          .eq('id', notification.appointment_id)
          .single()

        return data
      }
    })
  })
})

// Queries
builder.queryField('notifications', (t) =>
  t.field({
    type: [Notification],
    args: {
      unreadOnly: t.arg.boolean({ required: false, defaultValue: false }),
      limit: t.arg.int({ required: false, defaultValue: 50 })
    },
    resolve: async (_, { unreadOnly, limit }, { user }) => {
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('archived', false)
        .order('created_at', { ascending: false })
        .limit(limit!)

      if (unreadOnly) {
        query = query.eq('read', false)
      }

      const { data } = await query
      return data || []
    }
  })
)

// Mutations
builder.mutationField('markNotificationRead', (t) =>
  t.field({
    type: Notification,
    args: {
      id: t.arg.string({ required: true })
    },
    resolve: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')

      const { data } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      return data
    }
  })
)

builder.mutationField('markAllNotificationsRead', (t) =>
  t.field({
    type: 'Boolean',
    resolve: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false)

      return !error
    }
  })
)

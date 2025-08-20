// lib/graphql/types/appointment.ts
import { builder } from '../builder'
import { supabase } from '@/lib/supabase/server'

export const AppointmentType = builder.enumType('AppointmentType', {
  values: ['consultation', 'coaching', 'follow-up'] as const
})

export const AppointmentStatus = builder.enumType('AppointmentStatus', {
  values: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'] as const
})

export const Appointment = builder.objectRef<{
  id: string
  user_id: string
  title: string
  description: string | null
  scheduled_at: Date
  duration_minutes: number
  timezone: string
  type: 'consultation' | 'coaching' | 'follow-up'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  meeting_url: string | null
  meeting_id: string | null
  client_notes: string | null
  coach_notes: string | null
  created_at: Date
  updated_at: Date
}>('Appointment')

builder.objectType(Appointment, {
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeString('user_id'),
    title: t.exposeString('title'),
    description: t.exposeString('description', { nullable: true }),
    scheduledAt: t.expose('scheduled_at', { type: 'DateTime' }),
    durationMinutes: t.exposeInt('duration_minutes'),
    timezone: t.exposeString('timezone'),
    type: t.expose('type', { type: AppointmentType }),
    status: t.expose('status', { type: AppointmentStatus }),
    meetingUrl: t.exposeString('meeting_url', { nullable: true }),
    meetingId: t.exposeString('meeting_id', { nullable: true }),
    clientNotes: t.exposeString('client_notes', { nullable: true }),
    coachNotes: t.exposeString('coach_notes', { nullable: true }),
    createdAt: t.expose('created_at', { type: 'DateTime' }),
    updatedAt: t.expose('updated_at', { type: 'DateTime' }),

    // Relations
    user: t.field({
      type: User,
      resolve: async (appointment) => {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', appointment.user_id)
          .single()
        return data
      }
    })
  })
})

// Queries
builder.queryField('appointments', (t) =>
  t.field({
    type: [Appointment],
    args: {
      status: t.arg({ type: AppointmentStatus, required: false }),
      limit: t.arg.int({ required: false, defaultValue: 50 })
    },
    resolve: async (_, { status, limit }, { user }) => {
      if (!user) throw new Error('Not authenticated')

      let query = supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_at', { ascending: true })
        .limit(limit!)

      if (status) {
        query = query.eq('status', status)
      }

      const { data } = await query
      return data || []
    }
  })
)

builder.queryField('appointment', (t) =>
  t.field({
    type: Appointment,
    nullable: true,
    args: {
      id: t.arg.string({ required: true })
    },
    resolve: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')

      const { data } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      return data
    }
  })
)

// Mutations
const CreateAppointmentInput = builder.inputType('CreateAppointmentInput', {
  fields: (t) => ({
    title: t.string({ required: true }),
    description: t.string({ required: false }),
    scheduledAt: t.field({ type: 'DateTime', required: true }),
    durationMinutes: t.int({ required: false, defaultValue: 60 }),
    type: t.field({ type: AppointmentType, required: true }),
    clientNotes: t.string({ required: false })
  })
})

const UpdateAppointmentInput = builder.inputType('UpdateAppointmentInput', {
  fields: (t) => ({
    title: t.string({ required: false }),
    description: t.string({ required: false }),
    scheduledAt: t.field({ type: 'DateTime', required: false }),
    durationMinutes: t.int({ required: false }),
    status: t.field({ type: AppointmentStatus, required: false }),
    clientNotes: t.string({ required: false })
  })
})

builder.mutationField('createAppointment', (t) =>
  t.field({
    type: Appointment,
    args: {
      input: t.arg({ type: CreateAppointmentInput, required: true })
    },
    resolve: async (_, { input }, { user }) => {
      if (!user) throw new Error('Not authenticated')

      const { data } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          title: input.title,
          description: input.description,
          scheduled_at: input.scheduledAt.toISOString(),
          duration_minutes: input.durationMinutes,
          type: input.type,
          client_notes: input.clientNotes,
          timezone: 'UTC' // TODO: Get from user profile
        })
        .select()
        .single()

      return data
    }
  })
)

builder.mutationField('updateAppointment', (t) =>
  t.field({
    type: Appointment,
    args: {
      id: t.arg.string({ required: true }),
      input: t.arg({ type: UpdateAppointmentInput, required: true })
    },
    resolve: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Not authenticated')

      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (input.title) updateData.title = input.title
      if (input.description !== undefined) updateData.description = input.description
      if (input.scheduledAt) updateData.scheduled_at = input.scheduledAt.toISOString()
      if (input.durationMinutes) updateData.duration_minutes = input.durationMinutes
      if (input.status) updateData.status = input.status
      if (input.clientNotes !== undefined) updateData.client_notes = input.clientNotes

      const { data } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      return data
    }
  })
)

builder.mutationField('deleteAppointment', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.string({ required: true })
    },
    resolve: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      return !error
    }
  })
)




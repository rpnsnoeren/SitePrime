import { supabase } from './supabase'

interface ActivityData {
  description: string
  type: 'quote' | 'freelancer' | 'chat'
  related_id?: string
  related_type?: string
  metadata?: Record<string, any>
}

export const logActivity = async (data: ActivityData) => {
  try {
    const { error } = await supabase
      .from('activities')
      .insert([{
        description: data.description,
        type: data.type,
        related_id: data.related_id,
        related_type: data.related_type,
        metadata: data.metadata
      }])

    if (error) throw error
  } catch (error) {
    console.error('Error logging activity:', error)
    throw error
  }
}

export const formatFreelancerActivity = (action: string, freelancer: any) => {
  const name = `${freelancer.first_name} ${freelancer.last_name}`.trim()
  return `Freelancer ${name} ${action}`
}

export const formatQuoteActivity = (action: string, quote: any) => {
  return `Opdracht ${quote.title || quote.id} ${action}`
}

'use client'

import { useForm } from 'react-hook-form'
import { Dialog } from '@headlessui/react'
import { supabase } from '@/lib/supabase'
import { logActivity, formatFreelancerActivity } from '@/lib/activities'

interface FreelancerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FreelancerFormData {
  name: string
  email: string
  phone: string
  expertise: string
  experience: string
  rate: string
  availability: string
}

export default function FreelancerModal({ isOpen, onClose }: FreelancerModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FreelancerFormData>()

  const onSubmit = async (data: FreelancerFormData) => {
    try {
      const { data: freelancer, error } = await supabase
        .from('freelancers')
        .insert([{
          ...data,
          status: 'pending'
        }])
        .select()
        .single()

      if (error) throw error

      await logActivity({
        description: formatFreelancerActivity('heeft zich aangemeld', freelancer),
        type: 'freelancer',
        related_id: freelancer.id,
        related_type: 'freelancers'
      })

      reset()
      onClose()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6 w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Nieuwe Freelancer
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Naam
              </label>
              <input
                type="text"
                {...register('name', { required: 'Naam is verplicht' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is verplicht',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Ongeldig email adres'
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefoonnummer
              </label>
              <input
                type="tel"
                {...register('phone', { required: 'Telefoonnummer is verplicht' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expertise
              </label>
              <input
                type="text"
                {...register('expertise', { required: 'Expertise is verplicht' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.expertise && (
                <p className="mt-1 text-sm text-red-600">{errors.expertise.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ervaring (jaren)
              </label>
              <input
                type="text"
                {...register('experience', { required: 'Ervaring is verplicht' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Uurtarief (€)
              </label>
              <input
                type="text"
                {...register('rate', { required: 'Uurtarief is verplicht' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.rate && (
                <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Beschikbaarheid
              </label>
              <input
                type="text"
                {...register('availability', { required: 'Beschikbaarheid is verplicht' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="bijv. 24 uur per week, vanaf maart 2024"
              />
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Opslaan
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
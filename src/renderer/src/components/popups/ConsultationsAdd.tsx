import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormInput from '../form/FormInput'
import FormSelect from '../form/FormSelect'
import Button from '../buttons/Button'
import SearchSelect from '../form/SearchSelect'

interface ConsultationData {
  clientName: string
  doctorName: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  date: string
  time: string
}

interface ConsultationsAddProps {
  onSubmit: (data: ConsultationData) => void
  onCancel: () => void
  options: {
    clients: { label: string; value: string }[]
    doctors: { label: string; value: string }[]
    services: { label: string; value: string; price: number }[]
  }
}

const ConsultationsAdd: React.FC<ConsultationsAddProps> = ({ onSubmit, onCancel, options }) => {
  const now = new Date()
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  const methods = useForm<ConsultationData>({
    defaultValues: {
      clientName: '',
      doctorName: '',
      age: 0,
      gender: 'Male',
      date: localDate,
      time: '10:00 AM'
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-2">
          <div className="w-full">
            <FormInput name="date" label={'Date'} type="datetime-local" className="w-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SearchSelect
            name="clientName"
            label="Select Patient"
            placeholder="Search Patient..."
            options={options.clients}
          />
          <SearchSelect
            name="doctorName"
            label="Assign Doctor"
            placeholder="Select Doctor..."
            options={options.doctors}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="px-8 flex-1"
            size="large"
            variant="outlined"
            onClick={onCancel}
            bgColor="#f44336"
            textColor="#f44336"
            type="button"
          >
            Cancel
          </Button>
          <Button className="flex-1" size="large" variant="filled" type="submit" bgColor="#333333">
            Add
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default ConsultationsAdd
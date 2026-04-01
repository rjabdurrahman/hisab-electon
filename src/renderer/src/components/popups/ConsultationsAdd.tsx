import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormInput from '../form/FormInput'
import Button from '../buttons/Button'
import SearchSelect from '../form/SearchSelect'

interface ConsultationData {
  patientId: number
  doctorId: number
  date: string
  consultationFee: number
  notes?: string
}

interface ConsultationsAddProps {
  onSubmit: (data: any) => void | Promise<void>
  onCancel: () => void
  options: {
    clients: { label: string; value: number }[]
    doctors: { label: string; value: number; fee?: number }[]
    services?: { label: string; value: number; price: number }[]
  }
}

const ConsultationsAdd: React.FC<ConsultationsAddProps> = ({ onSubmit, onCancel, options }) => {
  const now = new Date()
  // datetime-local input requires YYYY-MM-DDTHH:mm format
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  const methods = useForm<ConsultationData>({
    defaultValues: {
      patientId: 0,
      doctorId: 0,
      date: localDateTime,
      consultationFee: 0,
      notes: ''
    }
  })

  // Auto-fill fee when doctor changes
  const selectedDoctorId = methods.watch('doctorId')
  React.useEffect(() => {
    if (selectedDoctorId) {
      const doc = options.doctors.find((d) => d.value === Number(selectedDoctorId))
      if (doc && doc.fee) {
        methods.setValue('consultationFee', doc.fee)
      }
    }
  }, [selectedDoctorId, options.doctors])

  const handleFormSubmit = (data: ConsultationData) => {
    // Current input is YYYY-MM-DDTHH:mm, convert to full ISO for DB
    const combinedDateTime = new Date(data.date).toISOString()
    onSubmit({
      ...data,
      date: combinedDateTime
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormInput name="date" label={'Date & Time'} type="datetime-local" required="Date and Time is required" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="consultationFee" label="Consultation Fee" type="number" required />
          <div />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SearchSelect
            name="patientId"
            label="Select Patient"
            placeholder="Search Patient..."
            options={options.clients}
          />
          <SearchSelect
            name="doctorId"
            label="Assign Doctor"
            placeholder="Select Doctor..."
            options={options.doctors}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormInput name="notes" label="Consultation Notes (Optional)" placeholder="e.g. Regular checkup" />
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
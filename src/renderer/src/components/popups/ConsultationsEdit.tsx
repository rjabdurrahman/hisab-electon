import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormInput from '../form/FormInput'
import Button from '../buttons/Button'
import SearchSelect from '../form/SearchSelect'

interface ConsultationFormData {
  id?: number
  patientId: number
  doctorId: number
  date: string
  consultationFee: number
  notes?: string
}

interface ConsultationsEditProps {
  onSubmit: (data: any) => void | Promise<void>
  onCancel: () => void
  initialData: any
  options: {
    clients: { label: string; value: number }[]
    doctors: { label: string; value: number; fee?: number }[]
  }
}

/** Extract date and time in YYYY-MM-DDTHH:mm format for datetime-local input */
const extractDateTime = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const offset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - offset).toISOString().slice(0, 16)
}

const ConsultationsEdit: React.FC<ConsultationsEditProps> = ({
  onSubmit,
  onCancel,
  initialData,
  options
}) => {
  const methods = useForm<ConsultationFormData>({
    defaultValues: {
      id: initialData?.id,
      patientId: initialData?.patient?.id || initialData?.patientId,
      doctorId: initialData?.doctor?.id || initialData?.doctorId,
      date: extractDateTime(initialData?.date),
      consultationFee: initialData?.consultationFee || 0,
      notes: initialData?.notes || ''
    }
  })

  const handleFormSubmit = (data: ConsultationFormData) => {
    // Current input is YYYY-MM-DDTHH:mm, convert to full ISO for DB
    const combinedDateTime = new Date(data.date).toISOString()
    onSubmit({ ...data, date: combinedDateTime })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <FormInput name="date" label="Date & Time" type="datetime-local" required="Date and Time is required" />
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
            Update
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default ConsultationsEdit
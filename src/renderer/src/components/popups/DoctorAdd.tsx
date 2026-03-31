import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormInput from '../form/FormInput'
import FormSelect from '../form/FormSelect'
import Button from '../buttons/Button'

interface DoctorData {
  name: string
  specialty: string
  phone: string
  availability: string
  gender?: string
  joiningDate?: string
  doctorsFee?: number
}

interface DoctorAddProps {
  onSubmit: (data: DoctorData) => void
  onCancel: () => void
}

const DoctorAdd: React.FC<DoctorAddProps> = ({ onSubmit, onCancel }) => {
  const methods = useForm<DoctorData>({
    defaultValues: {
      name: '',
      specialty: '',
      phone: '',
      gender: 'Male',
      availability: 'Morning',
      joiningDate: '',
      doctorsFee: 0
    }
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput name="joiningDate" label="Joining Date" type="date" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="name"
            label="Full Name"
            placeholder="e.g. Dr. John Doe"
            required="Name is required"
          />
          <FormInput
            name="specialty"
            label="Medical Specialty"
            placeholder="e.g. Cardiology"
            required="Specialty is required"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="phone" label="Contact Number" placeholder="e.g. 01700000000" />
          <FormSelect
            name="gender"
            label="Gender"
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' }
            ]}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="availability"
            label="Availability Shift"
            options={[
              { label: 'Morning', value: 'Morning' },
              { label: 'Afternoon', value: 'Afternoon' },
              { label: 'Evening', value: 'Evening' }
            ]}
          />
          <FormInput name="doctorsFee" label="Doctor's Fee" type="number" placeholder="e.g. 500" />
        </div>
        <div className="pt-6 flex justify-end gap-2 border-t border-gray-100 -mx-5 px-5">
          <Button
            className="flex-1"
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

export default DoctorAdd

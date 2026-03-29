import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";

interface DoctorData {
  id?: number;
  name: string;
  specialty: string;
  phone: string;
  availability: string;
  email?: string;
  address?: string;
  gender?: string;
  joiningDate?: string;
}

interface DoctorEditProps {
  initialData: DoctorData;
  onSubmit: (data: DoctorData) => void;
  onCancel: () => void;
}

const DoctorEdit: React.FC<DoctorEditProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<DoctorData>({
    defaultValues: initialData
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="name" label="Full Name" required="Name is required" />
          <FormInput name="email" label="Email Address" type="email" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="specialty" label="Medical Specialty" required="Specialty is required" />
          <FormInput name="phone" label="Contact Number" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect 
            name="gender" 
            label="Gender" 
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' }
            ]} 
          />
          <FormSelect 
            name="availability" 
            label="Availability Shift" 
            options={[
              { label: 'Morning', value: 'Morning' },
              { label: 'Afternoon', value: 'Afternoon' },
              { label: 'Evening', value: 'Evening' }
            ]} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="joiningDate" label="Joining Date" type="date" />
          <FormInput name="address" label="Home Address" />
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
          <Button
            className="flex-1"
            size="large"
            variant="filled"
            type="submit"
            bgColor="#333333"
          >
            Update Record
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DoctorEdit;

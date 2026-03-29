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

interface DoctorFormProps {
  initialData?: DoctorData | null;
  onSubmit: (data: DoctorData) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<DoctorData>({
    defaultValues: initialData || {
      name: "",
      email: "",
      specialty: "",
      phone: "",
      gender: "Male",
      availability: "Morning",
      joiningDate: "",
      address: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="name" label="Full Name" placeholder="e.g. Dr. John Doe" required="Name is required" />
          <FormInput name="email" label="Email Address" type="email" placeholder="john@example.com" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="specialty" label="Medical Specialty" placeholder="e.g. Cardiology" required="Specialty is required" />
          <FormInput name="phone" label="Contact Number" placeholder="e.g. 01700000000" />
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
          <FormInput name="address" label="Home Address" placeholder="City, Area, Road" />
        </div>
        
        {/* Action Buttons styled like pos-v2 */}
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
            {initialData ? "Update" : "Update"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DoctorForm;

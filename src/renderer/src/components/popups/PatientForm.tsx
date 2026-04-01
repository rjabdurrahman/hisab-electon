import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";

interface PatientData {
  id?: number;
  name: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
}

interface PatientFormProps {
  initialData?: PatientData;
  onSubmit: (data: PatientData) => void | Promise<void>;
  onCancel: () => void;
  title?: string;
}

const PatientForm: React.FC<PatientFormProps> = ({ initialData, onSubmit, onCancel, title = "Patient Details" }) => {
  const methods = useForm<PatientData>({
    defaultValues: initialData || {
      name: "",
      phone: "",
      gender: "Male",
      age: undefined
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700 mb-4">{title}</h3>
        <div className="grid grid-cols-1 gap-4">
          <FormInput name="name" label="Full Name" placeholder="e.g. John Doe" required="Name is required" />
          <FormInput name="phone" label="Phone Number" placeholder="e.g. 01700000000" />
          <FormInput name="age" label="Age" type="number" placeholder="e.g. 30" />
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
        <div className="pt-6 flex justify-end gap-2 border-t border-gray-100">
           <Button
            variant="outlined"
            onClick={onCancel}
            bgColor="#f44336"
            textColor="#f44336"
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            type="submit"
            bgColor="#333333"
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PatientForm;

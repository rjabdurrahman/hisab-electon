import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";
import SearchSelect from "../form/SearchSelect";

interface ConsultationData {
  id?: number;
  clientName: string;
  doctorName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  date: string;
  time: string;
}

interface ConsultationsEditProps {
  initialData: ConsultationData;
  onSubmit: (data: ConsultationData) => void;
  onCancel: () => void;
  options: {
    clients: { label: string; value: string }[];
    doctors: { label: string; value: string }[];
    services: { label: string; value: string; price: number }[];
  }
}

const ConsultationsEdit: React.FC<ConsultationsEditProps> = ({ initialData, onSubmit, onCancel, options }) => {
  const methods = useForm<ConsultationData>({
    defaultValues: initialData
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <SearchSelect
            name="clientName"
            label="Patient"
            options={options.clients}
          />
          <SearchSelect
            name="doctorName"
            label="Doctor"
            options={options.doctors}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput name="age" label="Age" type="number" />
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
          <div className="grid grid-cols-2 gap-2">
             <FormInput name="date" label="Date" type="date" />
             <FormInput name="time" label="Time" />
          </div>

        <div className="pt-6 flex justify-end gap-2 border-t border-gray-100 -mx-5 px-5">
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
          <Button
            className="flex-1"
            size="large"
            variant="filled"
            type="submit"
            bgColor="#333333"
          >
            Update
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ConsultationsEdit;

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";

interface AppointmentData {
  id?: number;
  clientName: string;
  doctorName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface AppointmentEditProps {
  initialData: AppointmentData;
  onSubmit: (data: AppointmentData) => void;
  onCancel: () => void;
  options: {
    clients: { label: string; value: string }[];
    doctors: { label: string; value: string }[];
    services: { label: string; value: string }[];
  }
}

const AppointmentEdit: React.FC<AppointmentEditProps> = ({ initialData, onSubmit, onCancel, options }) => {
  const methods = useForm<AppointmentData>({
    defaultValues: initialData
  });

  const statuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="clientName" 
            label="Client" 
            options={options.clients} 
          />
          <FormSelect 
            name="doctorName" 
            label="Doctor" 
            options={options.doctors} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect 
            name="serviceName" 
            label="Service" 
            options={options.services} 
          />
          <div className="grid grid-cols-2 gap-2">
             <FormInput name="date" label="Date" type="date" />
             <FormInput name="time" label="Time" />
          </div>
        </div>
        <FormSelect
          name="status" 
          label="Appointment Status" 
          options={statuses} 
        />
        
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
            Update  
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AppointmentEdit;

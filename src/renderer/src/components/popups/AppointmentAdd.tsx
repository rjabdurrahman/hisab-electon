import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";
import SearchSelect from "../form/SearchSelect";
import ServiceSearchAdd from "../form/ServiceSearchAdd";

interface AppointmentData {
  patientId: number;
  doctorId: number;
  services: { id: string | number; label: string; price: number }[];
  date: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface AppointmentAddProps {
  onSubmit: (data: AppointmentData) => void | Promise<void>;
  onCancel: () => void;
  options: {
    clients: { label: string; value: string | number }[];
    doctors: { label: string; value: string | number }[];
    services: { label: string; value: string | number; price: number }[];
  }
}

const AppointmentAdd: React.FC<AppointmentAddProps> = ({ onSubmit, onCancel, options }) => {
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const methods = useForm<AppointmentData>({
    defaultValues: {
      patientId: 0,
      doctorId: 0,
      services: [],
      date: localDateTime,
      status: "Pending"
    }
  });

  const { control, setValue } = methods;
  const addedServices = useWatch({ control, name: "services" }) || [];

  const handleAddService = (service: { id: string | number; label: string; price: number }) => {
    setValue("services", [...addedServices, service]);
  };

  const handleRemoveService = (id: string | number) => {
    setValue("services", addedServices.filter(s => s.id !== id));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <SearchSelect
            name="patientId" 
            label="Select Patient" 
            placeholder="Search Patient..." 
            options={options.clients} 
            required="Patient is required"
          />
          <SearchSelect 
            name="doctorId" 
            label="Assign Doctor" 
            placeholder="Select Practitioner..." 
            options={options.doctors} 
            required="Doctor is required"
          />
        </div>

        <div className="border-t border-gray-100 pt-4">
            <ServiceSearchAdd 
              options={options.services}
              addedServices={addedServices}
              onAdd={handleAddService}
              onRemove={handleRemoveService}
            />
            {methods.formState.errors.services && (
              <p className="text-red-500 text-xs mt-1 font-bold italic">At least one service is required</p>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput name="date" label="Date & Time" type="datetime-local" required="Date and Time is required" />
          <FormSelect
            name="status" 
            label="Initial Status" 
            options={[
              { label: 'Pending', value: 'Pending' },
              { label: 'Confirmed', value: 'Confirmed' }
            ]} 
            required="Status"
          />
        </div>
        
        <div className="pt-6 flex justify-end gap-2 border-t border-gray-100 -mx-5 px-5">
          <Button
            className="px-8"
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
            Create Appointment
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AppointmentAdd;

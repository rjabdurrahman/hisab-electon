import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";

interface AppointmentData {
  id?: number;
  patientId: number;
  doctorId: number;
  services: { id: string | number; label: string; price: number }[];
  date: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface AppointmentFormProps {
  initialData?: AppointmentData | null;
  onSubmit: (data: AppointmentData) => void;
  onCancel: () => void;
  options: {
    clients: { label: string; value: string }[];
    doctors: { label: string; value: string }[];
    services: { label: string; value: string }[];
  }
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ initialData, onSubmit, onCancel, options }) => {
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  const extractDateTime = (dateStr?: string): string => {
    if (!dateStr) return localDateTime;
    const d = new Date(dateStr);
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const methods = useForm<AppointmentData>({
    defaultValues: initialData ? {
      ...initialData,
      date: extractDateTime((initialData as any).date)
    } : {
      patientId: 0,
      doctorId: 0,
      services: [],
      date: localDateTime,
      status: "Pending"
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="clientName"
            label="Select Client"
            placeholder="Search Client..."
            options={options.clients}
            required="Client is required"
          />
          <FormSelect
            name="doctorName"
            label="Assign Doctor"
            placeholder="Select Practitioner..."
            options={options.doctors}
            required="Doctor is required"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            name="serviceName"
            label="Service Required"
            placeholder="Select Service..."
            options={options.services}
            required="Service is required"
          />
          <FormInput name="date" label="Date & Time" type="datetime-local" required="Date & Time is required" />
        </div>
        <FormSelect
          name="status"
          label="Initial Status"
          options={[
            { label: 'Pending', value: 'Pending' },
            { label: 'Confirmed', value: 'Confirmed' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Cancelled', value: 'Cancelled' }
          ]}
          required="Status"
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
            {initialData ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AppointmentForm;

import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";
import SearchSelect from "../form/SearchSelect";
import ServiceSearchAdd from "../form/ServiceSearchAdd";

interface TestData {
  id?: number;
  clientName: string;
  doctorName: string;
  services: { id: string | number; label: string; price: number }[];
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

interface TestEditProps {
  initialData: TestData;
  onSubmit: (data: TestData) => void;
  onCancel: () => void;
  options: {
    clients: { label: string; value: string }[];
    doctors: { label: string; value: string }[];
    services: { label: string; value: string; price: number }[];
  }
}

const TestEdit: React.FC<TestEditProps> = ({ initialData, onSubmit, onCancel, options }) => {
  const methods = useForm<TestData>({
    defaultValues: initialData
  });

  const { control, setValue } = methods;
  const addedServices = useWatch({ control, name: "services" }) || [];

  const handleAddService = (service: { id: string | number; label: string; price: number }) => {
    setValue("services", [...addedServices, service]);
  };

  const handleRemoveService = (id: string | number) => {
    setValue("services", addedServices.filter(s => s.id !== id));
  };

  const statuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

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
        
        <div className="border-t border-gray-100 pt-4">
            <ServiceSearchAdd 
              options={options.services}
              addedServices={addedServices}
              onAdd={handleAddService}
              onRemove={handleRemoveService}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-2">
             <FormInput name="date" label="Date" type="date" />
             <FormInput name="time" label="Time" />
          </div>
          <FormSelect
            name="status" 
            label="Status" 
            options={statuses} 
          />
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

export default TestEdit;

import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import FormInput from "../form/FormInput";
import Button from "../buttons/Button";
import SearchSelect from "../form/SearchSelect";
import ServiceSearchAdd from "../form/ServiceSearchAdd";

interface PathologyTestFormData {
  patientId: number;
  doctorId?: number;
  services: { id: string | number; label: string; price: number }[];
  date: string;
}

interface PathologyTestAddProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  options: {
    clients: { label: string; value: number }[];
    doctors: { label: string; value: number }[];
    services: { label: string; value: number; price: number }[];
  };
}

const PathologyTestAdd: React.FC<PathologyTestAddProps> = ({ onSubmit, onCancel, options }) => {
  const now = new Date();
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const methods = useForm<PathologyTestFormData>({
    defaultValues: {
      patientId: 0,
      doctorId: undefined,
      services: [],
      date: localDateTime,
    }
  });

  const { control, setValue } = methods;
  const addedServices = useWatch({ control, name: "services" }) || [];

  const handleAddService = (service: any) => {
    setValue("services", [...addedServices, service]);
  };

  const handleRemoveService = (id: number | string) => {
    setValue("services", addedServices.filter((s) => s.id !== id));
  };

  const handleFormSubmit = (data: PathologyTestFormData) => {
    // Current input is YYYY-MM-DDTHH:mm, convert to full ISO for DB
    const combinedDateTime = new Date(data.date).toISOString();
    onSubmit({ ...data, date: combinedDateTime });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <SearchSelect
            name="patientId"
            label="Select Patient"
            placeholder="Search Patient..."
            options={options.clients}
          />
          <SearchSelect
            name="doctorId"
            label="Referring Doctor (Optional)"
            placeholder="Select Doctor..."
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

        <div className="grid grid-cols-1 gap-4">
          <FormInput name="date" label="Date & Time" type="datetime-local" required="Date and Time is required" />
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
          <Button className="flex-1" size="large" variant="filled" type="submit" bgColor="#333333">
            Add
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PathologyTestAdd;

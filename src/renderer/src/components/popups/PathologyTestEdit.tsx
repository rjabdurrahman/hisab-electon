import React from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import FormInput from "../form/FormInput";
import Button from "../buttons/Button";
import SearchSelect from "../form/SearchSelect";
import ServiceSearchAdd from "../form/ServiceSearchAdd";

interface PathologyTestFormData {
  id?: number;
  patientId: number;
  doctorId?: number;
  services: { id: string | number; label: string; price: number }[];
  discount: number;
  date: string;
}

interface PathologyTestEditProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  options: {
    clients: { label: string; value: number }[];
    doctors: { label: string; value: number }[];
    services: { label: string; value: number; price: number }[];
  };
}

/** Extract date and time in YYYY-MM-DDTHH:mm format for datetime-local input */
const extractDateTime = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

const PathologyTestEdit: React.FC<PathologyTestEditProps> = ({ initialData, onSubmit, onCancel, options }) => {
  const methods = useForm<PathologyTestFormData>({
    defaultValues: {
      id: initialData?.id,
      patientId: initialData?.patient?.id || initialData?.patientId,
      doctorId: initialData?.doctor?.id || initialData?.doctorId,
      services: initialData?.investigations?.map((i: any) => ({
        id: i.id,
        label: i.name,
        price: i.price
      })) || [],
      discount: initialData?.discount || 0,
      date: extractDateTime(initialData?.date),
    }
  });

  const { control, setValue } = methods;
  const addedServices = useWatch({ control, name: "services" }) || [];
  const discount = useWatch({ control, name: "discount" }) || 0;

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
        <div className="grid grid-cols-1 gap-4">
          <FormInput name="date" label="Date & Time" type="datetime-local" required="Date and Time is required" />

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

          <FormInput name="discount" label="Discount Amount" type="number" />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <ServiceSearchAdd
            options={options.services}
            addedServices={addedServices}
            onAdd={handleAddService}
            onRemove={handleRemoveService}
            discount={discount}
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
          <Button className="flex-1" size="large" variant="filled" type="submit" bgColor="#333333">
            Update
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PathologyTestEdit;

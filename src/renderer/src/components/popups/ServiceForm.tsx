import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import Button from "../buttons/Button";

interface ServiceData {
  id?: number;
  name: string;
  category: string;
  price: number;
  duration: string;
}

interface ServiceFormProps {
  initialData?: ServiceData | null;
  onSubmit: (data: ServiceData) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<ServiceData>({
    defaultValues: initialData || {
      name: "",
      category: "",
      price: 0,
      duration: ""
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="name" label="Service Name" placeholder="e.g. Blood Test" required="Service name required" />
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="category" label="Category" placeholder="e.g. Diagnostic" required="Category required" />
          <FormInput name="duration" label="Estimated Duration" placeholder="e.g. 15 mins" />
        </div>
        <FormInput name="price" label="Service Fee (৳)" type="number" placeholder="500" required="Price required" />
        
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
            {initialData ? "Update Service" : "Register Service"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ServiceForm;

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import Button from "../buttons/Button";

interface InvestigationData {
  name: string;
  category: string;
  price: number;
  duration: string;
}

interface InvestigationAddProps {
  onSubmit: (data: InvestigationData) => void | Promise<void>;
  onCancel: () => void;
}

const InvestigationAdd: React.FC<InvestigationAddProps> = ({ onSubmit, onCancel }) => {
  const methods = useForm<InvestigationData>({
    defaultValues: {
      name: "",
      price: 0,
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="name" label="Investigation Name" placeholder="e.g. Blood Test" required="Investigation name required" />
        <FormInput name="price" label="Investigation Fee (৳)" type="number" placeholder="500" required="Price required" />
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
            Register Service
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvestigationAdd;

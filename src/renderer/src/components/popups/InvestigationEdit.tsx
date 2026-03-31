import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import Button from "../buttons/Button";

interface InvestigationData {
  id?: number;
  name: string;
  price: number;
}

interface InvestigationEditProps {
  initialData: InvestigationData;
  onSubmit: (data: InvestigationData) => void;
  onCancel: () => void;
}

const InvestigationEdit: React.FC<InvestigationEditProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<InvestigationData>({
    defaultValues: initialData
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="name" label="Investigation Name" required="Investigation name required" />
        <FormInput name="price" label="Service Fee (৳)" type="number" required="Price required" />
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
            Update Service
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvestigationEdit;

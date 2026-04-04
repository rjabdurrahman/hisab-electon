import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import Button from "../buttons/Button";

interface CategoryData {
  name: string;
}

interface InvestigationCategoryAddProps {
  onSubmit: (data: CategoryData) => void | Promise<void>;
  onCancel: () => void;
  initialData?: CategoryData;
}

const InvestigationCategoryAdd: React.FC<InvestigationCategoryAddProps> = ({ onSubmit, onCancel, initialData }) => {
  const methods = useForm<CategoryData>({
    defaultValues: initialData || {
      name: "",
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput name="name" label="Name" placeholder="e.g. Pathology" required="Category name required" />
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
            {initialData ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvestigationCategoryAdd;

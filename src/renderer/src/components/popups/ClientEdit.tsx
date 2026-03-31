import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";

interface ClientData {
  id?: number;
  name: string;
  phone: string;
  gender: string;
}

interface ClientEditProps {
  initialData: ClientData;
  onSubmit: (data: ClientData) => void;
  onCancel: () => void;
}

const ClientEdit: React.FC<ClientEditProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<ClientData>({
    defaultValues: initialData
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormInput name="name" label="Full Name" required="Name is required" />
          <FormInput name="phone" label="Phone Number" required="Phone is required" />
          <FormSelect 
            name="gender" 
            label="Gender" 
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
              { label: 'Other', value: 'Other' }
            ]} 
          />
        </div>        
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

export default ClientEdit;

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import FormSelect from "../form/FormSelect";
import Button from "../buttons/Button";

interface ClientData {
  id?: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  registeredAt?: string;
}

interface ClientFormProps {
  initialData?: ClientData | null;
  onSubmit: (data: ClientData) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<ClientData>({
    defaultValues: initialData || {
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "Male"
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="name" label="Full Name" placeholder="e.g. John Doe" required="Name is required" />
          <FormInput name="phone" label="Phone Number" placeholder="e.g. 01700000000" required="Phone is required" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput name="email" label="Email Address" type="email" placeholder="john@example.com" />
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
        <FormInput name="address" label="Home Address" placeholder="City, Area, Road" />
        
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
            {initialData ? "Update Client" : "Register Client"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClientForm;

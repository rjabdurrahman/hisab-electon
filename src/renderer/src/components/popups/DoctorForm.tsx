import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../form/FormInput";
import Button from "../buttons/Button";

/** Strictly matches the SQL `doctors` table schema */
interface DoctorData {
  id?: number;
  name: string;
  specialization?: string;
  phone?: string;
  consultationFee: number;
}

interface DoctorFormProps {
  initialData?: DoctorData | null;
  onSubmit: (data: DoctorData) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const methods = useForm<DoctorData>({
    defaultValues: initialData || {
      name: "",
      specialization: "",
      phone: "",
      consultationFee: 0,
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="name"
            label="Full Name"
            placeholder="e.g. Dr. John Doe"
            required="Name is required"
          />
          <FormInput
            name="specialization"
            label="Medical Specialty"
            placeholder="e.g. Cardiology"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="phone"
            label="Contact Number"
            placeholder="e.g. 01700000000"
          />
          <FormInput
            name="consultationFee"
            label="Consultation Fee"
            type="number"
            placeholder="e.g. 500"
            required="Fee is required"
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
            {initialData ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DoctorForm;

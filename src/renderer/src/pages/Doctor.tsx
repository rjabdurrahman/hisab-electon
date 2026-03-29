import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import FormInput from '../components/form/FormInput';
import FormSelect from '../components/form/FormSelect';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';

interface DoctorData {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  availability: string;
  email?: string;
  address?: string;
  gender?: string;
  joiningDate?: string;
}

const Doctor = () => {
  const [doctors, setDoctors] = useState<DoctorData[]>([
    { id: 1, name: 'Dr. Mahbubur Rahman', specialty: 'Cardiology', phone: '01712345678', availability: 'Morning', email: 'mahbub@example.com', gender: 'Male' },
    { id: 2, name: 'Dr. Nasrin Akter', specialty: 'Pediatrics', phone: '01812345679', availability: 'Evening', email: 'nasrin@example.com', gender: 'Female' },
    { id: 3, name: 'Dr. Ashraful Islam', specialty: 'Orthopedics', phone: '01912345680', availability: 'Afternoon', email: 'ashraf@example.com', gender: 'Male' },
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);

  // Forms
  const addMethods = useForm<DoctorData>();
  const editMethods = useForm<DoctorData>();

  // Modals
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: DoctorData) => {
    const newDoc = { ...data, id: doctors.length + 1 };
    setDoctors([...doctors, newDoc]);
    addMethods.reset();
    closeAdd();
  };

  const onEditSubmit = (data: DoctorData) => {
    setDoctors(doctors.map(d => d.id === selectedDoctor?.id ? { ...d, ...data } : d));
    closeEdit();
  };

  const handleDelete = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter(d => d.id !== selectedDoctor.id));
      setSelectedDoctor(null);
      closeDelete();
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'name', label: 'Doctor Name', rowClass: 'font-bold' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'phone', label: 'Contact Number' },
    { key: 'gender', label: 'Gender' },
    {
      key: 'availability', label: 'Availability', render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider 
        ${val === 'Morning' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
            val === 'Evening' ? 'bg-[#2CAFFE]/10 text-[#2CAFFE]' : 'bg-amber-100 text-amber-700'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions', label: 'Actions', headClass: 'text-right', rowClass: 'text-right', render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedDoctor(row); editMethods.reset(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedDoctor(row); openDelete(); }}
            textColor="#ef4444"
          >
            🗑️
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h1 className="text-2xl font-black text-[#333333] tracking-widest uppercase font-exo2">Doctor Management</h1>
        </div>
        <Button
          onClick={openAdd}
          bgColor="#333333"
          textColor="#FFFFFF"
          className="rounded px-6 py-3 shadow-lg shadow-[#333333]/20"
        >
          + Add New Doctor
        </Button>
      </div>

      <div className="bg-white border border-[#D1D5DB] rounded shadow-sm overflow-hidden">
        <BasicTable columns={columns} data={doctors} />
      </div>

      <AddModal title="Register New Practitioner">
        <FormProvider {...addMethods}>
          <form className="space-y-4" onSubmit={addMethods.handleSubmit(onAddSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="name" label="Full Name" placeholder="e.g. Dr. John Doe" required="Name is required" />
              <FormInput name="email" label="Email Address" type="email" placeholder="john@example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="specialty" label="Medical Specialty" placeholder="e.g. Cardiology" required="Specialty is required" />
              <FormInput name="phone" label="Contact Number" placeholder="e.g. 01700000000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect 
                name="gender" 
                label="Gender" 
                options={[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                  { label: 'Other', value: 'Other' }
                ]} 
              />
              <FormSelect 
                name="availability" 
                label="Availability Shift" 
                options={[
                  { label: 'Morning', value: 'Morning' },
                  { label: 'Afternoon', value: 'Afternoon' },
                  { label: 'Evening', value: 'Evening' }
                ]} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="joiningDate" label="Joining Date" type="date" />
              <FormInput name="address" label="Home Address" placeholder="City, Area, Road" />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="submit" bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl">Confirm Registration</Button>
            </div>
          </form>
        </FormProvider>
      </AddModal>

      <EditModal title="Edit Practitioner Details">
        <FormProvider {...editMethods}>
          <form className="space-y-4" onSubmit={editMethods.handleSubmit(onEditSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="name" label="Full Name" />
              <FormInput name="email" label="Email Address" type="email" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="specialty" label="Medical Specialty" />
              <FormInput name="phone" label="Contact Number" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect 
                name="gender" 
                label="Gender" 
                options={[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                  { label: 'Other', value: 'Other' }
                ]} 
              />
              <FormSelect 
                name="availability" 
                label="Availability Shift" 
                options={[
                  { label: 'Morning', value: 'Morning' },
                  { label: 'Afternoon', value: 'Afternoon' },
                  { label: 'Evening', value: 'Evening' }
                ]} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="joiningDate" label="Joining Date" type="date" />
              <FormInput name="address" label="Home Address" />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="submit" bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl text-white">Update Record</Button>
            </div>
          </form>
        </FormProvider>
      </EditModal>

      <DeleteModal title="Confirm Deletion">
        <Delete handleDelete={handleDelete} />
      </DeleteModal>
    </div>
  );
};

export default Doctor;

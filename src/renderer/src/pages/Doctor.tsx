import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import FormInput from '../components/form/FormInput';
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

  // Modals
  const { openModal: openAdd, Modal: AddModal } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal } = usePopup("medium");

  const handleDelete = () => {
    if (selectedDoctor) {
      setDoctors(doctors.filter(d => d.id !== selectedDoctor.id));
      setSelectedDoctor(null);
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
            onClick={() => { setSelectedDoctor(row); openEdit(); }}
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
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h1 className="text-2xl font-black text-[#333333] tracking-widest uppercase font-exo2">Doctor</h1>
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
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="name" label="Full Name" placeholder="e.g. Dr. John Doe" />
            <FormInput name="email" label="Email Address" type="email" placeholder="john@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="specialty" label="Medical Specialty" placeholder="e.g. Neurology" />
            <FormInput name="phone" label="Contact Number" placeholder="e.g. 01700000000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[#475569] mb-1 pl-1 font-bold text-[12px] uppercase tracking-wider">Gender</label>
              <select className="w-full px-3 py-2 rounded bg-[#F4F4F4F2] border border-gray-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-bold text-[13px] appearance-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[#475569] mb-1 pl-1 font-bold text-[12px] uppercase tracking-wider">Availability Shift</label>
              <select className="w-full px-3 py-2 rounded bg-[#F4F4F4F2] border border-gray-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-bold text-[13px] appearance-none">
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="date" label="Joining Date" type="date" />
            <FormInput name="address" label="Home Address" placeholder="City, Area, Road" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl">Confirm Registration</Button>
          </div>
        </form>
      </AddModal>

      <EditModal title="Edit Practitioner Details">
        {selectedDoctor && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="name" label="Full Name" defaultValue={selectedDoctor.name} />
              <FormInput name="email" label="Email Address" type="email" defaultValue={selectedDoctor.email} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="specialty" label="Medical Specialty" defaultValue={selectedDoctor.specialty} />
              <FormInput name="phone" label="Contact Number" defaultValue={selectedDoctor.phone} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[#475569] mb-1 pl-1 font-bold text-[12px] uppercase tracking-wider">Gender</label>
                <select defaultValue={selectedDoctor.gender} className="w-full px-3 py-2 rounded bg-[#F4F4F4F2] border border-gray-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-bold text-[13px] appearance-none">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[#475569] mb-1 pl-1 font-bold text-[12px] uppercase tracking-wider">Availability Shift</label>
                <select defaultValue={selectedDoctor.availability} className="w-full px-3 py-2 rounded bg-[#F4F4F4F2] border border-gray-300 focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all font-bold text-[13px] appearance-none">
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="date" label="Joining Date" type="date" defaultValue={selectedDoctor.joiningDate} />
              <FormInput name="address" label="Home Address" defaultValue={selectedDoctor.address} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl text-white">Update Record</Button>
            </div>
          </form>
        )}
      </EditModal>

      <DeleteModal title="Confirm Deletion">
        <Delete handleDelete={handleDelete} />
      </DeleteModal>

    </div>
  );
};

export default Doctor;

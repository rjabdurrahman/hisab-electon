import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import DoctorAdd from '../components/popups/DoctorAdd';
import DoctorEdit from '../components/popups/DoctorEdit';

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
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: any) => {
    const newDoc = { ...data, id: doctors.length + 1 };
    setDoctors([...doctors, newDoc]);
    closeAdd();
  };

  const onEditSubmit = (data: any) => {
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
        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider 
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
    <div className="space-y-2 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#333333] font-exo2">Doctor</h1>
        </div>
        <Button
          onClick={openAdd}
          bgColor="#333333"
          textColor="#FFFFFF"
          className="rounded px-6 py-3"
        >
          + New
        </Button>
      </div>

      <div className="bg-white border border-[#D1D5DB] rounded shadow-sm overflow-hidden">
        <BasicTable columns={columns} data={doctors} />
      </div>

      <AddModal title="New Doctor">
        <DoctorAdd onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit Doctor">
        {selectedDoctor && (
          <DoctorEdit
            initialData={selectedDoctor}
            onSubmit={onEditSubmit}
            onCancel={closeEdit}
          />
        )}
      </EditModal>

      <DeleteModal title="Delete">
        <Delete handleDelete={handleDelete} />
      </DeleteModal>
    </div>
  );
};

export default Doctor;

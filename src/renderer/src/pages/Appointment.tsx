import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import AppointmentAdd from '../components/popups/AppointmentAdd';
import AppointmentEdit from '../components/popups/AppointmentEdit';

interface AppointmentData {
  id: number;
  patientId: number;
  doctorId: number;
  services: { id: string | number; label: string; price: number }[];
  date: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

const Appointment = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([
    { id: 1, patientId: 1, doctorId: 1, services: [{ id: 1, label: 'General Consultation', price: 500 }], date: '2023-11-01T10:00:00.000Z', status: 'Confirmed' },
    { id: 2, patientId: 2, doctorId: 2, services: [{ id: 2, label: 'Dental Checkup', price: 1000 }], date: '2023-11-01T11:00:00.000Z', status: 'Pending' },
    { id: 3, patientId: 3, doctorId: 3, services: [{ id: 3, label: 'X-Ray Chest', price: 800 }], date: '2023-11-02T09:00:00.000Z', status: 'Completed' },
  ]);

  const options = {
    clients: [
      { label: 'Abdur Rahman', value: 1 },
      { label: 'Fatima Begum', value: 2 },
      { label: 'Zayan Ahmed', value: 3 },
      { label: 'Karin Sultana', value: 4 }
    ],
    doctors: [
      { label: 'Dr. Mahbubur Rahman', value: 1 },
      { label: 'Dr. Nasrin Akter', value: 2 },
      { label: 'Dr. Ashraful Islam', value: 3 },
      { label: 'Dr. S.M. Ali', value: 4 }
    ],
    services: [
      { label: 'General Consultation', value: 1, price: 500 },
      { label: 'Dental Checkup', value: 2, price: 1000 },
      { label: 'X-Ray Chest', value: 3, price: 800 },
      { label: 'Blood Test', value: 4, price: 300 },
      { label: 'Eye Exam', value: 5, price: 400 }
    ]
  };

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  // Modals
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: any) => {
    const newIdx = appointments.length + 1;
    setAppointments([...appointments, { ...data, id: newIdx }]);
    closeAdd();
  };

  const onEditSubmit = (data: any) => {
    setAppointments(appointments.map(a => a.id === selectedAppointment?.id ? { ...a, ...data } : a));
    closeEdit();
  };

  const handleDelete = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
      setSelectedAppointment(null);
      closeDelete();
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { 
      key: 'patientId', 
      label: 'Patient', 
      rowClass: 'font-bold',
      render: (val) => options.clients.find(c => c.value === val)?.label || 'Unknown'
    },
    { 
      key: 'doctorId', 
      label: 'Doctor',
      render: (val) => options.doctors.find(d => d.value === val)?.label || 'Unassigned'
    },
    { 
      key: 'services', 
      label: 'Services', 
      render: (val: { id: string | number; label: string }[]) => (
        <div className="flex flex-wrap gap-1">
          {val.map((s) => (
            <span key={s.id} className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-gray-200">
              {s.label}
            </span>
          ))}
        </div>
      )
    },
    { 
      key: 'date', 
      label: 'Date & Time',
      render: (val: any) => {
        const d = new Date(val);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    },
    {
      key: 'status', label: 'Status', render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider 
        ${val === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
            val === 'Pending' ? 'bg-amber-100 text-amber-700' :
              val === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
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
            onClick={() => { setSelectedAppointment(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedAppointment(row); openDelete(); }}
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
          <h1 className="text-2xl font-black text-[#333333] font-exo2">Appointments</h1>
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
        <BasicTable columns={columns} data={appointments} />
      </div>

      <AddModal title="New Appointment">
        <AppointmentAdd options={options} onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit Appointment">
        {selectedAppointment && (
          <AppointmentEdit
            initialData={selectedAppointment}
            options={options}
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

export default Appointment;

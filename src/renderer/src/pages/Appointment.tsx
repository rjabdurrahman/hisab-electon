import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import FormInput from '../components/form/FormInput';
import FormSelect from '../components/form/FormSelect';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';

interface AppointmentData {
  id: number;
  clientName: string;
  doctorName: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

const Appointment = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([
    { id: 1, clientName: 'Abdur Rahman', doctorName: 'Dr. Mahbubur Rahman', serviceName: 'General Consultation', date: '2023-11-01', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, clientName: 'Fatima Begum', doctorName: 'Dr. Nasrin Akter', serviceName: 'Dental Checkup', date: '2023-11-01', time: '11:00 AM', status: 'Pending' },
    { id: 3, clientName: 'Zayan Ahmed', doctorName: 'Dr. Ashraful Islam', serviceName: 'X-Ray Chest', date: '2023-11-02', time: '09:00 AM', status: 'Completed' },
  ]);

  const clients = ['Abdur Rahman', 'Fatima Begum', 'Zayan Ahmed', 'Karin Sultana'];
  const doctors = ['Dr. Mahbubur Rahman', 'Dr. Nasrin Akter', 'Dr. Ashraful Islam', 'Dr. S.M. Ali'];
  const services = ['General Consultation', 'Dental Checkup', 'X-Ray Chest', 'Blood Test', 'Eye Exam'];

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  const { openModal: openAdd, Modal: AddModal } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal } = usePopup("medium");

  const handleDelete = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
      setSelectedAppointment(null);
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'clientName', label: 'Patient / Client', rowClass: 'font-bold' },
    { key: 'doctorName', label: 'Assigned Doctor' },
    { key: 'serviceName', label: 'Service Type' },
    { key: 'date', label: 'Scheduled Date' },
    { key: 'time', label: 'Time Slot' },
    {
      key: 'status', label: 'Status', render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider 
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h1 className="text-2xl font-black text-[#333333] tracking-widest uppercase font-exo2">Appointments</h1>
        </div>
        <Button
          onClick={openAdd}
          bgColor="#333333"
          textColor="#FFFFFF"
          className="rounded px-6 py-3 shadow-lg shadow-[#333333]/20"
        >
          + Create Appointment
        </Button>
      </div>

      <div className="bg-white border border-[#D1D5DB] rounded shadow-sm overflow-hidden">
        <BasicTable columns={columns} data={appointments} />
      </div>

      <AddModal title="New Appointment Booking">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              name="client" 
              label="Select Client" 
              placeholder="Search Client..." 
              options={clients.map(c => ({ label: c, value: c }))} 
            />
            <FormSelect 
              name="doctor" 
              label="Assign Doctor" 
              placeholder="Select Practitioner..." 
              options={doctors.map(d => ({ label: d, value: d }))} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormSelect 
              name="service" 
              label="Service Required" 
              placeholder="Select Service..." 
              options={services.map(s => ({ label: s, value: s }))} 
            />
            <div className="grid grid-cols-2 gap-2">
               <FormInput name="date" label="Date" type="date" />
               <FormInput name="time" label="Time" placeholder="10:00 AM" />
            </div>
          </div>
          <FormSelect
            name="status" 
            label="Initial Status" 
            options={[
              { label: 'Pending', value: 'Pending' },
              { label: 'Confirmed', value: 'Confirmed' }
            ]} 
          />
          <div className="pt-4 flex justify-end gap-2">
            <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl">Schedule Appointment</Button>
          </div>
        </form>
      </AddModal>

      <EditModal title="Modify Appointment Record">
        {selectedAppointment && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="grid grid-cols-2 gap-4">
               <FormSelect 
                name="client" 
                label="Client" 
                value={selectedAppointment.clientName}
                options={clients.map(c => ({ label: c, value: c }))} 
              />
              <FormSelect 
                name="doctor" 
                label="Doctor" 
                value={selectedAppointment.doctorName}
                options={doctors.map(d => ({ label: d, value: d }))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect 
                name="service" 
                label="Service" 
                value={selectedAppointment.serviceName}
                options={services.map(s => ({ label: s, value: s }))} 
              />
              <div className="grid grid-cols-2 gap-2">
                <FormInput name="date" label="Date" type="date" defaultValue={selectedAppointment.date} />
                <FormInput name="time" label="Time" defaultValue={selectedAppointment.time} />
              </div>
            </div>
            <FormSelect
              name="status" 
              label="Appointment Status" 
              value={selectedAppointment.status}
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Confirmed', value: 'Confirmed' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' }
              ]} 
            />
            <div className="pt-4 flex justify-end gap-2">
              <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl text-white">Update Appointment</Button>
            </div>
          </form>
        )}
      </EditModal>

      <DeleteModal title="Cancel & Delete Appointment">
        <Delete handleDelete={handleDelete} />
      </DeleteModal>
    </div>
  );
};

export default Appointment;

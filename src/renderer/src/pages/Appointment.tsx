import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
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

  const clients = [
    { label: 'Abdur Rahman', value: 'Abdur Rahman' },
    { label: 'Fatima Begum', value: 'Fatima Begum' },
    { label: 'Zayan Ahmed', value: 'Zayan Ahmed' },
    { label: 'Karin Sultana', value: 'Karin Sultana' }
  ];

  const doctors = [
    { label: 'Dr. Mahbubur Rahman', value: 'Dr. Mahbubur Rahman' },
    { label: 'Dr. Nasrin Akter', value: 'Dr. Nasrin Akter' },
    { label: 'Dr. Ashraful Islam', value: 'Dr. Ashraful Islam' },
    { label: 'Dr. S.M. Ali', value: 'Dr. S.M. Ali' }
  ];

  const services = [
    { label: 'General Consultation', value: 'General Consultation' },
    { label: 'Dental Checkup', value: 'Dental Checkup' },
    { label: 'X-Ray Chest', value: 'X-Ray Chest' },
    { label: 'Blood Test', value: 'Blood Test' },
    { label: 'Eye Exam', value: 'Eye Exam' }
  ];

  const statuses = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  // Forms
  const addMethods = useForm<AppointmentData>();
  const editMethods = useForm<AppointmentData>();

  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: AppointmentData) => {
    const newIdx = appointments.length + 1;
    setAppointments([...appointments, { ...data, id: newIdx }]);
    addMethods.reset();
    closeAdd();
  };

  const onEditSubmit = (data: AppointmentData) => {
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
            onClick={() => { setSelectedAppointment(row); editMethods.reset(row); openEdit(); }}
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
        <FormProvider {...addMethods}>
          <form className="space-y-4" onSubmit={addMethods.handleSubmit(onAddSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                name="clientName" 
                label="Select Client" 
                placeholder="Search Client..." 
                options={clients} 
                required="Client is required"
              />
              <FormSelect 
                name="doctorName" 
                label="Assign Doctor" 
                placeholder="Select Practitioner..." 
                options={doctors} 
                required="Doctor is required"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect 
                name="serviceName" 
                label="Service Required" 
                placeholder="Select Service..." 
                options={services} 
                required="Service is required"
              />
              <div className="grid grid-cols-2 gap-2">
                 <FormInput name="date" label="Date" type="date" required="Date" />
                 <FormInput name="time" label="Time" placeholder="10:00 AM" required="Time" />
              </div>
            </div>
            <FormSelect
              name="status" 
              label="Initial Status" 
              options={[
                { label: 'Pending', value: 'Pending' },
                { label: 'Confirmed', value: 'Confirmed' }
              ]} 
              required="Status"
            />
            <div className="pt-4 flex justify-end gap-2">
              <Button type="submit" bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl">Schedule Appointment</Button>
            </div>
          </form>
        </FormProvider>
      </AddModal>

      <EditModal title="Modify Appointment Record">
        {selectedAppointment && (
          <FormProvider {...editMethods}>
            <form className="space-y-4" onSubmit={editMethods.handleSubmit(onEditSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                 <FormSelect 
                  name="clientName" 
                  label="Client" 
                  options={clients} 
                />
                <FormSelect 
                  name="doctorName" 
                  label="Doctor" 
                  options={doctors} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect 
                  name="serviceName" 
                  label="Service" 
                  options={services} 
                />
                <div className="grid grid-cols-2 gap-2">
                  <FormInput name="date" label="Date" type="date" />
                  <FormInput name="time" label="Time" />
                </div>
              </div>
              <FormSelect
                name="status" 
                label="Appointment Status" 
                options={statuses} 
              />
              <div className="pt-4 flex justify-end gap-2">
                <Button type="submit" bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl text-white">Update Appointment</Button>
              </div>
            </form>
          </FormProvider>
        )}
      </EditModal>

      <DeleteModal title="Cancel & Delete Appointment">
        <Delete handleDelete={handleDelete} />
      </DeleteModal>
    </div>
  );
};

export default Appointment;

import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import ConsultationsEdit from '@renderer/components/popups/ConsultationsEdit';
import ConsultationsAdd from '@renderer/components/popups/ConsultationsAdd';


interface ConsultationData {
  id: number;
  clientName: string;
  doctorName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  services: { id: string | number; label: string; price: number }[];
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

const Consultations = () => {
  const [consultations, setConsultations] = useState<ConsultationData[]>([
    { id: 1, clientName: 'Abdur Rahman', doctorName: 'Dr. Mahbubur Rahman', age: 45, gender: 'Male', services: [{ id: 1, label: 'Blood Glucose', price: 250 }], date: '2023-11-01', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, clientName: 'Fatima Begum', doctorName: 'Dr. Nasrin Akter', age: 38, gender: 'Female', services: [{ id: 2, label: 'ECG', price: 800 }], date: '2023-11-01', time: '11:00 AM', status: 'Pending' },
    { id: 3, clientName: 'Zayan Ahmed', doctorName: 'Dr. Ashraful Islam', age: 12, gender: 'Male', services: [{ id: 3, label: 'Chest X-Ray', price: 1200 }], date: '2023-11-02', time: '09:00 AM', status: 'Completed' },
  ]);

  const options = {
    clients: [
      { label: 'Abdur Rahman', value: 'Abdur Rahman' },
      { label: 'Fatima Begum', value: 'Fatima Begum' },
      { label: 'Zayan Ahmed', value: 'Zayan Ahmed' },
      { label: 'Karin Sultana', value: 'Karin Sultana' }
    ],
    doctors: [
      { label: 'Dr. Mahbubur Rahman', value: 'Dr. Mahbubur Rahman' },
      { label: 'Dr. Nasrin Akter', value: 'Dr. Nasrin Akter' },
      { label: 'Dr. Ashraful Islam', value: 'Dr. Ashraful Islam' },
      { label: 'Dr. S.M. Ali', value: 'Dr. S.M. Ali' }
    ],
    services: [
      { label: 'Blood Glucose', value: 'Blood Glucose', price: 250 },
      { label: 'CBC', value: 'CBC', price: 600 },
      { label: 'Lipid Profile', value: 'Lipid Profile', price: 1200 },
      { label: 'Chest X-Ray', value: 'Chest X-Ray', price: 1200 },
      { label: 'ECG', value: 'ECG', price: 800 },
      { label: 'Ultrasonography', value: 'Ultrasonography', price: 1500 }
    ]
  };

  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationData | null>(null);

  // Modals
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: any) => {
    const newIdx = consultations.length + 1;
    setConsultations([...consultations, { ...data, id: newIdx }]);
    closeAdd();
  };

  const onEditSubmit = (data: any) => {
    setConsultations(consultations.map(a => a.id === selectedConsultation?.id ? { ...a, ...data } : a));
    closeEdit();
  };

  const handleDelete = () => {
    if (selectedConsultation) {
      setConsultations(consultations.filter(a => a.id !== selectedConsultation.id));
      setSelectedConsultation(null);
      closeDelete();
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'clientName', label: 'Patient Name', rowClass: 'font-bold' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date' },

    {
      key: 'actions', label: 'Actions', headClass: 'text-right', rowClass: 'text-right', render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedConsultation(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedConsultation(row); openDelete(); }}
            textColor="#ef4444"
          >
            🗑️
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between rounded-lg">
        <div>
          <h1 className="text-2xl font-black text-pos-primary font-exo2">Consultations</h1>
        </div>
        <Button
          onClick={openAdd}
          bgColor="#333333"
          textColor="#FFFFFF"
          className="rounded px-6 py-3 shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          + New
        </Button>
      </div>

      <div className="bg-white border border-[#D1D5DB] rounded shadow-sm overflow-hidden">
        <BasicTable columns={columns} data={consultations} />
      </div>

      <AddModal title="Add New Consultation">
        <ConsultationsAdd options={options} onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit Consultation">
        {selectedConsultation && (
          <ConsultationsEdit
            initialData={selectedConsultation}
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

export default Consultations;

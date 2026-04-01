import { useState, useEffect } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import PatientAdd from '../components/popups/PatientAdd';
import PatientEdit from '../components/popups/PatientEdit';

interface PatientData {
  id: number;
  name: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  age?: number;
  createdAt: string;
}

const Patient = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);

  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await window.api.invoke('PATIENT:LIST');
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const onAddSubmit = async (data: any) => {
    try {
      await window.api.invoke('PATIENT:CREATE', data);
      fetchPatients();
      closeAdd();
    } catch (error) {
      console.error("Failed to add patient:", error);
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!selectedPatient) return;
    try {
      await window.api.invoke('PATIENT:UPDATE', { id: selectedPatient.id, data });
      fetchPatients();
      closeEdit();
    } catch (error) {
      console.error("Failed to update patient:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedPatient) {
      try {
        await window.api.invoke('PATIENT:DELETE', { id: selectedPatient.id });
        fetchPatients();
        setSelectedPatient(null);
        closeDelete();
      } catch (error) {
        console.error("Failed to delete patient:", error);
      }
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'name', label: 'Patient Name', rowClass: 'font-bold' },
    { key: 'phone', label: 'Contact' },
    { key: 'gender', label: 'Gender' },
    { key: 'age', label: 'Age' },
    {
      key: 'actions', label: 'Actions', headClass: 'text-right', rowClass: 'text-right', render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedPatient(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedPatient(row); openDelete(); }}
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
          <h1 className="text-2xl font-black text-[#333333] font-exo2">Patients</h1>
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
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading patients...</div>
        ) : (
          <BasicTable columns={columns} data={patients} />
        )}
      </div>

      <AddModal title="New Patient">
        <PatientAdd onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit Patient">
        {selectedPatient && (
          <PatientEdit
            initialData={selectedPatient}
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

export default Patient;

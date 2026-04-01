import { useState, useEffect } from 'react';
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
  specialization: string;
  phone: string;
  consultationFee: number;
  createdAt: string;
}

const Doctor = () => {
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await window.api.invoke('DOCTOR:LIST');
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const onAddSubmit = async (data: any) => {
    try {
      await window.api.invoke('DOCTOR:CREATE', {
        name: data.name,
        specialization: data.specialty || data.specialization,
        phone: data.phone,
        consultationFee: Number(data.doctorsFee || data.consultationFee)
      });
      fetchDoctors();
      closeAdd();
    } catch (error) {
      console.error("Failed to add doctor:", error);
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!selectedDoctor) return;
    try {
      await window.api.invoke('DOCTOR:UPDATE', {
        id: selectedDoctor.id,
        data: {
          name: data.name,
          specialization: data.specialty || data.specialization,
          phone: data.phone,
          consultationFee: Number(data.doctorsFee || data.consultationFee)
        }
      });
      fetchDoctors();
      closeEdit();
    } catch (error) {
      console.error("Failed to update doctor:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedDoctor) {
      try {
        await window.api.invoke('DOCTOR:DELETE', { id: selectedDoctor.id });
        fetchDoctors();
        setSelectedDoctor(null);
        closeDelete();
      } catch (error) {
        console.error("Failed to delete doctor:", error);
      }
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'name', label: 'Doctor Name', rowClass: 'font-bold' },
    { key: 'specialization', label: 'Specialty' },
    { key: 'phone', label: 'Contact Number' },
    {
      key: 'consultationFee', label: "Doctor's Fee", render: (val) => (
        <span className="font-mono">৳{val}</span>
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
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading doctors...</div>
        ) : (
          <BasicTable columns={columns} data={doctors} />
        )}
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

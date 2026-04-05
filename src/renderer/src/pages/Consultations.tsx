import { useState, useEffect } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import ConsultationsEdit from '@renderer/components/popups/ConsultationsEdit';
import ConsultationsAdd from '@renderer/components/popups/ConsultationsAdd';

interface ConsultationData {
  id: number;
  date: string;
  patientId: number;
  doctorId: number;
  patient: { id: number; name: string; age?: number; gender?: string };
  doctor: { id: number; name: string };
  consultationFee?: number;
  discount: number;
  notes?: string;
  createdAt: string;
}

const Consultations = () => {
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    clients: [] as any[],
    doctors: [] as any[]
  });

  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationData | null>(null);

  // Modals
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [list, patients, doctors] = await Promise.all([
        window.api.invoke('CONSULTATION:LIST'),
        window.api.invoke('PATIENT:LIST'),
        window.api.invoke('DOCTOR:LIST')
      ]);

      setConsultations(list || []);
      setOptions({
        clients: (patients || []).map((p: any) => ({ label: p.name, value: p.id })),
        doctors: (doctors || []).map((d: any) => ({ label: d.name, value: d.id, fee: d.consultationFee }))
      });
    } catch (error) {
      console.error("Failed to fetch consultation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const onAddSubmit = async (data: any) => {
    try {
      // `data.date` is already a full ISO string combined from date+time in the form
      await window.api.invoke('CONSULTATION:CREATE', {
        date: data.date || new Date().toISOString(),
        patientId: Number(data.patientId || data.clientId || 0),
        doctorId: Number(data.doctorId || 0),
        consultationFee: Number(data.consultationFee || 0),
        discount: Number(data.discount || 0),
        notes: data.notes || null
      });
      fetchAllData();
      closeAdd();
    } catch (error) {
      console.error("Failed to create consultation:", error);
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!selectedConsultation) return;
    try {
      // `data.date` is already a full ISO string combined from date+time in the form
      await window.api.invoke('CONSULTATION:UPDATE', {
        id: selectedConsultation.id,
        data: {
          date: data.date,
          patientId: Number(data.patientId || data.clientId || 0),
          doctorId: Number(data.doctorId || 0),
          consultationFee: Number(data.consultationFee || 0),
          discount: Number(data.discount || 0),
          notes: data.notes || null
        }
      });
      fetchAllData();
      closeEdit();
    } catch (error) {
      console.error("Failed to update consultation:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedConsultation) {
      try {
        await window.api.invoke('CONSULTATION:DELETE', { id: selectedConsultation.id });
        fetchAllData();
        setSelectedConsultation(null);
        closeDelete();
      } catch (error) {
        console.error("Failed to delete consultation:", error);
      }
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { 
      key: 'date', 
      label: 'Date & Time',
      render: (val: any) => {
        const d = new Date(val);
        return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    },
    { 
      key: 'patient', 
      label: 'Patient Name', 
      rowClass: 'font-bold',
      render: (val) => val?.name || 'N/A'
    },
    { 
      key: 'patient_age', 
      label: 'Age',
      render: (_, row) => row.patient?.age || 'N/A'
    },
    { 
      key: 'patient_gender', 
      label: 'Gender',
      render: (_, row) => row.patient?.gender || 'N/A'
    },
    { 
      key: 'doctor', 
      label: 'Doctor',
      render: (val) => val?.name || 'N/A'
    },
    { 
      key: 'notes', 
      label: 'Note', 
      render: (val: any) => <span className="text-gray-500 italic text-sm line-clamp-1">{val || 'N/A'}</span>
    },
    { 
      key: 'consultationFee', 
      label: 'Fee', 
      render: (val: any) => <span className="font-bold text-[#2CAFFE]">৳{Number(val || 0).toLocaleString()}</span>
    },
    { 
      key: 'discount', 
      label: 'Discount', 
      render: (val: any) => <span className="text-red-500 font-bold">-{Number(val || 0).toLocaleString()}</span>
    },
    { 
      key: 'grandTotal', 
      label: 'Grand Total', 
      render: (_, row) => {
        const fee = Number(row.consultationFee || 0);
        const disc = Number(row.discount || 0);
        return <span className="font-black text-emerald-600">৳{(fee - disc).toLocaleString()}</span>
      }
    },
    {
      key: 'patient',
      label: 'Patient Name',
      rowClass: 'font-bold',
      render: (val) => val?.name || 'N/A'
    },
    {
      key: 'patient_age',
      label: 'Age',
      render: (_, row) => row.patient?.age || 'N/A'
    },
    {
      key: 'patient_gender',
      label: 'Gender',
      render: (_, row) => row.patient?.gender || 'N/A'
    },
    {
      key: 'doctor',
      label: 'Doctor',
      render: (val) => val?.name || 'N/A'
    },
    {
      key: 'consultationFee',
      label: 'Fee',
      render: (val: any) => <span className="font-bold text-[#2CAFFE]">৳{Number(val || 0).toLocaleString()}</span>
    },
    {
      key: 'notes',
      label: 'Note',
      render: (val: any) => <span className="text-gray-500 italic text-sm line-clamp-1">{val || 'N/A'}</span>
    },
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
          <h1 className="text-2xl font-black text-[#333333] font-exo2">Consultations</h1>
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
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading consultations...</div>
        ) : (
          <BasicTable columns={columns} data={consultations} />
        )}
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

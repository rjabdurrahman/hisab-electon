import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import TestAdd from '../components/popups/PathologyTestAdd';
import TestEdit from '../components/popups/PathologyTestEdit';

interface pathalogyTestData {
  id: number;
  clientName: string;
  doctorName: string;
  services: { id: string | number; label: string; price: number }[];
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
}

const PathologyTests = () => {
  const [pathologyTests, setPathologyTests] = useState<pathalogyTestData[]>([
    { id: 1, clientName: 'Abdur Rahman', doctorName: 'Dr. Mahbubur Rahman', services: [{ id: 1, label: 'Blood Glucose', price: 250 }], date: '2023-11-01', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, clientName: 'Fatima Begum', doctorName: 'Dr. Nasrin Akter', services: [{ id: 2, label: 'ECG', price: 800 }], date: '2023-11-01', time: '11:00 AM', status: 'Pending' },
    { id: 3, clientName: 'Zayan Ahmed', doctorName: 'Dr. Ashraful Islam', services: [{ id: 3, label: 'Chest X-Ray', price: 1200 }], date: '2023-11-02', time: '09:00 AM', status: 'Completed' },
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

  const [selectedTest, setSelectedTest] = useState<pathalogyTestData | null>(null);

  // Modals
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: any) => {
    const newIdx = pathologyTests.length + 1;
    setPathologyTests([...pathologyTests, { ...data, id: newIdx }]);
    closeAdd();
  };

  const onEditSubmit = (data: any) => {
    setPathologyTests(pathologyTests.map(a => a.id === selectedTest?.id ? { ...a, ...data } : a));
    closeEdit();
  };

  const handleDelete = () => {
    if (selectedTest) {
      setPathologyTests(pathologyTests.filter(a => a.id !== selectedTest.id));
      setSelectedTest(null);
      closeDelete();
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'clientName', label: 'Patient Name', rowClass: 'font-bold' },
    { key: 'doctorName', label: 'Doctor' },
    { 
      key: 'services', 
      label: 'Tests & Prices', 
      render: (val: { id: string | number; label: string; price: number }[]) => (
        <div className="flex flex-wrap gap-1">
          {val.map((s) => (
            <span key={s.id} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100 flex items-center gap-1">
              {s.label} <span className="opacity-50 font-mono">৳{s.price}</span>
            </span>
          ))}
        </div>
      )
    },
    {
       key: 'total',
       label: 'Total',
       render: (_, row: pathalogyTestData) => {
          const total = row.services.reduce((sum, s) => sum + s.price, 0);
          return <span className="font-black text-pos-primary font-mono text-sm">৳{total}</span>;
       }
    },
    { key: 'date', label: 'Date' },
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
            onClick={() => { setSelectedTest(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedTest(row); openDelete(); }}
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
          <h1 className="text-2xl font-black text-[#333333] font-exo2">Pathology Tests</h1>
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
        <BasicTable columns={columns} data={pathologyTests} />
      </div>

      <AddModal title="Add New">
        <TestAdd options={options} onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit">
        {selectedTest && (
          <TestEdit
            initialData={selectedTest}
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

export default PathologyTests;

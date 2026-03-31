import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import ServiceEdit from '../components/popups/InvestigationEdit';
import InvestigationAdd from '../components/popups/InvestigationAdd';
import { In } from 'typeorm';
import InvestigationEdit from '../components/popups/InvestigationEdit';

interface InvestigationData {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: string;
}

const Investigations = () => {
  const [services, setServices] = useState<InvestigationData[]>([
    { id: 1, name: 'General Consultation', category: 'Medical', price: 500, duration: '20 mins' },
    { id: 2, name: 'Dental Checkup', category: 'Dental', price: 1000, duration: '30 mins' },
    { id: 3, name: 'X-Ray Chest', category: 'Diagnostic', price: 800, duration: '15 mins' },
  ]);

  const [selectedService, setSelectedService] = useState<InvestigationData | null>(null);

  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: any) => {
    const newIdx = services.length + 1;
    setServices([...services, { ...data, id: newIdx, price: Number(data.price) }]);
    closeAdd();
  };

  const onEditSubmit = (data: any) => {
    setServices(services.map(s => s.id === selectedService?.id ? { ...s, ...data, price: Number(data.price) } : s));
    closeEdit();
  };

  const handleDelete = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      setSelectedService(null);
      closeDelete();
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'name', label: 'Name of Test ', rowClass: 'font-bold' },    {
      key: 'price', label: 'Price', render: (_, row) => `${row.price.toLocaleString()}`
    },
    {
      key: 'actions', label: 'Actions', headClass: 'text-right', rowClass: 'text-right', render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedService(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedService(row); openDelete(); }}
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
          <h1 className="text-2xl font-black text-[#333333] font-exo2">Investigations</h1>
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
        <BasicTable columns={columns} data={services} />
      </div>

      <AddModal title="New Investigation">
        <InvestigationAdd onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit Investigation">
        {selectedService && (
          <InvestigationEdit
            initialData={selectedService}
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

export default Investigations;

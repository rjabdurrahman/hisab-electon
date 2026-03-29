import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import ClientAdd from '../components/popups/ClientAdd';
import ClientEdit from '../components/popups/ClientEdit';

interface ClientData {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  registeredAt: string;
}

const Client = () => {
  const [clients, setClients] = useState<ClientData[]>([
    { id: 1, name: 'Abdur Rahman', phone: '01700000001', email: 'rahman@example.com', address: 'Dhaka, Bangladesh', gender: 'Male', registeredAt: '2023-10-01' },
    { id: 2, name: 'Fatima Begum', phone: '01700000002', email: 'fatima@example.com', address: 'Chittagong, Bangladesh', gender: 'Female', registeredAt: '2023-10-05' },
    { id: 3, name: 'Zayan Ahmed', phone: '01700000003', email: 'zayan@example.com', address: 'Sylhet, Bangladesh', gender: 'Male', registeredAt: '2023-10-10' },
  ]);

  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const onAddSubmit = (data: any) => {
    const newIdx = clients.length + 1;
    setClients([...clients, { ...data, id: newIdx, registeredAt: new Date().toISOString().split('T')[0] }]);
    closeAdd();
  };

  const onEditSubmit = (data: any) => {
    setClients(clients.map(c => c.id === selectedClient?.id ? { ...c, ...data } : c));
    closeEdit();
  };

  const handleDelete = () => {
    if (selectedClient) {
      setClients(clients.filter(c => c.id !== selectedClient.id));
      setSelectedClient(null);
      closeDelete();
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'name', label: 'Client Name', rowClass: 'font-bold' },
    { key: 'phone', label: 'Contact' },
    { key: 'email', label: 'Email' },
    { key: 'gender', label: 'Gender' },
    { key: 'address', label: 'Location' },
    {
      key: 'actions', label: 'Actions', headClass: 'text-right', rowClass: 'text-right', render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedClient(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedClient(row); openDelete(); }}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#333333] font-exo2">Clients</h1>
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
        <BasicTable columns={columns} data={clients} />
      </div>

      <AddModal title="New Client">
        <ClientAdd onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit Client">
        {selectedClient && (
          <ClientEdit 
            initialData={selectedClient} 
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

export default Client;

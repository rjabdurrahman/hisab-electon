import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import FormInput from '../components/form/FormInput';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';

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

  const { openModal: openAdd, Modal: AddModal } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal } = usePopup("medium");

  const handleDelete = () => {
    if (selectedClient) {
      setClients(clients.filter(c => c.id !== selectedClient.id));
      setSelectedClient(null);
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
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h1 className="text-2xl font-black text-[#333333] tracking-widest uppercase font-exo2">Clients</h1>
        </div>
        <Button
          onClick={openAdd}
          bgColor="#333333"
          textColor="#FFFFFF"
          className="rounded px-6 py-3 shadow-lg shadow-[#333333]/20"
        >
          + Add New Client
        </Button>
      </div>

      <div className="bg-white border border-[#D1D5DB] rounded shadow-sm overflow-hidden">
        <BasicTable columns={columns} data={clients} />
      </div>

      <AddModal title="Register New Client">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="name" label="Full Name" placeholder="e.g. John Doe" />
            <FormInput name="phone" label="Phone Number" placeholder="e.g. 01700000000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="email" label="Email Address" type="email" placeholder="john@example.com" />
            <div className="space-y-1">
              <label className="block text-[#475569] mb-1 pl-1 font-bold text-[12px] uppercase tracking-wider">Gender</label>
              <select className="w-full px-3 py-2 rounded bg-[#F4F4F4F2] border border-gray-300 focus:border-pos-blue focus:ring-4 focus:ring-pos-blue/10 outline-none transition-all font-bold text-[13px] appearance-none">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <FormInput name="address" label="Home Address" placeholder="City, Area, Road" />
          <div className="pt-4 flex justify-end gap-2">
            <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl">Confirm Client Registration</Button>
          </div>
        </form>
      </AddModal>

      <EditModal title="Edit Client Details">
        {selectedClient && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="name" label="Full Name" defaultValue={selectedClient.name} />
              <FormInput name="phone" label="Phone Number" defaultValue={selectedClient.phone} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="email" label="Email Address" type="email" defaultValue={selectedClient.email} />
              <div className="space-y-1">
                <label className="block text-[#475569] mb-1 pl-1 font-bold text-[12px] uppercase tracking-wider">Gender</label>
                <select defaultValue={selectedClient.gender} className="w-full px-3 py-2 rounded bg-[#F4F4F4F2] border border-gray-300 focus:border-pos-blue focus:ring-4 focus:ring-pos-blue/10 outline-none transition-all font-bold text-[13px] appearance-none">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <FormInput name="address" label="Home Address" defaultValue={selectedClient.address} />
            <div className="pt-4 flex justify-end gap-2">
              <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl text-white">Update Client Record</Button>
            </div>
          </form>
        )}
      </EditModal>

      <DeleteModal title="Confirm Client Deletion">
        <Delete handleDelete={handleDelete} />
      </DeleteModal>
    </div>
  );
};

export default Client;

import { useState } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import FormInput from '../components/form/FormInput';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';

interface ServiceData {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: string;
}

const Service = () => {
  const [services, setServices] = useState<ServiceData[]>([
    { id: 1, name: 'General Consultation', category: 'Medical', price: 500, duration: '20 mins' },
    { id: 2, name: 'Dental Checkup', category: 'Dental', price: 1000, duration: '30 mins' },
    { id: 3, name: 'X-Ray Chest', category: 'Diagnostic', price: 800, duration: '15 mins' },
  ]);

  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  const { openModal: openAdd, Modal: AddModal } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal } = usePopup("medium");

  const handleDelete = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      setSelectedService(null);
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'name', label: 'Service Description', rowClass: 'font-bold' },
    { key: 'category', label: 'Category' },
    { key: 'duration', label: 'Duration' },
    { 
      key: 'price', label: 'Service Fee', render: (val) => (
        <span className="font-bold text-[#2CAFFE]">৳{val.toLocaleString()}</span>
      )
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-divider">
        <div>
          <h1 className="text-2xl font-black text-[#333333] tracking-widest uppercase font-exo2">Services</h1>
        </div>
        <Button
          onClick={openAdd}
          bgColor="#333333"
          textColor="#FFFFFF"
          className="rounded px-6 py-3 shadow-lg shadow-[#333333]/20"
        >
          + Register Service
        </Button>
      </div>

      <div className="bg-white border border-[#D1D5DB] rounded shadow-sm overflow-hidden">
        <BasicTable columns={columns} data={services} />
      </div>

      <AddModal title="Register New Service Offering">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
          <FormInput name="name" label="Service Name" placeholder="e.g. Blood Test" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput name="category" label="Category" placeholder="e.g. Diagnostic" />
            <FormInput name="duration" label="Estimated Duration" placeholder="e.g. 15 mins" />
          </div>
          <FormInput name="price" label="Service Fee (৳)" type="number" placeholder="500" />
          <div className="pt-4 flex justify-end gap-2">
            <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl">Define New Service</Button>
          </div>
        </form>
      </AddModal>

      <EditModal title="Modify Service Configuration">
        {selectedService && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); }}>
            <FormInput name="name" label="Service Name" defaultValue={selectedService.name} />
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="category" label="Category" defaultValue={selectedService.category} />
              <FormInput name="duration" label="Estimated Duration" defaultValue={selectedService.duration} />
            </div>
            <FormInput name="price" label="Service Fee (৳)" type="number" defaultValue={selectedService.price.toString()} />
            <div className="pt-4 flex justify-end gap-2">
              <Button bgColor="#333333" className="w-full rounded-lg py-4 shadow-xl text-white">Update Service Details</Button>
            </div>
          </form>
        )}
      </EditModal>

      <DeleteModal title="Remove Service offering">
        <Delete handleDelete={handleDelete} />
      </DeleteModal>
    </div>
  );
};

export default Service;

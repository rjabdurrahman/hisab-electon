import { useState, useEffect } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import TestAdd from '../components/popups/PathologyTestAdd';
import TestEdit from '../components/popups/PathologyTestEdit';
import PathologyPrintReceipt from '../components/print/PathologyPrintReceipt';

interface PathologyTestData {
  id: number;
  date: string;
  totalAmount: number;
  discount: number;
  patient: { id: number; name: string };
  doctor?: { id: number; name: string };
  investigations: { id: number; name: string; price: number }[];
  createdAt: string;
}

const PathologyTests = () => {
  const [pathologyTests, setPathologyTests] = useState<PathologyTestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    clients: [] as any[],
    doctors: [] as any[],
    services: [] as any[]
  });

  const [selectedTest, setSelectedTest] = useState<PathologyTestData | null>(null);

  // Modals
  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("large");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("large");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");
  
  const executePrint = async (testToPrint?: PathologyTestData) => {
    const test = testToPrint || selectedTest;
    if (!test) return;
    
    try {
      console.log("Generating PDF...");
      // Step 1: Generate PDF in background
      const result: any = await window.api.invoke("APP:GENERATE_PDF", { data: test });
      
      if (result && result.success) {
        // Step 2: Open PDF in dedicated viewer
        await window.api.invoke("APP:OPEN_PDF_VIEWER", { 
          filePath: result.filePath, 
          title: `Receipt - ${test.patient?.name || "Patient"}` 
        });
      }
    } catch (e) {
      console.error("Print flow failed:", e);
      alert("Failed to generate print preview.");
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [tests, patients, doctors, investigations] = await Promise.all([
        window.api.invoke('PATHOLOGY:LIST'),
        window.api.invoke('PATIENT:LIST'),
        window.api.invoke('DOCTOR:LIST'),
        window.api.invoke('INVESTIGATION:LIST')
      ]);

      setPathologyTests(tests || []);
      setOptions({
        clients: (patients || []).map((p: any) => ({ label: p.name, value: p.id })),
        doctors: (doctors || []).map((d: any) => ({ label: d.name, value: d.id })),
        services: (investigations || []).map((i: any) => ({ label: i.name, value: i.id, price: i.price }))
      });
    } catch (error) {
      console.error("Failed to fetch pathology data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const onAddSubmit = async (data: any) => {
    try {
      await window.api.invoke('PATHOLOGY:CREATE', {
        date: data.date,
        patientId: Number(data.patientId || 0),
        doctorId: data.doctorId ? Number(data.doctorId) : undefined,
        discount: Number(data.discount || 0),
        testIds: data.services?.map((s: any) => Number(s.id || 0)) || []
      });
      fetchAllData();
      closeAdd();
    } catch (error) {
      console.error("Failed to create pathology test:", error);
    }
  };

  const onEditSubmit = async (data: any) => {
    try {
      await window.api.invoke('PATHOLOGY:UPDATE', {
        id: selectedTest?.id,
        date: data.date,
        patientId: Number(data.patientId || 0),
        doctorId: data.doctorId ? Number(data.doctorId) : undefined,
        discount: Number(data.discount || 0),
        testIds: data.services?.map((s: any) => Number(s.id || 0)) || []
      });
      fetchAllData();
      closeEdit();
    } catch (error) {
      console.error("Failed to update pathology test:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedTest) {
      try {
        await window.api.invoke('PATHOLOGY:DELETE', { id: selectedTest.id });
        fetchAllData();
        setSelectedTest(null);
        closeDelete();
      } catch (error) {
        console.error("Failed to delete pathology test:", error);
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
      render: (val: any) => val?.name || 'N/A'
    },
    { 
      key: 'doctor', 
      label: 'Ref. Doctor',
      render: (val: any) => val?.name || 'Self/None'
    },
    { 
      key: 'investigations', 
      label: 'Tests & Prices', 
      render: (val: any[]) => (
        <div className="flex flex-wrap gap-1">
          {val?.map((s) => (
            <span key={s.id} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100 flex items-center gap-1">
              {s.name} <span className="opacity-50 font-mono">৳{s.price}</span>
            </span>
          ))}
        </div>
      )
    },
     {
        key: 'totalAmount',
        label: 'Sub Total',
        render: (val: any) => <span className="font-bold text-gray-600 font-mono text-sm">৳{Number(val).toLocaleString()}</span>
     },
     {
        key: 'discount',
        label: 'Discount',
        render: (val: any) => <span className="font-bold text-red-500 font-mono text-sm">-{Number(val || 0).toLocaleString()}</span>
     },
     {
        key: 'grandTotal',
        label: 'Grand Total',
        render: (_, row) => {
          const total = Number(row.totalAmount || 0);
          const disc = Number(row.discount || 0);
          return <span className="font-black text-emerald-600 font-mono text-sm">৳{(total - disc).toLocaleString()}</span>
        }
     },
    {
      key: 'actions', label: 'Actions', headClass: 'text-right', rowClass: 'text-right', render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { executePrint(row); }}
            textColor="#2563EB"
          >
            🖨️
          </Button>
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
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading pathology tests...</div>
        ) : (
          <BasicTable columns={columns} data={pathologyTests} />
        )}
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


      {/* Render the section off-screen so the system print dialog can 'snapshot' it for the preview */}
      <div id="print-section" style={{ position: 'fixed', left: '-9999px', top: '0', width: '148mm', zIndex: -1 }}>
         {selectedTest && <PathologyPrintReceipt data={selectedTest} />}
      </div>
    </div>
  );
};

export default PathologyTests;

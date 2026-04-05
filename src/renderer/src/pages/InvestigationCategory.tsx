import { useState, useEffect } from 'react';
import BasicTable from '../components/table/BasicTable';
import { ITableColumn } from '../components/table/ITable';
import Button from '../components/buttons/Button';
import usePopup from '../hooks/usePopup';
import Delete from '../components/Delete';
import InvestigationCategoryAdd from '../components/popups/InvestigationCategoryAdd';

interface CategoryData {
  id: number;
  name: string;
  createdAt: string;
}

const InvestigationCategory = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  const { openModal: openAdd, Modal: AddModal, closeModal: closeAdd } = usePopup("medium");
  const { openModal: openEdit, Modal: EditModal, closeModal: closeEdit } = usePopup("medium");
  const { openModal: openDelete, Modal: DeleteModal, closeModal: closeDelete } = usePopup("medium");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await window.api.invoke('INVESTIGATION_CATEGORY:LIST');
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onAddSubmit = async (data: any) => {
    try {
      await window.api.invoke('INVESTIGATION_CATEGORY:CREATE', data);
      fetchCategories();
      closeAdd();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const onEditSubmit = async (data: any) => {
    if (!selectedCategory) return;
    try {
      await window.api.invoke('INVESTIGATION_CATEGORY:UPDATE', {
        id: selectedCategory.id,
        data: data
      });
      fetchCategories();
      closeEdit();
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        await window.api.invoke('INVESTIGATION_CATEGORY:DELETE', { id: selectedCategory.id });
        fetchCategories();
        setSelectedCategory(null);
        closeDelete();
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const columns: ITableColumn[] = [
    { key: 'id', label: 'ID', headClass: 'w-16' },
    { key: 'name', label: 'Category Name', rowClass: 'font-bold' },
    {
      key: 'actions', label: 'Actions', headClass: 'text-right', rowClass: 'text-right', render: (_, row) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedCategory(row); openEdit(); }}
            textColor="#333333"
          >
            ✏️
          </Button>
          <Button
            variant="icon"
            size="extraSmall"
            onClick={() => { setSelectedCategory(row); openDelete(); }}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-pos-primary font-exo2">Investigation Categories</h1>
        </div>
        <Button
          onClick={openAdd}
          bgColor="#333333"
          textColor="#FFFFFF"
          className="rounded px-6 py-3"
        >
          + New Category
        </Button>
      </div>

      <div className="bg-white border border-[#D1D5DB] rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">Loading categories...</div>
        ) : (
          <BasicTable columns={columns} data={categories} />
        )}
      </div>

      <AddModal title="New Category">
        <InvestigationCategoryAdd onSubmit={onAddSubmit} onCancel={closeAdd} />
      </AddModal>

      <EditModal title="Edit Category">
        {selectedCategory && (
          <InvestigationCategoryAdd
            initialData={selectedCategory}
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

export default InvestigationCategory;

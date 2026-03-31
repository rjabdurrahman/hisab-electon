import Button from "./buttons/Button";

interface PropsType {
  handleClose?: () => void;
  handleDelete: () => void;
  loading?: boolean;
}

export default function Delete({
  handleClose,
  handleDelete,
  loading,
}: PropsType) {
  return (
    <div>
      <div>Are you sure you want to delete this item?</div>
      <div className="form-buttons flex justify-end gap-2 mt-4">
        <Button
          onClick={handleClose}
          bgColor="#f44336"
          variant="outlined"
          textColor="#f44336"
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          loading={loading}
          type="submit"
          bgColor="#333333"
          textColor="#FFFFFF"
          className="flex-1"

        >
          Delete
        </Button>
      </div>
    </div>
  );
}

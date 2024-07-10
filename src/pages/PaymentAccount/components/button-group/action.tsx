import React, { useRef, useState } from 'react'
import EditModal from '../modal/edit'
import DeleteModal from '../modal/delete'
import Lucide from '../../../../base-components/Lucide'
import { IPaymentAccount } from '../../../../modules/payment-account/interfaces/payment-account.interface'

type ActionButtonsProps = {
  handleReloadData: () => void
  initialValues: IPaymentAccount
}

const ActionButtons = ({
    handleReloadData,
    initialValues,
    }
    : ActionButtonsProps) => {
  
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isPembayaranModalOpen, setIsPembayaranModalOpen] = useState<boolean>(false);
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const deleteButtonRef = useRef(null);

    return (
      <>
      <EditModal
        handleReloadData={handleReloadData}
        initialValues={initialValues}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
      />
      <DeleteModal
        handleReloadData={handleReloadData}
        deleteConfirmationModal={deleteConfirmationModal}
        setDeleteConfirmationModal={setDeleteConfirmationModal}
        deleteButtonRef={deleteButtonRef}
        initialValues={initialValues}
      />
      <div className="flex items-center justify-start">
        <a className="flex items-center mr-3" href="#" onClick={() => {
          setIsEditModalOpen(true);
        }}>
          <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
          Edit
        </a>
        <a
          className="flex items-center text-danger"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            console.log(initialValues);
            setDeleteConfirmationModal(true);
          }}
        >
        <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Hapus
        </a>
      </div>
      </>
    );
  }

export default ActionButtons
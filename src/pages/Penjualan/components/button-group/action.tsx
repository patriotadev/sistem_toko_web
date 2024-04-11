import React, { useRef, useState } from 'react'
import { IToko } from '../../../../modules/toko/interfaces/toko.interface'
import EditModal from '../modal/edit'
import DeleteModal from '../modal/delete'
import Lucide from '../../../../base-components/Lucide'
import { IPenjualan } from '../../../../modules/penjualan/interfaces/penjualan.interface'
import DetailModal from '../modal/detail'
import PembayaranModal from '../modal/pembayaran'
import PembayaranDetailModal from '../modal/pembayaran-detail'

type ActionButtonsProps = {
  handleReloadData: () => void
  initialValues: IPenjualan
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
      <DetailModal
        initialValues={initialValues}
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        handleReloadData={handleReloadData}
      />
      <EditModal
        handleReloadData={handleReloadData}
        initialValues={initialValues}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
      />
      <PembayaranDetailModal
       initialValues={initialValues}
       isModalOpen={isPembayaranModalOpen}
       setIsModalOpen={setIsPembayaranModalOpen}
       handleReloadData={handleReloadData}
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
          setIsDetailModalOpen(true);
        }}>
          <Lucide icon="View" className="w-4 h-4 mr-1" />{" "}
          Detail
        </a>
        <a className="flex items-center mr-3" href="#" onClick={() => {
          setIsEditModalOpen(true);
        }}>
          <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
          Edit
        </a>
        <a className="flex items-center mr-3" href="#" onClick={() => {
          setIsPembayaranModalOpen(true);
        }}>
          <Lucide icon="Wallet" className="w-4 h-4 mr-1" />{" "}
          Pembayaran
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
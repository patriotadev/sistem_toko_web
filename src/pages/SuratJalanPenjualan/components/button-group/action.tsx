import React, { useRef, useState } from 'react'
import { IToko } from '../../../../modules/toko/interfaces/toko.interface'
import EditModal from '../modal/edit'
import DeleteModal from '../modal/delete'
import Lucide from '../../../../base-components/Lucide'
import { IPenjualan } from '../../../../modules/penjualan/interfaces/penjualan.interface'
import DetailModal from '../modal/detail'
import { ISuratJalanPenjualan } from '../../../../modules/penjualan/interfaces/surat-jalan-penjualan.interface'
import BatalModal from '../modal/batal'

type ActionButtonsProps = {
  handleReloadData: () => void
  initialValues: ISuratJalanPenjualan
}

const ActionButtons = ({
    handleReloadData,
    initialValues,
    }
    : ActionButtonsProps) => {
  
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const deleteButtonRef = useRef(null);
    const [batalConfirmationModal, setBatalConfirmationModal] = useState(false);
    const batalButtonRef = useRef(null);
  
    return (
      <>
      <DetailModal
        initialValues={initialValues}
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        handleReloadData={handleReloadData}
      />
      <BatalModal
        handleReloadData={handleReloadData}
        batalConfirmationModal={batalConfirmationModal}
        setBatalConfirmationModal={setBatalConfirmationModal}
        batalButtonRef={batalButtonRef}
        initialValues={initialValues}
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
        <a
          className="flex items-center mr-3"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            console.log(initialValues);
            setBatalConfirmationModal(true);
          }}
        >
        <Lucide icon="RotateCcw" className="w-4 h-4 mr-1" /> Batal
        </a>
        <a className="flex items-center mr-3" href="#" onClick={() => {}}>
          <Lucide icon="Printer" className="w-4 h-4 mr-1" />{" "}
          Print
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
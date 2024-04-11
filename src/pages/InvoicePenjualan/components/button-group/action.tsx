import React, { useRef, useState } from 'react'
import { IToko } from '../../../../modules/toko/interfaces/toko.interface'
import EditModal from '../modal/edit'
import DeleteModal from '../modal/delete'
import Lucide from '../../../../base-components/Lucide'
import { IPenjualan } from '../../../../modules/penjualan/interfaces/penjualan.interface'
import DetailModal from '../modal/detail'
import { ISuratJalanPenjualan } from '../../../../modules/penjualan/interfaces/surat-jalan-penjualan.interface';
import { IInvoicePenjualan } from '../../../../modules/invoice-penjualan/interfaces/invoice-penjualan.interface'
import { PenjualanOptionType } from '../../../SuratJalanPenjualan/types/penjualan.type'

type ActionButtonsProps = {
  handleReloadData: () => void
  initialValues: IInvoicePenjualan
  penjualanList: IPenjualan[]
}

const ActionButtons = ({
    handleReloadData,
    initialValues,
    penjualanList
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
      <EditModal 
        handleReloadData={handleReloadData}
        initialValues={initialValues}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        penjualanList={penjualanList}
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
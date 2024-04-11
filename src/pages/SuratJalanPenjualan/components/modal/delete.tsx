import React, { Dispatch, MutableRefObject, SetStateAction } from 'react'
import TokoModule from '../../../../modules/toko/toko'
import PenjualanModule from '../../../../modules/penjualan/penjualan';
import SuratJalanPenjualanModule from '../../../../modules/penjualan/surat-jalan-penjualan';
import { IToko } from '../../../../modules/toko/interfaces/toko.interface'
import toast from 'react-hot-toast'
import { Dialog } from '../../../../base-components/Headless'
import Lucide from '../../../../base-components/Lucide'
import Button from '../../../../base-components/Button'
import { IPenjualan } from '../../../../modules/penjualan/interfaces/penjualan.interface'
import { ISuratJalanPenjualan } from '../../../../modules/penjualan/interfaces/surat-jalan-penjualan.interface'

type DeleteModalProps = {
    handleReloadData: () => void
    deleteConfirmationModal: boolean
    setDeleteConfirmationModal: Dispatch<SetStateAction<boolean>>
    deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
    initialValues: ISuratJalanPenjualan
}

const DeleteModal = ({
    handleReloadData,
    deleteConfirmationModal,
    setDeleteConfirmationModal,
    deleteButtonRef,
    initialValues
  }: DeleteModalProps) => {
  
    const onDelete = (initialValues: ISuratJalanPenjualan) => {
      SuratJalanPenjualanModule.destroy(initialValues)
      .then(res => res.json())
          .then(result => {
            setDeleteConfirmationModal(false);
            if (result.code === 200) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }
            handleReloadData();
          })
          .catch((error) => toast.error(error.message))
          .finally(() => {});
    }
  
    return (
       <div>
        <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
        >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Apakah Anda yakin?</div>
            <div className="mt-2 text-slate-500">
              Apakah Anda yakin ingin menghapus data ini? <br />
              Data akan terhapus secara permanen.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
              onClick={() => onDelete(initialValues)}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
        </Dialog>
       </div>
    )
  }

export default DeleteModal;
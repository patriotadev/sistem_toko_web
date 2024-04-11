import React, { Dispatch, MutableRefObject, SetStateAction } from 'react'
import TokoModule from '../../../../modules/toko/toko'
import { IToko } from '../../../../modules/toko/interfaces/toko.interface'
import toast from 'react-hot-toast'
import { Dialog } from '../../../../base-components/Headless'
import Lucide from '../../../../base-components/Lucide'
import Button from '../../../../base-components/Button'
import { AxiosResponse } from 'axios'

type DeleteModalProps = {
    handleReloadData: () => void
    deleteConfirmationModal: boolean
    setDeleteConfirmationModal: Dispatch<SetStateAction<boolean>>
    deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
    initialValues: IToko
}

const DeleteModal = ({
    handleReloadData,
    deleteConfirmationModal,
    setDeleteConfirmationModal,
    deleteButtonRef,
    initialValues
  }: DeleteModalProps) => {
  
    const onDelete = (initialValues: IToko) => {
      TokoModule.destroy(initialValues)
          .then((res: AxiosResponse) => {
            const result = res.data;
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
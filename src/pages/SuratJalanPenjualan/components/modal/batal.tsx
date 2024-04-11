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

type BatalModalProps = {
    handleReloadData: () => void
    batalConfirmationModal: boolean
    setBatalConfirmationModal: Dispatch<SetStateAction<boolean>>
    batalButtonRef: MutableRefObject<HTMLButtonElement | null>
    initialValues: ISuratJalanPenjualan
}

const BatalModal = ({
    handleReloadData,
    batalConfirmationModal,
    setBatalConfirmationModal,
    batalButtonRef,
    initialValues
  }: BatalModalProps) => {
  
    const onSubmit = (initialValues: ISuratJalanPenjualan) => {
      SuratJalanPenjualanModule.cancel(initialValues)
      .then(res => res.json())
          .then(result => {
            setBatalConfirmationModal(false);
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
        open={batalConfirmationModal}
        onClose={() => {
          setBatalConfirmationModal(false);
        }}
        initialFocus={batalButtonRef}
        >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="RotateCcw"
              className="w-16 h-16 mx-auto mt-3 text-warning"
            />
            <div className="mt-5 text-3xl">Apakah Anda yakin?</div>
            <div className="mt-2 text-slate-500">
              Apakah Anda yakin ingin membatalkan surat jalan ini? <br />
              Data barang akan dikembalikan ke stok barang.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setBatalConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              type="button"
              className="w-24"
              ref={batalButtonRef}
              onClick={() => onSubmit(initialValues)}
            >
              OK
            </Button>
          </div>
        </Dialog.Panel>
        </Dialog>
       </div>
    )
  }

export default BatalModal;
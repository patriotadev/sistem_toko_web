import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { IPenjualan, PenjualanPayload } from '../../../../modules/penjualan/interfaces/penjualan.interface';
import PenjualanModule from '../../../../modules/penjualan/penjualan';
import InvoicePenjualanModule from '../../../../modules/invoice-penjualan/invoice-penjualan';
import fakerData from "../../../../utils/faker";
import { Dialog, Disclosure } from '../../../../base-components/Headless';
import Lucide from '../../../../base-components/Lucide';
import moment from 'moment';
import { thousandLimiter } from '../../../../helpers/helper';
import { FormLabel } from '../../../../base-components/Form';
import Tippy from '../../../../base-components/Tippy';
import Button from '../../../../base-components/Button';
import { ISuratJalanPenjualan } from '../../../../modules/penjualan/interfaces/surat-jalan-penjualan.interface';
import { IInvoicePenjualan } from '../../../../modules/invoice-penjualan/interfaces/invoice-penjualan.interface';
import { INotaPenjualan } from '../../../../modules/nota-penjualan/interfaces/nota-penjualan.interface';

type DetailModalProps = {
    initialValues: INotaPenjualan,
    handleReloadData: () => void
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const DetailModal = ({initialValues, isModalOpen, setIsModalOpen, handleReloadData}: DetailModalProps) => {
    console.log(initialValues, ">>> DETAIL MODAL");
    const [selectedInvoicePenjualanListData, setSelectedInvoicePenjualanListData] = useState<IPenjualan[]>([]);

    const fetchSelectedPenjualanListData = () => {
      const invoicePenjualanId: string[] = initialValues.NotaPenjualanList.map((item) => item.invoicePenjualanId);
      console.log(invoicePenjualanId);
      InvoicePenjualanModule.getByNota(invoicePenjualanId)
        .then(res => res.json())
        .then(result => {
          console.log("🚀 ~ fetchSelectedPenjualanListData ~ result:", result.data)
          return setSelectedInvoicePenjualanListData(result.data)
        })
    }

    useEffect(() => {
      if (isModalOpen) {
        fetchSelectedPenjualanListData();
      }
    }, [isModalOpen]);

    return (
      <div>
      <Dialog size="lg" open={isModalOpen} onClose={() => {}}>     
          <Dialog.Panel className="p-2">
          <Dialog.Title>
              <div className="flex justify-between flex-wrap w-full">
                <h2 className="mr-auto text-base font-medium flex gap-2 flex-wrap">
                  <p>No. Nota :</p>
                  <p className="font-semibold">{initialValues.nomor}</p>
                </h2>
              </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col gap-4 flex-wrap">
              <div className="w-full">
                  {selectedInvoicePenjualanListData.length > 0 && selectedInvoicePenjualanListData.map((item, index) => 
                  <div key={index} className="intro-y">
                  <div className="flex items-center px-4 py-4 mb-3 box zoom-in">
                    <div className="ml-4 mr-auto">
                      <div className="font-medium">{item.nomor}</div>
                      <div className="text-slate-500 text-xs mt-0.5 italic">
                        Dibuat pada tanggal {moment(item.createdAt).format('DD MMMM YYYY')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </Dialog.Description>
            <Dialog.Footer>
              <Button type="button" variant="secondary" onClick={()=> setIsModalOpen(false)}
              className="w-20 mr-2"
              >
                Batal
              </Button> 
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
    </div>
    );
  }


  export default DetailModal;
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
import toast from 'react-hot-toast';
import { Status } from '../../enum/invoice-penjualan.enum';
import { SingleValue } from 'react-select';
import { StatusOptionType } from '../../types/penjualan.type';
import Select from 'react-select';

type DetailModalProps = {
    initialValues: IInvoicePenjualan,
    handleReloadData: () => void
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const DetailModal = ({initialValues, isModalOpen, setIsModalOpen, handleReloadData}: DetailModalProps) => {
    console.log(initialValues, ">>> DETAIL MODAL");
    const [selectedPenjualanListData, setSelectedPenjualanListData] = useState<IPenjualan[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<SingleValue<StatusOptionType>>({
      value: initialValues.status,
      label: initialValues.status
    });
    const statusInvoiceOptions = [
      {
        label: Status.SEDANG_DIPROSES,
        value: Status.SEDANG_DIPROSES,
      },
      {
        label: Status.JATUH_TEMPO,
        value: Status.JATUH_TEMPO
      },
      {
        label: Status.SELESAI,
        value: Status.SELESAI
      },
    ];

    const fetchSelectedPenjualanListData = () => {
      const penjualanId: string[] = initialValues.InvoicePenjualanList.map((item) => item.penjualanId);
      console.log(penjualanId);
      PenjualanModule.getByInvoice(penjualanId)
        .then(res => res.json())
        .then(result => setSelectedPenjualanListData(result.data));
    }

    const handleChangeStatus = (value: string) => {
      console.log("🚀 ~ handleChangeStatus ~ value:", value);
      const payload = {
        id: initialValues.id,
        status: value
      }
      InvoicePenjualanModule.updateStatus(payload)
      .then(res => res.json())
      .then(result => {
        if (result.code === 200) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        handleReloadData();
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
                  <p>No. Invoice :</p>
                  <p className="font-semibold">{initialValues.nomor}</p>
                </h2>
              </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col gap-4 flex-wrap">
              <label>Daftar No. PO:</label>
              <div className="w-full">
                  {selectedPenjualanListData.length > 0 && selectedPenjualanListData.map((item, index) => 
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
              <div className="flex flex-col gap-2">
                <label>Invoice Status:</label>
                <Select
                  value={selectedStatus}
                  options={statusInvoiceOptions}
                  onChange={(e) => {
                    if (e) handleChangeStatus(e?.value)
                  }}
                />
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
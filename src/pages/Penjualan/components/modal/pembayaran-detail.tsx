import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { IPenjualan, PenjualanPayload } from '../../../../modules/penjualan/interfaces/penjualan.interface';
import PenjualanModule from '../../../../modules/penjualan/penjualan';
import fakerData from "../../../../utils/faker";
import { Dialog, Disclosure } from '../../../../base-components/Headless';
import Lucide from '../../../../base-components/Lucide';
import moment from 'moment';
import { thousandLimiter } from '../../../../helpers/helper';
import { FormInput, FormLabel, FormSelect } from '../../../../base-components/Form';
import Tippy from '../../../../base-components/Tippy';
import Button from '../../../../base-components/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PEMBAYARAN_OPTION } from '../../const/pembayaran-option';
import { initial } from 'lodash';
import { SelectUserInfo } from '../../../../stores/common/userInfoSlice';
import { useAppSelector } from '../../../../stores/hooks';
import toast from 'react-hot-toast';
import { APPROVAL_OPTION } from '../../const/approval-option';
import { setValue } from '../../../../base-components/Litepicker/litepicker';
import { AxiosResponse } from 'axios';
import * as Yup from 'yup';
import { ColumnCalcsModule } from 'tabulator-tables';

type PembayaranDetailModalProps = {
    initialValues: IPenjualan,
    handleReloadData: () => void
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const PembayaranDetailModal = ({initialValues, isModalOpen, setIsModalOpen, handleReloadData}: PembayaranDetailModalProps) => {
    console.log(initialValues);
    const userInfo = useAppSelector(SelectUserInfo);
    const { register, reset, handleSubmit, formState: {errors}, setError } = useForm<any>();
    const [selectedPembayaran, setSelectedPembayaran] = useState<string>();
    const [selectedApproval, setSelectedApproval] = useState<boolean|null>();

    const onSubmit: SubmitHandler<any> = (data) => {
        const payload = {
            id: initialValues.PembayaranPenjualan[0]?.id,
            metode: selectedPembayaran,
            jumlahBayar: Number(initialValues.PembayaranPenjualan[0]?.jumlahBayar) +  Number(data.jumlahBayar),
            isApprove: selectedPembayaran === 'COD (Cash on Delivery)' ? false : selectedApproval,
            updatedBy: userInfo.name,
            updatedAt: new Date(),
            approvedAt: initialValues.PembayaranPenjualan[0]?.approvedAt,
            approvedBy: initialValues.PembayaranPenjualan[0]?.approvedBy,
        };

        if (selectedPembayaran !== 'Cicilan / Hutang') {
            payload.jumlahBayar = initialValues.PembayaranPenjualan[0]?.totalPembayaran
        }

        if (selectedApproval) {
            payload.approvedAt = new Date(),
            payload.approvedBy = userInfo.name
        }

        console.log(payload);
        PenjualanModule.updatePembayaran(payload)
        .then((res: AxiosResponse) => {
          const result = res.data;
          if (result.code === 200) {
              toast.success(result.message)
          } else {
              toast.error(result.message);
          }
          handleReloadData();
          reset();
        });
    }

    useEffect(() => {
        setSelectedPembayaran(initialValues?.PembayaranPenjualan[0]?.metode);
    }, []);

    console.log(initialValues.PembayaranPenjualan[0]?.isApprove);
  
    return (
      <div>
        <Dialog size="xl" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                    <h2 className="mr-auto text-base flex gap-2 items-center">
                      <Lucide icon="Wallet" className="w-6 h-6"/>
                      Pembayaran
                    </h2>
                    {/* <Select
                      value={selectedStatus}
                      options={statusPoOptions}
                      onChange={(e) => handleChangeStatus(e?.value)}
                    /> */}
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className="w-full">
                      <div className="flex flex-col gap-4">
                        <div className='flex justify-between'>
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold">Total Pembayaran</label>
                                <span className='text-xl font-semibold'>{thousandLimiter(Number(initialValues.PembayaranPenjualan[0]?.totalPembayaran), 'Rp')}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <label className="font-semibold">Sisa Pembayaran</label>
                                <span className={`text-xl font-semibold ${Number(initialValues.PembayaranPenjualan[0]?.totalPembayaran) - Number(initialValues.PembayaranPenjualan[0]?.jumlahBayar) !== 0 && 'text-danger'}`}>{thousandLimiter(Number(initialValues.PembayaranPenjualan[0]?.totalPembayaran) - Number(initialValues.PembayaranPenjualan[0]?.jumlahBayar), 'Rp')}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Metode Pembayaran</label>
                          <span>{initialValues.PembayaranPenjualan[0]?.metode}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Status</label>
                          {initialValues.PembayaranPenjualan[0]?.totalPembayaran === initialValues.PembayaranPenjualan[0]?.jumlahBayar ? 
                            <span className='bg-success py-1 px-2 rounded-md text-white w-fit'>Lunas</span> : <span className='bg-danger py-1 px-2 rounded-md text-white w-fit'>Belum Lunas</span> }
                        </div>
                      </div>
                    </div>
                    <div className="my-4">
                      <hr/>
                    </div>
                    {
                        !initialValues.PembayaranPenjualan[0]?.isApprove && 
                        <div className='mb-4'>
                            <FormLabel htmlFor="modal-form-6">Approve</FormLabel>
                            <FormSelect onChange={(e) => {
                                setSelectedApproval(Boolean(e.target.value))
                            }}>
                            {
                                APPROVAL_OPTION.map((item) => <option selected={initialValues?.PembayaranPenjualan[0]?.isApprove === Boolean(item.value)} value={item.value}>{item.label}</option> )
                            }
                            </FormSelect>
                        </div>
                    }
                    {
                        Number(initialValues.PembayaranPenjualan[0]?.totalPembayaran) - Number(initialValues.PembayaranPenjualan[0]?.jumlahBayar) !== 0 &&
                        <div className='flex flex-col gap-4'>
                        <div>
                            <FormLabel htmlFor="modal-form-6">Metode Pembayaran</FormLabel>
                            <FormSelect onChange={(e) => setSelectedPembayaran(e.target.value)}>
                            {
                                PEMBAYARAN_OPTION.map((item) => <option selected={selectedPembayaran === item.value} value={item.value}>{item.label}</option> )
                            }
                            </FormSelect>
                        </div>
                        {
                            selectedPembayaran === 'Cicilan / Hutang' &&
                            <div>
                                <FormLabel htmlFor="modal-form-6">Jumlah Bayar</FormLabel>
                                <FormInput {...register('jumlahBayar')}  type='number' min={0} step="0.01" pattern="^\d+(?:\.\d{1,2})?$" />
                            </div>
                        }
                        </div>
                    }
                   
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="secondary" onClick={()=> {
                          setIsModalOpen(false);
                      }}
                      className="w-20 mr-1"
                      >
                        Tutup
                      </Button>
                      <Button type="submit" variant="primary"
                      className="w-20 mr-1"
                      >
                        Submit
                      </Button>
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
          </Dialog>
      </div>
    );
  }


  export default PembayaranDetailModal;
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import TokoModule from '../../../../modules/toko/toko';
import StokModule from '../../../../modules/stok/stok';
import PenjualanModule from '../../../../modules/penjualan/penjualan';
import { useAppSelector } from '../../../../stores/hooks';
import { SelectUserInfo } from '../../../../stores/common/userInfoSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dialog, Disclosure } from '../../../../base-components/Headless';
import { FormInput, FormLabel, FormSelect } from '../../../../base-components/Form';
import Button from '../../../../base-components/Button';
import LoadingIcon from '../../../../base-components/LoadingIcon';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import Select, { SingleValue } from 'react-select';
import { StokOptionType, TokoOptionType } from '../../types/penjualan.type';
import { thousandLimiter } from '../../../../helpers/helper';
import Lucide from '../../../../base-components/Lucide';
import { IStok } from '../../../../modules/stok/interfaces/stok.interface';
import Stepper from '../stepper/stepper';

type PreviewModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    isPembayaranOpen: boolean
    setIsPembayaranOpen: Dispatch<SetStateAction<boolean>>
    barangData: any
    detailData: any
    tokoOptionList: TokoOptionType[]
    step: number,
    setStep: Dispatch<SetStateAction<number>>
    pembayaranData: any
    // metodePembayaran: string | undefined
    // jumlahBayar: number  | undefined
    // totalPembayaran: number | undefined
}

type FormInputs = {
    nama: []
    qty: []
    satuan: []
    discount: []
    harga: []
    jumlahHarga: []
}

const PreviewModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
    isPembayaranOpen,
    setIsPembayaranOpen,
    barangData,
    detailData,
    tokoOptionList,
    step,
    setStep,
    pembayaranData
  }: PreviewModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const [selectedToko, setSelectedToko] = useState<SingleValue<TokoOptionType>>();
      const [stokOptionList, setStokOptionList] = useState<StokOptionType[]>([]);
      const [barangList, setBarangList] = useState<string[]>(['barang_1']);
      const formSchema = Yup.object().shape({
        namaPelanggan: Yup.string().required('Nama pelanggan tidak boleh kosong'),
        alamatPelanggan: Yup.string().required('Alamat pelanggan tidak boleh kosong'),
        kontakPelanggan: Yup.string().required('Kontak pelanggan tidak boleh kosong'),
        tokoId: Yup.string().required('Lokasi toko tidak boleh kosong'),
      });
      const { register, handleSubmit, setValue, getValues, reset, formState: {errors, isValid}, watch } = useForm<any>();

      console.log(pembayaranData);
  
      const onSubmit: SubmitHandler<any> = (data) => {
            setStep(1);
            const payload = {
              detail: detailData,
              barang: barangData,
              pembayaran: {
                metodePembayaran: pembayaranData?.metodePembayaran,
                jumlahBayar: Number(pembayaranData?.jumlahBayar),
                totalPembayaran: pembayaranData?.totalBayar,
                isApprove: pembayaranData?.isApprove,
                approvedAt: pembayaranData?.approvedAt,
                approvedBy: pembayaranData?.approvedBy,
                createdBy: userInfo.name,
                createdAt: new Date(),
              }
            };
            console.log(payload);
            setIsSubmitLoading(true);
            PenjualanModule.create(payload)
            .then(res => res.json())
            .then(result => {
                if (result.code === 201) {
                    toast.success(result.message)
                } else {
                    toast.error(result.message);
                }
                handleReloadData();
                reset();
            })
            .catch((error) => toast.error(error.message))
            .finally(() => {
                setIsSubmitLoading(false);
                setIsModalOpen(false);
            });
      }
  
      return (
        <div>
          <Dialog size="lg" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                          Preview
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                  <Stepper step={step} />
                <div className="mt-8 flex justify-center flex-wrap items-center mx-auto w-full  font-semibold text-xl">
                  {/* <Lucide icon="CheckCircle" className="w-8 h-8 mr-2 text-success" /> */}
                  Review
                  <hr/>
                </div>
                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="mt-4">
                    <label className="text-md font-semibold">1. Detail Penjualan</label>
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Nama Pelanggan</FormLabel>
                      <FormInput value={detailData.namaPelanggan} disabled id="regular-form-1" type="text" placeholder="" />
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Alamat</FormLabel>
                      <FormInput value={detailData.alamatPelanggan} disabled id="regular-form-1" type="text" placeholder="" />
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Kontak</FormLabel>
                      <FormInput value={detailData.kontakPelanggan} disabled id="regular-form-1" type="text" placeholder="" />
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-6">
                          Lokasi / Toko
                      </FormLabel>
                      <FormSelect disabled id="modal-form-6">
                          <option value=''>-- Pilih PT --</option>
                          {tokoOptionList && tokoOptionList.length > 0 ? tokoOptionList.map((item, index) => (
                              <option selected={detailData.tokoId === item.value} value={item.value}>{item.label}</option>
                          )) : ''}
                      </FormSelect>
                  </div>
                </div>
                <Disclosure.Group variant="boxed" className="mt-6">
                <div className="mb-4 mt-8">
                    <label className="text-md font-semibold">2. Barang PO</label>
                </div>
                <div>
                  {barangData.map((item: any, i: number) => (
                    <Disclosure id={i}>
                    <Disclosure.Button>
                      Barang {i+1}
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="flex flex-col gap-2 flex-wrap">
                        <div className="w-full">
                            <FormLabel>Nama</FormLabel>
                            <FormInput value={item.nama} disabled type="text" placeholder="Nama Barang" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Qty</FormLabel>
                            <FormInput value={item.qty} disabled min='1' type="number" placeholder="0" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Satuan</FormLabel>
                            <FormInput value={item.satuan} disabled type="text" placeholder="Ex: Pcs, Kg, Liter" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Harga</FormLabel>
                            <FormInput value={item.harga} disabled min='0' type="number" placeholder="Rp. 0" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Diskon</FormLabel>
                            <FormInput value={item.discount} disabled min='0' type="number" placeholder="Rp. 0" />
                        </div>
                        <div className="w-full flex flex-col items-end mt-6">
                            <FormLabel className="font-semibold">Total Harga</FormLabel>
                            {item.discount && item.discount !== '0' ?
                              <span className="text-danger text-xs mb-4">
                                - Discount ({thousandLimiter(Number(item.discount), 'Rp')})
                              </span>
                              : ''
                            }
                            {
                              item.qty !== '0' && item.harga !== '0' ?
                              <span>
                                {thousandLimiter(Number(Number(item.qty) * Number(item.harga) - Number(item.discount)), 'Rp')}
                              </span>
                              : '0'
                            }
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Disclosure>
                  ))}
                  <div className="flex justify-start mt-4">
                  </div>
                </div>
                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="mt-4">
                    <label className="text-md font-semibold">3. Pembayaran</label>
                  </div>
                    <div className="w-full flex flex-col">
                      <FormLabel htmlFor="regular-form-1">Total Pembayaran</FormLabel>
                      {
                        pembayaranData?.totalBayar ? <span className='text-md font-semibold'>{thousandLimiter(pembayaranData?.totalBayar, 'Rp')}</span> : <span>{thousandLimiter(0, 'Rp')}</span>
                      }             
                    </div>
                    <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Metode Pembayaran</FormLabel>
                      <FormInput value={pembayaranData?.metodePembayaran} disabled id="regular-form-1" type="text" placeholder="" />
                    </div>
                    {
                      pembayaranData?.metodePembayaran === 'Cicilan / Hutang' &&  
                      <div className="w-full">
                        <FormLabel htmlFor="regular-form-1">DP</FormLabel>
                        <FormInput value={pembayaranData?.jumlahBayar} disabled id="regular-form-1" type="number" placeholder="" />
                      </div>
                    }
                </div>
            </Disclosure.Group>
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" onClick={()=> {
                          setStep(3);
                          setIsModalOpen(false);
                          setIsPembayaranOpen(true);
                      }}
                      className="w-20 mr-1"
                      >
                          Kembali
                      </Button>
                      <Button variant="primary" type="submit" className="w-20">
                          Simpan
                          {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                      </Button>
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
          </Dialog>
        </div>
      );
  };

  export default PreviewModal;
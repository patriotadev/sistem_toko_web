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
import { PEMBAYARAN_OPTION } from '../../const/pembayaran-option';

type PembayaranModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    isBarangOpen: boolean
    setIsBarangOpen: Dispatch<SetStateAction<boolean>>
    isPreviewOpen: boolean
    setIsPreviewOpen: Dispatch<SetStateAction<boolean>>
    step: number,
    setStep: Dispatch<SetStateAction<number>>
    barangData: any
    setPembayaranData: Dispatch<SetStateAction<any>>
    // setMetodePembayaran: Dispatch<SetStateAction<string|undefined>>
    // setJumlahBayar: Dispatch<SetStateAction<number|undefined>>
    // setTotalPembayaran: Dispatch<SetStateAction<number|undefined>>
}

type FormInputs = {
    nama: []
    qty: []
    satuan: []
    discount: []
    harga: []
    jumlahHarga: []
}

const PembayaranModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
    isPreviewOpen,
    setIsPreviewOpen,
    isBarangOpen,
    setIsBarangOpen,
    step,
    setStep,
    barangData,
    setPembayaranData
  }: PembayaranModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const [selectedPembayaran, setSelectedPembayaran] = useState<string|null>();
      const [totalBayar, setTotalBayar] = useState<number>(0);
      const formSchema = Yup.object().shape({
        namaPelanggan: Yup.string().required('Nama pelanggan tidak boleh kosong'),
        alamatPelanggan: Yup.string().required('Alamat pelanggan tidak boleh kosong'),
        kontakPelanggan: Yup.string().required('Kontak pelanggan tidak boleh kosong'),
        tokoId: Yup.string().required('Lokasi toko tidak boleh kosong'),
      });
      const { register, handleSubmit, setValue, getValues, reset, formState: {errors, isValid}, watch } = useForm<any>();

      console.log('previeww');
  
      const onSubmit: SubmitHandler<any> = (data) => {
        console.log("pembayaran data==>", data);
        if (selectedPembayaran) {
          const temp: any = {};
          temp.metodePembayaran = selectedPembayaran;
          if (getValues('approval') === true) {
            temp.isApprove = getValues('approval');
            temp.approvedBy = userInfo.name;
            temp.approvedAt = new Date();
          } else {
            temp.isApprove = getValues('approval');
          }
          if (Number(getValues('dp')) > 0) {
            temp.jumlahBayar = getValues('dp');
          } else {
            temp.jumlahBayar = totalBayar;
          }
          temp.totalBayar = totalBayar;
          setPembayaranData(temp);
          setStep(4);
          setIsModalOpen(false);
          setIsPreviewOpen(true)
        }
      }

      watch('dp');

      const handleTotalPembayaran = (data: any) => {
        let temp: number = 0;
        console.log(data)
        data.map((item: any) => temp += item.jumlahHarga);
        setTotalBayar(temp);
      }

      useEffect(() => {
        handleTotalPembayaran(barangData);
      }, [isModalOpen]);

      console.log(totalBayar);
  
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
                          Pembayaran
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                  <Stepper step={step} />
                <div className="mt-8 flex justify-center flex-wrap items-center mx-auto w-full  font-semibold text-xl">
                  {/* <Lucide icon="CheckCircle" className="w-8 h-8 mr-2 text-success" /> */}
                  Pembayaran
                  <hr/>
                </div>
                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="mt-6 flex flex-col gap-2">
                    <FormLabel htmlFor="modal-form-6">Total Pembayaran</FormLabel>
                    <span className='text-xl font-semibold'>{thousandLimiter(totalBayar, 'Rp')}</span>
                  </div>
                  <div className="mt-4">
                    <FormLabel htmlFor="modal-form-6">Metode Pembayaran</FormLabel>
                    <FormSelect onChange={(e) => {
                      setSelectedPembayaran(e.target.value);
                      if (e.target.value === 'COD (Cash on Delivery)') {
                        setValue('approval', false);
                      } else {
                        setValue('approval', true);
                      }
                    }}>
                      {
                        PEMBAYARAN_OPTION.map((item) => <option value={item.value}>{item.label}</option> )
                      }
                        {/* <option value=''>-- Metode --</option>
                        <option value='Bayar Lunas'>Bayar Lunas</option>
                        <option value='COD (Cash on Delivery)'>COD (Cash on Delivery)</option>
                        <option value='Cicilan / Hutang'>Cicilan / Hutang</option> */}
                    </FormSelect>
                  </div>
                  {
                    selectedPembayaran === 'Cicilan / Hutang' &&
                    <div>
                        <FormLabel htmlFor="modal-form-6">DP / Uang Muka</FormLabel>
                        <FormInput {...register('dp')}  type='number' min={0} step="0.01" pattern="^\d+(?:\.\d{1,2})?$" />
                    </div>
                  }
                </div>
                <Disclosure.Group variant="boxed" className="mt-6">
            </Disclosure.Group>
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" onClick={()=> {
                          setStep(3);
                          setIsModalOpen(false);
                          setIsBarangOpen(true);
                          setSelectedPembayaran(null);
                      }}
                      className="w-20 mr-1"
                      >
                          Kembali
                      </Button>
                      <Button variant="primary" type="submit" className="w-20">
                          Lanjut
                          {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                      </Button>
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
          </Dialog>
        </div>
      );
  };

  export default PembayaranModal;
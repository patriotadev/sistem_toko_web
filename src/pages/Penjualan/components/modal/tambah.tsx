import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TokoModule from '../../../../modules/toko/toko';
import { useAppSelector } from '../../../../stores/hooks';
import { SelectUserInfo } from '../../../../stores/common/userInfoSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dialog } from '../../../../base-components/Headless';
import { FormInput, FormLabel } from '../../../../base-components/Form';
import Button from '../../../../base-components/Button';
import LoadingIcon from '../../../../base-components/LoadingIcon';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import Select, { SingleValue } from 'react-select';
import { TokoOptionType } from '../../types/penjualan.type';
import BarangModal from './barang';
import PreviewModal from './preview';
import PembayaranModal from './pembayaran';
import Stepper from '../stepper/stepper';

type TambahModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    tokoOptionList: TokoOptionType[]
}

type FormInputs = {
    namaPelanggan: string
    alamatPelanggan: string
    kontakPelanggan: string
    // tokoId: string
}

const TambahModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
    tokoOptionList
  }: TambahModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const [selectedToko, setSelectedToko] = useState<SingleValue<TokoOptionType>>();
      const [isBarangOpen, setIsBarangOpen] = useState<boolean>(false);
      const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
      const [isPembayaranOpen, setIsPembayaranOpen] = useState<boolean>(false);
      const [barangData, setBarangData] = useState<any>([]);
      const [detailData, setDetailData] = useState<any>([]);
      const [step, setStep] = useState<number>(1);
      const [pembayaranData, setPembayaranData] = useState<any>([]);

      const formSchema = Yup.object().shape({
        namaPelanggan: Yup.string().required('Nama pelanggan tidak boleh kosong'),
        alamatPelanggan: Yup.string().required('Alamat pelanggan tidak boleh kosong'),
        kontakPelanggan: Yup.string().required('Kontak pelanggan tidak boleh kosong'),
      });
      const { register, handleSubmit, setValue, getValues, reset, formState: {errors, isValid} } = useForm<FormInputs>({
        resolver: yupResolver(formSchema)
      });
  
      const onSubmit: SubmitHandler<FormInputs> = (data) => {
        console.log(data);
        setStep(2);
        setIsModalOpen(false);
        setIsBarangOpen(true);
        setDetailData({
            namaPelanggan: getValues('namaPelanggan'),
            alamatPelanggan: getValues('alamatPelanggan'),
            kontakPelanggan: getValues('kontakPelanggan'),
            tokoId: userInfo.tokoId,
            createdBy: userInfo.name
        });
      }
  
      return (
        <div>
          {
            isBarangOpen ? 
            <BarangModal
                handleReloadData={handleReloadData}
                isModalOpen={isBarangOpen}
                setIsModalOpen={setIsBarangOpen}
                isPembayaranOpen={isPembayaranOpen}
                setIsPembayaranOpen={setIsPembayaranOpen}
                isTambahOpen={isModalOpen}
                setIsTambahOpen={setIsModalOpen}
                barangData={barangData}
                setBarangData={setBarangData}
                step={step}
                setStep={setStep}
            /> : ''
          }
          
          <PreviewModal
            handleReloadData={handleReloadData}
            isModalOpen={isPreviewOpen}
            setIsModalOpen={setIsPreviewOpen}
            isPembayaranOpen={isPembayaranOpen}
            setIsPembayaranOpen={setIsPembayaranOpen}
            barangData={barangData}
            detailData={detailData}
            tokoOptionList={tokoOptionList}
            step={step}
            setStep={setStep}
            pembayaranData={pembayaranData}
            // metodePembayaran={metodePembayaran}
            // jumlahBayar={jumlahBayar}
            // totalPembayaran={totalPembayaran}
          />

          <PembayaranModal
            handleReloadData={handleReloadData}
            isModalOpen={isPembayaranOpen}
            setIsModalOpen={setIsPembayaranOpen}
            isPreviewOpen={isPreviewOpen}
            setIsPreviewOpen={setIsPreviewOpen}
            isBarangOpen={isBarangOpen}
            setIsBarangOpen={setIsBarangOpen}
            step={step}
            setStep={setStep}
            barangData={barangData}
            setPembayaranData={setPembayaranData}
            // setMetodePembayaran={setMetodePembayaran}
            // setJumlahBayar={setJumlahBayar}
            // setTotalPembayaran={setTotalPembayaran}
          />

          <Dialog size="lg" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                          Form Tambah Penjualan
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                          <Stepper step={step} />
                          <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama Pelanggan</FormLabel>
                                <FormInput {...register('namaPelanggan')} autoComplete='off' id="regular-form-1" type="text" placeholder="ABCXYZ" className={`${errors.namaPelanggan && "border-danger"}`} />
                                {errors.namaPelanggan && 
                                    <div className="mt-2 text-danger">
                                        {errors.namaPelanggan.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Alamat</FormLabel>
                                <FormInput {...register('alamatPelanggan')} autoComplete='off' id="regular-form-1" type="text" placeholder="Jl. ABCXXX" className={`${errors.alamatPelanggan && "border-danger"}`} />
                                {errors.alamatPelanggan && 
                                    <div className="mt-2 text-danger">
                                        {errors.alamatPelanggan.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Kontak</FormLabel>
                                <FormInput {...register('kontakPelanggan')} autoComplete='off' id="regular-form-1" type="text" placeholder="081234XXXX" className={`${errors.kontakPelanggan && "border-danger"}`} />
                                {errors.kontakPelanggan && 
                                    <div className="mt-2 text-danger">
                                        {errors.kontakPelanggan.message}
                                    </div>
                                }
                            </div>
                            {/* <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Lokasi Toko</FormLabel>
                                <Select
                                    className={`${errors.tokoId && "border-danger"}`}
                                    value={selectedToko}
                                    options={tokoOptionList}
                                    onChange={(e) => {
                                        if (e) {
                                            setSelectedToko(e);
                                            setValue('tokoId', e.value);
                                        }
                                    }}
                                />
                                {errors.tokoId && 
                                    <div className="mt-2 text-danger">
                                        {errors.tokoId.message}
                                    </div>
                                }
                            </div> */}
                          </div>
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" onClick={()=> {
                          setIsModalOpen(false);
                      }}
                      className="w-20 mr-1"
                      >
                          Batal
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

  export default TambahModal;
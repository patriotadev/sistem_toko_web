import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PenjualanModule from '../../../../modules/penjualan/penjualan';
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
import { PenjualanOptionType, TokoOptionType } from '../../types/penjualan.type';
import BarangModal from './barang';
import PreviewModal from './preview';
import Stepper from '../stepper/stepper';
import moment from 'moment';
import { IPenjualan } from '../../../../modules/penjualan/interfaces/penjualan.interface';

type TambahModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    penjualanOptionList: PenjualanOptionType[]
}

type FormInputs = {
    supir: string
    penjualanId: string
}

const TambahModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
    penjualanOptionList
  }: TambahModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const [selectedPenjualan, setSelectedPenjualan] = useState<SingleValue<PenjualanOptionType>>();
      const [isBarangOpen, setIsBarangOpen] = useState<boolean>(false);
      const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
      const [barangData, setBarangData] = useState<any>([]);
      const [detailData, setDetailData] = useState<any>([]);
      const [step, setStep] = useState<number>(1);

      const formSchema = Yup.object().shape({
        supir: Yup.string().required('Supir tidak boleh kosong'),
        penjualanId: Yup.string().required('Data penjualan tidak boleh kosong'),
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
            namaSupir: getValues('supir'),
            penjualanId: getValues('penjualanId'),
            createdBy: userInfo.name,
            tokoId: userInfo.tokoId
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
                isPreviewOpen={isPreviewOpen}
                setIsPreviewOpen={setIsPreviewOpen}
                isTambahOpen={isModalOpen}
                setIsTambahOpen={setIsModalOpen}
                barangData={barangData}
                setBarangData={setBarangData}
                selectedPenjualan={selectedPenjualan}
                step={step}
                setStep={setStep}
            /> : ''
          }
          
          <PreviewModal
            handleReloadData={handleReloadData}
            isModalOpen={isPreviewOpen}
            setIsModalOpen={setIsPreviewOpen}
            isBarangOpen={isBarangOpen}
            setIsBarangOpen={setIsBarangOpen}
            barangData={barangData}
            detailData={detailData}
            tokoOptionList={penjualanOptionList}
            step={step}
            setStep={setStep}
            penjualanOptionList={penjualanOptionList}
          />

          <Dialog size="lg" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                          Form Surat Jalan
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                          <Stepper step={step} />
                          <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Supir</FormLabel>
                                <FormInput {...register('supir')} autoComplete='off' id="regular-form-1" type="text" placeholder="Nama Supir" className={`${errors.supir && "border-danger"}`} />
                                {errors.supir && 
                                    <div className="mt-2 text-danger">
                                        {errors.supir.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">No. Penjualan</FormLabel>
                                <Select
                                    {...register('penjualanId')}
                                    options={penjualanOptionList}
                                    value={selectedPenjualan}
                                    onChange={(e) => {
                                        if (e) {
                                            setSelectedPenjualan(e);
                                            setValue('penjualanId', e.value);
                                        }
                                    }}
                                />
                                {/* <FormInput {...register('penjualanId')} autoComplete='off' id="regular-form-1" type="text" placeholder="081234XXXX" className={`${errors.penjualanId && "border-danger"}`} /> */}
                                {errors.penjualanId && 
                                    <div className="mt-2 text-danger">
                                        {errors.penjualanId.message}
                                    </div>
                                }
                            </div>
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
                          Next
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
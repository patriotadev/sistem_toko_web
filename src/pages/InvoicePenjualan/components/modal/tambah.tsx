import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PenjualanModule from '../../../../modules/penjualan/penjualan';
import InvoicePenjualanModule from '../../../../modules/invoice-penjualan/invoice-penjualan';
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
import Select, { MultiValue, SingleValue } from 'react-select';
import { PenjualanOptionType, TokoOptionType } from '../../types/penjualan.type';
import BarangModal from './barang';
import Stepper from '../stepper/stepper';
import moment from 'moment';
import { IPenjualan } from '../../../../modules/penjualan/interfaces/penjualan.interface';
import { PenjualanListPayload } from '../../../../modules/invoice-penjualan/interfaces/invoice-penjualan.interface';

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
      const [selectedPenjualan, setSelectedPenjualan] = useState<MultiValue<PenjualanOptionType>>();

    //   const formSchema = Yup.object().shape({
    //     supir: Yup.string().required('Supir tidak boleh kosong'),
    //     penjualanId: Yup.string().required('Data penjualan tidak boleh kosong'),
    //   });
      const { register, handleSubmit, setValue, getValues, reset, formState: {errors, isValid} } = useForm<FormInputs>();
  
      const onSubmit: SubmitHandler<FormInputs> = (data) => {
       const penjualanListPayload: any = [];
       selectedPenjualan?.forEach((item) => {
            penjualanListPayload.push(item.detail)
       });
       console.log(penjualanListPayload);
       setIsSubmitLoading(true);
       const payload: any =  {
           tokoId: userInfo.tokoId,
           penjualanListPayload,
           createdBy: userInfo.name
       };
       InvoicePenjualanModule.create(payload)
       .then(res => res.json())
       .then(result => {
         setIsModalOpen(false);
         setSelectedPenjualan([]);
         reset();
         if (result.code === 201) {
           toast.success(result.message);
         } else {
           toast.error(result.message);
         }
         handleReloadData();
       })
       .catch((error) => toast.error(error.message))
       .finally(() => setIsSubmitLoading(false));
       console.log(payload);
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
                          Tambah Invoice
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                  <div className="flex flex-col gap-4 flex-wrap">
                    <div className="w-full">
                        <FormLabel htmlFor="regular-form-1">Pilih Penjualan</FormLabel>
                        <Select
                            onChange={(e) => setSelectedPenjualan(e)} 
                            isMulti
                            isSearchable
                            isClearable
                            options={penjualanOptionList}
                        />
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

  export default TambahModal;
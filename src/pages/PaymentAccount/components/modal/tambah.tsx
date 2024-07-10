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
import PaymentAccountModule from "../../../../modules/payment-account/payment-account";
import { AxiosResponse } from 'axios';


type TambahModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

type FormInputs = {
    bankName: string
    accountNumber: string
    accountName: string
}

const TambahModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
  }: TambahModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

      const formSchema = Yup.object().shape({
        bankName: Yup.string().required('Nama bank tidak boleh kosong'),
        accountNumber: Yup.string().required('No. rekening tidak boleh kosong'),
        accountName: Yup.string().required('Nama tidak boleh kosong'),
      });
      const { register, handleSubmit, setValue, getValues, reset, formState: {errors, isValid} } = useForm<FormInputs>({
        resolver: yupResolver(formSchema)
      });
  
      const onSubmit: SubmitHandler<FormInputs> = (data) => {
        console.log(data);
        PaymentAccountModule.create(data).then((res: AxiosResponse) => {
            const result = res.data;
            setIsModalOpen(false);
            reset();
            if (result.code === 201) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
            handleReloadData();
        });
      }

      useEffect(() => {
        if (isModalOpen) {
            reset();
        }
      }, [isModalOpen]);
  
      return (
        <div>
          <Dialog size="xl" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                          Form Payment Account
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                          <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama Bank</FormLabel>
                                <FormInput {...register('bankName')} autoComplete='off' id="regular-form-1" type="text" placeholder="ABCXYZ" className={`${errors.bankName && "border-danger"}`} />
                                {errors.bankName && 
                                    <div className="mt-2 text-danger">
                                        {errors.bankName.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">No. Rekening</FormLabel>
                                <FormInput {...register('accountNumber')} autoComplete='off' id="regular-form-1" type="text" placeholder="Jl. ABCXXX" className={`${errors.accountNumber && "border-danger"}`} />
                                {errors.accountNumber && 
                                    <div className="mt-2 text-danger">
                                        {errors.accountNumber.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama</FormLabel>
                                <FormInput {...register('accountName')} autoComplete='off' id="regular-form-1" type="text" placeholder="081234XXXX" className={`${errors.accountName && "border-danger"}`} />
                                {errors.accountName && 
                                    <div className="mt-2 text-danger">
                                        {errors.accountName.message}
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
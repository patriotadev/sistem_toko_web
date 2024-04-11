import React, { Dispatch, SetStateAction, useState } from 'react';
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
import { AxiosResponse } from 'axios';

type TambahModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

type FormInputs = {
    description: string
    contact: string
    address: string
    city: string
}

const TambahModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
  }: TambahModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const formSchema = Yup.object().shape({
        description: Yup.string().required('Nama toko tidak boleh kosong'),
        contact: Yup.string().required('Telepon toko tidak boleh kosong'),
        address: Yup.string().required('Alamat toko tidak boleh kosong'),
        city: Yup.string().required('Kota tidak boleh kosong')
      });
      const { register, handleSubmit, setValue, reset, formState: {errors, isValid} } = useForm<FormInputs>({
        resolver: yupResolver(formSchema)
      });
  
      const onSubmit: SubmitHandler<FormInputs> = (data) => {
        if (isValid) {
            setIsSubmitLoading(true);
            console.log(data);
            const payload = data;
            TokoModule.create(payload)
            .then((res: AxiosResponse) => {
                const result = res.data;
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
      }

      console.log('open')
  
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
                          Form Tambah Toko
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                          <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama Toko</FormLabel>
                                <FormInput {...register('description')} autoComplete='off' id="regular-form-1" type="text" placeholder="Nama Toko" className={`${errors.description && "border-danger"}`} />
                                {errors.description && 
                                    <div className="mt-2 text-danger">
                                        {errors.description.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Telepon</FormLabel>
                                <FormInput {...register('contact')} id="regular-form-1" autoComplete='off' type="text" placeholder="Telepon Toko" className={`${errors.contact && "border-danger"}`} />
                                {errors.contact && 
                                    <div className="mt-2 text-danger">
                                        {errors.contact.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Kota</FormLabel>
                                <FormInput {...register('city')} id="regular-form-1" autoComplete='off' type="text" placeholder="Alamat Toko" className={`${errors.city && "border-danger"}`} />
                                {errors.city && 
                                    <div className="mt-2 text-danger">
                                        {errors.city.message}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Alamat</FormLabel>
                                <FormInput {...register('address')} id="regular-form-1" autoComplete='off' type="text" placeholder="Alamat Toko" className={`${errors.address && "border-danger"}`} />
                                {errors.address && 
                                    <div className="mt-2 text-danger">
                                        {errors.address.message}
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
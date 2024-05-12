import React, { Dispatch, SetStateAction, useState } from 'react';
import TokoModule from '../../../../modules/toko/toko';
import { useAppSelector } from '../../../../stores/hooks';
import { SelectUserInfo } from '../../../../stores/common/userInfoSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dialog } from '../../../../base-components/Headless';
import { FormInput, FormLabel } from '../../../../base-components/Form';
import Button from '../../../../base-components/Button';
import LoadingIcon from '../../../../base-components/LoadingIcon';
import { IToko } from '../../../../modules/toko/interfaces/toko.interface';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { AxiosResponse } from 'axios';

type EditModalProps = {
    handleReloadData: () => void
    initialValues: IToko
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

type FormInputs = {
    description: string
    contact: string
    address: string
    city: string
}

const EditModal = ({
    handleReloadData,
    initialValues,
    isModalOpen,
    setIsModalOpen,
  }: EditModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const formSchema = Yup.object().shape({
        description: Yup.string().required('Nama toko tidak boleh kosong.'),
        contact: Yup.string().required('Telepon toko tidak boleh kosong'),
        address: Yup.string().required('Alamat toko tidak boleh kosong')
      })
      const { register, handleSubmit, setValue, reset, formState: {errors, isValid} } = useForm<FormInputs>({
        defaultValues: {
            description: initialValues.description,
            contact: initialValues.contact,
            address: initialValues.address,
            city: initialValues.city
        },
        resolver: yupResolver(formSchema)
      });
  
      const onSubmit: SubmitHandler<FormInputs> = (data) => {
          if (isValid) {
            const payload = {
                id: initialValues.id,
                description: data.description,
                contact: data.contact,
                address: data.address,
                city: data.city
            };

            TokoModule.update(payload)
            .then((res: AxiosResponse) => {
                const result = res.data;
                if (result.code === 200) {
                    toast.success(result.message)
                } else {
                    toast.error(result.message);
                }
                handleReloadData();
                reset();
            }).catch((error) => toast.error(error.message))
            .finally(() => {
                setIsSubmitLoading(false);
                setIsModalOpen(false);
            })
      }
    }

  
      return (
          <Dialog size="lg" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                          Form Tambah Barang
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                          <div className="flex flex-col gap-4 flex-wrap">
                                <div className="w-full">
                                    <FormLabel htmlFor="regular-form-1">Nama Toko</FormLabel>
                                    <FormInput {...register('description')} id="regular-form-1" type="text" placeholder="Nama Toko"  className={`${errors.description && "border-danger"}`} />
                                    {errors.description && 
                                        <div className="mt-2 text-danger">
                                            {errors.description.message}
                                        </div>
                                    }
                                </div>
                                <div className="w-full">
                                    <FormLabel htmlFor="regular-form-1">Telepon</FormLabel>
                                    <FormInput {...register('contact')} id="regular-form-1" type="text" placeholder="Telepon Toko"  className={`${errors.contact && "border-danger"}`} />
                                    {errors.contact && 
                                        <div className="mt-2 text-danger">
                                            {errors.contact.message}
                                        </div>
                                    }
                                </div>
                                <div className="w-full">
                                    <FormLabel htmlFor="regular-form-1">Kota</FormLabel>
                                    <FormInput {...register('city')} id="regular-form-1" type="text" placeholder="Alamat Toko"  className={`${errors.city && "border-danger"}`} />
                                    {errors.city && 
                                        <div className="mt-2 text-danger">
                                            {errors.city.message}
                                        </div>
                                    }
                                </div>
                                <div className="w-full">
                                    <FormLabel htmlFor="regular-form-1">Alamat</FormLabel>
                                    <FormInput {...register('address')} id="regular-form-1" type="text" placeholder="Alamat Toko"  className={`${errors.address && "border-danger"}`} />
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
                      <Button variant="primary" type="submit" disabled={isSubmitLoading} className="w-24">
                            {isSubmitLoading ? 'Loading' : 'Simpan'}
                            {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                        </Button> 
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
          </Dialog>
      );
  };

  export default EditModal;
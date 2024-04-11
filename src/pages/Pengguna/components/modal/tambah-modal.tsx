import React, { useState, useEffect, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PenggunaModule from '../../../../modules/pengguna/pengguna';
import { useAppSelector } from "../../../../stores/hooks";
import { SelectUserInfo } from "../../../../stores/common/userInfoSlice";
import { toast, Toaster } from "react-hot-toast";
import { Dialog, Menu, Disclosure } from "../../../../base-components/Headless";
import { FormInput, FormLabel } from "../../../../base-components/Form";
import Button from "../../../../base-components/Button";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import Select, { SingleValue } from 'react-select';
import {IToko} from "../../../../modules/toko/interfaces/toko.interface";
import IRole from "../../../../modules/role/interface/role.interface";
import { RoleOptionType, TokoOptionType } from "../../types/pengguna.type";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";

type TambahModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean,
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>,
    tokoList: IToko[]
    roleList: IRole[]
}

type FormInputs = {
    id: string
    name: string
    email: string
    password: string
    roleId: string
    tokoId: string
}

const TambahModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
    tokoList,
    roleList
  }: TambahModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const formSchema = Yup.object().shape({
        name: Yup.string().required('Nama pengguna tidak boleh kosong'),
        email: Yup.string().required('Email pengguna tidak boleh kosong'),
        password: Yup.string().required('Password pengguna tidak boleh kosong'),
        roleId: Yup.string().required('Role pengguna tidak boleh kosong'),
        tokoId: Yup.string().required('Toko pengguna tidak boleh kosong'),
      });
      const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors} } = useForm<Omit<FormInputs, 'id'>>({
        resolver: yupResolver(formSchema)
      });
      const [selectedRole, setSelectedRole] = useState<SingleValue<RoleOptionType>>();
      const [selectedToko, setSelectedToko] = useState<SingleValue<TokoOptionType>>();
      const [roleOptionList, setRoleOptionList] = useState<RoleOptionType[]>([]);
      const [tokoOptionList, setTokoOptionList] = useState<TokoOptionType[]>([]);
  
      const onSubmit: SubmitHandler<Omit<FormInputs, 'id'>> = (data, event) => {
          setIsSubmitLoading(true);
          if (selectedRole && selectedToko) {
            const payload =  {
                name: data.name,
                email: data.email,
                password: data.password,
                roleId: selectedRole.value,
                tokoId: selectedToko.value
            }
            console.log(payload);
            PenggunaModule.create(payload)
            .then((res: AxiosResponse) => {
              const result = res.data;
              setIsModalOpen(false);
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
          }
      }

      useEffect(() => {
        if (isModalOpen) {
            const tokoTemp: TokoOptionType[] = [];
            tokoList.forEach((item) => {
                tokoTemp.push({
                    label: item.description,
                    value: item.id
                })
            });
            setTokoOptionList(tokoTemp);

            const roleTemp: RoleOptionType[] = [];
            roleList.forEach((item) => {
                roleTemp.push({
                    label: item.description,
                    value: item.id
                })
            });
            setRoleOptionList(roleTemp);
        }
      }, [isModalOpen]);
  
      return (
        <div>
          <Toaster/>
          <Dialog size="lg" open={isModalOpen} onClose={() => {}}>   
          <form onSubmit={handleSubmit(onSubmit)}>  
            <Dialog.Panel className="p-2">
            <Dialog.Title>
                <div className="flex justify-between flex-wrap w-full">
                  <h2 className="mr-auto text-base font-medium">
                    Tambah Pengguna
                  </h2>
                </div>
            </Dialog.Title>
            <Dialog.Description>
              <div className="flex flex-col gap-4 flex-wrap">
                <div className="w-full">
                    <FormLabel htmlFor="regular-form-1">Nama</FormLabel>
                    <FormInput {...register('name', {required: "Nama tidak boleh kosong"})} autoComplete="off" id="regular-form-1" type="text" placeholder="Nama Pengguna" className={`${errors.name && "border-danger"}`} />
                    {errors.name && 
                      <div className="mt-2 text-danger">
                          {errors.name.message}
                      </div>
                    }
                </div>
                <div className="w-full">
                    <FormLabel htmlFor="regular-form-1">Email</FormLabel>
                    <FormInput {...register('email', {required: "Tanggl Nota tidak boleh kosong"})} autoComplete="off" id="regular-form-1" type="text" placeholder='pengguna@hbpos.com' className={`${errors.email && "border-danger"}`} />
                    {errors.email && 
                      <div className="mt-2 text-danger">
                          {errors.email.message}
                      </div>
                    }
                </div>
                <div className="w-full">
                    <FormLabel htmlFor="regular-form-1">Password</FormLabel>
                    <FormInput {...register('password', {required: "Tanggl Nota tidak boleh kosong"})} autoComplete="off" id="regular-form-1" type="password" placeholder='123@Aa_./$_' className={`${errors.password && "border-danger"}`} />
                    {errors.password && 
                      <div className="mt-2 text-danger">
                          {errors.password.message}
                      </div>
                    }
                </div>
                <div className="w-full">
                    <FormLabel htmlFor="regular-form-1">Role</FormLabel>
                    <Select
                      onChange={(e: SingleValue<RoleOptionType>) => {
                        if (e) {
                          setSelectedRole(e)
                          setValue('roleId', e?.value)
                        }
                      }}
                      isSearchable
                      isClearable
                      options={roleOptionList}
                      className={`${errors.roleId && "border-danger"}`}
                    />
                    {errors.roleId && 
                      <div className="mt-2 text-danger">
                          {errors.roleId.message}
                      </div>
                    }
                </div>
                <div className="w-full">
                    <FormLabel htmlFor="regular-form-1">Lokasi / Toko</FormLabel>
                    <Select
                      onChange={(e: SingleValue<TokoOptionType>) => {
                        if (e) {
                          setSelectedToko(e)
                          setValue('tokoId', e?.value)
                        }
                      }}
                      isSearchable
                      isClearable
                      options={tokoOptionList}
                      className={`${errors.tokoId && "border-danger"}`}
                    />
                    {errors.tokoId && 
                      <div className="mt-2 text-danger">
                          {errors.tokoId.message}
                      </div>
                    }
                </div>
              </div>
            </Dialog.Description>
              <Dialog.Footer>
                <Button type="button" variant="secondary" onClick={()=> setIsModalOpen(false)}
                className="w-20 mr-2"
                >
                  Batal
                </Button>
                <Button variant="primary" type="submit" className="w-20">
                    Simpan
                    {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                </Button> 
              </Dialog.Footer>
            </Dialog.Panel>
              </form>
          </Dialog>
        </div>
      );
}

export default TambahModal;
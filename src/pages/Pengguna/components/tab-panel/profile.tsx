import React, { SetStateAction, useEffect } from 'react'
import { Tab } from '../../../../base-components/Headless'
import PenggunaModule from "../../../../modules/pengguna/pengguna";
import { FormInput, FormLabel } from '../../../../base-components/Form'
import Select, { SingleValue } from 'react-select';
import Button from '../../../../base-components/Button';
import Lucide from '../../../../base-components/Lucide';
import { IPengguna, PenggunaPayload } from "../../../../modules/pengguna/interfaces/pengguna.interface";
import { RoleOptionType, TokoOptionType } from '../../types/pengguna.type';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosResponse } from 'axios';

type ProfilTabPanelProps = {
    user: IPengguna
    selectedRole: SingleValue<RoleOptionType> | undefined
    setSelectedRole: React.Dispatch<SetStateAction<SingleValue<RoleOptionType> | undefined>>
    selectedToko: SingleValue<TokoOptionType> | undefined
    setSelectedToko: React.Dispatch<SetStateAction<SingleValue<TokoOptionType> | undefined>>
    roleOptionList: RoleOptionType[] | undefined
    tokoOptionList: TokoOptionType[] | undefined
}

type ProfileInputs = {
    name: string,
    roleId: string,
    tokoId: string,
}

const ProfileTabPanel = (dt: ProfilTabPanelProps) => {
  const {
    user,
    selectedRole,
    setSelectedRole,
    selectedToko,
    setSelectedToko,
    roleOptionList,
    tokoOptionList,
  } = dt;

  const formSchema = Yup.object().shape({
    name: Yup.string().required('Nama pengguna tidak boleh kosong'),
    roleId: Yup.string().required('Role pengguna tidak boleh kosong'),
    tokoId: Yup.string().required('Toko pengguna tidak boleh kosong'),
  });
  const { register, getValues, setValue, handleSubmit, formState: {errors} } = useForm<ProfileInputs>({
    defaultValues: {
        name: user?.name,
        roleId: user?.role.id,
        tokoId: user?.toko.id
    },
    resolver: yupResolver(formSchema)
  })

  const onSubmit: SubmitHandler<ProfileInputs> = (data) => {
    const payload = {
        id: user.id,
        name: data.name,
        email: user.email,
        password: user.password,
        roleId: data.roleId,
        tokoId: data.tokoId,
    };
    PenggunaModule.update<PenggunaPayload>(payload)
    .then((res: AxiosResponse) => {
        const result = res.data;
        if (result.code === 200) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    })
  }

  return (
    <div>
        <Toaster/>
        <Tab.Panels className="mt-5 intro-y">
        <Tab.Panel>
            {/* BEGIN: Personal Information */}
        <div className="mt-5 intro-y box w-full lg:w-1/2">
        <div className="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium">
            Personal Information
            </h2>
        </div>
        <div className="p-5">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5">
                <div className="col-span-12 xl:col-span-6">
                    <div>
                        <FormLabel htmlFor="update-profile-form-7">Nama</FormLabel>
                        <FormInput
                            autoComplete="off"
                            id="update-profile-form-7"
                            type="text"
                            placeholder="Nama Pengguna"
                            {...register('name', {required: 'Nama Pengguna tidak boleh kosong'})}
                            className={`${errors.name && "border-danger"}`}
                        />
                        {errors.name && 
                            <div className="mt-2 text-danger">
                                {errors.name.message}
                            </div>
                        }
                    </div>
                    <div className="mt-3">
                    <FormLabel htmlFor="update-profile-form-8">
                        Role
                    </FormLabel>
                    <Select
                        value={selectedRole}
                        onChange={(e) => {
                            setSelectedRole(e)
                            if (e) {
                                setValue('roleId', e?.value);
                            }
                        } }
                        options={roleOptionList}
                    />
                    {errors.roleId && 
                        <div className="mt-2 text-danger">
                            {errors.roleId.message}
                        </div>
                    }
                    </div>
                    <div className="mt-3">
                        <FormLabel htmlFor="update-profile-form-8">
                            Toko
                        </FormLabel>
                        <Select
                            value={selectedToko}
                            onChange={(e) => {
                                setSelectedToko(e);
                                if (e) {
                                    setValue('tokoId', e?.value);
                                }
                            }}
                            options={tokoOptionList}
                        />
                        {errors.tokoId && 
                            <div className="mt-2 text-danger">
                                {errors.tokoId.message}
                            </div>
                        }
                    </div>
                </div>
                </div>
                <div className="flex justify-end mt-4">
                <Button
                    variant="primary"
                    type="submit"
                    className="w-20 mr-auto"
                >
                    Simpan
                </Button>
                <a href="" className="flex items-center text-danger">
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                    Account
                </a>
                </div>
            </form>
            </div>
        </div>
        {/* END: Personal Information */}
        </Tab.Panel>
        </Tab.Panels>
    </div>
  )
}

export default ProfileTabPanel
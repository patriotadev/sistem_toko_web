import React from 'react'
import PenggunaModule from "../../../../modules/pengguna/pengguna";
import { Tab } from '../../../../base-components/Headless'
import { FormInput, FormLabel } from '../../../../base-components/Form'
import Button from '../../../../base-components/Button'
import { IPengguna, UpdatePasswordPayload } from '../../../../modules/pengguna/interfaces/pengguna.interface'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import { AxiosResponse } from 'axios';

type AccountTabPanelProps = {
    user: IPengguna
}

type AccountInputs = {
    oldPassword: string
    newPassword: string
    confNewPassword: string
}

const AccountTabPanel = (dt: AccountTabPanelProps) => {
  const { user } = dt;
  const formSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Password lama tidak boleh kosong'),
    newPassword: Yup.string().required('Password baru tidak boleh kosong').min(6, 'Password baru tidak boleh kurang dari 6 karakter'),
    confNewPassword: Yup.string().required('Konfirmasi password baru tidak boleh kosong').oneOf([Yup.ref("newPassword")], "Konfirmasi password tidak sesuai")
  });

  const { register, getValues, setValue, handleSubmit, formState: {errors, isValid} } = useForm<AccountInputs>({
    resolver: yupResolver(formSchema)
  });
  const onSubmit: SubmitHandler<AccountInputs> = (data) => {
    if (isValid) {
        console.log(data);
        const payload = {
            id: user.id,
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        };
        PenggunaModule.update<UpdatePasswordPayload>(payload)
        .then((res: AxiosResponse) => {
            const result = res.data;
            if (result.code === 200) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        })
    }
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
                Account Information
              </h2>
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-x-5">
                <div className="col-span-12 xl:col-span-6">
                  <div>
                    <FormLabel htmlFor="update-profile-form-6">Username</FormLabel>
                    <FormInput
                      autoComplete="off"
                      id="update-profile-form-6"
                      type="text"
                      placeholder="U00xx"
                      value={user?.email}
                      disabled
                    />
                  </div>
                  <div className="mt-3">
                    <FormLabel htmlFor="update-profile-form-10">
                      Password Lama
                    </FormLabel>
                    <FormInput
                      autoComplete="off"
                      id="update-profile-form-10"
                      type="password"
                      placeholder="123@Aa_./$_"
                      className={`${errors.oldPassword && "border-danger"}`}
                      {...register('oldPassword', {required: "Password lama tidak boleh kosong"})}
                    />
                    {errors.oldPassword && 
                        <div className="mt-2 text-danger">
                            {errors.oldPassword.message}
                        </div>
                    }
                  </div>
                  <div className="mt-3">
                    <FormLabel htmlFor="update-profile-form-11">
                      Password Baru
                    </FormLabel>
                    <FormInput
                      autoComplete="off"
                      id="update-profile-form-11"
                      type="password"
                      placeholder="123@Aa_./$_"
                      className={`${errors.newPassword && "border-danger"}`}
                      {...register('newPassword', {required: "Password baru tidak boleh kosong"})}
                    />
                        {errors.newPassword && 
                            <div className="mt-2 text-danger">
                                {errors.newPassword.message}
                            </div>
                        }
                  </div>
                  <div className="mt-3">
                    <FormLabel htmlFor="update-profile-form-11">
                      Konfirmasi Password Baru
                    </FormLabel>
                    <FormInput
                      autoComplete="off"
                      id="update-profile-form-11"
                      type="password"
                      placeholder="123@Aa_./$_"
                      className={`${errors.confNewPassword && "border-danger"}`}
                      {...register('confNewPassword', {required: "Konfirmasi Password baru tidak sesuai", validate: value => value === getValues('newPassword')})}
                    />
                        {errors.confNewPassword && 
                            <div className="mt-2 text-danger">
                                {errors.confNewPassword.message}
                            </div>
                        }
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 w-full">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-20 mr-auto"
                >
                  Update
                </Button>
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

export default AccountTabPanel
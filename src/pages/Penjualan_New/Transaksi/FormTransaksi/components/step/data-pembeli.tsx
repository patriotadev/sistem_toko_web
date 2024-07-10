
import { FormCheck, FormInput, FormLabel } from '../../../../../../base-components/Form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../../../../../base-components/Button';
import Lucide from '../../../../../../base-components/Lucide';
import { Dispatch, SetStateAction, useState } from 'react';
import Select from 'react-select';

type FormInputs = {
  namaPelanggan: string
  alamatPelanggan: string
  kontakPelanggan: string
}

type PropsType = {
  handleNextStep: () => void
}

const DataPembeli = ({handleNextStep}: PropsType) => {
  const [isPelanggan, setIsPelanggan] = useState<boolean>(false);
  const [isDeposit, setIsDeposit] = useState<boolean>(false);

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
    if (isValid) {
      handleNextStep()
    }
  } 

  return (
    <div className='bg-slate-50 rounded-md p-2 shadow mt-10'>
        <h4 className="text-lg font-medium intro-y border-b p-2">Data Pembeli</h4>
        <div className='mt-8 p-2'>
            <div className='flex gap-4'>
              <FormCheck className="mb-5 flex justify-end">
                  <FormCheck.Input id="vertical-form-3" type="checkbox" value="" checked={isPelanggan} onChange={() => setIsPelanggan(!isPelanggan)} />
                  <FormCheck.Label htmlFor="vertical-form-3">
                      Pelanggan
                  </FormCheck.Label>
              </FormCheck>
              <FormCheck className="mb-5 flex justify-end">
                  <FormCheck.Input id="vertical-form-3" type="checkbox" value="" checked={isDeposit} onChange={() => setIsDeposit(!isDeposit)} />
                  <FormCheck.Label htmlFor="vertical-form-3">
                      Deposit
                  </FormCheck.Label>
              </FormCheck>
            </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                {
                  isPelanggan ?  
                  <div className="w-full pt-5">
                    <FormLabel htmlFor="regular-form-1">Pilih Pelanggan</FormLabel>
                    <Select />
                    {errors.namaPelanggan && 
                        <div className="mt-2 text-danger">
                            {errors.namaPelanggan.message}
                        </div>
                    }
                  </div>
                  : <div className='flex flex-col gap-4 flex-wrap pt-5'>
                    <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Nama Pembeli</FormLabel>
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
                  </div>
                }
                <div className='flex justify-end mt-10'>
                  <Button variant='primary'><Lucide icon="ArrowBigRight" type='submit' className="w-4 h-4 mr-2" />{" "}Lanjut</Button>
                </div>
            </div>
              </form>
        </div>
      </div>
  )
}

export default DataPembeli
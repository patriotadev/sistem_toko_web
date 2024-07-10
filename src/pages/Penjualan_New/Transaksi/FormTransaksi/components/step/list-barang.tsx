
import { FormInput, FormLabel } from '../../../../../../base-components/Form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import Button from '../../../../../../base-components/Button';
import Lucide from '../../../../../../base-components/Lucide';
import { Disclosure } from '../../../../../../base-components/Headless';
import Select from 'react-select';
import { thousandLimiter } from '../../../../../../helpers/helper';

type FormInputs = {
  namaPelanggan: string
  alamatPelanggan: string
  kontakPelanggan: string
}

type PropsType = {
    handleNextStep: () => void
    handlePrevStep: () => void
}

const ListBarang = ({ handleNextStep, handlePrevStep }: PropsType) => {
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
    handleNextStep();
  } 

  return (
    <div className='bg-slate-50 rounded-md p-2 shadow mt-10'>
        <h4 className="text-lg font-medium intro-y border-b p-2">List Barang</h4>
        <div className='mt-8 p-2'>
              <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                    {barangList.map((el, i) => (
                        <Disclosure id={el}>
                        <Disclosure.Button>
                        Barang {i+1}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                        <div className="flex flex-col gap-2 flex-wrap">
                            <div className="w-full">
                                <FormLabel>Nama</FormLabel>
                                {/* <FormInput {...register(`nama.${i}.values`, {required: 'Nama barang tidak boleh kosong'})} type="text" placeholder="Nama Barang" /> */}
                                <Select
                                isClearable
                                isSearchable
                                value={getValues(`selectedBarang.${i}.values`)}
                                onChange={(e) => {
                                    setValue(`selectedBarang.${i}.values`, e);
                                    setValue(`nama.${i}.values`, e?.label);
                                    setValue(`kode.${i}.values`, e?.kode);
                                    setValue(`qty.${i}.values`, e?.qty);
                                    setValue(`satuan.${i}.values`, e?.satuan);
                                    setValue(`harga.${i}.values`, e?.harga);
                                    setValue(`stokBarangId.${i}.values`, e?.stokBarangId);
                                }}
                                required
                                options={stokOptionList}
                                />
                            </div>
                            <div className="w-full">
                                <FormLabel>Qty</FormLabel>
                                <FormInput {...register(`qty.${i}.values`, {required: 'Jumlah barang tidak boleh kosong'})} value={getValues(`qty.${i}.values`)} min='1' type="number" placeholder="0" required />
                            </div>
                            <div className="w-full">
                                <FormLabel>Satuan</FormLabel>
                                <FormInput {...register(`satuan.${i}.values`, {required: 'Satuan barang tidak boleh kosong'})} value={getValues(`satuan.${i}.values`)} type="text" placeholder="Ex: Pcs, Kg, Liter" required />
                            </div>
                            <div className="w-full">
                                <FormLabel>Harga</FormLabel>
                                <FormInput {...register(`harga.${i}.values`, {required: 'Harga barang tidak boleh kosong'})} value={getValues(`harga.${i}.values`)} min='0' type="number" placeholder="Rp. 0" required />
                            </div>
                            <div className="w-full">
                                <FormLabel>Diskon</FormLabel>
                                <FormInput {...register(`discount.${i}.values`)} value={getValues(`discount.${i}.values`)} min='0' type="number" placeholder="Rp. 0" />
                            </div>
                            <div className="w-full flex flex-col items-end mt-6">
                                <FormLabel className="font-semibold">Total Harga</FormLabel>
                                {getValues(`discount.${i}.values`) && getValues(`discount.${i}.values`) !== '0' ?
                                <span className="text-danger text-xs mb-4">
                                    - Discount ({thousandLimiter(Number(getValues(`discount.${i}.values`)), 'Rp')})
                                </span>
                                : ''
                                }
                                {
                                getValues(`qty.${i}.values`) !== '0' && getValues(`harga.${i}.values`) !== '0' ?
                                <span>
                                    {thousandLimiter(Number(Number(getValues(`qty.${i}.values`)) * Number(getValues(`harga.${i}.values`)) - Number(getValues(`discount.${i}.values`))), 'Rp')}
                                </span>
                                : '0'
                                }
                            </div>
                        </div>
                        </Disclosure.Panel>
                    </Disclosure>
                    ))}
                    <div className="flex justify-start mt-4">
                        <Button type="button" size="sm" variant="outline-danger" onClick={()=> {
                        const confirmation = confirm('Apakah anda yakin ingin reset form barang?')
                        if (confirmation) {
                            setBarangList(['barang_1']);
                            reset();
                        }
                        }}
                        className="w-22 mr-2"
                        >
                        <Lucide icon="RefreshCcw" className="w-4 h-4 mr-2" />
                        Reset
                        </Button>
                        <Button type="button" size="sm" variant="outline-primary" onClick={()=> {
                        const listCount = barangList.length;
                        const newEl = `barang_${listCount + 1}`
                        setBarangList(prev => [...prev, newEl]);
                        }}
                        className="w-22 mr-1"
                        >
                        <Lucide icon="ListPlus" className="w-4 h-4 mr-2" />
                        Tambah Barang
                        </Button>
                    </div>
                    </div>
              </form>
        </div>
      </div>
  )
}

export default ListBarang
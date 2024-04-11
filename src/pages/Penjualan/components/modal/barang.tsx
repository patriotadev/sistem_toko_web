import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TokoModule from '../../../../modules/toko/toko';
import StokModule from '../../../../modules/stok/stok';
import { useAppSelector } from '../../../../stores/hooks';
import { SelectUserInfo } from '../../../../stores/common/userInfoSlice';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Dialog, Disclosure } from '../../../../base-components/Headless';
import { FormInput, FormLabel } from '../../../../base-components/Form';
import Button from '../../../../base-components/Button';
import LoadingIcon from '../../../../base-components/LoadingIcon';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import Select, { SingleValue } from 'react-select';
import { StokOptionType, TokoOptionType } from '../../types/penjualan.type';
import { thousandLimiter } from '../../../../helpers/helper';
import Lucide from '../../../../base-components/Lucide';
import { IStok } from '../../../../modules/stok/interfaces/stok.interface';
import PreviewModal from './preview';
import Stepper from '../stepper/stepper';
import { AxiosResponse } from 'axios';

type BarangModalProps = {
    handleReloadData: () => void
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    isPembayaranOpen: boolean
    setIsPembayaranOpen: Dispatch<SetStateAction<boolean>>
    isTambahOpen: boolean
    setIsTambahOpen: Dispatch<SetStateAction<boolean>>
    barangData: any
    setBarangData: Dispatch<SetStateAction<any>>
    step: number,
    setStep: Dispatch<SetStateAction<number>>
}

type FormInputs = {
    nama: []
    qty: []
    satuan: []
    discount: []
    harga: []
    jumlahHarga: []
}

const BarangModal = ({
    handleReloadData,
    isModalOpen,
    setIsModalOpen,
    isPembayaranOpen,
    setIsPembayaranOpen,
    isTambahOpen,
    setIsTambahOpen,
    barangData,
    setBarangData,
    step,
    setStep
  }: BarangModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const [selectedToko, setSelectedToko] = useState<SingleValue<TokoOptionType>>();
      const [stokOptionList, setStokOptionList] = useState<StokOptionType[]>([]);
      const [barangList, setBarangList] = useState<string[]>(['barang_1']);
      const formSchema = Yup.object().shape({
        namaPelanggan: Yup.string().required('Nama pelanggan tidak boleh kosong'),
        alamatPelanggan: Yup.string().required('Alamat pelanggan tidak boleh kosong'),
        kontakPelanggan: Yup.string().required('Kontak pelanggan tidak boleh kosong'),
        tokoId: Yup.string().required('Lokasi toko tidak boleh kosong'),
      });
      const { register, handleSubmit, setValue, getValues, reset, formState: {errors, isValid}, watch } = useForm<any>();

      const fetchStokData = (search: string | undefined, page: number, perPage: number, tokoId: string) => {
        const params: any = {
            search,
            page,
            perPage,
            tokoId
        };

        StokModule.get(params)
        .then((res: AxiosResponse) => {
            const result = res.data;
            const temp: StokOptionType[] = [];
            console.log('tes')
            result.data.map((item: IStok) => temp.push({
                label: item.nama,
                value: item.id,
                harga: item.hargaJual,
                satuan: item.satuan,
                qty: item.jumlah,
                kode: item.kode,
                stokBarangId: item.id
            }));
            setStokOptionList(temp);
        })
      };
  
      const onSubmit: SubmitHandler<any> = (data) => {
            setStep(3);
            const valueData: any = [];
            for (let index = 0; index < barangList.length; index++) {
            valueData.push({
                kode: data.kode[index].values,
                nama: data.nama[index].values,
                qty: Number(data.qty[index].values),
                satuan: data.satuan[index].values,
                harga: Number(data.harga[index].values),
                discount: Number(data.discount[index].values),
                stokBarangId: data.stokBarangId[index].values,
                jumlahHarga: Number(Number(data.qty[index].values) * Number(data.harga[index].values) - Number(data.discount[index].values)),
                createdBy: userInfo.name,
            });
            }
            console.log(valueData);
            setBarangData(valueData as any[]);
            setIsModalOpen(false);
            setIsPembayaranOpen(true);
      }

      watch('qty');
      watch('harga');
      watch('discount');

      useEffect(() => {
        fetchStokData(undefined, 1, 1000, 'all');
      }, []);
  
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
                          Form Tambah Barang
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                  <Stepper step={step} />
                  <Disclosure.Group variant="boxed">
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
                                options={stokOptionList}
                                />
                            </div>
                            {/* <div className="w-full">
                                <FormLabel>Kode</FormLabel>
                                <FormInput {...register(`kode.${i}.values`, {required: 'Kode barang tidak boleh kosong'})} type="text" placeholder="Kode Barang" />
                            </div> */}
                            <div className="w-full">
                                <FormLabel>Qty</FormLabel>
                                <FormInput {...register(`qty.${i}.values`, {required: 'Jumlah barang tidak boleh kosong'})} value={getValues(`qty.${i}.values`)} min='0' type="number" placeholder="0" />
                            </div>
                            <div className="w-full">
                                <FormLabel>Satuan</FormLabel>
                                <FormInput {...register(`satuan.${i}.values`, {required: 'Satuan barang tidak boleh kosong'})} value={getValues(`satuan.${i}.values`)} type="text" placeholder="Ex: Pcs, Kg, Liter" />
                            </div>
                            <div className="w-full">
                                <FormLabel>Harga</FormLabel>
                                <FormInput {...register(`harga.${i}.values`, {required: 'Harga barang tidak boleh kosong'})} value={getValues(`harga.${i}.values`)} min='0' type="number" placeholder="Rp. 0" />
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
                </Disclosure.Group>
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="outline-secondary" onClick={()=> {
                          setStep(1);
                          setIsModalOpen(false);
                          setIsTambahOpen(true);
                      }}
                      className="w-20 mr-1"
                      >
                          Kembali
                      </Button>
                      <Button variant="primary" type="submit" className="w-20">
                          Lanjut
                          {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                      </Button>
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
          </Dialog>
        </div>
      );
  };

  export default BarangModal;
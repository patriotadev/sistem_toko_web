import _, { initial, values } from "lodash";
import clsx from "clsx";
import { useState, useRef, SetStateAction, ChangeEvent, useEffect, MutableRefObject, RefObject, useMemo, JSXElementConstructor, ReactElement, ReactNode, MouseEventHandler } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormCheck, FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu, Disclosure } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { FormLabel, FormHelp } from "../../base-components/Form";
import { FieldErrors, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import PoModule from '../../modules/po/po';
import PtModule from '../../modules/pt/pt';
import ProjectModule from '../../modules/project/project';
import StokModule from '../../modules/stok/stok';
import {IToko} from '../../modules/toko/interfaces/toko.interface';
import TokoModule from '../../modules/toko/toko';
import toast, { Toaster } from "react-hot-toast";
import { IStok } from "../../modules/stok/interfaces/stok.interface";
import { thousandLimiter } from '../../helpers/helper';
import LoadingIcon from "../../base-components/LoadingIcon";
import PaginationCustom from "../../components/Custom/PaginationCustom";
import { Search } from "react-router-dom";
import { IProject } from "../../modules/project/interfaces/project.interface";
import { IFetchQuery, IPt } from "../../modules/pt/interfaces/pt.interface";
import { BarangPoPayload, IBarangPo, IPo, IFetchQuery as IPoFetchQuery, PoPayload } from "../../modules/po/interfaces/po.interface";
import moment from "moment";
import { Icon } from "leaflet";
import Select from 'react-select/creatable';
import { SingleValue } from "react-select";
import { StatusPo } from "../../modules/po/enum/po.enum";
import { useAppSelector } from "../../stores/hooks";
import { SelectUserInfo } from "../../stores/common/userInfoSlice";
import { APPROVAL_OPTION } from "./const/approval-option";
import { PEMBAYARAN_OPTION } from "./const/pembayaran-option";
import { METODE_PEMBAYARAN } from "./enum/po.enum";
import CurrencyInput from "react-currency-input-field";
import FormInputCurrency from "../../components/Custom/FormInputCurrency";
import { AxiosResponse } from "axios";
import { nanoid } from 'nanoid';
import StokStatus from '../Stok/enum/tab.enum';
import TabStatus from "../Stok/enum/tab.enum";
import Badge from "../../components/Custom/Badge";
import { PO_STATUS_OPTION } from "./const/po-status-option";
import Litepicker from "../../base-components/Litepicker";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { ISuratJalanPo } from "../../modules/surat-jalan-po/interfaces/surat-jalan-po.interface";
import TippyContent from "../../base-components/TippyContent";

type TambahPoModalProps = {
    handleReloadStok: () => void
    ptList: any[]
    stokList: IStok[]
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    isUpdate: boolean
    setIsUpdate: React.Dispatch<SetStateAction<boolean>>
}

type ViewDetailModalProps = {
  initialValues: IPo,
  isDetailModalOpen: boolean
  setIsDetailModalOpen: React.Dispatch<SetStateAction<boolean>>
  handleReloadStok: () => void
}

type EditBarangModalProps = {
  handleReloadStok: () => void,
  ptList: IPt[],
  initialValues: IPo,
  isEditModalOpen: boolean
  setIsEditModalOpen: React.Dispatch<SetStateAction<boolean>>
}

type DeleteConfirmationModalProps = {
  handleReloadStok: () => void
  deleteConfirmationModal: boolean
  deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
  setDeleteConfirmationModal: React.Dispatch<SetStateAction<boolean>>
  initialValues: IPo,
}

type ActionButtonsProps = {
  handleReloadStok: () => void,
  initialValues: IPo,
  ptList: IPt[],
  projectList: IProject[],
  stokList: IStok[],
}

type PoInputs = {
    id: string
    noPo: string
    tanggal: string
    jatuhTempo: number
    ptId: string
    projectId: string
    createdBy: string
    jumlahBayar?: number,
    totalPembayaran?: number,
    updatedBy?: string
    barangPo: IBarangPo[]
}

type BarangPoInputs = {
    [x: string]: any
}

type BarangModalProps = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  barangPoList: BarangPoInputs[]
  stokList: IStok[]
  setBarangPoList: React.Dispatch<SetStateAction<BarangPoInputs[]>>
  stokPoList: any
  setStokPoList: React.Dispatch<SetStateAction<any>>
  step: number
  setStep: React.Dispatch<SetStateAction<number>>
}

type StokOptionsProps = {
  label: string | undefined
  value: string | undefined,
  satuan: string | undefined,
  harga: number | undefined,
  qty: number | undefined,
  stokBarangId: string | undefined,
  isDisabled?: boolean
}

type OptionsProps = {
  label: string | undefined
  value: string | undefined
}

const BarangPoModal = ({
  isOpen,
  setIsOpen,
  barangPoList,
  setBarangPoList,
  stokList,
  stokPoList,
  setStokPoList,
  step,
  setStep
}: BarangModalProps) => {
  const userInfo = useAppSelector(SelectUserInfo);
  const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors}, setError } = useForm<any>();
  const [barangList, setBarangList] = useState<string[]>(['barang_1']);
  const [stokOptions, setStokOptions] = useState<StokOptionsProps[]>([]);
  const typedErrors = errors as { [key: string]: any };
  const onSubmit: SubmitHandler<BarangPoInputs> = (data) => {
    setStep(3)
    const valueData: BarangPoInputs = [];
    const stokPo = [];
    for (let index = 0; index < barangList.length; index++) {
      // if (getValues(`nama.${index}.values`) === undefined) {
      //   console.log('nama kosonggg');
      //   setError(`nama.${index}.values`, { type: 'manual', message: 'Nama barang tidak boleh kosong' });
      // }
      const tempStokId: string = nanoid();
      if (data.stokBarangId[index].values === undefined || data.stokQty[index].values < data.qty[index].values) {
        stokPo.push({
          kode: data.kode[index].values,
          nama: data.nama[index].values,
          jumlah: 0,
          isPo: true,
          jumlahPo: data.stokQty[index].values ? Number(data.qty[index].values) - Number(data.stokQty[index].values) :  Number(data.qty[index].values),
          satuan: data.satuan[index].values,
          hargaJual: Number(data.harga[index].values),
          createdBy: userInfo.name,
          tokoId: userInfo.tokoId,
          tempStokId: data.stokBarangId[index].values ? data.stokBarangId[index].values : tempStokId,
        });
      }

      valueData.push({
        kode: data.kode[index].values,
        nama: data.nama[index].values,
        qty: Number(data.qty[index].values),
        satuan: data.satuan[index].values,
        harga: Number(data.harga[index].values),
        discount: data?.discount && Number(data?.discount[index]?.values) || 0,
        stokBarangId: data.stokBarangId[index].values ? data.stokBarangId[index].values : tempStokId,
        jumlahHarga: Number((Number(data.qty[index].values) * Number(data.harga[index].values)) - (data?.discount && Number(data?.discount[index]?.values) || 0)),
        createdBy: userInfo.name,
      });
    }

    setBarangPoList(valueData as BarangPoInputs[]);
    setStokPoList(stokPo);
    setIsOpen(false);
  }

  useEffect(() => {
    if (barangPoList.length < 1) {
      setBarangList(['barang_1']);
      reset();
    }
  }, [barangPoList])

  useEffect(() => {
    const optionsList: StokOptionsProps[] = [];
    stokList.map((item) => {
      optionsList.push({
        label: `${item?.nama}`,
        value: item?.kode,
        satuan: item?.satuan,
        harga: item?.hargaJual,
        qty: item?.jumlah,
        stokBarangId: item?.id
      });
    });
    setStokOptions(optionsList);
  }, [isOpen]);


  watch('qty');
  watch('harga');
  watch('discount');

  return (
    <div>
      <Dialog size="xl" open={isOpen} onClose={() => {}}>
        <Dialog.Panel className='p-2'>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Title>
            <div className="flex justify-between flex-wrap w-full">
              <h2 className="mr-auto text-base font-medium">
                Barang PO
              </h2>
            </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="relative mb-8 before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-start px-5 sm:px-20">
              <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
                <Button className="w-8 h-8 rounded-full  text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                  1
                </Button>
                <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto  text-slate-600 dark:text-slate-400">
                  Detail PO
                </div>
              </div>
              <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                <Button variant="primary" className="w-8 h-8 rounded-full">
                  2
                </Button>
                <div className="ml-3 text-base font-medium lg:w-32 lg:mt-3 lg:mx-auto">
                  Barang PO
                </div>
              </div>
              <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                <Button className="w-8 h-8 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                  3
                </Button>
                <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                  Review
                </div>
              </div>
              </div>
            <Disclosure.Group variant="boxed">
                <div>
                  {barangList.map((el, i: number) => (
                    <Disclosure id={el}>
                    <Disclosure.Button>
                      Barang {i+1}
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="flex flex-col gap-2 flex-wrap">
                        <div className="w-full">
                            <FormLabel>Nama</FormLabel>
                            <Select
                              isClearable
                              isSearchable
                              value={getValues(`selectedBarang.${i}.values`)}
                              required
                              onChange={(e) => {
                                setValue(`selectedBarang.${i}.values`, e);
                                setValue(`nama.${i}.values`, e?.label);
                                setValue(`kode.${i}.values`, e?.value);
                                setValue(`stokQty.${i}.values`, e?.qty);
                                // setValue(`qty.${i}.values`, e?.qty);
                                setValue(`satuan.${i}.values`, e?.satuan);
                                // setValue(`harga.${i}.values`, e?.harga);
                                setValue(`stokBarangId.${i}.values`, e?.stokBarangId);
                              }}
                              options={stokOptions}
                            />
                        </div>
                        <div className="w-full">
                            <FormLabel>Qty</FormLabel>
                            <FormInputCurrency
                              value={getValues(`qty.${i}.values`)}
                              onValueChange={(value: string | undefined) => setValue(`qty.${i}.values`, value)}
                              groupSeparator="."
                              decimalSeparator=","
                              required
                            />
                        </div>
                        <div className="w-full">
                            <FormLabel>Satuan</FormLabel>
                            <FormInput {...register(`satuan.${i}.values`, {required: 'Satuan barang tidak boleh kosong'})} type="text" placeholder="Ex: Pcs, Kg, Liter" required />
                        </div>
                        <div className="w-full">
                            <FormLabel>Harga</FormLabel>
                            <FormInputCurrency
                              prefix="Rp. "
                              value={getValues(`harga.${i}.values`)}
                              onValueChange={(value: string | undefined) => setValue(`harga.${i}.values`, value)}
                              groupSeparator="."
                              decimalSeparator=","
                              required
                            />
                        </div>
                        {/* <div className="w-full">
                            <FormLabel>Diskon</FormLabel>
                            <FormInputCurrency
                              prefix="Rp. "
                              value={getValues(`discount.${i}.values`)}
                              onValueChange={(value: string | undefined) => setValue(`discount.${i}.values`, value)}
                              groupSeparator="."
                              decimalSeparator=","
                            />
                        </div> */}
                        <div className="w-full flex flex-col items-end mt-6">
                            <FormLabel className="font-semibold">Total Harga</FormLabel>
                            {getValues(`discount.${i}.values`) && getValues(`discount.${i}.values`) !== '0' ?
                              <span className="text-danger text-xs mb-4">
                                - Discount ({thousandLimiter(Number(getValues(`discount.${i}.values`)), 'Rp')})
                              </span>
                              : ''
                            }
                            {
                              getValues(`qty.${i}.values`) > 0 && getValues(`harga.${i}.values`) > 0 ?
                              <span>
                                {thousandLimiter((getValues(`qty.${i}.values`) * getValues(`harga.${i}.values`)) - (getValues(`discount.${i}.values`) ? Number(getValues(`discount.${i}.values`)) : 0), 'Rp')}
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
            <Button type="button" variant="secondary" onClick={()=> {
                setIsOpen(false);
                setStep(1);
              }}
                className="w-22 mr-1"
              >
              Kembali
            </Button>
            <Button variant="primary" type="submit" className="w-20">
              Lanjut
            </Button>   
          </Dialog.Footer>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

const TambahPoModal = ({
  handleReloadStok,
  ptList,
  stokList,
  isModalOpen,
  setIsModalOpen,
}: TambahPoModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const formSchema = Yup.object().shape({
      noPo: Yup.string().required('Nomor Po tidak boleh kosong'),
      tanggal: Yup.string().required('Tanggal tidak boleh kosong'),
      ptId: Yup.string().required('PT tidak boleh kosong'),
      projectId: Yup.string().required('Project tidak boleh kosong'),
    });
    const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors} } = useForm<Omit<PoInputs, 'id'>>({
      resolver: yupResolver(formSchema)
    });
    const [selectedPt, setSelectedPt] = useState<string|undefined>()
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const [isBarangModalOpen, setIsBarangModalOpen] = useState<boolean>(false);
    const [barangPoList, setBarangPoList] = useState<BarangPoInputs[]>([]);
    const [stokPoList, setStokPoList] = useState<any>([]);
    const [step, setStep] = useState<number>(1);

    const onSubmit: SubmitHandler<Omit<PoInputs, 'id'>> = (data, event) => {
      if (step === 1) {
          setIsBarangModalOpen(true);
          setStep(2)
        } else if (step === 3) {
          setIsSubmitLoading(true);
          let totalBayar: number = 0;
          barangPoList.map((item: any) => totalBayar += Number(item.jumlahHarga));
          data.createdBy = userInfo.name;
          const po =  {
              noPo: data.noPo,
              tanggal: new Date(data.tanggal),
              jatuhTempo: data.jatuhTempo,
              ptId: data.ptId,
              projectId: data.projectId,
              createdBy: data.createdBy
          }
          const barangPo = barangPoList;
          const stokPo = stokPoList;
          const pembayaran = {
            metodePembayaran: METODE_PEMBAYARAN.CICILAN,
            totalPembayaran: totalBayar,
            jumlahBayar: 0,
            isApprove: false,
            createdAt: new Date(),
            createdBy: userInfo.name
          }
  
          const payload = {po, barangPo, stokPo, pembayaran}
          console.log(payload, ">>> payload");
          PoModule.create(payload)
          .then((res: AxiosResponse) => {
            const result = res.data;
            setIsModalOpen(false);
            setBarangPoList([]);
            reset();
            setSelectedPt(undefined);
            setStep(1);
            if (result.code === 201) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }
            handleReloadStok();
          })
          .catch((e) => {
            const errResponse = e?.response?.data as {[key: string]: any};
            console.log(errResponse);
            if (errResponse.error.prismaErrorCode === 'P2002' && errResponse.error.prismaErrorMeta.target.includes('noPo')) {
              alert('No. PO sudah terdaftar pada sistem. Silahkan input No. PO lain');
            }
            toast.error('Failed, Error while process data.');
          })
          .finally(() => setIsSubmitLoading(false));
        }
    }

    const fetchProjectData = (search: string | undefined, page: number, perPage: number, ptId: string) => {
      const params = {
          search,
          page,
          perPage,
          ptId
      }
      ProjectModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setProjectList(result.data);
      });
    }

    useEffect(() => {
      fetchProjectData("", 1, 1000, getValues('ptId'));
    }, [selectedPt]);

    useEffect(() => {
      if (isBarangModalOpen) {
        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
      }
    }, [isBarangModalOpen]);

    useEffect(() => {
      setIsModalOpen(false);
    }, []);

    return (
      <div>
        <Toaster/>
        <BarangPoModal 
          stokList={stokList}
          isOpen={isBarangModalOpen}
          setIsOpen={setIsBarangModalOpen}
          barangPoList={barangPoList}
          setBarangPoList={setBarangPoList}
          stokPoList={stokPoList}
          setStokPoList={setStokPoList}
          step={step}
          setStep={setStep}
        />
        <Dialog size="xl" open={isModalOpen} onClose={() => {}}>
            {
              step === 1 &&
              <Dialog.Panel className="p-2">
              <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Title>
                  <div className="flex justify-between flex-wrap w-full">
                    <h2 className="mr-auto text-base font-medium">
                        Detail PO
                    </h2>
                  </div>
              </Dialog.Title>
              <Dialog.Description>
                <div className="relative mb-8 before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-start px-5 sm:px-20">
                  <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
                    <Button variant="primary" className="w-8 h-8 rounded-full">
                      1
                    </Button>
                    <div className="ml-3 text-base font-medium lg:w-32 lg:mt-3 lg:mx-auto">
                      Detail PO
                    </div>
                  </div>
                  <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                    <Button  className="w-8 h-8 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                      2
                    </Button>
                    <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                      Barang PO
                    </div>
                  </div>
                  <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                    <Button className="w-8 h-8 rounded-full  text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                      3
                    </Button>
                    <div  className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto  text-slate-600 dark:text-slate-400">
                      Review
                    </div>
                  </div>
                </div>
                      <div className="flex flex-col gap-4 flex-wrap">
                          <div className="w-full">
                              <FormLabel htmlFor="regular-form-1">No PO</FormLabel>
                              <FormInput {...register('noPo')} autoComplete="off" id="regular-form-1" type="text" placeholder="" className={`${errors.noPo && "border-danger"}`} />
                              {errors.noPo && 
                                <div className="mt-2 text-danger">
                                    {errors.noPo.message}
                                </div>
                              }
                          </div>
                          <div className="w-full">
                              <FormLabel htmlFor="regular-form-1">Tanggal</FormLabel>
                              <Litepicker 
                                {...register('tanggal', {required: 'Tanggal PO tidak boleh kosong'})}
                                autoComplete="off"
                                value={getValues('tanggal')}
                                onChange={(e) => setValue('tanggal', e)}
                                className={`${errors.tanggal && "border-danger"}`}
                                options={{
                                  showWeekNumbers: true,
                                  dropdowns: {
                                    minYear: 1990,
                                    maxYear: null,
                                    months: true,
                                    years: true,
                                  },
                                }}
                              />
                              {errors.tanggal && 
                                <div className="mt-2 text-danger">
                                    {errors.tanggal.message}
                                </div>
                              }
                          </div>
                          <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-6">
                                  PT
                              </FormLabel>
                              <FormSelect {...register('ptId', {required: true})} className={`${errors.ptId && "border-danger"}`} onChange={(e: ChangeEvent) => {
                                setSelectedPt((e.target as HTMLSelectElement).value);
                                setValue('ptId', (e.target as HTMLSelectElement).value);
                                setValue('projectId', '')
                              }} id="modal-form-6">
                                  {ptList.length > 0 ? ptList.map((item, index) => (
                                    <option aria-readonly={item.value === 'all'} selected={getValues('ptId') === item.value} value={item.value}>{item.label}</option>
                                  )) : ''}
                              </FormSelect>
                              {errors.ptId && 
                                <div className="mt-2 text-danger">
                                    {errors.ptId.message}
                                </div>
                              }
                          </div>
                          <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-6">
                                  Project
                              </FormLabel>
                              <FormSelect disabled={getValues('ptId') && getValues('ptId') !== 'all' ? false : true} {...register('projectId', {required: true})} className={`${errors.projectId && "border-danger"}`} onChange={(e: ChangeEvent) => setValue('projectId', (e.target as HTMLSelectElement).value)} id="modal-form-6">
                                  <option value=''>-- Pilih Project --</option>
                                  {projectList.length > 0 ? projectList.map((item, index) => (
                                      <option selected={getValues('projectId') === item.id} value={item.id}>{item.nama}</option>
                                  )) : ''}
                              </FormSelect>
                              {errors.projectId && 
                                <div className="mt-2 text-danger">
                                    {errors.projectId.message}
                                </div>
                              }
                          </div>
                      </div>
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="secondary" onClick={()=> {
                          setIsModalOpen(false);
                      }}
                      className="w-20 mr-2"
                      >
                        Batal
                      </Button>
                      <Button variant="primary" type="submit" className="w-20">
                          Lanjut
                          {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                      </Button>     
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
            }
            {
              step === 3 &&
              <Dialog.Panel className="p-2">
              <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Title>
                  <div className="flex justify-between flex-wrap w-full">
                    <h2 className="mr-auto text-base font-medium">
                      Review
                    </h2>
                  </div>
              </Dialog.Title>
              <Dialog.Description>
                <div className="relative mb-8 before:hidden before:lg:block before:absolute before:w-[69%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-start px-5 sm:px-20">
                  <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
                    <Button className="w-8 h-8 rounded-full  text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                      1
                    </Button>
                    <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto  text-slate-600 dark:text-slate-400">
                      Detail PO
                    </div>
                  </div>
                  <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                    <Button  className="w-8 h-8 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                      2
                    </Button>
                    <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                      Barang PO
                    </div>
                  </div>
                  <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                    <Button variant="primary" className="w-8 h-8 rounded-full">
                      3
                    </Button>
                    <div className="ml-3 text-base font-medium lg:w-32 lg:mt-3 lg:mx-auto">
                      Review
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-center flex-wrap items-center mx-auto w-full  font-semibold text-xl">
                  Review
                  <hr/>
                </div>
                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="mt-4">
                    <label className="text-md font-semibold">1. Detail PO</label>
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">No PO</FormLabel>
                      <FormInput value={getValues('noPo')} disabled id="regular-form-1" type="text" placeholder="" />
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Tanggal</FormLabel>
                      <Litepicker 
                        {...register('tanggal', {required: 'Tanggal PO tidak boleh kosong'})}
                        autoComplete="off"
                        disabled
                        value={getValues('tanggal')}
                        onChange={(e) => setValue('tanggal', e)}
                        options={{
                          showWeekNumbers: true,
                          dropdowns: {
                            minYear: 1990,
                            maxYear: null,
                            months: true,
                            years: true,
                          },
                        }}
                      />
                  </div>
                  {/* <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Jatuh Tempo (Hari)</FormLabel>
                      <FormInput value={getValues('jatuhTempo')} disabled id="regular-form-1" type="number" min="0" placeholder="" />
                  </div> */}
                  <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-6">
                          PT
                      </FormLabel>
                      <FormSelect disabled onChange={(e: ChangeEvent) => {
                        setSelectedPt((e.target as HTMLSelectElement).value);
                        setValue('ptId', (e.target as HTMLSelectElement).value);
                      }} id="modal-form-6">
                          <option value=''>-- Pilih PT --</option>
                          {ptList.length > 0 ? ptList.map((item, index) => (
                              <option selected={getValues('ptId') === item.value} value={item.value}>{item.label}</option>
                          )) : ''}
                      </FormSelect>
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-6">
                          Project
                      </FormLabel>
                      <FormSelect disabled onChange={(e: ChangeEvent) => setValue('projectId', (e.target as HTMLSelectElement).value)} id="modal-form-6">
                          <option value=''>-- Pilih Project --</option>
                          {projectList.length > 0 ? projectList.map((item, index) => (
                              <option selected={getValues('projectId') === item.id} value={item.id}>{item.nama}</option>
                          )) : ''}
                      </FormSelect>
                  </div>
                </div>
                <Disclosure.Group variant="boxed" className="mt-6">
                <div className="mb-4 mt-8">
                    <label className="text-md font-semibold">2. Barang PO</label>
                </div>
                <div>
                  {barangPoList.map((item, i) => (
                    <Disclosure id={i}>
                    <Disclosure.Button>
                      Barang {i+1}
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="flex flex-col gap-2 flex-wrap">
                        <div className="w-full">
                            <FormLabel>Nama</FormLabel>
                            <FormInput value={item.nama} disabled type="text" placeholder="Nama Barang" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Qty</FormLabel>
                            {/* <FormInput value={item.qty} disabled min='1' type="number" placeholder="0" /> */}
                            <FormInputCurrency
                              value={item.qty}
                              disabled
                              groupSeparator="."
                              decimalSeparator=","
                            />
                        </div>
                        <div className="w-full">
                            <FormLabel>Satuan</FormLabel>
                            <FormInput value={item.satuan} disabled type="text" placeholder="Ex: Pcs, Kg, Liter" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Harga</FormLabel>
                            {/* <FormInput value={item.harga} disabled min='0' type="number" placeholder="Rp. 0" /> */}
                            <FormInputCurrency
                              prefix="Rp. "
                              value={item.harga}
                              disabled
                              groupSeparator="."
                              decimalSeparator=","
                            />
                        </div>
                        {/* <div className="w-full">
                            <FormLabel>Diskon</FormLabel>
                            <FormInputCurrency
                              value={item.discount}
                              disabled
                              groupSeparator="."
                              decimalSeparator=","
                            />
                        </div> */}
                        <div className="w-full flex flex-col items-end mt-6">
                            <FormLabel className="font-semibold">Total Harga</FormLabel>
                            {item.discount && item.discount !== '0' ?
                              <span className="text-danger text-xs mb-4">
                                - Discount ({thousandLimiter(Number(item.discount), 'Rp')})
                              </span>
                              : ''
                            }
                            {
                              item.qty !== '0' && item.harga !== '0' ?
                              <span>
                                {thousandLimiter(Number(Number(item.qty) * Number(item.harga) - Number(item.discount)), 'Rp')}
                              </span>
                              : '0'
                            }
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Disclosure>
                  ))}
                  {/* <div className="flex justify-end items-start mt-4">
                  <FormCheck className="mt-5 w-1/2 flex items-start">
                      <FormCheck.Input id="vertical-form-3" type="checkbox" value="" />
                      <FormCheck.Label htmlFor="vertical-form-3">
                          Saya menyetujui pembuatan PO ini dan telah memeriksa data review dengan benar
                      </FormCheck.Label>
                  </FormCheck>
                  </div> */}
                </div>
            </Disclosure.Group>
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="secondary" onClick={()=> {
                          setIsBarangModalOpen(true);
                          setIsModalOpen(false);
                          setStep(2)
                      }}
                      className="w-20 mr-2"
                      >
                        Kembali
                      </Button>
                      <Button disabled={isSubmitLoading} variant="primary" type="submit" className="w-24">
                        {isSubmitLoading ? 'Loading' : 'Simpan'}
                        {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                    </Button>    
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
            }
            
        </Dialog>
      </div>
    );
}

const EditBarangModal = ({
  handleReloadStok,
  ptList,
  initialValues,
  isEditModalOpen,
  setIsEditModalOpen,
}: EditBarangModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const lastStepMaster = initialValues.BarangPo.filter((e) => e.isMaster === true).reverse()[0];
    const { register, handleSubmit, watch, setValue, getValues, reset, formState: {errors} } = useForm<PoInputs>({
      defaultValues: {
        id: initialValues.id,
        noPo: initialValues.noPo,
        tanggal: moment(initialValues.tanggal).format('YYYY-MM-DD'),
        jatuhTempo: initialValues.jatuhTempo,
        ptId: initialValues.ptId,
        projectId: initialValues.projectId,
        jumlahBayar: initialValues?.PembayaranPo[0]?.jumlahBayar,
        totalPembayaran: initialValues?.PembayaranPo[0]?.totalPembayaran,
        barangPo: initialValues.BarangPo.filter(e => e.step === lastStepMaster.step),
      }
    });
    watch('barangPo');
    const [selectedPt, setSelectedPt] = useState<string|undefined>()
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const onSubmit: SubmitHandler<PoInputs> = (data, event) => {
        setIsSubmitLoading(true);
        let totalBayar: number = 0;
        data.barangPo.map((item: any) => totalBayar += Number(item.jumlahHarga));
        data.updatedBy = userInfo.name;
        const payload = {
            po: {
              id: data.id,
              noPo: data.noPo,
              tanggal: new Date(data.tanggal),
              jatuhTempo: data.jatuhTempo,
              ptId: data.ptId,
              projectId: data.projectId,
              createdBy: data.createdBy,
              updatedBy: data.updatedBy,
            } as IPo,
            barangPo: data.barangPo,
            pembayaran: {
              id: initialValues.PembayaranPo[0].id,
              metodePembayaran: METODE_PEMBAYARAN.CICILAN,
              totalPembayaran: totalBayar,
              jumlahBayar: data.jumlahBayar,
              isApprove: false,
              updatedAt: new Date(),
              updatedBy: userInfo.name
            }
        }
        console.log(payload, ">>> payloadds");
        PoModule.update(payload)
        .then((res: AxiosResponse) => {
          const result = res.data;
          setIsEditModalOpen(false);
          reset();
          if (result.code === 200) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          handleReloadStok();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setIsSubmitLoading(false));
    }

    const fetchProjectData = (search: string | undefined, page: number, perPage: number, ptId: string) => {
      const params = {
          search,
          page,
          perPage,
          ptId
      }
      ProjectModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setProjectList(result.data)
      });
    }

    useEffect(() => {
      fetchProjectData("", 1, 1000, getValues('ptId'));
    }, [selectedPt]);

    return (
        <Dialog size="lg" open={isEditModalOpen} onClose={()=> {
            setIsEditModalOpen(false);
            }}
            >
            <Dialog.Panel className="p-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Title>
                    <h2 className="mr-auto text-base font-medium">
                        Form Edit PT
                    </h2>
                </Dialog.Title>
                <Dialog.Description>
                        <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">No. PO</FormLabel>
                                <FormInput {...register('noPo', {required: 'Nomor PO tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Tanggal PO</FormLabel>
                                <Litepicker 
                                {...register('tanggal', {required: 'Tanggal PO tidak boleh kosong'})}
                                autoComplete="false"
                                value={getValues('tanggal')}
                                onChange={(e) => setValue('tanggal', e)}
                                options={{
                                  showWeekNumbers: true,
                                  dropdowns: {
                                    minYear: 1990,
                                    maxYear: null,
                                    months: true,
                                    years: true,
                                  },
                                }}
                                />
                                {/* <FormInput {...register('tanggal', {required: 'Tanggal PO tidak boleh kosong'})} id="regular-form-1" type="date" placeholder="" /> */}
                            </div>
                            {/* <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Jatuh Tempo</FormLabel>
                                <FormInput {...register('jatuhTempo', {required: 'Tanggal PO tidak boleh kosong'})} id="regular-form-1" type="number" min="0" placeholder="" />
                            </div> */}
                            <div className="col-span-12 sm:col-span-6">
                                <FormLabel htmlFor="modal-form-6">
                                    PT
                                </FormLabel>
                                <FormSelect {...register('ptId')} onChange={(e: ChangeEvent) => {
                                    setSelectedPt((e.target as HTMLSelectElement).value);
                                    setValue('ptId', (e.target as HTMLSelectElement).value);
                                  }} id="modal-form-6">
                                    <option value=''>-- Pilih PT --</option>
                                    {ptList.length > 0 ? ptList.map((item, index) => (
                                        <option selected={item.id === initialValues.ptId} value={item.id}>{item.nama}</option>
                                    )) : ''}
                                </FormSelect>
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <FormLabel htmlFor="modal-form-6">
                                    Project
                                </FormLabel>
                                <FormSelect {...register('projectId')} onChange={(e: ChangeEvent) => setValue('projectId', (e.target as HTMLSelectElement).value)} id="modal-form-6">
                                    <option value=''>-- Pilih Project --</option>
                                    {projectList.length > 0 ? projectList.map((item, index) => (
                                        <option selected={item.id === initialValues.projectId} value={item.id}>{item.nama}</option>
                                    )) : ''}
                                </FormSelect>
                            </div>
                        </div>
                        <Disclosure.Group variant="boxed" className="mt-6">
                      <div>
                  {getValues('barangPo').map((item, i) => (
                    <Disclosure id={i}>
                    <Disclosure.Button>
                      Barang {i+1}
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="flex flex-col gap-2 flex-wrap">
                        <div className="w-full">
                            <FormLabel>Nama</FormLabel>
                            <FormInput {...register(`barangPo.${i}.nama`, {required: 'Nama barang tidak boleh kosong'})} value={item.nama} type="text" placeholder="Nama Barang" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Qty</FormLabel>
                            {/* <FormInput {...register(`barangPo.${i}.qty`, {required: 'Jumlah barang tidak boleh kosong'})} value={item.qty} min='1' type="number" placeholder="0" /> */}
                            <FormInputCurrency
                              value={getValues(`barangPo.${i}.qty`)}
                              onValueChange={(value: string | undefined) => {
                                setValue(`barangPo.${i}.qty`, Number(value));
                                setValue(`barangPo.${i}.jumlahHarga`, Number(value) * Number(getValues(`barangPo.${i}.harga`)));
                              }}
                              groupSeparator="."
                              decimalSeparator=","
                            />
                        </div>
                        <div className="w-full">
                            <FormLabel>Satuan</FormLabel>
                            <FormInput {...register(`barangPo.${i}.satuan`, {required: 'Satuan barang tidak boleh kosong'})} value={item.satuan} type="text" placeholder="Ex: Pcs, Kg, Liter" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Harga</FormLabel>
                            <FormInputCurrency
                              prefix="Rp. "
                              value={getValues(`barangPo.${i}.harga`)}
                              onValueChange={(value: string | undefined) => {
                                setValue(`barangPo.${i}.harga`, Number(value))
                                setValue(`barangPo.${i}.jumlahHarga`, Number(value) * Number(getValues(`barangPo.${i}.qty`)));
                              }}
                              groupSeparator="."
                              decimalSeparator=","
                            />
                            {/* <FormInput {...register(`barangPo.${i}.harga`, {required: 'Harga barang tidak boleh kosong'})} value={item.harga} min='0' type="number" placeholder="Rp. 0" /> */}
                        </div>
                        <div className="w-full">
                            <FormLabel>Diskon</FormLabel>
                            <FormInputCurrency
                              value={getValues(`barangPo.${i}.discount`)}
                              onValueChange={(value: string | undefined) => setValue(`barangPo.${i}.discount`, Number(value))}
                              groupSeparator="."
                              decimalSeparator=","
                            />
                            {/* <FormInput {...register(`barangPo.${i}.discount`)} value={item.discount} min='0' type="number" placeholder="Rp. 0" /> */}
                        </div>
                        <div className="w-full flex flex-col items-end mt-6">
                            <FormLabel className="font-semibold">Total Harga</FormLabel>
                            {item.discount && item.discount !== 0 ?
                              <span className="text-danger text-xs mb-4">
                                - Discount ({thousandLimiter(Number(item.discount), 'Rp')})
                              </span>
                              : ''
                            }
                            {
                              item.qty !== 0 && item.harga !== 0 ?
                              <span>
                                {thousandLimiter(Number(Number(item.qty) * Number(item.harga) - Number(item.discount)), 'Rp')}
                              </span>
                              : '0'
                            }
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Disclosure>
                  ))}
                  <div className="flex justify-start mt-4">
                  </div>
                </div>
            </Disclosure.Group>
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="secondary" onClick={()=> {
                        setIsEditModalOpen(false);
                    }}
                    className="w-20 mr-1"
                    >
                        Batal
                    </Button>
                    <Button disabled={isSubmitLoading} variant="primary" type="submit" className="w-22">
                        {isSubmitLoading ? 'Loading' : 'Simpan'}
                        {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                    </Button>
                </Dialog.Footer>
                </form>
            </Dialog.Panel>
        </Dialog>
    );
}

const DeleteConfirmationModal = ({
  handleReloadStok,
  deleteConfirmationModal,
  setDeleteConfirmationModal,  
  deleteButtonRef,
  initialValues
}: DeleteConfirmationModalProps) => {

  const onDelete = (initialValues: IPo) => {
    PoModule.destroy(initialValues)
        .then((res: AxiosResponse) => {
          const result = res.data;
          setDeleteConfirmationModal(false);
          if (result.code === 200) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          handleReloadStok();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => {});
  }

  return (
     <>
      <Dialog
      open={deleteConfirmationModal}
      onClose={() => {
        setDeleteConfirmationModal(false);
      }}
      initialFocus={deleteButtonRef}
      >
      <Dialog.Panel>
        <div className="p-5 text-center">
          <Lucide
            icon="XCircle"
            className="w-16 h-16 mx-auto mt-3 text-danger"
          />
          <div className="mt-5 text-3xl">Apakah Anda yakin?</div>
          <div className="mt-2 text-slate-500">
            Apakah Anda yakin ingin menghapus data ini? <br />
            Data akan terhapus secara permanen.
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => {
              setDeleteConfirmationModal(false);
            }}
            className="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            type="button"
            className="w-24"
            ref={deleteButtonRef}
            onClick={() => onDelete(initialValues)}
          >
            Delete
          </Button>
        </div>
      </Dialog.Panel>
      </Dialog>
     </>
  )
}

const ViewPo = ({initialValues, isDetailModalOpen, setIsDetailModalOpen, handleReloadStok}: ViewDetailModalProps) => {
  const [riwayatList, setRiwayatList] = useState<any[]>([]);
  const lastStepMaster = initialValues.BarangPo.filter((e) => e.isMaster === true).reverse()[0];

  const fetchRiwayatPembayaran = (poId: string) => {
    PoModule.getRiwayatPembayaran(poId).then((res: AxiosResponse) => {
      const result = res.data;
      setRiwayatList(result.data)
    });
  }

  useEffect(() => {
    fetchRiwayatPembayaran(initialValues.id);
  }, []);

  return (
    <div>
      <Dialog size="lg" open={isDetailModalOpen} onClose={()=> {
            setIsDetailModalOpen(false);
            }}
            >
            <Dialog.Panel className="p-2">
                <Dialog.Title>
                  <h2 className="mr-auto text-base flex gap-2 items-center">
                    <Lucide icon="FileText" className="w-6 h-6"/>
                    Detail PO : <span className="font-medium">{initialValues.noPo}</span>
                  </h2>
                </Dialog.Title>
                <Dialog.Description>
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-4 auto-cols-max p-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">No. PO</label>
                        <span>{initialValues.noPo}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Tanggal PO</label>
                        <span>{moment(initialValues.tanggal).format('DD MMM YYYY')}</span>
                      </div>
                      {/* <div className="flex flex-col gap-1">
                        <label className="font-semibold">Jatuh Tempo</label>
                        <span>{initialValues.jatuhTempo}</span>
                      </div> */}
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">PT</label>
                        <span>{initialValues.Pt.nama}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Project</label>
                        <span>{initialValues.Project.nama}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Dibuat Oleh</label>
                        <span>{initialValues.createdBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <hr/>
                  </div>
                  <Disclosure.Group variant="boxed" className="mt-6">
                  <div>
                    {initialValues.BarangPo.filter(e => e.step === lastStepMaster.step).map((item, i) => (
                      <Disclosure id={i}>
                      <Disclosure.Button>
                        Barang {i+1}
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <div className="grid grid-cols-3 gap-4 auto-cols-max">
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Nama</label>
                              <span>{item.nama}</span>
                              {/* <FormInput value={item.nama} disabled type="text" placeholder="Nama Barang" /> */}
                          </div>
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Qty</label>
                              <span>{item.qty}</span>
                          </div>
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Satuan</label>
                              <span>{item.satuan}</span>
                          </div>
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Harga</label>
                              <span>{thousandLimiter(item.harga, 'Rp')}</span>
                          </div>
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Diskon</label>
                              <span>{thousandLimiter(item.discount, 'Rp')}</span>
                          </div>  
                          <div className="w-full flex flex-col items-end mt-6">
                              <FormLabel className="font-semibold">Total Harga</FormLabel>
                                <span className="text-danger text-xs mb-4">
                                  - Discount ({thousandLimiter(item.discount, 'Rp')})
                            </span>
                                <span>
                                  {thousandLimiter(Number(Number(item.qty) * Number(item.harga) - Number(item.discount)), 'Rp')}
                                </span>
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </Disclosure>
                    ))}
                    <div className="flex justify-start mt-4">
                    </div>
                  </div>
                </Disclosure.Group>
                  {/* BEGIN: Recent Activities */}
                  {
                    riwayatList.length> 0 &&
                  <div className="col-span-12 mt-2 md:col-span-6 xl:col-span-4 2xl:col-span-12 -z-10">
                    <div className="flex items-center h-10 intro-x">
                      <h2 className="mr-5 text-lg font-medium truncate">
                        Riwayat Pembayaran
                      </h2>
                      {/* <a href="" className="ml-auto truncate text-primary">
                        Lihat Selengkapnya
                      </a> */}
                    </div>
                    {
                      riwayatList.map((item) => <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                      {/* <div className="my-4 text-xs text-center intro-x text-slate-500">
                        { moment(item.createdAt).format('DD MMMM YYYY') }
                      </div> */}
                      <div className="relative flex items-center mb-3 intro-x">
                        <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                          <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-darkmode-400/70 flex justify-center items-center">
                            <p className="font-bold text-slate-700 dark:text-slate-500">{item.createdBy[0]}</p>
                          </div>
                          </div>
                        </div>
                        <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                          <div className="flex items-center">
                            <div className="font-medium">
                              {item.createdBy}
                            </div>
                          </div>
                          <div className="mt-1 text-slate-500">
                            {item?.description}
                          </div>
                            <div className="ml-auto text-xs text-slate-500 mt-4">
                              { moment(item.createdAt).format('DD MMMM YYYY HH:mm') }  
                            </div>
                        </div>
                      </div>
                    </div>)
                    }
                  </div>
                  }
                  {/* END: Recent Activities */}
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="secondary" onClick={()=> {
                        setIsDetailModalOpen(false);
                    }}
                    className="w-20 mr-1"
                    >
                      Tutup
                    </Button>
                </Dialog.Footer>
            </Dialog.Panel>
        </Dialog>
    </div>
  );
};

const PembayaranDetailModal = ({initialValues, isModalOpen, setIsModalOpen, handleReloadData}: any) => {
  const userInfo = useAppSelector(SelectUserInfo);
  const { register, reset, handleSubmit, setValue, setError, formState: {errors}, clearErrors, resetField } = useForm<any>();
  const typedErrors = errors as { [key: string]: any };
  const [selectedPembayaran, setSelectedPembayaran] = useState<string>();
  const [selectedApproval, setSelectedApproval] = useState<boolean|null>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onSubmit: SubmitHandler<any> = (data) => {
      console.log(data);
      if (data.jumlahBayar === undefined && data.editJumlahBayar === undefined) {
        setError('jumlahBayar', { message: 'Oops! Jumlah bayar tidak boleh kosong.' });
        return false;
      }
      if (Number(data.jumlahBayar) > Number(initialValues.PembayaranPo[0]?.totalPembayaran)) {
        data.jumlahBayar = Number(initialValues.PembayaranPo[0]?.totalPembayaran);
        setError('jumlahBayar', { message: 'Oops! Jumlah bayar lebih dari total pembayaran.' });
        return false;
      }
      if (Number(data.editJumlahBayar) > Number(initialValues.PembayaranPo[0]?.totalPembayaran)) {
        console.log('upps edit error');
        setError('editJumlahBayar', { message: 'Oops! Sisa pembayaran lebih dari total pembayaran.' });
        return false;
      }
      console.log(initialValues, ">>> dataa");
      const payload = {
          id: initialValues.PembayaranPo[0]?.id,
          metode: selectedPembayaran,
          jumlahBayar: data.jumlahBayar !== undefined ? Number(initialValues.PembayaranPo[0]?.jumlahBayar) + Number(data.jumlahBayar) : Number(initialValues.PembayaranPo[0]?.jumlahBayar),
          nominalBayar: data.jumlahBayar,
          isApprove: selectedPembayaran === 'COD (Cash on Delivery)' ? false : selectedApproval,
          updatedBy: userInfo.name,
          updatedAt: new Date(),
          editJumlahBayar: data.editJumlahBayar,
          poId: initialValues.PembayaranPo[0]?.poId,
          totalPembayaran: initialValues.PembayaranPo[0]?.totalPembayaran,
          approvedAt: initialValues.PembayaranPo[0]?.approvedAt,
          approvedBy: initialValues.PembayaranPo[0]?.approvedBy,
      };

      if (selectedPembayaran !== 'Cicilan / Hutang') {
          payload.jumlahBayar = initialValues.PembayaranPo[0]?.totalPembayaran
      }

      if (selectedApproval) {
          payload.approvedAt = new Date(),
          payload.approvedBy = userInfo.name
      }

      if (data.editJumlahBayar !== undefined) {
        payload.jumlahBayar = (initialValues.PembayaranPo[0]?.totalPembayaran - Number(data.editJumlahBayar)) + ( isNaN(Number(data.jumlahBayar)) ? 0 : Number(data.jumlahBayar));
      }

      console.log(payload);
      PoModule.updatePembayaran(payload)
      .then((res: AxiosResponse) => {
        const result = res.data;
          if (result.code === 200) {
              toast.success(result.message)
          } else {
              toast.error(result.message);
          }
          handleReloadData();
          reset();
      });
  }

  useEffect(() => {
      setSelectedPembayaran(initialValues?.PembayaranPo[0]?.metode);
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
                  <h2 className="mr-auto text-base flex gap-2 items-center">
                    <Lucide icon="Wallet" className="w-6 h-6"/>
                    Pembayaran
                  </h2>
                </Dialog.Title>
                <Dialog.Description>
                  <div className="w-full">
                    <div className="flex flex-col gap-4">
                      <div className='flex justify-between'>
                          <div className="flex flex-col gap-1">
                              <label className="font-semibold">Total Pembayaran</label>
                              <span className='text-xl font-semibold'>{thousandLimiter(Number(initialValues.PembayaranPo[0]?.totalPembayaran), 'Rp')}</span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                              <Button size="sm" type="button" variant='soft-secondary' rounded onClick={() => setIsEdit(true)}>
                                <Lucide icon="Pencil" className="w-4 h-4 mr-2" />{" "}
                                Edit
                              </Button>
                              {
                                isEdit && 
                                  <div>
                                    <div className="flex gap-2 align-items-center">
                                      <FormInputCurrency className={`my-2 ${errors.editJumlahBayar ? "border-danger": ""}`} onValueChange={(value: string | undefined) => setValue('editJumlahBayar', value)} prefix="Rp. " groupSeparator="." decimalSeparator="," placeholder="Edit Sisa Pembayaran" required />
                                      <Lucide onClick={() => {
                                        setIsEdit(false);
                                        resetField('editJumlahBayar');
                                        clearErrors('editJumlahBayar');
                                      }} icon="X" className="w-8 h-8 mr-2 self-center text-danger cursor-pointer hover:bg-slate-200 hover:rounded hover:p-1" />{" "}
                                    </div>
                                    {errors.editJumlahBayar && 
                                      <div className="text-danger">
                                          {typedErrors.editJumlahBayar.message}
                                      </div>
                                    }
                                  </div>
                              }
                              <label className="font-semibold">Sisa Pembayaran</label>
                              <span className={`text-xl font-semibold ${Number(initialValues.PembayaranPo[0]?.totalPembayaran) - Number(initialValues.PembayaranPo[0]?.jumlahBayar) !== 0 && 'text-danger'}`}>{thousandLimiter(Number(initialValues.PembayaranPo[0]?.totalPembayaran) - Number(initialValues.PembayaranPo[0]?.jumlahBayar), 'Rp')}</span>
                          </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Metode Pembayaran</label>
                        <span>{initialValues.PembayaranPo[0]?.metode}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Status</label>
                        {initialValues.PembayaranPo[0]?.totalPembayaran === initialValues.PembayaranPo[0]?.jumlahBayar ? 
                          <span className='bg-success py-1 px-2 rounded-md text-white w-fit'>Lunas</span> : <span className='bg-danger py-1 px-2 rounded-md text-white w-fit'>Belum Lunas</span> }
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <hr/>
                  </div>
                  {
                      Number(initialValues.PembayaranPo[0]?.totalPembayaran) - Number(initialValues.PembayaranPo[0]?.jumlahBayar) !== 0 &&
                      <div className='flex flex-col gap-4'>
                      {
                          selectedPembayaran === 'Cicilan / Hutang' &&
                          <div>
                              <FormLabel htmlFor="modal-form-6">Jumlah Bayar</FormLabel>
                              <FormInputCurrency className={`${errors.jumlahBayar && "border-danger"}`} onValueChange={(value: string | undefined) => setValue('jumlahBayar', value)} prefix="Rp. " groupSeparator="." decimalSeparator="," />
                              {errors.jumlahBayar && 
                                <div className="mt-2 text-danger">
                                  {typedErrors.jumlahBayar.message}
                                </div>
                              }
                          </div>
                      }
                      </div>
                  }
                 
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="secondary" onClick={()=> {
                        setIsModalOpen(false);
                    }}
                    className="w-20 mr-1"
                    >
                      Tutup
                    </Button>
                    <Button type="submit" variant="primary"
                    className="w-20 mr-1"
                    >
                      Submit
                    </Button>
                </Dialog.Footer>
                </form>
            </Dialog.Panel>
        </Dialog>
    </div>
  );
};

const ActionButtons = ({
  handleReloadStok,
  initialValues,
  ptList,
  stokList,
  }
  : ActionButtonsProps) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isPembayaranModalOpen, setIsPembayaranModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);

  return (
    <>
    <ViewPo 
      initialValues={initialValues}
      isDetailModalOpen={isDetailModalOpen}
      setIsDetailModalOpen={setIsDetailModalOpen}
      handleReloadStok={handleReloadStok}
    />
    <EditBarangModal  
      handleReloadStok={handleReloadStok}
      initialValues={initialValues}
      ptList={ptList}
      isEditModalOpen={isEditModalOpen}
      setIsEditModalOpen={setIsEditModalOpen}
    />
    <PembayaranDetailModal
      initialValues={initialValues}
      isModalOpen={isPembayaranModalOpen}
      setIsModalOpen={setIsPembayaranModalOpen}
      handleReloadData={handleReloadStok}
    />
    <DeleteConfirmationModal
      handleReloadStok={handleReloadStok}
      deleteConfirmationModal={deleteConfirmationModal}
      setDeleteConfirmationModal={setDeleteConfirmationModal}
      deleteButtonRef={deleteButtonRef}
      initialValues={initialValues}
    />
    <div className="flex items-center justify-start">
      <a className="flex items-center mr-3" href="#" onClick={() => {
        setIsDetailModalOpen(true);
      }}>
        <Lucide icon="View" className="w-4 h-4 mr-1" />{" "}
        Detail
      </a>
      {/* <a className="flex items-center mr-3" href="#" onClick={() => {
        setIsEditModalOpen(true);
      }}>
        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
        Edit
      </a> */}
      {
        ['Belum Lunas', 'Sudah Lunas'].includes(initialValues?.status) && <a className="flex items-center mr-3" href="#" onClick={() => {
          setIsPembayaranModalOpen(true);
        }}>
          <Lucide icon="Wallet" className="w-4 h-4 mr-1" />{" "}
          Pembayaran
        </a>
      }
      {
        initialValues?.SuratJalanPo.length < 1 &&  <a
        className="flex items-center text-danger"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          setDeleteConfirmationModal(true);
        }}
      >
      <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Hapus
      </a>
      }
    </div>
      
    </>
  );
}

type SuratJalanDetailType = {
  item: ISuratJalanPo[],
  index: number
}

const SuratJalanDetail = (props: SuratJalanDetailType) => {
  return (
    <div className="tooltip-content">
    <TippyContent to={`tooltip-content-${props.index}`}>
        <div className="relative flex items-center py-1">
            <div className="ml-4 mr-auto">
                <div className="text-slate-500 dark:text-slate-400">
                    {
                      props.item.map((e, i) => <li>{e.nomor}</li>)
                    }
                </div>
            </div>
        </div>
    </TippyContent>
    </div>
  );
};

function Main () {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [ptList, setPtList] = useState<IPt[]>([]);
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [poList, setPoList] = useState<IPo[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string|undefined>();
  const [selectedPt, setSelectedPt] = useState<SingleValue<any>>({
    label: 'Semua PT',
    value: 'all'
  })
  const [selectedProject, setSelectedProject] = useState<SingleValue<any>>({
    label: 'Semua Project',
    value: 'all'
  });
  const [stokList, setStokList] = useState<IStok[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleReloadStok = () => {
    setIsRefreshData(!isRefreshData);
  }

  const handleReset = () => {
    setSelectedStatus('all');
    setSearch("");
    setSelectedPt({
      label: 'Semua PT',
      value: 'all'
    });
    setSelectedProject({
      label: 'Semua Project',
      value: 'all'
    });
    setIsRefreshData(!isRefreshData);
  }

  const fetchPtList = async() => {
    await PtModule.getList().then((res: AxiosResponse) => {
      const result = res.data;
      const temp: any = [{
        label: '-- Semua PT --',
        value: 'all'
      }];
      result.data.map((item: any) => {
        temp.push({
          label: item.nama,
          value: item.id,
          project: item.Project
        })
      })
      setPtList(temp)
    })
  }

  const fetchProjectList = async(project: any) => {
    const temp: any[] = [];   
    project?.map((item: any) => {
        temp.push({
          label: item.nama,
          value: item.id,
        })
      })
      setProjectList(temp)
  }

  const fetchStokBarangData = (search: string | undefined, page: number, perPage: number, tokoId: string, tab: string) => {
    const params = {
      search,
      page,
      perPage,
      tokoId,
      tab
    };
    StokModule.get(params)
    .then((res: AxiosResponse) => {
      const result = res.data;
      setStokList(result.data)
    })
  }

  const fetchPoData = (
    search: string | undefined,
    page: number, perPage: number,
    ptId: string,
    projectId: string,
    status: string
    ) => {
    setIsDataLoading(true);
    const params: IPoFetchQuery = {
      search,
      page,
      perPage,
      ptId,
      projectId,
      status
    }

    if (search) {
      setTimeout(() => {
        PoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setPoList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
      }, 1000)
    } else {
      PoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        console.log(result.data);
        setPoList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    if (selectedPt) {
      fetchProjectList(selectedPt.project);
    }
  }, [selectedPt]);

  useEffect(() => {
    fetchPoData(search, page, perPage, selectedPt.value, selectedProject.value, selectedStatus);
  }, [isRefreshData, page, perPage]);

  useEffect(() => {
    fetchPtList();
    fetchStokBarangData(undefined, 1, 1000, 'all', 'all');
  }, []);

  console.log(ptList);

  return (
    <>
      <Toaster/>
      <TambahPoModal 
        handleReloadStok={handleReloadStok}
        ptList={ptList}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen} 
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        stokList={stokList}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar PO</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setIsModalOpen(true)}>
            Tambah PO
          </Button>
          {/* <Menu>
            <Menu.Button as={Button} className="px-2 !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                Excel
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                PDF
              </Menu.Item>
            </Menu.Items>
          </Menu> */}
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
            <div className="relative w-56">
              <FormSelect value={selectedStatus} onChange={(e: ChangeEvent) => setSelectedStatus((e.target as HTMLSelectElement).value)}>
                <option value='all'>Pilih Status</option>
                {
                  PO_STATUS_OPTION.map((item, index) => <option key={index} value={item.value}>{item.label}</option>)
                }
              </FormSelect>
            </div>
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
            <div className="relative w-56">
              <Select placeholder='Semua PT' options={ptList} value={selectedPt} onChange={(e) => {
                setSelectedPt(e);
                setSelectedProject({
                  label: 'Semua Project',
                  value: 'all'
                });
              }} />
            </div>
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
            <div className="relative w-56">
            <Select placeholder='Semua Project' isDisabled={!selectedPt} options={projectList} value={selectedProject} onChange={(e) => setSelectedProject(e)} />
            </div>
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                value={search}
                onChange={(e) => handleSearch(e)}
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Cari nomor PO..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
          <Button variant="primary" className="shadow-md" onClick={() => handleReloadStok()}>
            <Lucide icon="Filter" className="w-4 h-4 mr-2" />
              Filter
          </Button>
          <Button variant="warning" className="shadow-md" onClick={() => handleReset()}>
            <Lucide icon="RotateCcw" className="w-4 h-4 mr-2" />
              Reset
          </Button>
        </div>
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y ">
          {!isDataLoading ? <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NO. PO
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TANGGAL PO
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PROJECT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TOTAL PEMBAYARAN
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  SISA PEMBAYARAN
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  STATUS SJ
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  AKSI
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {poList.length > 0 ? poList.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.noPo}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {moment(item.tanggal).format('DD/MM/YYYY')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.Pt?.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.Project?.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(item.PembayaranPo[0]?.totalPembayaran, 'Rp')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(Number(item.PembayaranPo[0]?.totalPembayaran - item.PembayaranPo[0]?.jumlahBayar), 'Rp')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {
                      item.status === 'Belum Diambil' || item.status === 'Sudah Diambil' ? <Button size="sm" variant='outline-primary'>
                      {item.status}
                      </Button> : item.PembayaranPo[0]?.totalPembayaran === item.PembayaranPo[0]?.jumlahBayar ? <Button size="sm" variant='outline-success' >Sudah Lunas</Button> : <Button size="sm" variant='outline-danger' >Belum Lunas</Button>
                    }
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {
                      <Button variant='outline-primary' size="sm" data-tooltip={`tooltip-content-${index}`}>{item.statusSJ}</Button>
                    }
                    <div className="hidden">
                      <SuratJalanDetail item={item.SuratJalanPo} index={index} />
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <ActionButtons
                      handleReloadStok={handleReloadStok}
                      initialValues={item}
                      ptList={ptList}
                      projectList={projectList}
                      stokList={stokList}
                    />
                  </Table.Td>
                </Table.Tr>
              )) : ''}
            </Table.Tbody>
          </Table> : 
            <div className="flex justify-center w-full">
              <div className="w-16 h-16">
                <LoadingIcon icon="oval" color="grey" className="w-1 h-1 ml-2" />
              </div>
            </div>
            }
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <PaginationCustom
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalPages={totalPages}
          totalCount={totalCount}
        />
        {/* END: Pagination */}
      </div>
    </>
  );
}

export default Main;

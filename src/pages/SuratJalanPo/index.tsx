import _, { initial, result } from "lodash";
import clsx from "clsx";
import { useState, useRef, SetStateAction, ChangeEvent, useEffect, MutableRefObject, RefObject, useMemo, JSXElementConstructor, ReactElement, ReactNode, MouseEventHandler, ReactInstance, Dispatch } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormCheck, FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu, Disclosure } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { FormLabel, FormHelp } from "../../base-components/Form";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import PoModule from '../../modules/po/po';
import PtModule from '../../modules/pt/pt';
import ProjectModule from '../../modules/project/project';
import SuratJalanPoModule from '../../modules/surat-jalan-po/surat-jalan-po';
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
import TomSelect from "../../base-components/TomSelect";
import { BarangSuratJalanPo, ISuratJalanPo, SuratJalanPoPayload } from "../../modules/surat-jalan-po/interfaces/surat-jalan-po.interface";
import Select, { MultiValue, OptionProps, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';
import BarangPoModule from '../../modules/barang-po/barang-po';
import StokModule from '../../modules/stok/stok';
import ReactPDF from "@react-pdf/renderer";
import SuratJalanPoPrint from "./surat-jalan-po-print";
import {useReactToPrint} from 'react-to-print';
import { useAppSelector } from "../../stores/hooks";
import { SelectUserInfo } from "../../stores/common/userInfoSlice";
import { AxiosResponse } from "axios";
import { IndicatorSeparator } from "react-select/dist/declarations/src/components/indicators";
import TabStatus from "../Stok/enum/tab.enum";
import InvoicePoModule from "../../modules/invoice-po/invoice-po";
import { userInfo } from "os";
import Litepicker from "../../base-components/Litepicker";
import FormInputCurrency from "../../components/Custom/FormInputCurrency";
import Badge from "../../components/Custom/Badge";
import TippyContent from "../../base-components/TippyContent";
import { StatusList } from "./const/status-option";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { METODE_PEMBAYARAN } from "../Po/enum/po.enum";
import { nanoid } from "nanoid";

type TambahPoModalProps = {
    stokList: IStok[] | undefined
    handleReloadStok: () => void
    ptList: IPt[]
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    isUpdate: boolean
    setIsUpdate: React.Dispatch<SetStateAction<boolean>>
}

type ViewDetailModalProps = {
  initialValues: ISuratJalanPo,
  isDetailModalOpen: boolean
  setIsDetailModalOpen: React.Dispatch<SetStateAction<boolean>>
}

type EditBarangModalProps = {
  handleReloadStok: () => void,
  ptList: IPt[],
  initialValues: ISuratJalanPo,
  isEditModalOpen: boolean
  setIsEditModalOpen: React.Dispatch<SetStateAction<boolean>>
}

type DeleteConfirmationModalProps = {
  handleReloadStok: () => void
  deleteConfirmationModal: boolean
  deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
  setDeleteConfirmationModal: React.Dispatch<SetStateAction<boolean>>
  initialValues: ISuratJalanPo,
}

type ActionButtonsProps = {
  handleReloadStok: () => void,
  initialValues: ISuratJalanPo,
  ptList: IPt[],
  projectList: IProject[],
}

type SuratJalanPoInputs = {
    id: string
    nomor: string
    namaSupir: string
    tanggal: string
    poId: string
    projectId: string
    createdBy: string
    updatedBy?: string
}

type BarangPoInputs = {
    [x: string]: any
}

type BarangModalProps = {
  stokList: IStok[] | undefined
  selectedPo: SingleValue<OptionsProps> | undefined
  isOpen: boolean
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
  barangPoList: BarangSuratJalanPo[];
  setBarangPoList: React.Dispatch<SetStateAction<BarangSuratJalanPo[]>>
  step: number
  setStep: React.Dispatch<SetStateAction<number>>
  stokPoList: any
  setStokPoList: any
}

type OptionsProps = {
  label: string | undefined
  value: string | undefined
  isDisabled?: boolean,
  detail?: any
}

const BarangPoModal = ({
  stokList,
  selectedPo,
  isOpen,
  setIsOpen,
  barangPoList,
  setBarangPoList,
  step,
  setStep,
  stokPoList,
  setStokPoList,
}: BarangModalProps) => {
  const userInfo = useAppSelector(SelectUserInfo);
  const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors}, setError } = useForm<any>();
  const [barangList, setBarangList] = useState<string[]>(['barang_1']);
  const [barangPoData, setBarangPoData] = useState<IBarangPo[]>();
  const [barangPoOptions, setBarangPoOptions] = useState<OptionsProps[]>([]);
  const [maxQtyList, setMaxQtyList] = useState<number[]>([]);
  const [stokOptions, setStokOptions] = useState<any>();
  const [hiddenItem, setHiddenItem] = useState<string[]>([]);

  const onSubmit: SubmitHandler<BarangPoInputs> = (data) => {
    setStep(3);
    console.log(data, ">>> barang data");
    const valueData: BarangPoInputs[] = [];
    if (selectedPo) {
      if (barangPoData && barangPoData?.length > 0) {
        for (let index = 0; index < barangPoData.length; index++) {
          if (Number(data.qty[index].values) > Number(barangPoData[index].qty)) {
            alert(`Jumlah tidak boleh lebih dari jumlah PO (${Number(barangPoData[index].qty)})`);
            return false;
          }
          if (Number(data.qty[index].values) < 1) {
            alert(`Jumlah tidak boleh kurang dari 1`);
            return false;
          }
          if(!hiddenItem.includes(data.id[index].values)) {
            StokModule.getOneById(data.stokBarangId[index].values).then((res: AxiosResponse) => {
              const result = res.data;
                valueData.push({
                  id: data.id[index].values,
                  kode: data.kode[index].values,
                  nama: data.nama[index].values,
                  qty: Number(data.qty[index].values),
                  satuan: data.satuan[index].values,
                  stokBarangId: data.stokBarangId[index].values,
                  step: data.step[index].values,
                  createdBy: userInfo.name,
                });
                setBarangPoList(valueData as BarangSuratJalanPo[]);
                setBarangPoData([]);
                setBarangPoOptions([]);
                setIsOpen(false);
            });
          }
        }
      } else {
        for (let index = 0; index < barangList.length; index++) {
          StokModule.getOneById(data.stokBarangId[index].values).then((res: AxiosResponse) => {
            const result = res.data;
              valueData.push({
                id: data.id[index].values,
                kode: data.kode[index].values,
                nama: data.nama[index].values,
                qty: Number(data.qty[index].values),
                satuan: data.satuan[index].values,
                stokBarangId: data.stokBarangId[index].values,
                step: data.step[index].values,
                createdBy: userInfo.name,
              });
              setBarangPoList(valueData as BarangSuratJalanPo[]);
              setBarangPoData([]);
              setBarangPoOptions([]);
              setIsOpen(false);
          });
        }
      }
    } else {
      const stokPo = [];
      const tempStokId: string = nanoid();
      for (let index = 0; index < barangList.length; index++) {
        if (Number(data.qty[index].values) < 1) {
          alert(`Jumlah tidak boleh kurang dari 1`);
          return false;
        }
        if (Number(data.harga[index].values) < 0) {
          alert(`Harga tidak boleh kurang dari 0`);
          return false;
        }
        if (data.discount && Number(data.discount[index].values) < 0) {
          if (data.discount[index]) {
            alert(`Discount tidak boleh kurang dari 0`);
            return false;
          }
        }
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
            discount: data?.discount ? data?.discount[index]?.values : 0,
            tokoId: userInfo.tokoId,
            tempStokId: data.stokBarangId[index].values ? data.stokBarangId[index].values : tempStokId,
          });
        }

        valueData.push({
          kode: data.kode[index].values,
          nama: data.nama[index].values,
          qty: Number(data.qty[index].values),
          satuan: data.satuan[index].values,
          stokBarangId: data.stokBarangId[index].values ? data.stokBarangId[index].values : tempStokId,
          harga: data.harga[index].values,
          discount: data?.discount ? data?.discount[index]?.values : 0,
          jumlahHarga: Number((Number(data.qty[index].values) * Number(data.harga[index].values)) - (data?.discount && Number(data?.discount[index]?.values) || 0)),
          createdBy: userInfo.name,
        })
        console.log(valueData, ">>> valdataa");
        setBarangPoList(valueData as BarangSuratJalanPo[]);
        setBarangPoData([]);
        setBarangPoOptions([]);
        setStokPoList(stokPo);
        setIsOpen(false);
      }
    }
  }

  const fetchBarangPoData = (search: string | undefined, page: number, perPage: number, poId: string | undefined) => {
    const params = {
      search,
      page, 
      perPage,
      poId
    }
    BarangPoModule.get(params)
    .then((res: AxiosResponse) => {
      const result = res.data;
      const temp: OptionsProps[] = [];
      const dataLength = result?.data?.length;
      const lastStep = result?.data[dataLength - 1]?.step;
      result.data.filter((e: IBarangPo) => e.step === lastStep).map((item: IBarangPo, index: number) => {
        if (item.qty > 0) {
          temp.push({
            label: item.nama,
            value: item.id,
          });
        } else {
          temp.push({
            label: item.nama,
            value: item.id,
            isDisabled: true
          });
        }
      });
      setBarangPoOptions(temp);
      setBarangPoData(result.data.filter((e: IBarangPo) => e.step === lastStep));
    });
  }

  const handleOptions = (position: number) => {
    const tempSelected: string[] = [];
    getValues(`nama`).forEach((item: BarangPoInputs, index: number) => {
      tempSelected.splice(position, 0, item.values.label as string);
    });
    if (tempSelected.length > 0) {
      const temp: OptionsProps[] = [...barangPoOptions];
      barangPoOptions.forEach((item, index) => {
        if (tempSelected.includes(item.label as unknown as string)) {
          temp.splice(index, 1, {...temp[index], isDisabled: true});
        } else {
          temp.splice(index, 1, {
            label: barangPoOptions[index].label as string,
            value: barangPoOptions[index].value as string,
          })
        }
      });
      setBarangPoOptions(temp);
    }
  };

  watch('qty');
  watch('harga');
  watch('discount');

  const fetchStokBarangById = (id: string | undefined) => {
    if (id) {
      return StokModule.getOneById(id)
      .then((res: AxiosResponse) => {
        const result = res.data;
        return result.data
      });
    }
  }

  useEffect(() => {
    if (barangPoList.length < 1) {
      reset();
    }
  }, [barangPoList])

  useEffect(() => {
    fetchBarangPoData(undefined, 1, 10000, selectedPo?.value);
    const temp: SingleValue<any> = [];
    stokList && stokList.map((item: IStok) => temp.push({
      label: item.nama,
      value: item.id,
      detail: item,
      satuan: item?.satuan,
      kode: item?.kode,
      harga: item?.hargaJual,
      qty: item?.jumlah,
      stokBarangId: item?.id
    }));
    setStokOptions(temp);
  }, [isOpen])

  useEffect(() => {
    if (selectedPo) {
      const temp: number[] = [...maxQtyList];
      barangPoData && barangPoData.map((item: any, i: number) => {
        setValue(`qty.${i}.values`, item.qty);
        temp.splice(i, 1,  item.qty);
        setMaxQtyList(temp);
        setValue(`id.${i}.values`, item.id)
        setValue(`satuan.${i}.values`, item.satuan);
        setValue(`stokBarangId.${i}.values`, item.stokBarangId);
        setValue(`kode.${i}.values`, item.kode);
        setValue(`nama.${i}.values`, item.nama);
        setValue(`step.${i}.values`,  item.step);
        setValue(`stokData.${i}.values`, item);
      })
    }
  }, [barangPoData])

  return (
    <div>
      <Dialog size="xl" open={isOpen} onClose={() => {}}>
        <Dialog.Panel className='p-2'>
          <form onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Title>
            <div className="flex justify-between flex-wrap w-full">
              <h2 className="mr-auto text-base font-medium">
                Barang
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
                  Detail Surat Jalan
                </div>
              </div>
              <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                <Button variant="primary" className="w-8 h-8 rounded-full">
                  2
                </Button>
                <div className="ml-3 text-base font-medium lg:w-32 lg:mt-3 lg:mx-auto">
                  Barang
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
                  {
                    selectedPo && barangPoData && barangPoData.map((el: any, i: number) => (
                      <Disclosure id={el} className={`${hiddenItem?.includes(el?.id) ? 'hidden' : ''}`}>
                      <Disclosure.Button>
                        Barang {i+1}
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <div className="flex flex-col gap-2 flex-wrap">
                          <div className="flex justify-end">
                            <Lucide icon="X" className="w-6 h-6 text-danger cursor-pointer" onClick={() => {
                              setHiddenItem((prevState) => [...prevState, el?.id]);
                            }} />
                          </div>
                          <div className="w-full">
                              <FormLabel>Pilih Barang</FormLabel>
                              <FormInput disabled {...register(`nama.${i}.values`, {required: 'Nama barang tidak boleh kosong'})} />
                          </div>
                          <div className="w-full">
                              <FormLabel>Jumlah</FormLabel>
                              <FormInputCurrency
                                value={getValues(`qty.${i}.values`)}
                                onValueChange={(value: string | undefined) => {
                                  setValue(`qty.${i}.values`, value)
                                }}
                                groupSeparator="."
                                decimalSeparator=","
                              />
                          </div>
                          <div className="w-full mb-10">
                              <FormLabel>Satuan</FormLabel>
                              <FormInput {...register(`satuan.${i}.values`, {required: 'Jumlah barang tidak boleh kosong'})} disabled type="text" placeholder="" />
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </Disclosure>
                    ))
                  }
                  {!selectedPo && barangList.map((el, i) => (
                    <Disclosure id={el}>
                    <Disclosure.Button>
                      Barang {i+1}
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="flex flex-col gap-2 flex-wrap">
                      <div className="w-full">
                            <FormLabel>Nama</FormLabel>
                            <CreatableSelect
                              isClearable
                              isSearchable
                              value={getValues(`selectedBarang.${i}.values`)}
                              required
                              onChange={(e) => {
                                setValue(`selectedBarang.${i}.values`, e);
                                setValue(`nama.${i}.values`, e?.label);
                                setValue(`kode.${i}.values`, e?.kode ? e?.kode : e?.label);
                                setValue(`stokQty.${i}.values`, e?.qty);
                                setValue(`satuan.${i}.values`, e?.satuan);
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
                                - Discount ({thousandLimiter(Number(getValues(`discount.${i}.values`) ? Number(getValues(`discount.${i}.values`)) : 0), 'Rp')})
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
                  {
                    !selectedPo && <div className="flex justify-start mt-4">
                    <Button type="button" size="sm" variant="outline-danger" onClick={()=> {
                      const confirmation = confirm('Apakah anda yakin ingin reset form barang?')
                      if (confirmation) {
                        setBarangList(['barang_1']);
                        const temp: OptionsProps[] = [...barangPoOptions];
                        barangPoOptions.map((item, index) => {
                          temp[index].isDisabled = false;
                        });
                        setBarangPoOptions(temp);
                        setMaxQtyList([]);
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
                  }
                  {
                    selectedPo &&  <Button type="button" size="sm" variant="outline-primary" onClick={()=> {
                      setHiddenItem([]);
                    }}
                    className="w-22 mr-1 mt-4"
                      >
                      <Lucide icon="RotateCcw" className="w-4 h-4 mr-2" />
                      Reload Data
                    </Button>
                  }
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
  stokList,
  handleReloadStok,
  ptList,
  isModalOpen,
  setIsModalOpen,
}: TambahPoModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const formSchema = Yup.object().shape({
      namaSupir: Yup.string(),
      tanggal: Yup.string().required('Tanggal tidak boleh kosong'),
    });
    const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors} } = useForm<Omit<SuratJalanPoInputs, 'id'>>({
      resolver: yupResolver(formSchema)
    });
    const [selectedPo, setSelectedPo] = useState<SingleValue<any>|null>();
    const [selectedPt, setSelectedPt] = useState<SingleValue<any>|null>();
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const [isBarangModalOpen, setIsBarangModalOpen] = useState<boolean>(false);
    const [barangPoList, setBarangPoList] = useState<any[]>([]);
    const [step, setStep] = useState<number>(1);
    const [poList, setPoList] = useState<IPo[]>([]);
    const [poOptions, setPoOptions] = useState<OptionsProps[]>([]);
    const [isPo, setIsPo] = useState<boolean>(true);
    const [stokPoList, setStokPoList] = useState<any>([]);

    const onSubmit: SubmitHandler<Omit<SuratJalanPoInputs, 'id'>> = (data, event) => {
        if (step === 1) {
          if (selectedPo?.detail?.statusSJ === 'Selesai') {
            alert(`Semua barang pada PO ${selectedPo?.label} sudah selesai diambil`);
            return false;
          }
          setIsBarangModalOpen(true);
          setStep(2);
        } else if (step === 3) {
          setIsSubmitLoading(true);
          data.createdBy = userInfo.name;
          const suratJalan =  {
              tanggal: new Date(data.tanggal),
              namaSupir: data.namaSupir,
              poId: selectedPo?.value,
              createdBy: data.createdBy,
              createdAt: new Date(),
              tokoId: userInfo.tokoId
          };
          const barangPo = barangPoList;
          const isDirect = selectedPo ? false : true;
          const po = {
            ptId: selectedPt?.value,
          }
          let totalBayar: number = 0;
          let pembayaran = {};
          if (!selectedPo) {
            barangPoList.map((item: any) => totalBayar += Number(item.jumlahHarga));
            pembayaran = {
              metodePembayaran: METODE_PEMBAYARAN.CICILAN,
              totalPembayaran: totalBayar,
              jumlahBayar: 0,
              isApprove: false,
              createdAt: new Date(),
              createdBy: userInfo.name
            }
          }
          const payload: any = {
            suratJalan,
            barangPo,
            po,
            isDirect,
            pembayaran,
            stokPo: stokPoList
          };
          console.log(payload, ">>> payload create sj");
          SuratJalanPoModule.create(payload)
          .then((res: AxiosResponse) => {
            const result = res.data;
            setIsModalOpen(false);
            setBarangPoList([]);
            reset();
            setStep(1);
            if (result.code === 201) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }
            handleReloadStok();
          })
          .catch((error) => toast.error(error.message))
          .finally(() => {
            setIsPo(false);
            setSelectedPo(null);
            setIsSubmitLoading(false)
          });
        }
    }

    const fetchPoData = (search: string | undefined, page: number, perPage: number, ptId: string, projectId: string, status: string) => {
      const params = {
        search,
        page,
        perPage,
        ptId,
        projectId,
        status
      };

      PoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        const temp: OptionsProps[] = [];
        result.data.map((item: IPo, index: number) => {
          temp.push({
            label: item.noPo,
            value: item.id,
            detail: item
          });
        });
        setPoOptions(temp);
        setPoList(result.data)
      });
    }

    useEffect(() => {
      if (isBarangModalOpen) {
        setIsModalOpen(false);
      } else {
        setIsModalOpen(true);
      }
    }, [isBarangModalOpen]);

    useEffect(() => {
      fetchPoData(undefined, 1, 1000, 'all', 'all', 'all');
      setIsModalOpen(false);
    }, []);

    useEffect(() => {
      if (!isPo) {
        setSelectedPo(null);
      }
    }, [isPo]);

    console.log(ptList, ">>> ptLIst");

    return (
      <div>
        <Toaster/>
        <BarangPoModal
          stokList={stokList}
          selectedPo={selectedPo}
          isOpen={isBarangModalOpen}
          setIsOpen={setIsBarangModalOpen}
          barangPoList={barangPoList}
          setBarangPoList={setBarangPoList}
          step={step}
          setStep={setStep}
          stokPoList={stokPoList}
          setStokPoList={setStokPoList}
        />
        <Dialog size="xl" open={isModalOpen} onClose={() => {}}>
            {
              step === 1 &&
              <Dialog.Panel className="p-2">
              <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Title>
                  <div className="flex justify-between flex-wrap w-full">
                    <h2 className="mr-auto text-base font-medium">
                        Detail Surat Jalan
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
                      Detail Surat Jalan
                    </div>
                  </div>
                  <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                    <Button  className="w-8 h-8 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                      2
                    </Button>
                    <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                      Barang
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
                              <FormLabel htmlFor="regular-form-1">Nama Supir</FormLabel>
                              <FormInput {...register('namaSupir')} autoComplete="off" id="regular-form-1" type="text" placeholder="" className={`${errors.namaSupir && "border-danger"}`} />
                              {errors.namaSupir && 
                                <div className="mt-2 text-danger">
                                    {errors.namaSupir.message}
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
                                options={{
                                  showWeekNumbers: true,
                                  dropdowns: {
                                    minYear: 1990,
                                    maxYear: null,
                                    months: true,
                                    years: true,
                                  },
                                }}
                                className={`${errors.tanggal && "border-danger"}`}
                              />
                               {errors.tanggal && 
                                <div className="mt-2 text-danger">
                                    {errors.tanggal.message}
                                </div>
                              }
                          </div>
                          <div className="col-span-12 sm:col-span-6">
                            <FormCheck className='mt-4'>
                                <FormCheck.Input checked={isPo} id="vertical-form-3" type="checkbox" onChange={(e) => {
                                  setIsPo(isPo !== Boolean(e.target.value))
                                }} value={String(!isPo)} />
                                <FormCheck.Label htmlFor="vertical-form-3">
                                  Surat Jalan dengan No. PO
                                </FormCheck.Label>
                            </FormCheck>
                          </div>
                          {
                            isPo ? 
                            <div className="col-span-12 sm:col-span-6">
                              <FormLabel htmlFor="modal-form-6">
                                  No. PO
                              </FormLabel>
                              <Select
                                className="basic-single"
                                defaultValue={selectedPo}
                                isSearchable
                                isClearable
                                name="po"
                                options={poOptions}
                                onChange={(e: SingleValue<OptionsProps>) => {
                                  setSelectedPo(e);
                                }}
                              />
                            </div>
                            : <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-6">
                                PT
                            </FormLabel>
                            <Select
                              className="basic-single"
                              defaultValue={selectedPt}
                              isSearchable
                              isClearable
                              name="ptId"
                              options={ptList}
                              onChange={(e: any) => {
                                setSelectedPt(e);
                              }}
                            />
                          </div>
                          }
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
                      Detail Surat Jalan
                    </div>
                  </div>
                  <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                    <Button  className="w-8 h-8 rounded-full text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                      2
                    </Button>
                    <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto text-slate-600 dark:text-slate-400">
                      Barang
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
                  {/* <Lucide icon="CheckCircle" className="w-8 h-8 mr-2 text-success" /> */}
                  Review
                  <hr/>
                </div>
                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="mt-4">
                    <label className="text-md font-semibold">1. Detail Surat Jalan</label>
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Nama Supir</FormLabel>
                      <FormInput value={getValues('namaSupir')} disabled id="regular-form-1" type="text" placeholder="" />
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Tanggal</FormLabel>
                      <Litepicker
                          {...register('tanggal', {required: 'Tanggal PO tidak boleh kosong'})}
                          autoComplete="off"
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
                      {/* <FormInput value={getValues('tanggal')} disabled id="regular-form-1" type="date" placeholder="" /> */}
                  </div>
                  {
                    selectedPo ?  <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="modal-form-6">
                        No. PO
                    </FormLabel>
                    <FormInput value={selectedPo?.label} disabled id="regular-form-1" type="text" placeholder="" />
                  </div> : <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-6">
                          PT
                      </FormLabel>
                      <FormInput value={selectedPt?.label} disabled id="regular-form-1" type="text" placeholder="" />
                  </div> 
                  }                                     
                </div>
                <Disclosure.Group variant="boxed" className="mt-6">
                <div className="mb-4 mt-8">
                    <label className="text-md font-semibold">2. Barang</label>
                </div>
                <div>
                  {selectedPo && barangPoList.map((item, i) => (
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
                            <FormInputCurrency
                              value={item.qty}
                              disabled
                              groupSeparator="."
                              decimalSeparator=","
                            />
                            {/* <FormInput value={item.qty} disabled min='1' type="number" placeholder="0" /> */}
                        </div>
                        <div className="w-full">
                            <FormLabel>Satuan</FormLabel>
                            <FormInput value={item.satuan} disabled type="text" placeholder="Ex: Pcs, Kg, Liter" />
                        </div>
                      </div>
                    </Disclosure.Panel>
                  </Disclosure>
                  ))}
                  {!selectedPo && barangPoList.map((item, i) => (
                    <Disclosure id={i}>
                    <Disclosure.Button>
                      Barang {i+1}
                    </Disclosure.Button>
                    <Disclosure.Panel>
                      <div className="flex flex-col gap-2 flex-wrap">
                        <div className="w-full">
                            <FormLabel>Nama</FormLabel>
                            <FormInput value={item?.nama} disabled type="text" placeholder="Nama Barang" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Qty</FormLabel>
                            <FormInputCurrency
                              value={item?.qty}
                              disabled
                              groupSeparator="."
                              decimalSeparator=","
                            />
                        </div>
                        <div className="w-full">
                            <FormLabel>Satuan</FormLabel>
                            <FormInput value={item?.satuan} disabled type="text" placeholder="Satuan Barang" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Harga</FormLabel>
                            <FormInputCurrency
                              value={item?.harga}
                              disabled
                              groupSeparator="."
                              decimalSeparator=","
                            />
                        </div>
                        {/* <div className="w-full">
                            <FormLabel>Discount</FormLabel>
                            <FormInputCurrency
                              value={item?.discount}
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
                  <div className="flex justify-start mt-4">
                  </div>
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
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const { register, handleSubmit, watch, setValue, getValues, reset, formState: {errors} } = useForm<SuratJalanPoInputs>({
      defaultValues: {
        id: initialValues.id,
        nomor: initialValues.nomor,
        namaSupir: initialValues.namaSupir,
        // tanggal: moment(initialValues.tanggal).format('YYYY-MM-DD'),
        poId: initialValues.poId,
      }
    });
    const [selectedPt, setSelectedPt] = useState<string|undefined>()
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const onSubmit: SubmitHandler<SuratJalanPoInputs> = (data, event) => {
        setIsSubmitLoading(true);
        // data.updatedBy = 'Rio';
        // const payload: PoPayload & BarangPoInputs = {
        //     po: {
        //       id: data.id,
        //       noPo: data.noPo,
        //       tanggal: new Date(data.tanggal),
        //       ptId: data.ptId,
        //       projectId: data.projectId,
        //       createdBy: data.createdBy,
        //       updatedBy: data.updatedBy,
        //     } as IPo,
        //     barangPo: data.barangPo
        // }
        // console.log(payload);
        // PoModule.update(payload)
        // .then(res => res.json())
        // .then(result => {
        //   setIsEditModalOpen(false);
        //   reset();
        //   if (result.code === 200) {
        //     toast.success(result.message);
        //   } else {
        //     toast.error(result.message);
        //   }
        //   handleReloadStok();
        // })
        // .catch((error) => toast.error(error.message))
        // .finally(() => setIsSubmitLoading(false));
    }

    // const fetchProjectData = (search: string | undefined, page: number, perPage: number, ptId: string) => {
    //   const params = {
    //       search,
    //       page,
    //       perPage,
    //       ptId
    //   }
    //   ProjectModule.get(params)
    //   .then(res => res.json())
    //   .then(result => setProjectList(result.data));
    // }

    // useEffect(() => {
    //   fetchProjectData("", 1, 1000, getValues('ptId'));
    // }, [selectedPt]);

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
                            {/* <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">No. Surat Jalan</FormLabel>
                                <FormInput {...register('nomor', {required: 'Nomor PO tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                            </div> */}
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Tanggal PO</FormLabel>
                                <FormInput {...register('tanggal', {required: 'Tanggal PO tidak boleh kosong'})} id="regular-form-1" type="date" placeholder="" />
                            </div>
                            {/* <div className="col-span-12 sm:col-span-6">
                                <FormLabel htmlFor="modal-form-6">
                                    PT
                                </FormLabel>
                                <FormSelect {...register('poId')} onChange={(e: ChangeEvent) => {
                                    setSelectedPt((e.target as HTMLSelectElement).value);
                                    setValue('poId', (e.target as HTMLSelectElement).value);
                                  }} id="modal-form-6">
                                    <option value=''>-- Pilih PO --</option>
                                    {poList.length > 0 ? poList.map((item, index) => (
                                        <option selected={item.id === initialValues.poId} value={item.id}>{item.noPo}</option>
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
                            </div> */}
                        </div>
                        <Disclosure.Group variant="boxed" className="mt-6">
                      <div>
                  {/* {getValues('barangPo').map((item, i) => (
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
                            <FormInput {...register(`barangPo.${i}.qty`, {required: 'Jumlah barang tidak boleh kosong'})} value={item.qty} min='1' type="number" placeholder="0" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Satuan</FormLabel>
                            <FormInput {...register(`barangPo.${i}.satuan`, {required: 'Satuan barang tidak boleh kosong'})} value={item.satuan} type="text" placeholder="Ex: Pcs, Kg, Liter" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Harga</FormLabel>
                            <FormInput {...register(`barangPo.${i}.harga`, {required: 'Harga barang tidak boleh kosong'})} value={item.harga} min='0' type="number" placeholder="Rp. 0" />
                        </div>
                        <div className="w-full">
                            <FormLabel>Diskon</FormLabel>
                            <FormInput {...register(`barangPo.${i}.discount`)} value={item.discount} min='0' type="number" placeholder="Rp. 0" />
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
                  ))} */}
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

  const onDelete = (initialValues: ISuratJalanPo) => {
    SuratJalanPoModule.destroy(initialValues)
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

const ViewPo = ({initialValues, isDetailModalOpen, setIsDetailModalOpen}: ViewDetailModalProps) => {
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
                      Detail : <span className="font-medium">{initialValues.nomor}</span>
                    </h2>
                </Dialog.Title>
                <Dialog.Description>
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-4 auto-cols-max p-4">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">No. Surat Jalan</label>
                        <span>{initialValues.nomor}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Nama Supir</label>
                        <span>{initialValues.namaSupir}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">Tanggal</label>
                        <span>{moment(initialValues.tanggal).format('DD MMM YYYY')}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold">No. Po</label>
                        <span>{initialValues.Po?.noPo}</span>
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
                    {initialValues.BarangSuratJalanPo.map((item, i) => (
                      <Disclosure id={i}>
                      <Disclosure.Button>
                        Barang {i+1}
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <div className="grid grid-cols-3 gap-4 auto-cols-max">
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Nama</label>
                              <span>{item.nama}</span>
                          </div>
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Qty</label>
                              <span>{item.qty}</span>
                          </div>
                          <div className="w-full flex flex-col gap-1">
                              <label className="font-semibold">Satuan</label>
                              <span>{item.satuan}</span>
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
}

type InvoiceModalProps = {
  handleReloadData: () => void
  invoiceConfirmationModal: boolean
  setInvoiceConfirmationModal: Dispatch<SetStateAction<boolean>>
  invoiceButtonRef: MutableRefObject<HTMLButtonElement | null>
  initialValues: ISuratJalanPo
}

const InvoiceModal = ({
  handleReloadData,
  invoiceConfirmationModal,
  setInvoiceConfirmationModal,
  invoiceButtonRef,
  initialValues
}: InvoiceModalProps) => {
  const userInfo = useAppSelector(SelectUserInfo);
  const onSubmit = (initialValues: ISuratJalanPo) => {
    const payload = {
      tokoId: userInfo.tokoId,
      createdBy: userInfo.name,
      suratJalanPoId: initialValues?.id,
      poId: initialValues?.poId
    }
    // let poListPayload: any = [];
    // selectedPo?.forEach((item) => {
    //   poListPayload.push(item.detail);
    // });
    // console.log(poListPayload);
    // console.log(data);
    // setIsSubmitLoading(true);
    // data.createdBy = userInfo.name;
    // const payload =  {
    //     tokoId: userInfo.tokoId,
    //     nomor: data.nomor,
    //     poListPayload,
    //     createdBy: data.createdBy
    // }
    InvoicePoModule.create(payload)
        .then((res: AxiosResponse) => {
          const result = res.data;
          setInvoiceConfirmationModal(false);
          if (result.code === 201) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          handleReloadData();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => {});
  }

  return (
     <div>
      <Dialog
      open={invoiceConfirmationModal}
      onClose={() => {
        setInvoiceConfirmationModal(false);
      }}
      initialFocus={invoiceButtonRef}
      >
      <Dialog.Panel>
        <div className="p-5 text-center">
          <Lucide
            icon="StickyNote"
            className="w-16 h-16 mx-auto mt-3 text-primary"
          />
          <div className="mt-5 text-3xl">Buat Invoice?</div>
          <div className="mt-2 text-slate-500">
            Apakah Anda yakin ingin membuat invoice dari surat jalan ini? <br />
            Data invoice akan ditambahkan ke daftar invoice.
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => {
              setInvoiceConfirmationModal(false);
            }}
            className="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            className="w-24"
            ref={invoiceButtonRef}
            onClick={() => onSubmit(initialValues)}
          >
            OK
          </Button>
        </div>
      </Dialog.Panel>
      </Dialog>
     </div>
  )
}

type BatalModalProps = {
  handleReloadData: () => void
  batalConfirmationModal: boolean
  setBatalConfirmationModal: Dispatch<SetStateAction<boolean>>
  batalButtonRef: MutableRefObject<HTMLButtonElement | null>
  initialValues: ISuratJalanPo
}

const BatalModal = ({
  handleReloadData,
  batalConfirmationModal,
  setBatalConfirmationModal,
  batalButtonRef,
  initialValues
}: BatalModalProps) => {

  const onSubmit = (initialValues: ISuratJalanPo) => {
    SuratJalanPoModule.cancel(initialValues)
        .then((res: AxiosResponse) => {
          const result = res.data;
          setBatalConfirmationModal(false);
          if (result.code === 200) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          handleReloadData();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => {});
  }

  return (
     <div>
      <Dialog
      open={batalConfirmationModal}
      onClose={() => {
        setBatalConfirmationModal(false);
      }}
      initialFocus={batalButtonRef}
      >
      <Dialog.Panel>
        <div className="p-5 text-center">
          <Lucide
            icon="RotateCcw"
            className="w-16 h-16 mx-auto mt-3 text-warning"
          />
          <div className="mt-5 text-3xl">Apakah Anda yakin?</div>
          <div className="mt-2 text-slate-500">
            Apakah Anda yakin ingin membatalkan surat jalan ini? <br />
            Data barang akan dikembalikan ke stok barang.
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => {
              setBatalConfirmationModal(false);
            }}
            className="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            type="button"
            className="w-24"
            ref={batalButtonRef}
            onClick={() => onSubmit(initialValues)}
          >
            OK
          </Button>
        </div>
      </Dialog.Panel>
      </Dialog>
     </div>
  )
}

const ActionButtons = ({
  handleReloadStok,
  initialValues,
  ptList,
  }
  : ActionButtonsProps) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const [batalConfirmationModal, setBatalConfirmationModal] = useState(false);
  const batalButtonRef = useRef(null);
  const [invoiceConfirmationModal, setInvoiceConfirmationModal] = useState(false);
  const invoiceButtonRef = useRef(null);
  const printRef = useRef<any>(null);
  const handlePrint = useReactToPrint({
    documentTitle: `Surat Jalan - ${initialValues.nomor}`,
    content: () => printRef.current,
  });

  return (
    <>
    <div className="hidden">
      <SuratJalanPoPrint ref={printRef} initialValues={initialValues} />
    </div>
    <InvoiceModal
      handleReloadData={handleReloadStok}
      invoiceConfirmationModal={invoiceConfirmationModal}
      setInvoiceConfirmationModal={setInvoiceConfirmationModal}
      invoiceButtonRef={invoiceButtonRef}
      initialValues={initialValues}
    />
    <ViewPo 
      initialValues={initialValues}
      isDetailModalOpen={isDetailModalOpen}
      setIsDetailModalOpen={setIsDetailModalOpen}
    />
    <EditBarangModal 
      handleReloadStok={handleReloadStok}
      initialValues={initialValues}
      ptList={ptList}
      isEditModalOpen={isEditModalOpen}
      setIsEditModalOpen={setIsEditModalOpen}
    />
    <BatalModal
      handleReloadData={handleReloadStok}
      batalConfirmationModal={batalConfirmationModal}
      setBatalConfirmationModal={setBatalConfirmationModal}
      batalButtonRef={batalButtonRef}
      initialValues={initialValues}
    />
    <DeleteConfirmationModal
      handleReloadStok={handleReloadStok}
      deleteConfirmationModal={deleteConfirmationModal}
      setDeleteConfirmationModal={setDeleteConfirmationModal}
      deleteButtonRef={deleteButtonRef}
      initialValues={initialValues}
    />
    <div className="flex items-center justify-start gap-4">
        <a className="flex items-center mr-3" href="#" onClick={(event) => {
          event.preventDefault();
          setInvoiceConfirmationModal(true);
        }}>
        <Lucide icon="StickyNote" className="w-4 h-4 mr-1" />{" "}
        Invoice
        </a>
      <a className="flex items-center mr-3" href="#" onClick={() => {
        setIsDetailModalOpen(true);
      }}>
        <Lucide icon="View" className="w-4 h-4 mr-1" />{" "}
        Detail
      </a>
      {/* <a
          className="flex items-center mr-3"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            setBatalConfirmationModal(true);
          }}
        >
      <Lucide icon="RotateCcw" className="w-4 h-4 mr-1" /> Batal
      </a> */}
      <a className="flex items-center mr-3" href="#" onClick={handlePrint}>
        <Lucide icon="Printer" className="w-4 h-4 mr-1" />{" "}
        Print
      </a>
      {
        initialValues?.InvoicePo.length < 1 && <a
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

type InvoiceDetailType = {
  item: ISuratJalanPo,
  index: number
}

const InvoiceDetail = (props: InvoiceDetailType) => {
  return (
    <div className="tooltip-content">
    <TippyContent to={`tooltip-content-${props.index}`}>
        <div className="relative flex items-center py-1">
            <div className="ml-4 mr-auto">
                <div className="text-slate-500 dark:text-slate-400">
                    {
                      props.item.InvoicePo.map((inv, i) => <li>{inv.nomor}</li>)
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
  const [suratJalanPoList, setSuratJalanPoList] = useState<ISuratJalanPo[]>([]);
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
  const [selectedStatus, setSelectedStatus] = useState<SingleValue<any>>({
    label: 'Semua Status',
    value: 'all'
  });
  const [stokList, setStokList] = useState<IStok[]>();
  const [poSearch, setPoSearch] = useState<string|undefined>();
  const [selectedPo, setSelectedPo] = useState<any>(null);

  const handleReloadStok = () => {
    setIsRefreshData(!isRefreshData);
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
          project: item.Project
        })
      })
      setProjectList(temp)
  }

  const loadPoOptions = async (inputValue: string) => {
    return await PoModule.getList(inputValue)
    .then((res: AxiosResponse) => res.data.data);
  }

  const fetchSuratJalanPoData = (
    search: string | undefined,
    page: number,
    perPage: number,
    status: string,
    poId: string,
    ptId: string,
    projectId: string,

    ) => {
    setIsDataLoading(true);
    const params = {
      search,
      page,
      perPage,
      status,
      poId,
      ptId,
      projectId
    }
    console.log(params, ">> paramss");
    if (search) {
      setTimeout(() => {
      SuratJalanPoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setSuratJalanPoList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log("surat jalan po", result.data);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
      }, 1000)
    } else {
      SuratJalanPoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data
        setSuratJalanPoList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log("surat jalan po", result.data);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const handleReset = () => {
    setSelectedStatus({
      label: 'Semua Status',
      value: 'all'
    });
    setSelectedPo(null);
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

  useEffect(() => {
    fetchPtList();
    fetchStokBarangData(undefined, 1, 1000, 'all', TabStatus.STOK_TERSEDIA);
  }, [])

  useEffect(() => {
    fetchSuratJalanPoData(search, page, perPage, selectedStatus?.value, selectedPo?.id, selectedPt?.value, selectedProject?.value);
  }, [isRefreshData, page, perPage]);

  useEffect(() => {
    if (selectedPt) {
      fetchProjectList(selectedPt.project);
    }
  }, [selectedPt])

  return (
    <>
      <Toaster/>
      <TambahPoModal
        stokList={stokList}
        handleReloadStok={handleReloadStok}
        ptList={ptList}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen} 
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Surat Jalan PO</h2>
      <div className="grid grid-cols-12 gap-6 mt-14 lg:mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <div className="-mt-11 flex gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setIsModalOpen(true)}>
            Tambah Surat Jalan
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
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
              <div className="relative w-56">
                <Select placeholder='Semua Status' options={StatusList} value={selectedStatus} onChange={(e) => {
                  setSelectedStatus(e);
                }}  />
              </div>
            </div>
            <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
              <div className="relative w-56">
              <AsyncSelect 
                placeholder='Semua PO'
                getOptionLabel={(e: any) => e?.noPo}
                getOptionValue={(e: any) => e?.id}
                defaultOptions
                value={selectedPo}
                loadOptions={loadPoOptions}
                onChange={(e: any) => setSelectedPo(e)}
                onInputChange={(e: any) => setPoSearch(e)}
              />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
              <div className="relative w-56">
                <Select placeholder='Semua PT' options={ptList} value={selectedPt} onChange={(e) => {
                setSelectedPt(e);
                setSelectedProject({
                  label: 'Semua Project',
                  value: 'all'
                })
                }} />
              </div>
            </div>
            <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
              <div className="relative w-56">
                <Select placeholder='Semua Project' isDisabled={!selectedPt} options={projectList} value={selectedProject} onChange={(e) => setSelectedProject(e)} />
              </div>
            </div>
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0 lg:-mt-11">
            <div className="relative w-56 text-slate-500">
              <FormInput
                value={search}
                onChange={(e) => handleSearch(e)}
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Cari Surat Jalan..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
          <Button variant="primary" className="shadow-md lg:-mt-11" onClick={() => handleReloadStok()}>
            <Lucide icon="Filter" className="w-4 h-4 mr-2" />
              Filter
          </Button>
          <Button variant="warning" className="shadow-md lg:-mt-11" onClick={() => handleReset()}>
            <Lucide icon="RotateCcw" className="w-4 h-4 mr-2" />
              Reset
          </Button>
        </div>
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y">
          {!isDataLoading ? <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NO. SURAT JALAN
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NO. PO
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NAMA SUPIR
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  DIBUAT OLEH
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TANGGAL
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  AKSI
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {suratJalanPoList.length > 0 ? suratJalanPoList.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.nomor}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.Po?.noPo}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.namaSupir}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.createdBy}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {moment(item.tanggal).format('DD/MM/YYYY')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.InvoicePo.length > 0 ? <Button variant="outline-success" size='sm' data-tooltip={`tooltip-content-${index}`}>Sudah Invoice</Button> : <Button variant="outline-primary" size='sm'>Belum Invoice</Button>}
                    <div className="hidden">
                      <InvoiceDetail item={item} index={index} />
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <ActionButtons
                      handleReloadStok={handleReloadStok}
                      initialValues={item}
                      ptList={ptList}
                      projectList={projectList}
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

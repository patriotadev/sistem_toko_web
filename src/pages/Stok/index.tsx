import _, { initial } from "lodash";
import clsx from "clsx";
import { useState, useRef, SetStateAction, ChangeEvent, useEffect, MutableRefObject, RefObject, useMemo } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { FormLabel, FormHelp } from "../../base-components/Form";
import { SubmitHandler, useForm } from "react-hook-form";
import StokModule from '../../modules/stok/stok';
import {IToko} from '../../modules/toko/interfaces/toko.interface';
import TokoModule from '../../modules/toko/toko';
import toast, { Toaster } from "react-hot-toast";
import { IFetchQuery, IStok } from "../../modules/stok/interfaces/stok.interface";
import { thousandLimiter } from '../../helpers/helper';
import LoadingIcon from "../../base-components/LoadingIcon";
import PaginationCustom from "../../components/Custom/PaginationCustom";
import { Search } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { SelectUserInfo } from "../../stores/common/userInfoSlice";
import { AxiosResponse } from "axios";
import TabStatus from "./enum/tab.enum";
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputCurrency from "../../components/Custom/FormInputCurrency";

type TambahBarangModalProps = {
    handleReloadStok: () => void
    tokoList: IToko[]
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    isUpdate: boolean
    setIsUpdate: React.Dispatch<SetStateAction<boolean>>
}

type EditBarangModalProps = {
  handleReloadStok: () => void,
  tokoList: IToko[],
  initialValues: IStok,
  isEditModalOpen: boolean
  setIsEditModalOpen: React.Dispatch<SetStateAction<boolean>>
  tab: string
}

type DeleteConfirmationModalProps = {
  handleReloadStok: () => void
  deleteConfirmationModal: boolean
  deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
  setDeleteConfirmationModal: React.Dispatch<SetStateAction<boolean>>
  initialValues: IStok,
}

type ActionButtonsProps = {
  handleReloadStok: () => void,
  initialValues: IStok,
  tokoList: IToko[],
  tab: string
}

type StokBarangInputs = {
    id: string
    kode: string,
    nama: string
    jumlah: number
    satuan: string
    hargaModal: number
    hargaJual: number
    createdBy: string
    updatedBy?: string
    tokoId: string
    jumlahPo: number
    jumlahStokBaru?: string
    isPo: boolean
}

const TambahBarangModal = ({
  handleReloadStok,
  tokoList,
  isModalOpen,
  setIsModalOpen,
}: TambahBarangModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const formSchema = Yup.object().shape({
      nama: Yup.string().required('Nama barang tidak boleh kosong'),
      jumlah: Yup.number().typeError('Input jumlah harus tipe angka / numeric').min(0, 'Jumlah tidak boleh kurang dari 0').required('Jumlah barang tidak boleh kosong'),
      satuan: Yup.string().required('Satuan barang tidak boleh kosong'),
      hargaModal: Yup.number().typeError('Input harga modal harus tipe angka / numeric').min(0, 'Harga modal tidak boleh kurang dari 0').required('Harga modal barang tidak boleh kosong'),
      hargaJual: Yup.number().typeError('Input harga jual harus tipe angka / numeric').min(0, 'Harga jual tidak boleh kurang dari 0').required('Harga jual barang tidak boleh kosong'),
    });
    const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors} } = useForm<Omit<StokBarangInputs, 'id'>>({
      resolver: yupResolver(formSchema)
    });

    const onSubmit: SubmitHandler<Omit<StokBarangInputs, 'id'>> = (data, event) => {
        setIsSubmitLoading(true);
        data.createdBy = userInfo.name;
        const payload = {
            nama: data.nama,
            jumlah: Number(data.jumlah),
            satuan: data.satuan,
            hargaModal: Number(data.hargaModal),
            hargaJual: Number(data.hargaJual),
            createdBy: data.createdBy,
            tokoId: userInfo.tokoId,
        }
        StokModule.create(payload)
        .then((res: AxiosResponse) => {
          const result = res.data;
          setIsModalOpen(false);
          reset();
          if (result.code === 201) {
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
          handleReloadStok();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setIsSubmitLoading(false));
    }

    useEffect(() => {
      watch('jumlah');
      watch('hargaModal');
      watch('hargaJual');
    }, [])

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
                                <FormLabel htmlFor="regular-form-1">Nama Barang</FormLabel>
                                <FormInput {...register('nama', {required: 'Nama barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="text" placeholder="" className={`${errors.nama && "border-danger"}`} />
                                {errors.nama && 
                                  <div className="mt-2 text-danger">
                                      {errors.nama.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Jumlah</FormLabel>
                                {/* <FormInput {...register('jumlah', {required: 'Jumlah barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.jumlah && "border-danger"}`} /> */}
                                <FormInputCurrency
                                  value={getValues(`jumlah`)}
                                  onValueChange={(value: string | undefined) => setValue(`jumlah`, value ? Number(value) : 0)}
                                  groupSeparator="."
                                  decimalSeparator=","
                                  className={`${errors.jumlah && "border-danger"}`}
                                  />
                                {errors.jumlah && 
                                  <div className="mt-2 text-danger">
                                      {errors.jumlah.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Satuan</FormLabel>
                                <FormInput {...register('satuan', {required: 'Satuan barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="text" placeholder="" className={`${errors.satuan && "border-danger"}`} />
                                {errors.satuan && 
                                  <div className="mt-2 text-danger">
                                      {errors.satuan.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Harga Modal</FormLabel>
                                {/* <FormInput {...register('hargaModal', {required: 'Harga modal barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.hargaModal && "border-danger"}`} /> */}
                                <FormInputCurrency
                                  prefix="Rp. "
                                  value={getValues(`hargaModal`)}
                                  onValueChange={(value: string | undefined) => setValue(`hargaModal`, value ? Number(value) : 0)}
                                  groupSeparator="."
                                  decimalSeparator=","
                                  className={`${errors.hargaModal && "border-danger"}`}
                                  />
                                  {errors.hargaModal && 
                                    <div className="mt-2 text-danger">
                                        {errors.hargaModal.message}
                                    </div>
                                  }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Harga Jual</FormLabel>
                                {/* <FormInput {...register('hargaJual', {required: 'Harga jual barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.hargaJual && "border-danger"}`} /> */}
                                <FormInputCurrency
                                prefix="Rp. "
                                value={getValues(`hargaJual`)}
                                onValueChange={(value: string | undefined) => setValue(`hargaJual`, value ? Number(value) : 0)}
                                groupSeparator="."
                                decimalSeparator=","
                                className={`${errors.hargaJual && "border-danger"}`}
                                />
                                {errors.hargaJual && 
                                  <div className="mt-2 text-danger">
                                      {errors.hargaJual.message}
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
    );
}

const EditBarangModal = ({
  handleReloadStok,
  tokoList,
  initialValues,
  isEditModalOpen,
  tab,
  setIsEditModalOpen,
}: EditBarangModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const formSchema = Yup.object().shape({
      nama: Yup.string().required('Nama barang tidak boleh kosong'),
      jumlah: Yup.number().typeError('Input jumlah harus tipe angka / numeric').min(0, 'Jumlah tidak boleh kurang dari 0').required('Jumlah barang tidak boleh kosong'),
      satuan: Yup.string().required('Satuan barang tidak boleh kosong'),
      hargaModal: Yup.number().typeError('Input harga modal harus tipe angka / numeric').min(0, 'Harga modal tidak boleh kurang dari 0').required('Harga modal barang tidak boleh kosong'),
      hargaJual: Yup.number().typeError('Input harga jual harus tipe angka / numeric').min(0, 'Harga jual tidak boleh kurang dari 0').required('Harga jual barang tidak boleh kosong'),
    });
    const { register, handleSubmit, setValue, getValues, reset, formState: {errors} } = useForm<StokBarangInputs>({
      defaultValues: {
        id: initialValues.id,
        kode: initialValues.kode,
        nama: initialValues.nama,
        jumlah: initialValues.jumlah,
        satuan: initialValues.satuan,
        hargaModal: initialValues.hargaModal,
        hargaJual: initialValues.hargaJual,
        createdBy: initialValues.createdBy,
        tokoId: initialValues.tokoId,
        jumlahPo: Number(initialValues.jumlahPo),
        isPo: initialValues.isPo
      },
      resolver: yupResolver(formSchema)
    });

    console.log(initialValues);

    const onSubmit: SubmitHandler<StokBarangInputs> = (data, event) => {
        setIsSubmitLoading(true);
        data.updatedBy = userInfo.name;
        const payload = {
            id: data.id,
            kode: data.kode,
            nama: data.nama,
            jumlah: data.jumlahStokBaru ? Number(data.jumlah) + Number(data.jumlahStokBaru) : Number(data.jumlah),
            satuan: data.satuan,
            hargaModal: Number(data.hargaModal),
            hargaJual: Number(data.hargaJual),
            createdBy: data.createdBy,
            jumlahPo: data.jumlahStokBaru ? Number(data.jumlahPo) - Number(data.jumlahStokBaru) <= 0 ? 0 : Number(data.jumlahPo) - Number(data.jumlahStokBaru) : data.jumlahPo,
            tokoId: data.tokoId,
            isPo: data.jumlahStokBaru ? Number(data.jumlahPo) - Number(data.jumlahStokBaru) <= 0 ? false : true : data.isPo,
            updatedBy: data.updatedBy,
        };
        StokModule.update(payload)
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

    return (
        <Dialog size="lg" open={isEditModalOpen} onClose={()=> {
            setIsEditModalOpen(false);
            }}
            >
            <Dialog.Panel className="p-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Title>
                    <h2 className="mr-auto text-base font-medium">
                        Form Edit Barang
                    </h2>
                </Dialog.Title>
                <Dialog.Description>
                        <div className="flex flex-col gap-4 flex-wrap">
                          {
                            tab === TabStatus.STOK_TERSEDIA ? <>
                              <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama Barang</FormLabel>
                                <FormInput {...register('nama', {required: 'Nama barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="text" placeholder="" className={`${errors.nama && "border-danger"}`} />
                                {errors.nama && 
                                  <div className="mt-2 text-danger">
                                      {errors.nama.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Jumlah</FormLabel>
                                <FormInput {...register('jumlah', {required: 'Jumlah barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.jumlah && "border-danger"}`} />
                                {errors.jumlah && 
                                  <div className="mt-2 text-danger">
                                      {errors.jumlah.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Satuan</FormLabel>
                                <FormInput {...register('satuan', {required: 'Satuan barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="text" placeholder="" className={`${errors.satuan && "border-danger"}`} />
                                {errors.satuan && 
                                  <div className="mt-2 text-danger">
                                      {errors.satuan.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Harga Modal</FormLabel>
                                <FormInput {...register('hargaModal', {required: 'Harga modal barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.hargaModal && "border-danger"}`} />
                                {errors.hargaModal && 
                                  <div className="mt-2 text-danger">
                                      {errors.hargaModal.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Harga Jual</FormLabel>
                                <FormInput {...register('hargaJual', {required: 'Harga jual barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.hargaJual && "border-danger"}`} />
                                {errors.hargaJual && 
                                  <div className="mt-2 text-danger">
                                      {errors.hargaJual.message}
                                  </div>
                                }
                            </div>
                            </>
                            :
                            <>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Jumlah PO</FormLabel>
                                <FormInput {...register('jumlahPo', {required: 'Jumlah barang PO tidak boleh kosong'})} disabled autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.jumlahPo && "border-danger"}`} />
                                {errors.jumlahPo && 
                                  <div className="mt-2 text-danger">
                                      {errors.jumlahPo.message}
                                  </div>
                                }
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Jumlah Stok Baru</FormLabel>
                                <FormInput {...register('jumlahStokBaru', {required: 'Jumlah barang tidak boleh kosong'})} autoComplete="off" id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.jumlahStokBaru && "border-danger"}`} />
                                {errors.jumlahStokBaru && 
                                  <div className="mt-2 text-danger">
                                      {errors.jumlahStokBaru.message}
                                  </div>
                                }
                            </div>
                            </>
                          }  
                        </div>
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="outline-secondary" onClick={()=> {
                        setIsEditModalOpen(false);
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
    );
}

const DeleteConfirmationModal = ({
  handleReloadStok,
  deleteConfirmationModal,
  setDeleteConfirmationModal,
  deleteButtonRef,
  initialValues
}: DeleteConfirmationModalProps) => {

  const onDelete = (initialValues: IStok) => {
    StokModule.destroy(initialValues)
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

const ActionButtons = ({
  handleReloadStok,
  initialValues,
  tokoList,
  tab
  }
  : ActionButtonsProps) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);

  return (
    <>
    <EditBarangModal 
      handleReloadStok={handleReloadStok}
      initialValues={initialValues}
      tokoList={tokoList}
      isEditModalOpen={isEditModalOpen}
      setIsEditModalOpen={setIsEditModalOpen}
      tab={tab}
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
        setIsEditModalOpen(true);
      }}>
        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
        Edit
      </a>
        {
          tab === TabStatus.STOK_TERSEDIA && <a
          className="flex items-center text-danger"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            console.log(initialValues);
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

function Main () {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(SelectUserInfo);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [tokoList, setTokoList] = useState<IToko[]>([]);
  const [stokList, setStokList] = useState<IStok[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string|undefined>();
  const [selectedToko, setSelectedToko] = useState<string>('all');
  const [tab, setTab] = useState(TabStatus.STOK_TERSEDIA);

  const handleReloadStok = () => {
    setIsRefreshData(!isRefreshData);
  }

  const handleReset = () => {
    setSearch("");
    setSelectedToko('all');
    setIsRefreshData(!isRefreshData);
  }

  console.log(selectedToko);

  const fetchTokoData = () => {
    TokoModule.getAll()
    .then((res: AxiosResponse) => {
      const result = res.data;
      setTokoList(result.data)
    });
  }

  const fetchStokData = (search: string | undefined, page: number, perPage: number, tokoId: string, tab: string) => {
    setIsDataLoading(true);
    const params = {
      search,
      page,
      perPage,
      tokoId,
      tab
    }

    console.log(params);
    if (search) {
      setTimeout(() => {
      StokModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setStokList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
      }, 1000)
    } else {
      StokModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setStokList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
    }
  }

  console.log(totalPages);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  useEffect(() => {
    fetchTokoData();
  }, []);

  useEffect(() => {
    fetchStokData(search, page, perPage, selectedToko, tab);
  }, [isRefreshData, page, perPage, tab]);

  return (
    <>
      <Toaster/>
      <TambahBarangModal 
        handleReloadStok={handleReloadStok}
        tokoList={tokoList}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen} 
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Stok Barang</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Tab.Group>
                <Tab.List variant="link-tabs" className='bg-white rounded-md shadow-sm dark:bg-darkmode-400/70'>
                    <Tab>
                        <Tab.Button className="w-full py-2" as="button" onClick={() => {
                          setTab(TabStatus.STOK_TERSEDIA);
                          setSearch(undefined);
                        }
                        }>
                            Stok Tersedia
                        </Tab.Button>
                    </Tab>
                    <Tab>
                        <Tab.Button className="w-full py-2" as="button" onClick={() => {
                          setTab(TabStatus.STOK_PO);
                          setSearch(undefined);
                        }}>
                            Stok PO
                        </Tab.Button>
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-5">
                    <Tab.Panel className="leading-relaxed">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap gap-2">
              <Button variant="primary" className="mr-2 shadow-md" onClick={() => setIsModalOpen(true)}>
                Tambah Barang
              </Button>
              <Menu>
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
              </Menu>
              <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0 lg:mx-2">
                <div className="relative w-56">
                  <FormSelect value={selectedToko} onChange={(e: ChangeEvent) => setSelectedToko((e.target as HTMLSelectElement).value)}>
                    <option value='all'>Semua Lokasi</option>
                    {
                      tokoList.map((item, index) => <option key={index} value={item.id}>{item.description}</option>)
                    }
                  </FormSelect>
                </div>
              </div>
              <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                <div className="relative w-56 text-slate-500">
                  <FormInput
                    value={search}
                    onChange={(e) => handleSearch(e)}
                    type="text"
                    className="w-56 pr-10 !box"
                    placeholder="Cari kode / nama barang..."
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
              <Button variant="warning" className="ml-1 shadow-md" onClick={() => handleReset()}>
                <Lucide icon="RotateCcw" className="w-4 h-4 mr-2" />
                  Reset
              </Button>
            </div>
            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto intro-y xl:overflow-visible   mt-4">
              {!isDataLoading ? <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      KODE BARANG
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      NAMA BARANG
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      JUMLAH
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      SATUAN
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      HARGA MODAL
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      HARGA JUAL
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      LOKASI
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      AKSI
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {stokList.length > 0 ? stokList.map((item, index) => (
                    <Table.Tr key={index} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.kode}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.nama}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.jumlah}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.satuan}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {thousandLimiter(item.hargaModal, 'Rp')}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {thousandLimiter(item.hargaJual, 'Rp')}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.toko?.description}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <ActionButtons
                          handleReloadStok={handleReloadStok}
                          initialValues={item}
                          tokoList={tokoList}
                          tab={TabStatus.STOK_TERSEDIA}
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
            </Tab.Panel>
              <Tab.Panel className="leading-relaxed">
              <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap gap-2">
              <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0 lg:mx-2">
                <div className="relative w-56">
                  <FormSelect value={selectedToko} onChange={(e: ChangeEvent) => setSelectedToko((e.target as HTMLSelectElement).value)}>
                    <option value='all'>Semua Lokasi</option>
                    {
                      tokoList.map((item, index) => <option key={index} value={item.id}>{item.description}</option>)
                    }
                  </FormSelect>
                </div>
              </div>
              <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                <div className="relative w-56 text-slate-500">
                  <FormInput
                    value={search}
                    onChange={(e) => handleSearch(e)}
                    type="text"
                    className="w-56 pr-10 !box"
                    placeholder="Cari kode / nama barang..."
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
              <Button variant="warning" className="ml-1 shadow-md" onClick={() => handleReset()}>
                <Lucide icon="RotateCcw" className="w-4 h-4 mr-2" />
                  Reset
              </Button>
            </div>
                    {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto intro-y xl:overflow-visible  mt-4">
              {!isDataLoading ? <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      KODE BARANG
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      NAMA BARANG
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      JUMLAH PO
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      SATUAN
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      LOKASI
                    </Table.Th>
                    <Table.Th className="text-start border-b-0 whitespace-nowrap">
                      AKSI
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {stokList.length > 0 ? stokList.map((item, index) => (
                    <Table.Tr key={index} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.kode}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.nama}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.jumlahPo}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.satuan}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {item.toko?.description}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                        <ActionButtons
                          handleReloadStok={handleReloadStok}
                          initialValues={item}
                          tokoList={tokoList}
                          tab={TabStatus.STOK_PO}
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
                </Tab.Panel>
            </Tab.Panels>
            </Tab.Group>
        </div>
      </div>
    </>
  );
}

export default Main;

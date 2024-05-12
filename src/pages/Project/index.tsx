import _, { initial } from "lodash";
import clsx from "clsx";
import { useState, useRef, SetStateAction, ChangeEvent, useEffect, MutableRefObject, RefObject, useMemo } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { FormLabel, FormHelp } from "../../base-components/Form";
import { SubmitHandler, useForm } from "react-hook-form";
import ProjectModule from '../../modules/project/project';
import PtModule from '../../modules/pt/pt';
import {IToko} from '../../modules/toko/interfaces/toko.interface';
import TokoModule from '../../modules/toko/toko';
import toast, { Toaster } from "react-hot-toast";
import { IStok } from "../../modules/stok/interfaces/stok.interface";
import { thousandLimiter } from '../../helpers/helper';
import LoadingIcon from "../../base-components/LoadingIcon";
import PaginationCustom from "../../components/Custom/PaginationCustom";
import { Search } from "react-router-dom";
import { IProject } from "../../modules/project/interfaces/project.interface";
import { IPt } from "../../modules/pt/interfaces/pt.interface";
import { useAppSelector } from "../../stores/hooks";
import { SelectUserInfo } from "../../stores/common/userInfoSlice";
import { AxiosResponse } from "axios";
import moment from "moment";
import Select, { SingleValue } from 'react-select';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";

type TambahProjectModalProps = {
    handleReloadStok: () => void
    ptList: any
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    isUpdate: boolean
    setIsUpdate: React.Dispatch<SetStateAction<boolean>>
}

type EditProjectModalProps = {
  handleReloadStok: () => void,
  ptList: any,
  initialValues: IProject,
  isEditModalOpen: boolean
  setIsEditModalOpen: React.Dispatch<SetStateAction<boolean>>
}

type DeleteConfirmationModalProps = {
  handleReloadStok: () => void
  deleteConfirmationModal: boolean
  deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
  setDeleteConfirmationModal: React.Dispatch<SetStateAction<boolean>>
  initialValues: IProject,
}

type ActionButtonsProps = {
  handleReloadStok: () => void,
  initialValues: IProject,
  ptList: IPt[],
}

type ProjectInputs = {
    id: string
    nama: string
    createdBy: string
    updatedBy?: string
    ptId: string
}

const TambahProjectModal = ({
  handleReloadStok,
  ptList,
  isModalOpen,
  setIsModalOpen,
}: TambahProjectModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const formSchema = Yup.object().shape({
      nama: Yup.string().required('Nama project tidak boleh kosong'),
      ptId: Yup.string().required('Nama PT tidak boleh kosong'),
    });
    const { register, handleSubmit, setValue, reset, formState: {errors} } = useForm<Omit<ProjectInputs, 'id'>>({
      resolver: yupResolver(formSchema)
    });

    const onSubmit: SubmitHandler<Omit<ProjectInputs, 'id'>> = (data, event) => {
        setIsSubmitLoading(true);
        data.createdBy = userInfo.name;
        const payload = {
            nama: data.nama,
            ptId: data.ptId,
            createdBy: data.createdBy
        }
        ProjectModule.create(payload)
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

    return (
        <Dialog size="lg" open={isModalOpen} onClose={()=> {
            setIsModalOpen(false);
            }}
            >
            <Dialog.Panel className="p-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                <Dialog.Title>
                    <h2 className="mr-auto text-base font-medium">
                        Form Tambah Project
                    </h2>
                </Dialog.Title>
                <Dialog.Description>
                        <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama Project</FormLabel>
                                <FormInput {...register('nama')} id="regular-form-1" type="text" autoComplete="off" placeholder="" className={`${errors.nama && "border-danger"}`} />
                                {errors.nama && 
                                <div className="mt-2 text-danger">
                                    {errors.nama.message}
                                </div>
                                }
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <FormLabel htmlFor="modal-form-6">
                                    PT
                                </FormLabel>
                                <FormSelect {...register('ptId')} onChange={(e: ChangeEvent) => setValue('ptId', (e.target as HTMLSelectElement).value)} autoComplete="off" id="modal-form-6" className={`${errors.ptId && "border-danger"}`}>
                                    {ptList.length > 0 ? ptList.map((item: any, index: number) => (
                                        <option value={item.value === 'all' ? '' : item.value}>{item.label}</option>
                                    )) : ''}
                                </FormSelect>
                                {errors.ptId && 
                                <div className="mt-2 text-danger">
                                    {errors.ptId.message}
                                </div>
                                }
                            </div>
                        </div>
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="secondary" onClick={()=> {
                        setIsModalOpen(false);
                    }}
                    className="w-20 mr-1"
                    >
                        Batal
                    </Button>
                    <Button disabled={isSubmitLoading} variant="primary" type="submit" className="w-24">
                        {isSubmitLoading ? 'Loading' : 'Simpan'}
                        {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                    </Button>
                </Dialog.Footer>
                </form>
            </Dialog.Panel>
        </Dialog>
    );
}

const EditProjectModal = ({
  handleReloadStok,
  ptList,
  initialValues,
  isEditModalOpen,
  setIsEditModalOpen,
}: EditProjectModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const formSchema = Yup.object().shape({
      nama: Yup.string().required('Nama project tidak boleh kosong'),
      ptId: Yup.string().required('Nama PT tidak boleh kosong'),
    });
    const { register, handleSubmit, setValue, reset, formState: {errors} } = useForm<ProjectInputs>({
      defaultValues: {
        id: initialValues.id,
        nama: initialValues.nama,
        ptId: initialValues.ptId
      },
      resolver: yupResolver(formSchema)
    });

    const onSubmit: SubmitHandler<ProjectInputs> = (data, event) => {
        setIsSubmitLoading(true);
        data.updatedBy = userInfo.name;
        const payload = {
            id: data.id,
            nama: data.nama,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            ptId: data.ptId,
        }
        ProjectModule.update(payload)
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
                        Form Edit PT
                    </h2>
                </Dialog.Title>
                <Dialog.Description>
                        <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama PT</FormLabel>
                                <FormInput {...register('nama', {required: 'Nama barang tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" autoComplete="off" className={`${errors.nama && "border-danger"}`} />
                                {errors.nama && 
                                <div className="mt-2 text-danger">
                                    {errors.nama.message}
                                </div>
                                }
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <FormLabel htmlFor="modal-form-6">
                                    PT
                                </FormLabel>
                                <FormSelect {...register('ptId')} onChange={(e: ChangeEvent) => setValue('ptId', (e.target as HTMLSelectElement).value)} id="modal-form-6" autoComplete="off" className={`${errors.nama && "border-danger"}`}>
                                    {ptList.length > 0 ? ptList.map((item: any, index: number) => (
                                        <option aria-readonly={item.value === 'all'} selected={item.value === initialValues.ptId} value={item.value}>{item.label}</option>
                                    )) : ''}
                                </FormSelect>
                                {errors.ptId && 
                                <div className="mt-2 text-danger">
                                    {errors.ptId.message}
                                </div>
                                }
                            </div>
                        </div>
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="secondary" onClick={()=> {
                        setIsEditModalOpen(false);
                    }}
                    className="w-20 mr-1"
                    >
                        Batal
                    </Button>
                    <Button disabled={isSubmitLoading} variant="primary" type="submit" className="w-24">
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

  const onDelete = (initialValues: IProject) => {
    ProjectModule.destroy(initialValues)
        .then((res) => {
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
  ptList,
  }
  : ActionButtonsProps) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);

  return (
    <>
    <EditProjectModal 
      handleReloadStok={handleReloadStok}
      initialValues={initialValues}
      ptList={ptList}
      isEditModalOpen={isEditModalOpen}
      setIsEditModalOpen={setIsEditModalOpen}
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
        initialValues?.Po.length < 1 && <a
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

function Main () {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [ptList, setPtList] = useState<IPt[]>([]);
  const [stokList, setStokList] = useState<IProject[]>([]);
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
  });

  const handleReloadStok = () => {
    setIsRefreshData(!isRefreshData);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedPt({
      label: 'Semua PT',
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

  const fetchStokData = (search: string | undefined, page: number, perPage: number, ptId: string) => {
    setIsDataLoading(true);
    const params = {
      search,
      page,
      perPage,
      ptId
    }

    if (search) {
      setTimeout(() => {
      ProjectModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setStokList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log(result.data);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
      }, 1000)
    } else {
      ProjectModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setStokList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log(result.data);
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
    fetchPtList();
    fetchStokData(search, page, perPage, selectedPt.value);
  }, [isRefreshData, page, perPage]);

  return (
    <>
      <Toaster/>
      <TambahProjectModal 
        handleReloadStok={handleReloadStok}
        ptList={ptList}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen} 
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Project</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setIsModalOpen(true)}>
            Tambah Project
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
              <Select placeholder='Semua PT' options={ptList} value={selectedPt} onChange={(e) => {
                setSelectedPt(e);
              }} />
            </div>
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                onChange={(e) => handleSearch(e)}
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Cari project..."
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
                  NAMA PROJECT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  Total Tagihan
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  Sisa Tagihan
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  Tanggal Dibuat
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
                    {item.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.Pt?.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(item.pembayaranPo.reduce((n, {totalPembayaran}) => n + totalPembayaran, 0), 'Rp')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(item.pembayaranPo.reduce((n: number, {totalPembayaran}) => n + totalPembayaran, 0) - item.pembayaranPo.reduce((n: number, {jumlahBayar}) => n + jumlahBayar, 0), 'Rp')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {moment(item.createdAt).format('DD MMMM YYYY')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <ActionButtons
                      handleReloadStok={handleReloadStok}
                      initialValues={item}
                      ptList={ptList}
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

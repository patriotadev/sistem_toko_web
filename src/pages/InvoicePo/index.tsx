import _, { initial } from "lodash";
import clsx from "clsx";
import { useState, useRef, SetStateAction, ChangeEvent, useEffect, MutableRefObject, RefObject, useMemo, JSXElementConstructor, ReactElement, ReactNode, MouseEventHandler } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu, Disclosure } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { FormLabel, FormHelp } from "../../base-components/Form";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import PoModule from '../../modules/po/po';
import PtModule from '../../modules/pt/pt';
import InvoicePoModule from '../../modules/invoice-po/invoice-po';
import SuratJalanPoModule from '../../modules/surat-jalan-po/surat-jalan-po';
import ProjectModule from '../../modules/project/project';
import StokModule from '../../modules/stok/stok';
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
import Select from 'react-select';
import { MultiValue, SingleValue } from "react-select";
import { StatusPo } from "../../modules/po/enum/po.enum";
import { IInvoicePo, IInvoicePoList } from "../../modules/invoice-po/interfaces/invoice-po.interface";
import { useAppSelector } from "../../stores/hooks";
import { SelectUserInfo } from "../../stores/common/userInfoSlice";
import { Status } from "./enum/invoice-po.enum";
import { AxiosResponse } from "axios";
import TabStatus from "../Stok/enum/tab.enum";
import Badge from "../../components/Custom/Badge";
import {useReactToPrint} from 'react-to-print';
import InvoicePoPrint from "./invoice-po-print";
import AsyncSelect from 'react-select/async';
import { ISuratJalanPo } from "../../modules/surat-jalan-po/interfaces/surat-jalan-po.interface";

type TambahPoModalProps = {
    handleReloadStok: () => void
    poList: IPo[]
    ptList: IPt[]
    stokList: IStok[]
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    isUpdate: boolean
    setIsUpdate: React.Dispatch<SetStateAction<boolean>>
}

type ViewDetailModalProps = {
  initialValues: IInvoicePo,
  isDetailModalOpen: boolean
  setIsDetailModalOpen: React.Dispatch<SetStateAction<boolean>>
  handleReloadStok: () => void
}

type EditBarangModalProps = {
  handleReloadStok: () => void,
  ptList: IPt[],
  poList: IPo[],
  initialValues: IInvoicePo,
  isEditModalOpen: boolean
  setIsEditModalOpen: React.Dispatch<SetStateAction<boolean>>
}

type DeleteConfirmationModalProps = {
  handleReloadStok: () => void
  deleteConfirmationModal: boolean
  deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
  setDeleteConfirmationModal: React.Dispatch<SetStateAction<boolean>>
  initialValues: IInvoicePo,
}

type ActionButtonsProps = {
  handleReloadStok: () => void,
  initialValues: IInvoicePo,
  ptList: IPt[],
  projectList: IProject[],
  stokList: IStok[],
  poList: IPo[],
}

type PoInputs = {
    id: string
    jatuhTempo: number
    nomor: string
    createdBy: string
    updatedBy?: String
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
  detail?: IPo
}

const TambahPoModal = ({
  handleReloadStok,
  poList,
  ptList,
  stokList,
  isModalOpen,
  setIsModalOpen,
}: TambahPoModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors} } = useForm<Omit<PoInputs, 'id'>>();
    const [selectedPt, setSelectedPt] = useState<string|undefined>()
    const [projectList, setProjectList] = useState<IProject[]>([]);
    const [isBarangModalOpen, setIsBarangModalOpen] = useState<boolean>(false);
    const [barangPoList, setBarangPoList] = useState<BarangPoInputs[]>([]);
    const [step, setStep] = useState<number>(1);
    const [poOptionsList, setPoOptionsList] = useState<OptionsProps[]>([]);
    const [selectedPo, setSelectedPo] = useState<MultiValue<OptionsProps>>();

    const onSubmit: SubmitHandler<Omit<PoInputs, 'id'>> = (data, event) => {
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

        // console.log(payload);
        // InvoicePoModule.create(payload)
        // .then((res: AxiosResponse) => {
        //   const result = res.data;
        //   setIsModalOpen(false);
        //   setBarangPoList([]);
        //   reset();
        //   setSelectedPt(undefined);
        //   setStep(1);
        //   if (result.code === 201) {
        //     toast.success(result.message);
        //   } else {
        //     toast.error(result.message);
        //   }
        //   handleReloadStok();
        // })
        // .catch((error) => toast.error(error.message))
        // .finally(() => setIsSubmitLoading(false));
    }

    useEffect(() => {
      if (isModalOpen) {
        const temp: OptionsProps[] = [];
        poList.forEach((item) => {
          temp.push({
            label: item.noPo,
            value: item.id,
            detail: item
          });
        });
        setPoOptionsList(temp);
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
                  Tambah Invoice
                </h2>
              </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col gap-4 flex-wrap">
              <div className="w-full">
                  <FormLabel htmlFor="regular-form-1">Pilih Po</FormLabel>
                  <Select
                    onChange={(e) => {
                      setSelectedPo(e)
                    }} 
                    isMulti
                    isSearchable
                    isClearable
                    options={poOptionsList}
                  />
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

const EditBarangModal = ({
  handleReloadStok,
  ptList,
  initialValues,
  isEditModalOpen,
  setIsEditModalOpen,
  poList
}: EditBarangModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [poOptionsList, setPoOptionsList] = useState<OptionsProps[]>([]);
    const [selectedPo, setSelectedPo] = useState<MultiValue<OptionsProps>>([]);
    const { register, handleSubmit, watch, setValue, getValues, reset, formState: {errors} } = useForm<PoInputs>({
      defaultValues: {
        id: initialValues.id,
        jatuhTempo: initialValues.jatuhTempo,
        nomor: initialValues.nomor,
      }
    });
    const onSubmit: SubmitHandler<PoInputs> = (data, event) => {
      // let poListPayload: any = [];
      // console.log(selectedPo);
      // selectedPo?.forEach((item) => {
      //   poListPayload.push({
      //     invoicePoId: data.id,
      //     poId: item?.value
      //   });
      // });
      // setIsSubmitLoading(true);
      // data.updatedBy = userInfo.name;
      // const payload =  {
      //     id: data.id,
      //     jatuhTempo: data.jatuhTempo,
      //     tokoId: userInfo.tokoId,
      //     nomor: data.nomor,
      //     poListPayload,
      //     upadtedBy: data.updatedBy
      // }

      // InvoicePoModule.update(payload)
      // .then((res: AxiosResponse) => {
      //   const result = res.data;
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
    
    useEffect(() => {
      if (isEditModalOpen) {
        const temp: OptionsProps[] = [];
        const poTemp: OptionsProps[] = [];
        poList.forEach((item) => {
          temp.push({
            label: item.noPo,
            value: item.id,
            detail: item
          });

          if (initialValues.InvoicePoList.some((el) => el.poId === item.id )) {
            // const InvoicePoListValues = initialValues.InvoicePoList.filter((val) => val.poId === item.id)[0]; 
            poTemp.push({
              label: item.noPo,
              value: item.id,
              detail: item,
            });
          }
        });
        setSelectedPo(poTemp);
        setPoOptionsList(temp);
      }
    }, [isEditModalOpen]);

    return (
      <Dialog size="lg" open={isEditModalOpen} onClose={() => {}}>
        <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Panel className="p-2">
      <Dialog.Title>
          <div className="flex justify-between flex-wrap w-full">
            <h2 className="mr-auto text-base font-medium">
              Edit Invoice
            </h2>
          </div>
      </Dialog.Title>
      <Dialog.Description>
        <div className="flex flex-col gap-4 flex-wrap">
          <div className="w-full">
              <FormLabel htmlFor="regular-form-1">Pilih Po</FormLabel>
              <Select
                value={selectedPo}
                isMulti
                isSearchable
                isClearable
                onChange={(e) => setSelectedPo(e)}
                options={poOptionsList}
              />
          </div>
          <div className="w-full">
              <FormLabel htmlFor="regular-form-1">Jatuh Tempo (Hari)</FormLabel>
              <FormInput value={getValues('jatuhTempo')} {...register('jatuhTempo', {required: 'Jatuh tempo tidak boleh kosong'})} id="regular-form-1" type="number" min="0" placeholder="" />
          </div>
        </div>
      </Dialog.Description>
        <Dialog.Footer>
          <Button type="button" variant="secondary" onClick={()=> setIsEditModalOpen(false)}
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
    );
}

const DeleteConfirmationModal = ({
  handleReloadStok,
  deleteConfirmationModal,
  setDeleteConfirmationModal,  
  deleteButtonRef,
  initialValues
}: DeleteConfirmationModalProps) => {

  const onDelete = (initialValues: IInvoicePo) => {
    InvoicePoModule.destroy(initialValues)
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

const ViewPo = ({initialValues, isDetailModalOpen, setIsDetailModalOpen, handleReloadStok}: ViewDetailModalProps) => {
  const [selectedPoListData, setSelectedPoListData] = useState<IPo[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<SingleValue<OptionsProps>>({
    value: initialValues.status,
    label: initialValues.status
  });
  const statusInvoiceOptions = [
    {
      label: Status.SEDANG_DIPROSES,
      value: Status.SEDANG_DIPROSES,
    },
    {
      label: Status.JATUH_TEMPO,
      value: Status.JATUH_TEMPO
    },
    {
      label: Status.SELESAI,
      value: Status.SELESAI
    },
  ];

  // const handleChangeStatus = (value: string | undefined) => {
  //   const payload = {
  //     id: initialValues.id,
  //     status: value
  //   }
  //   InvoicePoModule.updateStatus(payload)
  //   .then((res: AxiosResponse) => {
  //     const result = res.data;
  //     if (result.code === 200) {
  //       toast.success(result.message);
  //     } else {
  //       toast.error(result.message);
  //     }
  //     handleReloadStok();
  //   })
  // }

  const fetchSelectedPoListData = () => {
    const poId: string[] = initialValues.InvoicePoList.map((item) => item.poId);
    PoModule.getByInvoice(poId)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setSelectedPoListData(result.data)
      } );
  }

  useEffect(() => {
    if (isDetailModalOpen) {
      fetchSelectedPoListData();
    }
  }, [isDetailModalOpen]);

  return (
    <div>
      <Dialog size="lg" open={isDetailModalOpen} onClose={() => {}}>     
          <Dialog.Panel className="p-2">
          <Dialog.Title>
              <div className="flex justify-between flex-wrap w-full">
                <h2 className="mr-auto text-base flex gap-2 items-center">
                    <Lucide icon="FileText" className="w-6 h-6"/>
                    Detail Invoice : <span className="font-medium">{initialValues.nomor}</span>
                  </h2>
              </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col gap-4 flex-wrap">
              <label>Daftar No. PO:</label>
              <div className="w-full">
                  {selectedPoListData.length > 0 && selectedPoListData.map((item, index) => 
                  <div key={index} className="intro-y">
                  <div className="flex items-center px-4 py-4 mb-3 box zoom-in">
                    <div className="ml-4 mr-auto">
                      <div className="font-medium">{item.noPo}</div>
                      <div className="text-slate-500 text-xs mt-0.5 italic">
                        Dibuat pada tanggal {moment(item.tanggal).format('DD MMMM YYYY')}
                      </div>
                    </div>
                    {/* <div className="px-2 py-1 text-xs font-medium text-white rounded-full cursor-pointer bg-success">
                      {item.BarangPo?.length} Barang
                    </div> */}
                  </div>
                </div>
              )}
              </div>
              {/* <div className="flex flex-col gap-2">
                <label>Invoice Status:</label>
                <Select
                  value={selectedStatus}
                  options={statusInvoiceOptions}
                  onChange={(e) => handleChangeStatus(e?.value)}
                />
              </div> */}
            </div>
          </Dialog.Description>
            <Dialog.Footer>
                <Button type="button" variant="secondary" onClick={()=> setIsDetailModalOpen(false)}
                className="w-20 mr-2"
                >
                  Batal
                </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
    </div>
  );
}

const ActionButtons = ({
  handleReloadStok,
  initialValues,
  ptList,
  stokList,
  poList,
  }
  : ActionButtonsProps) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const printRef = useRef<any>(null);
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice - ${initialValues.nomor}`,
    content: () => printRef.current,
  });

  return (
    <>
     <div className="hidden">
      <InvoicePoPrint ref={printRef} initialValues={initialValues} />
    </div>
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
      poList={poList}
    />
    <DeleteConfirmationModal
      handleReloadStok={handleReloadStok}
      deleteConfirmationModal={deleteConfirmationModal}
      setDeleteConfirmationModal={setDeleteConfirmationModal}
      deleteButtonRef={deleteButtonRef}
      initialValues={initialValues}
    />
    <div className="flex items-center justify-start">
      {/* <a className="flex items-center mr-3" href="#" onClick={() => {
        setIsDetailModalOpen(true);
      }}>
        <Lucide icon="View" className="w-4 h-4 mr-1" />{" "}
        Detail
      </a> */}
      <a className="flex items-center mr-3" href="#" onClick={handlePrint}>
        <Lucide icon="Printer" className="w-4 h-4 mr-1" />{" "}
        Print
      </a>
      {/* <a className="flex items-center mr-3" href="#" onClick={() => {
        setIsEditModalOpen(true);
      }}>
        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
        Edit
      </a> */}
      <a
        className="flex items-center text-danger"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          setDeleteConfirmationModal(true);
        }}
      >
      <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Hapus
      </a>
    </div>
      
    </>
  );
}

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
  const [stokList, setStokList] = useState<IStok[]>([]);
  const [invoicePoList, setInvoicePoList] = useState<IInvoicePo[]>([]);
  const [selectedPt, setSelectedPt] = useState<SingleValue<any>>({
    label: 'Semua PT',
    value: 'all'
  })
  const [selectedProject, setSelectedProject] = useState<SingleValue<any>>({
    label: 'Semua Project',
    value: 'all'
  });
  const [suratJalanList, setSuratJalanList] = useState<any[]>([]);
  const [suratJalanSearch, setSuratJalanSearch] = useState<string|undefined>();
  const [selectedSj, setSelectedSj] = useState<any>(null);


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

  const fetchInvoicePoData = (
    search: string | undefined,
    page: number,
    perPage: number,
    ptId: string,
    projectId: string,
    suratJalanPoId: string
    ) => {
    setIsDataLoading(true);
    const params = {
      search,
      page,
      perPage,
      ptId,
      projectId,
      suratJalanPoId
    }

    console.log(params);
    if (search) {
      setTimeout(() => {
      InvoicePoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setInvoicePoList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log(result.data);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
      }, 1000)
    } else {
      InvoicePoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setInvoicePoList(result.data);
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

  const fetchPoData = (search: string | undefined, page: number, perPage: number, ptId: string, projectId: string, status: string) => {
    const params: IPoFetchQuery = {
      search,
      page,
      perPage,
      ptId,
      projectId,
      status
    }

    PoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data
        setPoList(result.data);
      })
      .finally(() => setIsDataLoading(false));
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

  const handleReset = () => {
    setSelectedSj(null);
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

  const loadSjOptions = async (inputValue: string) => {
    return await SuratJalanPoModule.getList(inputValue)
    .then((res: AxiosResponse) => res.data.data);
  }

  useEffect(() => {
    if (selectedPt) {
      fetchProjectList(selectedPt.project);
    }
  }, [selectedPt]);

  useEffect(() => {
    fetchInvoicePoData(search, page, perPage, selectedPt?.value, selectedProject?.value, selectedSj?.id);
  }, [isRefreshData, page, perPage]);

  useEffect(() => {
    fetchPtList();
    fetchPoData(undefined, 1, 1000, 'all', 'all', 'all');
    fetchStokBarangData(undefined, 1, 1000, 'all', TabStatus.STOK_TERSEDIA);
  }, []);


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
        poList={poList}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Invoice</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
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
              <AsyncSelect 
                placeholder='Semua Surat Jalan'
                getOptionLabel={(e: any) => e?.nomor}
                getOptionValue={(e: any) => e?.id}
                defaultOptions
                value={selectedSj}
                loadOptions={loadSjOptions}
                onChange={(e) => setSelectedSj(e)}
                onInputChange={(e) => setSuratJalanSearch(e)}
              />
            </div>
          </div>
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
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                value={search}
                onChange={(e) => handleSearch(e)}
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Cari nomor invoice..."
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
        <div className="col-span-12 overflow-auto intro-y">
          {!isDataLoading ? <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NO. INVOICE
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NO. SURAT JALAN
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PROJECT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NO. PO
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  DIBUAT OLEH
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TANGGAL DIBUAT
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
              {invoicePoList.length > 0 ? invoicePoList.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.nomor}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.SuratJalanPo.nomor}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.Pt.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.Project.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.Po.noPo}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.createdBy}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {moment(item.createdAt).format('DD MMM YYYY')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.TandaTerimaNotaList.length > 0 ? <Button size="sm" variant='outline-success'>Sudah Tanda Terima</Button> : <Button size="sm" variant='outline-primary'>Belum Tanda Terima</Button>}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <ActionButtons
                      handleReloadStok={handleReloadStok}
                      initialValues={item}
                      ptList={ptList}
                      projectList={projectList}
                      stokList={stokList}      
                      poList={poList}
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

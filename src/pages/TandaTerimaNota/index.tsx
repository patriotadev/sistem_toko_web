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
import ProjectModule from '../../modules/project/project';
import StokModule from '../../modules/stok/stok';
import NotaModule from '../../modules/tanda-terima-nota/tanda-terima-nota';
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
import { MultiValue, SingleValue, } from "react-select";
import AsyncSelect from "react-select/async";
import { StatusPo } from "../../modules/po/enum/po.enum";
import { IInvoicePo, IInvoicePoFetchQuery, IInvoicePoList } from "../../modules/invoice-po/interfaces/invoice-po.interface";
import { INotaFetchQuery, ITandaTerimaNota, TandaTerimaNotaPayload } from "../../modules/tanda-terima-nota/interfaces/tanda-terima-nota.interface";
import { useAppSelector } from "../../stores/hooks";
import { SelectUserInfo } from "../../stores/common/userInfoSlice";
import { Status } from "./enum/tanda-terima-nota.enum";
import { AxiosResponse } from "axios";
import Badge from "../../components/Custom/Badge";
import TandaTerimaNotaPrint from "./tanda-terima-nota-print";
import { useReactToPrint } from "react-to-print";
import * as Yup from 'yup';

type TambahPoModalProps = {
    handleReloadStok: () => void
    invoicePoList: IInvoicePo[]
    ptList: IPt[]
    projectList: any[]
    stokList: IStok[]
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
    isUpdate: boolean
    setIsUpdate: React.Dispatch<SetStateAction<boolean>>
}

type ViewDetailModalProps = {
  initialValues: ITandaTerimaNota,
  isDetailModalOpen: boolean
  setIsDetailModalOpen: React.Dispatch<SetStateAction<boolean>>
  handleReloadStok: () => void
}

type EditBarangModalProps = {
  handleReloadStok: () => void,
  ptList: IPt[],
  poList: IPo[],
  initialValues: ITandaTerimaNota,
  isEditModalOpen: boolean
  setIsEditModalOpen: React.Dispatch<SetStateAction<boolean>>
  invoicePoList: IInvoicePo[]
}

type DeleteConfirmationModalProps = {
  handleReloadStok: () => void
  deleteConfirmationModal: boolean
  deleteButtonRef: MutableRefObject<HTMLButtonElement | null>
  setDeleteConfirmationModal: React.Dispatch<SetStateAction<boolean>>
  initialValues: ITandaTerimaNota,
}

type ActionButtonsProps = {
  handleReloadStok: () => void,
  initialValues: ITandaTerimaNota,
  ptList: IPt[],
  projectList: IProject[],
  stokList: IStok[],
  poList: IPo[],
  invoicePoList: IInvoicePo[]
}

type PoInputs = {
    id: string
    jatuhTempo: number
    nomor: string,
    tanggal: Date,
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
  detail?: IInvoicePo
}

const TambahPoModal = ({
  handleReloadStok,
  invoicePoList,
  ptList,
  projectList,
  stokList,
  isModalOpen,
  setIsModalOpen,
}: TambahPoModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const formSchema = Yup.object().shape({
      jatuhTempo: Yup.number().required('Jatuh tempo tidak boleh kosong'),     
    });
    const { register, handleSubmit, setValue, getValues, reset, watch, formState: {errors} } = useForm<Omit<PoInputs, 'id'>>();
    const [barangPoList, setBarangPoList] = useState<BarangPoInputs[]>([]);
    const [step, setStep] = useState<number>(1);
    const [invoicePoOptionsList, setInvoicePoOptionsList] = useState<OptionsProps[]>([]);
    const [selectedPo, setSelectedPo] = useState<any[]>([]);
    const [selectedPt, setSelectedPt] = useState<SingleValue<any>>();
    const [selectedProject, setSelectedProject] = useState<SingleValue<any>>();
    const [projectListTambah, setProjectListTambah] = useState<any>([]);
    const [invoiceList, setInvoiceList] = useState<any>([]);

    const fetchInvoiceList = async (ptId: string, projectId: string) => {
      const params = {
        ptId,
        projectId
      }
      await InvoicePoModule.getList(params).then((res: AxiosResponse) => {
        const result = res.data;
        const temp: any[] = [];
        result.data.map((item: any) => {
          if (item.TandaTerimaNotaList.length < 1) {
            temp.push({
              label: item.nomor,
              value: item.id,
              detail: item
            })
          }
        });
        setInvoiceList(temp);
      })
    };

    const onSubmit: SubmitHandler<Omit<PoInputs, 'id'>> = (data, event) => {
        let invoicePoListPayload: any = [];
        selectedPo?.forEach((item) => {
          invoicePoListPayload.push(item.detail);
        });
        console.log(invoicePoListPayload);
        console.log(data);
        setIsSubmitLoading(true);
        data.createdBy = userInfo.name;
        const payload =  {
            ptId: selectedPt?.value,
            projectId: selectedProject?.value,
            tanggal: new Date(),
            jatuhTempo: data.jatuhTempo,
            invoicePoListPayload,
            createdBy: data.createdBy,
            tokoId: userInfo.tokoId
        }

        console.log(payload);
        NotaModule.create(payload)
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
        .catch((error) => toast.error(error.message))
        .finally(() => setIsSubmitLoading(false));
    }

    useEffect(() => {
      if (isModalOpen) {
        const temp: OptionsProps[] = [];
        invoicePoList.forEach((item) => {
          console.log(item)
          if (item.TandaTerimaNotaList.length <= 0) {
            temp.push({
              label: item.nomor,
              value: item.id,
              detail: item
            });
          }
        });
        setInvoicePoOptionsList(temp);
      }
    }, [isModalOpen]);

    useEffect(() => {
      if (selectedPt) {
        const temp: any[] = [];
        selectedPt?.project?.map((p: any) => {
          temp.push({
            label: p.nama,
            value: p.id
          })
        });
        setProjectListTambah(temp);
      }
    }, [selectedPt])

    useEffect(() => {
      fetchInvoiceList(selectedPt?.value, selectedProject?.value);
    }, [selectedProject])

    return (
      <div>
        <Toaster/>
        <Dialog size="lg" open={isModalOpen} onClose={() => {}}>   
        <form onSubmit={handleSubmit(onSubmit)}>  
          <Dialog.Panel className="p-2">
          <Dialog.Title>
              <div className="flex justify-between flex-wrap w-full">
                <h2 className="mr-auto text-base font-medium">
                  Tambah Nota
                </h2>
              </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col gap-4 flex-wrap">
              <div className="w-full">
                  <FormLabel htmlFor="regular-form-1">Pilih PT</FormLabel>
                  <Select
                    onChange={(e) => {
                      setSelectedPt(e);
                      setSelectedProject(null);
                      setSelectedPo([]);
                    }}
                    value={selectedPt}
                    isSearchable
                    isClearable
                    options={ptList}
                  />
              </div>
              <div className="w-full">
                  <FormLabel htmlFor="regular-form-1">Pilih Project</FormLabel>
                  <Select
                    isDisabled={!selectedPt}
                    onChange={(e) => {
                      setSelectedProject(e)
                      setSelectedPo([])
                    }}
                    value={selectedProject}
                    isSearchable
                    isClearable
                    options={projectListTambah}
                  />
              </div>
              <div className="w-full">
                  <FormLabel htmlFor="regular-form-1">Pilih Invoice</FormLabel>
                  <Select
                    isDisabled={!selectedProject}
                    onChange={(e) => {
                      setSelectedPo(e as unknown as any)
                    }}
                    value={selectedPo}
                    isMulti
                    isSearchable
                    isClearable
                    required
                    options={invoiceList}
                  />
              </div>
              <div className="w-full">
                <FormLabel htmlFor="regular-form-1">Jatuh Tempo (Hari)</FormLabel>
                <FormInput {...register('jatuhTempo', {required: 'Jatuh tempo tidak boleh kosong'})} id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.jatuhTempo && "border-danger"}`} />
                {errors.jatuhTempo && 
                  <div className="mt-2 text-danger">
                      {errors.jatuhTempo.message}
                  </div>
                }
              </div>
            </div>
          </Dialog.Description>
            <Dialog.Footer>
              <Button type="button" variant="secondary" onClick={()=> setIsModalOpen(false)}
              className="w-20 mr-2"
              >
                Batal
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitLoading} className="w-24">
                {isSubmitLoading ? 'Loading' : 'Simpan'}
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
  poList,
  invoicePoList
}: EditBarangModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [selectedInvoicePoListData, setSelectedInvoicePoListData] = useState<IInvoicePo[]>([]);
    const [invoicePoOptionsList, setInvoicePoOptionsList] = useState<OptionsProps[]>([]);
    const [selectedInvoicePo, setSelectedInvoicePo] = useState<MultiValue<OptionsProps>>([]);
    const [invoiceList, setInvoiceList] = useState<any>([]);
    const [selectedPo, setSelectedPo] = useState<any[]>([]);
    const [selectedPt, setSelectedPt] = useState<SingleValue<any>>(ptList?.find((pt: any) => pt.value === initialValues?.Pt?.id));
    const [projectListTambah, setProjectListTambah] = useState<any>([]);
    const [selectedProject, setSelectedProject] = useState<SingleValue<any>>({
      label: selectedPt?.project?.find((project: any) => project.id === initialValues?.Project?.id).nama,
      value: selectedPt?.project?.find((project: any) => project.id === initialValues?.Project?.id).id,
    });
    console.log(ptList.find((pt) => pt.id === initialValues?.Pt?.id), ">>> ptList");
    const fetchInvoiceList = async (ptId: string, projectId: string) => {
      const params = {
        ptId,
        projectId
      }
      await InvoicePoModule.getList(params).then((res: AxiosResponse) => {
        const result = res.data;
        const temp: any[] = [];
        result.data.map((item: any) => {
          if (item.TandaTerimaNotaList.length < 1) {
            temp.push({
              label: item.nomor,
              value: item.id,
              detail: item
            })
          }
        });
        setInvoiceList(temp);
      })
    };
    const { register, handleSubmit, watch, setValue, getValues, reset, formState: {errors} } = useForm<PoInputs>({
      defaultValues: {
        id: initialValues.id,
        jatuhTempo: initialValues.jatuhTempo,
        nomor: initialValues.nomor,
      }
    });
    console.log(initialValues, ">>> initialValues");
    const onSubmit: SubmitHandler<PoInputs> = (data, event) => {
      let invoicePoListPayload: any = [];
      console.log(selectedInvoicePo);
      selectedPo?.forEach((item) => {
        invoicePoListPayload.push(item.detail);
      });
      setIsSubmitLoading(true);
      data.updatedBy = userInfo.name;
      const payload =  {
          id: data.id,
          tanggal: initialValues?.tanggal,
          jatuhTempo: data.jatuhTempo,
          invoicePoListPayload,
          upadtedBy: data.updatedBy,
          tokoId: userInfo.tokoId
      }
      console.log(payload, ">>> payloadss");
      NotaModule.update(payload)
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

    const fetchSelectedInvoicePoListData = () => {
      const invoicePoId: string[] = initialValues.TandaTerimaNotaList.map((item) => item.invoicePoId);
      console.log(invoicePoId);
      InvoicePoModule.getByNota(invoicePoId)
        .then((res: AxiosResponse) => {
          const result = res.data;
          const temp: any[] = [];
          result.data.map((item: any) => {
            temp.push({
              label: item.nomor,
              value: item.id,
              detail: item
            });
          })
          setSelectedPo(temp);
        } );
    }
  
    useEffect(() => {
      if (isEditModalOpen) {
        fetchSelectedInvoicePoListData();
      }
    }, [isEditModalOpen]);

    useEffect(() => {
      if (selectedPt) {
        const temp: any[] = [];
        console.log(selectedPt);
        selectedPt?.project?.map((p: any) => {
          temp.push({
            label: p.nama,
            value: p.id
          })
        });
        setProjectListTambah(temp);
      }
    }, [selectedPt])

    useEffect(() => {
      fetchInvoiceList(selectedPt?.value, selectedProject?.value);
    }, [selectedProject])
    
    useEffect(() => {
      if (isEditModalOpen) {
        const temp: any[] = [];
        const poTemp: any[] = [];
        invoicePoList.forEach((item: any) => {
          temp.push({
            label: item.nomor,
            value: item.id,
            detail: item
          });
          
          if (initialValues.TandaTerimaNotaList.some((el) => el.invoicePoId === item.id )) {
            // const InvoicePoListValues = initialValues.InvoicePoList.filter((val) => val.poId === item.id)[0]; 
            poTemp.push({
              label: item.nomor,
              value: item.id,
              detail: item,
            });
          }
        });
        setSelectedInvoicePo(poTemp);
        setInvoicePoOptionsList(temp);
      }
    }, [isEditModalOpen]);

    watch('jatuhTempo');

    return (
      <Dialog size="lg" open={isEditModalOpen} onClose={() => {}}>
        <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Panel className="p-2">
      <Dialog.Title>
          <div className="flex justify-between flex-wrap w-full">
            <h2 className="mr-auto text-base font-medium">
              Edit Nota</h2>
          </div>
      </Dialog.Title>
      <Dialog.Description>
      <div className="flex flex-col gap-4 flex-wrap">
              <div className="w-full">
                  <FormLabel htmlFor="regular-form-1">Pilih PT</FormLabel>
                  <Select
                    onChange={(e) => {
                      setSelectedPt(e);
                      setSelectedProject(null);
                      setSelectedPo([]);
                    }}
                    value={selectedPt}
                    isSearchable
                    isClearable
                    options={ptList}
                  />
              </div>
              <div className="w-full">
                  <FormLabel htmlFor="regular-form-1">Pilih Project</FormLabel>
                  <Select
                    isDisabled={!selectedPt}
                    onChange={(e) => {
                      setSelectedProject(e)
                      setSelectedPo([])
                    }}
                    value={selectedProject}
                    isSearchable
                    isClearable
                    options={projectListTambah}
                  />
              </div>
              <div className="w-full">
                  <FormLabel htmlFor="regular-form-1">Pilih Invoice</FormLabel>
                  <Select
                    isDisabled={!selectedProject}
                    onChange={(e) => {
                      setSelectedPo(e as unknown as any)
                    }}
                    value={selectedPo}
                    isMulti
                    isSearchable
                    isClearable
                    options={invoiceList}
                  />
              </div>
              <div className="w-full">
                <FormLabel htmlFor="regular-form-1">Jatuh Tempo (Hari)</FormLabel>
                <FormInput {...register('jatuhTempo', {required: 'Jatuh tempo tidak boleh kosong'})} id="regular-form-1" type="number" min="0" placeholder="" className={`${errors.jatuhTempo && "border-danger"}`} />
                {errors.jatuhTempo && 
                  <div className="mt-2 text-danger">
                      {errors.jatuhTempo.message}
                  </div>
                }
              </div>
            </div>
      </Dialog.Description>
        <Dialog.Footer>
          <Button type="button" variant="secondary" onClick={()=> setIsEditModalOpen(false)}
          className="w-20 mr-2"
          >
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitLoading} className="w-24">
              {isSubmitLoading ? 'Loading' : 'Simpan'}
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

  const onDelete = (initialValues: ITandaTerimaNota) => {
    NotaModule.destroy(initialValues)
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
  const [selectedInvoicePoListData, setSelectedInvoicePoListData] = useState<IInvoicePo[]>([]);
  console.log(initialValues);
  const statusPoOptions = [
    {
      label: StatusPo.SEDANG_DIPROSES,
      value: StatusPo.SEDANG_DIPROSES,
    },
    {
      label: StatusPo.JATUH_TEMPO,
      value: StatusPo.JATUH_TEMPO
    },
    {
      label: StatusPo.SELESAI,
      value: StatusPo.SELESAI
    },
  ];

  const handleChangeStatus = (value: string | undefined) => {
    const payload: PoPayload & BarangPoInputs = {
      po: {
        id: initialValues.id,
        // noPo: initialValues.noPo,
        // tanggal: new Date(initialValues.tanggal),
        // tanggalJatuhTempo: new Date(initialValues.tanggalJatuhTempo),
        // ptId: initialValues.ptId,
        // projectId: initialValues.projectId,
        // createdBy: initialValues.createdBy,
        // updatedBy: initialValues.updatedBy,
      } as IPo,
      // barangPo: initialValues.BarangPo
  }
    PoModule.updateStatus(payload)
    .then((res: AxiosResponse) => {
      const result = res.data;
      if (result.code === 201) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      handleReloadStok();
      
    })
  }

  const fetchSelectedInvoicePoListData = () => {
    const invoicePoId: string[] = initialValues.TandaTerimaNotaList.map((item) => item.invoicePoId);
    console.log(invoicePoId);
    InvoicePoModule.getByNota(invoicePoId)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setSelectedInvoicePoListData(result.data)
      } );
  }

  useEffect(() => {
    if (isDetailModalOpen) {
      fetchSelectedInvoicePoListData();
    }
  }, [isDetailModalOpen]);

  console.log(selectedInvoicePoListData);

  return (
    <div>
      <Dialog size="lg" open={isDetailModalOpen} onClose={() => {}}>     
          <Dialog.Panel className="p-2">
          <Dialog.Title>
              <div className="flex justify-between flex-wrap w-full">
                <h2 className="mr-auto text-base font-medium flex gap-2 flex-wrap">
                  <p>No. Nota :</p>
                  <p className="font-semibold">{initialValues.nomor}</p>
                </h2>
              </div>
          </Dialog.Title>
          <Dialog.Description>
            <div className="flex flex-col gap-4 flex-wrap">
              <div className="w-full mb-4">
                <div className="grid grid-cols-3 gap-4 auto-cols-max">
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">PT</label>
                    <span>{initialValues.Pt.nama}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Project</label>
                    <span>{initialValues.Project.nama}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Jatuh Tempo</label>
                    <span>{initialValues.jatuhTempo} Hari</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Tanggal Jatuh Tempo</label>
                    <span>{moment(moment(new Date()).utc().format()).add(initialValues.jatuhTempo, 'd').format('DD MMM YYYY')}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold">Dibuat oleh</label>
                    <span>{initialValues.createdBy}</span>
                  </div>
                </div>
              </div>
              <div className="w-full">
                  <label className="font-semibold">Daftar Invoice</label>
                  {selectedInvoicePoListData.length > 0 && selectedInvoicePoListData.map((item, index) => 
                  <div key={index} className="intro-y mt-2">
                  <div className="flex items-center px-4 py-4 mb-3 box zoom-in">
                  <Disclosure.Group>
                    <Disclosure>
                        <Disclosure.Button>
                            {item.nomor}
                        </Disclosure.Button>
                        <Disclosure.Panel className="leading-relaxed text-slate-600 dark:text-slate-500">
                            <div className="flex gap-10">
                              <div>
                                <p className="font-semibold">No. Surat Jalan</p>
                                <p>{item.SuratJalanPo.nomor}</p>
                              </div>
                              <div>
                                <p className="font-semibold">No. PO</p>
                                <p>{item.Po?.noPo}</p>
                              </div>
                            </div>
                        </Disclosure.Panel>
                    </Disclosure>
                </Disclosure.Group>
                  </div>
                </div>
              )}
              </div>
            </div>
          </Dialog.Description>
            <Dialog.Footer>
              <Button type="button" variant="secondary" onClick={()=> setIsDetailModalOpen(false)}
              className="w-20 mr-2"
              >
                Batal
              </Button>
              {/* <Button variant="primary" type="button" className="w-20" onClick={()=> {}}>
                  Simpan
                  {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
              </Button>  */}
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
  invoicePoList,
  }
  : ActionButtonsProps) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const printRef = useRef<any>(null);
  const handlePrint = useReactToPrint({
    documentTitle: `Tanda Terima Nota - ${initialValues.nomor}`,
    content: () => printRef.current,
  });

  return (
    <>
    <div className="hidden">
      <TandaTerimaNotaPrint ref={printRef} initialValues={initialValues} />
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
      invoicePoList={invoicePoList}
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
      <a className="flex items-center mr-3" href="#" onClick={handlePrint}>
        <Lucide icon="Printer" className="w-4 h-4 mr-1" />{" "}
        Print
      </a>
      <a className="flex items-center mr-3" href="#" onClick={() => {
        setIsEditModalOpen(true);
      }}>
        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
        Edit
      </a>
      {
        initialValues?.Invoice.length < 1 && <a
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
  const [invoicePoList, setInvoicePoList] = useState<IInvoicePo[]>([]);
  const [notaList, setNotaList] = useState<ITandaTerimaNota[]>([]);

  const handleReloadStok = () => {
    setIsRefreshData(!isRefreshData);
  }

  const handleReset = () => {
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

  console.log(stokList);

  const fetchNotaData = (search: string | undefined, page: number, perPage: number, ptId: string, projectId: string) => {
    setIsDataLoading(true);
    const params: INotaFetchQuery = {
      search,
      page,
      perPage,
      ptId,
      projectId
    };

    NotaModule.get(params)
    .then((res: AxiosResponse) => {
      const result = res.data;
      setNotaList(result.data);
      // setPage(result.document.currentPage);
      // setPerPage(result.document.perPage);
      console.log(result.data, ">>> NOTA RES");
      setTotalCount(result.document.totalCount);
      setTotalPages(result.document.totalPages);
    })
    .finally(() => setIsDataLoading(false));
  }

  console.log(totalPages);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
    project.map((item: any) => {
        temp.push({
          label: item.nama,
          value: item.id,
          project: item.Project
        })
      })
      setProjectList(temp)
  }

  // const fetchInvoicePoData = (search: string | undefined, page: number, perPage: number) => {
  //   const params: IInvoicePoFetchQuery = {
  //     search,
  //     page,
  //     perPage,
  //   }

  //   InvoicePoModule.get(params)
  //     .then((res: AxiosResponse) => {
  //       const result = res.data;
  //       setInvoicePoList(result.data);
  //     })
  //     .finally(() => setIsDataLoading(false));
  // }

  useEffect(() => {
    fetchNotaData(search, page, perPage, selectedPt?.value, selectedProject?.value);
  }, [isRefreshData, page, perPage]);

  // useEffect(() => {
  //   fetchInvoicePoData(undefined, 1, 1000);
  // }, [isRefreshData]);

  useEffect(() => {
    fetchPtList();
  }, []);

  useEffect(() => {
    if (selectedPt) {
      fetchProjectList(selectedPt.project);
    }
  }, [selectedPt]);

  return (
    <>
      <Toaster/>
      <TambahPoModal 
        handleReloadStok={handleReloadStok}
        ptList={ptList}
        projectList={projectList}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen} 
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        stokList={stokList}
        invoicePoList={invoicePoList}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Nota</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setIsModalOpen(true)}>
            Tambah Nota
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
              <Select placeholder='Semua PT' value={selectedPt} options={ptList} onChange={(e) => {
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
                placeholder="Cari nomor nota..."
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
                  NO. NOTA
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PROJECT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  DIBUAT OLEH
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TANGGAL DIBUAT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  JATUH TEMPO
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TANGGAL JATUH TEMPO
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
              {notaList.length > 0 ? notaList.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.nomor}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item?.Pt?.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item?.Project?.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.createdBy}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {moment(item.tanggal).format('DD MMM YYYY')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {`${item.jatuhTempo} Hari`}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {moment(moment(item.tanggal).utc().format()).add(item.jatuhTempo, 'd').format('DD MMM YYYY')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {
                      Number(moment(moment(new Date()).format('YYYYMMDD')).diff(moment(moment(item.tanggal).utc().format()).add(item.jatuhTempo, 'd').format('YYYYMMDD'), 'days')) >= 0 ?
                      <Button size="sm" variant='outline-danger'>{Status.JATUH_TEMPO}</Button>
                      :
                      <Button size="sm" variant='outline-primary'>{Status.BELUM_JATUH_TEMPO}</Button>
                    }
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <ActionButtons
                      handleReloadStok={handleReloadStok}
                      initialValues={item}
                      ptList={ptList}
                      projectList={projectList}
                      stokList={stokList}      
                      poList={poList}
                      invoicePoList={invoicePoList}
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

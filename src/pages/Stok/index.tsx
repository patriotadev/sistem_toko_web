import _ from "lodash";
import clsx from "clsx";
import { useState, useRef, SetStateAction, ChangeEvent, useEffect } from "react";
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
import StokModule from '../../modules/stok/stok';
import IToko from '../../modules/toko/interfaces/toko.interface';
import TokoModule from '../../modules/toko/toko';
import toast, { Toaster } from "react-hot-toast";
import { IStok } from "../../modules/stok/interfaces/stok.interface";
import { thousandLimiter } from '../../helpers/helper';
import LoadingIcon from "../../base-components/LoadingIcon";

type TambahBarangModalProps = {
    handleReloadStok: () => void
    tokoList: IToko[]
    isModalOpen: boolean
    setIsModalOpen: React.Dispatch<SetStateAction<boolean>>
}

type StokBarangInputs = {
    nama: string
    jumlah: number
    satuan: string
    hargaModal: number
    hargaJual: number
    createdBy: string
    tokoId: string
}

const TambahBarangModal = ({
  handleReloadStok,
  tokoList,
  isModalOpen,
  setIsModalOpen 
}: TambahBarangModalProps) => {
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const { register, handleSubmit, setValue, reset, formState: {errors} } = useForm<StokBarangInputs>();

    const onSubmit: SubmitHandler<StokBarangInputs> = (data, event) => {
        setIsSubmitLoading(true);
        data.createdBy = 'Rio';
        const payload = {
            nama: data.nama,
            jumlah: Number(data.jumlah),
            satuan: data.satuan,
            hargaModal: Number(data.hargaModal),
            hargaJual: Number(data.hargaJual),
            createdBy: data.createdBy,
            tokoId: data.tokoId,
        }
        StokModule.create(payload)
        .then(res => res.json())
        .then(result => {
          setIsModalOpen(false);
          reset();
          toast.success(result.message);
          handleReloadStok();
        })
        .catch((error) => toast.success(error.error))
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
                        Form Tambah Barang
                    </h2>
                </Dialog.Title>
                <Dialog.Description>
                        <div className="flex flex-col gap-4 flex-wrap">
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Nama Barang</FormLabel>
                                <FormInput {...register('nama', {required: 'Nama barang tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Jumlah</FormLabel>
                                <FormInput {...register('jumlah', {required: 'Jumlah barang tidak boleh kosong'})} id="regular-form-1" type="number" min="0" placeholder="" />
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Satuan</FormLabel>
                                <FormInput {...register('satuan', {required: 'Satuan barang tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Harga Modal</FormLabel>
                                <FormInput {...register('hargaModal', {required: 'Harga modal barang tidak boleh kosong'})} id="regular-form-1" type="number" min="0" placeholder="" />
                            </div>
                            <div className="w-full">
                                <FormLabel htmlFor="regular-form-1">Harga Jual</FormLabel>
                                <FormInput {...register('hargaJual', {required: 'Harga jual barang tidak boleh kosong'})} id="regular-form-1" type="number" min="0" placeholder="" />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <FormLabel htmlFor="modal-form-6">
                                    Lokasi
                                </FormLabel>
                                <FormSelect {...register('tokoId')} onChange={(e: ChangeEvent) => setValue('tokoId', (e.target as HTMLSelectElement).value)} id="modal-form-6">
                                    <option value=''>-- Pilih Lokasi --</option>
                                    {tokoList.length > 0 ? tokoList.map((item, index) => (
                                        <option value={item.id}>{item.description}</option>
                                    )) : ''}
                                </FormSelect>
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

function Main () {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tokoList, setTokoList] = useState<IToko[]>([]);
  const [stokList, setStokList] = useState<IStok[]>([]);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const deleteButtonRef = useRef(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const handleReloadStok = () => {
    setIsRefreshData(!isRefreshData);
  }

  const fetchTokoData = () => {
    
    TokoModule.getAll()
    .then(res => res.json())
    .then(result => setTokoList(result.data));
  }

  const fetchStokData = (page: number, perPage: number) => {
    setIsDataLoading(true);
    const params = {
      page,
      perPage
    }
    StokModule.get(params)
    .then(res => res.json())
    .then(result => setStokList(result.data))
    .finally(() => setIsDataLoading(false));
  }

  useEffect(() => {
    fetchTokoData();
    fetchStokData(page, perPage);
  }, [isRefreshData, perPage]);

  return (
    <>
      <Toaster/>
      <TambahBarangModal 
        handleReloadStok={handleReloadStok}
        tokoList={tokoList}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen} 
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Stok Barang</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
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
          <div className="hidden mx-auto md:block text-slate-500">
            Showing 1 to 10 of {stokList.length} entries
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          {!isDataLoading ? <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
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
                    <div className="flex items-center justify-start">
                      <a className="flex items-center mr-3" href="#">
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                        Edit
                      </a>
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
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <Pagination.Link>
              <Lucide icon="ChevronsLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronLeft" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>1</Pagination.Link>
            <Pagination.Link active>2</Pagination.Link>
            <Pagination.Link>3</Pagination.Link>
            <Pagination.Link>...</Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronRight" className="w-4 h-4" />
            </Pagination.Link>
            <Pagination.Link>
              <Lucide icon="ChevronsRight" className="w-4 h-4" />
            </Pagination.Link>
          </Pagination>
          <FormSelect onChange={(e) => setPerPage(e.target.value as unknown as number)} className="w-20 mt-3 !box sm:mt-0">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={35}>35</option>
            <option value={50}>50</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
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
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
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
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;

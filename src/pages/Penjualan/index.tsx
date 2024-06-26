import { useEffect, useState } from "react";
import _ from "lodash";
import PenjualanModule from "../../modules/penjualan/penjualan";
import TokoModule from "../../modules/toko/toko";
import Button from "../../base-components/Button";
import Select, { SingleValue } from 'react-select';
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu } from "../../base-components/Headless";
import PaginationCustom from "../../components/Custom/PaginationCustom";
import {IToko, ITokoFetchQuery} from "../../modules/toko/interfaces/toko.interface";
import Table from "../../base-components/Table";
import LoadingIcon from "../../base-components/LoadingIcon";
import TambahModal from "./components/modal/tambah";
import ActionButtons from "./components/button-group/action";
import { Toaster } from "react-hot-toast";
import { IPenjualan, IPenjualanFetchQuery } from "../../modules/penjualan/interfaces/penjualan.interface";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TokoOptionType } from "./types/penjualan.type";
import moment from "moment";
import { thousandLimiter } from "../../helpers/helper";
import { AxiosResponse } from "axios";
import PrintConfirmation from "./components/modal/print-confirmation";

function Main() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string|undefined>();
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [tokoOptionList, setTokoOptionList] = useState<TokoOptionType[]>([]);
  const [tambahModalOpen, setTambahModalOpen] = useState<boolean>(false);
  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);
  const [toko, setToko] = useState<SingleValue<TokoOptionType>>({
    label: 'Semua Toko',
    value: 'all'
  });
  const [penjualanList, setPenjualanList] = useState<IPenjualan[]>([]);


  const handleReloadData = () => {
    setIsRefreshData(!isRefreshData);
  }

  const handleReset = () => {
    setToko({
      label: 'Semua Toko',
      value: 'all'
    });
    setDateStart(null);
    setDateEnd(null);
    setSearch("");
    setIsRefreshData(!isRefreshData);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const fetchPenjualanData = (
        search: string | undefined,
        page: number,
        perPage: number,
        dateStart: Date | null,
        dateEnd: Date | null,
        tokoId: string | undefined
    ) => {
    setIsDataLoading(true);
    const params: IPenjualanFetchQuery = {
      search,
      page,
      perPage,
      dateStart,
      dateEnd,
      tokoId,
    };

    PenjualanModule.get(params)
    .then((res: AxiosResponse) => {
      const result = res.data;
      console.log(result.data);
      setPenjualanList(result.data);
      // setPage(result.document.currentPage);
      // setPerPage(result.document.perPage);
      setTotalCount(result.document.totalCount);
      setTotalPages(result.document.totalPages);
    })
    .finally(() => setIsDataLoading(false));
  }

  const fetchTokoData = () => {
    TokoModule.getAll()
    .then((res: AxiosResponse) => {
        const result = res.data;
        const temp: TokoOptionType[] = [{
            label: 'Semua Toko',
            value: 'all'
        }];
        result.data.map((item: IToko) => temp.push({
            label: item.description,
            value: item.id
        }))
        setTokoOptionList(temp)
    });
  }

  const onChangeDateFilter = (dates: any) => {
    console.log(dates);
    const [start, end] = dates;
    setDateStart(start);
    setDateEnd(end);
  }

  useEffect(() => {
    fetchPenjualanData(search, page, perPage, dateStart, dateEnd, toko?.value);
  }, [isRefreshData, page, perPage]);

  useEffect(() => {
    fetchTokoData();
  }, [])

  return (
    <>
      <Toaster/>
      <TambahModal
        handleReloadData={handleReloadData}
        isModalOpen={tambahModalOpen}
        setIsModalOpen={setTambahModalOpen}
        tokoOptionList={tokoOptionList}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Penjualan</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setTambahModalOpen(true)}>
            Tambah Penjualan
          </Button>
          {/* <Menu>
            <Menu.Button as={Button} className="px-2 !box">
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Plus" className="w-4 h-4" />
              </span>
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="Users" className="w-4 h-4 mr-2" /> Add Group
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="MessageCircle" className="w-4 h-4 mr-2" /> Send
                Message
              </Menu.Item>
            </Menu.Items>
          </Menu> */}
          <div className="w-full sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                value={search}
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Cari nomor penjualan.."
                onChange={(e) => handleSearch(e)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
          <div className="w-full sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <Select 
                onChange={(e) => setToko(e)}
                value={toko}
                options={tokoOptionList}
              />
            </div>
          </div>
          <div className="w-full sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <DatePicker
                className="h-9 w-56 rounded-md border-slate-400 text-sm"
                selected={dateStart}
                onChange={onChangeDateFilter}
                startDate={dateStart}
                endDate={dateEnd}
                selectsRange
                placeholderText="Pilih tanggal"
              />
            </div>
          </div>
          <Button variant="primary" className="shadow-md" onClick={() => handleReloadData()}>
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
                  NO. PENJUALAN
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NAMA PELANGGAN
                </Table.Th>
                {/* <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TELAH DIBAYAR
                </Table.Th> */}
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  JUMLAH TOTAL
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  DIBUAT PADA
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  AKSI
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {penjualanList && penjualanList.length > 0 ? penjualanList.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.nomor}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.namaPelanggan}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {
                      thousandLimiter(Number(item.PembayaranPenjualan[0]?.totalPembayaran), 'Rp')
                    }
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {moment(item.createdAt).format('DD MMMM YYYY')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <ActionButtons
                      handleReloadData={handleReloadData}
                      initialValues={item}
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

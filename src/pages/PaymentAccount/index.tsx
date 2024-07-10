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
import { IPaymentAccount, IPaymentAccountFetchQuery } from "../../modules/payment-account/interfaces/payment-account.interface";
import PaymentAccountModule from '../../modules/payment-account/payment-account';

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
  const [data, setData] = useState<IPaymentAccount[]>([]);


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

  const fetchPaymentAccountData = (
        search: string | undefined,
        page: number,
        perPage: number,
    ) => {
    setIsDataLoading(true);
    const params: IPaymentAccountFetchQuery = {
      search,
      page,
      perPage
    };

    PaymentAccountModule.get(params)
    .then((res: AxiosResponse) => {
      const result = res.data;
      console.log(result.data);
      setData(result.data);
      setTotalCount(result.document.totalCount);
      setTotalPages(result.document.totalPages);
    })
    .finally(() => setIsDataLoading(false));
  }

  useEffect(() => {
    fetchPaymentAccountData(search, page, perPage);
  }, [isRefreshData, page, perPage]);

  return (
    <>
      <Toaster/>
      <TambahModal
        handleReloadData={handleReloadData}
        isModalOpen={tambahModalOpen}
        setIsModalOpen={setTambahModalOpen}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Payment Account</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setTambahModalOpen(true)}>
            Tambah
          </Button>
          <div className="w-full sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                value={search}
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Cari.."
                onChange={(e) => handleSearch(e)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
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
                  NAMA BANK
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NOMOR REKENING
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NAMA
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data && data.length > 0 ? data.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.bankName}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.accountNumber}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.accountName}
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

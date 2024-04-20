import { useEffect, useState } from "react";
import _ from "lodash";
import PenggunaModule from "../../modules/pengguna/pengguna";
import TokoModule from "../../modules/toko/toko";
import RoleModule from "../../modules/role/role";
import Button from "../../base-components/Button";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu } from "../../base-components/Headless";
import PaginationCustom from "../../components/Custom/PaginationCustom";
import { IPengguna, IPenggunaFetchQuery } from "../../modules/pengguna/interfaces/pengguna.interface";
// import TambahModal from "./components/modal/tambah-modal";
import {IToko, ITokoFetchQuery} from "../../modules/toko/interfaces/toko.interface";
import IRole from "../../modules/role/interface/role.interface";
import { Link } from "react-router-dom";
import Table from "../../base-components/Table";
import LoadingIcon from "../../base-components/LoadingIcon";
import TambahModal from "./components/modal/tambah";
import ActionButtons from "./components/button-group/action";
import { Toaster } from "react-hot-toast";
import { AxiosResponse } from "axios";

function Main() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string|undefined>();
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [tokoList, setTokoList] = useState<IToko[]>([]);
  const [tambahModalOpen, setTambahModalOpen] = useState<boolean>(false);

  const handleReloadData = () => {
    setIsRefreshData(!isRefreshData);
  }

  const handleReset = () => {
    setSearch("");
    setIsRefreshData(!isRefreshData);
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const fetchTokoData = (search: string | undefined, page: number, perPage: number) => {
    setIsDataLoading(true);
    const params: ITokoFetchQuery = {
      search,
      page,
      perPage
    };

    if (search) {
      setTimeout(() => {
      TokoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setTokoList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log(result.data);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
      }, 1000)
    } else {
      TokoModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        console.log(result.data);
        setTokoList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
    }
  }

  useEffect(() => {
    fetchTokoData(search, page, perPage);
  }, [isRefreshData, page, perPage]);

  return (
    <>
      <Toaster/>
      <TambahModal
        handleReloadData={handleReloadData}
        isModalOpen={tambahModalOpen}
        setIsModalOpen={setTambahModalOpen}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Toko</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setTambahModalOpen(true)}>
            Tambah Toko
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
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                value={search}
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Cari nama toko..."
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
                  NAMA TOKO
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TELEPON
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  KOTA
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  ALAMAT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  Jumlah Pengguna
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  AKSI
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tokoList.length > 0 ? tokoList.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.description}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.contact}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.city}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.address}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.User.length}
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

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
import TambahModal from "./components/modal/tambah-modal";
import {IToko} from "../../modules/toko/interfaces/toko.interface";
import IRole from "../../modules/role/interface/role.interface";
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";
import LoadingIcon from "../../base-components/LoadingIcon";

function Main() {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string|undefined>();
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [penggunaList, setPenggunaList] = useState<IPengguna[]>([]);
  const [tambahModalOpen, setTambahModalOpen] = useState<boolean>(false);
  const [tokoList, setTokoList] = useState<IToko[]>([]);
  const [roleList, setRoleList] = useState<IRole[]>([]);

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

  const fetchPenggunaData = (search: string | undefined, page: number, perPage: number) => {
    setIsDataLoading(true);
    const params: IPenggunaFetchQuery = {
      search,
      page,
      perPage
    };

    if (search) {
      setTimeout(() => {
      PenggunaModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        setPenggunaList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log(result.data);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
      }, 1000)
    } else {
      PenggunaModule.get(params)
      .then((res: AxiosResponse) => {
        const result = res.data;
        console.log(result.data);
        setPenggunaList(result.data);
        // setPage(result.document.currentPage);
        // setPerPage(result.document.perPage);
        console.log(result.data);
        setTotalCount(result.document.totalCount);
        setTotalPages(result.document.totalPages);
      })
      .finally(() => setIsDataLoading(false));
    }
  }

  const fetchTokoData = () => {
    TokoModule.getAll()
    .then((res: AxiosResponse) => {
      const result = res.data;
      setTokoList(result.data);
    })
  }

  const fetchRoleData = () => {
    RoleModule.getAll()
    .then((res: AxiosResponse) => {
      const result = res.data;
      setRoleList(result.data);
    } );
  }

  useEffect(() => {
    fetchPenggunaData(search, page, perPage);
  }, [isRefreshData, page, perPage]);

  useEffect(() => {
    fetchTokoData();
    fetchRoleData();
  }, []);

  return (
    <>
      <TambahModal
        handleReloadData={handleReloadData}
        isModalOpen={tambahModalOpen}
        setIsModalOpen={setTambahModalOpen}
        tokoList={tokoList}
        roleList={roleList}
      />
      <h2 className="mt-10 text-lg font-medium intro-y">Daftar Pengguna</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y gap-2">
          <Button variant="primary" className="shadow-md" onClick={() => setTambahModalOpen(true)}>
            Tambah Pengguna
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
                placeholder="Search..."
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
        {/* BEGIN: Users Layout */}
          {
            !isDataLoading ? penggunaList.length > 0 ? penggunaList.map((item, index) => (
              <div key={index} className="col-span-12 intro-y md:col-span-6">
                <div className="box">
                  <div className="flex flex-col items-center p-5 lg:flex-row">
                    <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1 flex justify-center items-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-darkmode-400/70 flex justify-center items-center">
                            <p className="font-bold text-slate-700 dark:text-slate-500">{item.name[0]}</p>
                        </div>
                    </div>
                    <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                      <a href="" className="font-medium">
                        {item.name}
                      </a>
                      <div className="text-slate-500 text-xs mt-0.5">
                        {item.role.description}
                      </div>
                    </div>
                    <div className="flex mt-4 lg:mt-0">
                      <Button variant="outline-secondary" className="px-2 py-1">
                        <Link to={`/pengguna/${item.id}`}>Lihat Detail</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )) : ''
            : <div className="col-span-12 flex justify-center absoulte">
            <div className="w-16 h-16">
              <LoadingIcon icon="oval" color="grey" className="w-1 h-1 ml-2" />
            </div>
          </div>
          }
        {/* BEGIN: Users Layout */}
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

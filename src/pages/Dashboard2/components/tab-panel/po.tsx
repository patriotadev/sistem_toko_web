import React, { useEffect, useMemo, useState } from 'react';
import clsx from "clsx";
import fakerData from "../../../../utils/faker";
import Lucide from "../../../../base-components/Lucide";
import Tippy from "../../../../base-components/Tippy";
import LoadingIcon from '../../../../base-components/LoadingIcon';
import Button from '../../../../base-components/Button';
import { Dialog, Menu } from '../../../../base-components/Headless';
import { FormInput, FormLabel } from '../../../../base-components/Form';
import Table from '../../../../base-components/Table';
import Select, { SingleValue } from 'react-select';
import { AxiosResponse } from 'axios';
import PtModule from '../../../../modules/pt/pt';
import { IPt } from '../../../../modules/pt/interfaces/pt.interface';
import { IProject } from '../../../../modules/project/interfaces/project.interface';
import LaporanPoModule from '../../../../modules/laporan-po/laporan-po';
import { thousandLimiter } from '../../../../helpers/helper';
import PaginationCustom from '../../../../components/Custom/PaginationCustom';
import ProjectModule from '../../../../modules/project/project';
import PoModule from '../../../../modules/po/po';
import { IPo } from '../../../../modules/po/interfaces/po.interface';
import moment from 'moment';

const RiwayatModal = ({ isRiwayatModalOpen, setIsRiwayatModalOpen, initialValues }: any) => {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [poList, setPoList] = useState<any[]>([]);
  const [riwayatList, setRiwayatList] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedPo, setSelectedPo] = useState<any>(null);

  const fetchProject = (ptId: string) => {
    const params = {
      ptId
    };
    ProjectModule.getList(params).then((res: AxiosResponse) => {
      const result = res.data;
      const temp: any[] = [];
      result.data.forEach((item: IProject) => {
        temp.push({
          label: item.nama,
          value: item.id,
          po: item.Po
        })
      })
      setProjectList(temp);
    });
  };  

  const fetchPo = (po: IPo[]) => {
    const temp: any[] = [];   
    po?.map((item: any) => {
        temp.push({
          label: item.noPo,
          value: item.id,
        })
      })
      setPoList(temp)
  }

  const fetchRiwayatPembayaran = (poId: string) => {
    PoModule.getRiwayatPembayaran(poId).then((res: AxiosResponse) => {
      const result = res.data;
      setRiwayatList(result.data)
    })
  }

  useEffect(() => {
    fetchProject(initialValues.id);
  }, [isRiwayatModalOpen]);

  useEffect(() => {
    if (selectedProject) {
      fetchPo(selectedProject.po);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedPo) {
      fetchRiwayatPembayaran(selectedPo.value);
    }
  }, [selectedPo]);


  return (
    <div>
      <Dialog size="xl" open={isRiwayatModalOpen} onClose={()=> {
            setIsRiwayatModalOpen(false);
            }}
            >
            <Dialog.Panel className="p-2">
                <Dialog.Title>
                  <h2 className="mr-auto text-base flex gap-2 items-center">
                    <Lucide icon="FileClock" className="w-6 h-6"/>
                    Riwayat Pembayaran
                  </h2>
                </Dialog.Title>
                <Dialog.Description>
                <div className="flex flex-col gap-4 flex-wrap">
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Pilih Project</FormLabel>
                      <Select
                        onChange={(e) => {
                          console.log(e);
                          setSelectedProject(e)
                          setSelectedPo(null)
                        }}
                        value={selectedProject}
                        isSearchable
                        isClearable
                        options={projectList}
                      />
                  </div>
                  <div className="w-full">
                      <FormLabel htmlFor="regular-form-1">Pilih PO</FormLabel>
                      <Select
                        isDisabled={!selectedProject}
                        onChange={(e) => {
                          setSelectedPo(e);
                        }}
                        value={selectedPo}
                        isSearchable
                        isClearable
                        options={poList}
                      />
                  </div>
                </div>
                  {/* BEGIN: Recent Activities */}
                  {
                    riwayatList.length> 0 &&
                  <div className="col-span-12 mt-16 md:col-span-6 xl:col-span-4 2xl:col-span-12 -z-10">
                    <div className="flex items-center h-10 intro-x">
                      <h2 className="mr-5 text-lg font-medium truncate">
                        Riwayat Pembayaran
                      </h2>
                      {/* <a href="" className="ml-auto truncate text-primary">
                        Lihat Selengkapnya
                      </a> */}
                    </div>
                    {
                      riwayatList.map((item) => <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                      {/* <div className="my-4 text-xs text-center intro-x text-slate-500">
                        { moment(item.createdAt).format('DD MMMM YYYY') }
                      </div> */}
                      <div className="relative flex items-center mb-3 intro-x">
                        <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                          <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-darkmode-400/70 flex justify-center items-center">
                            <p className="font-bold text-slate-700 dark:text-slate-500">{item.createdBy[0]}</p>
                          </div>
                          </div>
                        </div>
                        <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                          <div className="flex items-center">
                            <div className="font-medium">
                              {item.createdBy}
                            </div>
                          </div>
                          <div className="mt-1 text-slate-500">
                            {item?.description}
                          </div>
                            <div className="ml-auto text-xs text-slate-500 mt-4">
                              { moment(item.createdAt).format('DD MMMM YYYY HH:mm') }  
                            </div>
                        </div>
                      </div>
                    </div>)
                    }
                  </div>
                  }
                  {/* END: Recent Activities */}
                </Dialog.Description>
                <Dialog.Footer>
                    <Button type="button" variant="secondary" onClick={()=> {
                        setIsRiwayatModalOpen(false);
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
};

const ActionButtons = ({
  initialValues,
  }
  : any) => {

  const [isRiwayatModalOpen, setIsRiwayatModalOpen] = useState<boolean>(false);

  return (
    <>
    <RiwayatModal
      isRiwayatModalOpen={isRiwayatModalOpen}
      setIsRiwayatModalOpen={setIsRiwayatModalOpen}
      initialValues={initialValues}
    />
    <div className="flex items-center justify-start">
      <a className="flex items-center mr-3" href="#" onClick={() => {
        setIsRiwayatModalOpen(true);
      }}>
        <Lucide icon="FileClock" className="w-4 h-4 mr-1" />{" "}
        Pembayaran
      </a>
    </div>
    </>
  );
}

const PoTabPanel = () => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [ptList, setPtList] = useState<IPt[]>([]);
  const [projectList, setProjectList] = useState<IProject[]>([]);
  const [isRefreshData, setIsRefreshData] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedPt, setSelectedPt] = useState<SingleValue<any>>({
    label: 'Semua PT',
    value: 'all'
  });

  const [selectedProject, setSelectedProject] = useState<SingleValue<any>>({
    label: 'Semua Project',
    value: 'all'
  });

  const [data, setData] = useState<any[]>([]);

  const handleReloadData = () => {
    setIsRefreshData(!isRefreshData);
  }

  const handleReset = () => {
    setSelectedPt({
      label: '-- Semua PT --',
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

  const fetchData = async (page: number, perPage: number, ptId: string) => {
    setIsDataLoading(true);
    const params = {
      page,
      perPage,
      ptId
    };
    LaporanPoModule.getDaftarTagihan(params).then((res: AxiosResponse) => {
      const result = res.data;
      console.log(result.data);
      setData(result.data);
      setTotalCount(result.document.totalCount);
      setTotalPages(result.document.totalPages);
    }).finally(() => setIsDataLoading(false));
  }

  useEffect(() => {
    if (selectedPt) {
      fetchProjectList(selectedPt.project);
    }
  }, [selectedPt]);

  useEffect(() => {
    fetchData(page, perPage, selectedPt.value);
  }, [page, perPage, isRefreshData]);

  useEffect(() => {
    fetchPtList();
  }, []);

  return (
    <div className="pt-4">     
      <h2 className="text-lg font-medium intro-y">Laporan PO</h2>
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
                <Lucide icon="Users" className="w-4 h-4 mr-2" /> Add Group
              </Menu.Item>
              <Menu.Item>
                <Lucide icon="MessageCircle" className="w-4 h-4 mr-2" /> Send
                Message
              </Menu.Item>
            </Menu.Items>
          </Menu> */}
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
            <div className="relative w-56">
              <Select placeholder='Semua PT' options={ptList} value={selectedPt} onChange={(e) => {
                setSelectedPt(e);
                setSelectedProject({
                  label: 'Semua Project',
                  value: 'all'
                });
              }} />
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
         <div className="col-span-12 overflow-auto intro-y">
          {!isDataLoading ? <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NAMA PT
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PO BELUM DIAMBIL
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  PO SUDAH DIAMBIL
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NOMINAL BELUM DIAMBIL
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  NOMINAL SUDAH DIAMBIL
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  TOTAL PEMBAYARAN
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  SISA HUTANG
                </Table.Th>
                <Table.Th className="text-start border-b-0 whitespace-nowrap">
                  AKSI
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.length > 0 ? data.map((item, index) => (
                <Table.Tr key={index} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.nama}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.totalPoBelumAmbil}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {item.totalPoAmbil}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(item.Po.reduce((n: any, {masterTotalPembayaran}: any) => n + masterTotalPembayaran, 0) - item.Po.filter((p: any) => p.status !== 'Belum Ambil').reduce((n: number, {totalNominalSj}: any) => n + totalNominalSj, 0), 'Rp')} 
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(item.Po.filter((p: any) => p.status !== 'Belum Ambil').reduce((n: number, {totalNominalSj}: any) => n + totalNominalSj, 0), 'Rp')} 
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(item.Po.reduce((n: any, {masterTotalPembayaran}: any) => n + masterTotalPembayaran, 0), 'Rp')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-start bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    {thousandLimiter(item.Po.reduce((n: any, {masterSisaPembayaran}: any) => n + masterSisaPembayaran, 0), 'Rp')}
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                    <ActionButtons
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
            </div>
  )
}

export default PoTabPanel;
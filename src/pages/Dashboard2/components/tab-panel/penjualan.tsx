import React, { useState, useEffect } from "react";
import { Menu } from "../../../../base-components/Headless";
import Lucide from "../../../../base-components/Lucide";
import Button from "../../../../base-components/Button";
import { SingleValue } from "react-select";
import { LaporanPenjualanOptions } from "../../const/laporan-penjualan";
import Select from "react-select";
import DatePicker from 'react-datepicker';
import { FormLabel, FormSelect } from "../../../../base-components/Form";
import Alert from "../../../../base-components/Alert";
import ReportDonutChart from "../../../../components/ReportDonutChart";
import ReportLineChart from "../../../../components/ReportLineChart";
import ReportPieChart from "../../../../components/ReportPieChart";
import ReportDonutChart1 from "../../../../components/ReportDonutChart1";
import SimpleLineChart1 from "../../../../components/SimpleLineChart1";
import Tippy from "../../../../base-components/Tippy";
import LaporanPoModule from '../../../../modules/laporan-po/laporan-po';
import TokoModule from '../../../../modules/toko/toko';
import { AxiosResponse } from "axios";
import moment from "moment";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { thousandLimiter } from "../../../../helpers/helper";
import { IToko } from "../../../../modules/toko/interfaces/toko.interface";

const Loading = () => {
  return <div className="flex flex-col gap-12 flex-wrap">
    <div className="flex flex-col lg:flex-row gap-12 mt-12">
      <Skeleton count={1} style={{borderRadius: '6px', height: '120px', width: '350px'}} />
      <Skeleton count={1} style={{borderRadius: '6px', height: '120px', width: '350px'}} />
      <Skeleton count={1} style={{borderRadius: '6px', height: '120px', width: '350px'}} />
    </div>
    <div className="flex flex-col lg:flex-row gap-12">
      <Skeleton count={1} style={{borderRadius: '6px', height: '450px', width: '350px'}} />
      <Skeleton count={1} style={{borderRadius: '6px', height: '450px', width: '350px'}} />
    </div>
  </div>
}

const PenjualanTabPanel = () => {
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [laporan, setLaporan] = useState<SingleValue<any>>({
        label: 'Laporan Penjualan Hari Ini',
        value: 'Laporan Penjualan Hari ini'
    });
    const [dateStart, setDateStart] = useState<Date | null>(moment().subtract(1, 'days').toDate());
    const [dateEnd, setDateEnd] = useState<Date | null>(moment().toDate());
    const [isRefreshData, setIsRefreshData] = useState(false);
    const [data, setData] = useState<any>(null);
    const [tokoData, setTokoData] = useState<SingleValue<{label: string, value: string}>[]>();
    const [selectedToko, setSelectedToko] = useState<SingleValue<{label: string, value: string}>>({
      label: 'Semua Toko',
      value: 'all'
    });

    const handleReloadData = () => {
        setIsRefreshData(!isRefreshData);
      }
    
    const handleReset = () => {
      setSelectedToko({
        label: 'Semua Toko',
        value: 'all'
      });
      setLaporan({
          label: 'Laporan Penjualan Hari Ini',
          value: 'Laporan Penjualan Hari ini'
      });
      setDateStart(moment().subtract(1, 'days').toDate());
      setDateEnd(moment().toDate());
      setIsRefreshData(!isRefreshData);
    }

    const onChangeDateFilter = (dates: any) => {
      const [start, end] = dates;
      setDateStart(start);
      setDateEnd(end);
    }

    const fetchData = async (dateStart: Date | null, dateEnd: Date | null, tokoId: string | undefined) => {
      setIsDataLoading(true)
      const params = {
        dateStart,
        dateEnd,
        tokoId
      }
  
      await LaporanPoModule.getLaporanPenjualan(params).then((res: AxiosResponse) => {
        const result = res.data;
        console.log(result.data.data);
        setData(result.data.data);
      }).finally(() => setIsDataLoading(false))
    };

    const fetchToko = async () => {
      await TokoModule.getAll().then((res: AxiosResponse) => {
        const result = res.data;
        const temp: SingleValue<{label: string, value: string}>[] = [
          {label: 'Semua Toko', value: 'all'}
        ];
        result.data.map((item: IToko) => temp.push({
          label: item.description,
          value: item.id
        }));
        setTokoData(temp);
      });
    }

    useEffect(() => {
      fetchData(dateStart, dateEnd, selectedToko?.value)
    }, [isRefreshData]);

    useEffect(() => {
      fetchToko();
    }, [])

    return (
        <div className="pt-10">     
      <h2 className="text-lg font-medium intro-y">Laporan Penjualan</h2>
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
              <FormSelect className="h-11" onChange={(e) => {
                setLaporan({value: e.target.value, label: e.target.value});
                switch (e.target.value) {
                  case 'Laporan Penjualan Hari Ini':
                    setDateStart(moment().subtract(1, 'days').toDate());
                    setDateEnd(moment().toDate());
                    break;
                  case 'Laporan Penjualan Bulan Ini':
                    setDateStart(moment().startOf('month').toDate());
                    setDateEnd(moment().endOf('month').toDate());
                    break;
                  case 'Laporan Penjualan Tahun Ini':
                    setDateStart(moment().startOf('year').toDate());
                    setDateEnd(moment().endOf('year').toDate());
                      break;
                  case 'Pilih Tanggal':
                    setData([]);
                    setDateStart(null);
                    setDateEnd(null);
                      break;
                  default:
                    break;
                }
              }}>
                {LaporanPenjualanOptions.map((item) => <option selected={item.value === laporan.value} value={item.value}>{item.label}</option> )}
              </FormSelect>
            </div>
          </div>
          {
            laporan?.value === 'Pilih Tanggal' && 
            <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
              <div className="relative w-56">
                <DatePicker
                  className="h-11 w-56 rounded-md border-slate-400 text-sm"
                  selected={dateStart}
                  onChange={onChangeDateFilter}
                  startDate={dateStart}
                  endDate={dateEnd}
                  selectsRange
                  placeholderText="Pilih tanggal"
                />
              </div>
            </div>
          }
           <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-2 md:ml-0">
            <div className="relative w-56">
              <FormSelect className="h-11" onChange={(e) => setSelectedToko({value: e.target.value, label: e.target.value})}>
                {tokoData && tokoData.map((item) => <option selected={item?.value === selectedToko?.value} value={item?.value}>{item?.label}</option> )}
              </FormSelect>
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
          {/* BEGIN: General Report */}
          {
            !isDataLoading && data?.TotalPenjualan > 0 &&
            <div className="grid grid-cols-12 col-span-12 gap-6 mt-12">
            <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
              <div className="p-5 box zoom-in">
                <div className="flex items-center">
                  <div className="flex-none w-2/4">
                    <div className="text-lg font-medium truncate">
                      Penjualan
                    </div>
                    <div className="mt-1 text-slate-500">{data?.TotalPenjualan} Penjualan</div>
                  </div>
                  <div className="relative flex-none ml-auto">
                    {/* <ReportDonutChart1 width={90} height={90} /> */}
                    {/* <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full font-medium">
                      45%
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
              <div className="p-5 box zoom-in">
                <div className="flex">
                  <div className="mr-3 text-lg font-medium truncate">
                    Pendapatan
                  </div>
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content="Naik 33% dari bulan lalu"
                    >
                      33%
                      <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-1">
                  {/* <SimpleLineChart1 height={58} className="-ml-1" /> */}
                  <div className="mt-1 text-slate-500">{thousandLimiter(data.TotalPendapatan, 'Rp')}</div>
                </div>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
              <div className="p-5 box zoom-in">
                <div className="flex">
                  <div className="mr-3 text-lg font-medium truncate">
                    Pendapatan Bersih
                  </div>
                  <div className="ml-auto">
                    <Tippy
                      as="div"
                      className="cursor-pointer bg-danger py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                      content="Turun 33% dari bulan lalu"
                    >
                      33%
                      <Lucide icon="ChevronDown" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="mt-1">
                  {/* <SimpleLineChart1 height={58} className="-ml-1" /> */}
                  <div className="mt-1 text-slate-500">{thousandLimiter(data.TotalPendapatanBersih, 'Rp')}</div>
                </div>
              </div>
            </div>
          </div>
          }
          {/* END: General Report */}

          {
            !isDataLoading && data?.TotalPenjualan > 0 && <div className="grid grid-cols-12 col-span-12 gap-6 mt-8">
            {/* BEGIN: Weekly Top Seller */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="p-5 mt-5 intro-y box">
              <h2 className="mr-5 text-lg font-medium truncate">
                5 Barang Terlaris
              </h2>
              <div className="mt-3">
                <ReportPieChart height={213} dataValue={data?.stokTerlaris} />
              </div>
              <div className="mx-auto mt-8 w-52 sm:w-auto">
                {
                  data.stokTerlaris.map((s: any) => 
                  <div className="flex items-center">
                    <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                      <span className="truncate">{s?.stokName}</span>
                    <span className="ml-auto font-medium">{s?.sum}</span>
                  </div>
                  )
                }
              </div>
            </div>
          </div>
          {/* END: Weekly Top Seller */}
            {/* BEGIN: Sales Report */}
          {/* <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <div className="p-5 mt-5 intro-y box">
              <h2 className="mr-5 text-lg font-medium truncate">
                Persentase Metode Pembayaran
              </h2>
              <div className="mt-3">
                <ReportDonutChart height={213} />
              </div>
              <div className="mx-auto mt-8 w-52 sm:w-auto">
                <div className="flex items-center">
                  <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                  <span className="truncate">17 - 30 Years old</span>
                  <span className="ml-auto font-medium">62%</span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                  <span className="truncate">31 - 50 Years old</span>
                  <span className="ml-auto font-medium">33%</span>
                </div>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                  <span className="truncate">&gt;= 50 Years old</span>
                  <span className="ml-auto font-medium">10%</span>
                </div>
              </div>
            </div>
          </div> */}
          {/* END: Sales Report */}
          </div>
          }
          { isDataLoading && <Loading/> }
      </div>
      {
        data?.TotalPenjualan < 1 &&
        <div className="w-100 mt-8">
          <Alert variant="soft-pending" className="flex items-center mb-2 w-full">
            <Lucide icon="AlertTriangle" className="w-6 h-6 mr-2" />{" "}
            Data tidak ditemukan.
          </Alert>
        </div>
      }
      </div>
    )
}

export default PenjualanTabPanel
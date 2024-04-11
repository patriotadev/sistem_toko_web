import _ from "lodash";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import TinySlider, {
  TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Litepicker from "../../base-components/Litepicker";
import ReportDonutChart from "../../components/ReportDonutChart";
import ReportLineChart from "../../components/ReportLineChart";
import ReportPieChart from "../../components/ReportPieChart";
import ReportDonutChart1 from "../../components/ReportDonutChart1";
import SimpleLineChart1 from "../../components/SimpleLineChart1";
import LeafletMap from "../../components/LeafletMap";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import { getUserLogin } from "../../helpers/helper";
import MasterTabPanel from "./components/tab-panel/master";
import PoTabPanel from "./components/tab-panel/po";
import PoImage from "../../assets/images/box.png";
import MasterImage from "../../assets/images/stocks.png";
import PenjualanImage from "../../assets/images/shopping-list.png";
import StokImage from "../../assets/images/packages.png";

function Main() {
  const [salesReportFilter, setSalesReportFilter] = useState<string>();
  const importantNotesRef = useRef<TinySliderElement>();
  const prevImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("prev");
  };
  const nextImportantNotes = () => {
    importantNotesRef.current?.tns.goTo("next");
  };


  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-12">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-8">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                Laporan
              </h2>
              <a href="" className="flex items-center ml-auto text-primary">
                <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" /> Reload
                Data
              </a>
            </div>
            <div className="mt-5">
            <Tab.Group>
              <Tab.List variant="boxed-tabs" className='flex gap-4 h-64 rounded-md overflow-x-auto overflow-y-hidden'>
                    <Tab>
                        <Tab.Button className="w-full py-2 text-xl font-semibold" as="button">
                          <div className="h-56 w-56 md:w-80 rounded-md">
                            Master
                            <div className="h-full flex justify-center items-center -mt-6">
                             <img src={MasterImage} width={100} height={100} />
                            </div>
                          </div>
                        </Tab.Button>
                    </Tab>
                    <Tab>
                        <Tab.Button className="w-full py-2 text-xl font-semibold" as="button">
                          <div className="h-56 w-56 md:w-80 rounded-md">
                            PO
                            <div className="h-full flex justify-center items-center -mt-6">
                             <img src={PoImage} width={100} height={100} />
                            </div>
                          </div>
                        </Tab.Button>
                    </Tab>
                    <Tab>
                        <Tab.Button className="w-full py-2 text-xl font-semibold" as="button">
                          <div className="h-56 w-56 md:w-80 rounded-md">
                            Penjualan
                            <div className="h-full flex justify-center items-center -mt-6">
                             <img src={PenjualanImage} width={100} height={100} />
                            </div>
                          </div>
                        </Tab.Button>
                    </Tab>
                    <Tab>
                        <Tab.Button className="w-full py-2 text-xl font-semibold" as="button">
                          <div className="h-56 w-56 md:w-80 rounded-md">
                            Stok Barang
                            <div className="h-full flex justify-center items-center -mt-6">
                             <img src={StokImage} width={100} height={100} />
                            </div>
                          </div>
                        </Tab.Button>
                    </Tab>
              </Tab.List>
              <Tab.Panels className="mt-5">
                  <Tab.Panel className="leading-relaxed">
                    {/* <MasterTabPanel/> */}
                  </Tab.Panel>
                  <Tab.Panel className="leading-relaxed">
                    <PoTabPanel/>
                  </Tab.Panel>
                  <Tab.Panel className="leading-relaxed">
                   
                  </Tab.Panel>
                  <Tab.Panel className="leading-relaxed">
                
                  </Tab.Panel>
              </Tab.Panels>
          </Tab.Group>
            </div>
          </div>
          {/* END: General Report */}
        </div>
      </div>
      {/* <div className="col-span-12 2xl:col-span-3">
        <div className="pb-10 -mb-10 2xl:border-l">
          <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
           
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Main;

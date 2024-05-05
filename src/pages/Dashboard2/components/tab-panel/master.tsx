import React, { useEffect, useState } from 'react';
import clsx from "clsx";
import Lucide from "../../../../base-components/Lucide";
import Tippy from "../../../../base-components/Tippy";
import LaporanPoModule from '../../../../modules/laporan-po/laporan-po';
import { AxiosResponse } from 'axios';

type dataType = {
  ptCount: number
  projectCount: number
  userCount: number
  tokoCount: number
}

const MasterTabPanel = () => {
  const [data, setData] = useState<dataType>();

  const fetchData = async () => {
    await LaporanPoModule.getMasterReport()
      .then((res: AxiosResponse) => {
        const result = res.data;
        setData(result.data);
      });
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Building"
                        className="w-[28px] h-[28px] text-primary"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {data?.ptCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      PT
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="FolderOpen"
                        className="w-[28px] h-[28px] text-pending"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {data?.projectCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Project
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Users"
                        className="w-[28px] h-[28px] text-warning"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {data?.userCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      User
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="Factory"
                        className="w-[28px] h-[28px] text-success"
                      />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {data?.userCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Toko
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default MasterTabPanel;
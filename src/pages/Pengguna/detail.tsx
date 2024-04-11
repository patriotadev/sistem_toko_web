import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import PenggunaModule from '../../modules/pengguna/pengguna';
import TokoModule from "../../modules/toko/toko";
import RoleModule from "../../modules/role/role";
import { FormInput, FormLabel, FormSelect, FormSwitch } from "../../base-components/Form";
import Progress from "../../base-components/Progress";
import Lucide from "../../base-components/Lucide";
import SimpleLineChart from "../../components/SimpleLineChart";
import SimpleLineChart1 from "../../components/SimpleLineChart1";
import SimpleLineChart2 from "../../components/SimpleLineChart2";
import { Menu, Tab } from "../../base-components/Headless";
import { Tab as HeadlessTab } from "@headlessui/react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IPengguna } from "../../modules/pengguna/interfaces/pengguna.interface";
import TomSelect from "../../base-components/TomSelect";
import {IToko} from "../../modules/toko/interfaces/toko.interface";
import IRole from "../../modules/role/interface/role.interface";
import { RoleOptionType, TokoOptionType } from "./types/pengguna.type";
import Select, { SingleValue } from 'react-select';
import ProfileTabPanel from "./components/tab-panel/profile";
import AccountTabPanel from "./components/tab-panel/account";
import { AxiosResponse } from "axios";

function Main() {
    const { id } = useParams();
    const [user, setUser] = useState<IPengguna>();
    const [roleOptionList, setRoleOptionList] = useState<RoleOptionType[]>([]);
    const [tokoOptionList, setTokoOptionList] = useState<TokoOptionType[]>([]);
    const [selectedRole, setSelectedRole] = useState<SingleValue<RoleOptionType>>();
    const [selectedToko, setSelectedToko] = useState<SingleValue<TokoOptionType>>();
    const fetchUserData = (userId: string) => {
        PenggunaModule.getOne(userId).then((res: AxiosResponse) => {
          const result = res.data;
          setUser(result.data);
        })
    };

    const fetchTokoData = () => {
      TokoModule.getAll()
      .then((res: AxiosResponse) => {
        const result = res.data;
        const tokoTemp: TokoOptionType[] = [];
            result.data.forEach((item: IToko) => {
                tokoTemp.push({
                    label: item.description,
                    value: item.id
                })
            });
            setTokoOptionList(tokoTemp);
      });
    }
  
    const fetchRoleData = () => {
      RoleModule.getAll()
      .then((res: AxiosResponse) => {
        const result = res.data;
        const roleTemp: RoleOptionType[] = [];
            result.data.forEach((item: IRole) => {
                roleTemp.push({
                    label: item.description,
                    value: item.id
                })
            });
            setRoleOptionList(roleTemp);
      });
    }
    
    useEffect(() => {
        if (id) {
          fetchTokoData();
          fetchRoleData();
          fetchUserData(id);
        }
    }, [id]);

    useEffect(() => {
        if (user) {
          setSelectedRole({
            label: user.role.description,
            value: user.role.id
          });
          setSelectedToko({
            label: user.toko.description,
            value: user.toko.id
          });
        }
    }, [user]);

  return (
    <>
      <div className="flex items-center mt-8 intro-y justify-start">
        <Button variant="outline-secondary" size="sm">
            <Lucide icon="ArrowLeft" className="w-4 h-4 mr-1" />
            <Link to={'/pengguna'}>
                Kembali
            </Link>
        </Button>
      </div>
      <Tab.Group>
        <div className="px-5 pt-5 mt-5 intro-y box">
          <div className="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
            <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
              <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit hidden lg:inline">
                    <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-darkmode-400/70 flex justify-center items-center">
                        <p className="font-bold text-slate-700 text-4xl dark:text-slate-500">{user?.name[0]}</p>
                    </div>
                <div className="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary">
                  <Lucide icon="Camera" className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-5">
                <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal text-center lg:text-left">
                  {user?.name}
                </div>
                <div className="text-slate-500 text-center lg:text-left">{user?.role.description}</div>
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-3">
                Contact Details
              </div>
              <div className="flex flex-col items-center justify-center mt-4 lg:items-start">
                <div className="flex items-center truncate sm:whitespace-normal">
                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                  {user?.email}
                </div>
              </div>
            </div>
          </div>
          <Tab.List
            variant="link-tabs"
            className="flex-col justify-center text-center sm:flex-row lg:justify-start"
          >
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">
                Profile
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">Account</Tab.Button>
            </Tab>
            {/* <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">
                Activities
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">Tasks</Tab.Button>
            </Tab> */}
          </Tab.List>
        </div>
          {user && 
            <div>
              <ProfileTabPanel
                user={user}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                selectedToko={selectedToko}
                setSelectedToko={setSelectedToko}
                roleOptionList={roleOptionList}
                tokoOptionList={tokoOptionList}
              />
  
              <AccountTabPanel
                user={user}
              />
            </div>
          } 
      </Tab.Group>
    </>
  );
}

export default Main;

import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { icons } from "../../base-components/Lucide";
import { useAppSelector } from "../hooks";
import { getUserLogin } from "../../helpers/helper";

const fetchUserMenu = async () => {
  const result = await getUserLogin();
  return result?.userRoleMenu;
}
export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  // menu: await fetchUserMenu() as unknown as any
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: '/',
    },
    {
      icon: "Building",
      title: "PT",
      subMenu: [
        {
          icon: "ChevronRight",
          pathname: "/pt",
          title: "PT",
        },
        {
          icon: "ChevronRight",
          pathname: "/project",
          title: "Project",
        },
        {
          icon: "ChevronRight",
          pathname: "/po",
          title: "PO",
        },
        {
          icon: "ChevronRight",
          pathname: "/surat-jalan-po",
          title: "Surat Jalan",
        },
        {
          icon: "ChevronRight",
          pathname: "/invoice-po",
          title: "Invoice",
        },
        {
          icon: "ChevronRight",
          pathname: "/tanda-terima-nota",
          title: "Tanda Terima Nota",
        },
      ],
    },
    // {
    //   icon: "Files",
    //   title: "Penjualan",
    //   subMenu: [
    //     {
    //       icon: "ChevronRight",
    //       pathname: "/penjualan",
    //       title: "Penjualan",
    //     },
    //     {
    //       icon: "ChevronRight",
    //       pathname: "/penjualan/surat-jalan",
    //       title: "Surat Jalan",
    //     },
    //     {
    //       icon: "ChevronRight",
    //       pathname: "/penjualan/invoice",
    //       title: "Invoice",
    //     },
    //     {
    //       icon: "ChevronRight",
    //       pathname: "/penjualan/nota",
    //       title: "Nota",
    //     },
    //   ],
    // },
    // {
    //   icon: "FileBarChart2",
    //   title: "Giro",
    //   subMenu: [
    //     {
    //       icon: "ChevronRight",
    //       pathname: "/penjualan",
    //       title: "Penjualan",
    //     },
    //   ],
    // },
    {
      icon: "Files",
      title: "Penjualan",
      pathname: "/penjualan",
    },
    {
      icon: "Layers",
      title: "Stok Barang",
      pathname: "/stok",
    },
    {
      icon: "Users",
      title: "Pengguna",
      pathname: "/pengguna",
    },
    {
      icon: "Building2",
      title: "Toko",
      pathname: "/toko",
    },
    ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;

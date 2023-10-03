import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { icons } from "../../base-components/Lucide";

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
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: '/',
    },
    {
      icon: "Building",
      title: "Tagihan PT",
      subMenu: [
        {
          icon: "ChevronsRight",
          pathname: "/pt",
          title: "PT",
        },
        {
          icon: "ChevronsRight",
          pathname: "/project",
          title: "Project",
        },
        {
          icon: "ChevronsRight",
          pathname: "/po",
          title: "PO",
        },
        {
          icon: "ChevronsRight",
          pathname: "/pembayaran",
          title: "Pembayaran",
        },
      ],
    },
    {
      icon: "Layers",
      title: "Stok Barang",
      pathname: "/stok",
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

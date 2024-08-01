import _ from "lodash";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import { Link } from "react-router-dom";

function Main() {

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Transaksi Penjualan</h2>
      <div className="flex justify-center max-h-screen py-10 items-center shadow-md rounded-md bg-slate-50 mt-10 intro-y">
            <div className="flex flex-col gap-10 items-center">
                <Lucide icon="ShoppingCart" className="w-20 h-20 text-slate-300" />
                <Link to={'/penjualan/transaksi/form'}>
                    <Button variant="primary" className="w-32 mb-2 mr-2">
                        <Lucide icon="Plus" className="w-4 h-4 mr-2" />{" "}
                        Tambah
                    </Button>
                </Link>
            <div className="mt-5 intro-y box w-full lg:w-1/2">
        </div>
        </div>
      </div>
    </>
  );
}

export default Main;

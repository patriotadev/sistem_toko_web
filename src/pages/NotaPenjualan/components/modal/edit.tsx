import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import Select, { MultiValue } from 'react-select';
import { SelectUserInfo } from "../../../../stores/common/userInfoSlice";
import { useAppSelector } from "../../../../stores/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dialog, Disclosure } from "../../../../base-components/Headless";
import { FormInput, FormLabel, FormSelect } from "../../../../base-components/Form";
import { thousandLimiter } from "../../../../helpers/helper";
import Button from "../../../../base-components/Button";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import moment from "moment";
import PenjualanModule from '../../../../modules/penjualan/penjualan';
import InvoicePenjualanModule from '../../../../modules/invoice-penjualan/invoice-penjualan';
import NotaPenjualanModule from '../../../../modules/nota-penjualan/nota-penjualan';
import { IPenjualan, PenjualanPayload } from "../../../../modules/penjualan/interfaces/penjualan.interface";
import { InvoicePenjualanOptionType, PenjualanInputs, PenjualanOptionType } from "../../types/penjualan.type";
import toast from "react-hot-toast";
import { ISuratJalanPenjualan } from "../../../../modules/penjualan/interfaces/surat-jalan-penjualan.interface";
import { IInvoicePenjualan } from "../../../../modules/invoice-penjualan/interfaces/invoice-penjualan.interface";
import { INotaPenjualan } from "../../../../modules/nota-penjualan/interfaces/nota-penjualan.interface";

type EditModalProps = {
    handleReloadData: () => void,
    initialValues: INotaPenjualan
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
    invoicePenjualanList: IInvoicePenjualan[]
}

const EditModal = ({
    handleReloadData,
    initialValues,
    isModalOpen,
    setIsModalOpen,
    invoicePenjualanList,
  }: EditModalProps) => {
    const userInfo = useAppSelector(SelectUserInfo);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
    const [invoicePenjualanOptionsList, setInvoicePenjualanOptionsList] = useState<InvoicePenjualanOptionType[]>([]);
    const [selectedInvoicePenjualan, setSelectedInvoicePenjualan] = useState<MultiValue<InvoicePenjualanOptionType>>([]);
    const { register, handleSubmit, watch, setValue, getValues, reset, formState: {errors} } = useForm<any>({
      defaultValues: {
        id: initialValues.id,
        nomor: initialValues.nomor,
      }
    });
    const onSubmit: SubmitHandler<any> = (data, event) => {
      let invoicePenjualanListPayload: any = [];
      console.log(selectedInvoicePenjualan);
      selectedInvoicePenjualan?.forEach((item) => {
        invoicePenjualanListPayload.push({
          notaPenjualanId: data.id,
          invoicePenjualanId: item?.value
        });
      });
      setIsSubmitLoading(true);
      data.updatedBy = userInfo.name;
      const payload =  {
          id: data.id,
          tokoId: userInfo.tokoId,
          nomor: data.nomor,
          invoicePenjualanListPayload,
          tanggal: new Date(),
          upadtedBy: data.updatedBy
      }
      NotaPenjualanModule.update(payload)
      .then(res => res.json())
      .then(result => {
        setIsModalOpen(false);
        reset();
        if (result.code === 200) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        handleReloadData();
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setIsSubmitLoading(false));
    }
    
    useEffect(() => {
      if (isModalOpen) {
        const temp: InvoicePenjualanOptionType[] = [];
        const invoicePenjualanTemp: InvoicePenjualanOptionType[] = [];
        invoicePenjualanList.forEach((item) => {
          temp.push({
            label: item.nomor,
            value: item.id,
            detail: item
          });

          if (initialValues.NotaPenjualanList.some((el) => el.invoicePenjualanId === item.id )) {
            invoicePenjualanTemp.push({
              label: item.nomor,
              value: item.id,
              detail: item,
            });
          }
        });
        setSelectedInvoicePenjualan(invoicePenjualanTemp);
        setInvoicePenjualanOptionsList(temp);
      }
    }, [isModalOpen]);

      return (
        <Dialog size="lg" open={isModalOpen} onClose={() => {}}>
        <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Panel className="p-2">
      <Dialog.Title>
          <div className="flex justify-between flex-wrap w-full">
            <h2 className="mr-auto text-base font-medium">
              Edit Nota
            </h2>
          </div>
      </Dialog.Title>
      <Dialog.Description>
        <div className="flex flex-col gap-4 flex-wrap">
          <div className="w-full">
              <FormLabel htmlFor="regular-form-1">Pilih Penjualan</FormLabel>
              <Select
                value={selectedInvoicePenjualan}
                isMulti
                isSearchable
                isClearable
                onChange={(e) => setSelectedInvoicePenjualan(e)}
                options={invoicePenjualanOptionsList}
              />
          </div>
        </div>
      </Dialog.Description>
        <Dialog.Footer>
          <Button type="button" variant="secondary" onClick={()=> setIsModalOpen(false)}
          className="w-20 mr-2"
          >
            Batal
          </Button>
          <Button variant="primary" type="submit" className="w-20">
              Simpan
              {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
          </Button> 
        </Dialog.Footer>
      </Dialog.Panel>
      </form>
    </Dialog>
      );
  }

export default EditModal;
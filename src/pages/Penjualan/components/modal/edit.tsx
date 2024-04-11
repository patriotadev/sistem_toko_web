import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
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
import { IPenjualan, PenjualanPayload } from "../../../../modules/penjualan/interfaces/penjualan.interface";
import { PenjualanInputs } from "../../types/penjualan.type";
import toast from "react-hot-toast";

type EditModalProps = {
    handleReloadData: () => void,
    initialValues: IPenjualan
    isModalOpen: boolean
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const EditModal = ({
    handleReloadData,
    initialValues,
    isModalOpen,
    setIsModalOpen,
  }: EditModalProps) => {
      const userInfo = useAppSelector(SelectUserInfo);
      const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
      const lastStepMaster = initialValues.BarangPenjualan.filter((e) => e.isMaster === true).reverse()[0];
      const { register, handleSubmit, watch, setValue, getValues, reset, formState: {errors} } = useForm<PenjualanInputs>({
        defaultValues: {
          id: initialValues.id,
          namaPelanggan: initialValues.namaPelanggan,
          kontakPelanggan: initialValues.kontakPelanggan,
          alamatPelanggan: initialValues.alamatPelanggan,
          createdBy: initialValues.createdBy,
          createdAt: initialValues.createdAt,
          BarangPenjualan: initialValues.BarangPenjualan.filter(e => e.step === lastStepMaster.step),
          tokoId: initialValues.tokoId
        }
      });
      const onSubmit: SubmitHandler<PenjualanInputs> = (data, event) => {
          setIsSubmitLoading(true);
          data.updatedBy = userInfo.name;
          const payload: PenjualanPayload = {
              detail: {
                id: data.id as string,
                namaPelanggan: data.namaPelanggan,
                kontakPelanggan: data.kontakPelanggan,
                alamatPelanggan: data.alamatPelanggan,
                createdBy: data.createdBy,
                createdAt: data.createdAt,
                updatedBy: data.updatedBy,
                tokoId: data.tokoId
              },
              barang: data.BarangPenjualan
          }
          console.log(payload);
          PenjualanModule.update(payload)
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

      watch('BarangPenjualan');

      return (
          <Dialog size="lg" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                          Form Edit Penjualan
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                          <div className="flex flex-col gap-4 flex-wrap">
                              <div className="w-full">
                                  <FormLabel htmlFor="regular-form-1">Nama Pelanggan</FormLabel>
                                  <FormInput {...register('namaPelanggan', {required: 'Nama pelanggan tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                              </div>
                              <div className="w-full">
                                  <FormLabel htmlFor="regular-form-1">Kontak</FormLabel>
                                  <FormInput {...register('kontakPelanggan', {required: 'Kontak pelanggan tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                              </div>
                              <div className="w-full">
                                  <FormLabel htmlFor="regular-form-1">Alamat</FormLabel>
                                  <FormInput {...register('alamatPelanggan', {required: 'Alamat pelanggan tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                              </div>
                          </div>
                          <Disclosure.Group variant="boxed" className="mt-6">
                        <div>
                    {getValues('BarangPenjualan').map((item, i) => (
                      <Disclosure id={i}>
                      <Disclosure.Button>
                        Barang {i+1}
                      </Disclosure.Button>
                      <Disclosure.Panel>
                        <div className="flex flex-col gap-2 flex-wrap">
                          <div className="w-full">
                              <FormLabel>Nama</FormLabel>
                              <FormInput {...register(`BarangPenjualan.${i}.nama`, {required: 'Nama barang tidak boleh kosong'})} value={item.nama} type="text" placeholder="Nama Barang" />
                          </div>
                          <div className="w-full">
                              <FormLabel>Qty</FormLabel>
                              <FormInput {...register(`BarangPenjualan.${i}.qty`, {required: 'Jumlah barang tidak boleh kosong'})} value={item.qty} min='1' type="number" placeholder="0" />
                          </div>
                          <div className="w-full">
                              <FormLabel>Satuan</FormLabel>
                              <FormInput {...register(`BarangPenjualan.${i}.satuan`, {required: 'Satuan barang tidak boleh kosong'})} value={item.satuan} type="text" placeholder="Ex: Pcs, Kg, Liter" />
                          </div>
                          <div className="w-full">
                              <FormLabel>Harga</FormLabel>
                              <FormInput {...register(`BarangPenjualan.${i}.harga`, {required: 'Harga barang tidak boleh kosong'})} value={item.harga} min='0' type="number" placeholder="Rp. 0" />
                          </div>
                          <div className="w-full">
                              <FormLabel>Diskon</FormLabel>
                              <FormInput {...register(`BarangPenjualan.${i}.discount`)} value={item.discount} min='0' type="number" placeholder="Rp. 0" />
                          </div>
                          <div className="w-full flex flex-col items-end mt-6">
                              <FormLabel className="font-semibold">Total Harga</FormLabel>
                              {item.discount && item.discount !== 0 ?
                                <span className="text-danger text-xs mb-4">
                                  - Discount ({thousandLimiter(Number(item.discount), 'Rp')})
                                </span>
                                : ''
                              }
                              {
                                item.qty !== 0 && Number(item.harga) !== 0 ?
                                <span>
                                  {thousandLimiter(Number(Number(item.qty) * Number(item.harga) - Number(item.discount)), 'Rp')}
                                </span>
                                : '0'
                              }
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </Disclosure>
                    ))}
                    <div className="flex justify-start mt-4">
                    </div>
                  </div>
              </Disclosure.Group>
                  </Dialog.Description>
                  <Dialog.Footer>
                      <Button type="button" variant="secondary" onClick={()=> {
                          setIsModalOpen(false);
                      }}
                      className="w-20 mr-1"
                      >
                          Batal
                      </Button>
                      <Button disabled={isSubmitLoading} variant="primary" type="submit" className="w-22">
                          {isSubmitLoading ? 'Loading' : 'Simpan'}
                          {isSubmitLoading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                      </Button>
                  </Dialog.Footer>
                  </form>
              </Dialog.Panel>
          </Dialog>
      );
  }

export default EditModal;
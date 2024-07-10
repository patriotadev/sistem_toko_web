import { Dispatch, SetStateAction, useState } from "react";
import { SelectUserInfo } from "../../../../stores/common/userInfoSlice";
import { useAppSelector } from "../../../../stores/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dialog, Disclosure } from "../../../../base-components/Headless";
import { FormInput, FormLabel } from "../../../../base-components/Form";
import Button from "../../../../base-components/Button";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import { IPaymentAccount } from "../../../../modules/payment-account/interfaces/payment-account.interface";
import PaymentAccountModule from "../../../../modules/payment-account/payment-account";

type EditModalProps = {
    handleReloadData: () => void,
    initialValues: IPaymentAccount
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
      const { register, handleSubmit, watch, setValue, getValues, reset, formState: {errors} } = useForm<IPaymentAccount>({
        defaultValues: {
          id: initialValues.id,
          bankName: initialValues.bankName,
          accountNumber: initialValues.accountNumber,
          accountName: initialValues.accountName,
        }
      });
      const onSubmit: SubmitHandler<IPaymentAccount> = (data, event) => {
          setIsSubmitLoading(true);
          const payload: IPaymentAccount = {
                id: data.id as string,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                accountName: data.accountName,
          }
          console.log(payload);
          PaymentAccountModule.update(payload)
          .then((res: AxiosResponse) => {
            const result = res.data;
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

      return (
          <Dialog size="lg" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <Dialog.Title>
                      <h2 className="mr-auto text-base font-medium">
                          Edit Payment Account
                      </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                          <div className="flex flex-col gap-4 flex-wrap">
                              <div className="w-full">
                                  <FormLabel htmlFor="regular-form-1">Nama Bank</FormLabel>
                                  <FormInput {...register('bankName', {required: 'Nama bank tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                              </div>
                              <div className="w-full">
                                  <FormLabel htmlFor="regular-form-1">No. Rekening</FormLabel>
                                  <FormInput {...register('accountNumber', {required: 'No. rekening tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                              </div>
                              <div className="w-full">
                                  <FormLabel htmlFor="regular-form-1">Nama</FormLabel>
                                  <FormInput {...register('accountName', {required: 'Nama tidak boleh kosong'})} id="regular-form-1" type="text" placeholder="" />
                              </div>
                          </div>
                          <Disclosure.Group variant="boxed" className="mt-6">
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
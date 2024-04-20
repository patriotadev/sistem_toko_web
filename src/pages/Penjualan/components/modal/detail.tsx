import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { IPenjualan, PenjualanPayload } from '../../../../modules/penjualan/interfaces/penjualan.interface';
import fakerData from "../../../../utils/faker";
import { Dialog, Disclosure } from '../../../../base-components/Headless';
import Lucide from '../../../../base-components/Lucide';
import moment from 'moment';
import { thousandLimiter } from '../../../../helpers/helper';
import { FormLabel } from '../../../../base-components/Form';
import Tippy from '../../../../base-components/Tippy';
import Button from '../../../../base-components/Button';

type DetailModalProps = {
    initialValues: IPenjualan,
    handleReloadData: () => void
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const DetailModal = ({initialValues, isModalOpen, setIsModalOpen, handleReloadData}: DetailModalProps) => {
    console.log(initialValues);
    const lastStepMaster = initialValues.BarangPenjualan.filter((e) => e.isMaster === true).reverse()[0];
  
    return (
      <div>
        <Dialog size="lg" open={isModalOpen} onClose={()=> {
              setIsModalOpen(false);
              }}
              >
              <Dialog.Panel className="p-2">
                  <Dialog.Title>
                    <h2 className="mr-auto text-base flex gap-2 items-center">
                      <Lucide icon="FileText" className="w-6 h-6"/>
                      Detail Penjualan
                    </h2>
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className="w-full">
                      <div className="grid grid-cols-3 gap-4 auto-cols-max p-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Nama Pelanggan</label>
                          <span>{initialValues.namaPelanggan}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Alamat</label>
                          <span>{initialValues.alamatPelanggan}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Kontak</label>
                          <span>{initialValues.kontakPelanggan}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Dibuat Oleh</label>
                          <span>{initialValues.createdBy}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Tanggal</label>
                          <span>{moment(initialValues.createdAt).format('DD MMMM YYYY')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="my-4">
                      <hr/>
                    </div>
                    <Disclosure.Group variant="boxed" className="mt-6">
                    <div>
                      {initialValues.BarangPenjualan.filter(e => e.step === lastStepMaster.step).map((item, i) => (
                        <Disclosure id={i}>
                        <Disclosure.Button>
                          Barang {i+1}
                        </Disclosure.Button>
                        <Disclosure.Panel>
                          <div className="grid grid-cols-3 gap-4 auto-cols-max">
                            <div className="w-full flex flex-col gap-1">
                                <label className="font-semibold">Nama</label>
                                <span>{item.nama}</span>
                                {/* <FormInput value={item.nama} disabled type="text" placeholder="Nama Barang" /> */}
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label className="font-semibold">Qty</label>
                                <span>{item.qty}</span>
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label className="font-semibold">Satuan</label>
                                <span>{item.satuan}</span>
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label className="font-semibold">Harga</label>
                                <span>{thousandLimiter(item.harga, 'Rp')}</span>
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <label className="font-semibold">Diskon</label>
                                <span>{thousandLimiter(Number(item.discount), 'Rp')}</span>
                            </div>  
                            <div className="w-full flex flex-col items-end mt-6">
                                <FormLabel className="font-semibold">Total Harga</FormLabel>
                                  <span className="text-danger text-xs mb-4">
                                    - Discount ({thousandLimiter(Number(item.discount), 'Rp')})
                              </span>
                                  <span>
                                    {thousandLimiter(Number(Number(item.qty) * Number(item.harga) - Number(item.discount)), 'Rp')}
                                  </span>
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
                        Tutup
                      </Button>
                  </Dialog.Footer>
              </Dialog.Panel>
          </Dialog>
      </div>
    );
  }


  export default DetailModal;
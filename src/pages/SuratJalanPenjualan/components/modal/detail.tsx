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
import { ISuratJalanPenjualan } from '../../../../modules/penjualan/interfaces/surat-jalan-penjualan.interface';

type DetailModalProps = {
    initialValues: ISuratJalanPenjualan,
    handleReloadData: () => void
    isModalOpen: boolean,
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const DetailModal = ({initialValues, isModalOpen, setIsModalOpen, handleReloadData}: DetailModalProps) => {
    console.log(initialValues);
    const lastStepMaster = initialValues.BarangSuratJalanPenjualan.filter((e) => e.isMaster === true).reverse()[0];
  
    // const handleChangeStatus = (value: string | undefined) => {
    //   const payload: PenjualanPayload &  = {
    //     detail: {
    //       id: initialValues.id,
    //       status: value ? value : initialValues.status
    //     } as IPo,
    //     // barangPo: initialValues.BarangPo
    // }
    //   PoModule.updateStatus(payload)
    //   .then(res => res.json())
    //   .then(result => {
    //     if (result.code === 201) {
    //       toast.success(result.message);
    //     } else {
    //       toast.error(result.message);
    //     }
    //     handleReloadStok();
    //   })
    // }
  
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
                    {/* <Select
                      value={selectedStatus}
                      options={statusPoOptions}
                      onChange={(e) => handleChangeStatus(e?.value)}
                    /> */}
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className="w-full">
                      <div className="grid grid-cols-3 gap-4 auto-cols-max p-4">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Nama Supir</label>
                          <span>{initialValues.namaSupir}</span>
                        </div>
                        {/* <div className="flex flex-col gap-1">
                          <label className="font-semibold">Alamat</label>
                          <span>{initialValues.alamatPelanggan}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold">Kontak</label>
                          <span>{initialValues.kontakPelanggan}</span>
                        </div> */}
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
                      {initialValues.BarangSuratJalanPenjualan.filter(e => e?.step === lastStepMaster?.step).map((item, i) => (
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
                          </div>
                        </Disclosure.Panel>
                      </Disclosure>
                      ))}
                      <div className="flex justify-start mt-4">
                      </div>
                    </div>
                  </Disclosure.Group>
                    {/* BEGIN: Recent Activities */}
                    <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                      <div className="flex items-center h-10 intro-x">
                        <h2 className="mr-5 text-lg font-medium truncate">
                          Riwayat Surat Jalan
                        </h2>
                        <a href="" className="ml-auto truncate text-primary">
                          Lihat Selengkapnya
                        </a>
                      </div>
                      <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                        <div className="relative flex items-center mb-3 intro-x">
                          <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                            <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                              <img
                                alt="Midone Tailwind HTML Admin Template"
                                src={fakerData[9].photos[0]}
                              />
                            </div>
                          </div>
                          <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                            <div className="flex items-center">
                              <div className="font-medium">
                                {fakerData[9].users[0].name}
                              </div>
                              <div className="ml-auto text-xs text-slate-500">
                                07:00 PM
                              </div>
                            </div>
                            <div className="mt-1 text-slate-500">
                              Has joined the team
                            </div>
                          </div>
                        </div>
                        <div className="relative flex items-center mb-3 intro-x">
                          <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                            <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                              <img
                                alt="Midone Tailwind HTML Admin Template"
                                src={fakerData[8].photos[0]}
                              />
                            </div>
                          </div>
                          <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                            <div className="flex items-center">
                              <div className="font-medium">
                                {fakerData[8].users[0].name}
                              </div>
                              <div className="ml-auto text-xs text-slate-500">
                                07:00 PM
                              </div>
                            </div>
                            <div className="text-slate-500">
                              <div className="mt-1">Added 3 new photos</div>
                              <div className="flex mt-2">
                                <Tippy
                                  as="div"
                                  className="w-8 h-8 mr-1 image-fit zoom-in"
                                  content={fakerData[0].products[0].name}
                                >
                                  <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="border border-white rounded-md"
                                    src={fakerData[8].images[0]}
                                  />
                                </Tippy>
                                <Tippy
                                  as="div"
                                  className="w-8 h-8 mr-1 image-fit zoom-in"
                                  content={fakerData[1].products[0].name}
                                >
                                  <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="border border-white rounded-md"
                                    src={fakerData[8].images[1]}
                                  />
                                </Tippy>
                                <Tippy
                                  as="div"
                                  className="w-8 h-8 mr-1 image-fit zoom-in"
                                  content={fakerData[2].products[0].name}
                                >
                                  <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="border border-white rounded-md"
                                    src={fakerData[8].images[2]}
                                  />
                                </Tippy>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="my-4 text-xs text-center intro-x text-slate-500">
                          12 November
                        </div>
                        <div className="relative flex items-center mb-3 intro-x">
                          <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                            <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                              <img
                                alt="Midone Tailwind HTML Admin Template"
                                src={fakerData[7].photos[0]}
                              />
                            </div>
                          </div>
                          <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                            <div className="flex items-center">
                              <div className="font-medium">
                                {fakerData[7].users[0].name}
                              </div>
                              <div className="ml-auto text-xs text-slate-500">
                                07:00 PM
                              </div>
                            </div>
                            <div className="mt-1 text-slate-500">
                              Has changed{" "}
                              <a className="text-primary" href="">
                                {fakerData[7].products[0].name}
                              </a>{" "}
                              price and description
                            </div>
                          </div>
                        </div>
                        <div className="relative flex items-center mb-3 intro-x">
                          <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                            <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                              <img
                                alt="Midone Tailwind HTML Admin Template"
                                src={fakerData[6].photos[0]}
                              />
                            </div>
                          </div>
                          <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                            <div className="flex items-center">
                              <div className="font-medium">
                                {fakerData[6].users[0].name}
                              </div>
                              <div className="ml-auto text-xs text-slate-500">
                                07:00 PM
                              </div>
                            </div>
                            <div className="mt-1 text-slate-500">
                              Has changed{" "}
                              <a className="text-primary" href="">
                                {fakerData[6].products[0].name}
                              </a>{" "}
                              description
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* END: Recent Activities */}
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
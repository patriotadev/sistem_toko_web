import React, { useState } from 'react'
import { Step, Stepper } from 'react-form-stepper'
import DataPembeli from './components/step/data-pembeli';
import ListBarang from './components/step/list-barang';

const FormTransaksi = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});

  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
  }

  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  }

  const steps = [
    { label: 'Data Pembeli' },
    { label: 'List Barang' },
    { label: 'Pembayaran' },
    { label: 'Surat Jalan' },
    { label: 'Simpan' },
  ];

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Transaksi Penjualan</h2>
      <div className='bg-slate-50 rounded-md p-2 shadow mt-10'>
        <Stepper activeStep={activeStep}>
          { steps.map((item, index) => <Step onClick={() => setActiveStep(index)} label={item?.label} />) }
        </Stepper>
        { activeStep === 0 && <DataPembeli handleNextStep={handleNextStep} /> }
        { activeStep === 1 && <ListBarang handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} /> }
      </div>
    </>
  )
}

export default FormTransaksi
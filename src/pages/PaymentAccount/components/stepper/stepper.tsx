import React, { useState } from 'react'
import Button from '../../../../base-components/Button'

type StepListType = {
    label: string,
    value: number
}

type StepperItemType = {
    label: string,
    value: number,
    step: number
}

enum STEP_TIMELINE  {
    Detail = 'Detail',
    Barang = 'Barang',
    Pembayaran = 'Pembayaran',
    Preview = 'Preview',
}

const StepperItem = (dt: StepperItemType) => {
    const {value, label, step} = dt;
    return (
        <>
        {
            step === value ? (
            <div className="z-10 flex items-center flex-1 mt-5 intro-x lg:text-center lg:mt-0 lg:block">
                <Button variant="primary" className="w-8 h-8 rounded-full">
                    {value}
                </Button>
                <div className="ml-3 text-base font-medium lg:w-32 lg:mt-3 lg:mx-auto">
                    {label}
                </div>
            </div>
            ) : (
            <div className="z-10 flex items-center flex-1 intro-x lg:text-center lg:block">
                <Button className="w-8 h-8 rounded-full  text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
                    {value}
                </Button>
                <div className="ml-3 text-base lg:w-32 lg:mt-3 lg:mx-auto  text-slate-600 dark:text-slate-400">
                    {label}
                </div>
            </div>
            )
        }
        </>
    )
}

const Stepper = ({step}: {step: number}) => {

  const [stepList, setStepList] = useState<StepListType[]>([
    { label: STEP_TIMELINE.Detail, value: 1 },
    { label: STEP_TIMELINE.Barang, value: 2 },
    { label: STEP_TIMELINE.Pembayaran, value: 3 },
    { label: STEP_TIMELINE.Preview, value: 4 },
  ]);

  return (
    <div className="relative mb-8 before:hidden before:lg:block before:absolute before:w-[92%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 sm:px-20">
        
        {
            stepList.map((item, index) => (
                <StepperItem
                    step={step}
                    value={item.value}
                    label={item.label}
                />
            ))
        }
    </div>
  )
}

export default Stepper
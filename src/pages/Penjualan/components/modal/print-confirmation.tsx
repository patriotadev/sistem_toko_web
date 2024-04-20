import React, { useEffect, useRef } from 'react'
import Button from '../../../../base-components/Button';
import Notification, { NotificationElement } from '../../../../base-components/Notification';
import Lucide from '../../../../base-components/Lucide';
import { useReactToPrint } from 'react-to-print';
import { IPenjualan } from '../../../../modules/penjualan/interfaces/penjualan.interface';
import PenjualanPrint from './print';
import { initial } from 'lodash';

const PrintConfirmation = ({initialValues, type}: {
    initialValues: IPenjualan
    type: string
}) => {
  const printRef = useRef<any>(null);
  const handlePrint = useReactToPrint({
        documentTitle: `Invoice - ${initialValues.nomor}`,
        content: () => printRef.current,
  });
  const notificationWithButtonsBelow = useRef<NotificationElement>();
  useEffect(() => {
      const confirmation = confirm('Apakah anda ingin mencetak invoice penjualan?');
      if (confirmation) {
        handlePrint();
      }
  }, [initialValues]);

  return (
    <div className="text-center">
    <div className="hidden">
      <PenjualanPrint ref={printRef} initialValues={initialValues} type={type} />
    </div>
    {/* BEGIN: Notification Content */}
    <Notification getRef={(el)=> {
        notificationWithButtonsBelow.current = el;
        }}
        options={{
            close: true,
        }}
        className="flex"
        >
        <Lucide icon="FileText" />
        <div className="ml-4 mr-5 sm:mr-20">
            <div className="font-medium">
                Apakah anda ingin mencetak invoice penjualan?
            </div>
            <div className="mt-1 text-slate-500">
                "Print" untuk mencetak invoice penjualan.
            </div>
            <div className="mt-2.5">
            <Button variant="primary" type='button' className="px-2 py-1 mr-2" >
              Print
            </Button>
            </div>
        </div>
    </Notification>
</div>
  )
}

export default PrintConfirmation
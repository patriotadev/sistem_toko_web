import React, { forwardRef } from 'react';
import moment from 'moment';
import { IInvoicePo } from '../../modules/invoice-po/interfaces/invoice-po.interface';
import { thousandLimiter } from '../../helpers/helper';
import { ITandaTerimaNota } from '../../modules/tanda-terima-nota/interfaces/tanda-terima-nota.interface';
import { useAppSelector } from '../../stores/hooks';
import { SelectUserInfo } from '../../stores/common/userInfoSlice';

type PropsType = {
  initialValues: ITandaTerimaNota
}

const TandaTerimaNotaPrint = forwardRef((props: PropsType, ref: any) => {
  const userInfo = useAppSelector(SelectUserInfo);

  return (
    <div ref={ref} style={{fontSize: '0.7rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
        <div style={{display: 'flex', gap: '25px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '200px'}}>
            <span>{props?.initialValues?.Pt?.nama}</span>
            <span>{props?.initialValues?.Pt?.alamat}</span>
            <span>PROJECT : {props?.initialValues?.Project?.nama}</span>
            <span style={{marginTop: '30px'}}>KETERANGAN :</span>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center', position: 'absolute', top: '20', left: '0', right: '0'}}>
          <span style={{textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'underline'}}>TANDA TERIMA NOTA</span>
          <span style={{textAlign: 'center', fontSize: '1.1rem'}}>{props.initialValues.nomor}</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '200px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <span>{userInfo.tokoCity}, {`${moment(props.initialValues.createdAt).format('DD-MM-YYYY')}`}</span>
            <div style={{display: 'flex', flexDirection:'column'}}>
              <span>{userInfo.tokoName}</span>
              <span>{userInfo.tokoAddress}</span>
              <span>{userInfo.tokoContact}</span>
            </div>
          </div>
          <div style={{display: 'flex', gap:'20px'}}>
            {/* <span>Jatuh Tempo : 25-11-2023</span>
            <span>Term: 10 Hari</span> */}
            {/* <span>Hal. 1/1</span> */}
            <span>SALESMAN : {props.initialValues.createdBy}</span>
          </div>
        </div>
      </div>
      <div style={{marginTop: '25px'}}>
        <table>
          <thead style={{borderTop: 'solid 1px black', borderBottom: 'solid 1px black', width: '100%'}}>
            <th style={{textAlign: 'start', padding: '5px 0px'}}>
              <td style={{width: '10vw'}}>
                No.
              </td>
            </th>
            <th style={{textAlign: 'start'}}>
              <td style={{width: '25vw'}}>
                NO. INVOICE
              </td>
            </th>
            <th style={{textAlign: 'start'}}>
              <td style={{width: '25vw'}}>
                JUMLAH
              </td>
            </th>
          </thead>
          <tbody>
            {
              props.initialValues.Invoice.map((item: any, index: number) => 
              <tr>
              <td style={{width: '20vw'}}>
                {index + 1}.
              </td>
              <td style={{width: '40vw'}}>
                {item?.InvoicePo?.nomor}
              </td>
              <td style={{width: '40vw'}}>
                {item.totalJumlah ? thousandLimiter(item.totalJumlah, 'Rp') : 0}
              </td>
            </tr>)
            }
          </tbody>
        </table>
      </div>
      <div>
        <div style={{display: 'flex', bottom: '0px', height: '30vh', borderTop: 'solid 1px black', paddingTop: '30px'}}>
          <div style={{display: 'flex', flexDirection: 'column', width: '70vw'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{marginBottom: '8px', marginTop: '12'}}>
                NO. REKENING :
              </span>
              {
                userInfo.paymentAccount.map((item: any) => 
                <span style={{marginBottom: '4px'}}>
                  {`${item.bankName} : ${item.accountNumber} A/N ${item.accountName}`}
                </span>)
              }
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column' }}>
            <div style={{width: '24vw', textAlign: 'start', alignSelf: 'end'}}>
              <span>TOTAL : {thousandLimiter(props?.initialValues?.totalJumlahInvoice, 'Rp')}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '40vw', paddingTop: '80px'}}>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
                  <span>ADMIN SALES</span>
                </div>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
                  <span>PENERIMA</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TandaTerimaNotaPrint;
import React, { forwardRef } from 'react';
import moment from 'moment';
import { IInvoicePo } from '../../modules/invoice-po/interfaces/invoice-po.interface';
import { thousandLimiter } from '../../helpers/helper';
import { useAppSelector } from '../../stores/hooks';
import { SelectUserInfo } from '../../stores/common/userInfoSlice';
import WrittenNumber from 'written-number';

type PropsType = {
  initialValues: IInvoicePo
}

const InvoicePoPrint = forwardRef((props: PropsType, ref: any) => {
  const userInfo = useAppSelector(SelectUserInfo);

  return (
    <div ref={ref} style={{fontSize: '0.7rem', lineHeight: '1.2'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '200px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0px'}}>
            <span>{userInfo.tokoCity}, {`${moment(props.initialValues.createdAt).format('DD-MM-YYYY')}`}</span>
            <div style={{display: 'flex', flexDirection:'column'}}>
              <span>{userInfo.tokoName}</span>
              <span>{userInfo.tokoAddress}</span>
              <span>{userInfo.tokoContact}</span>
            </div>
        </div>
        <div style={{display: 'flex', gap:'0px'}}>
            {/* <span>Jatuh Tempo : 25-11-2023</span>
            <span>Term: 10 Hari</span> */}
            {/* <span>Hal. 1/1</span> */}
            {/* <span>SALESMAN : {props.initialValues.createdBy}</span> */}
        </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0px', justifyContent: 'center', position: 'absolute', top: '20', left: '0', right: '0'}}>
          <span style={{textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold'}}>INVOICE</span>
          <span style={{textAlign: 'center', fontSize: '0.8rem'}}>{props.initialValues.nomor}</span>
        </div>
        <div style={{display: 'flex', gap: '0px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0px', width: '200px'}}>
            <span style={{ fontWeight: 'bolder' }}>{props?.initialValues?.Pt?.nama}</span>
            <span style={{ fontWeight: 'bolder' }}>{props?.initialValues?.Po?.noPo[0] !== '[' ? `NO. PO : ${props?.initialValues?.Po?.noPo}` : ''}</span>
            <span style={{ fontWeight: 'bolder' }}>NO. SJ : {props?.initialValues?.SuratJalanPo?.nomor}</span>
            <span style={{paddingBottom: '5px'}}>KETERANGAN :</span>
          </div>
        </div>
      </div>
      <div style={{marginTop: '5px'}}>
        <table>
          <thead style={{borderTop: 'solid 1px black', borderBottom: 'solid 1px black', width: '100%'}}>
            <th style={{textAlign: 'start', padding: '0px 0px'}}>
              <td style={{width: '5vw'}}>
                No.
              </td>
            </th>
            <th style={{textAlign: 'start'}}>
              <td style={{width: '45vw'}}>
                NAMA BARANG
              </td>
            </th>
            <th style={{textAlign: 'start'}}>
              <td style={{width: '25vw'}}>
                QTY
              </td>
            </th>
            <th style={{textAlign: 'start'}}>
              <td style={{width: '25vw'}}>
                SATUAN
              </td>
            </th>
            <th style={{textAlign: 'start'}}>
              <td style={{width: '25vw'}}>
                HARGA
              </td>
            </th>
            <th style={{textAlign: 'end'}}>
              <td style={{width: '25vw'}}>
                JUMLAH
              </td>
            </th>
          </thead>
          <tbody>
            {
              props.initialValues.BarangSj.map((item, index) => 
              <tr>
              <td style={{width: '5vw'}}>
                {index + 1}.
              </td>
              <td style={{width: '45vw'}}>
                {item.nama}
              </td>
              <td style={{width: '25vw'}}>
                {item.qty}
              </td>
              <td style={{width: '25vw'}}>
                {item.satuan}
              </td>
              <td style={{width: '25vw'}}>
                {
                  item.harga ? thousandLimiter(item.harga, 'Rp') : 0
                }
              </td>
              <td style={{width: '35vw', textAlign: 'end'}}>
                {
                  item.harga ? thousandLimiter(item.harga * item.qty - item?.discount, 'Rp') : 0
                }
              </td>
            </tr>)
            }
          </tbody>
        </table>
      </div>
      <div style={{ position: `${props.initialValues.InvoicePoList.length < 16 ? 'absolute' : 'relative'}`, bottom: '0'}}>
        <div style={{display: 'flex', bottom: '0px', height: '30vh', borderTop: 'solid 1px black', paddingTop: '4px', width: '100%'}}>
          <div style={{display: 'flex', flexDirection: 'column', width: '70vw'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span style={{ marginBottom: '4px' }}>TERBILANG : <p style={{ display: 'inline', fontWeight: 'bolder' }}>{`${WrittenNumber(props?.initialValues?.totalJumlah, { lang: 'id' }).toUpperCase()} RUPIAH`}</p></span>
              <span style={{marginBottom: '2px'}}>
                PEMBAYARAN VIA TRANSFER :
              </span>
              {
                userInfo.paymentAccount.map((item: any) => 
                <span>
                  {`${item.bankName} : ${item.accountNumber} A/N ${item.accountName}`}
                </span>)
              }
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'end', marginBottom: '20px'}}>
              <span>TOTAL : <p style={{ fontWeight: 'bolder', display: 'inline'}}>{thousandLimiter(props?.initialValues?.totalJumlah, 'Rp')}</p></span>
            </div>
            <div style={{display: 'flex', justifyContent: 'end', width: '40vw', marginLeft: '-20vw', paddingTop: '20px', gap: '50px'}}>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'end'}}>
                  <span>ADMIN SALES</span>
                </div>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'end'}}>
                  <span>PENERIMA</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default InvoicePoPrint;
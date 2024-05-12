import React, { forwardRef } from 'react';
import { ISuratJalanPo } from '../../modules/surat-jalan-po/interfaces/surat-jalan-po.interface';
import moment from 'moment';
import { useAppSelector } from '../../stores/hooks';
import { SelectUserInfo } from '../../stores/common/userInfoSlice';

type PropsType = {
  initialValues: ISuratJalanPo
}

const SuratJalanPoPrint = forwardRef((props: PropsType, ref: any) => {
  const userInfo = useAppSelector(SelectUserInfo);

  return (
    <div ref={ref} style={{fontSize: '0.7rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
        <div style={{display: 'flex', gap: '25px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <span>{props?.initialValues?.Pt?.nama}</span>
            <span>{props?.initialValues?.Po?.noPo[0] !== '[' ? `NO. PO : ${props?.initialValues?.Po?.noPo}` : ''}</span>
            <span style={{marginTop: '30px'}}>KETERANGAN :</span>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: 'center', position: 'absolute', top: '20', left: '0', right: '0'}}>
          <span style={{textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'underline'}}>SURAT JALAN</span>
          <span style={{textAlign: 'center', fontSize: '1.1rem'}}>{props.initialValues.nomor}</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', width: '200px'}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <span>{userInfo.tokoCity}, {`${moment(props.initialValues.tanggal).format('DD-MM-YYYY')}`}</span>
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
          </thead>
          <tbody>
            {
              props.initialValues.BarangSuratJalanPo.map((item, index) => 
              <tr>
              <td style={{width: '25vw'}}>
                {index + 1}.
              </td>
              <td style={{width: '25vw'}}>
                {item.nama}
              </td>
              <td style={{width: '25vw'}}>
                {item.qty}
              </td>
              <td style={{width: '25vw'}}>
                {item.satuan}
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
              <span>
                NB :
              </span>
              <span>
                - Surat Jalan ini merupakan bukti resmi penerimaan barang.
              </span>
              <span>
                - Surat Jalan ini merupakan lampiran invoice penjualan.
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '70vw', paddingTop: '30px'}}>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
                  <span>ADMIN SALES</span>
                </div>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
                  <span>KEPALA GUDANG</span>
                </div>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
                  <span>SUPIR</span>
                </div>
                <div style={{height: '80px', width: '120px', borderBottom: 'solid 1px black', textAlign: 'center'}}>
                  <span>PENERIMA</span>
                </div>
            </div>
          </div>
          <div style={{width: '24vw', textAlign: 'start'}}>
            {/* <span>TOTAL : 15 PCS</span> */}
          </div>
        </div>
      </div>
    </div>
  );
});

export default SuratJalanPoPrint;
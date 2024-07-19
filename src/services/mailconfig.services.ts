import { EmailCompose } from '@viewModels/generalModel';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { KetsuBoardService } from './ketsuboard.services';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { IKetsuLogCSVFormat } from '@viewModels/viewTableModel';
import * as cron from 'node-cron';
@Injectable()
export class EmailConfig {
  protected readonly email_from = process.env.EMAIL_FROM;
  protected readonly mail_port = +(process.env.EMAIL_PORT ?? 25);
  protected readonly mail_server = process.env.EMAIL_SERVER;

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
      port: this.mail_port,
      host: this.mail_server,
      secure: false,
    });

  public sendMail(edata: EmailCompose): void {
    const data: EmailCompose = {
      ...edata,
      from: this.email_from,
    };
    this.transporter.sendMail(data, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }
}

@Injectable()
export class EmailSender implements OnModuleInit {
  constructor(
    private ketsuService: KetsuBoardService,
    private emailConfig: EmailConfig,
  ) {}
  async onModuleInit(): Promise<void> {
    this.cronScheduler();
  }
  cronScheduler(): void {
    try {
      cron
        .schedule('10 11 * * *', () => {
          this.composeEmail(true).then(() =>
            console.log('日勤・1直 email sent at ' + new Date().toISOString()),
          );
        })
        .start();

      cron
        .schedule('10 23 * * *', () => {
          this.composeEmail(false).then(() =>
            console.log('2直 email sent at ' + new Date().toISOString()),
          );
        })
        .start();
    } catch (e: any) {
      throw new Error(e);
    }
  }
  createTableLogsHTML(logs: IKetsuLogCSVFormat[]): string {
    const tableHeader: string = `
<html>
    <head> 
    <style type="text/css">
      table { 
        white-space: pre-wrap;
        word-break: break-word;
        border: 0px;
        border-spacing: 0px;
        border-top: 2px solid #5a5a5a;
        border-bottom: 2px solid #5a5a5a;
      }
      th {
        color: #273e7f;
        background-color: #dddddd;
        border: none;
        padding: 6px;
        word-wrap: nowrap;
      }
      td {
        border: none;
        padding: 4px; 
        white-space: nowrap;
      } 
    </style> 
    </head>
    <div>
    <p>何時もお世話になります。</br></br>
        ※このメールは『勤怠確認者』への自動配信になります。
    </br></br>
    下記の【安否確認】情報をご確認、ご対応の上、<span style="font-weight: bold;color:red">IRS_位置確認リアルタイムシステム→対応表</span>の確認/記載をお願いします。</br></br>
     URL: <a href="${process.env.EMAIL_WEBLINK_KETSU}"  target="_blank" style="font-weight: bold;color:blue;font-size: 20px;">${process.env.EMAIL_WEBLINK_KETSU}</a></br><br/>
  ※ 確認対応内容は下記から選択ください。</br>
  『外出・出張』『当日有休・特休』『タグ・カード・打刻無し』『時間休・時短・遅刻』『システムエラー』</br></br>
  ※連絡有無は下記から選択ください。
        <ul>
            <li>対象者より連絡があった場合⇒『連絡きた』
            </li>
            <li>連絡が無く上司から確認した場合⇒『確認した』 
            </li>
        </ul>
     ※出張、外出により打刻が出来ない場合はリストに載ってしまいます。</br> 
     <br />
     ※退職や入職、異動により配信リストに修正が必要な場合は『人員管理統一システム』から修正をお願いします。</br></br>
 
     【定義】</br>
     <ul>
        <li>当日出勤予定の人員（日勤or1直or2直）で出勤情報(出勤打刻・入門データ・名札タグデータ)が無い人員を抽出 
        </li>
     </ul>
     ※過去分に関しては<span style="font-weight: bold;color:red">IRS_位置確認リアルタイムシステム→対応履歴にて確認が可能です。</span>
    </p>
  </div>
    <div class="container">
            <table border="1">
            <thead>
                  <tr>
                      <th>アラート区分</th> 
                      <th>勤怠日</th>
                      <th>実工程</th>
                      <th>号棟</th>
                      <th>直</th>
                      <th>GID</th>
                      <th>氏名</th>
                      <th>第1勤怠確認者</th>
                      <th>第2勤怠確認者</th>
                      <th>第3勤怠確認者</th>
                      <th>第4勤怠確認者</th>
                      <th>第5勤怠確認者</th>
                      <th>第6勤怠確認者</th>
                      <th>対応確認者</th>
                      <th>内容</th>
                      <th>連絡有無</th>
                  </tr>
              </thead>
            <tbody>
        `;

    const tableRows: string = logs
      .map(
        (d) => `
           <tr>
                <td>${d.アラート区分}</td>
                <td>${d.日付}</td>
                <td>${d.実工程}</td>
                <td>${d.号棟}</td>
                <td>${d.直}</td>
                <td>${d.GID}</td>
                <td>${d.氏名}</td>
                <td>${d.第1勤怠確認者}</td>
                <td>${d.第2勤怠確認者}</td>
                <td>${d.第3勤怠確認者}</td>
                <td>${d.第4勤怠確認者}</td>
                <td>${d.第5勤怠確認者}</td>
                <td>${d.第6勤怠確認者}</td>
                <td>${d.対応確認者}</td>
                <td>${d.内容}</td>
                <td>${d.連絡有無}</td>
           </tr>
        `,
      )
      .join('');

    const tableFooter = `</tbody></table></div></body></html>`;

    return tableHeader + tableRows + tableFooter;
  }

  async composeEmail(dayShift: boolean): Promise<void> {
    const ketsuLogs: IKetsuLogCSVFormat[] = await this.ketsuService
      .fetchKetsuLogs({
        take: 1000,
        toShow: true,
        skip: null,
      })
      .then((logs) => this.ketsuService.mapKetsuLogsFormat(logs, true));

    if (ketsuLogs.length === 0) return;

    const groupedData = ketsuLogs.reduce((acc, curr) => {
      const groupKey = [
        curr.第1勤怠確認者,
        curr.第2勤怠確認者,
        curr.第3勤怠確認者,
        curr.第4勤怠確認者,
        curr.第5勤怠確認者,
        curr.第6勤怠確認者,
      ].join();
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(curr);
      return acc;
    }, {});

    const groupedLogsPerReceiver: {
      key: string;
      value: IKetsuLogCSVFormat[];
    }[] = Object.entries(groupedData).map(
      ([key, value]: [string, IKetsuLogCSVFormat[]]) => ({
        key,
        value,
      }),
    );

    for (const data of groupedLogsPerReceiver) {
      // const to: string[] = data.value[0].recipient
      //   .split(',')
      //   .filter((x) => x !== 'ー' && x !== '')
      //   .map((y) => y.trim());
      const to: string[] = [
        'itg-kyoyu1@jty.yuden.co.jp',
        'h-iwasaki@jty.yuden.co.jp',
        'y-tokizawa@jty.yuden.co.jp',
      ];
      const cc: string[] = [
        'm-yajima@jty.yuden.co.jp',
        'h-iwasaki@jty.yuden.co.jp',
        'bryan-f@jty.yuden.co.jp',
        'y-tokizawa@jty.yuden.co.jp',
      ];
      const subject: string = `<${
        dayShift ? '日勤' : '夜勤'
      }_自動配信>【C製出勤確認_${data.value[0].区分G}_${
        data.value[0].実工程
      }】`;
      const html: string = this.createTableLogsHTML(data.value);
      const emailData: EmailCompose = { to, subject, html };
      if (to.length > 0) this.emailConfig.sendMail(emailData);
    }
  }
}

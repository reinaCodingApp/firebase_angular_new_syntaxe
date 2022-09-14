import { DefaultClaim } from 'app/common/models/default-claim';
import { Attachment } from '../models/attachment';
import * as moment from 'moment';

export class MainTools {

  public static getObject(claims: string[]): DefaultClaim {
    const result = {
      isTechAdmin: claims.indexOf('techAdmin') > -1,
      isRoot: claims.indexOf('root') > -1,
      isGuest: claims.indexOf('guest') > -1,
      isHrM: claims.indexOf('HrM') > -1,
      isSeM: claims.indexOf('SeM') > -1,
      isAdM: claims.indexOf('AdM') > -1,
      isDir: claims.indexOf('Dir') > -1
    } as DefaultClaim;
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public static getFileSizeToString(size: number) {
    if (size < 8) {
      return size + ' bits';
    } else {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const size_on_octets = Math.round(size * 100 / 8) / 100;
      if (size_on_octets <= 1024) {
        return size_on_octets + ' octets';
      } else if (size_on_octets <= 1048576) {
        return Math.round(size_on_octets * 100 / 1024) / 100 + ' KO';
      } else if (size_on_octets <= Math.pow(1024, 3)) {
        return Math.round(size_on_octets * 100 / 1024 / 1024) / 100 + ' MO';
      }
    }
    return 'file too big GO';
  }

  public static replaceNewLines(str: string): string {
    return str.replace(/\r?\n/g, '<br />');
  }

  public static printFromHtml(contentToPrint: string): void {
    const myPrintContent = document.getElementById(contentToPrint);
    const printWindow = window.open();
    printWindow.document.write('<html><head><title></title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(myPrintContent.innerHTML);
    printWindow.document.getElementById('hidden_div').style.display = 'block';
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  }
  public static downloadAttachment(attachment: Attachment, data: any): void {
    const downloadURL = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = attachment.fileName;
    link.click();
  }

  public static getYears(startDate: Date, stopDate: Date): number[] {
    const dates: number[] = [];
    let currentDate = moment(startDate);
    const endDate = moment(stopDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.year());
      currentDate = currentDate.add(1, 'years');
    }
    return dates;
  }

  public static convertStringtoDateTime(dateString): any {
    if (dateString != null && dateString !== '') {
      const dateParts = dateString.split('/');
      const day = +dateParts[0];
      const month = dateParts[1] - 1;
      const year = +dateParts[2].split(' ')[0];
      const hours = +dateParts[2].split(' ')[1].split(':')[0];
      const minutes = +dateParts[2].split(' ')[1].split(':')[1];
      const dateObject = new Date(year, month, day, hours, minutes);
      return dateObject;
    }
  }

  public static convertStringtoDate(dateString): any {
    if (dateString != null && dateString !== '') {
      const dateParts = dateString.split('/');
      const day = +dateParts[0];
      const month = dateParts[1] - 1;
      const year = +dateParts[2];
      const dateObject = new Date(year, month, day);
      return dateObject;
    }
  }

  public static convertStringToTime(time: string): any {
    if (time != null && time !== '') {
      const hours = +time.split(':')[0];
      const minutes = +time.split(':')[1];
      return moment().hours(hours).minutes(minutes);
    }
  }


}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function resizeImage(file: File, expectedWidth: number, expectedHeight: number, keepAspectRatio: boolean = false): Promise<Blob> {
  return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      image.onload = () => {
          const originWidth = image.width;
          const originHeight = image.height;
          console.log('origin ', originWidth + ' ' + originHeight);
          console.log('expected ', expectedWidth + ' ' + expectedHeight);
          if (originWidth < expectedWidth || originHeight < expectedHeight) {
              const errorMessage = {message: `La photo jointe au produit n'est pas assez grande, la taille minimale requise est : ${expectedWidth} x ${expectedHeight} pixels`};
              reject(errorMessage);
          }
          let newWidth;
          let newHeight;
          if (keepAspectRatio) {
              if (originWidth > originHeight) {
                  newHeight = originHeight * (expectedWidth / originWidth);
                  newWidth = expectedWidth;
              } else {
                  newWidth = originWidth * (expectedHeight / originHeight);
                  newHeight = expectedHeight;
              }
          } else {
              newWidth = expectedWidth;
              newHeight = expectedHeight;
          }
          const canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;

          const context = canvas.getContext('2d');

          context.drawImage(image, 0, 0, newWidth, newHeight);

          canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
  });
}


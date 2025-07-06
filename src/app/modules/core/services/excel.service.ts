import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() { }

  /**
   * Exporta un archivo en formato Excel con encabezados específicos.
   * @param  {any[]} json
   * @param  {string} excelFileName
   * @param  {any[]} headers
   * @returns void
   */
  public exportExcelWhitHeaders(json: any[],
    excelFileName: string,
    headers: any[]): void {
    const encabezados = [headers];
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(encabezados);
    XLSX.utils.sheet_add_json(worksheet, json, {
      skipHeader: true,
      origin: 'A2',
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { Usuario: worksheet },
      SheetNames: ['Usuario'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * Exporta un archivo excel default, headers son los nombres de los atributos del json.
   * @param  {any[]} json
   * @param  {string} excelFileName
   * @param  {string} nameSheet
   * @returns void
   */
  public exportAsExcelFile(json: any[], excelFileName: string, sheetName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    let sheets: any = {};
    sheets[sheetName] = worksheet;
    const workbook: XLSX.WorkBook = {
      Sheets: sheets,
      SheetNames: [sheetName],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * Método que genera el archivo en formato excel para su descarga.
   * @param  {any} buffer
   * @param  {string} fileName
   * @returns void
   */
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  /**
   * Valida un archivo en formato Excel.
   * @param  {any} evt
   * @returns any
   */
  public validarExcel(evt: any): any {

    const validFormats = ['xlsx', 'xls'];
    const target: DataTransfer = evt.target as DataTransfer;

    if (target.files.length !== 1) {
      throw new Error('No se puede cargar multiples archivos.');
    } else if (!validFormats.includes(target.files[0].name.split('.')[1])) {
      throw new Error('formato de archivo invalido.');
    }
  }

  /**
   * Conviente la información de un archivo de excel y la transforma en un objeto
   * Json.
   * @param  {} file
   */
  public convertExcelToJson(file: any) {
    const reader = new FileReader();
    let workbookkk: any;
    let XL_row_object;
    let json_object;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const data = reader.result;
        workbookkk = XLSX.read(data, { type: 'binary' });
        workbookkk.SheetNames.forEach((sheetName: any) => {
          XL_row_object = XLSX.utils.sheet_to_json(workbookkk.Sheets[sheetName], { defval: '' });
          json_object = JSON.stringify(XL_row_object);
          resolve(XL_row_object);
        });
      };
    });
  }

  /**
   * Exporta un archivo excel con hojas personalizados e información adicional.
   * @param  {any[]} jsons
   * @param  {string} excelFileName
   * @param  {string} sheetNames
   * @param  {string[]} headers
   * @param  {any[[]]} additionalInformation
   * @returns void
   */
  public exportAsExcelFilebySheets(jsons: any[],
    excelFileName: string, sheetNames: string[], headers: any[], additionalInformation: any[]): void {
    let workSheets: XLSX.WorkSheet[] = [];
    let i = 0;
    jsons.forEach(json => {
      let encabezados = [headers[i]];
      let additionalInfoTemp = [...additionalInformation];
      additionalInfoTemp.push(encabezados[0] ? encabezados[0] : []);
      let worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(additionalInfoTemp);
      workSheets.push(XLSX.utils.sheet_add_json(worksheet, json, {
        origin: additionalInfoTemp.length,
        skipHeader: true,
      }));
      i++;
    });
    let workbook: XLSX.WorkBook;
    let work: any = {};
    i = 0;
    workSheets.forEach(element => {
      work[sheetNames[i]] = element;
      i++;
    });
    workbook = {
      Sheets: work,
      SheetNames: sheetNames,
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
}

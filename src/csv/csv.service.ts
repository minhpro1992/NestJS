import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import * as csvParser from 'csv-parser';

@Injectable()
export class CsvService {
  async importCsv(filePath: string): Promise<any[]> {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
  async exportCsv(
    data: any[],
    filePath: string,
    header: { id: string; title: string }[],
  ): Promise<void> {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header,
    });

    return new Promise((resolve, reject) => {
      csvWriter
        .writeRecords(data)
        .then(() => resolve())
        .catch((error) => reject(error));
    });
  }
}

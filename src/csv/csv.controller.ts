import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CsvService } from './csv.service';
import { Response } from 'express';
import * as fs from 'fs';
import path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfigService } from './multer-config.service';

@Controller('csv')
export class CsvController {
  constructor(
    private readonly csvService: CsvService,
    private readonly multerConfigService: MulterConfigService,
  ) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File): Promise<any[]> {
    console.log(file);
    const filePath = file.path;
    try {
      const importedData = await this.csvService.importCsv(filePath);
      console.log(filePath, importedData);
      // Process the imported data
      // ...

      return importedData;
    } catch (error) {
      console.log('Error in import csv file: ', error);
    }
  }

  @Get('export-and-download')
  async exportAndDownloadCsv(@Res() res: Response): Promise<void> {
    const data = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];
    const filePath = 'output.csv';
    const header = [
      { id: 'id', title: 'ID' },
      { id: 'name', title: 'Name' },
      { id: 'email', title: 'Email' },
    ];
    try {
      await this.csvService.exportCsv(data, filePath, header);
    } catch (error) {
      console.log(error);
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=download.csv');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}

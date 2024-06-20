import React from 'react';
import { Button } from 'antd';
import * as XLSX from 'xlsx';

interface ExportToExcelProps {
  data: any[];
  fileName: string;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data, fileName }) => {
  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return <Button type='primary' style={{ 
    backgroundColor: 'green', 
    borderColor: 'green', 
    margin: '20px' 
  }}  onClick={handleExport}>Exportar a Excel</Button>;
};

export default ExportToExcel;


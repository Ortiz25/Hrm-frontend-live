import React, { useState } from 'react';
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { Download } from 'lucide-react';
import generateAndDownloadP9 from "../util/generateP9.jsx";
const DownloadP9Modal = ({data}) => {
  const [selectedYear, setSelectedYear] = useState('');
   console.log(data)
  // Generate array of years (current year - 5 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) => currentYear - i);
  
  const handleDownload = () => {
    if (!selectedYear) return;
    const p9Info = data.filter(item => item.year === +selectedYear)
    // Implement your download logic here
    generateAndDownloadP9(p9Info)
    console.log(`Downloading P9 for year ${selectedYear}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Download className="h-4 w-4" />
          <span className='text-sm md:text-base'>Download P9 </span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Download P9 Form</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Year:</label>
            <Select onValueChange={setSelectedYear} value={selectedYear} >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleDownload}
            disabled={!selectedYear}
            className="w-full"
          >
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadP9Modal;
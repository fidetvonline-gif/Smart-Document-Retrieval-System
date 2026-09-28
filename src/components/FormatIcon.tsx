import React from 'react';
import { FileText, FileSpreadsheet, Image as ImageIcon, FileCode, File } from 'lucide-react';
import { DocumentFormat } from '../types';

interface FormatIconProps {
  format: DocumentFormat | string;
  className?: string;
  size?: number;
}

export const FormatIcon: React.FC<FormatIconProps> = ({ format, className = '', size = 16 }) => {
  const f = format.toLowerCase();
  if (f === 'pdf') {
    return <FileText size={size} className={`text-red-600 ${className}`} />;
  }
  if (f === 'docx' || f === 'doc') {
    return <FileText size={size} className={`text-blue-600 ${className}`} />;
  }
  if (f === 'csv' || f === 'xlsx' || f === 'xls') {
    return <FileSpreadsheet size={size} className={`text-emerald-700 ${className}`} />;
  }
  if (f === 'png' || f === 'jpg' || f === 'jpeg') {
    return <ImageIcon size={size} className={`text-slate-700 ${className}`} />;
  }
  if (f === 'txt') {
    return <FileCode size={size} className={`text-amber-700 ${className}`} />;
  }
  return <File size={size} className={`text-slate-500 ${className}`} />;
};

export const FormatBadge: React.FC<{ format: DocumentFormat | string }> = ({ format }) => {
  const f = format.toUpperCase();
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <FormatIcon format={format} size={11} />
      {f}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  return (
    <span className="inline-flex items-center text-xs font-medium text-slate-600">
      {category}
    </span>
  );
};


import React, { useState } from 'react';
import { Search, Calendar, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { DailyRecord } from '../types';

interface HistoryViewProps {
  records: DailyRecord[];
  onSelect: (record: DailyRecord) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ records, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r => 
    r.date.includes(searchTerm) || 
    r.quantity.toString().includes(searchTerm)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-slate-800">Seu Histórico</h2>
        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full font-bold">
          {records.length} registros
        </span>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar por data ou quantidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="space-y-3">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div 
              key={record.id}
              onClick={() => onSelect(record)}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 hover:border-blue-200 transition-all active:scale-[0.98]"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-blue-600">
                <span className="text-[10px] font-bold uppercase leading-tight">
                  {new Date(record.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                </span>
                <span className="text-lg font-black leading-tight">
                  {new Date(record.date).getDate() + 1}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{record.quantity} parcelas</h3>
                    <p className="text-xs text-slate-500">{new Date(record.date).toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-blue-600">R$ {record.totalValue.toFixed(2)}</p>
                    {record.photos.length > 0 && (
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <ImageIcon className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-slate-400 font-bold">{record.photos.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Nenhum registro encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;

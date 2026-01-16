
import React, { useState, useMemo } from 'react';
import { Calendar, Filter, Download, FileSpreadsheet, TrendingUp, Info } from 'lucide-react';
import { DailyRecord, WeeklySummary } from '../types';

interface ReportsViewProps {
  records: DailyRecord[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ records }) => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredData = useMemo(() => {
    return records.filter(r => r.date >= startDate && r.date <= endDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [records, startDate, endDate]);

  const totalPeriod = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.totalValue, 0);
  }, [filteredData]);

  const totalQuantity = useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredData]);

  const weeklySummaries = useMemo(() => {
    const summaries: Record<string, WeeklySummary> = {};
    
    filteredData.forEach(r => {
      const d = new Date(r.date);
      // Get the Monday of that week
      const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      const weekKey = monday.toISOString().split('T')[0];

      if (!summaries[weekKey]) {
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        summaries[weekKey] = {
          weekStart: weekKey,
          weekEnd: sunday.toISOString().split('T')[0],
          totalQuantity: 0,
          totalValue: 0,
          count: 0
        };
      }
      
      summaries[weekKey].totalQuantity += r.quantity;
      summaries[weekKey].totalValue += r.totalValue;
      summaries[weekKey].count += 1;
    });

    return Object.values(summaries).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  }, [filteredData]);

  const handleExportPDF = () => {
    alert('Funcionalidade de PDF acionada!\n\nEm um ambiente real, carregaríamos a biblioteca jspdf para gerar o documento estruturado com os ' + filteredData.length + ' registros deste período.');
  };

  const handleExportExcel = () => {
    alert('Exportando para Excel...\n\nSeria gerado um arquivo .xlsx contendo as colunas: Data, Quantidade, Valor e Links das Imagens.');
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800">Relatórios Financeiros</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-600 mb-2">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">Período personalizado</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Início</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Fim</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" 
            />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-600 text-white p-4 rounded-3xl shadow-lg shadow-blue-200 overflow-hidden relative group">
          <TrendingUp className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold uppercase opacity-80">Total Ganhos</p>
          <h3 className="text-2xl font-black">R$ {totalPeriod.toFixed(2)}</h3>
          <p className="text-[8px] mt-1 font-medium">{filteredData.length} dias registrados</p>
        </div>
        <div className="bg-slate-800 text-white p-4 rounded-3xl shadow-lg shadow-slate-200 overflow-hidden relative group">
          <Info className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-bold uppercase opacity-80">Total Parcelas</p>
          <h3 className="text-2xl font-black">{totalQuantity}</h3>
          <p className="text-[8px] mt-1 font-medium">No período selecionado</p>
        </div>
      </div>

      {/* Weekly Groups */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Resumo Semanal</h3>
        {weeklySummaries.length > 0 ? (
          weeklySummaries.map((week, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <div className="text-xs font-bold text-slate-400">
                  {new Date(week.weekStart).toLocaleDateString('pt-BR')} — {new Date(week.weekEnd).toLocaleDateString('pt-BR')}
                </div>
                <div className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {week.count} REGISTROS
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-slate-50 pt-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Média Diária</p>
                  <p className="font-bold text-slate-700">R$ {(week.totalValue / week.count).toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total Semana</p>
                  <p className="font-black text-blue-600 text-lg">R$ {week.totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-400 text-sm py-10 bg-slate-100 rounded-2xl border-2 border-dashed">
            Nenhum dado para agrupar.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <button 
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 p-4 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Baixar PDF
        </button>
        <button 
          onClick={handleExportExcel}
          className="flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-100 p-4 rounded-2xl font-bold text-xs hover:bg-green-100 transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Exportar Excel
        </button>
      </div>
    </div>
  );
};

export default ReportsView;

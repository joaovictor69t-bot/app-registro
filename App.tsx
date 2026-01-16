
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  History, 
  BarChart3, 
  PlusCircle, 
  X, 
  Trash2, 
  Calendar as CalendarIcon,
  ChevronRight,
  Download,
  Camera
} from 'lucide-react';
import { AppTab, DailyRecord } from './types';
import { getRecords, saveRecord, deleteRecord } from './services/storage';
import RegisterView from './components/RegisterView';
import HistoryView from './components/HistoryView';
import ReportsView from './components/ReportsView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.REGISTER);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [showDetail, setShowDetail] = useState<DailyRecord | null>(null);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const handleSave = (record: DailyRecord) => {
    saveRecord(record);
    setRecords(getRecords());
    setActiveTab(AppTab.HISTORY);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja realmente excluir este registro?')) {
      deleteRecord(id);
      setRecords(getRecords());
      setShowDetail(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.REGISTER:
        return <RegisterView onSave={handleSave} />;
      case AppTab.HISTORY:
        return <HistoryView records={records} onSelect={setShowDetail} />;
      case AppTab.REPORTS:
        return <ReportsView records={records} />;
      default:
        return <RegisterView onSave={handleSave} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-20 max-w-lg mx-auto shadow-xl ring-1 ring-slate-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Meu Registro Diário
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Record Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-lg font-bold">Detalhes do Registro</h2>
              <button onClick={() => setShowDetail(null)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Data</span>
                  <p className="font-bold text-slate-800">{new Date(showDetail.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Parcelas</span>
                  <p className="font-bold text-slate-800">{showDetail.quantity}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                <span className="text-sm text-blue-600 font-medium">Valor Total</span>
                <p className="text-3xl font-black text-blue-700">R$ {showDetail.totalValue.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-700">Fotos do Trabalho</h3>
                {showDetail.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {showDetail.photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Trabalho ${idx}`} 
                          className="w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-zoom-in"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">Nenhuma foto anexada.</p>
                )}
              </div>

              <button 
                onClick={() => handleDelete(showDetail.id)}
                className="w-full flex items-center justify-center gap-2 p-3 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors mt-6"
              >
                <Trash2 className="w-4 h-4" />
                Excluir Registro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-slate-200 flex justify-around p-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab(AppTab.REGISTER)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === AppTab.REGISTER ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <PlusCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold">Registro</span>
        </button>
        <button 
          onClick={() => setActiveTab(AppTab.HISTORY)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === AppTab.HISTORY ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">Histórico</span>
        </button>
        <button 
          onClick={() => setActiveTab(AppTab.REPORTS)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === AppTab.REPORTS ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-[10px] font-bold">Relatórios</span>
        </button>
      </nav>
    </div>
  );
};

export default App;

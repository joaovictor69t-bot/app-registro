
import React, { useState, useEffect } from 'react';
import { Camera, Calendar as CalendarIcon, Save, Trash2, X } from 'lucide-react';
import { DailyRecord } from '../types';
import { RATE_PER_UNIT } from '../constants';

interface RegisterViewProps {
  onSave: (record: DailyRecord) => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onSave }) => {
  const [quantity, setQuantity] = useState<number | ''>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    if (typeof quantity === 'number') {
      setTotal(quantity * RATE_PER_UNIT);
    } else {
      setTotal(0);
    }
  }, [quantity]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Fix: Explicitly type 'file' as File to avoid 'unknown' type error in forEach callback
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity === '' || quantity <= 0) return;

    const newRecord: DailyRecord = {
      id: crypto.randomUUID(),
      date,
      quantity: Number(quantity),
      totalValue: total,
      photos
    };

    onSave(newRecord);
    // Reset
    setQuantity('');
    setPhotos([]);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
        <h2 className="text-lg font-bold text-slate-800">Novo Registro de Trabalho</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Data do Trabalho</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Quantidade de Parcelas</label>
            <input 
              type="number" 
              placeholder="Ex: 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between border border-blue-100">
            <div className="text-sm text-blue-700 font-medium">
              Valor Calculado <br/>
              <span className="text-[10px] text-blue-500 opacity-70">({quantity || 0} x R$ {RATE_PER_UNIT.toFixed(2)})</span>
            </div>
            <div className="text-2xl font-black text-blue-700">
              R$ {total.toFixed(2)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600 block">Fotos (Opcional)</label>
            <div className="grid grid-cols-4 gap-2">
              <label className="aspect-square bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                <Camera className="w-6 h-6 text-slate-500" />
                <span className="text-[8px] mt-1 font-bold text-slate-500 uppercase">Adicionar</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                />
              </label>
              
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img src={photo} className="w-full h-full object-cover rounded-xl border border-slate-200 shadow-sm" />
                  <button 
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:active:scale-100"
            disabled={!quantity || quantity <= 0}
          >
            <Save className="w-5 h-5" />
            Salvar Registro
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;

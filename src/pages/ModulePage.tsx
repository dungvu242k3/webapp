import React from 'react';
import { Search, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sidebarMenu } from '../data/sidebarMenu';

const ModulePage: React.FC = () => {
  const navigate = useNavigate();
  const currentItem = sidebarMenu.find(item => item.path === location.pathname);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="flex items-center gap-3 mb-4 sm:hidden">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-lg flex items-center justify-center bg-card border border-border shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-foreground">
          {currentItem?.label}
        </h1>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-6 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground text-[13px] font-medium transition-colors bg-card shadow-sm"
        >
          <ChevronLeft size={16} />
          Quay lại
        </button>

        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
            <Search size={16} />
          </div>
          <input
            type="text"
            className="w-full text-[13px] bg-transparent border border-border rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
            placeholder="Tìm kiếm..."
          />
        </div>
      </div>
    </div>
  );
};

export default ModulePage;

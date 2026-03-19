import React, { useState } from 'react';
import { Search, Box, Receipt, Coins, Users, Clock, Briefcase, ShieldCheck, UserCog, Download, FileText, Filter, Wallet, HandCoins, Truck, Upload, FileSpreadsheet, Warehouse, Building2, MapPin, Navigation } from 'lucide-react';
import { clsx } from 'clsx';
import { ModuleCard } from '../components/ui/ModuleCard';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chuc-nang' | 'danh-dau' | 'tat-ca'>('tat-ca');
  const [searchQuery, setSearchQuery] = useState('');

  const allModules = [
    {
      icon: Box,
      title: "Danh mục hàng",
      description: "Quản lý danh mục hàng hóa.",
      colorScheme: "blue" as const,
      path: "/danh-muc-hang"
    },
    {
      icon: Receipt,
      title: "Công nợ",
      description: "Quản lý công nợ tổng thể.",
      colorScheme: "amber" as const,
      path: "/cong-no"
    },
    {
      icon: Coins,
      title: "Công nợ bán",
      description: "Theo dõi nợ của khách hàng.",
      colorScheme: "orange" as const,
      path: "/cong-no-ban"
    },
    {
      icon: Users,
      title: "Khách hàng",
      description: "Quản lý danh sách khách hàng.",
      colorScheme: "blue" as const,
      path: "/kinh-doanh"
    },
    {
      icon: Clock,
      title: "Đợi xe",
      description: "Điều phối xe vận chuyển hàng.",
      colorScheme: "slate" as const,
      path: "/doi-xe"
    },
    {
      icon: Briefcase,
      title: "Dự án",
      description: "Quản lý các dự án hiện có.",
      colorScheme: "purple" as const,
      path: "/du-an"
    },
    {
      icon: ShieldCheck,
      title: "Phân quyền",
      description: "Thiết lập quyền người dùng.",
      colorScheme: "red" as const,
      path: "/phan-quyen"
    },
    {
      icon: UserCog,
      title: "Nhân sự",
      description: "Quản lý nhân viên công ty.",
      colorScheme: "emerald" as const,
      path: "/nhan-su"
    },
    {
      icon: Download,
      title: "Nhập hàng",
      description: "Quy trình nhập kho tổng quát.",
      colorScheme: "cyan" as const,
      path: "/nhap-hang"
    },
    {
      icon: FileText,
      title: "Nhập hàng CT",
      description: "Chi tiết các đợt nhập hàng.",
      colorScheme: "blue" as const,
      path: "/nhap-hang-ct"
    },
    {
      icon: Filter,
      title: "Lọc tồn kho",
      description: "Kiểm tra số dư kho hàng.",
      colorScheme: "teal" as const,
      path: "/loc-ton-kho"
    },
    {
      icon: Wallet,
      title: "Thanh toán nhập",
      description: "Chi trả tiền hàng cho NCC.",
      colorScheme: "green" as const,
      path: "/thanh-toan-nhap"
    },
    {
      icon: HandCoins,
      title: "Thanh toán xuất",
      description: "Thu tiền từ khách hàng.",
      colorScheme: "pink" as const,
      path: "/thanh-toan-xuat"
    },
    {
      icon: Truck,
      title: "Đơn vị vận chuyển",
      description: "Đối tác giao nhận của kho.",
      colorScheme: "slate" as const,
      path: "/don-vi-van-chuyen"
    },
    {
      icon: Upload,
      title: "Xuất hàng",
      description: "Quy trình xuất kho hàng hóa.",
      colorScheme: "blue" as const,
      path: "/xuat-hang"
    },
    {
      icon: FileSpreadsheet,
      title: "Xuất hàng CT",
      description: "Chi tiết các đợt xuất hàng.",
      colorScheme: "cyan" as const,
      path: "/xuat-hang-ct"
    },
    {
      icon: Warehouse,
      title: "Loại kho",
      description: "Phân loại các vị trí lưu trữ.",
      colorScheme: "purple" as const,
      path: "/loai-kho"
    },
    {
      icon: Building2,
      title: "Nhà cung cấp",
      description: "Quản lý đối tác cung ứng.",
      colorScheme: "teal" as const,
      path: "/nha-cung-cap"
    },
    {
      icon: MapPin,
      title: "Địa chỉ mua",
      description: "Địa điểm thu mua hàng hóa.",
      colorScheme: "orange" as const,
      path: "/dia-chi-mua"
    },
    {
      icon: Navigation,
      title: "Địa chỉ giao",
      description: "Các điểm giao nhận cụ thể.",
      colorScheme: "emerald" as const,
      path: "/dia-chi-giao"
    }
  ];

  const filteredModules = allModules.filter(module => 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold flex items-center gap-2 text-foreground">
          Chào buổi tối, <span className="text-primary">Lê Minh Công</span> 👋
        </h1>
      </div>

      <div className={clsx(
        "bg-card rounded-xl shadow-sm border border-border p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 lg:mb-8 transition-all duration-300",
        activeTab === 'tat-ca' ? "w-full" : "max-w-fit"
      )}>
        <div className="flex bg-muted/20 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setActiveTab('chuc-nang')}
            className={clsx(
              "px-4 py-1.5 rounded-md text-[13px] font-bold transition-all duration-200",
              activeTab === 'chuc-nang' 
                ? "bg-card text-primary shadow-sm ring-1 ring-black/5" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Chức năng
          </button>
          <button
            onClick={() => setActiveTab('danh-dau')}
            className={clsx(
              "px-4 py-1.5 rounded-md text-[13px] font-bold transition-all duration-200",
              activeTab === 'danh-dau' 
                ? "bg-card text-primary shadow-sm ring-1 ring-black/5" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Đánh dấu
          </button>
          <button
            onClick={() => setActiveTab('tat-ca')}
            className={clsx(
              "px-4 py-1.5 rounded-md text-[13px] font-bold transition-all duration-200",
              activeTab === 'tat-ca' 
                ? "bg-card text-primary shadow-sm ring-1 ring-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Tất cả
          </button>
        </div>

        {/* Search Bar (Only shown on "Tất cả" tab) */}
        {activeTab === 'tat-ca' && (
          <div className="flex-1 flex items-center bg-muted/20 rounded-lg px-3 py-1.5 animate-in slide-in-from-left-2 duration-300">
            <Search size={16} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm module, chức năng..."
              className="bg-transparent border-none outline-none text-[13px] text-foreground w-full ml-2 placeholder:text-muted-foreground/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {activeTab === 'tat-ca' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-in fade-in duration-500">
          {filteredModules.map((module, index) => (
            <ModuleCard
              key={index}
              icon={module.icon}
              title={module.title}
              description={module.description}
              colorScheme={module.colorScheme}
              path={module.path}
            />
          ))}
        </div>
      )}

      {(activeTab === 'chuc-nang' || activeTab === 'danh-dau') && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-500">
          <Box size={48} className="mb-4 opacity-20" />
          <p className="text-[14px]">Hiện chưa có mục nào được hiển thị ở đây.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

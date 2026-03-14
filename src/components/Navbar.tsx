import Link from 'next/link';
import { User, Menu, Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full bg-[#FDFCFB]/90 backdrop-blur-md border-b border-[#E7E5E4] sticky top-0 z-50 transition-all duration-500">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-20 flex justify-between items-center">
        
        {/* 1. Logo - شعار الموقع بخط السيريف الفخم */}
        <Link href="/" className="group">
          <div className="text-xl md:text-2xl font-serif tracking-[6px] font-bold text-[#1A1A1A] group-hover:opacity-60 transition-opacity">
            NAZEEL
          </div>
        </Link>

        {/* 2. Navigation Links - روابط التنقل الوسطى */}
        <div className="hidden md:flex gap-10 items-center">
          <NavLink href="/hotels" label="Hotels" />
          <NavLink href="/destinations" label="Destinations" />
          <NavLink href="/offers" label="Offers" />
        </div>

        {/* 3. Auth & Tools - أدوات المستخدم والبحث */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* أيقونة البحث السريع */}
          <button className="text-[#1A1A1A] hover:opacity-50 transition-all">
            <Search size={18} strokeWidth={1.5} />
          </button>

          {/* فاصل رأسي بسيط */}
          <div className="hidden md:block h-4 w-[1px] bg-[#E7E5E4]"></div>

          {/* زر تسجيل الدخول */}
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-[10px] uppercase tracking-[3px] font-medium text-[#1A1A1A] hover:opacity-50 transition-all"
          >
            <User size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Sign In</span>
          </Link>

          {/* زر القائمة للموبايل */}
          <button className="md:hidden text-[#1A1A1A]">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

// مكون فرعي للروابط لضمان نظافة الكود وتكرار التنسيق
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="text-[10px] uppercase tracking-[3px] font-medium text-[#1A1A1A] hover:text-gray-400 transition-colors duration-300 relative group"
    >
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#1A1A1A] transition-all duration-500 group-hover:w-full"></span>
    </Link>
  );
}
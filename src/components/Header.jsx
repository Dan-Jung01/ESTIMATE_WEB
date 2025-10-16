import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, FilePlus } from 'lucide-react';
export default function Header(){
  const { pathname } = useLocation();
  const link = (to, label, Icon) => (
    <Link to={to}
      className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 border transition ${
        pathname===to ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-700 hover:bg-gray-100 border-transparent'}`}>
      <Icon size={16}/>{label}
    </Link>
  );
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/estimates" className="text-xl font-bold">삼화크린글러브</Link>
        <nav className="flex gap-2">
          {link('/estimates','견적서 목록',List)}
          {link('/estimates/new','새 견적서',FilePlus)}
        </nav>
      </div>
    </header>
  )
}

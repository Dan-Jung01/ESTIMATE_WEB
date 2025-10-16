import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import Header from '../components/Header';
import { api } from '../api';
export default function EstimateList(){
  const [estimates, setEstimates] = useState([]);
  useEffect(()=>{ api.get('/estimates').then(r=>setEstimates(r.data)); },[]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold">견적서 목록</h2>
            <p className="text-gray-500">저장된 견적서를 확인하고 관리하세요</p>
          </div>
          <Link to="/estimates/new" className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium inline-flex items-center gap-2">
            <Plus size={18}/> 새 견적서 작성
          </Link>
        </div>
        {estimates.length===0 ? (
          <div className="bg-white border rounded-xl p-12 text-center shadow-sm">
            <FileText size={56} className="text-gray-400 mx-auto mb-3"/>
            <div className="text-lg font-semibold">저장된 견적서가 없습니다</div>
            <p className="text-gray-500 mb-6">새 견적서를 작성하여 시작하세요</p>
            <Link to="/estimates/new" className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg">+ 견적서 작성하기</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {estimates.map(e=> (
              <div key={e.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{e.title || e.docNumber}</div>
                  <div className="text-sm text-gray-500">{new Date(e.createdAt).toLocaleString()} · 총액 {Number(e.totalAmount||0).toLocaleString()}원</div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/estimates/print/${e.id}`} className="text-primary font-medium">프린트</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

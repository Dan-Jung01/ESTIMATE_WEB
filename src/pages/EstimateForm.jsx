import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../api';
const emptyItem = { name:'', model:'', quantity:0, price:0, total:0 };
const fmt = (n)=> (Number(n)||0).toLocaleString();
export default function EstimateForm(){
  const [docNumber, setDocNumber] = useState('SG-2025-001');
  const [writer, setWriter] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [client, setClient] = useState('');
  const [manager, setManager] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('납기, 결제 조건, 기타 유의사항 등을 입력하세요. (예: 납기일: 발주 후 7일 이내, 결제 조건: 만금 30일 이내)');
  const [items, setItems] = useState([{...emptyItem, quantity:8}]);

  const totals = useMemo(()=>{
    const subtotal = items.reduce((s,i)=> s + (Number(i.quantity)*Number(i.price)||0), 0);
    const vat = Math.round(subtotal*0.1);
    const total = subtotal + vat;
    return { subtotal, vat, total };
  },[items]);

  const updateItem = (idx, key, val)=>{
    const arr = items.slice();
    arr[idx] = { ...arr[idx], [key]: key==='quantity'||key==='price' ? Number(val||0) : val };
    arr[idx].total = (Number(arr[idx].quantity)||0)*(Number(arr[idx].price)||0);
    setItems(arr);
  };
  const addItem = ()=> setItems([...items, {...emptyItem}]);
  const removeItem = (idx)=> setItems(items.filter((_,i)=>i!==idx));

  const validate = ()=>{
    if(!client || !docNumber) return false;
    if(items.length===0) return false;
    return !items.some(i=>!i.name || !i.quantity || !i.price);
  };

  const handleSave = async ()=>{
    if(!validate()){ alert('빈 항목을 확인해주세요. (거래처, 항목명/수량/단가 필수)'); return; }
    try{
      const payload = { title: `견적서 ${docNumber}`, docNumber, writer, date, client, manager, dueDate,
        subtotal: totals.subtotal, vat: totals.vat, totalAmount: totals.total, note,
        items: items.map(i=>({ name:i.name, model:i.model, quantity:i.quantity, price:i.price, total:i.total })) };
      const res = await api.post('/estimates', payload);
      alert('저장되었습니다.');
      window.location.href = '/estimates/print/' + res.data.id;
    }catch(e){ console.error(e); alert('저장 실패'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">견적서</h2>
          <div className="no-print">
            <button onClick={()=>window.print()} className="bg-white border px-4 py-2 rounded-md shadow-sm">견적서 인쇄 / PDF 저장</button>
          </div>
        </div>
        <div className="bg-white border rounded-xl shadow-sm p-6 print-card">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center"><label className="text-sm text-gray-600">문서번호</label><input value={docNumber} onChange={e=>setDocNumber(e.target.value)} className="col-span-2 border rounded-md px-3 py-2"/></div>
              <div className="grid grid-cols-3 gap-2 items-center"><label className="text-sm text-gray-600">귀하</label><input value={client} onChange={e=>setClient(e.target.value)} placeholder="거래처명" className="col-span-2 border rounded-md px-3 py-2"/></div>
              <div className="grid grid-cols-3 gap-2 items-center"><label className="text-sm text-gray-600">참조</label><input value={dueDate} onChange={e=>setDueDate(e.target.value)} placeholder="견적 유효기간 등" className="col-span-2 border rounded-md px-3 py-2"/></div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center"><label className="text-sm text-gray-600">작성일자</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="col-span-2 border rounded-md px-3 py-2"/></div>
              <div className="grid grid-cols-3 gap-2 items-center"><label className="text-sm text-gray-600">작성자</label><input value={writer} onChange={e=>setWriter(e.target.value)} className="col-span-2 border rounded-md px-3 py-2"/></div>
              <div className="grid grid-cols-3 gap-2 items-center"><label className="text-sm text-gray-600">담당자</label><input value={manager} onChange={e=>setManager(e.target.value)} className="col-span-2 border rounded-md px-3 py-2"/></div>
            </div>
          </div>

          <div className="mt-6 rounded-xl p-6 bg-blue-600 text-white">
            <div className="text-sm opacity-90 mb-1">총 견적 금액 (VAT 포함)</div>
            <div className="text-4xl font-extrabold">{fmt(totals.total)} 원</div>
            <div className="text-xs opacity-80 mt-1">위 금액으로 견적합니다.</div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="border p-2 w-16">NO.</th>
                  <th className="border p-2">제품명</th>
                  <th className="border p-2">규격/모델</th>
                  <th className="border p-2 w-24">수량</th>
                  <th className="border p-2 w-32">단가 (원)</th>
                  <th className="border p-2 w-32">금액 (원)</th>
                  <th className="border p-2 w-16">삭제</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx)=> (
                  <tr key={idx}>
                    <td className="border p-2 text-center">{idx+1}</td>
                    <td className="border p-1"><input value={it.name} onChange={e=>updateItem(idx,'name',e.target.value)} className="w-full px-2 py-1 rounded border"/></td>
                    <td className="border p-1"><input value={it.model} onChange={e=>updateItem(idx,'model',e.target.value)} className="w-full px-2 py-1 rounded border"/></td>
                    <td className="border p-1"><input type="number" value={it.quantity} onChange={e=>updateItem(idx,'quantity',e.target.value)} className="w-full px-2 py-1 rounded border text-right"/></td>
                    <td className="border p-1"><input type="number" value={it.price} onChange={e=>updateItem(idx,'price',e.target.value)} className="w-full px-2 py-1 rounded border text-right"/></td>
                    <td className="border p-2 text-right">{fmt(it.total)}</td>
                    <td className="border p-2 text-center"><button onClick={()=>removeItem(idx)} className="text-red-500">×</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3"><button onClick={addItem} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">+ 품목 추가</button></div>

          <div className="mt-6 ml-auto w-full sm:w-80">
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between px-4 py-2 border-b"><span>공급가액</span><span>{fmt(totals.subtotal)}</span></div>
              <div className="flex justify-between px-4 py-2 border-b"><span>부가세 (10%)</span><span>{fmt(totals.vat)}</span></div>
              <div className="flex justify-between px-4 py-2 bg-blue-600 text-white font-semibold"><span>총 합계액 (VAT 포함)</span><span>{fmt(totals.total)}</span></div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">특기 사항</div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} className="w-full border rounded-md p-3 h-28" />
          </div>
          <hr className="my-6"/>
          <p className="text-xs text-gray-500">본 견적서는 삼화크린글러브에서 정식 발행한 문서입니다. 문의사항은 상단의 연락처로 연락 주시기 바랍니다.</p>
        </div>
      </main>
      <Footer onSave={handleSave} />
    </div>
  )
}

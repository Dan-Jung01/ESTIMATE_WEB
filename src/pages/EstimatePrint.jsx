import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useReactToPrint } from "react-to-print";
import Header from "../components/Header"; // ✅ Header 추가

export default function EstimatePrint() {
  const { id } = useParams();
  const [estimate, setEstimate] = useState(null);
  const compRef = useRef();
  const handlePrint = useReactToPrint({ content: () => compRef.current });

  useEffect(() => {
    api.get(`/estimates/${id}`).then((r) => setEstimate(r.data));
  }, [id]);

  const fmt = (n) => (Number(n) || 0).toLocaleString();

  if (!estimate) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ 페이지 상단 Header (인쇄 시 숨김 처리) */}
      <div className="no-print">
        <Header />
      </div>

      <div className="p-6">
        <div
          ref={compRef}
          className="max-w-5xl mx-auto bg-white border rounded-xl shadow-sm p-6 print-card"
        >
          {/* 상단 제목 및 회사 정보 */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">견적서</h2>
              <p className="text-gray-500 text-sm">Quotation</p>
            </div>
            <div className="text-sm text-right leading-6">
              <div className="font-semibold text-gray-800">삼화크린글러브</div>
              <div>대표자: 정현배</div>
              <div>사업자등록번호: 123-45-67890</div>
              <div>주소: 경남 양산시 이락가</div>
              <div>전화: 055-123-4567 / 팩스: 055-765-4321</div>
            </div>
          </div>

          {/* 문서 기본 정보 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">문서번호</label>
                <div className="col-span-2 border rounded-md px-3 py-2 bg-gray-50">
                  {estimate.docNumber}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">귀하</label>
                <div className="col-span-2 border rounded-md px-3 py-2 bg-gray-50">
                  {estimate.client}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">참조</label>
                <div className="col-span-2 border rounded-md px-3 py-2 bg-gray-50">
                  {estimate.dueDate}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">작성일자</label>
                <div className="col-span-2 border rounded-md px-3 py-2 bg-gray-50">
                  {estimate.date}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">작성자</label>
                <div className="col-span-2 border rounded-md px-3 py-2 bg-gray-50">
                  {estimate.writer}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 items-center">
                <label className="text-sm text-gray-600">담당자</label>
                <div className="col-span-2 border rounded-md px-3 py-2 bg-gray-50">
                  {estimate.manager}
                </div>
              </div>
            </div>
          </div>

          {/* 합계 금액 박스 */}
          <div className="mt-6 rounded-xl p-6 bg-blue-600 text-white">
            <div className="text-sm opacity-90 mb-1">총 견적 금액 (VAT 포함)</div>
            <div className="text-4xl font-extrabold">{fmt(estimate.totalAmount)} 원</div>
            <div className="text-xs opacity-80 mt-1">위 금액으로 견적합니다.</div>
          </div>

          {/* 품목 테이블 */}
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
                </tr>
              </thead>
              <tbody>
                {estimate.items.map((it, idx) => (
                  <tr key={it.id}>
                    <td className="border p-2 text-center">{idx + 1}</td>
                    <td className="border p-2">{it.name}</td>
                    <td className="border p-2">{it.model}</td>
                    <td className="border p-2 text-right">{it.quantity}</td>
                    <td className="border p-2 text-right">{fmt(it.price)}</td>
                    <td className="border p-2 text-right">{fmt(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 합계 표 */}
          <div className="mt-6 ml-auto w-full sm:w-80">
            <div className="border rounded-lg overflow-hidden">
              <div className="flex justify-between px-4 py-2 border-b">
                <span>공급가액</span>
                <span>{fmt(estimate.subtotal)}</span>
              </div>
              <div className="flex justify-between px-4 py-2 border-b">
                <span>부가세 (10%)</span>
                <span>{fmt(estimate.vat)}</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-blue-600 text-white font-semibold">
                <span>총 합계액 (VAT 포함)</span>
                <span>{fmt(estimate.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* 특기사항 */}
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">특기 사항</div>
            <div className="w-full border rounded-md p-3 bg-gray-50 whitespace-pre-line">
              {estimate.note}
            </div>
          </div>

          <hr className="my-6" />
          <p className="text-xs text-gray-500">
            본 견적서는 삼화크린글러브에서 정식 발행한 문서입니다. 문의사항은 상단의 연락처로
            연락 주시기 바랍니다.
          </p>
        </div>

        {/* 인쇄 버튼 */}
        <div className="text-center mt-4 no-print">
          <button
            onClick={handlePrint}
            className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            인쇄 / PDF 저장
          </button>
        </div>
      </div>
    </div>
  );
}

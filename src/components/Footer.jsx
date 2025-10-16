import React from 'react';
export default function Footer({ onSave }){
  return (
    <div className="no-print fixed bottom-0 w-full bg-white border-t shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-end">
        <button onClick={onSave} className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">저장</button>
      </div>
    </div>
  )
}

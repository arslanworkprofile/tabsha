import React, { useState } from 'react';
const W=[{s:'XS',c:'32"',w:'25"',h:'35"',pk:'34'},{s:'S',c:'34"',w:'27"',h:'37"',pk:'36'},{s:'M',c:'36"',w:'29"',h:'39"',pk:'38'},{s:'L',c:'38"',w:'31"',h:'41"',pk:'40'},{s:'XL',c:'40"',w:'33"',h:'43"',pk:'42'},{s:'XXL',c:'42"',w:'35"',h:'45"',pk:'44'}];
const M=[{s:'S',c:'36"',w:'30"',sh:'17"',pk:'38'},{s:'M',c:'38"',w:'32"',sh:'18"',pk:'40'},{s:'L',c:'40"',w:'34"',sh:'19"',pk:'42'},{s:'XL',c:'42"',w:'36"',sh:'20"',pk:'44'},{s:'XXL',c:'44"',w:'38"',sh:'21"',pk:'46'}];
export default function SizeGuidePage() {
  const [tab, setTab] = useState('women');
  const rows = tab === 'women' ? W : M;
  return (
    <div style={{ paddingTop: 140, paddingBottom: 80, minHeight: '70vh' }}>
      <div className="container-sm">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 40, fontWeight: 400, marginBottom: 10 }}>Size Guide</h1>
          <p style={{ color: 'var(--g5)', fontSize: 15 }}>Find your perfect fit. All measurements in inches.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 32, border: '1.5px solid var(--g2)', borderRadius: 4, overflow: 'hidden', maxWidth: 280, margin: '0 auto 32px' }}>
          {['women','men'].map(t => <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '11px 0', fontSize: 12, fontWeight: 600, textTransform: 'capitalize', letterSpacing: '.06em', cursor: 'pointer', border: 'none', fontFamily: 'var(--sans)', background: tab === t ? 'var(--black)' : 'transparent', color: tab === t ? 'var(--white)' : 'var(--g5)', transition: 'all .2s' }}>{t === 'women' ? "Women's" : "Men's"}</button>)}
        </div>
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--g2)', marginBottom: 36 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>{['Size','Chest','Waist',tab==='women'?'Hips':'Shoulder','PK Size'].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--g5)', background: 'var(--g1)', borderBottom: '1px solid var(--g2)' }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r,i) => <tr key={r.s} style={{ background: i%2===0?'var(--white)':'var(--g1)' }}>
                <td style={{ padding: '13px 20px', fontWeight: 700 }}>{r.s}</td>
                <td style={{ padding: '13px 20px' }}>{r.c}</td>
                <td style={{ padding: '13px 20px' }}>{r.w}</td>
                <td style={{ padding: '13px 20px' }}>{tab==='women'?r.h:r.sh}</td>
                <td style={{ padding: '13px 20px', color: 'var(--gold-d)', fontWeight: 600 }}>{r.pk}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
        <div style={{ background: 'var(--black)', borderRadius: 10, padding: '32px 36px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 400, color: 'var(--white)', marginBottom: 10 }}>Not Sure About Your Size?</h3>
          <p style={{ color: 'var(--g5)', fontSize: 14, marginBottom: 18 }}>Order custom stitching and we'll tailor it to your exact measurements.</p>
          <button className="btn btn-gold">Request Custom Stitching</button>
        </div>
      </div>
    </div>
  );
}

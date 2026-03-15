import React,{useEffect,useState,useCallback}from'react';
import{Link}from'react-router-dom';
import{FiEye,FiTrash2}from'react-icons/fi';
import{getAllOrders,deleteOrder,updateOrderStatus}from'../../utils/api';
import toast from'react-hot-toast';
const TABS=['all','pending','confirmed','processing','shipped','delivered','cancelled'];
export default function AdminOrders(){
const[orders,setOrders]=useState([]);const[total,setTotal]=useState(0);const[loading,setLoading]=useState(true);
const[page,setPage]=useState(1);const[pages,setPages]=useState(1);const[tab,setTab]=useState('all');const[del,setDel]=useState(null);
const fetch=useCallback(async()=>{setLoading(true);try{const p={page,limit:15};if(tab!=='all')p.status=tab;const{data}=await getAllOrders(p);setOrders(data.orders||[]);setTotal(data.total||0);setPages(data.pages||1);}catch{toast.error('Failed');}finally{setLoading(false);};},[page,tab]);
useEffect(()=>{fetch();},[fetch]);
const handleDel=async(id,num)=>{if(!window.confirm(`Delete ${num}?`))return;setDel(id);try{await deleteOrder(id);toast.success('Deleted');fetch();}catch{toast.error('Failed');}finally{setDel(null);};};
const quickStatus=async(id,status)=>{try{await updateOrderStatus(id,{orderStatus:status});toast.success('Status updated');fetch();}catch{toast.error('Failed');};};
return(
<div>
<div className="adm-page-hdr"><div><h1 className="adm-page-title">Orders</h1><p className="adm-page-sub">{total} total orders</p></div></div>
<div className="adm-status-tabs">{TABS.map(t=><button key={t} className={`adm-status-tab${tab===t?' active':''}`} onClick={()=>{setTab(t);setPage(1);}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}</div>
<div className="adm-card"><div className="adm-tbl-wrap"><table className="adm-tbl"><thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
<tbody>{loading?[...Array(8)].map((_,i)=><tr key={i}>{[...Array(8)].map((_,j)=><td key={j}><div className="skeleton" style={{height:13}}/></td>)}</tr>):orders.length===0?<tr><td colSpan={8} style={{textAlign:'center',padding:48,color:'var(--g4)'}}>No orders found</td></tr>:orders.map(o=>(
<tr key={o._id}>
<td><Link to={`/admin/orders/${o._id}`} style={{color:'var(--adm-accent)',fontWeight:700}}>{o.orderNumber}</Link></td>
<td><div style={{fontSize:13,fontWeight:500}}>{o.user?.name||'—'}</div><div style={{fontSize:11,color:'var(--g4)'}}>{o.user?.email}</div></td>
<td style={{fontSize:13}}>{o.items?.length} item{o.items?.length!==1?'s':''}</td>
<td style={{fontWeight:700}}>PKR {o.total?.toLocaleString()}</td>
<td><span className="badge badge-gray" style={{textTransform:'uppercase'}}>{o.paymentMethod}</span></td>
<td><select className="form-select" value={o.orderStatus} onChange={e=>quickStatus(o._id,e.target.value)} style={{fontSize:11,padding:'4px 22px 4px 8px',border:'none',background:'var(--adm-bg)',borderRadius:4,cursor:'pointer',width:'auto'}}>{['pending','confirmed','processing','shipped','delivered','cancelled','returned'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></td>
<td style={{fontSize:12,color:'var(--adm-muted)',whiteSpace:'nowrap'}}>{new Date(o.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}</td>
<td><div className="adm-tbl-actions"><Link to={`/admin/orders/${o._id}`} className="adm-tbl-btn" title="View"><FiEye size={13}/></Link><button className="adm-tbl-btn adm-tbl-btn--danger" title="Delete" onClick={()=>handleDel(o._id,o.orderNumber)} disabled={del===o._id}>{del===o._id?<span className="spinner" style={{width:12,height:12,borderWidth:2}}/>:<FiTrash2 size={13}/>}</button></div></td>
</tr>))}</tbody></table></div>
{pages>1&&<div style={{padding:'14px 20px',borderTop:'1px solid var(--adm-border)',display:'flex',justifyContent:'flex-end'}}><div className="pagination" style={{marginTop:0}}>{[...Array(pages)].map((_,i)=><button key={i} className={`pagination__btn${page===i+1?' active':''}`} onClick={()=>setPage(i+1)}>{i+1}</button>)}</div></div>}
</div></div>);
}

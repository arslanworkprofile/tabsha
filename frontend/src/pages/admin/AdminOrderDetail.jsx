import React,{useEffect,useState}from'react';
import{useParams,useNavigate,Link}from'react-router-dom';
import{FiArrowLeft,FiCheck,FiPackage,FiMapPin,FiUser,FiCreditCard}from'react-icons/fi';
import{getOrder,updateOrderStatus}from'../../utils/api';
import toast from'react-hot-toast';
const STEPS=['pending','confirmed','processing','shipped','delivered'];
export default function AdminOrderDetail(){
const{id}=useParams();const navigate=useNavigate();
const[order,setOrder]=useState(null);const[loading,setLoading]=useState(true);
const[updating,setUpdating]=useState(false);const[note,setNote]=useState('');const[tracking,setTracking]=useState('');
useEffect(()=>{getOrder(id).then(r=>{setOrder(r.data);setTracking(r.data.trackingNumber||'');}).catch(()=>toast.error('Not found')).finally(()=>setLoading(false));},[id]);
const handleUpdate=async newStatus=>{setUpdating(true);try{const{data}=await updateOrderStatus(id,{orderStatus:newStatus,note,trackingNumber:tracking});setOrder(data);setNote('');toast.success(`Status → ${newStatus}`);}catch{toast.error('Failed');}finally{setUpdating(false);};};
if(loading)return<div style={{display:'flex',justifyContent:'center',padding:80}}><span className="spinner"/></div>;
if(!order)return<div style={{textAlign:'center',padding:80}}><h3>Order not found</h3><Link to="/admin/orders" className="btn btn-outline" style={{marginTop:16}}>Back</Link></div>;
const stepIdx=STEPS.indexOf(order.orderStatus);const cancelled=order.orderStatus==='cancelled'||order.orderStatus==='returned';
return(
<div>
<div className="adm-page-hdr">
<div style={{display:'flex',alignItems:'center',gap:16}}><button onClick={()=>navigate('/admin/orders')} style={{background:'none',border:'none',cursor:'pointer',color:'var(--adm-muted)',display:'flex',alignItems:'center',gap:6,fontSize:13}}><FiArrowLeft size={15}/>Back</button><div><h1 className="adm-page-title">Order {order.orderNumber}</h1><p className="adm-page-sub">{new Date(order.createdAt).toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p></div></div>
<span className={`status-badge status-badge--${order.orderStatus}`} style={{fontSize:13,padding:'6px 14px'}}>{order.orderStatus}</span>
</div>
{!cancelled&&<div className="adm-card" style={{marginBottom:18}}><div className="adm-card-body"><div style={{display:'flex',alignItems:'center'}}>{STEPS.map((s,i)=><React.Fragment key={s}><div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6,flexShrink:0}}><div style={{width:36,height:36,borderRadius:'50%',border:`2px solid ${i<=stepIdx?'var(--gold)':'var(--g3)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,color:i<stepIdx?'var(--white)':i===stepIdx?'var(--gold)':'var(--g4)',background:i<stepIdx?'var(--gold)':'transparent',transition:'all .3s'}}>{i<stepIdx?<FiCheck size={14}/>:i+1}</div><span style={{fontSize:10,fontWeight:500,color:i<=stepIdx?'var(--black)':'var(--g4)',textTransform:'capitalize',letterSpacing:'.06em',whiteSpace:'nowrap'}}>{s}</span></div>{i<STEPS.length-1&&<div style={{flex:1,height:2,background:i<stepIdx?'var(--gold)':'var(--g2)',margin:'0 8px',marginBottom:24,transition:'background .3s'}}/>}</React.Fragment>)}</div></div></div>}
<div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:18}}>
<div style={{display:'flex',flexDirection:'column',gap:18}}>
<div className="adm-card"><div className="adm-card-hdr"><span className="adm-card-title"><FiPackage size={14} style={{verticalAlign:'middle',marginRight:6}}/>Items ({order.items?.length})</span></div>
{order.items?.map((item,i)=>(
<div key={i} style={{display:'flex',gap:14,padding:'14px 20px',borderBottom:'1px solid var(--adm-border)',alignItems:'center'}}>
<div style={{width:52,height:64,borderRadius:4,overflow:'hidden',background:'var(--g2)',flexShrink:0}}><img src={item.image} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
<div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{item.name}</div><div style={{fontSize:11,color:'var(--g4)',marginTop:3,display:'flex',gap:10}}>{item.size&&<span>Size: {item.size}</span>}{item.color&&<span>Color: {item.color}</span>}</div></div>
<div style={{textAlign:'right'}}><div style={{fontSize:11,color:'var(--g4)'}}>×{item.quantity}</div><div style={{fontWeight:700,fontSize:13}}>PKR {(item.price*item.quantity).toLocaleString()}</div></div>
</div>))}
<div style={{padding:'16px 20px',borderTop:'1px solid var(--adm-border)',display:'flex',flexDirection:'column',gap:7}}>
{[['Subtotal',order.subtotal],['Shipping',order.shippingCost],['Discount',-order.discount]].filter(([,v])=>v!==0).map(([l,v])=><div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--g5)'}}><span>{l}</span><span>{v<0?'- ':''}PKR {Math.abs(v)?.toLocaleString()}</span></div>)}
<div style={{display:'flex',justifyContent:'space-between',fontWeight:700,fontSize:16,paddingTop:10,borderTop:'1px solid var(--adm-border)'}}><span>Total</span><span>PKR {order.total?.toLocaleString()}</span></div>
</div></div>
{order.statusHistory?.length>0&&<div className="adm-card"><div className="adm-card-hdr"><span className="adm-card-title">Status History</span></div><div className="adm-card-body" style={{display:'flex',flexDirection:'column',gap:10}}>{order.statusHistory.map((h,i)=><div key={i} style={{display:'flex',gap:10}}><div style={{width:8,height:8,borderRadius:'50%',background:'var(--gold)',marginTop:5,flexShrink:0}}/><div><div style={{fontSize:12,fontWeight:600,textTransform:'capitalize'}}>{h.status}</div>{h.note&&<div style={{fontSize:11,color:'var(--g5)'}}>{h.note}</div>}<div style={{fontSize:11,color:'var(--g4)'}}>{new Date(h.updatedAt).toLocaleString('en-PK')}</div></div></div>)}</div></div>}
</div>
<div style={{display:'flex',flexDirection:'column',gap:16}}>
<div className="adm-card"><div className="adm-card-hdr"><span className="adm-card-title">Update Status</span></div><div className="adm-card-body" style={{display:'flex',flexDirection:'column',gap:12}}>
<div className="form-group"><label className="form-label">New Status</label><select className="form-select" defaultValue={order.orderStatus} onChange={e=>handleUpdate(e.target.value)} disabled={updating}>{['pending','confirmed','processing','shipped','delivered','cancelled','returned'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>
<div className="form-group"><label className="form-label">Tracking Number</label><input className="form-input" value={tracking} onChange={e=>setTracking(e.target.value)} placeholder="e.g. TCS-123456"/></div>
<div className="form-group"><label className="form-label">Note</label><input className="form-input" value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional note…"/></div>
</div></div>
<div className="adm-card"><div className="adm-card-hdr"><span className="adm-card-title"><FiUser size={13} style={{verticalAlign:'middle',marginRight:6}}/>Customer</span></div><div className="adm-card-body" style={{fontSize:13,display:'flex',flexDirection:'column',gap:5}}><strong style={{fontSize:15}}>{order.user?.name}</strong><span style={{color:'var(--g5)'}}>{order.user?.email}</span></div></div>
<div className="adm-card"><div className="adm-card-hdr"><span className="adm-card-title"><FiMapPin size={13} style={{verticalAlign:'middle',marginRight:6}}/>Shipping</span></div><div className="adm-card-body" style={{fontSize:13,lineHeight:1.8,color:'var(--g5)'}}><strong style={{color:'var(--adm-text)'}}>{order.shippingAddress?.name}</strong><div>{order.shippingAddress?.phone}</div><div>{order.shippingAddress?.street}</div><div>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</div></div></div>
<div className="adm-card"><div className="adm-card-hdr"><span className="adm-card-title"><FiCreditCard size={13} style={{verticalAlign:'middle',marginRight:6}}/>Payment</span></div><div className="adm-card-body" style={{display:'flex',flexDirection:'column',gap:8}}>
<div style={{display:'flex',justifyContent:'space-between',fontSize:13}}><span style={{color:'var(--g5)'}}>Method</span><span style={{fontWeight:600,textTransform:'uppercase'}}>{order.paymentMethod}</span></div>
<div style={{display:'flex',justifyContent:'space-between',fontSize:13}}><span style={{color:'var(--g5)'}}>Status</span><span className={`status-badge status-badge--${order.paymentStatus}`}>{order.paymentStatus}</span></div>
</div></div>
</div>
</div></div>);
}

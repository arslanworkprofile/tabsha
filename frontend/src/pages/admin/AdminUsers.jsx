import React,{useEffect,useState,useCallback}from'react';
import{FiSearch,FiTrash2,FiToggleLeft,FiToggleRight,FiShield}from'react-icons/fi';
import{getUsers,deleteUser,toggleUser}from'../../utils/api';
import toast from'react-hot-toast';
export default function AdminUsers(){
const[users,setUsers]=useState([]);const[total,setTotal]=useState(0);const[loading,setLoading]=useState(true);
const[page,setPage]=useState(1);const[pages,setPages]=useState(1);const[search,setSearch]=useState('');const[actionId,setActionId]=useState(null);
const fetch=useCallback(async()=>{setLoading(true);try{const{data}=await getUsers({page,limit:15,...(search&&{search})});setUsers(data.users||[]);setTotal(data.total||0);setPages(data.pages||1);}catch{toast.error('Failed');}finally{setLoading(false);};},[page,search]);
useEffect(()=>{fetch();},[fetch]);
const handleToggle=async(id,name,active)=>{setActionId(id);try{await toggleUser(id);toast.success(`${name} ${active?'deactivated':'activated'}`);fetch();}catch{toast.error('Failed');}finally{setActionId(null);};};
const handleDelete=async(id,name)=>{if(!window.confirm(`Delete user "${name}"?`))return;setActionId(id);try{await deleteUser(id);toast.success('User deleted');fetch();}catch(err){toast.error(err.response?.data?.message||'Failed');}finally{setActionId(null);};};
return(
<div>
<div className="adm-page-hdr"><div><h1 className="adm-page-title">Users</h1><p className="adm-page-sub">{total} registered users</p></div></div>
<div className="adm-card">
<div className="adm-card-hdr"><span className="adm-card-title">All Users</span>
<div className="input-icon-wrap" style={{width:260}}><FiSearch size={14} className="input-icon"/><input type="text" className="form-input input-with-icon" style={{fontSize:13,padding:'7px 12px 7px 34px'}} placeholder="Search by name or email…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/></div>
</div>
<div className="adm-tbl-wrap"><table className="adm-tbl"><thead><tr><th>User</th><th>Phone</th><th>Role</th><th>Joined</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
<tbody>{loading?[...Array(8)].map((_,i)=><tr key={i}>{[...Array(6)].map((_,j)=><td key={j}><div className="skeleton" style={{height:13}}/></td>)}</tr>):users.length===0?<tr><td colSpan={6} style={{textAlign:'center',padding:48,color:'var(--g4)'}}>No users found</td></tr>:users.map(u=>(
<tr key={u._id}>
<td><div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:34,height:34,borderRadius:'50%',background:u.role==='admin'?'var(--gold)':'var(--g2)',color:u.role==='admin'?'var(--black)':'var(--g5)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>{u.name?.charAt(0).toUpperCase()}</div><div><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{fontSize:11,color:'var(--g4)'}}>{u.email}</div></div></div></td>
<td style={{fontSize:13,color:'var(--adm-muted)'}}>{u.phone||'—'}</td>
<td><span className={`badge ${u.role==='admin'?'badge-gold':'badge-gray'}`} style={{display:'inline-flex',alignItems:'center',gap:4}}>{u.role==='admin'&&<FiShield size={9}/>}{u.role}</span></td>
<td style={{fontSize:12,color:'var(--adm-muted)'}}>{new Date(u.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'})}</td>
<td><span className={`status-badge status-badge--${u.isActive?'delivered':'cancelled'}`}>{u.isActive?'Active':'Inactive'}</span></td>
<td><div className="adm-tbl-actions">
{u.role!=='admin'?(<>
<button className="adm-tbl-btn" title={u.isActive?'Deactivate':'Activate'} style={{color:u.isActive?'var(--warn)':'var(--green)'}} onClick={()=>handleToggle(u._id,u.name,u.isActive)} disabled={actionId===u._id}>
{actionId===u._id?<span className="spinner" style={{width:12,height:12,borderWidth:2}}/>:u.isActive?<FiToggleRight size={15}/>:<FiToggleLeft size={15}/>}
</button>
<button className="adm-tbl-btn adm-tbl-btn--danger" title="Delete" onClick={()=>handleDelete(u._id,u.name)} disabled={actionId===u._id}><FiTrash2 size={13}/></button>
</>):<span style={{fontSize:11,color:'var(--g4)',padding:'0 8px'}}>Protected</span>}
</div></td>
</tr>))}</tbody></table></div>
{pages>1&&<div style={{padding:'14px 20px',borderTop:'1px solid var(--adm-border)',display:'flex',justifyContent:'flex-end'}}><div className="pagination" style={{marginTop:0}}>{[...Array(pages)].map((_,i)=><button key={i} className={`pagination__btn${page===i+1?' active':''}`} onClick={()=>setPage(i+1)}>{i+1}</button>)}</div></div>}
</div></div>);}

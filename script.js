const s=document.getElementById('service'),link=document.getElementById('linkBox'),user=document.getElementById('userBox'),profile=document.getElementById('profileBox'),target=document.getElementById('target'),uname=document.getElementById('user'),plink=document.getElementById('profile'),ql=document.getElementById('qlabel'),rate=document.getElementById('rateText'),qty=document.getElementById('qty'),total=document.getElementById('totalPrice');

const rates={
 'Instagram Like':{unit:100,price:5,label:'likes'},
 'Instagram Views':{unit:1000,price:4,label:'views'},
 'Instagram Followers':{unit:1000,price:150,label:'followers'}
};

function openOrder(x){s.value=x;updateForm();document.getElementById('order').scrollIntoView({behavior:'smooth'});}
function updateForm(){
 let x=s.value,r=rates[x];
 document.getElementById('hint').textContent='Ordering: '+x;
 rate.textContent='Price: ₹'+r.price+' per '+r.unit.toLocaleString()+' '+r.label;
 ql.textContent='Quantity of '+r.label.charAt(0).toUpperCase()+r.label.slice(1);
 if(x==='Instagram Followers'){
   link.classList.add('hide');user.classList.remove('hide');profile.classList.remove('hide');
   target.required=false;uname.required=true;plink.required=true;
 }else{
   link.classList.remove('hide');user.classList.add('hide');profile.classList.add('hide');
   target.required=true;uname.required=false;plink.required=false;
 }
 qty.value='';calculatePrice();
}
function calculatePrice(){
 let r=rates[s.value],q=parseInt(qty.value||0,10);
 let p=q*r.price/r.unit;
 total.textContent='₹'+(Math.round(p*100)/100).toFixed(2).replace(/\.00$/,'');
}
function placeOrder(e){
 e.preventDefault();
 let r=rates[s.value],q=parseInt(qty.value||0,10),p=q*r.price/r.unit;
 let id='GM'+Date.now().toString().slice(-8),box=document.getElementById('result');
 box.style.display='block';
 box.innerHTML='<b>Order Submitted (Demo)</b><br>Order ID: <b>'+id+'</b><br>Service: '+s.value+'<br>Quantity: '+q.toLocaleString()+'<br>Total Price: <b>₹'+p.toFixed(2)+'</b><br><small>Live order processing needs a backend/API.</small>';
}
function checkOrder(){
 let id=document.getElementById('oid').value.trim(),r=document.getElementById('status');
 r.style.display='block';r.textContent=id?'Demo status for Order '+id+'. Connect a backend for live status.':'Please enter an Order ID.';
}
updateForm();

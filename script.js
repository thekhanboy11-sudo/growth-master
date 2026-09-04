const s=document.getElementById('service');
const linkBox=document.getElementById('linkBox');
const userBox=document.getElementById('userBox');
const profileBox=document.getElementById('profileBox');
const target=document.getElementById('target');
const uname=document.getElementById('user');
const plink=document.getElementById('profile');
const ql=document.getElementById('qlabel');
const rate=document.getElementById('rateText');
const qty=document.getElementById('qty');
const total=document.getElementById('totalPrice');
const paymentBox=document.getElementById('paymentBox');

const rates={
  'Instagram Like':{unit:100,price:5,label:'likes'},
  'Instagram Views':{unit:1000,price:4,label:'views'},
  'Instagram Followers':{unit:1000,price:150,label:'followers'}
};

let pendingOrder=null;

function openOrder(x){
  s.value=x;
  updateForm();
  document.getElementById('order').scrollIntoView({behavior:'smooth'});
}

function updateForm(){
  const x=s.value,r=rates[x];
  document.getElementById('hint').textContent='Ordering: '+x;
  rate.textContent='Price: ₹'+r.price+' per '+r.unit.toLocaleString()+' '+r.label;
  ql.textContent='Quantity of '+r.label.charAt(0).toUpperCase()+r.label.slice(1);

  if(x==='Instagram Followers'){
    linkBox.classList.add('hide');
    userBox.classList.remove('hide');
    profileBox.classList.remove('hide');
    target.required=false;
    uname.required=true;
    plink.required=true;
  }else{
    linkBox.classList.remove('hide');
    userBox.classList.add('hide');
    profileBox.classList.add('hide');
    target.required=true;
    uname.required=false;
    plink.required=false;
  }

  qty.value='';
  paymentBox.classList.add('hide');
  document.getElementById('result').innerHTML='';
  calculatePrice();
}

function calculatePrice(){
  const r=rates[s.value],q=parseInt(qty.value||0,10);
  const p=q*r.price/r.unit;
  total.textContent='₹'+(Math.round(p*100)/100).toFixed(2).replace(/\.00$/,'');
}

function makeOrderId(){
  return 'GM'+Date.now().toString().slice(-8);
}

function placeOrder(e){
  e.preventDefault();

  const r=rates[s.value];
  const q=parseInt(qty.value||0,10);
  if(!q || q<1){alert('Please enter a valid quantity.');return;}

  const price=q*r.price/r.unit;
  const order={
    id:makeOrderId(),
    service:s.value,
    quantity:q,
    amount:price,
    target:s.value==='Instagram Followers'?'':target.value.trim(),
    username:s.value==='Instagram Followers'?uname.value.trim():'',
    profile:s.value==='Instagram Followers'?plink.value.trim():'',
    transactionId:'',
    status:'Payment Pending'
  };

  pendingOrder=order;
  document.getElementById('payAmount').textContent='₹'+price.toFixed(2);
  paymentBox.classList.remove('hide');
  paymentBox.scrollIntoView({behavior:'smooth',block:'start'});
}

function confirmPayment(){
  if(!pendingOrder){return;}

  const tx=document.getElementById('transactionId').value.trim();
  if(!tx){
    alert('Please enter your PhonePe Transaction ID / UTR.');
    return;
  }

  pendingOrder.transactionId=tx;
  pendingOrder.status='Processing';

  localStorage.setItem('gm_order_'+pendingOrder.id,JSON.stringify(pendingOrder));
  localStorage.setItem('gm_last_order',JSON.stringify(pendingOrder));

  showProcessing(pendingOrder);
}

function safe(v){
  return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showProcessing(o){
  const targetRow=o.target
    ? '<div><b>Reel/Post Link:</b> '+safe(o.target)+'</div>'
    : '';
  const profileRow=o.profile
    ? '<div><b>Instagram ID / Profile Link:</b> '+safe(o.profile)+'</div>'
    : '';
  const userRow=o.username
    ? '<div><b>Instagram Username:</b> '+safe(o.username)+'</div>'
    : '';

  document.getElementById('result').innerHTML=
    '<div class="success">'+
      '<h3>✅ Your Order is Processing</h3>'+
      '<div class="details">'+
        '<div><b>Order ID:</b> '+safe(o.id)+'</div>'+
        '<div><b>Service:</b> '+safe(o.service)+'</div>'+
        '<div><b>Quantity:</b> '+o.quantity.toLocaleString()+'</div>'+
        '<div><b>Amount:</b> ₹'+o.amount.toFixed(2)+'</div>'+
        targetRow+userRow+profileRow+
        '<div><b>Transaction ID / UTR:</b> '+safe(o.transactionId)+'</div>'+
        '<div><b>Status:</b> 🟡 Processing</div>'+
      '</div>'+
    '</div>';

  paymentBox.classList.add('hide');
  document.getElementById('result').scrollIntoView({behavior:'smooth',block:'start'});
}

function checkOrder(){
  const id=document.getElementById('oid').value.trim();
  const r=document.getElementById('status');

  if(!id){
    r.textContent='Please enter an Order ID.';
    return;
  }

  const saved=localStorage.getItem('gm_order_'+id);
  if(saved){
    const o=JSON.parse(saved);
    r.innerHTML='🟡 <b>Processing</b><br>Service: '+safe(o.service)+
      '<br>Quantity: '+o.quantity.toLocaleString()+
      '<br>Amount: ₹'+o.amount.toFixed(2)+
      (o.target?'<br>Reel/Post Link: '+safe(o.target):'')+
      (o.profile?'<br>Instagram ID / Profile Link: '+safe(o.profile):'')+
      (o.username?'<br>Instagram Username: '+safe(o.username):'')+
      '<br>Transaction ID: '+safe(o.transactionId);
  }else{
    r.textContent='Order not found on this device. Live order status needs a backend/database.';
  }
}

updateForm();

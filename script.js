function openService(service){
  document.getElementById("modalTitle").textContent = service;
  document.getElementById("modalText").textContent =
    service + " selected. Please connect your real order system or contact support to place an order.";
  document.getElementById("modal").style.display = "flex";
}
function closeModal(){document.getElementById("modal").style.display="none";}
window.addEventListener("click",e=>{if(e.target.id==="modal")closeModal();});

function checkOrder(){
  const id=document.getElementById("orderId").value.trim();
  const box=document.getElementById("status");
  if(!id){
    box.style.display="block";
    box.textContent="Please enter an Order ID.";
    return;
  }
  box.style.display="block";
  box.textContent="Demo mode: Order ID "+id+" received. Connect your backend/API to show live status.";
}

function downloadAPK(){
  // Put your APK file in this website folder with the name growth-master.apk
  window.location.href="growth-master.apk";
}

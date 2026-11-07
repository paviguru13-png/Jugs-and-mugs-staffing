self.addEventListener('push',event=>{
 let data={title:'Jugs & Mugs Staff Hub',body:'You have a new captain notification.',url:'./'};
 try{if(event.data)data={...data,...event.data.json()}}catch{}
 event.waitUntil(self.registration.showNotification(data.title||'Jugs & Mugs Staff Hub',{
  body:data.body||'',icon:'./icon.svg',badge:'./icon.svg',data:{url:data.url||'./'},tag:'jm-staff-hub'
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();const target=new URL(event.notification.data?.url||'./',self.location.href).href;
 event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
  for(const client of list){if('focus'in client)return client.navigate(target).then(c=>c?.focus())}
  return clients.openWindow(target);
 }));
});
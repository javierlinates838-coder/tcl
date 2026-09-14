const toggle=document.querySelector('.menu-toggle');
const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';navigation.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
document.querySelector('#year').textContent=String(new Date().getFullYear());

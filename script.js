const config = window.POKER_OSASCO;
document.querySelectorAll('.whatsapp').forEach(link => {
  const message = link.classList.contains('location-link') ? config.locationMessage : config.message;
  link.href = 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(message);
});
if(config.address){
  document.querySelector('#address-text').textContent = config.address;
  document.querySelector('#address-note').textContent = 'Venha conhecer nossa casa.';
  const directions = document.querySelector('#directions');
  directions.href = config.mapsUrl || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(config.address);
  directions.textContent = 'Traçar rota ↗';
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
  }), {threshold:0.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
let scheduled = false;
function updateProgress(){
  const range = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.scroll-progress').style.width = (range > 0 ? window.scrollY / range * 100 : 0) + '%';
  scheduled = false;
}
window.addEventListener('scroll', () => {if(!scheduled){scheduled = true;requestAnimationFrame(updateProgress);}}, {passive:true});
window.addEventListener('resize',updateProgress);
updateProgress();
const gallery = document.querySelector('#gallery');
const dialog = document.querySelector('#lightbox');
// Keep the original photos in HTML; enhance the mobile carousel only.
if (gallery && gallery.querySelectorAll('figure').length) {
  const slides = [...gallery.querySelectorAll('figure')];
  const controls = document.querySelector('.gallery-controls');
  const previous = document.querySelector('#prev-photo'), next = document.querySelector('#next-photo');
  const step = () => slides[0].getBoundingClientRect().width + 20;
  const updateGallery = () => {
    const overflow = gallery.scrollWidth > gallery.clientWidth + 2;
    controls.hidden = !overflow;
    const index = Math.min(slides.length - 1, Math.round(gallery.scrollLeft / step()));
    document.querySelector('#photo-number').textContent = String(index + 1).padStart(2, '0');
    previous.disabled = gallery.scrollLeft <= 2;
    next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
  };
  const move = direction => gallery.scrollBy({left:direction * step(),behavior:reducedMotion?'instant':'smooth'});
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  gallery.addEventListener('keydown', event => {
    if (event.target !== gallery) return;
    if(event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  gallery.addEventListener('scroll', updateGallery, {passive:true});
  window.addEventListener('resize', updateGallery);
  updateGallery();
}
document.querySelector('.close-lightbox').addEventListener('click', () => dialog.close());
dialog.addEventListener('click',event => {if(event.target === dialog)dialog.close();});
// Photos are present in the HTML; JavaScript only enhances enlargement.
document.querySelectorAll('#champion-list .champion-photo, .venue-photo').forEach(link => {
  link.addEventListener('click', event => {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    const image = link.querySelector('img');
    dialog.querySelector('img').src = image.src;
    dialog.querySelector('img').alt = image.alt;
    dialog.querySelector('p').textContent = link.dataset.caption;
    dialog.showModal();
  });
});

// Keep a single prominent invitation visible on mobile, without stacking CTAs.
const stickyInvitation = document.querySelector('.mobile-cta');
const inlineInvitations = [...document.querySelectorAll('.button.gold.whatsapp')];
if(stickyInvitation && 'IntersectionObserver' in window){
  const visibleInvitations = new Set();
  const invitationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) visibleInvitations.add(entry.target);
      else visibleInvitations.delete(entry.target);
    });
    stickyInvitation.classList.toggle('cta-resting', visibleInvitations.size > 0);
  }, {threshold:0.5});
  inlineInvitations.forEach(button => invitationObserver.observe(button));
}

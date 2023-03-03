export function operateDocClass(target='html', type='add', className = ''){
  const htmlDom = document.querySelector(target);
  htmlDom.classList[type](className)
}
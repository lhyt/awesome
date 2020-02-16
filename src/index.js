import me from './lib/magic-engine';
import loadingJs from './components/loading';
import header from './components/header';

me();
header();

function init() {
  const secondLoaded = sessionStorage.getItem('SECOND_FLAG');
  const container = document.querySelector('.lhyt-main-container');
  if (!container) {
    return true;
  }
  if (false) {
    container.style.display = 'block';
    window.SECOND_FLAG = true;
  } else {
    sessionStorage.setItem('SECOND_FLAG', '1');
    container.style.display = 'none';
  }
  window.handleClickGoInLoading = () => {
    const loading = document.querySelector('.lhyt-loading-container');
    loading.parentNode.removeChild(loading);
    container.style.display = 'block';
  };
}

// 一些dom还没ok，轮询到有再执行
function epollExec(fn) {
  if (fn()) {
    setTimeout(fn, 300);
  }
}

setTimeout(() => {
  epollExec(init);
  epollExec(loadingJs);
});

export default me;

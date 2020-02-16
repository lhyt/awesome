export default () => {
  const container = document.querySelector('.lhyt-loading-container');
  console.log(container, 'container');
  if (!container) {
    return true;
  }
  if (window.SECOND_FLAG) {
    container.parentNode.removeChild(container);
    return;
  }
  container.style.display = 'block';
  function animation(e) {
    return new Promise(r => {
      e.classList.add('loading-active-txt');
      setTimeout(() => {
        r();
      }, 1500);
    });
  }
  setTimeout(() => {
    let promise = Promise.resolve();
    document.querySelectorAll('.lhyt-loading-txt-container p').forEach(e => {
      promise = promise.then(() => animation(e));
    });
    promise.finally(() => {
      const btns = document.querySelectorAll('.lhyt-loading-button');
      btns.forEach(btn => {
        btn.style.display = 'inline-block';
      });
      btns[0].onclick = window.handleClickGoInLoading;
      btns[1].onclick = () => window.open('/articles', '_blank');
    });
  }, 500);
};

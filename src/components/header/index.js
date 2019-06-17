module.exports = function (doc = document) {
  const handleClickNav = [
    () => {
      window.location.href = 'https://www.github.com/lhyt';
    },
    () => {
      window.location.href = '/src/houdini/';
    },
    () => {
      window.location.href = '/articles';
    },
  ]
  
  const navs = doc.querySelectorAll('.lhyt-main-container-header__nav div');
  [...navs].forEach((nav, i) => {
    nav.addEventListener('click', e => {
      handleClickNav[i]();
    })
  });
}

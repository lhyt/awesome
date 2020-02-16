export default function(doc = document) {
  const handleClickNav = [
    () => {
      window.open('https://www.github.com/lhyt', '_blank');
    },
    () => {
      window.open('/src/houdini/', '_blank');
    },
    () => {
      window.open('/articles', '_blank');
      // window.location.href = '/articles';
    },
  ];

  setTimeout(() => {
    const navs = doc.querySelectorAll('.lhyt-main-container-header__nav div');
    [...navs].forEach((nav, i) => {
      nav.addEventListener('click', () => {
        handleClickNav[i]();
      });
    });
  }, 300);
}

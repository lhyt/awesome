const TEXT_NODE_TYPE = 3;
const { querySelector, createTextNode } = new Proxy(document, {
  get(target, name) {
    return Reflect.get(target, name).bind(target);
  },
});

function E() {
  travelBody();
}

function travelBody(body = document.body) {
  if (!body) {
    return;
  }
  const { childNodes = [] } = body;
  childNodes.forEach(childNode => {
    if (childNode.nodeType === TEXT_NODE_TYPE) {
      if (/\$\$(.*)\$\$/g.test(childNode.data)) {
        // case: <div>$$a$$$$b$$</div>
        const temp = [];
        childNode.data.replace(/\$\$(.*)\$\$/g, (_, match) => {
          // $$header$$ => header.html.body.childNodes
          temp.unshift(match);
        });
        let promiseCount = 0;
        temp.forEach(m => {
          chooseElements(m).then(r => {
            promiseCount++;
            const { document: doc, childNodes: children, pathname } = r;
            const innerDocumentEles = children;
            [...innerDocumentEles].reduceRight((_, ele) => {
              insertEle(ele, childNode);
            });
            if (promiseCount === temp.length) {
              body.removeChild(childNode);
            }
          });
        });
      }
      return;
    }
    if (childNode.childNodes) {
      travelBody(childNode);
    }
  });
}

// no support link import
function fallbackLinkImport(link = document.createElement('link')) {
  const { href } = link;
  return fetch(href).then(r => {
    return r.text().then(html => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return {
        childNodes: div.childNodes,
      };
    });
  });
}

function chooseElements(name) {
  // document object in html import
  const link = querySelector(`link[data-import="${name}"]`);
  const $document = link.import;
  if ($document) {
    return Promise.resolve({
      document: $document,
      childNodes: $document.body.cloneNode(true).childNodes,
      pathname: new URL(link.href).pathname,
    });
  }
  const html = fallbackLinkImport(link);
  console.log(html);
  return html;
}

function replaceEle(ele, target) {
  const { parentNode } = ele;
  let newNode = target;
  if (typeof target === 'string') {
    const txt = createTextNode(target);
    newNode = txt;
    parentNode.appendChild(newNode);
  }
  parentNode.replaceChild(newNode, ele);
}

function insertEle(ele, target) {
  const { parentNode } = target;
  if (parentNode.lastChild === target) {
    parentNode.appendChild(ele);
  } else {
    parentNode.insertBefore(ele, target.nextSibling);
  }
}

/**
 * index.html pathname => index.js pathname
 * @param {string} pathname
 * @returns {string} requireJs pathname
 */
function pathNameToRequire(pathname) {
  return pathname.replace(/\.html$/, '.js');
}

export default E;

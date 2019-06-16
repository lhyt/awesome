const TEXT_NODE_TYPE = 3;
const {
  querySelector,
  createTextNode,
} = new Proxy(document, {
  get(target, name) {
    return Reflect.get(target, name).bind(target);
  }
});

function E() {
  travelBody();
}

function travelBody(body = document.body) {
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
        temp.forEach(m => {
          const innerDocumentEles = chooseElements(m);
          [...innerDocumentEles].reduceRight((_, ele) => {
            insertEle(ele, childNode);
          });
        })
        setTimeout(() => {
          body.removeChild(childNode);
        });
      }
      return;
    }
    if (childNode.childNodes) {
      travelBody(childNode);
    }
  })
}

function chooseElements(name) {
  const { body } = querySelector(`link[data-import="${name}"]`).import;
  return body.cloneNode(true).childNodes;
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

module.exports = E;
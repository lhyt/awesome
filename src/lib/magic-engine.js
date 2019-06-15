const TEXT_NODE_TYPE = 3;

function E() {
  travelBody();
}

function travelBody(body = document.body) {
  const { childNodes = [] } = body;
  childNodes.forEach(childNode => {
    if (childNode.nodeType === TEXT_NODE_TYPE) {
      if (/\$\$(.*)\$\$/.test(childNode.data)) {
        const innerDocument = chooseElements(RegExp.$1);
        console.log(RegExp.$1, innerDocument);
      }
      return;
    }
    if (childNode.childNodes) {
      travelBody(childNode);
    }
  })
}

function chooseElements(name) {
  return document.querySelector(`link[data-import="${name}"]`).import.body;
}

module.exports = E;
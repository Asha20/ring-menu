(function main() {
  function esm({ raw }, ...vals) {
    return import(
      URL.createObjectURL(
        new Blob([String.raw({ raw }, ...vals)], { type: "text/javascript" }),
      )
    );
  }

  function deindent(text) {
    const firstIndentRegex = /^[\r\t\f\v ]+/m;
    const indentMatch = text.match(firstIndentRegex) || [""];
    const indentAmount = indentMatch[0].length;
    return text
      .split("\n")
      .map(x => x.slice(indentAmount))
      .join("\n")
      .trim();
  }

  async function renderExample(root, code) {
    const { el } = await esm`
      function _render() {}
      ${code}
      export { el };
    `;
    qs(".example__result", root).appendChild(el);
  }

  const qs = (sel, node = document) => node.querySelector(sel);
  const qsa = (sel, node = document) => [...node.querySelectorAll(sel)];

  const examples = qsa(".example");

  const deindented = new Set();
  Prism.hooks.add("before-highlight", env => {
    if (deindented.has(env.element)) {
      return;
    }
    deindented.add(env.element);
    env.code = deindent(env.code);
  });

  examples.forEach(el => {
    const codeEl = qs(".example__code", el);
    renderExample(el, codeEl.textContent);
  });
})();

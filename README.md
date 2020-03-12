# `ring-menu`

Create interactive and responsive ring-shaped SVG menus with ease.

[Showcase website and documentation](https://asha20.github.io/ring-menu)

## Installation

For direct use in the browser with a `<script>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/ring-menu/dist/ring-menu.js"></script>
```

You can now use the `RM` global variable like so:

```js
const menu = RM.menu([
  RM.circle("Foo"),
]);

const {el} = RM.build(menu);
```

ES6 module version for use with code bundlers:

```
npm install ring-menu
```

You can now import the module like so:

```js
import * as RM from "ring-menu/es6/ring-menu";

const menu = RM.menu([
  RM.circle("Foo"),
]);

const {el} = RM.build(menu);
```

## License

MIT; see the [LICENSE](LICENSE) file.
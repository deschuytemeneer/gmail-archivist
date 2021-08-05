var globals = {};
(function (globalThis) {
  const COMPUTED_NAME = 'computedName';
  globalThis[COMPUTED_NAME] = () => {};
})(globals);

(function (existingVar, globalThis) {
  console.log(existingVar);
  globalThis.test = () => {};
})({}, globals);

function computedName() {
  return globals["computedName"].call(null, arguments);
}

function test() {
  return globals["test"].call(null, arguments);
}

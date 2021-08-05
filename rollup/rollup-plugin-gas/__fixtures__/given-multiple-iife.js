(function () {
  const COMPUTED_NAME = 'computedName';
  globalThis[COMPUTED_NAME] = () => {};
})();

(function (existingVar) {
  console.log(existingVar);
  globalThis.test = () => {};
})({});

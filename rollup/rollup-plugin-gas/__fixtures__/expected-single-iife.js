var globals = {};
(function (globalThis) {
  globalThis.test = () => {
    Logger.log('hello, world!');
  };
}(globals));

function test() {
  return globals["test"].call(null, arguments);
}

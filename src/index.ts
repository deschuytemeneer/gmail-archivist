const greeter = (person: string) => {
  return `Hello, ${person}!`;
};

globalThis.helloWorld = () => {
  Logger.log(greeter('world'));
}

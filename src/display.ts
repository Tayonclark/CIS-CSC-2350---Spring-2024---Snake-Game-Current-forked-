const display = (...items: any[]) => {
  Array.prototype.forEach.call(items, (item: any) => {
    if (item instanceof Array) {
      item =
        "[ " +
        item
          .map((a: any) => {
            if (typeof a === "string") {
              return "'" + a.replace("'", "\\'") + "'";
            } else {
              return a;
            }
          })
          .reduce((acc: string, a: string) => {
            return acc + ", " + a;
          }) +
        " ]";
    }
    document
      .getElementById("output")!
      .appendChild(document.createTextNode(item));
    document
      .getElementById("output")!
      .appendChild(document.createTextNode(" "));
  });
  document.getElementById("output")!.appendChild(document.createTextNode("\n"));
};

export default display;

export function operateDocClass(target = "html", type = "add", className = "") {
  const htmlDom = document.querySelector(target);
  htmlDom.classList[type](className);
}

export function loadJs(src) {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement("script");
      const head = document.getElementsByTagName("head")[0];
      script.src = src;
      head.appendChild(script);
      script.onload = script.onreadystatechange = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
          resolve();
        } else {
          reject("load err");
        }
      };
    } catch (err) {
      reject(err);
    }
  });
}

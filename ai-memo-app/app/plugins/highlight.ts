export default defineNuxtPlugin(() => {
  if (process.client) {
    // highlight.jsをグローバルで利用可能にする
    import("highlight.js").then((hljs) => {
      (window as any).hljs = hljs.default;
    });
  }
});

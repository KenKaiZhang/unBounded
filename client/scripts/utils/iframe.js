export function setiFrameHeight(iframeId) {
  const targetiFrame = document.querySelector(iframeId);
  targetiFrame.addEventListener("load", () => {
    targetiFrame.style.height =
      targetiFrame.contentWindow.document.body.offsetHeight + "px";
  });
}

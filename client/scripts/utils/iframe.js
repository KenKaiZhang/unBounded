export function setiFrameHeight(iframeId) {
  const targetiFrame = document.querySelector(iframeId);
  console.log(targetiFrame.contentWindow.document.body.offsetHeight);
  targetiFrame.addEventListener("load", () => {
    targetiFrame.style.height =
      targetiFrame.contentWindow.document.body.offsetHeight + "px";
  });
}

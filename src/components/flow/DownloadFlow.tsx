import { useEffect } from "react";
import { toPng } from "html-to-image";
import { useReactFlow } from "@xyflow/react";
import { Button } from "../ui/button";
import { ImageDown } from "lucide-react";

export default function DownloadFlow() {
  const { getNodes, getNodesBounds } = useReactFlow();

  useEffect(() => {}, [getNodes]);

  function handleActualDownload() {
    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.width;
    const imageHeight = nodesBounds.height;

    const translateX = 60 - nodesBounds.x * 2;
    const translateY = 60 - nodesBounds.y * 2;

    const el = document.querySelector(".react-flow__viewport") as HTMLElement;
    el.classList.add("print");
    el.style.setProperty("--translate-x", `${translateX}px`);
    el.style.setProperty("--translate-y", `${translateY}px`);

    toPng(el, {
      width: imageWidth * 2 + 108,
      height: imageHeight * 2 + 120,
      style: {
        width: String(imageWidth * 2),
        height: String(imageHeight * 2),
        backgroundColor: "var(--background)",
        backgroundImage: "radial-gradient(#91919a 0.5px, transparent 0)",
        backgroundSize: "24px 24px",
        backgroundPosition: "12px 12px",
        transform: `translate(${translateX * -1}px, ${translateY * -1}px) scale(2)`,
      },
    }).then((dataUrl) => {
      downloadImage(dataUrl);
      el.classList.remove("print");
      el.style.removeProperty("--translate-x");
      el.style.removeProperty("--translate-y");
    });
  }

  return (
    <Button className="my-2" variant="outline" onClick={handleActualDownload}>
      <ImageDown />
      Download as .png
    </Button>
  );
}

function downloadImage(dataUrl: string) {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const timeStr = `${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes(),
  ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  const fileName = `flos_${dateStr}_${timeStr}.png`;

  const a = document.createElement("a");
  a.setAttribute("download", fileName);
  a.setAttribute("href", dataUrl);
  a.click();
}

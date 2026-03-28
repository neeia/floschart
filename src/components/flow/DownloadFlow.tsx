import { useEffect } from "react";
import { toPng } from "html-to-image";
import {
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "../ui/button";
import { ImageDown } from "lucide-react";

export default function DownloadFlow() {
  const { getNodes } = useReactFlow();

  useEffect(() => {}, [getNodes]);

  function handleActualDownload() {
    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = nodesBounds.width;
    const imageHeight = nodesBounds.height;
    const transform = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.25,
      4,
      0,
    );

    const el = document.querySelector(".react-flow__viewport") as HTMLElement;

    toPng(el, {
      width: imageWidth * 2 + 108,
      height: imageHeight * 2 + 120,
      style: {
        width: String(imageWidth * 2),
        height: String(imageHeight * 2),
        transform: `translate(${60 + transform.x * 2}px, ${60 + transform.y * 2}px) scale(${transform.zoom * 2})`,
        backgroundColor: "var(--background)",
        backgroundImage: "radial-gradient(#91919a 1px, transparent 0)",
        backgroundSize: "24px 24px",
        backgroundPosition: "12.5px 12.5px",
      },
    }).then((dataUrl) => {
      downloadImage(dataUrl);
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

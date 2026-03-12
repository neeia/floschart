import { Button } from "@/components/ui/button";
import Autosize from "../edit/Autosize";
import { AppState } from "@/store/types";
import useStore from "@/store/store";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edge } from "@xyflow/react";
import Node from "@/types/node";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  getId: state.getId,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
});
interface Props {}
export default function SettingsData(props: Props) {
  const { nodes, edges, getId, setNodes, setEdges } = useStore(
    useShallow(selector),
  );

  const [reOpen, setReOpen] = useState(false);
  const [deOpen, setDeOpen] = useState(false);
  const [data, setData] = useState("");
  async function compress() {
    setDeOpen(false);
    const json = JSON.stringify(nodes);
    const stream = new Blob([json])
      .stream()
      .pipeThrough(new CompressionStream("gzip"));
    const buffer = await new Response(stream).arrayBuffer();
    setData(btoa(String.fromCharCode(...new Uint8Array(buffer))));
  }

  async function decompress() {
    const binary = atob(data);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const stream = new Blob([bytes])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    const text = await new Response(stream).text();
    const importedNodes = JSON.parse(text) as Node[];
    const _nodes: Node[] = [];
    const _edges: Edge[] = [];

    const idMapping: Record<string, string> = {};
    importedNodes
      .map((n) => {
        const id = getId().toString();
        idMapping[n.id] = id;
        return { ...n, selected: true, id };
      })
      .forEach((n) => {
        const incoming = Object.fromEntries(
          Object.entries(n.data.incoming).map(([id, b]) => [idMapping[id], b]),
        );
        const outgoing = Object.fromEntries(
          Object.entries(n.data.outgoing).map(([id, b]) => [idMapping[id], b]),
        );
        _nodes.push({
          ...n,
          selected: true,
          data: { ...n.data, incoming, outgoing },
        } as Node);

        // iterate through each outgoing edge and add to edge list
        Object.keys(outgoing).forEach((id) =>
          _edges.push({
            id: `xy-edge__${n.id}-${id}`,
            source: n.id,
            target: id,
            selected: true,
          }),
        );
      });

    _nodes.unshift(...nodes.map((n) => ({ ...n, selected: false })));
    _edges.unshift(...edges.map((e) => ({ ...e, selected: false })));
    setNodes(_nodes);
    setEdges(_edges);
    setDeOpen(false);
    toast.success(
      `Imported ${_nodes.length} nodes and ${_edges.length} edges.`,
    );
  }

  function download() {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(data),
    );
    element.setAttribute("download", "chart.flos");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  const [file, setFile] = useState<File>();
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setData((e.target?.result ?? "") as string);
    reader.readAsText(file);
  }, [file]);

  const [copied, setCopied] = useState(false);

  return (
    <div className="p-2">
      <h2>Data</h2>
      <div className="flex mt-2 gap-2">
        <Dialog
          open={deOpen}
          onOpenChange={(o) => {
            setDeOpen(o);
            setFile(undefined);
          }}
        >
          <DialogTrigger
            onClick={() => {
              setData("");
            }}
            className="border rounded-lg p-4 pb-2 flex flex-col gap-1 items-center w-full"
          >
            <Download className="size-8" />
            Import
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Import</DialogTitle>
            <Autosize
              className="max-h-[50vh] min-h-20 no-scrollbar text-xs!"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />
            <DialogFooter className="flex justify-between gap-4">
              <Label
                className="w-fit text-nowrap cursor-pointer"
                htmlFor="import-file-input"
              >
                {file ? (
                  <span>
                    Selected: <span className="font-normal">{file.name}</span>
                  </span>
                ) : (
                  "Import from .flos file"
                )}
              </Label>
              <Input
                className="opacity-0"
                type="file"
                id="import-file-input"
                accept=".flos"
                onInput={(e) => {
                  const file = (e.target as HTMLInputElement).files![0];
                  setFile(file);
                }}
              />
              <Button variant="accent" onClick={decompress}>
                Import Nodes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={reOpen} onOpenChange={setReOpen}>
          <DialogTrigger
            onClick={compress}
            className="border rounded-lg p-4 pb-2 flex flex-col gap-1 items-center w-full"
          >
            <Upload className="size-8" />
            Export
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>
              Export your data into a file that can be imported by other users.
            </DialogDescription>
            <Textarea
              value={data}
              className="resize-none max-h-[50vh] no-scrollbar text-xs!"
              readOnly
            />
            <DialogFooter>
              <Button
                variant="shine"
                onClick={() => {
                  setCopied(false);
                  navigator.clipboard
                    .writeText(data)
                    .then(() => setCopied(true));
                }}
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </Button>
              <Button variant="accent" onClick={download}>
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

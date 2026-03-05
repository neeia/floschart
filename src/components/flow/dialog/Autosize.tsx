import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface Props extends React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> {
  value: string;
}
export default function Autosize(props: Props) {
  const { className, ...rest } = props;
  const textEl = useRef<HTMLTextAreaElement>(null);

  const [readonly, setReadonly] = useState(true);

  function fit() {
    if (!textEl.current) return;
    textEl.current.style.height = ""; // reset height for accurate scrollHeight
    textEl.current.style.height = `${textEl.current.scrollHeight + 2}px`;
  }
  function onFocus() {
    if (!textEl.current) return;
    setReadonly(false);
    fit();
  }
  function onBlur() {
    if (!textEl.current) return;
    setReadonly(true);
  }

  useEffect(fit, []);

  return (
    <Textarea
      readOnly={readonly}
      ref={textEl}
      onInput={fit}
      onFocus={onFocus}
      onBlur={onBlur}
      className={clsx(
        "min-h-6 autosize resize-none rounded-xs hover:bg-secondary focus:bg-sidebar",
        className,
      )}
      {...rest}
    />
  );
}

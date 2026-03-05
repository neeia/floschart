import { useEffect, useState } from "react";
import { Input } from "./input";
import clamp from "@/util/clamp";

interface Props extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}
export default function NumericInput(props: Props) {
  const { value, min = 0, max = 2147483647, onChange, ..._props } = props;

  const [field, setField] = useState<string>(value.toString());

  function update(n: number) {
    const clampedValue = clamp(min, n, max);
    onChange(clampedValue);
    setField(clampedValue.toString());
  }

  useEffect(() => {
    if (value.toString() !== field) setField(value.toString());
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        update(value + 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        update(value - 1);
        break;
      default:
        return;
    }
  }

  return (
    <Input
      value={field}
      inputMode="numeric"
      pattern="[0-9]*"
      onChange={(e) =>
        e.target.value === "" ? setField("") : update(+e.target.value)
      }
      onBlur={() => setField(value.toString())}
      onKeyDown={handleKeyDown}
      {..._props}
    />
  );
}

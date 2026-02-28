import { useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface Props {
  onSubmit: (query: string) => void;
}
export default function NodeForm(props: Props) {
  const [query, setQuery] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSubmit(query);
  };
  return (
    <Field>
      <FieldLabel>Search Wiki</FieldLabel>
      <Input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
      />
      <Button onClick={handleSubmit}>Add</Button>
    </Field>
  );
}

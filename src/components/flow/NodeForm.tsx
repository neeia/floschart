import { useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Item } from "../ui/item";
import Skill from "@/types/data/skill";

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
      <Item>Firemaking</Item>
      <Separator />
      {Object.entries(Skill).map(([label, value]) => (
        <div>{label}</div>
      ))}
      <Separator />
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

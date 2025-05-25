import { Input, InputElement, InputGroup, Kbd } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

export const Search = () => (
  <form onSubmit={() => {}}>
    <InputGroup flex="1" startElement={<LuSearch color="gray.100" />}>
      <Input placeholder="Search" />
    </InputGroup>
  </form>
);

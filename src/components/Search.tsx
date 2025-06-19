import { Input, InputElement, InputGroup, Kbd } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { LuSearch } from "react-icons/lu";

export const Search = ({
  keyWord,
  setKeyWord,
}: {
  keyWord: string;
  setKeyWord: (keyWord: string) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && keyWord !== "") {
      ref.current.focus();
    }
  }, []);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ref.current) setKeyWord(ref.current.value);
      }}
    >
      <InputGroup flex="1" startElement={<LuSearch color="gray.100" />}>
        <Input
          // autoFocus={true}
          ref={ref}
          placeholder="Search"
          defaultValue={keyWord}
          onChange={(e) => setKeyWord(e.target.value)}
          className="border-color"
        />
      </InputGroup>
    </form>
  );
};

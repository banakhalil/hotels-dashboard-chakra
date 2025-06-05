import { SelectedPage } from "@/shared/types";
import type { ReactNode } from "react";


type Props = {
  children: ReactNode;
  id: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
};

const PageSection = ({ children, id, setSelectedPage }: Props) => {
  return (
    <section
      id={id}
      className="min-h-screen py-6"
      onMouseEnter={() => setSelectedPage(id)}
    >
      {children}
    </section>
  );
};

export default PageSection;

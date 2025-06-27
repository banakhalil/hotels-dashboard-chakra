import { Avatar } from "@chakra-ui/react";
interface Props {
  name: string;
  image: File | string;
}
const AvatarNav = ({ name, image }: Props) => {
  return (
    <Avatar.Root>
      <Avatar.Fallback name={name} />
      <Avatar.Image src={typeof image === "string" ? image : ""} />
    </Avatar.Root>
  );
};

export default AvatarNav;

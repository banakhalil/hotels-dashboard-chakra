import { Avatar } from "@chakra-ui/react";

const AvatarNav = () => {
  return (
    <Avatar.Root>
      <Avatar.Fallback name="Segun Adebayo" />
      <Avatar.Image src="https://bit.ly/sage-adebayo" />
    </Avatar.Root>
  );
};

export default AvatarNav;

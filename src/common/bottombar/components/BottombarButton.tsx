import { IconButton } from "@chakra-ui/button";
import { JSXElementConstructor, ReactElement } from "react";

interface BottombarButtonProps {
  icon: ReactElement<any, string | JSXElementConstructor<any>>;
  onClick: () => void;
}

function BottombarButton({ icon, onClick }: BottombarButtonProps) {
  return (
    <IconButton
      aria-label="Add Image"
      h="3em"
      w="3em"
      m="1em"
      icon={icon}
      borderRadius="2em"
      onClick={onClick}
      _hover={{
        cursor: "pointer",
      }}
    />
  );
}

export default BottombarButton;

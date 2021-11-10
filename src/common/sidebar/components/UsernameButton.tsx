import { Heading } from "@chakra-ui/layout";
import React from "react";

interface UsernameButtonProps {
  name: string;
  onClick: () => void;
}

function UsernameButton({ name, onClick }: UsernameButtonProps) {
  return (
    <Heading
      isTruncated
      onClick={onClick}
      textAlign="center"
      _hover={{
        color: "gray",
        textDecoration: "underline",
        cursor: "pointer",
      }}
      padding="0em"
      margin="0em"
    >
      {name}
    </Heading>
  );
}

export default UsernameButton;
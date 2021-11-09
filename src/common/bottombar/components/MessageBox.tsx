import { Input } from "@chakra-ui/input";
import { Flex } from "@chakra-ui/layout";
import React from "react";

function MessageBox() {
  return (
    <Flex marginY="0.75em" borderRadius="1em" grow={1}>
      <Input padding="0.75em" width="100%" placeholder="Message" />
    </Flex>
  );
}

export default MessageBox;

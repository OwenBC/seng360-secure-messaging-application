import { Flex } from "@chakra-ui/layout";
import BottombarContainer from "../../bottombar/containers/BottombarContainer";
import MessagesContainer from "./MessagesContainer";

function Container() {
  return (
    <Flex flexDirection="column" height="100%" width="100%">
      <MessagesContainer />
      <BottombarContainer />
    </Flex>
  );
}

export default Container;

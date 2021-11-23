import { Flex } from "@chakra-ui/layout";
import BottombarContainer from "../../bottombar/containers/BottombarContainer";
import MessagesContainer from "./MessagesContainer";

const loggedInAs = "tom";
const activeChat = "bob";

function Container() {
  return (
    <Flex flexDirection="column" height="100%" width="100%">
      <MessagesContainer activeChat={activeChat}/>
      <BottombarContainer loggedInAs={loggedInAs} activeChat={activeChat}/>
    </Flex>
  );
}

export default Container;

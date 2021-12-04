import { Flex } from "@chakra-ui/layout";
import { useContext } from "react";
import Context, { ContextType } from "../../../lib/Context";
import BottombarContainer from "../../bottombar/containers/BottombarContainer";
import MessagesContainer from "./MessagesContainer";

function Container() {
  const { loggedInAs, currentChat } = useContext(Context) as ContextType;

  return (
    <Flex flexDirection="column" height="100%" width="100%">
      <MessagesContainer
        activeChat={currentChat ? currentChat : "No chat selected"}
      />
      <BottombarContainer
        loggedInAs={loggedInAs ? loggedInAs : "Tom"}
        activeChat={currentChat}
      />
    </Flex>
  );
}

export default Container;

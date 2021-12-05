import { Flex } from "@chakra-ui/layout";
import { useContext } from "react";
import { ParsedMessage } from "../../../interfaces/ParsedMessage";
import Context, { ContextType } from "../../../lib/Context";
import BottombarContainer from "../../bottombar/containers/BottombarContainer";
import MessagesContainer from "./MessagesContainer";

interface ContainerProps {
  updateChatLogs: (newChatLogs: Map<string, ParsedMessage[]>) => void;
}

function Container({ updateChatLogs }: ContainerProps) {
  const { loggedInAs, currentChat } = useContext(Context) as ContextType;

  return (
    <Flex flexDirection="column" height="100%" width="100%">
      <MessagesContainer
        activeChat={currentChat ? currentChat : "No chat selected"}
        updateChatLogs={updateChatLogs}
      />
      <BottombarContainer
        loggedInAs={loggedInAs ? loggedInAs : "Tom"}
        activeChat={currentChat}
      />
    </Flex>
  );
}

export default Container;

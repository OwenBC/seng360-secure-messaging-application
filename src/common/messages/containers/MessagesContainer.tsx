import { Flex } from "@chakra-ui/layout";
import { useContext, useEffect, useState } from "react";
import { ParsedMessage } from "../../../interfaces/ParsedMessage";
import Context, { ContextType } from "../../../lib/Context";
import Message from "../components/Message";
import MessageHeader from "../components/MessageHeader";

interface MessagesContainerProps {
  activeChat: string;
}

function MessagesContainer({ activeChat }: MessagesContainerProps) {
  const { chatLogs, clientKey } = useContext(Context) as ContextType;
  const [messageLog, setMessageLog] = useState<ParsedMessage[]>([]);

  useEffect(() => {
    setMessageLog(chatLogs.get(activeChat) ?? []);
  }, [chatLogs, activeChat, setMessageLog]);

  return (
    <>
      <MessageHeader activeChat={activeChat} />
      <Flex flexDirection="column" overflow="scroll" height="100%" width="100%">
        {messageLog.map((message, index) => {
          return (
            <Message
              key={index}
              activeChat={activeChat}
              message={message}
              image={null}
            ></Message>
          );
        })}
      </Flex>
    </>
  );
}

export default MessagesContainer;

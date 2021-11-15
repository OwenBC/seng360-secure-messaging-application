import { Container, Flex } from "@chakra-ui/layout";
import { useContext, useEffect, useState } from "react";
import Context, { ContextType } from "../../../lib/Context";
import Message from "../components/Message";
import MessageHeaderContainer from "./MessageHeaderContainer";

function MessagesContainer() {
  const { messages } = useContext(Context) as ContextType;
  const [messageLog, setMessageLog] = useState<MessageEvent<any>[]>([]);

  useEffect(() => {
    setMessageLog(messages.history);
  }, [messages.history]);

  return (
    <>
      <MessageHeaderContainer />
      <Flex flexDirection="column" overflow="scroll" height="100%" width="100%">
        {messageLog.map((message, index) => {
          return <Container key={index}>{message.data}</Container>;
        })}
      </Flex>
    </>
  );
}

export default MessagesContainer;

import { Flex } from "@chakra-ui/layout";
import Message from "../components/Message";
import MessageHeaderContainer from "./MessageHeaderContainer";

function MessagesContainer() {
  const messages = [ 
    {
      name: "user1",
      time: "8:10 AM",
      text: "Hey, is this working?",
      image: null,
    },
    {
      name: "user0",
      time: "8:11 AM",
      text: "I think it is",
      image: null,
    },
  ];

  return (
    <>
      <MessageHeaderContainer />
      <Flex flexDirection="column" height="100%" width="100%">
        {messages.map((message) => {
          return (
            <Message name={message.name} time={message.time} text={message.text} image={message.image} onClick={() => {}} />
          );
        })}
      </Flex>
    </>
  );
}

export default MessagesContainer;

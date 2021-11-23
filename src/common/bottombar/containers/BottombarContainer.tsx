import { AddIcon, ChatIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/react";
import Line from "../../../shared/Line";
import BottombarButton from "../components/BottombarButton";
import { useContext, useState } from "react";
import Context, { ContextType } from "../../../lib/Context";

interface BottombarContainerProps {
	loggedInAs: string;
	activeChat: string;
}

function BottombarContainer( {loggedInAs, activeChat} : BottombarContainerProps ) {
  const [message, setMessage] = useState("");
  const { socket, serverKeys } = useContext(Context) as ContextType;

  const sendMessage = (message: any) => {
    if (serverKeys.publicKey === undefined) return;
    socket.sendMessage(
      serverKeys.publicKey?.encrypt(
        `[s]:[${loggedInAs}_${activeChat}]:[message_id]:[${message}]:[${Date()}]`// Figure out what to put here
      )
    );
  };

  return (
    <>
      <Line />
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        maxH="20%"
        minH="10%"
      >
        <BottombarButton icon={<AddIcon />} onClick={() => {}} />
        <Flex marginY="0.75em" borderRadius="1em" grow={1}>
          <Input padding="0.75em" width="100%" placeholder="Message" 
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            onKeyUpCapture={(event) => {
              if (event.code === "Enter") {
                sendMessage(message);
              }
            }}
          />
        </Flex>
        <BottombarButton icon={<ChatIcon />} onClick={() => sendMessage(message)} />
      </Flex>
    </>
  );
}

export default BottombarContainer;

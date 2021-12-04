import { AddIcon, ChatIcon, CloseIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Input, Icon } from "@chakra-ui/react";
import Line from "../../../shared/Line";
import BottombarButton from "../components/BottombarButton";
import { useContext, useState } from "react";
import Context, { ContextType } from "../../../lib/Context";
import { useFilePicker } from "use-file-picker";

interface BottombarContainerProps {
  loggedInAs: string;
  activeChat?: string;
}

function BottombarContainer({
  loggedInAs,
  activeChat,
}: BottombarContainerProps) {
  const [message, setMessage] = useState("");
  const [imageIsHover, setImageIsHover] = useState(false);
  const { socket, serverKeys } = useContext(Context) as ContextType;
  const [openFileSelector, { filesContent, clear }] = useFilePicker({
    multiple: false,
    readAs: "BinaryString", //DataURL: 1.5MB, Text: 2.0MB, BinaryString: 1.7MB, ArrayBuffer: returns an ArrayBuffer
    accept: "image/*",
    limitFilesConfig: { max: 1 },
    // minFileSize: 1, // in megabytes
    maxFileSize: 50,
    // imageSizeRestrictions: {
    //   maxImageHeight: 1024, // in pixels
    //   minImageHeight: 1024,
    //   maxImageWidth: 768,
    //   minImageWidth: 768
    // },
    // readFilesContent: false, // ignores file content
  });

  const sendMessage = () => {
    if (serverKeys.publicKey === undefined) return;
    const sendStr =
      filesContent.length === 0
        ? `[s]:[${loggedInAs}_${activeChat}]:[message_id]:[${message}]:[]:[${Date()}]`
        : `[si]:[${loggedInAs}_${activeChat}]:[message_id]:[${message}]:[${
            filesContent[0].name
          }]:[${Date()}]`;
    socket.sendMessage(serverKeys.publicKey?.encrypt(sendStr));
    setMessage("");
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
        <BottombarButton
          icon={<AddIcon />}
          onClick={() => openFileSelector()}
        />

        {filesContent.map((file, index) => (
          <Flex
            key={index}
            margin="0.75em"
            maxW="50px"
            onMouseEnter={() => setImageIsHover(true)}
            onMouseLeave={() => setImageIsHover(false)}
            onClick={() => {
              clear();
              setImageIsHover(false);
            }}
          >
            {imageIsHover ? (
              <Icon as={CloseIcon} color="red" position="absolute" />
            ) : (
              <></>
            )}
            <img
              alt={file.name}
              src={`data:image/jpeg;base64,` + btoa(file.content)}
              width="50px"
              style={imageIsHover ? { opacity: 0.5 } : { opacity: 1 }}
            />
          </Flex>
        ))}

        <Flex marginY="0.75em" borderRadius="1em" grow={1}>
          <Input
            padding="0.75em"
            width="100%"
            placeholder="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyUpCapture={(event) => {
              if (event.code === "Enter") {
                sendMessage();
              }
            }}
          />
        </Flex>
        <BottombarButton icon={<ChatIcon />} onClick={() => sendMessage()} />
      </Flex>
    </>
  );
}

export default BottombarContainer;

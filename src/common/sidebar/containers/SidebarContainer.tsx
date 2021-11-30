import { useDisclosure } from "@chakra-ui/hooks";
import { VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/modal";
import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";

import { useContext } from "react";
import Context, { ContextType } from "../../../lib/Context";
import Colors from "../../../shared/Colors";
import UsernameButton from "../components/UsernameButton";

function SidebarContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { users, socket, serverKeys } = useContext(Context) as ContextType;
  const [addUser, setAddUser] = useState("");

  return (
    <VStack
      bg={Colors.lightGray}
      minH="90%"
      maxH="100%"
      width="25%"
      padding="1em"
    >
      {users.list.map((user) => {
        return <UsernameButton key={user} name={user} onClick={() => {}} />;
      })}
      <UsernameButton
        name="Start new chat"
        onClick={() => {
          onOpen();
          setAddUser("");
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              onChange={(event) => {
                setAddUser(event.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (serverKeys.publicKey === undefined) return;
                // socket.sendMessage(serverKeys.publicKey?.encrypt(""));
                onClose();
              }}
            >
              Start Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default SidebarContainer;

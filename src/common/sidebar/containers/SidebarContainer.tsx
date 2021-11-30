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
import { Button } from "@chakra-ui/react";
import React from "react";

import { useContext } from "react";
import Context, { ContextType } from "../../../lib/Context";
import Colors from "../../../shared/Colors";
import UsernameButton from "../components/UsernameButton";

function SidebarContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef();
  const { users } = useContext(Context) as ContextType;

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
      <UsernameButton name="Start new chat" onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>ajksdnfaksdnfkjansdkjfnasdjkfnkjsdnfkjsn</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default SidebarContainer;

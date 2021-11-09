import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import Colors from "../../../shared/Colors";
import Line from "../../../shared/Line";
import UsernameButton from "../components/UsernameButton";

function SidebarContainer() {
  const [users, setUsers] = useState(["user1", "user2"]);

  return (
    <VStack
      bg={Colors.lightGray}
      minH="90%"
      maxH="100%"
      width="25%"
      padding="1em"
    >
      {users.map((user) => {
        return (
          <>
            <UsernameButton name={user} onClick={() => {}} />
            <Line />
          </>
        );
      })}
      <UsernameButton name="Start new chat" onClick={() => {}} />
    </VStack>
  );
}

export default SidebarContainer;

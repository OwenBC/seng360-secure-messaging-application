import { VStack } from "@chakra-ui/layout";
import { useContext } from "react";
import Context, { ContextType } from "../../../lib/Context";
import Colors from "../../../shared/Colors";
import UsernameButton from "../components/UsernameButton";

function SidebarContainer() {
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
      <UsernameButton name="Start new chat" onClick={() => {}} />
    </VStack>
  );
}

export default SidebarContainer;

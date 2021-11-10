import { Flex } from "@chakra-ui/layout";
import { useState } from "react";
import Container from "./common/messages/containers/Container";
import SidebarContainer from "./common/sidebar/containers/SidebarContainer";
import Context, { ContextType } from "./lib/Context";

function App() {
  const [users, setUsers] = useState(["user1", "user2"]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const store: ContextType = {
    users: { list: users, set: setUsers },
    isAuthenticated: { value: isAuthenticated, set: setIsAuthenticated },
  };

  return (
    <Context.Provider value={store}>
      <Flex flexDirection="row" height="100vh">
        <SidebarContainer />
        <Container />
      </Flex>
    </Context.Provider>
  );
}

export default App;

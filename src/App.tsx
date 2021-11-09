import { Flex } from "@chakra-ui/layout";
import Container from "./common/messages/containers/Container";
import SidebarContainer from "./common/sidebar/containers/SidebarContainer";

function App() {
  return (
    <Flex bg="gray" flexDirection="row" height="100vh">
      <SidebarContainer />
      <Container />
    </Flex>
  );
}

export default App;

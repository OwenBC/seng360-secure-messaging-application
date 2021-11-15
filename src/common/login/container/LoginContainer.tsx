import { Input } from "@chakra-ui/input";
import {
  Box,
  Center,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/layout";
import LoginButton from "../components/LoginButton";
import RegisterButton from "../components/RegisterButton";

function LoginContainer() {
  return (
    <Center flexGrow={1}>
      <VStack height="40%" width="40%" borderStyle="solid" borderWidth="1px">
        <Center flexGrow={1} flexDirection="column">
          <Heading>Login</Heading>
          <HStack>
            <Text>Username: </Text>
            <Input />
          </HStack>
          <Box>
            <HStack>
              <Text>Password: </Text>
              <Input />
            </HStack>
          </Box>
        </Center>
        <HStack flexGrow={1} w="100%" justifyContent="space-between">
          <Spacer />
          <RegisterButton />
          <Spacer />
          <LoginButton />
          <Spacer />
        </HStack>
      </VStack>
    </Center>
  );
}

export default LoginContainer;

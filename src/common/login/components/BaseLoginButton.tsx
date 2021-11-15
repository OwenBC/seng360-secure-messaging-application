import { Button } from "@chakra-ui/react";

interface BaseLoginButtonProps {
  text: string;
  onClick: () => void;
}

function BaseLoginButton({ text, onClick }: BaseLoginButtonProps) {
  return <Button onClick={onClick}>{text}</Button>;
}

export default BaseLoginButton;

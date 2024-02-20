import { Flex, Spinner } from "@chakra-ui/react";

const DashSpinner = () => {
  return (
    <Flex justify={"center"} w={"full"} h={"200px"} align={"center"}>
      <Spinner />
    </Flex>
  );
};
export default DashSpinner;

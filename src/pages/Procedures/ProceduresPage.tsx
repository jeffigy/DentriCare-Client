import { Flex } from "@chakra-ui/react";
import FloatingButton from "components/FloatingButton";
import ProceduresList from "features/procedures/ProceduresList";
import useTitle from "hooks/useTitle";
import { MdOutlineNoteAdd } from "react-icons/md";

const ProceduresPage = () => {
  useTitle("Procedures");
  return (
    <Flex justify={"center"} align={"center"} w={"full"}>
      <ProceduresList />
      <FloatingButton
        ariaLabel="add Procedure"
        icon={MdOutlineNoteAdd}
        to="/dash/procedures/new"
      />
    </Flex>
  );
};
export default ProceduresPage;

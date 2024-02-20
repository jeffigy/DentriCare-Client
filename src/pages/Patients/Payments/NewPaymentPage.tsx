import { Flex } from "@chakra-ui/react";
import DashSpinner from "components/Dashboard/DashSpinner";
import { useGetPatientsQuery } from "features/patients/patientsApiSlice";
import NewPaymentForm from "features/payments/NewPaymentForm";
import useTitle from "hooks/useTitle";
import { Patient } from "types/Patient";

const NewPaymentPage = () => {
  useTitle("New Payment");

  const { patients } = useGetPatientsQuery("patientsList", {
    selectFromResult: ({ data }) => ({
      patients: data?.ids.map((id) => data.entities[id]),
    }),
  });

  if (!patients) return <DashSpinner />;

  return (
    <Flex w={"full"} justify={"center"}>
      <NewPaymentForm patients={patients as Patient[]} />
    </Flex>
  );
};
export default NewPaymentPage;

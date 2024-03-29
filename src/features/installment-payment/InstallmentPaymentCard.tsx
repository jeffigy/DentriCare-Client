import { EditIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  Divider,
  Flex,
  Icon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { InstallmentPayment } from "types/InstallmentPayment";
import DeleteInstallmentPayment from "./DeleteInstallmentPayment";
import { useGetInstallmentPaymentsByPaymentIdQuery } from "./installmentPaymentApiSlice";
import useAuth from "hooks/useAuth";

type InstallmentPaymentCardProps = {
  installmentPaymentId: string;
};

const InstallmentPaymentCard: React.FC<InstallmentPaymentCardProps> = ({
  installmentPaymentId,
}) => {
  const { status } = useAuth();
  const { id, paymentId } = useParams<{ id: string; paymentId: string }>();
  const navigate = useNavigate();
  const { installmentPayment } = useGetInstallmentPaymentsByPaymentIdQuery(
    paymentId,
    {
      selectFromResult: ({ data }) => ({
        installmentPayment: data?.entities[
          installmentPaymentId
        ] as InstallmentPayment,
      }),
    }
  );

  if (installmentPayment) {
    return (
      <Card
        w={{
          base: "300px",
          sm: "400px",
        }}
        mb={"10px"}
      >
        <CardBody>
          <Flex justify={"space-between"}>
            <Text color={"gray.500"}>Date of Payment:</Text>
            <Text>
              {" "}
              {new Date(installmentPayment.date * 1000)
                .toDateString()
                .split(" ")
                .slice(1)
                .join(" ")}
            </Text>
          </Flex>
          <Divider />

          <Flex justify={"space-between"}>
            <Text color={"gray.500"}>Amount:</Text>
            <Text>
              ₱
              {new Intl.NumberFormat("en-US").format(installmentPayment.amount)}
            </Text>
          </Flex>

          {installmentPayment.remarks && (
            <>
              <Divider />
              <Flex direction={"column"}>
                <Text color={"gray.500"}>Remarks:</Text>
                <Text>{installmentPayment.remarks}</Text>
              </Flex>
            </>
          )}
          {status === "Admin" ||
            (status === "SuperAdmin" && (
              <>
                {" "}
                <Divider />
                <Flex justify={"space-between"}>
                  <Text color={"gray.500"}> Created By</Text>
                  <Text color={"gray.500"}>{installmentPayment.createdBy}</Text>
                </Flex>
                <Divider />
                <Flex justify={"space-between"}>
                  <Text color={"gray.500"}>Creation Date:</Text>
                  <Text color={"gray.500"}>
                    {new Date(installmentPayment.createdAt).toLocaleString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </Text>
                </Flex>
              </>
            ))}
          {status === "Admin" ||
            (status === "SuperAdmin" && installmentPayment.updatedBy && (
              <>
                <Divider />
                <Flex justify={"space-between"}>
                  <Text color={"gray.500"}> Updated By</Text>
                  <Text color={"gray.500"}>{installmentPayment.updatedBy}</Text>
                </Flex>
                <Divider />
                <Flex justify={"space-between"}>
                  <Text color={"gray.500"}>Last Updated:</Text>
                  <Text color={"gray.500"}>
                    {new Date(installmentPayment.updatedAt).toLocaleString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </Text>
                </Flex>
              </>
            ))}
        </CardBody>

        <Flex borderTop={"1px solid"} borderColor={"gray.100"}>
          <IconButton
            onClick={() =>
              navigate(
                `/dash/patients/${id}/payments/${paymentId}/installment-payment/${installmentPaymentId}`
              )
            }
            as={Flex}
            w={"full"}
            aria-label="edit"
            icon={<Icon as={EditIcon} />}
            variant={"ghost"}
          />
          {status === "Admin" ||
            (status === "SuperAdmin" && (
              <>
                {" "}
                <Divider orientation="vertical" h={"inherit"} />
                <DeleteInstallmentPayment
                  installmentPayment={installmentPayment}
                />
              </>
            ))}
        </Flex>
      </Card>
    );
  }
};
export default InstallmentPaymentCard;

import {
  Button,
  Flex,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDeletePaymentMutation } from "./paymentApiSlice";
import { LuTrash2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { ErrorType } from "types/Error";

type DeletePaymentProps = {
  payment: {
    id: string;
    date: number;
  };
  backToPrev?: boolean;
};

const DeletePayment: React.FC<DeletePaymentProps> = ({
  payment,
  backToPrev,
}) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [DeletePayment, { isSuccess, isError, error }] =
    useDeletePaymentMutation();

  const [delButtonState, setDelButtonState] = useState(false);

  const onDelete = async () => {
    setDelButtonState(true);
    try {
      await DeletePayment({ id: payment.id });
      setDelButtonState(false);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success.",
        description: "Payment has been deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      if (backToPrev) {
        navigate(-1);
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: (error as ErrorType).data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError]);
  return (
    <>
      <IconButton
        variant={"ghost"}
        as={Flex}
        w={"full"}
        aria-label="delete note"
        icon={<Icon as={LuTrash2} />}
        colorScheme="red"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {" "}
            <Text>
              {" "}
              A you sure on deleting payment with date of{" "}
              <Text
                as={"span"}
                color={"red"}
                fontWeight={"bold"}
                fontSize={"lg"}
              >
                {new Date(payment.date * 1000).toDateString()}
              </Text>
              ? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" colorScheme="blackAlpha" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={onDelete}
              isLoading={delButtonState}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default DeletePayment;

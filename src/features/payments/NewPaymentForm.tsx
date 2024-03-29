import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuth from "hooks/useAuth";
import React, { useEffect } from "react";
import { Controller, Resolver, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Patient } from "types/Patient";
import { PaymentFormValues } from "types/Payment";
import { paymentValidation } from "validations/paymentValidation";
import DatePicker from "react-datepicker";
import { paymentTypes } from "config/PaymentTypes";
import { useAddNewPaymentMutation } from "./paymentApiSlice";
import { ErrorType } from "types/Error";
type NewPaymentFormProps = {
  patients: Patient[];
};

const NewPaymentForm: React.FC<NewPaymentFormProps> = ({ patients }) => {
  const { id } = useParams<{ id: string }>();
  const { email } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [addNewPayment, { isSuccess, isError, error }] =
    useAddNewPaymentMutation();

  const form = useForm<PaymentFormValues>({
    defaultValues: {
      patient: id,
      date: undefined,
      type: "",
      total: undefined,
      remarks: "",
      planName: "",
      notesAndProcedures: [],
    },
    resolver: yupResolver(paymentValidation) as Resolver<PaymentFormValues>,
  });

  const { register, control, handleSubmit, formState, reset, watch, setValue } =
    form;
  const { errors, isSubmitting } = formState;

  const watchFields = watch(["patient", "date", "type", "total"]);
  const allFieldsHaveValue = watchFields.every(
    (field) => field !== undefined && field !== ""
  );
  const paymentType = watch("type");

  const onSubmit = async (data: PaymentFormValues) => {
    const { patient, date, type, total, remarks, planName } = data;

    try {
      await addNewPayment({
        patient,
        date,
        type,
        total,
        remarks,
        planName,
        createdBy: email,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };

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

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate(-1);
      toast({
        title: "Success",
        description: "Payment added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (paymentType === "Full Payment") {
      setValue("planName", "");
    } else if (paymentType === "Installment") {
      setValue("remarks", "");
    }
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card
        w={{
          base: "300px",
          sm: "400px",
        }}
      >
        <CardHeader as={Flex} justify={"center"}>
          <Heading size={"md"}>New Payment</Heading>
        </CardHeader>
        <CardBody as={Stack} spacing={"10px"}>
          <FormControl isRequired>
            <FormLabel>Patient</FormLabel>
            <Select
              isDisabled
              placeholder="Select patient"
              {...register("patient")}
            >
              {patients &&
                patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.fname} {patient.mname} {patient.lname}
                  </option>
                ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <div className="customDatePickerWidth">
                  <DatePicker
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    customInput={
                      <Input
                        isInvalid={!!errors.date}
                        autoComplete="false"
                        name="hidden"
                      />
                    }
                    selected={
                      field.value ? new Date(Number(field.value) * 1000) : null
                    }
                    onChange={(date) =>
                      field.onChange(date ? date.getTime() / 1000 : 0)
                    }
                  />
                </div>
              )}
            />
            {errors.date && (
              <FormHelperText color={"red"}>
                {errors.date.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Payment Type</FormLabel>
            <Select placeholder="Select payment type" {...register("type")}>
              {Object.values(paymentTypes).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Total</FormLabel>
            <Input type="number" {...register("total")} />
            {errors.total && (
              <FormHelperText color={"red"}>
                {errors.total.message}
              </FormHelperText>
            )}
          </FormControl>
          {watch("type") === "Full Payment" && (
            <FormControl>
              <FormLabel>Remarks</FormLabel>
              <Textarea {...register("remarks")}> </Textarea>
              {errors.remarks && (
                <FormHelperText color={"red"}>
                  {errors.remarks.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
          {watch("type") === "Installment" && (
            <>
              <FormControl>
                <FormLabel>Plan</FormLabel>

                <Input {...register("planName")} />
                {errors.planName && (
                  <FormHelperText color={"red"}>
                    {errors.planName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          )}
        </CardBody>
        <CardFooter>
          <Button
            w={"full"}
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!allFieldsHaveValue}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
export default NewPaymentForm;

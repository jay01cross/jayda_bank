import * as yup from "yup";

const initiatePaystackDeposit = yup.object({
  amount: yup.number().required(),
  accountId: yup.string().trim().required(),
});

const ValidatorSchema = { initiatePaystackDeposit };

export default ValidatorSchema;

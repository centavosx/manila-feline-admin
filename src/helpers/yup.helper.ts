import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)

const UserShape = {
  name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
  email: Yup.string()
    .email('Must be an email!')
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string().password(),
}

export const FormikValidation = {
  createUser: Yup.object().shape(UserShape),

  createDoctor: Yup.object().shape({
    ...UserShape,
    position: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
    description: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!'),
  }),
  createService: Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    description: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  }),
  updateAppointment: Yup.object().shape({
    startDate: Yup.number()
      .integer()
      .lessThan(Yup.ref('endDate'), (value) => value.less),
    endDate: Yup.number()
      .integer()
      .moreThan(
        Yup.ref('startDate'),
        (value) => `Max price must be greater than ` + value.value
      ),
  }),
  createAppointment: Yup.object().shape({
    serviceId: Yup.string().required('Required'),
    time: Yup.string().required('Required'),
    date: Yup.string().required('Required'),
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Must be an email!')
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  }),
}

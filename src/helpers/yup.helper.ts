import * as Yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(Yup)

const UserShape = {
  name: Yup.string().trim().min(1, 'Too Short!').max(5000, 'Too Long!'),
  email: Yup.string()
    .trim()
    .email('Must be an email!')
    .min(1, 'Too Short!')
    .max(5000, 'Too Long!')
    .required('Required'),
  password: Yup.string().trim().password().required('Required'),
}

export const FormikValidation = {
  createUser: Yup.object().shape(UserShape),

  createDoctor: Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .trim()
      .email('Must be an email!')
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    position: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    description: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
  }),
  createService: Yup.object().shape({
    name: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    description: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
  }),
  updateAppointment: Yup.object().shape({
    startDate: Yup.number()
      .typeError('Enter correct start date')
      .integer('Enter start date')
      .lessThan(
        Yup.ref('endDate'),
        'Start date should be earlier than end date'
      )
      .required('Please select date'),
    endDate: Yup.number()
      .typeError('Enter correct end date')
      .integer('Enter end date')
      .moreThan(Yup.ref('startDate'), 'End date must be higher than start date')
      .required('Please select date'),
  }),
  createAppointment: Yup.object().shape({
    serviceId: Yup.string().required('Required'),
    time: Yup.string().required('Required'),
    date: Yup.string().required('Required'),
    name: Yup.string()
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Must be an email!')
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
    petName: Yup.string().required('Required'),

    birthDate: Yup.string().nullable().required('Required'),

    age: Yup.number().min(0).required('Required'),

    gender: Yup.string().nullable().required('Required'),
  }),
  reset: Yup.object().shape({
    password: Yup.string().trim().password().required('Required'),
    confirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
  }),
  forgot: Yup.object().shape({
    email: Yup.string()
      .email('Must be an email!')
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
  }),
  login: Yup.object().shape({
    email: Yup.string()
      .email('Must be an email!')
      .min(1, 'Too Short!')
      .max(5000, 'Too Long!')
      .required('Required'),
  }),
}

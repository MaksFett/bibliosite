import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import axios from'axios'
import {Link, Navigate, useLocation} from 'react-router-dom'
import React, {useState} from 'react'
import {Button} from 'react-bootstrap'
import Header from './components/Header'

export default function Reg() {
    const [error, seterror] = useState('')
    const [valid, setvalid] = useState(false)
    const [code, setcode] = useState(123)
    const [email, setemail] = useState('')
    const {state} = useLocation()

    const RegSchema = Yup.object().shape({
      login: Yup.string()
      .min(3, 'Слишком короткий логин')
      .max(20, 'Слишком длинный логин')
      .required('Обязательное поле'),
      password: Yup.string()
      .min(3, 'Слишком короткий пароль')
      .max(20, 'Слишком длинный пароль')
      .required('Обязательное поле'),
      retyped_password: Yup.string()
      .required('Обязательное поле')
      .oneOf([Yup.ref("password"), null], 'Пароли не совпадают'),
      email: Yup.string()
      .email('Адрес электронной почты некорректный')
      .required('Обязательное поле'),
      emailcode: Yup.number()
      .required('Обязательное поле')
      .oneOf([code], 'Неверный код')
      .min(1000, 'Слишком короткий код')
    });

    const registrate = (user) => {
      delete user["retyped_password"]
      var myParams = {data : user}
      axios.post('/api/reg/', myParams)
      .then((response) => {
        if (response.data === 0){
          seterror('Такой пользователь уже зарегистрирован')
        }
        else {
          localStorage.setItem("jwt_token", response.data)
          if (error !== ''){
            seterror('')
          }
          setvalid(true)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    const sendemailcode = (values) => {
      var myParams = {"data" : email}
      axios.post('/api/reg/mail', myParams)
      .then((response) => {
        if (response.data === 0){
          seterror('Некорректный адрес электронной почты')
        }
        else {
          setcode(response.data["code"])
          if (error !== ''){
            seterror('')
          }
        }
      }).catch((error) => {
        console.log(error)
      })
    }
    return (
      <div className='text-center'>
        <Header authorized={false} login={''}/>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {valid && (
                <Navigate to={state['curr_page']} replace={true} state={state['book']}/>
              )}
              <Formik initialValues={{ "login" : '', "password" : '', "retyped_password" : '', "email" : '', "emailcode" : ''}} 
                validationSchema={RegSchema} 
                onSubmit={(values) => {registrate(values)}} >
              {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, touched, errors, }) => (
                <div>
                  <div className="row mb-1">
                      <div className="col-lg-12">
                          <h1 className="mt-5">Регистрация</h1>
                      </div>
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="login">Логин</label>
                      <div></div>
                      <Field className="col-2" 
                        name='login' 
                        type='text' 
                        placeholder='Введите логин' 
                        value={values.login} 
                        onChange={handleChange} 
                        onBlur={handleBlur}/>
                      {errors.login && touched.login ? (
                        <div style = {{color: 'red'}}>{errors.login}</div>
                      ) : (<div>&nbsp;</div>)}
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Пароль</label>
                      <div></div>
                      <Field className="col-2" 
                        name='password' 
                        type='password' 
                        placeholder='Введите пароль' 
                        value={values.password} 
                        onChange={handleChange} 
                        onBlur={handleBlur}/>
                      {errors.password && touched.password ? (
                        <div style = {{color: 'red'}}>{errors.password}</div>
                      ) : (<div>&nbsp;</div>)}
                    </div>
                    <div className="form-group">
                      <label htmlFor="retyped_password">Подтверждение пароля</label>
                      <div></div>
                      <Field className="col-2" 
                        name='retyped_password' 
                        type='password' 
                        placeholder='Повторно введите пароль ' 
                        value={values.retyped_password} 
                        onChange={handleChange} 
                        onBlur={handleBlur}/>
                      {errors.retyped_password && touched.retyped_password ? (
                        <div style = {{color: 'red'}}>{errors.retyped_password}</div>
                      ) : (<div>&nbsp;</div>)}
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Адрес электронной почты</label>
                      <div></div>
                      <Field className="col-2" 
                        name='email' 
                        type='text' 
                        placeholder='Введите email' 
                        value={values.email} 
                        onChange={(e) => {setFieldValue("email", e.target.value); setemail(e.target.value)}} 
                        onBlur={handleBlur}/>
                      {errors.email && touched.email ? (
                        <div style = {{color: 'red'}}>{errors.email}</div>
                      ) : (<div>&nbsp;</div>)}
                    </div>
                    <div className="form-group">
                      <label htmlFor="emailcode">Код подтверждения электронной почты</label>
                      <div></div>
                      <Field className="col-2" 
                        name='emailcode' 
                        type='number' 
                        placeholder='Введите код' 
                        value={values.emailcode} 
                        onChange={handleChange} 
                        onBlur={handleBlur}/>
                      {errors.emailcode && touched.emailcode ? (
                        <div style = {{color: 'red'}}>{errors.emailcode}</div>
                      ) : (<div>&nbsp;</div>)}
                      <Button type="button" variant="info" onClick={sendemailcode}>Отправить код подтверждения на почту</Button>
                    </div>
                    <div style = {{color: 'red'}}>{error}&nbsp;</div>
                    <Button type="submit">Зарегистрироваться</Button>
                  </Form>
                  <Link to='/authorization' state={{'curr_page': state['curr_page'], 'book': state['book']}}>Авторизация</Link>
                </div>
              )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
}
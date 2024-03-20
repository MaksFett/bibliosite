import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Header from './components/Header'
import ReactLoading from 'react-loading'
import { Button } from 'react-bootstrap'

function Lk(){
    const [user, setuser] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        var MyParams = {headers: {
            Authorization: 'Bearer ' + localStorage.getItem("jwt_token")
        }}
        axios.get('/api/autho/readuser', MyParams)
            .then((response) => {
                setuser(response.data)
                setTimeout(() => setLoading(false), 500)
            }).catch((error) => {
                if ((error.response.status === 401) || (error.response.status === 422)){
                    navigate('/', {replace: true})
                }
                console.log(error)
            })
    }, [])

    const exit = (event) => {
        event.preventDefault()
        localStorage.removeItem("jwt_token")
        navigate('/', {replace: true})
    }

    return(
        <>
        {loading ?
            <div className="App-loading">
            <ReactLoading className='position-absolute top-50 start-50 translate-middle' type="spinningBubbles" color="#2081F9" height={150} width={150}/>
            </div>
        :
            <div>
                <Header authorized={true} login={user['login']} exit={exit}/>
                <div className='m-5 p-5 bg-body-tertiary'>
                    <Container>
                        <Row>
                            <Col xs={8} className='d-flex justify-content-center'>
                                <Container>
                                    <Row>
                                        <Col><h1>{user['login']}</h1></Col>
                                    </Row>
                                    <Row>
                                        <Col>Email: {user['email']}</Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col><Link to='/user_books'><Button>Список книг</Button></Link></Col>
                                    </Row>
                                    <Row className='mt-3'>
                                        <Col><Button onClick={exit} variant='danger'>Выход</Button></Col>
                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        }
        </>
    )
}

export default Lk;
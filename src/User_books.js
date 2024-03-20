import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Header from './components/Header'
import ReactLoading from 'react-loading'
import ListedBook from './components/ListedBook'

function Lk(){
    const [books, setbooks] = useState([])
    const [login, setlogin] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        var MyParams = {headers: {
            Authorization: 'Bearer ' + localStorage.getItem("jwt_token")
        }}
        axios.get('/api/books/readlogin', MyParams)
            .then((response) => {
                setlogin(response.data)
            }).catch((error) => {
                if ((error.response.status === 401) || (error.response.status === 422)){
                    navigate('/', {replace: true})
                }
                console.log(error)
            })
        axios.get('/api/autho/readbooks', MyParams)
            .then((response) => {
                setbooks(response.data)
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
                <Header authorized={true} login={login} exit={exit}/>
                <div className='m-5 p-5 bg-body-tertiary'>
                    <h2 className='m-3'>Мои книги</h2>
                    <Container>
                        <Row>
                            <Col xs={8} className='d-flex justify-content-center'>
                                <Container>
                                    {books.map(book => (
                                        <Row><Col><ListedBook book={book} /></Col></Row>
                                    ))}
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
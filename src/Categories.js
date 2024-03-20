import axios from 'axios'
import React, {useState, useEffect} from 'react'
import ListedBook from './components/ListedBook'
import Header from './components/Header'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Accordion from 'react-bootstrap/Accordion'
import ReactLoading from 'react-loading'

export default function Categories() {
    const [login, setlogin] = useState('')
    const [authorized, setAuth] = useState(false)
    const [books, setbooks] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        var MyParams = {headers: {
        Authorization: 'Bearer ' + localStorage.getItem("jwt_token")
        }}
        axios.get('/api/books/readlogin', MyParams)
        .then((response) => {
            setlogin(response.data)
            setAuth(true)
            setTimeout(() => setLoading(false), 500)
        }).catch((error) => {
            if ((error.response.status === 401) || (error.response.status === 422)){
                setAuth(false)
                setLoading(false)
            }
            console.log(error)
        })
        axios.get('/api/books/get_books_by_categories', MyParams)
        .then((response) => {
            setbooks(response.data)
            setTimeout(() => setLoading(false), 500)
        }).catch((error) => {
            if ((error.response.status === 401) || (error.response.status === 422)){
                setAuth(false)
            }
            console.log(error)
        })
    }, [])

    const exit = (event) => {
        event.preventDefault()
        localStorage.removeItem("jwt_token")
        setAuth(false)
        setlogin('')
    }

    return (
      <>
        {loading ?
          <div className="App-loading">
            <ReactLoading className='position-absolute top-50 start-50 translate-middle' type="spinningBubbles" color="#2081F9" height={150} width={150}/>
          </div>
        :
          <div>
            <Header authorized={authorized} login={login} exit={exit} page={'/search'}/>
            <h2 className='m-3'>Категории</h2>
            <Accordion className='m-3'>
                {Object.keys(books).map(category => (
                    <Accordion.Item eventKey={category}>
                        <Accordion.Header>{category}</Accordion.Header>
                        <Accordion.Body>
                            <Container fluid>
                                {books[category].map(book => (
                                    <Row><Col><ListedBook book={book} /></Col></Row>
                                ))}
                            </Container>
                        </Accordion.Body>
                    </Accordion.Item>)
                )}
            </Accordion>
          </div>
        }
      </>
    );
  }
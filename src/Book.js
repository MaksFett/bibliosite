import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios'
import {Buffer} from 'buffer'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Header from './components/Header'
import ReactLoading from 'react-loading'

function Book(){
    const [login, setlogin] = useState(' ')
    const {state} = useLocation()
    const [authorized, setAuth] = useState(true)
    const [imageData, setImageData] = useState('')
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])

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
                }
                console.log(error)
            })
        axios.get('/api/books/images/' + state['image'], { responseType: 'arraybuffer' })
            .then((response) => {
                const base64Image = Buffer.from(response.data, 'binary').toString('base64')
                setImageData(`data:image/jpeg;base64, ${base64Image}`)
                setTimeout(() => setLoading(false), 500)
            }).catch((error) => {
                console.log(error)
            })
        MyParams = {headers: {
            Authorization: 'Bearer ' + localStorage.getItem("jwt_token")
        }, data : state['name']}
        axios.post('/api/books/get_categories', MyParams)
            .then((response) => {
                setCategories(response.data)
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

    const purchase = () => {
        var MyParams = {"data": {'book': state['name'], 'user': login}}
        axios.post('/api/books/purchase', MyParams)
            .then((response) => {
                console.log(response)
            }).catch((error) => {
                if ((error.response.status === 401) || (error.response.status === 422)){
                    setAuth(false)
                }
                console.log(error)
            })
    }

    return(
        <>
        {loading ?
            <div className="App-loading">
            <ReactLoading className='position-absolute top-50 start-50 translate-middle' type="spinningBubbles" color="#2081F9" height={150} width={150}/>
            </div>
        :
            <div>
                <Header authorized={authorized} login={login} exit={exit} page={'/book'} book={state}/>
                <div className='m-5 p-5 bg-body-tertiary'>
                    <Container>
                        <Row>
                            <Col><img src={imageData} /></Col>
                            <Col xs={8} className='d-flex justify-content-center'>
                                <Container>
                                    <Row>
                                        <Col><h1>{state['name']}</h1></Col>
                                    </Row>
                                    <Row>
                                        <Col>Автор: {state['author']}</Col>
                                        <Col>Год выпуска: {state['year']}</Col>
                                        <Col>Количество страниц: {state['page']}</Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col>Категории: {categories.join(', ')}{categories.map((category, index) => {
                                            index == categories.length - 1 ? (<>{category},</>) : (<>{category}</>)
                                        })}</Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col><h3>Описание</h3></Col>
                                    </Row>
                                    <Row>
                                        <Col>{state['about']}</Col>
                                    </Row>
                                    {authorized ? (
                                        <Row className='mt-4'>
                                            <Col><a href={"/api/books/files/" + state['pdf']} onClick={purchase}>Скачать книгу</a></Col>
                                        </Row>
                                    ) : (
                                        <Row className='mt-4'>
                                            <div style={{color: 'red'}}>Нужно быть авторизованным для скачивания файла</div>
                                        </Row>
                                    )}
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

export default Book;
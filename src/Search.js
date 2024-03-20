import axios from 'axios'
import React, {useState, useEffect} from 'react'
import ListedBook from './components/ListedBook'
import Header from './components/Header'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Container from 'react-bootstrap/Container'
import ReactLoading from 'react-loading'
import { useLocation } from 'react-router-dom'

export default function Search() {
    const [login, setlogin] = useState('')
    const [authorized, setAuth] = useState(false)
    const [searchItem, setSearchItem] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [findby, setFindby] = useState('name')
    const [sortby, setSortby] = useState('name')
    const [sortOrder, setSortOrder] = useState('v')
    const {state} = useLocation()

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
        if (state){
          setSearchItem(state['searchItem'])
        }
    }, [])

    useEffect(() => {
      var MyParams = {headers: {
        Authorization: 'Bearer ' + localStorage.getItem("jwt_token")
      }, data : {'searchItem': searchItem, 'findby': findby, 'sortby': sortby, 'sortOrder': sortOrder}}
      if (searchItem !== '') {
        axios.post('/api/books/matchbooks', MyParams)
        .then((response) => {
          setSearchResults(response.data)
        }).catch((error) => {
          if ((error.response.status === 401) || (error.response.status === 422)){
              setAuth(false)
          }
          console.log(error)
        })
      }
      else {
        setSearchResults([])
      }
    }, [searchItem, findby, sortby, sortOrder])

    const exit = (e) => {
        e.preventDefault()
        localStorage.removeItem("jwt_token")
        setAuth(false)
        setlogin('')
    }

    const handleChange = e => {
      setSearchItem(e.target.value)
    }

    const handleRadioChange = e => {
      setFindby(e.target.value)
    }

    const handleSelectChange = e => {
      setSortby(e.target.value)
    }

    const handleOrderChange = () => {
      if (sortOrder == 'v'){
        setSortOrder('^')
      }
      else {
        setSortOrder('v')
      }
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
            <div>
              <Container fluid>
                <Row className='mb-4'>
                  <div className='text-center fs-3 mt-5'>
                    <input 
                      type="text"
                      placeholder="Поиск"
                      className='w-50'
                      value={searchItem}
                      onChange={handleChange}
                    />
                  </div>
                </Row>
                <Row className='d-flex align-items-center'>
                  <Col xs={8}>
                    <ButtonGroup className='ml-5'>
                      <ToggleButton key='1' id='1' type="radio" variant="outline-secondary" value='name' checked={findby === 'name'} onChange={handleRadioChange}>
                        по названию
                      </ToggleButton>
                      <ToggleButton key='2' id='2' type="radio" variant="outline-secondary" value='author' checked={findby === 'author'} onChange={handleRadioChange}>
                        по автору
                      </ToggleButton>
                    </ButtonGroup>
                  </Col>
                  <Col>
                    Сортировать по
                  </Col>
                  <Col>
                    <Form.Select aria-label='Default select example' onChange={handleSelectChange}>
                      <option value='name'>алфавиту</option>
                      <option value='year'>году выпуска</option>
                      <option value='page'>количеству страниц</option>
                    </Form.Select>
                  </Col>
                  <Col xs={1}>
                    <div className='w-50 d-grid'>
                      <Button onClick={handleOrderChange}>{sortOrder}</Button>
                    </div>
                  </Col>
                </Row>
              </Container>
              <Container fluid className='mt-4'>
                    {searchResults.map(book => (
                      <Row><Col /*className='d-flex justify-content-center'*/ key={book['name']}><ListedBook book={book} /></Col></Row>
                    ))}
              </Container>
            </div>
          </div>
        }
      </>
    );
  }
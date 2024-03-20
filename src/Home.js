import axios from 'axios'
import React, {useState, useEffect} from 'react'
import Header from './components/Header'
import ReactLoading from 'react-loading'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Home() {
    const [login, setlogin] = useState('')
    const [authorized, setAuth] = useState(false)
    const [searchItem, setSearchItem] = useState('')
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
    }, [])

    const exit = (event) => {
        event.preventDefault()
        localStorage.removeItem("jwt_token")
        setAuth(false)
        setlogin('')
    }

    const handleChange = e => {
      setSearchItem(e.target.value)
    }

    return (
      <>
        {loading ?
          <div className="App-loading">
            <ReactLoading className='position-absolute top-50 start-50 translate-middle' type="spinningBubbles" color="#2081F9" height={150} width={150}/>
          </div>
        :
          <div>
            <Header authorized={authorized} login={login} exit={exit} page={'/'}/>
            <div style={{ backgroundImage: 'url(/background.jpg)', height: '700px' }}>
              <div className='d-flex justify-content-center align-items-center text-center fs-5' style={{height: '500px'}}>
                <input 
                  type="text"
                  placeholder="Поиск"
                  className='w-50'
                  value={searchItem}
                  onChange={handleChange}
                />
                <Link className='ml-2' to='/search' state={{'searchItem': searchItem}}>
                  <Button>Поиск</Button>
                </Link>
              </div>
            </div>
          </div>
        }
      </>
    );
  }
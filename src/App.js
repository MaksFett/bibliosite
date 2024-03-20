import { Route, Routes } from 'react-router-dom'
import Home from './Home.js'
import Autho from './Authorization.js'
import Reg from './Registration.js'
import Book from './Book.js'
import Search from './Search.js'
import Lk from './Lk.js'
import User_books from './User_books.js'
import Categories from './Categories.js'
import Authors from './Authors.js'
import './bootstrap.min.css';

function App(){
  return(
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/search' element={<Search/>}/>
      <Route path='/book' element={<Book/>}/>
      <Route path='/authorization' element={<Autho/>}/>
      <Route path='/registration' element={<Reg/>}/>
      <Route path='/lk' element={<Lk/>}/>
      <Route path='/user_books' element={<User_books/>}/>
      <Route path='/categories' element={<Categories/>}/>
      <Route path='/authors' element={<Authors/>}/>
    </Routes>
  )
}

export default App;

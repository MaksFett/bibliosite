import {Link} from 'react-router-dom'
import {Button} from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

function Header(props){
    return(
        <Navbar expand="lg" className="p-2 bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">Библиотека</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Главная</Nav.Link>
                    <Nav.Link href="/search">Поиск</Nav.Link>
                    <Nav.Link href="/categories">Категории</Nav.Link>
                    <Nav.Link href="/authors">Авторы</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            <div className="text-end m-1">
                {props.authorized ?
                    <NavDropdown title={props.login} drop='start'>
                        <NavDropdown.Item href="/lk">Личный кабинет</NavDropdown.Item>
                        <NavDropdown.Item href="/user_books">Мои книги</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={props.exit}>Выход</NavDropdown.Item>
                    </NavDropdown>
                    :
                    <Link className='m-3' to="/authorization" state={{'curr_page': props.page, 'book': props.book}}>
                        <Button>Войти/Регистрация</Button>
                    </Link>
                }
            </div>
        </Navbar>
    )
}

export default Header;
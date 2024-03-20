import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

function ListedBook(props){
    const handleClick = () => {
        navigate('/book', {state : props.book})
    }
    return(
        <div>
            <Card className='m-2 w-75'>
                <Card.Body>
                    <Card.Title onClick={handleClick}>{props.book['name']}</Card.Title>
                    <Card.Text>
                        <div className='container'>
                            <div className='row'>
                                <div className='col'>Автор: {props.book['author']}</div> 
                                <div className='col'>Год выпуска: {props.book['year']}</div> 
                                <div className='col'>Кол-во страниц: {props.book['page']}</div>
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
                <div className='d-flex justify-content-start'>
                    <Button className='m-2 w-25' onClick={handleClick}>Читать</Button>
                </div>
            </Card>
        </div>
    )
}

export default ListedBook;
import spinner from '../../res/spinner.svg'
import './Spinner.css'

const Spinner = ({...rest}) => {
    return (
        <div className="Spinner" style={{...rest.style}}>
            <img style={{width: "100px"}} src={spinner} />
        </div>
    )
}

export default Spinner
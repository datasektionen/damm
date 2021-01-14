import spinner from '../../res/spinner.svg'
import './Spinner.css'

const Spinner = ({width = "100px", ...rest}) => {
    return (
        <div className="Spinner" style={{...rest.style}}>
            <img style={{width}} src={spinner} />
        </div>
    )
}

export default Spinner
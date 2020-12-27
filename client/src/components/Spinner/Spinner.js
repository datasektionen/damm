import spinner from '../../res/spinner.svg'
import './Spinner.css'

const Spinner = ({height = "100%", ...rest}) => {
    return (
        <div className="Spinner" style={{height}}>
            <img style={{width: "100px"}} src={spinner} />
        </div>
    )
}

export default Spinner
import spinner from '../res/spinner.svg'

const Spinner = ({height = "100%", ...rest}) => {
    return (
        <div style={{width: "100%", height, display: "flex", alignItems: "center", justifyContent: "center"}}><img style={{width: "100px"}} src={spinner} /></div>
    )
}

export default Spinner
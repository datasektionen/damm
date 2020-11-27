import React, { useState } from 'react'
import "./FileUploader.css"

const FileUploader = ({setFileCallback = () => {}, style= {}}) => {

    const fileInput = React.useRef(null);
    const [hover, setHover] = useState(false)
    const [file, setFile] = useState(undefined)
    const [preview, setPreview] = useState("")
    const [error, setError] = useState("")

    const handleDrop = e => {
        e.stopPropagation()
        e.preventDefault()
        handleFile(e.dataTransfer.files[0])
    }

    const reset = _ => {
        setFile(undefined)
        setPreview("")
        setError("")
        setHover(false)
    }

    const handleFile = file => {
        setHover(false)
        // Should check bytes of file, but can do it backend...
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            setError("Ogiltig filtyp... Filen måste vara en bild")
            return
        }
        setError("")
        // Ugly?? hack, sends the resend function the the parent component so that it can reset the state of this component
        // When needed, ex on submition
        setFileCallback(file, reset)
        setFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleChange = e => {
        handleFile(e.target.files[0])
    }

    const handleClick = e => {
        setHover(false)
        if (e.target.className === "fas fa-times") {
            reset()
            return
        }
        if (file) return
        fileInput.current.click()
    }

    return (
        <div
            className="FileUploader"
            onDrop={e => {handleDrop(e)}}
            onDropCapture={e => handleDrop(e)}
            onDragOver={e => {e.preventDefault();setHover(true)}}
            onDrag={e => setHover(true)}
            onDragEnter={e => {setHover(true)}}
            onDragLeave={e => {setHover(false)}}
            onClick={handleClick}
            style={!file ? {cursor: "pointer", ...style} : {...style}}
        >
            <i className="fas fa-times" style={file ? {} : {display: "none"}}/>
            <input
                type="file"
                style={{display: "none"}}
                onChange={handleChange}
                ref={fileInput}
            />
            {!hover ?

                file ?
                    <div>
                        <div><img draggable="false" src={preview} /></div>
                        <div style={{margin: "5px"}}>{file.name}</div>
                    </div>
                :
                <div>
                    <i className="fas fa-upload"></i>
                    <div><b>Ladda upp en bild på märket</b></div>
                    <div style={{color: "#757575"}}><b>Du kan dra och släppa en fil här</b></div>
                    {error && <div style={{color: "red"}}>{error}</div>}
                </div>
            :
                <div>
                    <i className="fas fa-upload"></i>
                    <div><b>Släpp filen här</b></div>
                </div>
            }
        </div>
    )
}

export default FileUploader
import React from 'react'
import moment from 'moment'

const PatchDetailedAdminView = ({files = [], orders = [], removeFile}) => {
    return (
        <div className="patchadmincontent">
            <div className="col files">
                <h4><b>Filer</b></h4>
                {files.map((file,i) =>
                    <div
                        key={"file-"+i}
                        className="file"
                    >
                        <i className="fas fa-trash" onClick={_ => removeFile(file.url)}/>
                        {" "}
                        <a href={file.url} target="_blank" rel="noopener noreferrer"> {file.name}</a>
                    </div>
                )}
            </div>
            <div className="col">
                <h4><b>Beställningar</b></h4>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Företag</th>
                        <th>Referensnummer</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order =>
                        <tr>
                            <td>{moment(order.date).format("YYYY-MM-DD")}</td>
                            <td>{order.company}</td>
                            <td>{order.order}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default PatchDetailedAdminView
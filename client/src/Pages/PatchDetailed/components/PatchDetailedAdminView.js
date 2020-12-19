import React from 'react'
import moment from 'moment'

const PatchDetailedAdminView = ({files = [], orders = [], removeFile, comment = ""}) => {
    return (
        <div className="patchadmincontent">
            <div className="row admin">
                <div className="col files">
                    <h4><b>Filer</b></h4>
                    {files.length === 0 ?
                        "Inga filer finns"
                        :
                        files.map((file,i) =>
                            <div
                                key={"file-"+i}
                                className="file"
                            >
                                <i className="fas fa-trash" onClick={_ => removeFile(file.url)}/>
                                {" "}
                                <a href={file.url} target="_blank" rel="noopener noreferrer"> {file.name}</a>
                            </div>
                        )
                    }
                </div>
                <div className="col">
                    <div className="colcol">
                        <h4><b>Beställningshistorik</b></h4>
                        {orders.length === 0 ?
                            "Ingen historik finns"
                            :
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Datum</th>
                                    <th>Antal</th>
                                    <th>Företag</th>
                                    <th>Referensnummer</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map(order =>
                                    <tr>
                                        <td>{moment(order.date).format("YYYY-MM-DD")}</td>
                                        <td>{order.amount}</td>
                                        <td>{order.company}</td>
                                        <td>{order.order}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        } 
                    </div>
                    <div className="colcol">
                        <h4><b>Information</b></h4>
                        <div className="comment">
                            {comment.length === 0 ? "Ingen information finns" : comment}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PatchDetailedAdminView
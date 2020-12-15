import React from 'react'
import './Home.css'
import logo from '../../skold.png'

const Home = ({}) => {
    return (
        <div className="Home">
            <div className="Header">
                <div>
                    <img src={logo} alt="Datasektionens sköld" className="Logo" />
                    <h1>Konglig Datasektionens</h1>
                    <h2>Historiasystem</h2>
                </div>
            </div>
            <div className="Body">
                <div className="row">
                    <div className="col title">
                        {/* <h1>Damm - Sektionens historiasystem</h1> */}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet posuere sapien, et varius nisl. Nunc felis quam, iaculis eget mi non, consectetur volutpat est. Fusce vitae ex lectus. Morbi id nisi ultrices, accumsan libero a, tincidunt velit. Pellentesque vitae quam ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas dapibus pretium dictum. Nullam facilisis ullamcorper enim, ac lacinia nisl congue a. Quisque aliquam porta diam, a molestie nisl ullamcorper eu. Phasellus pellentesque velit mi, sed suscipit lectus maximus eu. Etiam lacinia erat nec dolor varius, vitae tincidunt nulla bibendum. Proin dignissim mi ut massa volutpat malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h2>Om</h2>
                        Damm är <a target="_blank" rel="noopener noreferrer" href="https://datasektionen.se">Konglig Datasektionens</a> system för att bokföra historia. Systemet är skrivet av Axel Elmarsson och Jonas Dahl.
                    </div>
                    <div className="col">
                        <h2>Hjälp</h2>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet posuere sapien, et varius nisl. Nunc felis quam, iaculis eget mi non, consectetur volutpat est. Fusce vitae ex lectus. Morbi id nisi ultrices, accumsan libero a, tincidunt velit. Pellentesque vitae quam ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas dapibus pretium dictum. Nullam facilisis ullamcorper enim, ac lacinia nisl congue a. Quisque aliquam porta diam, a molestie nisl ullamcorper eu. Phasellus pellentesque velit mi, sed suscipit lectus maximus eu. Etiam lacinia erat nec dolor varius, vitae tincidunt nulla bibendum. Proin dignissim mi ut massa volutpat malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                    <div className="col">
                        <h2>Något som inte funkar?</h2>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/datasektionen/damm/issues/new">Skapa en issue på Github</a>. Vill du vara med och utveckla sektionens system kan du komma förbi en Hackerkväll som ibland anordnas på torsdagar av IOR.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
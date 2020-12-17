import React from 'react'
import './Home.css'
import logo from '../../skold.png'

/**
 * The Home page
 * The default page that loads when you go to "/"
 * Displays meta information about Damm.
 */

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
                        <p>Damm är <a target="_blank" rel="noopener noreferrer" href="https://datasektionen.se">Konglig Datasektionens</a> system för att bokföra historia. Systemet gör detta på tre sätt: tidslinjen, märkesarkivet och museet. Tidslinjen visar viktiga och mindre viktiga händelser i sektionens ypperligt intressanta historia. Märkesarkivet arkiverar alla märken som producerats på sektionen och visar upp dem så att man lätt kan kolla igenom dem (tidigare, innan Damm färdigställdes, lagrades en kopia (förhoppningsvis) av varje märke i en proppfull papperspåse). Museet är inte färdigt än, men kommer bli ungefär som märkesarkivet. Sedan finns det eventuellt också andra filer här på damm som är historiskt viktiga (om vi ska ta bort afs).</p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquet posuere sapien, et varius nisl. Nunc felis quam, iaculis eget mi non, consectetur volutpat est. Fusce vitae ex lectus. Morbi id nisi ultrices, accumsan libero a, tincidunt velit. Pellentesque vitae quam ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Maecenas dapibus pretium dictum. Nullam facilisis ullamcorper enim, ac lacinia nisl congue a. Quisque aliquam porta diam, a molestie nisl ullamcorper eu. Phasellus pellentesque velit mi, sed suscipit lectus maximus eu. Etiam lacinia erat nec dolor varius, vitae tincidunt nulla bibendum. Proin dignissim mi ut massa volutpat malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <h2>Om</h2>
                        Systemet började byggas under en vecka i januari 2018 av Jonas Dahl. En tidslinje färdigställdes och deployades. Sedan lämnades projektet i lite mer än två år innan någon byggde vidare. Axel Elmarsson fortsatte utvecklingen av systemet, som blev färdigt i början av 2021.
                    </div>
                    <div className="col">
                        <h2>Hjälp</h2>
                        Sidan administreras huvudsakligen av sektionshistorikern(a). Hen kan nås via <a target="_blank" rel="noopener noreferrer" href="mailto:historiker@d.kth.se">mail</a> eller annat godtyckligt kommunikationsmedel som fungerar.
                    </div>
                    <div className="col">
                        <h2>Något som inte funkar?</h2>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/datasektionen/damm/issues/new">Skapa en issue på Github</a>, alternativt kontakta sidadiminstratörerna eller <a target="_blank" rel="noopener noreferrer" href="mailto:d-sys@d.kth.se">systemansvarig</a>. Vill du vara med och utveckla sektionens system kan du komma förbi en Hackerkväll som ibland anordnas på torsdagar av IOR (systemansvarig och hens undersåtar).
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
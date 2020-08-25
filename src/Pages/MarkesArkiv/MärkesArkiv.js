import React from 'react'
import './MärkesArkiv.css'
import Märke from './Märke'

import Sektionmärket from './Sektionsmärket.jpg'
import Sjöslaget from './Sjöslaget 2010.jpg'

import moment from 'moment'

const MärkesArkiv = () => {
    return (
        <div>
            <Märke
                image={Sektionmärket}
                title="Konglig Datasektionens sektionsmärke"
                description="Beskrivning"
                date={moment(Date.now())}
                numProduced={100}
                tags={[{text: "Gasque", hoverText: "Override test", color: "red", backgroundColor: "blue"}, {text: "2020", hoverTitle: "EWDWDAWDAW"}, {text: "Sektionen"}, {text: "Sektionen"}]}
            />
            <Märke
                image={Sjöslaget}
                title="Sjöslaget 2010 testar ett extra långt namn långt ord Flaggstångsknoppsputsmedel testar ett extra långt namn långt ord Flaggstångsknoppsputsmedel"
                description="Beskrivning"
                date={moment(new Date('October 17, 2010 03:24:00'))}
                numProduced={100}
            />  
        </div>
    )
}

export default MärkesArkiv
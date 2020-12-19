import React from 'react'
import General from '../Pages/Historia/cards/General'
import DFunkt from '../Pages/Historia/cards/DFunkt'
import SM from '../Pages/Historia/cards/SM'
import Anniversary from '../Pages/Historia/cards/Anniversary'

const templates = {
	dfunkt: {
		title: 'Funktionärer tillträder',
		template: (c, i) => <DFunkt order={i} data={c} key={'card-' + i} />
	},
	sm: {
		title: 'SM och DM',
		template: (c, i) => <SM order={i} data={c} key={'card-' + i} />
	},
	anniversary: {
		title: 'Årsdagar',
		template: (c, i) => <Anniversary order={i} data={c} key={'card-' + i} />
	},
	general: {
		title: 'Generell historia',
		template: (c, i) => <General order={i} data={c} key={'card-' + i} />
	},
}

export default templates
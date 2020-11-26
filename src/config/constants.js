const EVENT_TYPES = {
	DFUNKT: "dfunkt",
	SM_DM: "sm",
	ANNIVERSARY: "anniversary",
	GENERAL: "general"
}

const EVENT_TYPE_TO_STRING = {
    general: "Generell historia",
    "anniversary": "Årsdagar"
}

const PRICE_TYPES = {
    FREE: "Gratis",
    NOT_FOR_SALE: "Säljs ej",
    UNKNOWN: "Okänt",
    SET_PRICE: "Ange pris",
}

module.exports = {
    EVENT_TYPES,
    PRICE_TYPES,
    EVENT_TYPE_TO_STRING
}
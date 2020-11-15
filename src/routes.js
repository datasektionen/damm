export const TOKEN = '/token/:token'

export const HOME = '/';
export const ADMIN = '/admin';
export const MUSEUM = '/museum';
export const SKAPA_HÄNDELSE = '/skapa/handelse';
export const HANTERA_HÄNDELSER = '/admin/handelser';
export const HELP = '/om';
export const LOGIN = '/login';
export const LOGOUT = '/logout';
export const MÄRKESARKIV = '/markesarkiv';
export const MÄRKE = '/marke/:id'
export const EVENT = '/event/:id'
export const SKAPA_MÄRKE = '/admin/marke/skapa'
export const MÄRKESTAGGAR = '/admin/markestaggar/hantera'

//API
export const API_CREATE_PATCH = '/api/admin/marke/create'
export const API_MÄRKE_GET_IMG_PATH = '/api/file'
export const API_GET_TAGS = '/api/tags'
export const API_GET_MÄRKEN ='/api/marken'
export const API_IS_ADMIN ='/api/isAdmin'
export const API_UPDATE_TAG = '/api/admin/tag/update'
export const API_CREATE_TAG = '/api/admin/tag/create'
export const API_DELETE_TAG = '/api/admin/tag/delete'
export const API_GET_PATCH = '/api/marke/id/'
export const API_CREATE_EVENT = '/api/event/create'
export const API_ACCEPT_EVENT = '/api/admin/event/accept'
export const API_DELETE_EVENT = '/api/admin/event/delete'
export const API_UPDATE_EVENT = '/api/admin/event/update'
export const API_GET_ALL_EVENTS = '/api/event/all'
export const API_GET_EVENT = '/api/event/id'
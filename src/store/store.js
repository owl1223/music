import reducer from "./reducer.js";

import {createStore,applyMiddleware} from "redux";

import thunk from "redux-thunk";

let store = createStore(
    reducer,
    applyMiddleware(thunk)
);


export default store;
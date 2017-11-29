import * as types from '../actions/actionTypes';

const initialState = [];

export default function items(state = initialState, action) {
    switch (action.type) {
        case types.ITEM_CREATED:
            return [...state, action.item];
    	
    	case types.ITEM_DELETED:
    		return [
    			...state.filter((x) => x.id !== action.id)
    		];

        default:
            return state;
    }
}
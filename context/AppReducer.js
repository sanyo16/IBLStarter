export const initialState = {};

export const AppReducer = (state, action) =>
{
    switch (action.type) {        
        case "getInitialState":
            return action.value;
        case "addOutput": {
            return {...state, [action.value.name] : action.value.value};
        }
        default:
            return action.value;
    };
};

export const initialState = {
    number: 0,
 };

export const AppReducer = (state, action) => {
    switch (action.type) {
        case "init_stored": {
            return action.value
        }

        case "add_number": {        
            return {
                ...state,
                number: action.value + state.number,
            };
        }

        case "add_output": {
            return {
                ...state,
                [action.value.name] : action.value.value
            };
        }
    }
};

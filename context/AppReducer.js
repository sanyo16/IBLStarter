export const initialState = {};

export const AppReducer = (state, action) =>
{
    switch (action.type) {
        case "init_stored":
            return action.value;
        case "add_output": {
            return {...state, [action.value.name] : action.value.value};
        }
    }
};

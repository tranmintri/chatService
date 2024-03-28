import { createContext, useContext, useReducer } from "react";

// Tạo một context mới
export const StateContext = createContext();

// Tạo một StateProvider component, nhận initialState, reducer và children như props
export const StateProvider = ({ initialState, reducer, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

// Tạo một custom hook để sử dụng context trong ứng dụng của bạn
export const useStateProvider = () => useContext(StateContext);

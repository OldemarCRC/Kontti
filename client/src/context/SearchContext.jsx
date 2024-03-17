import { createContext, useReducer } from "react";

// Specific date
const date = new Date();

// Add days to specified date
date.setDate(date.getDate() + 2);

const INITIAL_STATE = {
  city: undefined,
  dates: [
    {
      startDate: new Date(),
      endDate: date,
      key: "selection",
    },
  ],
  options: {
    adult: 1,
    children: 0,
    room: 1,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "UPDATE_DATES":
      return { ...state, dates: action.payload };
    case "UPDATE_OPTIONS":
      return { ...state, options: action.payload };
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};


export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

import { useEffect, useReducer, useRef } from "react";

const initialState = { loading: false, error: undefined, data: undefined };

// Reducer actions
const ACTIONS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// Reducer function
const fetchReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOADING: {
      return { ...initialState, loading: true };
    }
    case ACTIONS.SUCCESS: {
      return {
        ...initialState,
        data: action.payload,
      };
    }
    case ACTIONS.ERROR: {
      return {
        ...initialState,
        error: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

const useFetch = (url, options) => {
  const cache = useRef({});
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // If no url is provided, do nothing
    if (!url) return;
    // Initialize AbortController for cleanup
    const abortController = new AbortController();

    // Fetch data
    const fetchData = async () => {
      dispatch({ type: ACTIONS.LOADING });

      // If a cache exists for this url, return it
      if (cache.current[url]) {
        dispatch({ type: "fetched", payload: cache.current[url] });
        return;
      }

      try {
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        });

        // Throw an error if the request failed
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        cache.current[url] = data;
        dispatch({
          type: ACTIONS.SUCCESS,
          payload: data,
        });
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(`Error while fetching data: ${error.message}`);
          dispatch({
            type: ACTIONS.ERROR,
            payload: error,
          });
        }
      }
    };
    fetchData();

    return function cleanup() {
      abortController.abort();
    };
  }, [url, options]);
  return state;
};

export default useFetch;

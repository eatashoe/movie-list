import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchData, fetchNewUser, fetchRated } from './omdbAPI';

const initialState = {
    userID: -1,
    result: false,
    predictions: false,
    searchValue: '',
    searchLoaded: false,
    resultRatings: [],
    rated: false,
    status: 'idle'
};

export const updateAsyncPredictions = createAsyncThunk(
    'search/fetchPredictions',
    async (data) => {
        const response = await fetchData(data);
        return response.json();
    }
);

export const updateAsyncResult = createAsyncThunk(
    'search/fetchResults',
    async (data) => {
        const response = await fetchData(data);
        return response.json();
    }
);

export const updateAsyncNewUser = createAsyncThunk(
    'search/fetchNewUser',
    async (data) => {
        const response = await fetchNewUser(data);
        return response.json();
    }
);

export const updateAsyncRated = createAsyncThunk(
    'search/fetchRated',
    async (data) => {
        const response = await fetchRated(data);
        return response.json();
    }
);

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setUserID: (state, action) => {
            state.userID = action.payload;
        },
        setSearchValue: (state, action) => {
            state.searchValue = action.payload;
        },
        concatSearchValue: (state,action) => ({
            ...state,
            searchValue: state.searchValue.concat(action.payload)
        }),
        removeSearchValue: (state) => ({
            ...state,
            searchValue: state.searchValue.substring(0, state.searchValue.length > 0 ?
                                                        state.searchValue.length-1 : 0)
        }),
        setSearchLoaded: (state, action) => {
            state.searchLoaded = action.payload;
        },
        clearSearchValue: (state) => {
            state.searchValue = '';
        },
        clearPredictions: (state) =>{
            state.predictions = false;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(updateAsyncPredictions.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updateAsyncPredictions.fulfilled, (state, action) => {
          state.status = 'idle';
          state.predictions = action.payload;
        })
        .addCase(updateAsyncResult.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(updateAsyncResult.fulfilled, (state, action) => {
            state.status = 'idle';
            state.result = action.payload;
            state.resultRatings = action.payload.Rating;
        })
        .addCase(updateAsyncNewUser.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(updateAsyncNewUser.fulfilled, (state, action) => {
            state.status = 'idle';
            console.log('new user', action.payload.data);
            state.userID = action.payload.data;
            localStorage.setItem('userID', action.payload.data);
        })
        .addCase(updateAsyncRated.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(updateAsyncRated.fulfilled, (state, action) => {
            state.status = 'idle';
            state.rated = action.payload;
        })
    },
  });

export const { setSearchValue,concatSearchValue, setSearchLoaded, clearSearchValue, removeSearchValue, clearPredictions, setUserID} = searchSlice.actions;

export const selectResult = (state) => state.search.result;
export const selectPredictions = (state) => state.search.predictions;
export const selectSearchLoaded = (state) => state.search.searchLoaded;
export const selectSearchValue = (state) => state.search.searchValue;
export const selectResultRatings = (state) => state.search.resultRatings;
export const selectUserID = (state) => state.search.userID;
export const selectRated = (state) => state.search.rated;

export default searchSlice.reducer;

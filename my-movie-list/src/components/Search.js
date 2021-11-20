import React from 'react';
import styled from 'styled-components'
import { useSelector, useDispatch } from 'react-redux';
import { createAction } from '@reduxjs/toolkit';
import {
    selectSearchLoaded,
    setSearchLoaded,
    selectSearchValue,
    concatSearchValue,
    setSearchValue,
    clearSearchValue,
    removeSearchValue,
    updateAsyncPredictions,
    selectPredictions,
    clearPredictions,
    updateAsyncResult,
    updateAsyncRatings,
    selectResult
} from './searchSlice';
import useClickOut from './useClickOut';

const SearchBarContainer = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    box-shadow: 0px 2px 5px lightgrey;
    border-radius: 30px;
    position: relative;
    &:hover{
        box-shadow: 0px 2px 5px grey;
    }
    margin-top: 15px;
    background: white;
    @media (min-width: 800px) {
        width:50vw;
        margin-top: 0px;
        margin:10px 0px 10px 0px;
    }
`
const SearchBar = styled.textarea`
    width: 100%;
    // max-width: 100vw;
    height: 1em;
    background: transparent;
    border:none;
    outline: none;
    resize: none;
    overflow: none;
    white-space: nowrap;
    font-size: 20px;
    margin: 10px 20px 0px 15px;
    font-family: 'Nunito', sans-serif;
`
const SearchIcon = styled.i`
    margin: 10px 0px 10px 20px;
    transform: scale(0.75) translateY(-1px);
    color: darkgrey;
`
const SearchClearIcon = styled.i`
    margin: 10px 0px 10px 0px;
    padding-right: 15px;
    color: grey;
    border-right: 1px darkgrey solid;
    cursor: pointer;
    transform: translateY(2px);
`
const GuessContainer = styled.div`
    // border: 1px solid;
    margin: 0px 20px 5px 20px;
    border-top: 1px solid lightgrey;
    // height: 200px;
`
const Prediction = styled.div`
    width: 100%;
    display: flex;
    font-size: 16px;
    font-family: 'Nunito', sans-serif;
    &:hover{
        background: lightgrey;
    }
`
const Search = (props) => {
    const dispatch = useDispatch();
    const searchLoaded = useSelector(selectSearchLoaded);
    const searchValue = useSelector(selectSearchValue);
    const predictions = useSelector(selectPredictions);
    const results = useSelector(selectResult);

    const searchBarRef = React.useRef(null);
    const clearSearchRef = React.useRef(null);
    const predictionRef = React.useRef(null);

    useClickOut(searchBarRef,clearSearchRef,predictionRef);

    function keyDownHandler(e){
        // console.log("nice",e.key);
        if(e.key.length > 1){
            if(e.key === "Enter"){
                e.preventDefault();
                dispatch(setSearchLoaded(false));
                dispatch(updateAsyncResult(searchValue.trim()));
                searchBarRef.current.blur();
            }
            else if(e.key === "Backspace"){
                if(searchValue.length <= 1 || searchBarRef.current.value.length <= 1){
                    dispatch(clearSearchValue());
                    dispatch(clearPredictions());
                }
                else{
                    dispatch(removeSearchValue());
                }
            }
        }
        else{
            dispatch(concatSearchValue(e.key));
        }
        if(searchValue.trim().length >= 1){
            dispatch(updateAsyncPredictions(searchValue.trim()));
        }
    }
    function clearSearch(){
        searchBarRef.current.value = "";
        dispatch(clearSearchValue());
        dispatch(clearPredictions());
    }
    function loadPredictions(){
        var p = [];
        predictions.Search.map((value, i) => (
            p.push(
                <Prediction ref={predictionRef} onClick={() => {
                    searchBarRef.current.value = value.Title;
                    dispatch(setSearchValue(value.Title));
                    dispatch(updateAsyncResult(value.Title));
                    dispatch(setSearchLoaded(false));
                    searchBarRef.current.blur();
                }} key={i}>
                    <SearchIcon style={{margin:"10px 0px 10px 0px", fontSize: "24px"}} className="fas fa-search"></SearchIcon>
                    <span style={{margin:"10px 20px 10px 15px", wordWrap: "break-word",width: "100%"}}>{value.Title}</span>
                </Prediction>
            )
        ));
        return p;
    }
    return(
        <SearchBarContainer ref={props.r}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', width: 'calc(100% - 96.5px)'}}>
                    {
                        searchLoaded
                        ?
                        <SearchIcon className="fas fa-search"></SearchIcon>
                        :
                        null
                    } 
                    <SearchBar ref={searchBarRef}
                        onFocus={() => dispatch(setSearchLoaded(true))}
                        // onBlur={() => dispatch(setSearchLoaded(false))}
                        onKeyDown={keyDownHandler}
                        ></SearchBar>
                </div>
                <div>
                    {
                        searchValue.length > 0
                        ?
                        <SearchClearIcon 
                            ref={clearSearchRef}
                            className="fas fa-times"
                            onClick={clearSearch}
                        ></SearchClearIcon>
                        :
                        null
                    }
                    <SearchIcon className="fas fa-search"
                        style={{color: 'royalblue', transform: 'scale(1) translateY(2px)', cursor: 'pointer', marginRight: '20px'}}
                        onClick={() => dispatch(updateAsyncResult(searchValue.trim()))}
                    ></SearchIcon>
                </div>
            </div>
            {
                predictions.Response === 'True' && searchLoaded
                ?
                <GuessContainer ref={predictionRef}>
                    {loadPredictions()}
                </GuessContainer>
                :
                null
            }
        </SearchBarContainer>
    );
}

export default Search;
import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectResult,selectResultRatings, selectSearchValue, selectUserID, updateAsyncResult } from './searchSlice';
import {postData} from './omdbAPI';

const ResultContainer = styled.div`
    // width: 100vw;
    margin: 0px 30px 5px 30px;
    font-size: 19px;
    display: flex;
    @media (min-width: 800px) {
        margin: 0px 0px 5px 210px;
    }
`
const VoteIcon = styled.i`
    font-size: 30px;
    cursor: pointer;
    color: ${props => props.vote > 0 ? "gold" : ""};
    ::after{
        font-family:'Nunito', sans-serif;
        position: absolute;
        font-size: 12px;
        content: "${props => props.vote}";
        transform: translateX(3.5px) translateY(10px);
        color: dimgray;
        opacity: 0;
    }
    &:hover{
        filter: brightness(1.5);
        ::after{
            opacity: 1;
        }
    }
`
const Results = () => {
    const dispatch = useDispatch();
    const userID = useSelector(selectUserID);
    const searchValue = useSelector(selectSearchValue);
    const results = useSelector(selectResult);
    const resultRatings = useSelector(selectResultRatings);

    function handleVote(type, movie){
        const d = JSON.stringify({type: type, user: userID, movie: movie});
        postData('http://localhost:5000/movies/post', d).then((response) => {
            console.log(response.status);
            dispatch(updateAsyncResult(searchValue));
        });
    }

    function loadResults(){
        var r = []; 
        results.Search.map((value, i) => {  
            r.push(
                <ResultContainer key={i}>
                    <div style={{ alignItems:'center',alignSelf: 'center',display:'flex',flexDirection:'column',fontSize:'20px',margin:'15px 25px 15px 5px',color: 'brown'}}>
                        <VoteIcon vote={resultRatings[i].upvote} className="fas fa-caret-up"
                            onClick={() => handleVote('upvote', value.imdbID)}></VoteIcon>
                        <span>{resultRatings[i].upvote - resultRatings[i].downvote}</span>
                        <VoteIcon vote={resultRatings[i].downvote} className="fas fa-caret-down"
                            onClick={() => handleVote('downvote', value.imdbID)}
                        ></VoteIcon>
                    </div>
                    <img src={value.Poster} style={{width: '15vh'}} ></img>
                    <div style={{display: 'flex',flexDirection:'column'}}>
                        <span style={{margin:"10px 20px 10px 15px", wordWrap: "break-word",width: "100%"}}
                        >{value.Title}</span>
                        <div>
                            <b style={{margin:"10px 0px 10px 15px",fontSize:'17px',color: 'grey'}}>{value.Type.charAt(0).toUpperCase() + value.Type.slice(1)}</b>
                            <span style={{margin:"10px 20px 10px 10px", fontSize:"15px",color: 'grey'}}><b style={{fontSize:"17px"}}>Year: </b>{value.Year}</span>
                        </div>
                    </div>
                </ResultContainer>
            )
        });
        return r;
    }
    return(
        <div>
            {
                results.Response === 'True'
                ?
                loadResults()
                :
                <ResultContainer>
                    <span style={{  margin:"10px 20px 10px 15px", 
                                    wordWrap: "break-word",
                                    width: "100%"}}>
                        {results.Error}
                    </span>
                </ResultContainer>
                
            }
        </div>
    );
}

export default Results;
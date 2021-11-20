import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux'; 
import { updateAsyncRated, selectUserID, selectRated } from './searchSlice';
import { postData } from './omdbAPI';

const Bar = styled.div`
    margin: 10px 30px 5px 39px;
    font-size: 19px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (min-width: 800px) {
        margin: -15px 30px 5px 39px;
    }
`
const VoteIcon = styled.i`
    font-size: 30px;
    cursor: pointer;
    color: ${props => props.vote > 0 ? "gold" : "brown"};
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
const VoteToggle = styled.i`
    font-size: 30px;
    cursor: pointer;
    color: ${props => props.vote ? "gold" : "brown"};
    ::after{
        font-family:'Nunito', sans-serif;
        position: absolute;
        font-size: 10px;
        content: "${props => props.type}";
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
const ResultContainer = styled.div`
    // width: 100vw;
    margin: 0px 30px 5px 30px;
    font-size: 19px;
    display: flex;
    @media (min-width: 800px) {
        margin: 0px 0px 5px 210px;
    }
`

const Rated = () => {
    const dispatch = useDispatch();
    const userID = useSelector(selectUserID);
    const rated = useSelector(selectRated);
    const [toggle, setToggle] = React.useState(true);
    const API = process.env.NODE_ENV === 'production' ? 'https://winston-movie-list.herokuapp.com/' : 'http://localhost:5000/';

    React.useEffect(() => {
        dispatch(updateAsyncRated(userID));
    }, []);

    function handleVote(type, movie){
        const d = JSON.stringify({type: type, user: userID, movie: movie});
        postData(API+'movies/post', d).then((response) => {
            console.log(response.status);
            dispatch(updateAsyncRated(userID));
        });
    }

    function loadData(type){
        console.log(rated);
        var r = []; 
        if(type){
            rated.upvotes.map((value, i) => {  
                r.push(
                    <ResultContainer key={i}>
                        <div style={{ alignItems:'center',alignSelf: 'center',display:'flex',flexDirection:'column',fontSize:'20px',margin:'15px 25px 15px 5px',color: 'brown'}}>
                            <VoteIcon vote={value.upvote} className="fas fa-caret-up"
                                onClick={() => handleVote('upvote', value.imdbID)}></VoteIcon>
                            <span>{value.upvote - value.downvote}</span>
                            <VoteIcon vote={value.downvote} className="fas fa-caret-down"
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
        }
        else{
            rated.downvotes.map((value, i) => {  
                r.push(
                    <ResultContainer key={i}>
                        <div style={{ alignItems:'center',alignSelf: 'center',display:'flex',flexDirection:'column',fontSize:'20px',margin:'15px 25px 15px 5px',color: 'brown'}}>
                            <VoteIcon vote={value.upvote} className="fas fa-caret-up"
                                onClick={() => handleVote('upvote', value.imdbID)}></VoteIcon>
                            <span>{value.upvote - value.downvote}</span>
                            <VoteIcon vote={value.downvote} className="fas fa-caret-down"
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
        }
        return r;
    }

    return(
        <div>
            <Bar>
                <span style={{color: "brown"}}>Movies You've Rated:</span>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <VoteToggle type={"upvotes"} vote={toggle} style={{marginRight: "25px"}} className="fas fa-caret-up"
                                onClick={() => setToggle(true)}></VoteToggle>
                    <VoteToggle type={"downvotes"} vote={!toggle}style={{marginRight: "25px"}} className="fas fa-caret-down"
                                onClick={() => setToggle(false)}></VoteToggle>
                </div>
            </Bar>
            {
                rated 
                ?
                loadData(toggle)
                :
                null
            }
        </div>
    );
}

export default Rated;
import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Search from './components/Search';
import Results from './components/Results';
import {useDispatch} from 'react-redux'; 
import { setUserID, updateAsyncNewUser} from './components/searchSlice';
import Rated from './components/Rated';

const Header = styled.div`
  width: auto;
  max-width: calc(100vw - 60px);
  height: 100px;
  font-size: 24px;
  padding: 30px 30px 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .mobile{
    color: gold;
    margin-right: 20px;
    cursor: pointer;
    &:hover{
      filter: brightness(1.1);
    }
  }
  .desktop{
    display: none;
    color: gold;
    cursor: pointer;
    margin:20px 0px 20px 0px;
    &:hover{
      filter: brightness(1.1);
    }
  }
  .title{
    width:100%;
    display:flex;
    justify-content:space-between;
  }
  @media (min-width: 800px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    height: 70px;
    .mobile{
      display:none;
    }
    .desktop{
      display: block;
      margin-left: calc(100vw - 50vw - 293px);
      margin-right: 21px;
    }
    .title{
      width: 185px;
      display:flex;
      justify-content: flex-start;
      margin:15px 0px 25px 0px;
    }
  }
`
function App() {
  const searchRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (localStorage.getItem('userID') !== null) {
      dispatch(setUserID(Number(localStorage.getItem('userID'))));
    } else {
      dispatch(updateAsyncNewUser());
    }
  },[]);

  return (
    <Router>
      <Header ref={headerRef}>
        <div className="title">
            <Link style={{textDecoration: 'none', color: 'brown'}}  to="/"
                  onClick={() => {
                    searchRef.current.style.display = 'flex';
                    searchRef.current.style.pointerEvents= 'auto';
                    if(window.innerWidth > 800){
                      headerRef.current.style.height = '70px';
                    }
                    else{
                      headerRef.current.style.height = '100px';
                    }
                  }}>
              <div style={{paddingLeft: '10px'}}>
                  <i style={{ marginRight: "5px"}} className="fas fa-film"></i>
                  <span style={{fontFamily: "'Nunito', sans-serif"}}>MyMovieList</span>
              </div>
            </Link>
            <Link style={{textDecoration: 'none'}} to="/rated"
                  onClick={() => {
                    searchRef.current.style.display = 'none';
                    searchRef.current.style.pointerEvents= 'none';
                    headerRef.current.style.height = 'auto';
                  }}>
              <i className="fas fa-star mobile"></i>
            </Link>
        </div>
        <Search r={searchRef}></Search>
        <Link style={{textDecoration: 'none'}}  to="/rated"
              onClick={() => {
                searchRef.current.style.display = 'none';
                searchRef.current.style.pointerEvents= 'none';
                headerRef.current.style.height = 'auto';
              }}>
          <i className="fas fa-star desktop"></i>
        </Link>
      </Header>
      <Switch>
        <Route path="/rated">
          <Rated></Rated>
        </Route>
        <Route path="/">
          <Results></Results>
        </Route>
      </Switch> 
    </Router>
  );
}

export default App;

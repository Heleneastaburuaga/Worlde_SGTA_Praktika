import React, { useEffect, useState } from 'react';
import {Main, Header, GameSection, TileContainer, TileRow, Tile} from './estiloa';
import "./App.css";

function Irabazi() {

  

  return(
    <div>
      <Main>
        <Header>
          Irabazi duzu!
        </Header>
        <button onClick={() => window.location.reload()}>Jolastu berriro</button>
      </Main>
    </div>
  );
 
}

export default Irabazi;
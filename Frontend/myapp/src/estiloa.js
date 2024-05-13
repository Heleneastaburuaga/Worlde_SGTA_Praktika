import styled from 'styled-components';

const Main = styled.main`
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;

  border-bottom: 1px solid #3a3a3c;

  margin-top: 30px;
  
  font-weight: 700;
  font-size: 3.6rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
`;

const GameSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-top: 30px;
`;

const TileContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-gap: 5px;
  
  height: 290px;
  width: 280px;
  border-radius: 10px;
`;

const TileRow = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
`;

const Tile = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  background-color: ${props => props.bgColor || '#FFF'};
  border: 2px solid #3a3a3c;
  font-size: 2.2rem;
  font-weight: bold;
  line-height: 2.2rem;
  text-transform: uppercase;
  border-radius: 5px;
`;

export {Main, Header, GameSection, TileContainer, TileRow, Tile};
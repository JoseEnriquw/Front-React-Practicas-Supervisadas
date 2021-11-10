import styled from 'styled-components';

export const DivTable = styled.div`
margin-left: 8rem;
margin-right: 0rem;
margin-top: 1rem;
min-width: 60rem;
@media screen and (max-width: 960px){
    min-width: 20rem;
    justify-content: center;
    flex-direction: column;
    margin-top: 5rem;
    display: flex;
}

`

export const DivSideBar = styled.div`
    display: block;
    max-width: 5rem;
    justify-items: left;
    margin-top: 12rem;
    @media screen and (max-width: 960px){
    max-width: 10rem;
    justify-content: center;
    flex-direction: column;
    margin-top: 5rem;
    display: flex;
}


`

export const DivCenter = styled.div`
    display: flex;
    //justify-content: center;
    @media screen and (max-width: 960px){
    max-width: 10rem;
    justify-content: center;
    flex-direction: column;
}

`
export const DivBarraBusqueda = styled.div`
      display: inline-grid;
      max-width: rem;
      margin-left: 3rem;
      min-width: 35rem;

`
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice.js';

import HeroesListItem from "../heroesListItem/HeroesListItem.js";
import Spinner from '../spinner/Spinner.js';

import './heroesList.scss';

const HeroesList = () => {

    const { 
        data: heroes = [], 
        // isFetching, // последующий запрос к серверу
        isLoading, // первое обращение к серверу ?
        // isSuccess, // данные загрузились успешно
        isError, // ошибка при общении с сервером
        // error // сама ощибка 
        } = useGetHeroesQuery();

    const [deleteHero] = useDeleteHeroMutation();
    
    const activeFilter = useSelector(state => state.filters.activeFilter);

    const filteredHeroes = useMemo(() => {
        const filteredHeroes = heroes.slice(); 
        
        if (activeFilter === 'all') {
            return filteredHeroes;
        } else {
            return filteredHeroes.filter(item => item.element === activeFilter)
        }
    }, [heroes, activeFilter]);


    // Удаление персонажа по его id
   const onDelete = useCallback((id) => {
        deleteHero(id);
    }, [deleteHero]);

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition 
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;
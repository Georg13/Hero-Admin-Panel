import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const HEROES_KEY = 'heroes';

// Helpers
const loadFromStorage = () => {
    const data = localStorage.getItem(HEROES_KEY);
    return data ? JSON.parse(data) : null;
};

const saveToStorage = (heroes) => {
    localStorage.setItem(HEROES_KEY, JSON.stringify(heroes));
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    tagTypes: ['Heroes'],
    endpoints: builder => ({

        getHeroes: builder.query({
            async queryFn() {
                try {
                    // Сначала смотрим в localStorage
                    const stored = loadFromStorage();
                    if (stored) {
                        return { data: stored };
                    }
                    // Если пусто — грузим из файла
                    const url = process.env.NODE_ENV === 'production'
                        ? `${process.env.REACT_APP_API_URL}/heroes.json`
                        : `${process.env.REACT_APP_API_URL}/heroes`;

                    const response = await fetch(url);
                    const data = await response.json();
                    saveToStorage(data);
                    return { data };
                } catch (error) {
                    return { error: error.message };
                }
            },
            providesTags: ['Heroes']
        }),

        createHero: builder.mutation({
            async queryFn(hero) {
                try {
                    const heroes = loadFromStorage() || [];
                    const updated = [...heroes, hero];
                    saveToStorage(updated);
                    return { data: hero };
                } catch (error) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Heroes']
        }),

        deleteHero: builder.mutation({
            async queryFn(id) {
                try {
                    const heroes = loadFromStorage() || [];
                    const updated = heroes.filter(h => h.id !== id);
                    saveToStorage(updated);
                    return { data: id };
                } catch (error) {
                    return { error: error.message };
                }
            },
            invalidatesTags: ['Heroes']
        })
    })
});

export const { useGetHeroesQuery, useCreateHeroMutation, useDeleteHeroMutation } = apiSlice;
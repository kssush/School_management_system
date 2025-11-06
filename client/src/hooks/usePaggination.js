import React, { useEffect, useMemo, useState } from "react";

const usePaggination = ({data = [], countOfPage = 5}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        setLastPage(Math.ceil(data.length / countOfPage) - 1); // counting of page from zero
        setCurrentPage(0);
    }, [data]);

    const currentItem = useMemo(() => {
        if(!data || data.length == 0) return [];

        return data.slice(countOfPage * currentPage, (currentPage + 1) * countOfPage);
    }, [data, countOfPage, currentPage])


    const nextPage = () => {
        if(currentPage + 1 <= lastPage) setCurrentPage(prev => prev + 1)
    }

    const previosPage = () => {
        if(currentPage - 1 >= 0) setCurrentPage(prev => prev - 1)
    }

    const hasNext = currentPage < lastPage;
    const hasPrevios = currentPage > 0;
    
    return {currentItem, hasNext, hasPrevios, nextPage, previosPage};
};

export default usePaggination;

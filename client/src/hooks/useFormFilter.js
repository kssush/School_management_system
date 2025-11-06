import { useState, useEffect, useMemo } from 'react';

const useFormHelper = (data, searchQuery, sortConfig) => {
    const [currentItem, setCurrentItem] = useState(null);
    const [processedData, setProcessedData] = useState([]);

    const filteredAndSortedData = useMemo(() => {
        if (!data) return [];

        let result = [...data];

        // Поиск
        if (searchQuery?.trim()) {
            const searchFields = ['name', 'surname', 'patronymic', 'class', 'telephone'];
            const searchTerm = searchQuery.toLowerCase().trim();
            
            result = result.filter(item =>
                searchFields.some(field => {
                    const fieldValue = item[field];
                    return fieldValue && String(fieldValue).toLowerCase().includes(searchTerm);
                })
            );
        }

        // Сортировка
        const activeSorts = Object.entries(sortConfig || {}).filter(([_, value]) => value !== null);
        
        if (activeSorts.length > 0) {
            result.sort((a, b) => {
                for (const [key, direction] of activeSorts) {
                    let aValue, bValue;

                    switch (key) {
                        case 'name':
                            aValue = a.surname || '';
                            bValue = b.surname || '';
                            break;
                        case 'class':
                            aValue = `${a.number || ''}${a.letter || ''}`;
                            bValue = `${b.number || ''}${b.letter || ''}`;
                            break;
                        default:
                            aValue = a[key] || '';
                            bValue = b[key] || '';
                    }

                    if (aValue !== bValue) {
                        // direction: false = возрастание, true = убывание
                        return direction ? 
                            bValue.localeCompare(aValue) : // убывание (true)
                            aValue.localeCompare(bValue);  // возрастание (false)
                    }
                }
                return 0;
            });
        }

        return result;
    }, [data, searchQuery, sortConfig]);

    useEffect(() => {
        setProcessedData(filteredAndSortedData);
    }, [filteredAndSortedData]);

    return {
        currentItem,
        setCurrentItem,
        processedData
    };
};

export default useFormHelper;
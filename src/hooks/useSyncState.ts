import { useState } from 'react';

const useStateSync = <T>(initialValue: T) => {
    const [state, updateState] = useState(initialValue);

    let current = state;

    const get = () => current;

    const set = (newValue: T) => {
        current = newValue;
        updateState(newValue);
        return current;
    };

    return {
        get,
        set,
    };
};

export default useStateSync;

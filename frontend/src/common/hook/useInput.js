import { useState } from 'react';

/**
 * 공통으로 사용될 useInput hook
 * @param {*} initialValue input의 초기값
 * @returns {[any, function, function]} value, handler, setValue를 반환
 */

const useInput = (initialValue = '') => {
    // value state
    const [value, setValue] = useState(initialValue);

    // handler
    const handler = (e) => {
        setValue(e.target.value);
    };

    // return [value, handler, setValue]
    return [value, handler, setValue];
};

export default useInput;
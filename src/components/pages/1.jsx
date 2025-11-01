import { useEffect, useState } from 'react';

const givenDate = 1757413363445;
const getGap = (date1, date2) => {
    let gap = date2 - date1;
    const Hours = Math.floor(gap / 1000 / 60 / 60);
    gap %= (1000 * 60 * 60);
    const Minutes = Math.floor(gap / 1000 / 60);
    gap %= (1000 * 60);
    const Seconds = Math.floor((gap / 1000));
    return Hours + ':' + Minutes + ':' + Seconds;
};
const Component = () => {
    const [date, setDate] = useState('');
    useEffect(() => {
        const internalId = setInterval(() => {
            const newDate = new Date();
            setDate(getGap(newDate.getTime(), givenDate));
        }, 1000);
        return () => {
            clearInterval(internalId);
        };
    }, []);
    return (
        <div>
            {date}
        </div>
    );
};
export default Component;
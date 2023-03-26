/* @jsx createElement */

import { createElement, useState, useEffect } from './react.ts';

const CoffeeList = () => {
  const [coffees, setCoffees] = useState([
    { title: '에스프레소' },
    { title: '아메리카노' },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setCoffees([{ title: '아메리카노' }, { title: '에스프레스' }]);
    }, 2000);
  }, []);

  return (
    <ul>
      {coffees.map(({ title }) => (
        <li>{title}</li>
      ))}
    </ul>
  );
};

export default CoffeeList;

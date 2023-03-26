/* @jsx createElement */

import { createReactRoot, createElement, renderRealDOM } from './react.ts';
import CoffeeList from './app.js';

const root = createReactRoot(document.querySelector('#root'));
root.render(CoffeeList);

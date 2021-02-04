const calculator = document.querySelector(".calculator");
const keys = document.querySelector(".container");
const display = document.querySelector(".t-number");


keys.addEventListener('click',e=>{


  if (e.target.matches('button')) {

    const key = e.target;
    const action = key.dataset.action;
    const displayContent = display.textContent;
    const type = 'mouse';

    const resultString = createResultString(e.target,displayContent,calculator.dataset,type)
    display.textContent = resultString;
    updateCalculatorState(key,calculator,resultString,displayContent,type);

  }
})

document.addEventListener('keydown',e=>{


  const key = e.key;
  const displayContent = display.textContent;
  const type = 'keyboard';

  if(key === 'Enter') e.preventDefault();

  const resultString = createResultString(key,displayContent,calculator.dataset,type);
  display.textContent = resultString;
  updateCalculatorState(key,calculator,resultString,displayContent,type);
})


const createResultString = (key,displayContent,state,type) => {

  let  keyType;
  let keyContent;
  const previousKeyType = state.previousKeyType;
  const firstValue = state.firstValue;
  const operator = state.operator;
  const modValue = state.modValue;

  if(type === 'mouse'){
    keyType = getKeyType(key);
    keyContent = key.textContent;
    action = key.dataset.action;
  }
  else{
    keyType = getKeyTypeKeyboard(key);
    keyContent = key;
  }

  if(keyType === 'number'){

    if(displayContent === '0' || previousKeyType === 'operator' || previousKeyType === 'solve' || previousKeyType === 'unaryOperator'){
      return keyContent;
    }
    else {
      return displayContent + keyContent;
    }
  }

  if (keyType === 'decimal') {

    if(!displayContent.includes('.')) return displayContent + '.';
    if (previousKeyType === 'operator' || previousKeyType === 'solve') return '0.';
    return displayContent;
  }

  if (keyType === 'operator'){
    const firstValue = calculator.dataset.firstValue;
    const operator = calculator.dataset.operator;

    return firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'solve' && previousKeyType !== 'unaryOperator'
      ? calculate(firstValue, operator, displayContent)
      : displayContent;
    }

    if(keyType === 'unaryOperator'){
      return previousKeyType === 'number' || previousKeyType === 'operator' || previousKeyType === 'solve' || previousKeyType === 'unaryOperator'||
      previousKeyType === 'int' ? unarySolution(displayContent,action)
      :displayContent;
      }


    if (keyType === 'int') {
      return parseFloat(displayContent) > 0
      ?  '-' + parseFloat(displayContent)
      :  displayContent.replace('-','');
    }

    if (keyType === 'clear'|| keyType === 'allClear') {
      return 0;
    }

    if (keyType === 'delete') {

      return displayContent.length === 1 ? 0 :displayContent.slice(0,-1);

    }

    if (keyType === 'solve') {

      if (firstValue) {
        return previousKeyType === 'solve' ? calculate(displayContent,operator,firstValue) : calculate(firstValue,operator,displayContent);
        }
      else{
         return displayContent;
       }
    }

    if (type === 'keyboard') {
      if(key === 'Shift' || key ==='Control' || key === 'Tab' || key === 'CapsLock' || key === 'Alt' || key === 'AltGraph')
      return displayContent;
    }
}


const updateCalculatorState = (key,calculator,calcValue,displayContent,type) =>{

  const firstValue = calculator.dataset.firstValue;
  const operator = calculator.dataset.operator;

  if(type === 'mouse'){
    keyType = getKeyType(key);
    action = key.dataset.action;
  }
  else{
    keyType = getKeyTypeKeyboard(key);
    action = determineOperator(key);
  }
  calculator.dataset.previousKeyType = keyType;

  if(keyType === 'operator'){
    const firstValue = calculator.dataset.firstValue;
    //calculator.dataset.operator = key.dataset.action
    calculator.dataset.operator =action;
    calculator.dataset.firstValue = firstValue && operator && previousKeyType !== 'operator' &&
    previousKeyType !== 'calculate'&& previousKeyType != 'unaryOperator'
    ? calcValue
    : displayContent;
  }

  if(keyType === 'solve'){
    calculator.dataset.modValue = firstValue && previousKeyType === 'solve'
   ? modValue
   : displayContent;
  }

  if(keyType === 'allClear'){
    calculator.dataset.firstValue = '';
    calculator.dataset.modValue = '';
    calculator.dataset.operator = '';
    calculator.dataset.previousKeyType = '';
  }
}

const getKeyType = (key) => {
  const action = key.dataset.action;
  if(!action) return 'number';
  if(action === 'add' || action === 'subtract' || action === 'multiply' || action === 'divide' ) return 'operator';
  if(action === 'square' || action === 'cube' || action === 'resiprocol' || action === 'squareRoot' || action === 'per') return 'unaryOperator';
  return action;
}

const getKeyTypeKeyboard = (key) => {
  if (isFinite(key)) return 'number';
  if (key === '.') return 'decimal'
  if (key == '+'|| key === '-' || key === '*' || key === '/' ) return 'operator';
  if (key === 'Enter' || key === '=') return 'solve';
  if(key === 'Backspace') return 'delete';
}

const determineOperator = (key) =>{
  if(key === '+') return 'add';
  if(key === '-') return 'subtract';
  if(key === '*') return 'multiply';
  if(key === '/') return 'divide';
}

function calculate(n1,op,n2) {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (op === 'add')
  return firstNum + secondNum;
  if (op === 'subtract')
  return firstNum - secondNum;
  if (op === 'multiply')
  return firstNum * secondNum;
  if (op === 'divide')
  return firstNum / secondNum;

}


function unarySolution(n,op) {
  const value = parseFloat(n);
  if(op === 'square')
  return value * value;
  if (op === 'cube')
  return value * value * value;
  if(op === 'resiprocol')
  return 1/value;
  if(op === 'squareRoot')
  return Math.sqrt(value);
  if (op === 'per')
  return value/100;
}

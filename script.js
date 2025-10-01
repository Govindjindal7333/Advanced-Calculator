(function(){
  const exprEl = document.getElementById('expression');
  const resEl = document.getElementById('result');
  const buttons = document.querySelectorAll('.pad .btn');
  const historyList = document.getElementById('historyList');
  const memoryValEl = document.getElementById('memoryVal');

  let expression = '';
  let memory = 0;
  let lastAnswer = 0;
  let parenOpen = false;

  function safeEval(exp){
    const map = {'÷':'/', '×':'*', '−':'-', 'π':'Math.PI'};
    exp = exp.replace(/[×÷−π]/g, matched=>map[matched]||matched);
    exp = exp.replace(/sin\(/g,'Math.sin(');
    exp = exp.replace(/cos\(/g,'Math.cos(');
    exp = exp.replace(/tan\(/g,'Math.tan(');
    exp = exp.replace(/ln\(/g,'Math.log(');
    exp = exp.replace(/log10\(/g,'Math.log10(');
    exp = exp.replace(/sqrt\(/g,'Math.sqrt(');
    exp = exp.replace(/e/g,'Math.E');
    exp = exp.replace(/(\d+)!/g,'factorial($1)');
    exp = exp.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
    try{
      const fn = new Function('factorial', 'Math', 'with(Math){return ('+exp+')}');
      return fn(factorial, Math);
    }catch(e){return 'Error';}
  }

  function factorial(n){n=Number(n);if(n<0||!Number.isInteger(n))return 'Error';let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
  function updateScreen(){exprEl.textContent=expression||'0';resEl.textContent=lastAnswer||'0';}
  function pushHistory(exp,val){const div=document.createElement('div');div.className='history-item';div.textContent=exp+' = '+val;historyList.prepend(div);}
  function handleAction(action){
    switch(action){
      case 'mc':memory=0;memoryValEl.textContent=memory;break;
      case 'mr':expression+=String(memory);break;
      case 'mplus':memory+=lastAnswer||0;memoryValEl.textContent=memory;break;
      case 'mminus':memory-=lastAnswer||0;memoryValEl.textContent=memory;break;
      case 'paren':expression+=parenOpen?')':'(';parenOpen=!parenOpen;break;
      case 'pow':expression+='Math.pow(';break;
      case 'percent':expression+='%';break;
      case 'factorial':expression+='!';break;
      case 'pi':expression+='π';break;
      case 'e':expression+='e';break;
      case 'equals':compute();break;
    }updateScreen();
  }
  function compute(){if(!expression)return;let val=safeEval(expression);lastAnswer=val;pushHistory(expression,val);expression=String(val);updateScreen();}
  buttons.forEach(btn=>{btn.addEventListener('click',()=>{const v=btn.getAttribute('data-value');const a=btn.getAttribute('data-action');if(a)handleAction(a);else if(v){expression+=v;updateScreen();}})});
  document.getElementById('clearAll').addEventListener('click',()=>{expression='';lastAnswer=0;updateScreen();});
  document.getElementById('themeBtn').addEventListener('click',()=>{document.body.classList.toggle('light');});
  window.addEventListener('keydown',(ev)=>{if(/[0-9]/.test(ev.key)){expression+=ev.key;updateScreen();}else if(ev.key=='.'){expression+='.';updateScreen();}else if(ev.key=='Enter'){compute();}else if(ev.key=='Backspace'){expression=expression.slice(0,-1);updateScreen();}else if(['+','-','*','/'].includes(ev.key)){expression+=ev.key;updateScreen();}});
  updateScreen();
})();

let getHighlightingText = () => {
    let text = document.getElementsByClassName('regexp')[0].value;
    let flag = document.getElementsByClassName('flag')[0].value;
    flag = flag.replace(/[^gimy]/g, '');
    let resultP = document.getElementsByClassName('resultP')[0];
    let regExp = flag.length ? new RegExp(text, flag) : new RegExp(text);
    let str = resultP.innerHTML;
    str = str.replace(regExp, '<mark>$&</mark>');
    resultP.innerHTML = str;
};

let setStringToRegex = (elem) => {
    let text = elem.value;
    document.getElementsByClassName('resultP')[0].innerHTML = text;
    document.getElementsByClassName('result')[0].style.display = 'block';
    elem.style.display = 'none';
    getHighlightingText();
};

let hideDiv = elem => {
    elem.style.display = 'none';
    let textarea = document.getElementsByClassName('textarea')[0];
    textarea.style.display = 'block';
    textarea.focus();

};
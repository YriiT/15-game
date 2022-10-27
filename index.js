const body = document.getElementById('body');

const empty = 'empty';
const initialMatrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
const correctOrder = JSON.stringify(initialMatrix.flat())
let movesCount = 0;
const availableMovements = initialMatrix.reduce((prev, curent, y) => {
    prev[y] = curent.reduce((prevValue, _, currentIndex) => {
        if (y === 0) {
            switch (currentIndex) {
                case 0:
                    prevValue[currentIndex] = [{ x: currentIndex, y: y + 1 }, { x: currentIndex + 1, y }]
                    break;
                case 1:
                case 2:
                    prevValue[currentIndex] = [{ x: currentIndex - 1, y }, { x: currentIndex + 1, y }, { x: currentIndex, y: y + 1 }]
                    break;
                case 3:
                    prevValue[currentIndex] = [{ x: currentIndex - 1, y }, { x: currentIndex, y: y + 1 }]
                    break;
            }
        }
        if (y === 3) {
            switch (currentIndex) {
                case 0:
                    prevValue[currentIndex] = [{ x: currentIndex, y: y - 1 }, { x: currentIndex + 1, y }]
                    break;
                case 1:
                case 2:
                    prevValue[currentIndex] = [{ x: currentIndex - 1, y }, { x: currentIndex + 1, y }, { x: currentIndex, y: y - 1 }]
                    break;
                case 3:
                    prevValue[currentIndex] = [{ x: currentIndex - 1, y }, { x: currentIndex, y: y - 1 }]
                    break;
            }
        }
        if (y === 1 || y === 2) {
            switch (currentIndex) {
                case 0:
                case 2:
                    prevValue[currentIndex] = [{ x: currentIndex, y: y - 1 }, { x: currentIndex, y: y + 1 }, { x: currentIndex + 1, y }]
                    break;
                case 1:
                    prevValue[currentIndex] = [{ x: currentIndex - 1, y }, { x: currentIndex + 1, y }, { x: currentIndex + 1, y }, { x: currentIndex - 1, y }]
                    break;
                case 3:
                    prevValue[currentIndex] = [{ x: currentIndex, y: y - 1 }, { x: currentIndex, y: y + 1 }, { x: currentIndex, y: y - 1 }]
                    break;
            }
        }
        return prevValue
    }, {})
    return prev
}, {})

const wrapper = createElement({ className: 'wrapper' });
const winText = createElement({ className: 'win-text' });
const shaflButton = createElement({ element: 'button', className: 'shafl', text: 'Новая игра' });

const headerWrapper = createElement({ className: 'game-header' });
const header = createElement({ element: 'h1', text: 'Пятнашки' });

shaflButton.onclick = handleShaflClick

let buttonAray = initialMatrix.map((item, idx) => {
    return item.map((btn, btnIndex) => {
        const text = idx === 3 && btnIndex === 3 ? '' : btn;
        const styles = translateButton(btnIndex, idx)
        const className = `item ${text === '' ? empty : ''}`
        return createElement({ className, text, styles })
    })
})


const flatButtonArray = buttonAray.flat()

flatButtonArray.forEach(btn => {
    if (!btn.classList.contains(empty)) {
        btn.addEventListener('click', btn.addEventListener('click', handleClickItem))
    }
})

handleShaflClick()

headerWrapper.append(header)
body.append(headerWrapper)
wrapper.append(...flatButtonArray)
body.append(wrapper, shaflButton)
// body.append(shaflButton)



function createElement({ element = 'div', className, text, styles }) {

    const el = document.createElement(element)
    if (className) { el.className = className; }
    if (text !== undefined) { el.innerText = text }
    if (styles !== undefined) {
        el.style = styles
    }
    return el
}


function translateButton(x, y) {
    return `transform: translate(${x * 100}%, ${y * 100}%)`
}

function handleClickItem(e) {
    const selectedElementCoord = getCoordinats(buttonAray, e.target.innerText);
    swapItem(selectedElementCoord)
    movesCount += 1;
    if (isGameFinish()) {
        shaflButton.style.visibility = 'visible'
        wrapper.classList.add('win')
        winText.innerText = `Вы выйграли за ${movesCount} ${plural(['ход', 'хода', "ходов"], movesCount)}!!!`
        wrapper.append(winText)
    }
}


function handleShaflClick() {
    shaflButton.style.visibility = 'hidden'
    wrapper.classList.remove('win')

    movesCount = 0;
    for (let i = 0; i <= 200; i++) {
        const { y, x } = getCoordinats(buttonAray);
        const availableMoves = availableMovements[y][x];
        winText.innerText = ''
        swapItem(availableMoves[getRandom(availableMoves.length)]);
    }
}


function getCoordinats(nodes, elementText) {
    return nodes.reduce((result, nodeArray, currentIndex) => {
        if (result.x === null || result.y == null) {
            const x = findElemenIdx(nodeArray, elementText)
            if (x >= 0) {
                result.x = x;
                result.y = currentIndex
            }
        }
        return result
    }, { x: null, y: null })
}

/* 
 / swap item
 */
function swapItem(selectedElementCoord) {
    const emptyElementCoord = getCoordinats(buttonAray);
    const { x, y } = selectedElementCoord

    const { x: ex, y: ey } = emptyElementCoord;

    if (isValidSwap(selectedElementCoord, emptyElementCoord)) {
        const element = buttonAray[y][x];
        const emptyElement = buttonAray[ey][ex];

        element.style = translateButton(ex, ey);
        emptyElement.style = translateButton(x, y);

        buttonAray[y][x] = emptyElement;
        buttonAray[ey][ex] = element

        buttonAray[y][x].classList.add(empty)
        buttonAray[ey][ex].classList.remove(empty)
    }
}

function getRandom(value) {
    return Math.floor(Math.random() * value)
}

function findElemenIdx(nodeArray, elementText) {
    return nodeArray.findIndex(item => elementText ? item.innerText === elementText : item.classList.contains(empty))
}

function isValidSwap(a, b) {
    return (a.x == b.x || a.y == b.y) && (Math.abs(a.x - b.x) === 1 || Math.abs(a.y - b.y) === 1)
}

function isGameFinish() {
    const buttons = buttonAray.flat()

    for (let i = 0; i < 15; i++) {
        if (parseInt(buttons[i].innerText) !== i + 1) {
            return false;
        }
    }
    return true;
}
function plural(forms, n) {
    let idx;
    // @see http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html
    if (n % 10 === 1 && n % 100 !== 11) {
        idx = 0; // many
    } else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
        idx = 1; // few
    } else {
        idx = 2; // one
    }
    return forms[idx] || '';
}
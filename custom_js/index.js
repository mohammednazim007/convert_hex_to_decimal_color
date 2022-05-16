/**
 * sound effect control
 */

let tune = new Audio('tune/beep.mp3')

const colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
    '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
    '#99E6E6', '#6666FF'];

/**
 * preset div array
 */
let presetArray = new Array(10)


/**
 * main window onload call here
 */
window.onload = () => {
    let parent = document.querySelector('#preset')
    let getColor = JSON.parse(localStorage.getItem('preset'))
    let savePreset = document.querySelector('#savePreset')
    generatePreset(parent, colorArray)

    mainFn()
    if (getColor) {
        presetArray = getColor
        generatePreset(savePreset, getColor)
    }
}

/**
 * All refarance will collect in the mainFn
 * =====================================================
 */
let mainFn = () => {

    let randomBtn = document.querySelector('#randomBtn')
    let displayColor = document.querySelector('#displayColor')
    let hexColorInp = document.querySelector('#hexColorInp')
    let rgbColorInp = document.querySelector('#rgbColorInp')
    let copyBtn = document.querySelector('#copyBtn')
    let saveBtn = document.querySelector('#saveBtn')

    let redColorRange = document.querySelector('#redColorRange')
    let greenColorRange = document.querySelector('#greenColorRange')
    let blueColorRange = document.querySelector('#blueColorRange')
    let savePreset = document.querySelector('#savePreset')
    let radio_mode = document.getElementsByName('radio_mode')


    randomBtn.addEventListener('click', mainHandelarBtn(displayColor, hexColorInp, rgbColorInp))
    copyBtn.addEventListener('click', copyColorFn(hexColorInp, radio_mode))
    hexColorInp.addEventListener('keyup', keyUpHandeler)

    redColorRange.addEventListener('change', rangeHandelarFn)
    greenColorRange.addEventListener('change', rangeHandelarFn)
    blueColorRange.addEventListener('change', rangeHandelarFn)

    saveBtn.addEventListener('click', presetSaveHandelar(savePreset))
}

/**
 * All eventlistener will exicute 
 * =====================================================
 */


let presetSaveHandelar = (savePreset) => {
    return function () {
        let inputValue = `#${ document.querySelector('#hexColorInp').value }`
        let presetShow = document.querySelector('.presetShow')


        if (presetArray.includes(inputValue)) {
            alert(`${ inputValue } is alrady assigned`)
            return
        } else {

            presetArray.unshift(inputValue)
            if (presetArray.length > 12) {
                presetArray = presetArray.slice(0, 12)
            }
            removeElementFromArray(savePreset)
            generatePreset(savePreset, presetArray)

            localStorage.setItem('preset', JSON.stringify(presetArray))
        }

    }

}

/**
 * range handelar 
 */
let rangeHandelarFn = () => {
    let color = {
        red: parseInt(redColorRange.value),
        green: parseInt(greenColorRange.value),
        blue: parseInt(blueColorRange.value)
    }
    eventChangeFn(color)
    rangeRgbTohex(color)
}

/**
 * key up handelar & copy the color code with base on click
 * @param {input value} e 
 */
let keyUpHandeler = (e) => {
    let rgbColorInp = document.querySelector('#rgbColorInp')
    let value = `${ e.target.value }`.toUpperCase()
    let rgb = convertHexToRgb(value)

    if (value.length === 6) {
        let makeRgb = generateRgbFn(rgb)
        rgbColorInp.value = makeRgb
        displayColor.style.backgroundColor = `#${ value }`
        updateRefaranceFn(rgb)
    }
}

/**
 * copy hex color code with click
 */
let copyColorFn = (hexInputValue, radio_mode) => {
    return function () {
        console.log(hexInputValue.value.length);
        if (hexInputValue.value.length <= 6) {
            let hex_or_rgb = isRangeValeu(radio_mode)

            if (hex_or_rgb === 'hex') {

                if (hexInputValue.value) {
                    navigator.clipboard.writeText(`#${ hexInputValue.value }`.toLocaleUpperCase())
                    tune.volume = .4
                    tune.play()
                } else { alert('Not a valid color') }

            } else if (rgbColorInp.value) {

                let rgbColorInp = document.querySelector('#rgbColorInp').value
                navigator.clipboard.writeText(rgbColorInp)
            } else { alert('Not a valid color') }
        } else {
            alert('Not a valid color code!')
        }
    }
}

/**
 * main handelar button to controll
 */
let mainHandelarBtn = (displayColor, hexColorInp, rgbColorInp) => {
    return function () {
        let color = generateRgbColor()
        let hexColor = hexaDecimalColor(color)
        let rgbColor = hexToDecimal(color)

        displayColor.style.opacity = '0'
        displayColor.style.backgroundColor = `#${ hexColor }`
        displayColor.style.opacity = '1'
        hexColorInp.value = hexColor
        rgbColorInp.value = rgbColor
        updateRefaranceFn(color)

    }
}
/**
 * DOM related collection will exicute under the line
 * =====================================================
 */

/**
 * update all items with one click
 * @param {object} param0 
 */
let updateRefaranceFn = ({ red, green, blue }) => {

    document.querySelector('#red-label').innerHTML = red
    document.querySelector('#green-label').innerHTML = green
    document.querySelector('#blue-label').innerHTML = blue
    document.querySelector('#redColorRange').value = red
    document.querySelector('#greenColorRange').value = green
    document.querySelector('#blueColorRange').value = blue

}


/**
 // create color preset 
 * @param {color} parent 
 * @param {single div} color 
 */
let createColorPresetDiv = (color) => {
    let createDiv = document.createElement('div')
    createDiv.className = 'colorPreset'
    createDiv.style.backgroundColor = color
    createDiv.setAttribute('data-color', color)
    createDiv.addEventListener('click', function () {
        navigator.clipboard.writeText(color)
        tune.volume = .4
        tune.play()
    })
    return createDiv
}

/**
 * 
 * @param {object} parent 
 * @param {array} color 
 */
let generatePreset = (parent, color) => {
    color.forEach((colorValue) => {
        if (colorValue) {
            let createSingleDiv = createColorPresetDiv(colorValue)
            parent.appendChild(createSingleDiv)
        }
    })
}

/**
* utility function will be defined here
 * =============================================================
 */

// let getPresetFromLocalStorage = () => {
//     let pushParent = document.querySelector('#savePreset')
//     let getPreset = JSON.parse(localStorage.getItem('preset'))
//     // generatePreset(pushParent, getPreset)
//     console.log(getPreset, pushParent);
// }


/**
 * 
 * @param {*} node 
 * @returns 
 */
let removeElementFromArray = (parent) => {
    let child = parent.lastElementChild

    while (child) {
        parent.removeChild(child)
        child = parent.lastElementChild
    }
}

/**
 * 
 * @param {Array} value 
//  */
let isRangeValeu = (node) => {
    let rangeValue = null
    for (let i = 0; i < node.length; i++) {
        if (node[i].checked) {
            rangeValue = node[i].value
        }
    }
    return rangeValue
}
/**
 * generate rgb color from hex color
 * @param {object} param0 
 * @returns {string}
 */
let generateRgbFn = ({ red, green, blue }) => {
    return `rgb( ${ red }, ${ green }, ${ blue } )`;
}

/**
 * 
 * @param {string} color 
 */
let rangeRgbTohex = ({ red, green, blue }) => {
    let redHex = `${ red.toString(16) }${ green.toString(16) }${ blue.toString(16) }`
    document.querySelector('#hexColorInp').value = redHex
    displayColor.style.backgroundColor = `#${ redHex }`
}
/**
 * 
 * @param {object} e 
 */
let eventChangeFn = ({ red, green, blue }) => {
    let rgb = `rgb(${ red }, ${ green }, ${ blue })`
    document.querySelector('#red-label').innerHTML = red
    document.querySelector('#green-label').innerHTML = green
    document.querySelector('#blue-label').innerHTML = blue

    document.querySelector('#rgbColorInp').value = rgb

}

/**
 * 
 * @param {string} color 
 */
let convertHexToRgb = (color) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)
    return {
        red,
        green,
        blue,
    }
}
/**
 * 
 * @returns {object}
 */
let generateRgbColor = () => {
    let red = Math.round(Math.random() * 255)
    let green = Math.round(Math.random() * 255)
    let blue = Math.round(Math.random() * 255)
    return {
        red,
        green,
        blue,
    }
}

/**
 * 
 * @param {object} param0 
 * @returns {string}
 */
let hexaDecimalColor = ({ red, green, blue }) => {

    let toGetCode = (value) => {
        let hex = value.toString(16)
        return hex.length === 1 ? `0${ hex }` : hex
    }
    return `${ toGetCode(red) }${ toGetCode(green) }${ toGetCode(blue) }`.toUpperCase()
}

/**
 * convert hexaDecimal to rgb color code
 * @param {object} param0 
 * @returns {string}
 */
let hexToDecimal = ({ red, green, blue }) => {
    return `rgb(${ red }, ${ green }, ${ blue })`
}

/**
 * 
 * @param {string} color 
 * @returns 
 */
let isValid = (color) => {
    if (color.length !== 6) return false
    return /^[0-9A-Fa-f]{6}$/i.test(value)
}
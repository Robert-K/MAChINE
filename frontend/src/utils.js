// Nothing so see here...
const pattern = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]
let current = 0

let registered = false
let triggered = false

// Absolutely nothing to see here......
export function handleErrors() {
  const keyHandler = function (event) {
    if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
      current = 0
      return
    }
    current++
    if (pattern.length === current && !triggered) {
      triggered = true
      try {
        const error = new Audio('https://kosro.de/share/error.mp3')
        error.play()
        setInterval(() => {
          const img = document.createElement('img')
          img.src = 'https://kosro.de/share/failed.jpg'
          img.style.position = 'absolute'
          img.style.width = '30vw'
          img.style.zIndex = 1000000
          img.style.top = Math.floor(Math.random() * 69) + 'vh'
          img.style.left = Math.floor(Math.random() * 69) + 'vw'
          document.body.appendChild(img)
        }, 451)
      } catch (e) {
        console.log('You did it! No internet tho :/')
      }
    }
  }
  if (!registered) {
    document.addEventListener('keydown', keyHandler, false)
    registered = true
  }
}

// Converts camelCase to natural string
export const camelToNaturalString = (str) => {
  const splitAtCapitals = str.split(/(?=[A-Z][a-z])/)
  const strWithSpaces = splitAtCapitals.join(' ')
  const strValReplaced = strWithSpaces.replace('val_', 'validation_')
  const strCorrected = strValReplaced.replaceAll('_', ' ')
  return capitalizeWordsAfterSpaces(strCorrected)
}

// Capitalizes the first letter of each word
function capitalizeWordsAfterSpaces(text) {
  const words = text.split(' ')
  for (let i = 0; i < words.length; i++) {
    words[i] = `${words[i].charAt(0).toUpperCase()}${words[i].substring(1)}`
  }
  return words.join(' ')
}

/**
 * settable activation functions, correctly capitalized
 * @type {string[]}
 */
export const activationFuncs = [
  'Linear',
  'ReLU',
  'Sigmoid',
  'Softmax',
  'Softplus',
  'Softsign',
  'Tanh',
  'SELU',
  'ELU',
  'Exponential',
]

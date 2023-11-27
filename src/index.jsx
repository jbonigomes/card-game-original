import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactCardFlip from 'react-card-flip'
import ReactConfetti from 'react-confetti-explosion'

import { noop, shuffle } from 'lodash'
import { StatusBar } from '@capacitor/status-bar'

import apple from './images/apple.png'
import melon from './images/melon.png'
import banana from './images/banana.png'
import carrot from './images/carrot.png'
import grapes from './images/grapes.png'
import olives from './images/olives.png'
import onions from './images/onions.png'
import orange from './images/orange.png'
import tomato from './images/tomato.png'
import avocado from './images/avocado.png'
import peppers from './images/peppers.png'
import spinach from './images/spinach.png'
import broccoli from './images/broccoli.png'
import beetroot from './images/beetroot.png'
import cardback from './images/cardback.png'
import pumpkins from './images/pumpkins.png'
import aubergine from './images/aubergine.png'

import './index.css'

// Consider iOS build issue:
// https://stackoverflow.com/questions/76792138

const Game = () => {
  const [order, setOrder] = React.useState([])
  const [reset, setReset] = React.useState(false)
  const [lastDrawn, setLastDrawn] = React.useState(0)
  const [gameOver, setGameOver] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [viewReady, setViewReady] = React.useState(false)
  const [cards, setCards] = React.useState({
    1: { hidden: true, pair: 17, image: apple },
    2: { hidden: true, pair: 18, image: aubergine },
    3: { hidden: true, pair: 19, image: avocado },
    4: { hidden: true, pair: 20, image: banana },
    5: { hidden: true, pair: 21, image: beetroot },
    6: { hidden: true, pair: 22, image: broccoli },
    7: { hidden: true, pair: 23, image: carrot },
    8: { hidden: true, pair: 24, image: grapes },
    9: { hidden: true, pair: 25, image: melon },
    10: { hidden: true, pair: 26, image: olives },
    11: { hidden: true, pair: 27, image: onions },
    12: { hidden: true, pair: 28, image: orange },
    // 13: { hidden: true, pair: 29, image: peppers },
    // 14: { hidden: true, pair: 30, image: pumpkins },
    // 15: { hidden: true, pair: 31, image: spinach },
    // 16: { hidden: true, pair: 32, image: tomato },
    17: { hidden: true, pair: 1, image: apple },
    18: { hidden: true, pair: 2, image: aubergine },
    19: { hidden: true, pair: 3, image: avocado },
    20: { hidden: true, pair: 4, image: banana },
    21: { hidden: true, pair: 5, image: beetroot },
    22: { hidden: true, pair: 6, image: broccoli },
    23: { hidden: true, pair: 7, image: carrot },
    24: { hidden: true, pair: 8, image: grapes },
    25: { hidden: true, pair: 9, image: melon },
    26: { hidden: true, pair: 10, image: olives },
    27: { hidden: true, pair: 11, image: onions },
    28: { hidden: true, pair: 12, image: orange },
    // 29: { hidden: true, pair: 13, image: peppers },
    // 30: { hidden: true, pair: 14, image: pumpkins },
    // 31: { hidden: true, pair: 15, image: spinach },
    // 32: { hidden: true, pair: 16, image: tomato },
  })

  const flip = (id) => () => {
    setLastDrawn(cards[id].pair === lastDrawn ? 0 : +id)
    setCards({ ...cards, [id]: { ...cards[id], hidden: false } })

    // It's a miss
    if (lastDrawn && cards[id].pair !== lastDrawn) {
      setIsLoading(true)
      setTimeout(() => {
        setLastDrawn(0)
        setIsLoading(false)
        setCards({
          ...cards,
          [id]: { ...cards[id], hidden: true },
          [lastDrawn]: { ...cards[lastDrawn], hidden: true },
        })
      }, 900)
    }

    // Game over
    if (Object.values(cards).filter(({ hidden }) => hidden).length === 1) {
      setTimeout(() => setGameOver(true), 10)

      setTimeout(() => {
        setLastDrawn(0)
        setReset(!reset)
        setGameOver(false)
        setIsLoading(false)
        setCards(
          Object.entries(cards).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: { ...val, hidden: true },
          }), {})
        )
      }, 3000)
    }
  }

  React.useEffect(() => {
    window.screen.orientation.lock('landscape')
    StatusBar
      .hide()
      .then(() => setViewReady(true))
      .catch(() => setViewReady(true))
  }, [])

  React.useEffect(() => {
    setIsLoading(true)
    setOrder(shuffle(Object.keys(cards)))

    setTimeout(() => {
      setCards(
        Object.entries(cards).reduce((acc, [key, val]) => ({
          ...acc,
          [key]: { ...val, hidden: false },
        }), {})
      )
    }, 1000)

    setTimeout(() => {
      setIsLoading(false)
      setCards(
        Object.entries(cards).reduce((acc, [key, val]) => ({
          ...acc,
          [key]: { ...val, hidden: true },
        }), {})
      )
    }, 4000)
  }, [reset])

  return !viewReady ? <div /> : (
    <div className="board">
      {order.map((id) => (
        <button
          key={id}
          onClick={cards[id].hidden && !isLoading ? flip(id) : noop}
        >
          <ReactCardFlip
            infinite
            flipSpeedBackToFront={0.4}
            flipSpeedFrontToBack={0.4}
            isFlipped={!cards[id].hidden}
          >
            <div className="card card-back">
              <img src={cardback} />
            </div>
            <div className="card">
              <img src={cards[id].image} />
            </div>
          </ReactCardFlip>
        </button>
      ))}

      {gameOver && (
        <div className="confetti">
          <ReactConfetti particleCount={400} force={0.8} />
        </div>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Game/>
  </React.StrictMode>,
)

"use client";

import {MouseEventHandler, useEffect, useRef} from 'react'
import { Engine, Render, Bodies, World, Body, Events } from 'matter-js'

export function BuoyancySimulator() {
  const scene = useRef<HTMLElement>()
  const isPressed = useRef(false)
  const engine = useRef(Engine.create())
  const waterLevel = 600
  const waterHeight = 200

  useEffect(() => {
    const cw = document.body.clientWidth
    const ch = waterLevel
    const water = Bodies.rectangle(cw / 2, waterLevel - waterHeight / 2, cw, waterHeight, { isStatic: true, render: { fillStyle: '#0000FF' } });

    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: 'transparent'
      }
    })

    World.add(engine.current.world, [
      Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
      water
    ])

    Engine.run(engine.current)
    Render.run(render)

    return () => {
      Render.stop(render)
      World.clear(engine.current.world, false)
      Engine.clear(engine.current)
      render.canvas.remove()
      // @ts-ignore
      render.canvas = null
      // @ts-ignore
      render.context = null
      render.textures = {}
    }
  }, [])

  useEffect(() => {
    engine.current.world.gravity.y = 0.5;

    Events.on(engine.current, 'afterUpdate', () => {
      engine.current.world.bodies.forEach((body) => {
        if (body.position.y >= waterLevel) {
          const displacement = (body.position.y - waterLevel) / 200
          Body.applyForce(body, body.position, {
            x: 0,
            y: -displacement * 1
          })
        }
      })
    })
  }, [])

  const handleDown = () => {
    isPressed.current = true
  }

  const handleUp = () => {
    isPressed.current = false
  }

  const handleAddCircle: MouseEventHandler = e => {
    if (isPressed.current) {
      const ball = Bodies.circle(
        e.clientX,
        e.clientY,
        10 + Math.random() * 30,
        {
          mass: 10,
          restitution: 0.9,
          friction: 0.005,
          render: {
            fillStyle: '#ff0000'
          }
        })

      World.add(engine.current.world, [ball])
    }
  }

  return (
    <div
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onMouseMove={handleAddCircle}
    >
      <div
        // @ts-ignore
        ref={scene}
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  )
}

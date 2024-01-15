"use client";

import {useEffect, useRef} from 'react'
import { Engine, Render, Bodies, World, Body, Events } from 'matter-js'

export function BuoyancySimulator() {
  const scene = useRef<HTMLElement>()
  const engine = useRef(Engine.create())
  const waterLevel = 600

  useEffect(() => {
    const cw = document.body.clientWidth
    const ch = waterLevel

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
      Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true })
    ])

    // Create small circle bodies (represents liquid particles)
    for(let i = 0; i < 3000; i++) {
      World.add(engine.current.world,
        Bodies.circle(Math.random() * 800, Math.random() * 600, 5, {
        friction: 0,
        restitution: 0.5,
        density: 0.0001,
        render: { fillStyle: '#3cb9ff' }
      }));
    }

    Engine.run(engine.current)
    Render.run(render)

    // Setup interval to drop 'liquid particles' every second
    const dropInterval = setInterval(() => {
      World.add(engine.current.world,
        Bodies.circle(Math.random() * 800, 0, 15, {
          friction: 0,
          restitution: 0.5,
          density: 0.01 * Math.random()
        })
      );
    }, 1000);  // 1 drop per second

    return () => {
      Render.stop(render)
      World.clear(engine.current.world, false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Engine.clear(engine.current)
      render.canvas.remove()
      // @ts-ignore
      render.canvas = null
      // @ts-ignore
      render.context = null
      render.textures = {}
      clearInterval(dropInterval)  // Clear interval when component unmounts
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
            y: -displacement
          })
        }
      })
    })
  }, [])

  return (
    <div
      style={{
        width: '100px',
        height: '600px'
    }}
      // @ts-ignore
      ref={scene}
    />
  )
}

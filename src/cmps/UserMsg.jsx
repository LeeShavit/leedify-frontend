import { eventBus } from '../services/event-bus.service'
import { useState, useEffect, useRef } from 'react'


export function UserMsg() {
	const [msg, setMsg] = useState(null)
	const timeoutIdRef = useRef()

	useEffect(() => {
		const unsubscribe = eventBus.on('show-msg', msg => {
			setMsg(msg)
			if (timeoutIdRef.current) {
				timeoutIdRef.current = null
				clearTimeout(timeoutIdRef.current)
			}
			timeoutIdRef.current = setTimeout(() => setMsg(false), 7000)
		})


		return () => {
			unsubscribe()
		}
	}, [])



	function msgClass() {
		return msg ? 'visible' : ''
	}

	if (!msg) return null

	return (
		<section className={`user-msg ${msgClass()}`}>
			{msg?.imgUrl && <img src={msg.imgUrl}></img>}{msg?.txt}
		</section>
	)
}

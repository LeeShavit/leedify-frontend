import { eventBus, showSuccessMsg } from '../services/event-bus.service'
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
			timeoutIdRef.current = setTimeout(()=>setMsg(false), 3000)
		})

		return () => {
			unsubscribe()
		}
	}, [])


    function msgClass() {
        return msg ? 'visible' : ''
    }
	return (
		<section className={`user-msg`}>
			{msg?.txt}
		</section>
	)
}

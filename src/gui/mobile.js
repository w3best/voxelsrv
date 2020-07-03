

export function setupMobile(noa) {
	console.log('Using mobile controls')


	var timer = 0
	var touchTime = 0
	var isTouching = false
	var loop
	var breaking

	var oldMovePos = [0, 0]

	noa.container.element.ontouchstart = function(ev) {
		ev.preventDefault()
		isTouching = true
		touchTime = new Date().getTime()/1000
		loop = setInterval(function() {
			timer = new Date().getTime()/1000 - touchTime
		}, 10)
		breaking = setInterval(function() {
			if (timer > 0.6) {
				noa.inputs.down.emit('fire')
			}
		}, 400)
	}

	noa.container.element.ontouchmove = function(ev) {
		ev.preventDefault()
		touchTime = new Date().getTime()/1000 + 0.5
	}

	noa.container.element.ontouchend = function(ev) {
		ev.preventDefault()

		if ( 0 < timer && timer < 0.6) {
			noa.inputs.down.emit('alt-fire')
			}
		clearInterval(loop)
		clearInterval(breaking)

		isTouching = false
		timer = 0
	}

	noa.container.element.ontouchcancel = function(ev) {
		if (ev.target != noa.container.cancas)

		ev.preventDefault()

		clearInterval(loop)
		clearInterval(breaking)

		isTouching = false
		timer = 0
	}

	var controls = document.createElement('div')
	controls.id = 'game_mobile_controls'

	document.body.appendChild(controls)

	let dragStart = null
	let currentPos = { x: 0, y: 0 }
	const maxDiff = 50

	// Joystick implementation is based on one by u/AndrewGreenh

	var stick = document.createElement('div')
	stick.id = 'game_mobile_joystick'

	stick.ontouchstart = function(event) {
		if (event.target != stick) return

		event.preventDefault()

		stick.style.transition = '0s'
		if (event.changedTouches) {
			dragStart = {
				x: event.changedTouches[0].clientX,
				y: event.changedTouches[0].clientY,
			}
			return
		}
		dragStart = {
			x: event.clientX,
			y: event.clientY,
		}
	}
	stick.ontouchmove = function(event) {
		if (event.target != stick) return

		if (dragStart === null) return
		event.preventDefault()
		if (event.changedTouches) {
			event.clientX = event.changedTouches[0].clientX
			event.clientY = event.changedTouches[0].clientY
		}
		const xDiff = event.clientX - dragStart.x
		const yDiff = event.clientY - dragStart.y
		const angle = Math.atan2(yDiff, xDiff)
		const distance = Math.min(maxDiff, Math.hypot(xDiff, yDiff))
		const xNew = distance * Math.cos(angle)
		const yNew = distance * Math.sin(angle)
		stick.style.transform = 'translate('+ (xNew + 16) +'px, ' + (yNew + 16) + 'px)'
		currentPos = { x: xNew, y: yNew }
		applyMove(xNew, yNew)
	}
	stick.ontouchend = function() {
		if (event.target != stick) return

		event.preventDefault()

		if (dragStart === null) return
		stick.style.transition = '.1s'
		stick.style.transform = 'translate(16px, 16px)'
		dragStart = null
		currentPos = { x: 0, y: 0 }
		applyMove(0, 0)
	}


	controls.appendChild(stick)

	function applyMove(x, y) {
		x = Math.round(x/maxDiff)
		y = Math.round(y/maxDiff)

		if (y == 0) { 
			noa.inputs.state.forward = false
			noa.inputs.state.backward = false
		} else if (y > 0) { 
			noa.inputs.state.forward = false
			noa.inputs.state.backward = true
		} else if (y < 0) { 
			noa.inputs.state.forward = true
			noa.inputs.state.backward = false
		}

		if (x == 0) { 
			noa.inputs.state.left = false
			noa.inputs.state.right = false
		} else if (x > 0) { 
			noa.inputs.state.left = false
			noa.inputs.state.right = true
		} else if (x < 0) { 
			noa.inputs.state.left = true
			noa.inputs.state.right = false
		} 
	}

	var jump = document.createElement('div')
	jump.id = 'game_mobile_jump'

	jump.ontouchstart = function() {
		noa.inputs.state.jump = true
	}

	jump.ontouchend = function() {
		noa.inputs.state.jump = false
	}
	jump.ontouchcancel = function() {
		noa.inputs.state.jump = false
	}

	document.body.appendChild(jump)


	var chat = document.createElement('div')
	chat.id = 'game_mobile_chat'
	chat.innerHTML = 'T'

	chat.ontouchstart = function(ev) {
		ev.preventDefault()
		noa.inputs.down.emit('chat')
	}

	document.body.appendChild(chat)




}
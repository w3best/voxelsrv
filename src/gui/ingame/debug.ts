import { getLayer, getUI, scale, event } from '../main';

import * as GUI from '@babylonjs/gui';
import { gameSettings, gameVersion } from '../../values';
import { chunkExist } from '../../lib/gameplay/world';

export let debug: GUI.TextBlock;

export function setupDebug(noa, server) {
	const ui = getUI(1);

	const eid = noa.playerEntity;
	const dat = noa.entities.getPositionData(eid);

	debug = new GUI.TextBlock();
	ui.addControl(debug);

	debug.text = '';
	debug.color = '#f0f0f0';
	debug.fontSize = `${8 * scale}px`;
	debug.left = '5px';
	debug.top = '5px';

	debug.shadowColor = '#111111';
	debug.shadowOffsetX = 1;
	debug.shadowOffsetY = 1;

	debug.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
	debug.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

	let serverText: string;

	if (server != undefined) serverText = `Server: ${server}\n`;
	else serverText = `Singleplayer world\n`;

	let x = 0;

	const update = async () => {
		if (x != 2) {
			x = x + 1;
			return;
		}
		x = 0;

		if (gameSettings.debugInfo) {
			const cx = Math.floor(dat.position[0] / 32);
			const cy = Math.floor(dat.position[1] / 32);
			const cz = Math.floor(dat.position[2] / 32);

			const pos = `${dat.position[0].toFixed(1)}, ${dat.position[1].toFixed(1)}, ${dat.position[2].toFixed(1)}`;
			const chunk = `${cx}, ${cy}, ${cz} [${chunkExist([cx, cy, cz].join('|'))}]`;

			debug.text = `VoxelSrv ${gameVersion}\nNoa: ${noa.version}\nXYZ: ${pos}\nChunk: ${chunk}\n${serverText}`;
		} else {
			debug.text = `VoxelSrv ${gameVersion} (Noa ${noa.version})`;
		}
	};

	const scaleEvent = async () => {
		debug.fontSize = `${8 * scale}px`;
	};

	noa.on('tick', update);
	event.on('scale-change', scaleEvent);

	debug.onDisposeObservable.add(() => {
		noa.off('tick', update);
		event.on('scale-change', scaleEvent);
	});
}

export let dot: GUI.Ellipse;

export function setupDot() {
	const scene = getLayer(0);
	const ui = getUI(0);

	dot = new GUI.Ellipse();
	dot.background = '#eeeeee88';
	dot.height = `${2 * scale}px`;
	dot.width = `${2 * scale}px`;
	dot.thickness = 0;

	const update = () => {
		dot.height = `${2 * scale}px`;
		dot.width = `${2 * scale}px`;
	};

	event.on('scale-change', update);

	dot.onDisposeObservable.add(() => {
		event.off('scale-change', update);
	});

	ui.addControl(dot);
}

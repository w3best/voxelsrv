import { getScreen, scale, event } from '../main';
import { items } from '../../lib/gameplay/registry';
import * as GUI from '@babylonjs/gui/';
import { ActionInventoryClick } from 'voxelsrv-protocol/js/client';

import { ItemSlot, createSlot, updateSlot } from '../parts/itemSlot';

export let inventory: GUI.Rectangle;
let page = 0;

export function buildInventory(noa, socket) {
	function getInv() {
		return noa.ents.getState(noa.playerEntity, 'inventory');
	}

	const ui = getScreen(2);

	inventory = new GUI.Rectangle();
	inventory.zIndex = 15;
	inventory.verticalAlignment = 2;
	inventory.background = '#00000077';
	inventory.thickness = 0;
	inventory.isVisible = false;
	ui.addControl(inventory);

	const inventoryTexture = new GUI.Image('inventory', './textures/gui/container/inventory.png');
	inventoryTexture.width = `${180 * scale}px`;
	inventoryTexture.height = `${176 * scale}px`;
	inventoryTexture.zIndex = 18;

	inventory.addControl(inventoryTexture);

	const hotbar = new GUI.Rectangle();
	hotbar.zIndex = 20;
	hotbar.verticalAlignment = 2;
	hotbar.top = `${67 * scale}px`;
	hotbar.height = `${20 * scale}px`;
	hotbar.width = `${164 * scale}px`;
	hotbar.thickness = 0;

	inventory.addControl(hotbar);

	const hotbarSlots: Array<ItemSlot> = new Array(9);
	const inventorySlots: Array<ItemSlot> = new Array(36);
	const inventoryRow: Array<GUI.Rectangle> = [];
	const craftingSlots: Array<ItemSlot> = new Array(5);

	for (let x = 1; x < 4; x++) {
		const row = new GUI.Rectangle();
		row.zIndex = 30;
		row.verticalAlignment = 2;
		row.height = `${20 * scale}px`;
		row.width = `${164 * scale}px`;
		row.top = `${9 * scale + (x - 1) * 18 * scale}px`;
		row.thickness = 0;
		inventory.addControl(row);

		inventoryRow[x] = row;

		for (let y = 9 * x; y < 9 * x + 9; y++) {
			inventorySlots[y] = createSlot(scale);
			const container = inventorySlots[y].container;
			container.zIndex = 50;
			container.left = `${-18 * scale * 4 + 18 * scale * (y % 9)}px`;
			container.onPointerClickObservable.add((e) => {
				let click = ActionInventoryClick.Type.LEFT;
				switch (e.buttonIndex) {
					case 0:
						click = ActionInventoryClick.Type.LEFT;
						break;
					case 1:
						click = ActionInventoryClick.Type.MIDDLE;
						break;
					case 2:
						click = ActionInventoryClick.Type.RIGHT;
						break;
				}
				socket.send('ActionInventoryClick', { slot: y + 27 * page, type: click, inventory: ActionInventoryClick.TypeInv.MAIN });
			});

			container.onPointerEnterObservable.add((e) => {
				container.background = '#ffffff22';
			});

			container.onPointerOutObservable.add((e) => {
				container.background = '#00000000';
			});
			container.isPointerBlocker = true;
			row.addControl(container);
		}
	}

	const tempslot = createSlot(scale);
	tempslot.container.zIndex = 50;
	tempslot.container.verticalAlignment = 0;
	tempslot.container.horizontalAlignment = 0;
	tempslot.container.isPointerBlocker = false;
	tempslot.count.isPointerBlocker = false;
	tempslot.item.isPointerBlocker = false;

	inventory.addControl(tempslot.container);

	for (let x = 0; x < 9; x++) {
		hotbarSlots[x] = createSlot(scale);
		const container = hotbarSlots[x].container;
		container.zIndex = 40;
		container.left = `${-18 * scale * 4 + 18 * scale * x}px`;
		container.onPointerClickObservable.add((e) => {
			let click = ActionInventoryClick.Type.LEFT;
			switch (e.buttonIndex) {
				case 0:
					click = ActionInventoryClick.Type.LEFT;
					break;
				case 1:
					click = ActionInventoryClick.Type.MIDDLE;
					break;
				case 2:
					click = ActionInventoryClick.Type.RIGHT;
					break;
			}
			socket.send('ActionInventoryClick', { slot: x, type: click, inventory: ActionInventoryClick.TypeInv.MAIN });
		});

		container.onPointerEnterObservable.add((e) => {
			container.background = '#ffffff22';
		});

		container.onPointerOutObservable.add((e) => {
			container.background = '#00000000';
		});
		container.isPointerBlocker = true;
		hotbar.addControl(container);
	}

	const armor = new GUI.Rectangle();
	armor.zIndex = 40;
	armor.verticalAlignment = 2;
	armor.top = `${-39 * scale}px`;
	armor.left = `${-72 * scale}px`;
	armor.height = `${72 * scale}px`;
	armor.width = `${18 * scale}px`;
	armor.thickness = 0;

	inventory.addControl(armor);

	const armorSlots = new Array(4);

	for (let x = 0; x < 4; x++) {
		armorSlots[x] = createSlot(scale);
		const container = armorSlots[x].container;
		container.zIndex = 50;
		container.verticalAlignment = 0;
		container.top = `${18 * scale * x}px`;
		container.onPointerClickObservable.add((e) => {
			let click = ActionInventoryClick.Type.LEFT;
			switch (e.buttonIndex) {
				case 0:
					click = ActionInventoryClick.Type.LEFT;
					break;
				case 1:
					click = ActionInventoryClick.Type.MIDDLE;
					break;
				case 2:
					click = ActionInventoryClick.Type.RIGHT;
					break;
			}
			socket.send('ActionInventoryClick', { slot: x, type: click, inventory: ActionInventoryClick.TypeInv.ARMOR });
		});

		container.onPointerEnterObservable.add((e) => {
			container.background = '#ffffff22';
		});

		container.onPointerOutObservable.add((e) => {
			container.background = '#00000000';
		});

		container.isPointerBlocker = true;
		armor.addControl(container);
	}

	const crafting = new GUI.Rectangle();
	crafting.zIndex = 40;
	crafting.verticalAlignment = 2;
	crafting.horizontalAlignment = 2;
	crafting.top = `${-47 * scale}px`;
	crafting.left = `${43 * scale}px`;
	crafting.height = `${35 * scale}px`;
	crafting.width = `${66 * scale}px`;
	crafting.thickness = 0;

	inventory.addControl(crafting);

	for (let x = 0; x < 5; x++) {
		craftingSlots[x] = createSlot(scale);
		const container = craftingSlots[x].container;
		container.zIndex = 50;
		container.verticalAlignment = 0;
		container.horizontalAlignment = 0;
		if (x == 4) {
			container.left = `${48 * scale}px`;
			container.top = `${10 * scale}px`;
		} else {
			if (x % 2 == 1) container.left = `${18 * scale}px`;
			if (x > 1) container.top = `${18 * scale}px`;
		}

		container.onPointerClickObservable.add((e) => {
			let click = ActionInventoryClick.Type.LEFT;
			switch (e.buttonIndex) {
				case 0:
					click = ActionInventoryClick.Type.LEFT;
					break;
				case 1:
					click = ActionInventoryClick.Type.MIDDLE;
					break;
				case 2:
					click = ActionInventoryClick.Type.RIGHT;
					break;
			}
			socket.send('ActionInventoryClick', { slot: x, type: click, inventory: ActionInventoryClick.TypeInv.CRAFTING });
		});
		container.onPointerEnterObservable.add((e) => {
			container.background = '#ffffff22';
		});

		container.onPointerOutObservable.add((e) => {
			container.background = '#00000000';
		});

		container.isPointerBlocker = true;
		crafting.addControl(container);
	}

	ui.onPointerMoveObservable.add((data) => {
		tempslot.container.left = data.x + 10;
		tempslot.container.top = data.y + 10;
	});

	const button: { [index: string]: any } = {};

	if (getInv().size > 36) {
		const box = new GUI.Rectangle();
		button.box = box;
		box.height = `${15 * scale}px`;
		box.width = `${22 * scale}px`;
		box.zIndex = 25;
		box.thickness = 0;
		box.top = `${-6 * scale}px`;
		box.left = `${71 * scale}px`;
		inventory.addControl(box);

		const inv = getInv();
		const button1 = new GUI.Image('button1', './textures/gui/button-right.png');
		button.button1 = button1;
		button1.zIndex = 25;
		button1.horizontalAlignment = 1;
		button1.height = `${15 * scale}px`;
		button1.width = `${11 * scale}px`;
		button1.onPointerClickObservable.add((e) => {
			page = page + 1;
			if (9 + page * 27 > inv.size) page = 0;
		});
		button1.isPointerBlocker = true;
		box.addControl(button1);

		const button2 = new GUI.Image('button2', './textures/gui/button-left.png');
		button.button2 = button2;
		button2.zIndex = 25;
		button2.horizontalAlignment = 0;
		button2.height = `${15 * scale}px`;
		button2.width = `${11 * scale}px`;
		button2.onPointerClickObservable.add((e) => {
			page = page - 1;
			if (page < 0) page = Math.floor((inv.size - 9) / 27);
		});
		button2.isPointerBlocker = true;
		box.addControl(button2);
	}

	const update = async () => {
		if (inventory.isVisible == false) return;

		const inv = getInv();

		if (inv.tempslot != null && inv.tempslot.id != undefined) {
			tempslot.item.alpha = 1;
			tempslot.count.alpha = 1;
			const item = items[inv.tempslot.id];

			let txt: string;
			if (item == undefined) txt = './textures/error.png';
			else if (!item.texture.startsWith('https://') || !item.texture.startsWith('http://')) txt = './textures/' + item.texture + '.png';
			else txt = item.texture;

			tempslot.item.source = txt;

			if (inv.tempslot.count == 1) tempslot.count.text = '';
			else if (inv.tempslot.count <= 10) tempslot.count.text = ' ' + inv.tempslot.count.toString();
			else tempslot.count.text = inv.tempslot.count.toString();
		} else {
			tempslot.item.alpha = 0;
			tempslot.count.alpha = 0;

			tempslot.item.source = '';
			tempslot.count.text = '';
		}

		for (let x = 0; x < 9; x++) {
			updateSlot(hotbarSlots[x], inv.items[x]);
		}

		for (let x = 9; x < 36; x++) {
			updateSlot(inventorySlots[x], inv.items[27 * page + x]);
		}

		for (let x = 0; x < 4; x++) {
			const status = updateSlot(armorSlots[x], inv.armor.items[x]);
			if (status == false) {
				armorSlots[x].count.alpha = 0;
				let txt: string;
				switch (x) {
					case 0:
						txt = './textures/item/empty_armor_slot_helmet.png';
						break;
					case 1:
						txt = './textures/item/empty_armor_slot_chestplate.png';
						break;
					case 2:
						txt = './textures/item/empty_armor_slot_leggings.png';
						break;
					case 3:
						txt = './textures/item/empty_armor_slot_boots.png';
						break;
				}
				armorSlots[x].item.source = txt;
				armorSlots[x].count.text = '';
			}
		}

		for (let x = 0; x < 5; x++) {
			updateSlot(craftingSlots[x], inv.crafting[x]);
		}
	};

	noa.on('tick', update);

	const scaleEvent = (scale2) => {
		inventoryTexture.width = `${180 * scale2}px`;
		inventoryTexture.height = `${176 * scale2}px`;
		hotbar.top = `${67 * scale2}px`;
		hotbar.height = `${20 * scale2}px`;
		hotbar.width = `${164 * scale2}px`;
		armor.top = `${-39 * scale2}px`;
		armor.left = `${-72 * scale2}px`;
		armor.height = `${72 * scale2}px`;
		armor.width = `${18 * scale2}px`;

		if (button.box != undefined) {
			button.box.height = `${15 * scale2}px`;
			button.box.width = `${22 * scale2}px`;
			button.box.top = `${-6 * scale2}px`;
			button.box.left = `${71 * scale2}px`;

			button.button1.height = `${15 * scale2}px`;
			button.button1.width = `${11 * scale2}px`;
			button.button2.height = `${15 * scale2}px`;
			button.button2.width = `${11 * scale2}px`;
		}

		tempslot.container.height = `${16 * scale2}px`;
		tempslot.container.width = `${16 * scale2}px`;
		tempslot.item.width = `${16 * scale2}px`;
		tempslot.item.height = `${16 * scale2}px`;
		tempslot.count.fontSize = `${8 * scale2}px`;
		tempslot.count.left = `${2 * scale2}px`;
		tempslot.count.top = `${4 * scale2}px`;
		tempslot.count.shadowOffsetX = scale2;
		tempslot.count.shadowOffsetY = scale2;

		for (let x = 0; x < hotbarSlots.length; x++) {
			hotbarSlots[x].container.height = `${16 * scale2}px`;
			hotbarSlots[x].container.width = `${16 * scale2}px`;
			hotbarSlots[x].container.left = `${-18 * scale2 * 4 + 18 * scale2 * (x % 9)}px`;
			hotbarSlots[x].item.width = `${16 * scale2}px`;
			hotbarSlots[x].item.height = `${16 * scale2}px`;
			hotbarSlots[x].count.fontSize = `${8 * scale2}px`;
			hotbarSlots[x].count.left = `${2 * scale2}px`;
			hotbarSlots[x].count.top = `${4 * scale2}px`;
			hotbarSlots[x].count.shadowOffsetX = scale2;
			hotbarSlots[x].count.shadowOffsetY = scale2;
		}

		for (let x = 0; x < armorSlots.length; x++) {
			armorSlots[x].container.height = `${16 * scale2}px`;
			armorSlots[x].container.width = `${16 * scale2}px`;
			armorSlots[x].item.width = `${16 * scale2}px`;
			armorSlots[x].item.height = `${16 * scale2}px`;
			armorSlots[x].count.fontSize = `${8 * scale2}px`;
			armorSlots[x].count.left = `${2 * scale2}px`;
			armorSlots[x].count.top = `${4 * scale2}px`;
			armorSlots[x].count.shadowOffsetX = scale2;
			armorSlots[x].count.shadowOffsetY = scale2;
		}

		for (let x = 1; x < 4; x++) {
			inventoryRow[x].height = `${20 * scale2}px`;
			inventoryRow[x].width = `${164 * scale2}px`;
			inventoryRow[x].top = `${9 * scale2 + (x - 1) * 18 * scale2}px`;

			for (let y = 9 * x; y < 9 * x + 9; y++) {
				inventorySlots[y].container.left = `${-18 * scale2 * 4 + 18 * scale2 * (y % 9)}px`;
				inventorySlots[y].container.height = `${16 * scale2}px`;
				inventorySlots[y].container.width = `${16 * scale2}px`;
				inventorySlots[y].item.width = `${16 * scale2}px`;
				inventorySlots[y].item.height = `${16 * scale2}px`;
				inventorySlots[y].count.fontSize = `${8 * scale2}px`;
				inventorySlots[y].count.left = `${2 * scale2}px`;
				inventorySlots[y].count.top = `${4 * scale2}px`;
				inventorySlots[y].count.shadowOffsetX = scale2;
				inventorySlots[y].count.shadowOffsetY = scale2;
			}
		}

		crafting.top = `${-47 * scale}px`;
		crafting.left = `${43 * scale}px`;
		crafting.height = `${35 * scale}px`;
		crafting.width = `${66 * scale}px`;

		for (let x = 0; x < 5; x++) {
			if (x == 4) {
				craftingSlots[x].container.left = `${48 * scale2}px`;
				craftingSlots[x].container.top = `${10 * scale2}px`;
			} else {
				if (x % 2 == 1) craftingSlots[x].container.left = `${18 * scale2}px`;
				if (x > 1) craftingSlots[x].container.top = `${18 * scale2}px`;
			}

			craftingSlots[x].container.height = `${16 * scale2}px`;
			craftingSlots[x].container.width = `${16 * scale2}px`;
			craftingSlots[x].item.width = `${16 * scale2}px`;
			craftingSlots[x].item.height = `${16 * scale2}px`;
			craftingSlots[x].count.fontSize = `${8 * scale2}px`;
			craftingSlots[x].count.left = `${2 * scale2}px`;
			craftingSlots[x].count.top = `${4 * scale2}px`;
			craftingSlots[x].count.shadowOffsetX = scale2;
			craftingSlots[x].count.shadowOffsetY = scale2;
		}
	};

	event.on('scale-change', scaleEvent);

	inventory.onDisposeObservable.add(() => {
		event.off('scake-change', scaleEvent);
		noa.off('tick', update);
	});
}

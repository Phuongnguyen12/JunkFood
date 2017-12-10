import * as types from './actionTypes';

export function createItem(item) {
	const newItem = Object.assign({}, {
		id: guid()
  }, item);
  return {
    type: types.ITEM_CREATED,
    item: newItem
  };
};

export function deleteItem(id) {
  return {
    type: types.ITEM_DELETED,
    id
  };
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

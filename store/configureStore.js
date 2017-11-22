import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';
import reducers from '../reducers';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';

export default function configureStore(data={}, onComplete) {
    const engine = createEngine('JunkFood');
    const storeMiddleware = storage.createMiddleware(engine);
    // const middleware = applyMiddleware(thunk);
    // const sagaMiddleware = createSagaMiddleware();

    let store = createStore(
        storage.reducer(reducers), //Apply redux-storage so we can persist Redux state to disk
        data,
        applyMiddleware(storeMiddleware),
    );

    const load = storage.createLoader(engine);
    load(store)
        .then(onComplete)
        .catch(() => console.log('Failed to load previous state'));

    // sagaMiddleware.run(sagas);

    return store;
}
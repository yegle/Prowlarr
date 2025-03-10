import { createAction } from 'redux-actions';
import createBulkEditItemHandler from 'Store/Actions/Creators/createBulkEditItemHandler';
import createBulkRemoveItemHandler from 'Store/Actions/Creators/createBulkRemoveItemHandler';
import createFetchHandler from 'Store/Actions/Creators/createFetchHandler';
import createFetchSchemaHandler from 'Store/Actions/Creators/createFetchSchemaHandler';
import createRemoveItemHandler from 'Store/Actions/Creators/createRemoveItemHandler';
import createSaveProviderHandler, { createCancelSaveProviderHandler } from 'Store/Actions/Creators/createSaveProviderHandler';
import createTestAllProvidersHandler from 'Store/Actions/Creators/createTestAllProvidersHandler';
import createTestProviderHandler, { createCancelTestProviderHandler } from 'Store/Actions/Creators/createTestProviderHandler';
import createSetProviderFieldValueReducer from 'Store/Actions/Creators/Reducers/createSetProviderFieldValueReducer';
import createSetSettingValueReducer from 'Store/Actions/Creators/Reducers/createSetSettingValueReducer';
import { createThunk } from 'Store/thunks';
import selectProviderSchema from 'Utilities/State/selectProviderSchema';
import { set } from '../baseActions';

//
// Variables

const section = 'settings.downloadClients';

//
// Actions Types

export const FETCH_DOWNLOAD_CLIENTS = 'settings/downloadClients/fetchDownloadClients';
export const FETCH_DOWNLOAD_CLIENT_SCHEMA = 'settings/downloadClients/fetchDownloadClientSchema';
export const SELECT_DOWNLOAD_CLIENT_SCHEMA = 'settings/downloadClients/selectDownloadClientSchema';
export const SET_DOWNLOAD_CLIENT_VALUE = 'settings/downloadClients/setDownloadClientValue';
export const SET_DOWNLOAD_CLIENT_FIELD_VALUE = 'settings/downloadClients/setDownloadClientFieldValue';
export const SAVE_DOWNLOAD_CLIENT = 'settings/downloadClients/saveDownloadClient';
export const CANCEL_SAVE_DOWNLOAD_CLIENT = 'settings/downloadClients/cancelSaveDownloadClient';
export const DELETE_DOWNLOAD_CLIENT = 'settings/downloadClients/deleteDownloadClient';
export const TEST_DOWNLOAD_CLIENT = 'settings/downloadClients/testDownloadClient';
export const CANCEL_TEST_DOWNLOAD_CLIENT = 'settings/downloadClients/cancelTestDownloadClient';
export const TEST_ALL_DOWNLOAD_CLIENTS = 'settings/downloadClients/testAllDownloadClients';
export const BULK_EDIT_DOWNLOAD_CLIENTS = 'settings/downloadClients/bulkEditDownloadClients';
export const BULK_DELETE_DOWNLOAD_CLIENTS = 'settings/downloadClients/bulkDeleteDownloadClients';

//
// Action Creators

export const fetchDownloadClients = createThunk(FETCH_DOWNLOAD_CLIENTS);
export const fetchDownloadClientSchema = createThunk(FETCH_DOWNLOAD_CLIENT_SCHEMA);
export const selectDownloadClientSchema = createAction(SELECT_DOWNLOAD_CLIENT_SCHEMA);

export const saveDownloadClient = createThunk(SAVE_DOWNLOAD_CLIENT);
export const cancelSaveDownloadClient = createThunk(CANCEL_SAVE_DOWNLOAD_CLIENT);
export const deleteDownloadClient = createThunk(DELETE_DOWNLOAD_CLIENT);
export const testDownloadClient = createThunk(TEST_DOWNLOAD_CLIENT);
export const cancelTestDownloadClient = createThunk(CANCEL_TEST_DOWNLOAD_CLIENT);
export const testAllDownloadClients = createThunk(TEST_ALL_DOWNLOAD_CLIENTS);
export const bulkEditDownloadClients = createThunk(BULK_EDIT_DOWNLOAD_CLIENTS);
export const bulkDeleteDownloadClients = createThunk(BULK_DELETE_DOWNLOAD_CLIENTS);

export const setDownloadClientValue = createAction(SET_DOWNLOAD_CLIENT_VALUE, (payload) => {
  return {
    section,
    ...payload
  };
});

export const setDownloadClientFieldValue = createAction(SET_DOWNLOAD_CLIENT_FIELD_VALUE, (payload) => {
  return {
    section,
    ...payload
  };
});

//
// Details

export default {

  //
  // State

  defaultState: {
    isFetching: false,
    isPopulated: false,
    error: null,
    isSchemaFetching: false,
    isSchemaPopulated: false,
    schemaError: null,
    schema: [],
    selectedSchema: {},
    isSaving: false,
    saveError: null,
    isDeleting: false,
    deleteError: null,
    isTesting: false,
    isTestingAll: false,
    items: [],
    pendingChanges: {}
  },

  //
  // Action Handlers

  actionHandlers: {
    [FETCH_DOWNLOAD_CLIENTS]: createFetchHandler(section, '/downloadclient'),
    [FETCH_DOWNLOAD_CLIENT_SCHEMA]: createFetchSchemaHandler(section, '/downloadclient/schema'),

    [SAVE_DOWNLOAD_CLIENT]: (getState, payload, dispatch) => {
      // move the format tags in as a pending change
      const state = getState();
      const pendingChanges = state.settings.downloadClients.pendingChanges;
      pendingChanges.categories = state.settings.downloadClientCategories.items;
      dispatch(set({
        section,
        pendingChanges
      }));

      createSaveProviderHandler(section, '/downloadclient')(getState, payload, dispatch);
    },

    [CANCEL_SAVE_DOWNLOAD_CLIENT]: createCancelSaveProviderHandler(section),
    [DELETE_DOWNLOAD_CLIENT]: createRemoveItemHandler(section, '/downloadclient'),

    [TEST_DOWNLOAD_CLIENT]: (getState, payload, dispatch) => {
      const state = getState();
      const pendingChanges = state.settings.downloadClients.pendingChanges;
      pendingChanges.categories = state.settings.downloadClientCategories.items;
      dispatch(set({
        section,
        pendingChanges
      }));

      createTestProviderHandler(section, '/downloadclient')(getState, payload, dispatch);
    },

    [CANCEL_TEST_DOWNLOAD_CLIENT]: createCancelTestProviderHandler(section),
    [TEST_ALL_DOWNLOAD_CLIENTS]: createTestAllProvidersHandler(section, '/downloadclient'),
    [BULK_EDIT_DOWNLOAD_CLIENTS]: createBulkEditItemHandler(section, '/downloadclient/bulk'),
    [BULK_DELETE_DOWNLOAD_CLIENTS]: createBulkRemoveItemHandler(section, '/downloadclient/bulk')
  },

  //
  // Reducers

  reducers: {
    [SET_DOWNLOAD_CLIENT_VALUE]: createSetSettingValueReducer(section),
    [SET_DOWNLOAD_CLIENT_FIELD_VALUE]: createSetProviderFieldValueReducer(section),

    [SELECT_DOWNLOAD_CLIENT_SCHEMA]: (state, { payload }) => {
      return selectProviderSchema(state, section, payload, (selectedSchema) => {
        selectedSchema.enable = true;

        return selectedSchema;
      });
    }
  }

};

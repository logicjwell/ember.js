import {
  Error as EmberError,
  get
} from 'ember-metal';
import { MUTABLE_CELL } from '../../compat/attrs';

/**
@module ember
@submodule ember-views
*/
export default {
  // appendChild is only legal while rendering the buffer.
  appendChild() {
    throw new EmberError('You can\'t use appendChild outside of the rendering process');
  },

  $() {
    return undefined;
  },

  legacyPropertyDidChange(view, key) {
    let attrs = view.attrs;
    if (attrs && key in attrs) {
      let possibleCell = attrs[key];

      if (possibleCell && possibleCell[MUTABLE_CELL]) {
        let value = get(view, key);
        if (value === possibleCell.value) { return; }
        possibleCell.update(value);
      }
    }
  },

  // Handle events from `Ember.EventDispatcher`
  handleEvent() {
    return true; // continue event propagation
  },

  destroy() { },

  rerender(view) {
    view.renderer.ensureViewNotRendering(view);
  }
};

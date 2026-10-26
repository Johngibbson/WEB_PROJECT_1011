import { Component } from 'react';
import { STORAGE_KEYS } from '../context/AppContext.jsx';

// ErrorBoundary: catches errors thrown while rendering a page and shows a friendly message
// instead of a blank screen. React only supports error boundaries as class components,
// so this is the one class component in the project.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Clears this app's saved data and reloads, in case bad stored data caused the error.
  handleReset() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        window.localStorage.removeItem(key);
      });
    } catch {
      // Ignore: storage may be unavailable.
    }
    window.location.hash = '#/';
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="container page-section center-box" role="alert">
          <p className="big-emoji" aria-hidden="true">😿</p>
          <h1>Oops! Something went wrong.</h1>
          <p>This page hit an unexpected problem. Resetting the saved demo data usually fixes it.</p>
          <button type="button" className="btn btn-primary" onClick={this.handleReset}>
            Reset data and reload
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}

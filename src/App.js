import React, { Component } from 'react';
import { EditorState, Editor, CompositeDecorator } from 'draft-js';

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

const SearchHighlight = (props) => (
  <span className="search-and-replace-highlight">{props.children}</span>
);

const generateDecorator = (highlightTerm) => {
  const regex = new RegExp(highlightTerm, 'g');
  return new CompositeDecorator([{
    strategy: (contentBlock, callback) => {
      if (highlightTerm !== '') {
        findWithRegex(regex, contentBlock, callback);
      }
    },
    component: SearchHighlight,
  }])
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      replace: '',
      editorState: EditorState.createEmpty(),
    }
  }

  forceSelection = () => {
    const { editorState } = this.state;
    return EditorState.forceSelection(
      editorState,
      editorState.getSelection(),
    );
  }

  onChangeSearch = (e) => {
    const search = e.target.value;
    this.setState({
      search,
      editorState: EditorState.set(this.state.editorState, { decorator: generateDecorator(search) }),
    });
  }

  onChangeReplace = (e) => {
    this.setState({
      replace: e.target.value,
    });
  }

  onReplace = () => {
    console.log(`replacing "${this.state.search}" with "${this.state.replace}"`);
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    });
  }

  render() {
    return (
      <div>
        <Editor
          ref={elem => { this.editor = elem; }}
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
        <div className="search-and-replace">
          <input
            value={this.state.search}
            onChange={this.onChangeSearch}
            placeholder="Search..."
          />
          <input
            value={this.state.replace}
            onChange={this.onChangeReplace}
            placeholder="Replace..."
          />
          <button onClick={this.onReplace}>
            Replace
          </button>
        </div>
      </div>
    );
  }
}

export default App;

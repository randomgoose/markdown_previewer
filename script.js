String.prototype.insertAt = function(index, string){
	return this.substring(0, index) + string + this.substring(index);
}

marked.setOptions({
	breaks: true
});

const defaultText = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rawText: defaultText
		}
	this.changeHandler = this.changeHandler.bind(this);
	this.countWords = this.countWords.bind(this);
	}

	// componentDidMount(){
	// 	// console.log(document.getElementById('editor').innerHTML.match(/\b[-?(\w+)?]+\b/gi).length);
	// 	WordCounter.defaultProps = {
			
	// 	};
	// }
	
	countWords = function(){
		let wordsNum = this.state.rawText.match(/\b[-?(\w+)?]+\b/gi).length;
		return wordsNum;
	}

	countLines = function(){
		let linesNum = this.state.rawText.split('\n').length;
		return linesNum;
	}
	
	changeHandler = function(event){
		event.preventDefault();
		this.setState({
			rawText: event.target.value 
		});
		this.props.updateText(
			{text: event.target.value,
			 wordsNum: this.countWords(),
			 linesNum: this.countLines()
			});
	}
	
	render(){
		return(
			<textarea id='editor' onChange={this.changeHandler} defaultValue={defaultText} autoFocus='autoFocus'></textarea>
		)
	}
}

class Toolbar extends React.Component {
	constructor(props) {
		super(props);
		this.setItalic = this.setItalic.bind(this);
		this.setBold = this.setBold.bind(this);
	}

	setItalic(){
		let editor = document.getElementById('editor');
		let selectionStart = editor.selectionStart;
		let selectionEnd = editor.selectionEnd;

		let output = editor.value.insertAt(selectionStart, '*').insertAt(selectionEnd+1, '*');
		
		editor.value = output;

		editor.focus();
		editor.setSelectionRange(selectionStart, selectionEnd+2);

		this.props.updateText({
			text: editor.value
		});
	
		
		// alert(editor.selectionStart + 'to' + editor.selectionEnd);
		
	}

	setBold(){
		let editor = document.getElementById('editor');
		let selectionStart = editor.selectionStart;
		let selectionEnd = editor.selectionEnd;

		let output = editor.value.insertAt(editor.selectionStart, '**').insertAt(editor.selectionEnd+2, '**');

		editor.value = output;

		editor.focus();
		editor.setSelectionRange(selectionStart, selectionEnd+4)

		this.props.updateText({
			text: editor.value
		});
	}

	render(){
		return(
		<div id="toolBar"> 
			<button className='btn' id='undo'><i className="fas fa-lg fa-undo"></i></button>
			<button className='btn' id='redo'><i className="fas fa-lg fa-redo"></i></button>
			<button className='btn' id='bold' onClick={this.setBold}><i className="fas fa-lg fa-bold"></i></button>
			<button className='btn' id='italic' onClick={this.setItalic}><i className="fas fa-lg fa-italic"></i></button>
		</div>
		);
	}
}

class Preview extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render(){
		return(
			<div id="preview" dangerouslySetInnerHTML={{__html: marked(this.props.textToRender)}}></div>
		)
	}
}

class WordCounter extends React.Component {
	constructor(props) {
		super(props);
	}
	
	componentDidMount(){}

	render(){
		return(
			<div id='wordCounter'>
				<span>Markdown</span>
				<b id='wordsNum'>{this.props.wordsNum}</b><span>words</span>
				<b id='linesNum'>{this.props.linesNum}</b><span>lines</span>
				<b id='cursorLocator'></b>
            </div>
		)
	}
}

// WordCounter.defaultProps = {
// 	wordsNum: document.getElementById('editor').innerHTML.match(/\b[-?(\w+)?]+\b/gi).length,
// 	linesNum: 
// };

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			textToRender: defaultText,
			wordsNum: defaultText.match(/\b[-?(\w+)?]+\b/gi).length,
			linesNum: defaultText.split('\n').length
		}
	}
	
	updateText = text => {
		this.setState({
			textToRender: text.text,
			wordsNum: text.wordsNum,
			linesNum: text.linesNum
		})
		// console.log(this.state.linesNum);
	}
	
	render(){
		return(
			<div id='container'>
				<Toolbar updateText = {this.updateText} />
				<Editor updateText = {this.updateText} />
				<Preview textToRender = {this.state.textToRender} />
				<WordCounter wordsNum = {this.state.wordsNum} linesNum = {this.state.linesNum} />
			</div>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('root'));
// // Keyboard shortcuts

// document.onkeyup = function(event){
// 	switch(event.which)
// }

// Keyboard shortcuts
// import SideBar from "./components/SideBar";

function changeTheme(event) {
	// alert(event.target.value);
	let currentThemeLink = document.getElementById("theme");
	// console.log(currentThemeLink.href);
	currentThemeLink.setAttribute('href', './themes/' + event.target.value.toLowerCase() + '.css');
	console.log(currentThemeLink);
    // let newThemeLink = document.createElement("link");
    // newThemeLink.setAttribute("rel", "stylesheet");
    // newThemeLink.setAttribute("type", "text/css");
	// newThemeLink.setAttribute("href", "./themes/" + event.target.value.toLowerCase());
	// console.log(newThemeLink);
    // // document.getElementsByTagName("head").item(0).replaceChild(currentThemeLink, newThemeLink);
	// console.log(document.getElementsByTagName("head").item(0).childNodes);
}

String.prototype.insertAt = function(index, string){
	return this.substring(0, index) + string + this.substring(index);
};

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
`;

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			rawText: defaultText
		};
	this.changeHandler = this.changeHandler.bind(this);
	this.countWords = this.countWords.bind(this);
	this.keyHandler = this.keyHandler.bind(this);
	}

	// componentDidMount(){
	// 	// console.log(document.getElementById('editor').innerHTML.match(/\b[-?(\w+)?]+\b/gi).length);
	// 	WordCounter.defaultProps = {
			
	// 	};
	// }
	
	countWords = function(){
		return this.state.rawText.match(/\b[-?(\w+)?]+\b/gi).length;
	};

	countLines = function(){
		return this.state.rawText.split('\n').length;
	};
	
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
	};
	
	keyHandler = function(event){
		event.preventDefault();
		console.log(event.which);
		if(event.ctrlKey){
			switch(event.which){
				case 66:
					console.log('Keyboard Shortcuts: Bold');
					break;
				case 73:
					console.log('Keyboard Shortcuts: Italic');
					break;
				default:
					console.log('unknown');
			}
		}
	};

	render(){
		return(
			<textarea id='editor' onKeyUp={this.keyHandler} onChange={this.changeHandler} defaultValue={defaultText} autoFocus='autoFocus' />
		)
	}
}

class SideBar extends React.Component {
	constructor(props) {
		super(props);
	}
	render(){
		return(
			<div id='sideBar'>
				SideBar!
				<div id={'userStatus'} />
				<div id='document'/>
			</div>
		)
	}
}

class ToolBar extends React.Component {
	constructor(props) {
		super(props);
		this.setItalic = this.setItalic.bind(this);
		this.setBold = this.setBold.bind(this);
		this.saveDocument = this.saveDocument.bind(this);
		this.setStrike = this.setStrike.bind(this);
	}

	setItalic(){
		let editor = document.getElementById('editor');
		let selectionStart = editor.selectionStart;
		let selectionEnd = editor.selectionEnd;

		editor.value = editor.value.insertAt(selectionStart, '*').insertAt(selectionEnd + 1, '*');

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

		editor.value = editor.value.insertAt(editor.selectionStart, '**').insertAt(editor.selectionEnd + 2, '**');

		editor.focus();
		editor.setSelectionRange(selectionStart, selectionEnd+4);

		this.props.updateText({
			text: editor.value
			// wordsNum: 
		});
	}

	setStrike() {
		
	}

	saveDocument(){
		fetch('/save', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				content: document.getElementById('editor').value,
				author: 'Random'
			})
		}).then(r => r.json());
	}

	render(){
		return(
		<div id="toolBar"> 
			<button className='btn' id='undo'><i className="fas fa-lg fa-undo" /></button>
			<button className='btn' id='redo'><i className="fas fa-lg fa-redo" /></button>
			<button className='btn' id='bold' onClick={this.setBold}><i className="fas fa-lg fa-bold" /></button>
			<button className='btn' id='italic' onClick={this.setItalic}><i className="fas fa-lg fa-italic" /></button>
			<button className='btn' id='strike' onClick={this.setStrike}><i className="fas fa-lg fa-strikethrough" /></button>
			<button className='btn' id={'save'} onClick={this.saveDocument}><i className={"fas fa-lg fa-save"}/></button>
			<button className='btn' id='export' onClick={exportPDF} ><i className={'fas fa-lg fa-download'}/></button>
			<select id='theme' onChange={changeTheme}>
				<option value='Github'>Github</option>
				<option value='Gothic'>Gothic</option>
				<option value='Newsprint'>Newsprint</option>
				<option value='Night'>Night</option>
			</select>
		</div>
		);
	}


}

function exportPDF(){
	let doc = new jsPDF();
	doc.text('Hello world!', 10, 10);
	doc.save('a4.pdf');
	
}

class Preview extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render(){
		return(
			<div id="preview" dangerouslySetInnerHTML={{__html: marked(this.props.textToRender)}} />
		)
	}
}

class WordCounter extends React.Component {
	constructor(props) {
		super(props);
	}
	
	// componentDidMount(){}

	render(){
		return(
			<div id='wordCounter'>
				<span>Markdown</span>
				<b id='wordsNum'>{this.props.wordsNum}</b><span>words</span>
				<b id='linesNum'>{this.props.linesNum}</b><span>lines</span>
				<b id='cursorLocator' />
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
	};
	
	render(){
		return(
			<div id='container'>
				<ToolBar updateText = {this.updateText} />
				<SideBar />
				<Editor updateText = {this.updateText} />
				<Preview textToRender = {this.state.textToRender} />
				<WordCounter wordsNum = {this.state.wordsNum} linesNum = {this.state.linesNum} />
			</div>
		)
	}
}


ReactDOM.render(<App />, document.getElementById('root'));
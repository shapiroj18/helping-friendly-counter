// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const statusBarCount = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
	// create line counter on startup
	updateStatusBarItem(statusBarCount);

	vscode.window.onDidChangeTextEditorSelection((context) => {
		updateStatusBarItem(statusBarCount);
	});

	vscode.window.onDidChangeActiveTextEditor((context) => {
		updateStatusBarItem(statusBarCount);
	});

}

function updateStatusBarItem(statusBarItem: vscode.StatusBarItem): void {
	statusBarItem.color = '#2CC8A5';

	const lines_selected = getNumberofLinesSelected(vscode.window.activeTextEditor);
	const [lines_avg, lines_sum, lines_count] = getValsofSelection(vscode.window.activeTextEditor);
	if (lines_selected > 1 && typeof lines_avg == 'number' && typeof lines_sum == 'number' && typeof lines_count == 'number') {
		console.log('all')
		statusBarItem.text = `$(pulse) Lines: ${ lines_selected }   Avg: ${ lines_avg }   Sum: ${ lines_sum }   Count: ${ lines_count }`
		statusBarItem.show();
	} else if (lines_selected > 1) {
		console.log('lines')
		statusBarItem.text = `$(pulse) Lines: ${ lines_selected }`
		statusBarItem.show();
	} else if (typeof lines_avg == 'number' && typeof lines_sum == 'number' && typeof lines_count == 'number') {
		console.log('vals')
		statusBarItem.text = `Avg: ${ lines_avg }   Sum: ${ lines_sum }   Count: ${ lines_count }`
		statusBarItem.show();
	} else {
		console.log('else')
		statusBarItem.hide();
	}
}

function getNumberofLinesSelected(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		const selection = editor.selection;
		const start_info = selection.start;
		const end_info = selection.end;
		lines = getLine(end_info) - getLine(start_info) + 1;
	}
	return lines;
}

function getLine(line_info: any) {
	return line_info._line
}

function getValsofSelection(editor: vscode.TextEditor | undefined): number[] {
	let number_vals: any = [];
	if (editor) {
		const document = editor.document;
		const selection = editor.selection;
		const text = document.getText(selection);
		// regex matches any word that has digits and letters next to it - i.e. "te5t", "4our", "hell0"
		const regex = /\b(([\d]+(?=[A-Za-z])\w+)|[A-Za-z]+(?=\d)\w+)\b/;
		if (regex.exec(text)) {
			console.log('Text found with values of digits and letters combined');
		} else {
			const selection_values = text.replace(/\n/g, " ").split(' ');
			selection_values.forEach(function (value) {
				if (Number(value)) {
					number_vals.push(Number(value));
				};
			});
			console.log(number_vals)
			const avg = selectionAvg(number_vals);
			const sum = selectionSum(number_vals);
			const count = selectionCount(number_vals);
			number_vals = [avg, sum, count];
		};
	};
	return number_vals;
}

function selectionAvg(selection: number[]): number {
	const sum = selection.reduce((a, b) => a + b, 0);
	const avg = sum / selection.length
	return Number(avg.toFixed(2));
}

function selectionSum(selection: number[]): number {
	const sum = selection.reduce((a, b) => a + b, 0);
	return sum;
}

function selectionCount(selection: number[]): number {
	const count = selection.length;
	return count
}


export function deactivate() {}

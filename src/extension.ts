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
	const lines_selected = getNumberofLinesSelected(vscode.window.activeTextEditor);
	const lines_sum = getSumofSelection(vscode.window.activeTextEditor);
	if (lines_selected > 1 && lines_sum > 0) {
		statusBarItem.text = `$(pulse) Lines: ${ lines_selected }   Sum: ${ lines_sum }`
		statusBarItem.color = '#2CC8A5';
		statusBarItem.show();
	} else if (lines_selected > 1) {
		statusBarItem.text = `$(pulse) Lines: ${ lines_selected }`
		statusBarItem.color = '#2CC8A5';
		statusBarItem.show();
	} else {
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
		// lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line + 1), 0);
	}
	return lines;
}

function getLine(line_info: any) {
	return line_info._line
}

function getSumofSelection(editor: vscode.TextEditor | undefined): number {
	let sum = 0;
	if (editor) {
		let number_vals: number[] = [];
		const document = editor.document;
		const selection = editor.selection;
		const text = document.getText(selection);
		const selection_values = text.split('');
		selection_values.forEach(function (value) {
			if (Number(value)) {
				number_vals.push(Number(value));
			}
		sum = selectionSum(number_vals);
		});
	};
	return sum;
}

function selectionSum(selection_sum: number[]): number {
	const sum = selection_sum.reduce((a, b) => a + b, 0);
	return sum;
}


// this method is called when your extension is deactivated
export function deactivate() {}

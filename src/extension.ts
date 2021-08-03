// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const statusBarCount = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
	// create line counter if lines selected on startup
	updateStatusBarItem(statusBarCount);

	vscode.window.onDidChangeTextEditorSelection((context) => {
		updateStatusBarItem(statusBarCount);
	});

	vscode.window.onDidChangeActiveTextEditor((context) => {
		updateStatusBarItem(statusBarCount);
	});

}

function updateStatusBarItem(statusBarItem: vscode.StatusBarItem): void {
	const n = getNumberofLinesSelected(vscode.window.activeTextEditor);
	if (n > 0) {
		statusBarItem.text = `$(pulse) ${ n } lines selected`
		statusBarItem.color = '#2CC8A5';
		statusBarItem.show();
	} else {
		statusBarItem.hide();
	}
}

function getNumberofLinesSelected(editor: vscode.TextEditor | undefined): number {
	let lines = 0;
	if (editor) {
		lines = editor.selections.reduce((prev, curr) => prev + (curr.end.line - curr.start.line), 0);
	}
	return lines;
}

// this method is called when your extension is deactivated
export function deactivate() {}

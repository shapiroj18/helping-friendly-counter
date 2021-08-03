// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('line-counter.linecounter', () => {

		const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
		updateStatusBarItem(statusBarItem)

	});

	context.subscriptions.push(disposable);
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

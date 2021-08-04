import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const statusBarCount = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
	// set default status bar color
	let statusBarColor = '#2CC8A5'
	// create line counter on startup
	updateStatusBarItem(statusBarCount);
	updateStatusBarColor(statusBarCount, statusBarColor);

	const counterColor = vscode.commands.registerCommand('extension.counterColor', async () => {

		let input_color = await vscode.window.showInputBox({ placeHolder: 'Hex Color (i.e. #2CC8A5)' });
  		if (input_color) {
			updateStatusBarColor(statusBarCount, input_color)
		}
	});

	context.subscriptions.push(counterColor);

	vscode.window.onDidChangeTextEditorSelection((context) => {
		updateStatusBarItem(statusBarCount);
	});

	vscode.window.onDidChangeActiveTextEditor((context) => {
		updateStatusBarItem(statusBarCount);
	});

}

function updateStatusBarColor(statusBarItem: vscode.StatusBarItem, statusBarColor: string): void {
	statusBarItem.color = statusBarColor;
}

function updateStatusBarItem(statusBarItem: vscode.StatusBarItem): void {

	const lines_selected = getNumberofLinesSelected(vscode.window.activeTextEditor);
	const [lines_avg, lines_sum, lines_count] = getValsofSelection(vscode.window.activeTextEditor);
	if (lines_selected > 1 && Number(lines_avg) && Number(lines_sum) && Number(lines_count)) {
		statusBarItem.text = `$(pulse) Lines: ${ lines_selected }   Avg: ${ lines_avg }   Sum: ${ lines_sum }   Count: ${ lines_count }`
		statusBarItem.show();
	} else if (lines_selected > 1) {
		statusBarItem.text = `$(pulse) Lines: ${ lines_selected }`
		statusBarItem.show();
	} else if (Number(lines_avg) && Number(lines_sum) && Number(lines_count)) {
		statusBarItem.text = `Avg: ${ lines_avg }   Sum: ${ lines_sum }   Count: ${ lines_count }`
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
	}
	return lines;
}

function getLine(line_info: any) {
	return line_info._line
}

function getValsofSelection(editor: vscode.TextEditor | undefined): number[] {
	let agg_vals: any = [];
	if (editor) {
		const document = editor.document;
		const selection = editor.selection;
		const text = document.getText(selection);
		// regex matches any word that has digits and letters next to it - i.e. "te5t", "4our", "hell0"
		const regex = /\b(([\d]+(?=[A-Za-z])\w+)|[A-Za-z]+(?=\d)\w+)\b/;
		if (regex.exec(text)) {
			console.log('Text found with values of digits and letters combined');
		} else {
			// regex used follows first pattern of top answer https://stackoverflow.com/questions/9705194/replace-special-characters-in-a-string-with-underscore/9705227
			// can't just include the second answer (string = string.replace(/[^a-zA-Z0-9]/g,'_');) since special characters such as "." and "-" matter for numbers
			const selection_values = text.replace(/\n/g, ' ').replace(/[&\/\\#\[\],+()$~%'"`:*?<>{}]/g, '').split(' ');
			console.log(selection_values)
			let number_vals: number[] = [];
			selection_values.forEach(function (value) {
				if (Number(value)) {
					number_vals.push(Number(value));
				};
			});
			console.log(number_vals)
			const avg = selectionAvg(number_vals);
			const sum = selectionSum(number_vals);
			const count = selectionCount(number_vals);
			agg_vals = [avg, sum, count];
		};
	};
	return agg_vals;
}

function selectionAvg(selection: number[]): number {
	const sum = selection.reduce((a, b) => a + b, 0);
	const avg = sum / selection.length
	return Number(avg.toFixed(2));
}

function selectionSum(selection: number[]): number {
	const sum = selection.reduce((a, b) => a + b, 0);
	return Number(sum.toFixed(2));
}

function selectionCount(selection: number[]): number {
	const count = selection.length;
	return count
}


export function deactivate() {

}
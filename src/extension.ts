import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	const statusBarCount = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
	const statusBarColor = '#2CC8A5'
	// create line counter on startup
	updateStatusBarItem(statusBarCount, statusBarColor);

	vscode.window.onDidChangeTextEditorSelection((context) => {
		updateStatusBarItem(statusBarCount, statusBarColor);
	});

	vscode.window.onDidChangeActiveTextEditor((context) => {
		updateStatusBarItem(statusBarCount, statusBarColor);
	});

}

function updateStatusBarItem(statusBarItem: vscode.StatusBarItem, statusBarColor: string): void {
	statusBarItem.color = statusBarColor;

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
			const selection_values = text.replace(/\n/g, ' ').replace(/"|'|,/g, ' ').split(' ');
			let number_vals: number[] = [];
			selection_values.forEach(function (value) {
				if (Number(value)) {
					number_vals.push(Number(value));
				};
			});
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


export function deactivate() {}

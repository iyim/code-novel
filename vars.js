const template  = `
// {0}
// {1}
const vscode = require('vscode');

// {2}
// {3}

/**
 * @param {vscode.ExtensionContext} {4}
 */
function activate(context) {

	// {5}
	// {6}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {7}
	//{8}
	//{9}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {10}

		// {11}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// {12}
function deactivate() {}

// {13}

/**
 * @param {vscode.ExtensionContext} {14}
 */
function activate(context) {

	// {15}
	// {16}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {17}
	// {18}
	// {19}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {20}

		// {21}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// {22}
function deactivate() {}

// {23}

/**
 * @param {vscode.ExtensionContext} {24}
 */
function activate(context) {

	// {25}
	// {26}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {27}
	// {28}
	// {29}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {30}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}
// {31}
// {32}
const vscode = require('vscode');

// {33}
// {34}

/**
 * @param {vscode.ExtensionContext} {35}
 */
function activate(context) {

	// {36}
	// {37}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {38}
	//{39}
	//{40}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {41}

		// {42}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// {43}
function deactivate() {}

// {44}

/**
 * @param {vscode.ExtensionContext} {45}
 */
function activate(context) {

	// {46}
	// {47}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {48}
	// {49}
	// {50}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {51}

		// {52}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// {53}
function deactivate() {}

// {54}

/**
 * @param {vscode.ExtensionContext} {55}
 */
function activate(context) {

	// {56}
	// {57}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {58}
	// {59}
	// {60}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {61}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
// {62}
// {63}
const vscode = require('vscode');

// {64}
// {65}

/**
 * @param {vscode.ExtensionContext} {66}
 */
function activate(context) {

	// {67}
	// {68}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {69}
	//{70}
	//{71}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {72}

		// {73}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// {74}
function deactivate() {}

// {75}

/**
 * @param {vscode.ExtensionContext} {76}
 */
function activate(context) {

	// {77}
	// {78}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {79}
	// {80}
	// {81}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {82}

		// {83}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// {84}
function deactivate() {}

// {85}

/**
 * @param {vscode.ExtensionContext} {86}
 */
function activate(context) {

	// {87}
	// {88}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {89}
	// {90}
	// {91}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {92}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
/**
 * @param {vscode.ExtensionContext} {93}
 */
function activate(context) {

	// {94}
	// {95}
	console.log('Congratulations, your extension "codenovel" is now active!');

	// {96}
	// {97}
	// {98}
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// {99}
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}


`
module.exports = template;
const vscode = require('vscode');
const fs = require("fs")
const path = require("path")
const tpl = require("./vars.js")

// 展示的小说路径
let novelPath = ''
// 小说内容按行存储
let novelLines = []

// 总共的页码
let totalPage = 0
// 状态栏
let statusBar = null

let env = null

// 字符串占位符
String.prototype.format = function () {
  if (arguments.length == 0) return this;
  var param = arguments[0];
  var s = this;
  if (typeof (param) == 'object') {
    for (var key in param)
      s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
    return s;
  } else {
    for (var i = 0; i < arguments.length; i++)
      s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
  }
}
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  init()
  let open = vscode.commands.registerCommand('extension.helloWorld', () => {
    const options = {
      // 选中第3行第9列到第3行第17列
      //selection: new vscode.Range(new vscode.Position(2, 8), new vscode.Position(2, 16));
      // 是否预览，默认true，预览的意思是下次再打开文件是否会替换当前文件
      //preview: false,
      // 显示在第二个编辑器
      viewColumn: vscode.ViewColumn.One
    };
    vscode.window.showTextDocument(vscode.Uri.file(novelPath), options);
  });
  // 下一页
  let next = vscode.commands.registerCommand('extension.nextpage', () => {
    nextPage()
  })
  // 上一页
  let prev = vscode.commands.registerCommand('extension.prevpage', () => {
    prePage()
  })
  let clickBar = vscode.commands.registerCommand('extension.clickStatusBar', () => {
    vscode.window.showQuickPick(Object.keys(env['books'])).then((value) => {
      console.log(value)
      if (value && env['currentBook'] !== value) {
        changeBook(value)
      }
    })
  })
  context.subscriptions.push(open);
  context.subscriptions.push(next);
  context.subscriptions.push(prev);
  context.subscriptions.push(clickBar);
}

function init() {
  initPathAndEnv()
  initNovelInfo()
  initStatusBar()
  getPage()
}

function initPathAndEnv() {
  // 展示的novel路径
  novelPath = path.join(__dirname, 'novel.js')
  // 配置路径，记录了当前读的进度
  const envPath = path.join(__dirname, "env.json")
  // 读取配置
  const envStr = fs.readFileSync(envPath).toString()
  env = JSON.parse(envStr)
  const booksDir = path.join(__dirname, 'books')
  let books = fs.readdirSync(booksDir)
  books = books.filter(book => book.endsWith('txt'))

  books.forEach(book => {
    if (!env['books']) {
      env['books'] = {}
    }else{
      Object.keys(env['books']).forEach(k => {
        if (!books.find(b => b === k)){
          delete env['books'][k]
        }
      })
    }
    if (!env['books'][book]) {
      env['books'][book] = 1
    }
  })
  if (books.length === 0) {
    vscode.window.showErrorMessage(`没有txt格式的书籍,请在路径${path.join(__dirname, 'books')}下放置书籍!`)
    return
  }
  if (!env['currentBook'] || !books.find(b => b === env['currentBook'])) {
    env['currentBook'] = books[0]
  }

}

function initNovelInfo() {
  var content = fs.readFileSync(path.join(__dirname, 'books', env['currentBook']))
  novelLines = content.toString().split("\n")
  totalPage = Math.ceil(novelLines.length / 100)
}

function initStatusBar() {
  const message = `${env['currentBook']}   ${env['books'][env['currentBook']]} | ${totalPage}`
  const barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  barItem.text = message;
  barItem.command = 'extension.clickStatusBar'
  barItem.show();
  statusBar = barItem
}

function getPage() {
  const lines = novelLines.slice((env['books'][env['currentBook']] - 1) * 100, (env['books'][env['currentBook']] * 100))
  var template = tpl.format(...lines)
  fs.writeFileSync(novelPath, template)
  if (statusBar) {
    statusBar.text = `${env['currentBook']}   ${env['books'][env['currentBook']]} | ${totalPage}`
  }
  scrollToTop()
  updateEnv()
}

function updateEnv() {
  const envPath = path.join(__dirname, "env.json")
  fs.writeFileSync(envPath, JSON.stringify(env))
}

function nextPage() {
  if (env['books'][env['currentBook']] < totalPage) {
    env['books'][env['currentBook']]++;
  }
  getPage()
}
function prePage() {
  if (env['books'][env['currentBook']] > 1) {
    env['books'][env['currentBook']]--;
  }
  getPage()
}

function changeBook(book) {
  env['currentBook'] = book
  initNovelInfo()
  getPage()
}

function scrollToTop() {
  let editor = vscode.window.activeTextEditor;
  if (editor) {
    let range = editor.document.lineAt(0).range;
    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range);
  }
}

// this method is called when your extension is deactivated
function deactivate() { }

exports.deactivate = deactivate;
exports.activate = activate;
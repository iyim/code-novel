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
let processBar = null
let nextBar = null
let prevBar = null
let jumpBar = null

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
  let open = vscode.commands.registerCommand('extension.openNovel', () => {
    const options = {
      // 选中第3行第9列到第3行第17列
      //selection: new vscode.Range(new vscode.Position(2, 8), new vscode.Position(2, 16));
      // 是否预览，默认true，预览的意思是下次再打开文件是否会替换当前文件
      //preview: false,
      // 显示在第二个编辑器
      viewColumn: vscode.ViewColumn.One
    };
    vscode.window.showTextDocument(vscode.Uri.file(novelPath), options).then(editor => {
      console.log(editor)
    })
  });
  // 下一页
  let next = vscode.commands.registerCommand('extension.nextpage', () => {
    nextPage()
  })
  // 上一页
  let prev = vscode.commands.registerCommand('extension.prevpage', () => {
    prePage()
  })
  // 跳页
  let jump = vscode.commands.registerCommand('extension.jumppage', () => {
    vscode.window.showInputBox({
      placeHolder: "请输入页码"
    }).then(value => {
      if (value) {
        jumpPage(value)
      }
    })
  })
  let clickBar = vscode.commands.registerCommand('extension.clickStatusBar', () => {
    vscode.window.showQuickPick(Object.keys(env['books'])).then((value) => {
      console.log(value)
      if (value && env['currentBook'] !== value) {
        changeBook(value)
      }
    })
  })
  vscode.window.onDidChangeActiveTextEditor(editor => {
    console.log(editor)
    if (editor) {
      const fspath = editor.document.uri.fsPath
      if (fspath && fspath.toLowerCase() === path.join(__dirname, 'novel.js').toLowerCase()) {
        processBar.show()
        nextBar.show()
        prevBar.show()
        jumpBar.show()
      } else {
        processBar.hide()
        nextBar.hide()
        prevBar.hide()
        jumpBar.hide()
      }
    }else {
      processBar.hide()
      nextBar.hide()
      prevBar.hide()
      jumpBar.hide()
    }
  })
  context.subscriptions.push(open);
  context.subscriptions.push(next);
  context.subscriptions.push(prev);
  context.subscriptions.push(jump);
  context.subscriptions.push(clickBar);
}

function init() {
  initPathAndEnv()
  initNovelInfo()
  initStatusBar()
  getPage()
  let editor = vscode.window.activeTextEditor;
  if (editor) {
    const fspath = editor.document.uri.fsPath
    if (fspath && fspath.toLowerCase() === path.join(__dirname, 'novel.js').toLowerCase()) {
      processBar.show()
      nextBar.show()
      prevBar.show()
      jumpBar.show()
    }
  }
}

function initPathAndEnv() {
  console.log("初始化环境")
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
    } else {
      Object.keys(env['books']).forEach(k => {
        if (!books.find(b => b === k)) {
          delete env['books'][k]
        }
      })
    }
    if (!env['books'][book]) {
      env['books'][book] = 1
    }
  })
  if (books.length === 0) {
    throw new Error(`没有txt格式的书籍,请在路径${path.join(__dirname, 'books')}下放置书籍!`)
  }
  if (!env['currentBook'] || !books.find(b => b === env['currentBook'])) {
    env['currentBook'] = books[0]
  }

}

// 初始化小说内容
function initNovelInfo() {
  var content = fs.readFileSync(path.join(__dirname, 'books', env['currentBook']))
  novelLines = content.toString().split("\n")
  totalPage = Math.ceil(novelLines.length / 100)
}
// 初始化状态栏
function initStatusBar() {
  const message = `${env['currentBook']}   ${env['books'][env['currentBook']]} | ${totalPage}`
  // 进度bar
  processBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
  processBar.text = message;
  processBar.command = 'extension.clickStatusBar'

  // 上一页的bar
  prevBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  prevBar.text = "上一页";
  prevBar.command = 'extension.prevpage'

  // 下一页的bar
  nextBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  nextBar.text = "下一页";
  nextBar.command = 'extension.nextpage'

  jumpBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  jumpBar.text = "跳页";
  jumpBar.command = 'extension.jumppage'
}
// 获取当前页数据
function getPage() {
  const lines = novelLines.slice((env['books'][env['currentBook']] - 1) * 100, (env['books'][env['currentBook']] * 100))
  var template = tpl.format(...lines)
  fs.writeFileSync(novelPath, template)
  if (processBar) {
    processBar.text = `${env['currentBook']}   ${env['books'][env['currentBook']]} | ${totalPage}`
  }
  scrollToTop()
  updateEnv()
}
// 更新用户进度
function updateEnv() {
  const envPath = path.join(__dirname, "env.json")
  fs.writeFileSync(envPath, JSON.stringify(env))
}
// 下一页
function nextPage() {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return
  }
  const fspath = editor.document.uri.fsPath
  if (fspath && fspath.toLowerCase() !== path.join(__dirname, 'novel.js').toLowerCase()) {
    return
  }
  if (env['books'][env['currentBook']] < totalPage) {
    env['books'][env['currentBook']]++;
  }
  getPage()
}
// 上一页
function prePage() {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return
  }
  const fspath = editor.document.uri.fsPath
  if (fspath && fspath.toLowerCase() !== path.join(__dirname, 'novel.js').toLowerCase()) {
    return
  }
  if (env['books'][env['currentBook']] > 1) {
    env['books'][env['currentBook']]--;
  }
  getPage()
}
// 跳頁
function jumpPage(page) {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return
  }
  const fspath = editor.document.uri.fsPath
  if (fspath && fspath.toLowerCase() !== path.join(__dirname, 'novel.js').toLowerCase()) {
    return
  }
  if (isNumber(page)) {
    if (page < 1 || page > totalPage) {
      vscode.window.showWarningMessage(`页码范围1-${totalPage}`)
      return
    } else {
      env['books'][env['currentBook']] = page
      getPage()
    }
  } else {
    vscode.window.showWarningMessage(`请输入数字`)
  }
}
// 切换书
function changeBook(book) {
  env['currentBook'] = book
  initNovelInfo()
  getPage()
}
// 切换页后将光标定位到第一行
function scrollToTop() {
  let editor = vscode.window.activeTextEditor;
  if (editor) {
    let range = editor.document.lineAt(0).range;
    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range);
  }
}

function isNumber(nubmer) {
  var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
  if (!re.test(nubmer)) {
    return false;
  }
  return true
}

function deactivate() { }

exports.deactivate = deactivate;
exports.activate = activate;
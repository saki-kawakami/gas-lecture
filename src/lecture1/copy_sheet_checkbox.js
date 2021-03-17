/*
参考
https://www.cg-method.com/spreadsheets-create-duplicate-sheet-date/
*/

// テンプレートのシートを複製する関数
function copySheetByTemplate(){
    const ss = SpreadsheetApp.getActiveSpreadsheet(); 
  
    // 作成するシート名を日付で作成
    const sheetName = getDate();
  
    // 挿入するシートの位置を定義
    const position = 2;
  
    // テンプレートのシートを取得
    const templateSheet = ss.getSheetByName('テンプレート（名前入り）');
  
    // コピー元のシートを取得
    ss.insertSheet(sheetName, position, {template: templateSheet});
  }
  
  // 現在の月と週数を取得する関数
  function getDate(){
    const today = new Date(); 
    // 現在の日時をYYYY/MM/DDとして出力する
    return Utilities.formatDate(new Date(), "JST", "YYYY/MM/DD");
  }
  
  // チェックボックスに合わせてメールを表示する
  function setMail(e) {
  
    if (e.value !== 'TRUE' && e.value !== 'FALSE') {
      return
    }
  
    const range = e.range;
    const email = e.value === 'TRUE' ? Session.getActiveUser().getEmail() : ''
    const sheet = e.source.getActiveSheet();
    const numRows = range.rowEnd - range.rowStart + 1;
    const numColumns = range.columnEnd - range.columnStart + 1;
    sheet.getRange(range.rowStart, range.columnStart + 1, numRows, numColumns).setValues([[email]]);
    
    console.log('write', email)
  }
  
  // userの中身を出力するのに、権限の付与が必要
  function activate() {
    Session.getActiveUser().getEmail()
  }
  
  // トリガーの設定
  function setTriggers() {
    activate()
    ScriptApp.newTrigger('setMail')
     .forSpreadsheet(SpreadsheetApp.getActive())
     .onEdit()
     .create();
  }
  
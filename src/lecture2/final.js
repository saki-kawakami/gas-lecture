/* 実行するときは、以下のコメントアウトを外す */

// 1. GAS-lecture フォーム(version.1)のフォームとスプレッドシートをコピーしてください
// 2. フォームとスプレッドシートを紐づけてください(フォームの回答からスプレッドシートを選択する)
// 3. submitFormをトリガーに連携してください
// 4. sendEmailのメールアドレスをあなたのメールに変更してください。
// 5. フォームに入力して、メールが飛ぶことを確認してください。


function submitForm(e) {
  console.log('start submitForm');

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);// 複数のフォーム送信がほぼ同時にあった時，遅い方に最大30秒待ってもらう
    var formItem = getFormItem(e);
    sendEmail(formItem);
  } catch(err) {
    console.log("発生したエラー：" + err);
  } finally {
    lock.releaseLock();// 次の送信のためにロック解除
    console.log('end submitForm');
  }
}

// フォームの情報を取得する
function getFormItem(e) {

  // イベントのトリガーIDからformの入力フォームの情報を取得する
  var fileId = getFileIdByTriggerId(e.triggerUid);
  var form = FormApp.openById(fileId);
  var title = form.getTitle();
  var description = form.getDescription();

  // item別の入力内容を取得する
  var itemResponses = e.response.getItemResponses();
  var columns = itemResponses.map(function(itemResponse, idx) {
    return {
       itemId: itemResponse.getItem().getId(),
       column: getAlphabet(idx + 3),
       columnOrder: idx + 3,
       title: itemResponse.getItem().getTitle(),
       value: itemResponse.getResponse(),
    };
  }, []);

  // その他の入力内容を取得する
  return {
    form: {
      title: title,
      description: description,
    },
    columns: columns,
    mail: e.response.getRespondentEmail(),
    url: e.response.getEditResponseUrl(),
  }
}

// イベントのトリガーIDからフィアルIDを取得する
function getFileIdByTriggerId(triggerId) {

  var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i<triggers.length; i++) {
      if(triggers[i].getUniqueId() == triggerId) {
      return triggers[i].getTriggerSourceId();
    }
  }
}

// titleにあうカラムを取得する
function getColumn(objects, value) {

  var targetObject = objects.find(function (object) {
    return object['title'] === value
  })
  return targetObject['value']
}

// カラム列番号からアルファベットを取得する
function getAlphabet(columnOrder) {

  var alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var alphabetMaxCount = alphabets.length;
  var remainedOrder = (columnOrder - 1) % alphabetMaxCount;
  var dividedOrder = Math.floor((columnOrder - 1) / alphabetMaxCount);
  var alphabet1st = dividedOrder === 0 ? '' : alphabets[dividedOrder - 1];
  var alphabet2nd = alphabets[remainedOrder];
  return alphabet1st + alphabet2nd;
}

// メールの送信
function sendEmail(item) {

  var name = getColumn(item.columns, "氏名")
  var division = getColumn(item.columns, "事業部")
  var contact = getColumn(item.columns, "お問い合わせ")
  var mail = item.mail
  var url = item.url
  var cc = ["test@test.com"].join(",")

  var body = name + " さん\n" 
    +"入力を受け付けました。\n"
    +"このメールは自動返信メールです。\n"
    +"======================\n"
    +"メールアドレス: " + mail + "\n"
    +"氏名: " + name + "\n"
    +"事業部: " + division + "\n"
    +"お問い合わせ: " + contact + "\n"
    +"URL: " + url + "\n"

  // メール送信
  var content = {
    to: mail,
    cc: cc,
    subject: "GAS講習に関するお問い合わせ",
    name: "GAS-lecture フォーム",
    body: body,
  }

  console.log(content);
  MailApp.sendEmail(content);
}

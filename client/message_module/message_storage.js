const _db = require('../mirror_db')
const moment = require('moment')
var freinds_obj={};
var freinds_obj_rep = {};
var currunt_sender = '';

//message storage 생성
function showMessageStorage() {
    _db.select('*', 'message', `receiver =${_db.getId()}`)
        .then(messages => {
            create_storage(messages);
        })
}

function create_storage(messages) {

    document.getElementById('message_storage_contents').replaceChildren();
    _db.select('*', 'friend', `id=${_db.getId()}`)
        //freinds_obj[sender] = name 객체 생성
        .then(friends => {         
            friends.forEach(element => {
                freinds_obj[element.friend_id] = element.name;
                freinds_obj_rep[element.friend_id] = element.name;
            })
        }).then(() => {
            for (var i =  messages.length-1; i >=0; i--) {
                var message = messages[i];
                var sender = freinds_obj[message.sender];
                if (sender == 2) continue;

                //message_storage_content(context, date, sender)
                var message_div = document.createElement('div');
                message_div.setAttribute('class', 'message_storage_content');
                message_div.setAttribute('value', message.sender);

                //내용
                var message_content = document.createElement('div');
                message_content.setAttribute('class', 'message_storage_content_context');
                message_content.setAttribute('value', message.sender);
                //Date
                var message_date = document.createElement('div');
                message_date.setAttribute('class', 'message_storage_content_date');
                message_date.setAttribute('value', message.sender);
                message_date.innerHTML = moment(message.send_time).format('MM-DD HH:mm');
                //sender
                var message_send = document.createElement('div');
                message_send.setAttribute('class', 'message_storage_content_sender');
                message_send.setAttribute('value', message.sender);
                message_send.innerHTML = sender;
                if (message_send.innerHTML == 'undefined')
                    message_send.innerHTML = '알 수 없음';
                
                //content
                switch (message.type) {
                    case 'text':
                        message_content.innerHTML = message.content;
                        break;
                    case 'image':
                        message_content.innerHTML = '(사진)';
                        break;
                    case 'audio':
                        message_content.innerHTML = '(음성 메시지)';
                }

                message_div.appendChild(message_send);
                message_div.appendChild(message_date);
                message_div.appendChild(message_content);

                message_content.addEventListener("click", (e) => { message_storage_detail(e.target) });
                document.getElementById('message_storage_contents').appendChild(message_div);
                freinds_obj[message.sender] = 2;

            }
        })
}



//메시지 함에서 오른쪽 메시지 클릭시 과거의 메시지 모두 출력
function message_storage_detail(e) {

    var sender_id = e.getAttribute('value');
    var contents = document.getElementById('message_storage_detail_contents');
    contents.replaceChildren();

    if (currunt_sender == sender_id) return;
    currunt_sender = sender_id;
    
    _db.select('*', 'message', `sender=${sender_id} and receiver=${_db.getId()}`)
        .then((messages) => {
            messages.forEach(message => {
                let content = document.createElement('div');
                let context = document.createElement('div');
                let date = document.createElement('div');

                content.setAttribute('class', 'message_storage_detail_content');
                context.setAttribute('class', 'message_storage_detail_context');
                date.setAttribute('class', 'message_storage_detail_date');

                //date, time
                date.innerHTML = moment(message.send_time).format('MM-DD HH:mm');

                //context
                switch (message.type) {
                    case 'text':
                        context.innerHTML = message.content;
                        break;
                    case 'image':
                        let img = document.createElement('img');
                        img.src = './memo_module/image/' + message.content + '.jpg';
                        context.appendChild(img);
                        break;
                    case 'audio':
                        var audio_folder = './message_module/record/audio/client/';
                        var audio = document.createElement('audio');
                        audio.setAttribute('id', 'storage-audio');
                        audio.controls = 'controls';
                        audio.src = audio_folder + message.content + '.wav';
                        context.appendChild(audio);
                        break;

                }
                content.appendChild(context);
                content.appendChild(date);
                contents.prepend(content);
            })

        })
    }
module.exports = { showMessageStorage }
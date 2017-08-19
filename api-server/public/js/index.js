$(document).ready(function(){
    var arg = new Object;
    var pair=location.search.substring(1).split('&');
    for(var i=0;pair[i];i++) {
        var kv = pair[i].split('=');
        arg[kv[0]]=kv[1];
    }
    if(arg.hasOwnProperty('view')){
        if(arg.view == 'game'){
            $('.h1-title').hide();
        }
    }

    update();
    setInterval(update,30000);

});

function update(){

    $('#ul-ranking').empty();
    $.ajax({
        type: 'get',
        url: '/users'
    })
    .done(function(returnData) {
        var ul = $('#ul-ranking');
        $.each(returnData,function(i,d){
            var name = $('<span class="name">');
            name.text(d.name);
            var score = $('<span class="score">');
            score.text(d.score);
            var rank = $('<span class="rank">');
            rank.text((i+1)+'位');
            var row = $('<span clas="row">');
            row.append(rank);
            //p.append('<span class="label">名前</span>');
            row.append(name);
            row.append('<span class="label">スコア</span>');
            row.append(score);
            var li = $('<li class="list-group-item">');
            li.append(row);
            ul.append(li);

        });

    });
}
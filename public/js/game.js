$(document).ready(function () {

    var draggie = new Draggabilly( '.draggable', {
        axis: 'x'
    });


    var dragStop = true;

    draggie.on( 'dragEnd', function( event, pointer) {
        if (draggie.position.x == 0) {
            $('#fake_icon').hide();
            $('#true_icon').hide();
        }
    });

    draggie.on( 'dragMove', function( event, pointer, moveVector ) {

        if(draggie.position.x >= -350 && draggie.position.x <= 350){
            if (draggie.position.x < 0) {
                $('#fake_icon').show();
                $('#true_icon').hide();
            } else if (draggie.position.x > 0) {
                $('#fake_icon').hide();
                $('#true_icon').show();
            } else {
                $('#fake_icon').hide();
                $('#true_icon').hide();
            }
            draggie.position.x = 0;
        } else if(draggie.position.x < -350) {
            if(dragStop){
                fakeNewsCheck();
                dragStop = false;
            }
            draggie.position.x = 0;

        } else if (draggie.position.x > 350) {
            if(dragStop){
                trueNewsChek();
                dragStop = false;
            }
            draggie.position.x = 0;

        }

    });


    $('#start_game').on('click', function () {
        $('.game_greetings').hide();

        getNewsList();
    });

    var newsData = null;
    var totalCount = null;
    var goodAnswer = 0;
    function getNewsList() {
        $.ajax({
            type: "GET",
            url: "/game/get-news",
            contentType: false,
            cache: false,
            processData:false,
            success: function(data){
                newsData = data;
                totalCount = data.length;
                var news_count = data.length;
                renderNewsCard(data, news_count);
            },
        });
    }

    var newsItem = null;

    function setItem(data) {
        newsItem = data;
    }

    function getItem() {
        return newsItem;
    }
    var index = null;
    function renderNewsCard(data, count_news) {
         index = count_news - 1;

        if(index < 0) {
            getResult();
        } else {
            setItem(data[index]);
            $('#game-card-title').text(data[index].title);
            $('#game-card-body').text(data[index].body);
            $('#game-card-img').attr('src', data[index].img_path);
            $('#game-card-img').show();
            $('#game-card-source').text(data[index].source);
            $('#game-card-source').attr('href', data[index].source);
            $('.game_news_card').css('left', '0px');

            $('.game_news_card').fadeIn( 100 );
            $('.game_button_box').fadeIn( 100 );
            dragStop = true;
            $('.card').scrollTop( 0 );
            $('.game-counter').text(totalCount-index + '/' + totalCount);

        }
    }


    $('#fake_news_btn').on('click', function () {
        fakeNewsCheck();
    });

    $('#true_news_btn').on('click', function () {
        trueNewsChek();
    });

    function fakeNewsCheck() {
        var curNews = getItem();
        hideAnimate(false);
        if(curNews.is_true == 0) {
            $('.card-message-title').text('Верно!');
            goodAnswer++;
            $('.card-message-body').text(curNews.message);
        }else {
            $('.card-message-title').text('Не Верно!');
            $('.card-message-body').text(curNews.message);
        }
        draggie.position.x = 0;
        setTimeout(function () {
            $('.card-message-box').fadeIn( 100 );
        }, 1000);
    }

    function hideAnimate(checktrue) {
        if (checktrue) {
            $('.game_news_card').animate({"left": "+=1000px"}, 'slow')
        } else {
            $('.game_news_card').animate({"left": "-=1000px"}, 'slow')
        }

        setTimeout(function () {
            $('.game_news_card').hide();
            $('.game_button_box').hide();
        }, 100);
    }

    function trueNewsChek() {
        var curNews = getItem();
        hideAnimate(true);
        if(curNews.is_true == 1) {
            $('.card-message-title').text('Верно!');
            goodAnswer++;
            $('.card-message-body').text(curNews.message);
        }else {
            $('.card-message-title').text('Не Верно!');
            $('.card-message-body').text(curNews.message);
        }
        draggie.position.x = 0;
        setTimeout(function () {
            $('.card-message-box').fadeIn( 100 );
        }, 1000);
    }


    $('#game_return_btn').on('click', function () {
        $('.card-message-box').hide();
        renderNewsCard(newsData, index);
    });

    function getResult() {
        $('#game-result').text('Ваш результат ' + goodAnswer + ' из ' + totalCount);
        $('.game_result_box').show();
    }

});
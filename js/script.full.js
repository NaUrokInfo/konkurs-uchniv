(function( $ ){

    $.fn.dependedSelect = function( options ) {


        var settings = $.extend( {
            method: 'get',
            url: false,
            destSelector: false,
            callback : false,
            event: 'change',
            getData: false,
            searchParam: 'id',
            keyParam: 'id',
            valParam: 'name',
            forceLoad: false,
            preselectedValue: false,
            prompt: false
        }, options);

        var self = this;
        /*if((!settings.destSelect && !settings.callback) || !settings.url)
            throw "error configuration, callback or destSelect must be set";*/

        var loadFn = function () {
            var data = {};
            data[settings.searchParam] = self.val();
            $.ajax({
                method: settings.method,
                url: settings.url,
                dataType: 'json',
                data: data,
                success: function (result) {
                    var htm = settings.prompt
                        ? ('<option value="">' + settings.prompt + '</option>')
                        : '';
                    for(var i in result) {
                        if(settings.preselectedValue !== false
                            && result[i][settings.keyParam] == settings.preselectedValue) {
                            htm += '<option selected value="' + result[i][settings.keyParam] + '">'
                                + result[i][settings.valParam] + '</option>';
                        } else {
                            htm += '<option value="' + result[i][settings.keyParam] + '">'
                                + result[i][settings.valParam] + '</option>';
                        }
                    }

                    $(settings.destSelector).html(htm);

                    if(settings.callback)
                        settings.callback(result, self, $(settings.destSelector));
                }
            });
        };

        this.on(settings.event, loadFn);
        if(settings.forceLoad)
            loadFn();

        return self;
    };

    $.fn.sthAlert = function (html) {
        /*var self = this;

        var _containerId = 'sth_alert_container';
        var container = $('#' + _containerId);
        if(!container.length) {
            $('body').append('<div id="' + _containerId + '" style="position: fixed;top: 60px;z-index: 999;" ></div>');
            container = $('#' + _containerId);
        }

        var alert = $('<div class="sth-alert">' + html + '</div>');
        container.append(alert);

        setTimeout(function() {
            alert.remove();
        }, 1000);

        return self;*/
    };

    $.fn.buffer = function () {
        var self = this;
        return self.each(function (i,el) {
            el = $(el);
            el.on('click', function(e) {
                e.preventDefault();
                var t = $(el.attr('data-target'));
                if(t.length) {
                    var te = $('<textarea style="height: 0;width: 0;opacity: 0;">' + t.text() + '</textarea>');
                    $('body').append(te);
                    te.select();
                    document.execCommand('copy');
                    te.remove();
                    self.trigger('copied.sth.buffer',t.text());
                    //console.log(t.text());
                }
            });
        });
    };


    //enable buffer by data-attribute
    setTimeout(function () {
        $('[data-toggle=buffer]').buffer();
    }, 1000);

})( jQuery );
Share = {
    vkontakte: function(purl, ptitle, pimg, text) {
        url  = 'http://vk.com/share.php?';
        url += 'url='          + encodeURIComponent(purl);
        if(ptitle) url += '&title='       + encodeURIComponent(ptitle);
        if(text) url += '&description=' + encodeURIComponent(text);
        if(pimg) url += '&image='       + encodeURIComponent(pimg);
        url += '&noparse=true';
        Share.popup(url);
    },
    odnoklassniki: function(purl, text) {
        url  = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
        if(text) url += '&st.comments=' + encodeURIComponent(text);
        url += '&st._surl='    + encodeURIComponent(purl);
        Share.popup(url);
    },
    facebook: function(purl, ptitle, pimg, text) {
        url  = 'http://www.facebook.com/sharer.php?s=100';
        if(ptitle) url += '&p[title]='     + encodeURIComponent(ptitle);
        if(text) url += '&p[summary]='   + encodeURIComponent(text);
        url += '&u='       + encodeURIComponent(purl);
        //if(pimg) url += '&p[images][0]=' + encodeURIComponent(pimg);
        Share.popup(url);
    },
    twitter: function(purl, ptitle) {
        url  = 'http://twitter.com/share?';
        if(ptitle) url += 'text='      + encodeURIComponent(ptitle);
        url += '&url='      + encodeURIComponent(purl);
        url += '&counturl=' + encodeURIComponent(purl);
        Share.popup(url);
    },
    google: function(purl) {
        url  = 'https://plus.google.com/share?';
        url += 'url='      + encodeURIComponent(purl);
        Share.popup(url);
    },
    mailru: function(purl, ptitle, pimg, text) {
        url  = 'http://connect.mail.ru/share?';
        url += 'url='          + encodeURIComponent(purl);
        if(ptitle) url += '&title='       + encodeURIComponent(ptitle);
        if(text) url += '&description=' + encodeURIComponent(text);
        if(pimg) url += '&imageurl='    + encodeURIComponent(pimg);
        Share.popup(url)
    },
    telegram: function(purl, ptitle) {
        url  = 'https://t.me/share/url?';
        url += 'url='          + encodeURIComponent(purl);
        if(ptitle) url += '&text='       + encodeURIComponent(ptitle);
        Share.popup(url)
    },
    viber: function(purl, ptitle) {
        url  = 'viber://forward?text=';
        url += encodeURIComponent(ptitle + " " + purl);
        window.location.href = url;
    },
    popup: function(url) {
        window.open(url,'','toolbar=0,status=0,width=626,height=436');
    },
    log: function(type, id, network){
         $.ajax({type: "POST",
              url: '/site/share',
              data: { id: id, type:type, network:network, _csrf: document.head.querySelector("[name=csrf-token]").content },
              success:function(result){},
              error:function(result){}
         });
    }
};

$(function () {
  // $('[data-toggle="tooltip"]').tooltip()
});

function updateFilter(type){
    if($('#controller').val() == 'test'){
        $('.h1-block').html('Онлайн тести');
        request(getUrlTest(type));
    }else{
        $('.h1-block').html('Бібліотека розробок');
        request(getUrl(type));
    }


}
function updateType(type){
    if($('#controller').val() == 'test'){
        $('.h1-block').html('Онлайн тести');
    }else{
        $('.h1-block').html('Бібліотека розробок');
    }
    $('.type').removeClass('active');
    var type_id = $(type).addClass('active').attr('data-type-id');
    if(type_id > 0){
        var url = getUrl(4);
        //url += '/type-'+type_id;
        request(url);
    }else{
        var url = getUrl(type);
        request(url);
    }
}
function getGrade(item){
    //console.log(item.value);
    //alert(1);
    if(item){
                    $('.bid-exist .loader').show();
                    $('.bid-exist .form').hide();
    $.get( '/api/events/'+item+'/grade', function( data ) {
        //    $('.bid-exist').hide();
        //    $('.subj').show();
    //    $('.no-subj').hide();

            $('.gradesList').html('');
            $('.bidsList').html('');
            //if(data.eventGrades.length > 0){
                $.each(data.eventGrades, function( index, value ) {
                    $('.gradesList').append('<option value="'+index+'">'+value+'</option>');
                });
                $('.btn-submit-bid').show();
            //}
            if(data.freeBids.length > 0){
                $('.bid-exist').show();
                $('.bidsList').append('<option value="0">Оберіть клас</option>');
                $('.bid-exist .loader').hide();
                $('.bid-exist .form').show();
                $.each(data.freeBids, function( index, value ) {
                    $('.bidsList').append('<option value="'+value.id+'">'+value.grade_id+'-'+value.group+'</option>');
                });

            }else{

                $('.bid-exist').hide();
                $('.bidsList').append('<option value="0" selected></option>');
            }
        },'json');
    }else{
            $('.btn-submit-bid').hide();
        //$('.no-subj').show();
        //$('.subj').hide();
    }
}

function getUrl(type){
        var attrs = [];
        attrs.push($('#subject_id').val());
        attrs.push((type == 1 ? false : $('#grade_id').val()) );
        attrs.push((type == 1 || type == 2 ? false : $('#book_id').val()) );
        attrs.push(type == 1 || type == 2 || type == 3  ? false : ($('#paragraph_id').val()) );
        attrs.push($('.type.active').attr('data-type-id'));
        attrs.push($('input#documentsearch-inclusive').prop('checked'));
        attrs.push($('input#documentsearch-new_school').prop('checked'));
        attrs.push($('#documentsearch-query').val());
        var url = '/'+$('#controller').val();
        console.log(attrs);
        for(var i = 0; i<attrs.length; i++){
            if(attrs[i] && attrs[i] != 'Оберіть підручник...' && attrs[i] != 'Оберіть урок...' && attrs[i] != 'Клас...' && attrs[i] != 'Оберіть предмет...'){
                switch (i) {
                    case 1:
                        url += '/klas-'+attrs[i];
                        break;
                    case 2:
                        if(attrs[i] > 0){
                            url += '/pidruchnyk-'+attrs[i];
                        }
                        break;
                    case 3:
                        if(attrs[i] > 0){
                            url += '/tema-'+attrs[i];
                        }
                        break;
                    case 4:
                        if(attrs[i] > 0){
                            url += '/typ-'+attrs[i];
                        }
                        break;
                    case 5:
                        if(attrs[i] == true){
                            url += '?inclusive=true';
                        }
                        break;
                    case 6:
                        if(attrs[i] == true){
                            url += (attrs[5] == true ? '&' : '?')+'new_school=true';
                        }
                        break;
                    case 7:
                        if(attrs[i] !=''){
                            url += (attrs[6] == true ? '&' : '?')+'q='+attrs[i];
                        }
                        break;
                    default:
                        url += '/'+attrs[i];
                        break;
                }
            }
            if(i == attrs.length-1){
                return url;
            }
        }
}

function getUrlTest(type){
        var attrs = [];
        attrs.push($('#subject_id').val());
        attrs.push($('#grade_id').val());
        attrs.push($('#documentsearch-query').val());
        var url = '/'+$('#controller').val();
        console.log(attrs);
        for(var i = 0; i<attrs.length; i++){
            if(attrs[i] && attrs[i] != 'Оберіть предмет...' && attrs[i] != 'Клас...'){
                switch (i) {
                    case 1:
                        url += '/klas-'+attrs[i];
                        break;
                    case 2:
                        if(attrs[i] !=''){
                            url += (attrs[2] == true ? '&' : '?')+'q='+attrs[i];
                        }
                        break;
                    default:
                        url += '/'+attrs[i];
                        break;
                }
            }
            if(i == attrs.length-1){
                return url;
            }
        }
}
/*
$(document).on('click', '.pagination li a', function(e){
    e.preventDefault();
    $('.pagination li').removeClass('active');
    $(this).parent('li').addClass('active');
    var url = $(this).attr('href');
    request(url);
}); */

$(document).on('click', '.search-query-button', function(e){
    e.preventDefault();
    var query = $('#documentsearch-query').val();
    request(getUrl(5));
});

function clearSearchForm(){
    $('#documentsearch-query').val('');
    request(getUrl(5));
}
function request(url){
     $( ".items" ).html('<p class="text-center"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></p>');
    $.get( url, function( data ) {
      $( ".items" ).html( data );
    });
    window.History.pushState({url: url}, document.title, url);
    //setTimeout(function(){
        //check(url);
    //},500);
}
function loadPosts(){
    var page = $('.load-more').attr('data-page');
    $('.load-more-block').remove();
    var url = '?page='+page;
    requestJournal(url, page);
}
function requestJournal(url, page){
    $( ".load-more-block"+page+" .text-center" ).html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');
    $.get( url, function( data ) {
        $( ".load-more-block"+page).remove();
      $( ".more-posts"+page ).html( data );
    });
}

function check(url){
    var attrs = [];
    attrs.push($('#subject_id').val());
    attrs.push($('#grade_id').val());
    attrs.push($('#book_id').val());
    attrs.push($('#paragraph_id').val());
    var url = '/'+$('#controller').val();
    for(var i = 0; i<attrs.length; i++){
        if(attrs[i] && attrs[i] != 'Оберіть підручник...' && attrs[i] != 'Оберіть урок...' && attrs[i] != 'Клас...' && attrs[i] != 'Оберіть предмет...'){
            if(i == 1){
                url += '/klas-'+attrs[i];
            }else{
                url += '/'+attrs[i];
            }
        }
        console.log(url);
        if(i == attrs.length-1){
            window.History.pushState({url: url}, document.title, url);
        }
    }
}

var slider = {
    current:1,
    next:function(){

        if(this.current == $('.slide').length){
            return false;
        }

        this.current = this.current+1;
        $('.slide').removeClass('show').addClass('hide');
        $('.slide'+this.current).removeClass('hide').addClass('show');
        $('.current').text(this.current);
        $('.next').removeClass('disabled');
        $('.prev').removeClass('disabled');
        if(this.current == $('.slide').length){
            $('.next').addClass('disabled');
        }
    },
    prev:function(){
        if(this.current == 1){
            return false;
        }
        this.current = this.current-1;
        $('.prev').removeClass('disabled');
        $('.slide').removeClass('show').addClass('hide');

        $('.slide'+this.current).removeClass('hide').addClass('show');
        $('.current').text(this.current);
        $('.next').removeClass('disabled');
        $('.prev').removeClass('disabled');
        if(this.current == 1){
            $('.prev').addClass('disabled');
            return false;
        }

    }
}
var directionSubscribe = {

    delete: function(btn)
    {
        $(btn).addClass('disabled');

        $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        ).done(function(data){
            if (data.success)
            {
                $(btn).closest('.file-item').hide();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    },

    toggle: function (btn)
    {
        $(btn).addClass('disabled');

        var action = $(btn).hasClass('active') ? 'delete' : 'add';

        var jqxhr = $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        )
        .done(function(data){
            if (data.success)
            {
                $(btn).toggleClass('active');
                $(btn).blur();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    }

};

var testBookmark = {

    delete: function(btn)
    {
        $(btn).addClass('disabled');

        $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        ).done(function(data){
            if (data.success)
            {
                $(btn).closest('.file-item').hide();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    },

    toggle: function (btn)
    {
        $(btn).addClass('disabled');

        var action = $(btn).hasClass('active') ? 'delete' : 'add';

        var jqxhr = $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        )
        .done(function(data){
            if (data.success)
            {
                $(btn).toggleClass('active');
                $(btn).blur();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    }

};


var blogBookmark = {

    delete: function(btn)
    {
        $(btn).addClass('disabled');

        $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        ).done(function(data){
            if (data.success)
            {
                $(btn).closest('.file-item').hide();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    },

    toggle: function (btn)
    {
        $(btn).addClass('disabled');

        var action = $(btn).hasClass('active') ? 'delete' : 'add';

        var jqxhr = $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        )
        .done(function(data){
            if (data.success)
            {
                $(btn).toggleClass('active');
                $(btn).find('span').html((action == 'add' ? 'Додано' : 'Додати до збережених'));
                $(btn).blur();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    }
};

var projectBookmark = {

    delete: function(btn)
    {
        $(btn).addClass('disabled');

        $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        ).done(function(data){
            if (data.success)
            {
                $(btn).closest('.project-bookmark-item').hide();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    },

    toggle: function (btn)
    {
        $(btn).addClass('disabled');

        var action = $(btn).hasClass('active') ? 'delete' : 'add';

        var jqxhr = $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        )
        .done(function(data){
            if (data.success)
            {
                $(btn).toggleClass('active');
                $(btn).find('span').html((action == 'add' ? 'Додано' : 'Додати до збережених'));
                $(btn).blur();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    }
};

var webinarBookmark = {

    delete: function(btn)
    {
        $(btn).addClass('disabled');

        $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        ).done(function(data){
            if (data.success)
            {
                $(btn).closest('.bookmark-item').hide();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    },

    toggle: function (btn)
    {
        $(btn).addClass('disabled');

        var action = $(btn).hasClass('active') ? 'delete' : 'add';

        var jqxhr = $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        )
        .done(function(data){
            if (data.success)
            {
                $(btn).toggleClass('active');
                $(btn).find('span').html((action == 'add' ? 'Додано' : 'Додати до збережених'));
                $(btn).blur();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    }
};

var conferenceBookmark = {

    delete: function(btn)
    {
        $(btn).addClass('disabled');

        $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        ).done(function(data){
            if (data.success)
            {
                $(btn).closest('.bookmark-item').hide();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    },

    toggle: function (btn)
    {
        $(btn).addClass('disabled');

        var action = $(btn).hasClass('active') ? 'delete' : 'add';

        var jqxhr = $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        )
        .done(function(data){
            if (data.success)
            {
                $(btn).toggleClass('active');
                $(btn).find('span').html((action == 'add' ? 'Додано' : 'Додати до збережених'));
                $(btn).blur();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    }
};

var teacherCourseBookmark = {

    delete: function(btn)
    {
        $(btn).addClass('disabled');

        $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        ).done(function(data){
            if (data.success)
            {
                $(btn).closest('.bookmark-item').hide();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    },

    toggle: function (btn)
    {
        $(btn).addClass('disabled');

        var action = $(btn).hasClass('active') ? 'delete' : 'add';

        var jqxhr = $.post(
            btn.href,
            { _csrf: document.head.querySelector("[name=csrf-token]").content }
        )
        .done(function(data){
            if (data.success)
            {
                $(btn).toggleClass('active');
                $(btn).find('span').html((action == 'add' ? 'Додано' : 'Додати до збережених'));
                $(btn).blur();
            }
        })
        .fail(function(){
            console.log('Щось пiшло не так. Сталася помилка Ajax-запиту');
        })
        .always(function(){
            $(btn).removeClass('disabled');
        });
    }
};


var libsBookmark = {
    save:function(document_id, clearItem = false){
         $.ajax({
              type: "POST",
              url: '/api/libs-bookmarks/save/'+document_id,
              data: { _csrf: document.head.querySelector("[name=csrf-token]").content },
              success:function(result){
                  if(result === true){
                     if(clearItem == true){
                        $('.item'+document_id).remove();
                    }else{
                        $('.bookmark-file a').removeClass('active').find('span').text('Зберегти на потім');
                    }

                  }else{
                       $('.bookmark-file a').addClass('active').find('span').text('Збережено');
                  }
              },
              error:function(result){}
         });
    },
    create:function(document_id){
         $.ajax({
              type: "POST",
              url: '/api/libs-bookmarks',
              data: { document_id: document_id, _csrf: document.head.querySelector("[name=csrf-token]").content },
              success:function(result){},
              error:function(result){}
         });
    },
    delete:function(bookmark_id){
         $.ajax({
              type: "DELETE",
              url: '/api/libs-bookmarks/'+bookmark_id,
              data: { _csrf: document.head.querySelector("[name=csrf-token]").content },
              success:function(result){

              },
              error:function(result){}
         });
    },
};

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

if ($('#spreadsheet').length) {
    $('#spreadsheet').popover({
            selector: '.ssppq',
            container: '#spreadsheet',
            trigger: 'hover',
            placement: 'bottom',
            html: true,
            title: function(){
                var q = jQuery(this).attr('data-title');
                var dif = jQuery(this).attr('data-difficulty');
                var difstr = '';
                /*
                for (var i = 0; i < 5; i++ ) {
                    difstr += difstr > i
                        ? '<i class="fa fa-star filled" aria-hidden="true"></i>'
                        : '<i class="fa fa-star" aria-hidden="true"></i>';
                } */
                return q;
            },
            content: function() {
                var c = jQuery(this).find('.item-content').html();
                //var c = $scope.curAnswers()[qid].question.content;
                var m = c.match(/\\\(.*?\\\)/g);
                if ( m !== null ) {
                    for (var i = 0; i < m.length; i++) {
                        c = c.replace(m[i], katex.renderToString(m[i].substr(2, m[i].length - 4)));
                    }
                }
                return c;
            },
    });
}

function get_browser_info(){
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE ',version:(tem[1]||'')};
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }
$(function(){

    var browser=get_browser_info();
        var browsers = {
            'Chrome':{'min':41},
            'Firefox':{'min':45},
            'Opera':{'min':45},
            'Android Webview':{'min':45},
            'YaBrowser':{'min':15},
            'Safari':{'min':9}
        };
        console.log(browser.version);
    if(browsers.hasOwnProperty(browser.name)){

        if(browser.version >= browsers[browser.name].min){
            $('.start-link').show();
            $('.browsers-list').hide();
        }else{

        }
    }
    //$(".store-payblock").pin({activeClass:'store-pinned'});
    //$(".webinar-embed").pin({activeClass:'webinar-pinned'});
    //$(".conference-menu").pin();




});

function scrollToDiv(to){
    //$(click).click(function() {
        $('html, body').animate({
            scrollTop: $(to).offset().top
        }, 800);
    //});
}

/*
$(document).ready(function () {

    //var start = $('.clockdiv').attr('data-start');
    var remaining = $('#clockdiv').attr('data-remaining');
    var endtime = (new Date(new Date().getTime() + parseInt(remaining))).getTime();
//    console.log(end);
    initializeClock('clockdiv', endtime, remaining);
}); */


function getTimeRemaining(endtime, remaining) {
  var t =  endtime - new Date().getTime();
  //console.log('time '+t);
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}
/*
function initializeClock(id, endtime, remaining) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime, remaining);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
} */



$(function(){
    $('.modelButton').click(function(){
        var modelId = $(this).attr('data-model-id');
        $('#'+modelId).modal('show')
            .find('#modelContent')
            .html('<div class="loader text-center  animated infinite pulse" style="color:#f48617"><i class="fa fa-spinner fa-spin fa-3x fa-fw" style="font-size:90px;"></i></div>')
            .load($(this).attr('value'));
    });
});



function scrollToDiv(to){
    //$(click).click(function() {
        $('html, body').animate({
            scrollTop: $(to).offset().top-60
        }, 800);
    //});
}

$(function(){
    $(window).resize(function () {
        // $('.pub-teachers-slider').not('.slick-initialized').slick('resize');
         $('.pub-facts-slider').not('.slick-initialized').slick('resize');
    });

    $(window).on('orientationchange', function () {
        // $('.pub-teachers-slider').not('.slick-initialized').slick('resize');
         $('.pub-facts-slider').not('.slick-initialized').slick('resize');
    });

    if ($('.pub-cert-slider').length > 0)
    {
        $('.pub-cert-slider').slick({
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: false,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: false,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: false,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }
          ]
        });
    }

    if ($('.pub-reviews-slider').length > 0)
    {
        $('.pub-reviews-slider').slick({
          infinite: false,
          slidesToShow: 2,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: false,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: false,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: false,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }
          ]
        });
    }

    if ($('.direction-lector-slider').length > 0)
    {
        $('.direction-lector-slider').slick({
          infinite: true,
          slidesToShow: 6,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: true,
                  slidesToShow: 6,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: true,
                  slidesToShow: 4,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: true,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            }
          ]
        });

    }

    if ($('.pub-facts-slider').length > 0)
    {
        $('.pub-facts-slider').slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: true,
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: true,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }
          ]
        });
    }

    if ($('.pub-teachers-slider').length > 0)
    {
        $('.pub-teachers-slider').slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: true,
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: true,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }
          ]
        });
    }

    if ($('.upgrade-reviews-block').length > 0)
    {
        $('.upgrade-reviews-block').slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: true,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }
          ]
        });
    }

    if ($('.pub-teachers-slider').length > 0)
    {
        $('.pub-teachers-slider').slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: true,
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: true,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }
          ]
        });
    }


    if ($('.pub-teachers-slider').length > 0)
    {
        $('.pub-teachers-slider').slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1300,
              settings: {
                  infinite: true,
                  slidesToShow: 3,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 992,
              settings: {
                  infinite: true,
                  slidesToShow: 2,
                  slidesToScroll: 1
              }
            },
            {
              breakpoint: 660,
              settings: {
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1
              }
            }
          ]
        });
    }


    if ($('.masonry-grid').length > 0)
    {
        $('.masonry-grid').masonry({
          // options
          itemSelector: '.masonry-grid-item',
        });
    }


    // Set the date we're counting down to"Jan 5, 2021 15:37:25"
    var countDownDate = new Date($('.timer').attr('data-timer-end')).getTime();

    // Update the count down every 1 second
    var x = setInterval(function() {

      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      $('.timer-day').text((days.toString().length == 1 ? '0'+days : days));
      $('.timer-hours').text((hours.toString().length == 1 ? '0'+hours : hours));
      $('.timer-minutes').text((minutes.toString().length == 1 ? '0'+minutes : minutes));
      $('.timer-seconds').text((seconds.toString().length == 1 ? '0'+seconds : seconds));

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
         $('.timer').html('');
      }
    }, 1000);
    });

// jQuery plugin to prevent double submission of forms
jQuery.fn.preventDoubleSubmission = function() {
  $(this).on('submit',function(e){
    var $form = $(this);

    if ($form.data('submitted') === true) {
      // Previously submitted - don't submit again
      e.preventDefault();
    } else {
      // Mark it so that the next submit can be ignored
      $form.data('submitted', true);
    }
  });

  // Keep chainability
  return this;
};

function previewVideo(video_id,element_id){
    $('.el-'+element_id).html('<div class="embed-responsive embed-responsive-16by9"><iframe  src="https://www.youtube.com/embed/'+video_id+'?showinfo=0&rel=0&modestbranding=1&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
}
function loadCourse(grade){
//    var page = $('.load-more').attr('data-page');
//    $('.load-more-block').remove();

    $('.pub-course-picker a').removeClass('active');
    $('.pub-course-picker .grade'+grade).addClass('active');
    var url = '/courses?grade='+grade
    requestCourse(url);
}
function requestCourse(url){
    //$( ".load-more-block"+page+" .text-center" ).html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');
     $( ".courses-ajax").removeClass('hide').html('<div class="course-items"><div class="row"><div class="col-md-6"><div class="shad-block course-item"><div class="row"><div class="col-md-12"><div class="course-info-block"><div class="row"><div class="col-md-8 col-sm-7 col-xs-6"><div class="item-start"><span class="item-start-info" style="background:#f1f1f1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div></div><div class="col-md-4 col-sm-5 col-xs-6"><div class="text-right pub-course-price" style="background:#f1f1f1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div></div><div class="item-name" style="background:#f1f1f1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div></div></div><div class="course-author-block"><div class="course-author-name" style="background:#f1f1f1;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div></div></div></div></div>');
    $.get( url, function( data ) {
    //    $( ".load-more-block"+page).remove();
    //console.log(data);
      $( ".courses-ajax").removeClass('hide').html( data );
    });
}


$("input.block-shown").each(function(){
    $(this).on('change', function(e){
        var checkboxEl = this;
        $(checkboxEl).attr("disabled", true);

        $.ajax({
            url: '/teacher-course/block-status-toggle',
            method: "POST",
            dataType : 'json',
            data : {
                'id' : $(checkboxEl).data('id')
            }
        })
        .done(function(result) {
            if (result.success != true)
            {
                checkboxEl.checked = !checkboxEl.checked;
                console.log('Something wrong');
            }
        })
        .fail(function(xhr, resp, text) {
            checkboxEl.checked = !checkboxEl.checked;
            console.log('AJAX Error:', xhr, resp, text);
        })
        .always(function(){
            $(checkboxEl).removeAttr("disabled");
        })
        ;
    });
});

/**
* Push Google Tag Manager event
**/
function pushGtmEvent(event)
{
    if (typeof(event) == 'string') {
        dataLayer.push({
            'event' : event
        });
    }
}

/*!
 * Lightbox v2.10.0
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright 2007, 2018 Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 *
 * @preserve
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.lightbox = factory(root.jQuery);
    }
}(this, function ($) {

  function Lightbox(options) {
    this.album = [];
    this.currentImageIndex = void 0;
    this.init();

    // options
    this.options = $.extend({}, this.constructor.defaults);
    this.option(options);
  }

  // Descriptions of all options available on the demo site:
  // http://lokeshdhakar.com/projects/lightbox2/index.html#options
  Lightbox.defaults = {
    albumLabel: 'Image %1 of %2',
    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 600,
    fitImagesInViewport: true,
    imageFadeDuration: 600,
    // maxWidth: 800,
    // maxHeight: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    disableScrolling: false,
    /*
    Sanitize Title
    If the caption data is trusted, for example you are hardcoding it in, then leave this to false.
    This will free you to add html tags, such as links, in the caption.

    If the caption data is user submitted or from some other untrusted source, then set this to true
    to prevent xss and other injection attacks.
     */
    sanitizeTitle: false
  };

  Lightbox.prototype.option = function(options) {
    $.extend(this.options, options);
  };

  Lightbox.prototype.imageCountLabel = function(currentImageNum, totalImages) {
    return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
  };

  Lightbox.prototype.init = function() {
    var self = this;
    // Both enable and build methods require the body tag to be in the DOM.
    $(document).ready(function() {
      self.enable();
      self.build();
    });
  };

  // Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
  // that contain 'lightbox'. When these are clicked, start lightbox.
  Lightbox.prototype.enable = function() {
    var self = this;
    $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function(event) {
      self.start($(event.currentTarget));
      return false;
    });
  };

  // Build html for the lightbox and the overlay.
  // Attach event handlers to the new DOM elements. click click click
  Lightbox.prototype.build = function() {
    if ($('#lightbox').length > 0) {
        return;
    }

    var self = this;
    $('<div id="lightboxOverlay" class="lightboxOverlay"></div><div id="lightbox" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /><div class="lb-nav"><a class="lb-prev" href="" ></a><a class="lb-next" href="" ></a></div><div class="lb-loader"><a class="lb-cancel"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close"></a></div></div></div></div>').appendTo($('body'));

    // Cache jQuery objects
    this.$lightbox       = $('#lightbox');
    this.$overlay        = $('#lightboxOverlay');
    this.$outerContainer = this.$lightbox.find('.lb-outerContainer');
    this.$container      = this.$lightbox.find('.lb-container');
    this.$image          = this.$lightbox.find('.lb-image');
    this.$nav            = this.$lightbox.find('.lb-nav');

    // Store css values for future lookup
    this.containerPadding = {
      top: parseInt(this.$container.css('padding-top'), 10),
      right: parseInt(this.$container.css('padding-right'), 10),
      bottom: parseInt(this.$container.css('padding-bottom'), 10),
      left: parseInt(this.$container.css('padding-left'), 10)
    };

    this.imageBorderWidth = {
      top: parseInt(this.$image.css('border-top-width'), 10),
      right: parseInt(this.$image.css('border-right-width'), 10),
      bottom: parseInt(this.$image.css('border-bottom-width'), 10),
      left: parseInt(this.$image.css('border-left-width'), 10)
    };

    // Attach event handlers to the newly minted DOM elements
    this.$overlay.hide().on('click', function() {
      self.end();
      return false;
    });

    this.$lightbox.hide().on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox') {
        self.end();
      }
      return false;
    });

    this.$outerContainer.on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox') {
        self.end();
      }
      return false;
    });

    this.$lightbox.find('.lb-prev').on('click', function() {
      if (self.currentImageIndex === 0) {
        self.changeImage(self.album.length - 1);
      } else {
        self.changeImage(self.currentImageIndex - 1);
      }
      return false;
    });

    this.$lightbox.find('.lb-next').on('click', function() {
      if (self.currentImageIndex === self.album.length - 1) {
        self.changeImage(0);
      } else {
        self.changeImage(self.currentImageIndex + 1);
      }
      return false;
    });

    /*
      Show context menu for image on right-click

      There is a div containing the navigation that spans the entire image and lives above of it. If
      you right-click, you are right clicking this div and not the image. This prevents users from
      saving the image or using other context menu actions with the image.

      To fix this, when we detect the right mouse button is pressed down, but not yet clicked, we
      set pointer-events to none on the nav div. This is so that the upcoming right-click event on
      the next mouseup will bubble down to the image. Once the right-click/contextmenu event occurs
      we set the pointer events back to auto for the nav div so it can capture hover and left-click
      events as usual.
     */
    this.$nav.on('mousedown', function(event) {
      if (event.which === 3) {
        self.$nav.css('pointer-events', 'none');

        self.$lightbox.one('contextmenu', function() {
          setTimeout(function() {
              this.$nav.css('pointer-events', 'auto');
          }.bind(self), 0);
        });
      }
    });


    this.$lightbox.find('.lb-loader, .lb-close').on('click', function() {
      self.end();
      return false;
    });
  };

  // Show overlay and lightbox. If the image is part of a set, add siblings to album array.
  Lightbox.prototype.start = function($link) {
    var self    = this;
    var $window = $(window);

    $window.on('resize', $.proxy(this.sizeOverlay, this));

    $('select, object, embed').css({
      visibility: 'hidden'
    });

    this.sizeOverlay();

    this.album = [];
    var imageNumber = 0;

    function addToAlbum($link) {
      self.album.push({
        alt: $link.attr('data-alt'),
        link: $link.attr('href'),
        title: $link.attr('data-title') || $link.attr('title')
      });
    }

    // Support both data-lightbox attribute and rel attribute implementations
    var dataLightboxValue = $link.attr('data-lightbox');
    var $links;

    if (dataLightboxValue) {
      $links = $($link.prop('tagName') + '[data-lightbox="' + dataLightboxValue + '"]');
      for (var i = 0; i < $links.length; i = ++i) {
        addToAlbum($($links[i]));
        if ($links[i] === $link[0]) {
          imageNumber = i;
        }
      }
    } else {
      if ($link.attr('rel') === 'lightbox') {
        // If image is not part of a set
        addToAlbum($link);
      } else {
        // If image is part of a set
        $links = $($link.prop('tagName') + '[rel="' + $link.attr('rel') + '"]');
        for (var j = 0; j < $links.length; j = ++j) {
          addToAlbum($($links[j]));
          if ($links[j] === $link[0]) {
            imageNumber = j;
          }
        }
      }
    }

    // Position Lightbox
    var top  = $window.scrollTop() + this.options.positionFromTop;
    var left = $window.scrollLeft();
    this.$lightbox.css({
      top: top + 'px',
      left: left + 'px'
    }).fadeIn(this.options.fadeDuration);

    // Disable scrolling of the page while open
    if (this.options.disableScrolling) {
      $('html').addClass('lb-disable-scrolling');
    }

    this.changeImage(imageNumber);
  };

  // Hide most UI elements in preparation for the animated resizing of the lightbox.
  Lightbox.prototype.changeImage = function(imageNumber) {
    var self = this;

    this.disableKeyboardNav();
    var $image = this.$lightbox.find('.lb-image');

    this.$overlay.fadeIn(this.options.fadeDuration);

    $('.lb-loader').fadeIn('slow');
    this.$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();

    this.$outerContainer.addClass('animating');

    // When image to show is preloaded, we send the width and height to sizeContainer()
    var preloader = new Image();
    preloader.onload = function() {
      var $preloader;
      var imageHeight;
      var imageWidth;
      var maxImageHeight;
      var maxImageWidth;
      var windowHeight;
      var windowWidth;

      $image.attr({
        'alt': self.album[imageNumber].alt,
        'src': self.album[imageNumber].link
      });

      $preloader = $(preloader);

      $image.width(preloader.width);
      $image.height(preloader.height);

      if (self.options.fitImagesInViewport) {
        // Fit image inside the viewport.
        // Take into account the border around the image and an additional 10px gutter on each side.

        windowWidth    = $(window).width();
        windowHeight   = $(window).height();
        maxImageWidth  = windowWidth - self.containerPadding.left - self.containerPadding.right - self.imageBorderWidth.left - self.imageBorderWidth.right - 20;
        maxImageHeight = windowHeight - self.containerPadding.top - self.containerPadding.bottom - self.imageBorderWidth.top - self.imageBorderWidth.bottom - 120;

        // Check if image size is larger then maxWidth|maxHeight in settings
        if (self.options.maxWidth && self.options.maxWidth < maxImageWidth) {
          maxImageWidth = self.options.maxWidth;
        }
        if (self.options.maxHeight && self.options.maxHeight < maxImageWidth) {
          maxImageHeight = self.options.maxHeight;
        }

        // Is the current image's width or height is greater than the maxImageWidth or maxImageHeight
        // option than we need to size down while maintaining the aspect ratio.
        if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
          if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
            imageWidth  = maxImageWidth;
            imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          } else {
            imageHeight = maxImageHeight;
            imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          }
        }
      }
      self.sizeContainer($image.width(), $image.height());
    };

    preloader.src          = this.album[imageNumber].link;
    this.currentImageIndex = imageNumber;
  };

  // Stretch overlay to fit the viewport
  Lightbox.prototype.sizeOverlay = function() {
    this.$overlay
      .width($(document).width())
      .height($(document).height());
  };

  // Animate the size of the lightbox to fit the image we are showing
  Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
    var self = this;

    var oldWidth  = this.$outerContainer.outerWidth();
    var oldHeight = this.$outerContainer.outerHeight();
    var newWidth  = imageWidth + this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
    var newHeight = imageHeight + this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;

    function postResize() {
      self.$lightbox.find('.lb-dataContainer').width(newWidth);
      self.$lightbox.find('.lb-prevLink').height(newHeight);
      self.$lightbox.find('.lb-nextLink').height(newHeight);
      self.showImage();
    }

    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.$outerContainer.animate({
        width: newWidth,
        height: newHeight
      }, this.options.resizeDuration, 'swing', function() {
        postResize();
      });
    } else {
      postResize();
    }
  };

  // Display the image and its details and begin preload neighboring images.
  Lightbox.prototype.showImage = function() {
    this.$lightbox.find('.lb-loader').stop(true).hide();
    this.$lightbox.find('.lb-image').fadeIn(this.options.imageFadeDuration);

    this.updateNav();
    this.updateDetails();
    this.preloadNeighboringImages();
    this.enableKeyboardNav();
  };

  // Display previous and next navigation if appropriate.
  Lightbox.prototype.updateNav = function() {
    // Check to see if the browser supports touch events. If so, we take the conservative approach
    // and assume that mouse hover events are not supported and always show prev/next navigation
    // arrows in image sets.
    var alwaysShowNav = false;
    try {
      document.createEvent('TouchEvent');
      alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
    } catch (e) {}

    this.$lightbox.find('.lb-nav').show();

    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        if (alwaysShowNav) {
          this.$lightbox.find('.lb-prev, .lb-next').css('opacity', '1');
        }
        this.$lightbox.find('.lb-prev, .lb-next').show();
      } else {
        if (this.currentImageIndex > 0) {
          this.$lightbox.find('.lb-prev').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-prev').css('opacity', '1');
          }
        }
        if (this.currentImageIndex < this.album.length - 1) {
          this.$lightbox.find('.lb-next').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-next').css('opacity', '1');
          }
        }
      }
    }
  };

  // Display caption, image number, and closing button.
  Lightbox.prototype.updateDetails = function() {
    var self = this;

    // Enable anchor clicks in the injected caption html.
    // Thanks Nate Wright for the fix. @https://github.com/NateWr
    if (typeof this.album[this.currentImageIndex].title !== 'undefined' &&
      this.album[this.currentImageIndex].title !== '') {
      var $caption = this.$lightbox.find('.lb-caption');
      if (this.options.sanitizeTitle) {
        $caption.text(this.album[this.currentImageIndex].title);
      } else {
        $caption.html(this.album[this.currentImageIndex].title);
      }
      $caption.fadeIn('fast')
        .find('a').on('click', function(event) {
          if ($(this).attr('target') !== undefined) {
            window.open($(this).attr('href'), $(this).attr('target'));
          } else {
            location.href = $(this).attr('href');
          }
        });
    }

    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
      this.$lightbox.find('.lb-number').text(labelText).fadeIn('fast');
    } else {
      this.$lightbox.find('.lb-number').hide();
    }

    this.$outerContainer.removeClass('animating');

    this.$lightbox.find('.lb-dataContainer').fadeIn(this.options.resizeDuration, function() {
      return self.sizeOverlay();
    });
  };

  // Preload previous and next images in set.
  Lightbox.prototype.preloadNeighboringImages = function() {
    if (this.album.length > this.currentImageIndex + 1) {
      var preloadNext = new Image();
      preloadNext.src = this.album[this.currentImageIndex + 1].link;
    }
    if (this.currentImageIndex > 0) {
      var preloadPrev = new Image();
      preloadPrev.src = this.album[this.currentImageIndex - 1].link;
    }
  };

  Lightbox.prototype.enableKeyboardNav = function() {
    $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
  };

  Lightbox.prototype.disableKeyboardNav = function() {
    $(document).off('.keyboard');
  };

  Lightbox.prototype.keyboardAction = function(event) {
    var KEYCODE_ESC        = 27;
    var KEYCODE_LEFTARROW  = 37;
    var KEYCODE_RIGHTARROW = 39;

    var keycode = event.keyCode;
    var key     = String.fromCharCode(keycode).toLowerCase();
    if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
      this.end();
    } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
      if (this.currentImageIndex !== 0) {
        this.changeImage(this.currentImageIndex - 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(this.album.length - 1);
      }
    } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
      if (this.currentImageIndex !== this.album.length - 1) {
        this.changeImage(this.currentImageIndex + 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(0);
      }
    }
  };

  // Closing time. :-(
  Lightbox.prototype.end = function() {
    this.disableKeyboardNav();
    $(window).off('resize', this.sizeOverlay);
    this.$lightbox.fadeOut(this.options.fadeDuration);
    this.$overlay.fadeOut(this.options.fadeDuration);
    $('select, object, embed').css({
      visibility: 'visible'
    });
    if (this.options.disableScrolling) {
      $('html').removeClass('lb-disable-scrolling');
    }
  };

  return new Lightbox();
}));

(function(e,t){"use strict";var n=e.History=e.History||{},r=e.jQuery;if(typeof n.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");n.Adapter={bind:function(e,t,n){r(e).bind(t,n)},trigger:function(e,t,n){r(e).trigger(t,n)},extractEventData:function(e,n,r){var i=n&&n.originalEvent&&n.originalEvent[e]||r&&r[e]||t;return i},onDomLoad:function(e){r(e)}},typeof n.init!="undefined"&&n.init()})(window),function(e,t){"use strict";var n=e.console||t,r=e.document,i=e.navigator,s=!1,o=e.setTimeout,u=e.clearTimeout,a=e.setInterval,f=e.clearInterval,l=e.JSON,c=e.alert,h=e.History=e.History||{},p=e.history;try{s=e.sessionStorage,s.setItem("TEST","1"),s.removeItem("TEST")}catch(d){s=!1}l.stringify=l.stringify||l.encode,l.parse=l.parse||l.decode;if(typeof h.init!="undefined")throw new Error("History.js Core has already been loaded...");h.init=function(e){return typeof h.Adapter=="undefined"?!1:(typeof h.initCore!="undefined"&&h.initCore(),typeof h.initHtml4!="undefined"&&h.initHtml4(),!0)},h.initCore=function(d){if(typeof h.initCore.initialized!="undefined")return!1;h.initCore.initialized=!0,h.options=h.options||{},h.options.hashChangeInterval=h.options.hashChangeInterval||100,h.options.safariPollInterval=h.options.safariPollInterval||500,h.options.doubleCheckInterval=h.options.doubleCheckInterval||500,h.options.disableSuid=h.options.disableSuid||!1,h.options.storeInterval=h.options.storeInterval||1e3,h.options.busyDelay=h.options.busyDelay||250,h.options.debug=h.options.debug||!1,h.options.initialTitle=h.options.initialTitle||r.title,h.options.html4Mode=h.options.html4Mode||!1,h.options.delayInit=h.options.delayInit||!1,h.intervalList=[],h.clearAllIntervals=function(){var e,t=h.intervalList;if(typeof t!="undefined"&&t!==null){for(e=0;e<t.length;e++)f(t[e]);h.intervalList=null}},h.debug=function(){(h.options.debug||!1)&&h.log.apply(h,arguments)},h.log=function(){var e=typeof n!="undefined"&&typeof n.log!="undefined"&&typeof n.log.apply!="undefined",t=r.getElementById("log"),i,s,o,u,a;e?(u=Array.prototype.slice.call(arguments),i=u.shift(),typeof n.debug!="undefined"?n.debug.apply(n,[i,u]):n.log.apply(n,[i,u])):i="\n"+arguments[0]+"\n";for(s=1,o=arguments.length;s<o;++s){a=arguments[s];if(typeof a=="object"&&typeof l!="undefined")try{a=l.stringify(a)}catch(f){}i+="\n"+a+"\n"}return t?(t.value+=i+"\n-----\n",t.scrollTop=t.scrollHeight-t.clientHeight):e||c(i),!0},h.getInternetExplorerMajorVersion=function(){var e=h.getInternetExplorerMajorVersion.cached=typeof h.getInternetExplorerMajorVersion.cached!="undefined"?h.getInternetExplorerMajorVersion.cached:function(){var e=3,t=r.createElement("div"),n=t.getElementsByTagName("i");while((t.innerHTML="<!--[if gt IE "+ ++e+"]><i></i><![endif]-->")&&n[0]);return e>4?e:!1}();return e},h.isInternetExplorer=function(){var e=h.isInternetExplorer.cached=typeof h.isInternetExplorer.cached!="undefined"?h.isInternetExplorer.cached:Boolean(h.getInternetExplorerMajorVersion());return e},h.options.html4Mode?h.emulated={pushState:!0,hashChange:!0}:h.emulated={pushState:!Boolean(e.history&&e.history.pushState&&e.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(i.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(i.userAgent)),hashChange:Boolean(!("onhashchange"in e||"onhashchange"in r)||h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8)},h.enabled=!h.emulated.pushState,h.bugs={setHash:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),safariPoll:Boolean(!h.emulated.pushState&&i.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(i.userAgent)),ieDoubleCheck:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(h.isInternetExplorer()&&h.getInternetExplorerMajorVersion()<7)},h.isEmptyObject=function(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0},h.cloneObject=function(e){var t,n;return e?(t=l.stringify(e),n=l.parse(t)):n={},n},h.getRootUrl=function(){var e=r.location.protocol+"//"+(r.location.hostname||r.location.host);if(r.location.port||!1)e+=":"+r.location.port;return e+="/",e},h.getBaseHref=function(){var e=r.getElementsByTagName("base"),t=null,n="";return e.length===1&&(t=e[0],n=t.href.replace(/[^\/]+$/,"")),n=n.replace(/\/+$/,""),n&&(n+="/"),n},h.getBaseUrl=function(){var e=h.getBaseHref()||h.getBasePageUrl()||h.getRootUrl();return e},h.getPageUrl=function(){var e=h.getState(!1,!1),t=(e||{}).url||h.getLocationHref(),n;return n=t.replace(/\/+$/,"").replace(/[^\/]+$/,function(e,t,n){return/\./.test(e)?e:e+"/"}),n},h.getBasePageUrl=function(){var e=h.getLocationHref().replace(/[#\?].*/,"").replace(/[^\/]+$/,function(e,t,n){return/[^\/]$/.test(e)?"":e}).replace(/\/+$/,"")+"/";return e},h.getFullUrl=function(e,t){var n=e,r=e.substring(0,1);return t=typeof t=="undefined"?!0:t,/[a-z]+\:\/\//.test(e)||(r==="/"?n=h.getRootUrl()+e.replace(/^\/+/,""):r==="#"?n=h.getPageUrl().replace(/#.*/,"")+e:r==="?"?n=h.getPageUrl().replace(/[\?#].*/,"")+e:t?n=h.getBaseUrl()+e.replace(/^(\.\/)+/,""):n=h.getBasePageUrl()+e.replace(/^(\.\/)+/,"")),n.replace(/\#$/,"")},h.getShortUrl=function(e){var t=e,n=h.getBaseUrl(),r=h.getRootUrl();return h.emulated.pushState&&(t=t.replace(n,"")),t=t.replace(r,"/"),h.isTraditionalAnchor(t)&&(t="./"+t),t=t.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),t},h.getLocationHref=function(e){return e=e||r,e.URL===e.location.href?e.location.href:e.location.href===decodeURIComponent(e.URL)?e.URL:e.location.hash&&decodeURIComponent(e.location.href.replace(/^[^#]+/,""))===e.location.hash?e.location.href:e.URL.indexOf("#")==-1&&e.location.href.indexOf("#")!=-1?e.location.href:e.URL||e.location.href},h.store={},h.idToState=h.idToState||{},h.stateToId=h.stateToId||{},h.urlToId=h.urlToId||{},h.storedStates=h.storedStates||[],h.savedStates=h.savedStates||[],h.normalizeStore=function(){h.store.idToState=h.store.idToState||{},h.store.urlToId=h.store.urlToId||{},h.store.stateToId=h.store.stateToId||{}},h.getState=function(e,t){typeof e=="undefined"&&(e=!0),typeof t=="undefined"&&(t=!0);var n=h.getLastSavedState();return!n&&t&&(n=h.createStateObject()),e&&(n=h.cloneObject(n),n.url=n.cleanUrl||n.url),n},h.getIdByState=function(e){var t=h.extractId(e.url),n;if(!t){n=h.getStateString(e);if(typeof h.stateToId[n]!="undefined")t=h.stateToId[n];else if(typeof h.store.stateToId[n]!="undefined")t=h.store.stateToId[n];else{for(;;){t=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof h.idToState[t]=="undefined"&&typeof h.store.idToState[t]=="undefined")break}h.stateToId[n]=t,h.idToState[t]=e}}return t},h.normalizeState=function(e){var t,n;if(!e||typeof e!="object")e={};if(typeof e.normalized!="undefined")return e;if(!e.data||typeof e.data!="object")e.data={};return t={},t.normalized=!0,t.title=e.title||"",t.url=h.getFullUrl(e.url?e.url:h.getLocationHref()),t.hash=h.getShortUrl(t.url),t.data=h.cloneObject(e.data),t.id=h.getIdByState(t),t.cleanUrl=t.url.replace(/\??\&_suid.*/,""),t.url=t.cleanUrl,n=!h.isEmptyObject(t.data),(t.title||n)&&h.options.disableSuid!==!0&&(t.hash=h.getShortUrl(t.url).replace(/\??\&_suid.*/,""),/\?/.test(t.hash)||(t.hash+="?"),t.hash+="&_suid="+t.id),t.hashedUrl=h.getFullUrl(t.hash),(h.emulated.pushState||h.bugs.safariPoll)&&h.hasUrlDuplicate(t)&&(t.url=t.hashedUrl),t},h.createStateObject=function(e,t,n){var r={data:e,title:t,url:n};return r=h.normalizeState(r),r},h.getStateById=function(e){e=String(e);var n=h.idToState[e]||h.store.idToState[e]||t;return n},h.getStateString=function(e){var t,n,r;return t=h.normalizeState(e),n={data:t.data,title:e.title,url:e.url},r=l.stringify(n),r},h.getStateId=function(e){var t,n;return t=h.normalizeState(e),n=t.id,n},h.getHashByState=function(e){var t,n;return t=h.normalizeState(e),n=t.hash,n},h.extractId=function(e){var t,n,r,i;return e.indexOf("#")!=-1?i=e.split("#")[0]:i=e,n=/(.*)\&_suid=([0-9]+)$/.exec(i),r=n?n[1]||e:e,t=n?String(n[2]||""):"",t||!1},h.isTraditionalAnchor=function(e){var t=!/[\/\?\.]/.test(e);return t},h.extractState=function(e,t){var n=null,r,i;return t=t||!1,r=h.extractId(e),r&&(n=h.getStateById(r)),n||(i=h.getFullUrl(e),r=h.getIdByUrl(i)||!1,r&&(n=h.getStateById(r)),!n&&t&&!h.isTraditionalAnchor(e)&&(n=h.createStateObject(null,null,i))),n},h.getIdByUrl=function(e){var n=h.urlToId[e]||h.store.urlToId[e]||t;return n},h.getLastSavedState=function(){return h.savedStates[h.savedStates.length-1]||t},h.getLastStoredState=function(){return h.storedStates[h.storedStates.length-1]||t},h.hasUrlDuplicate=function(e){var t=!1,n;return n=h.extractState(e.url),t=n&&n.id!==e.id,t},h.storeState=function(e){return h.urlToId[e.url]=e.id,h.storedStates.push(h.cloneObject(e)),e},h.isLastSavedState=function(e){var t=!1,n,r,i;return h.savedStates.length&&(n=e.id,r=h.getLastSavedState(),i=r.id,t=n===i),t},h.saveState=function(e){return h.isLastSavedState(e)?!1:(h.savedStates.push(h.cloneObject(e)),!0)},h.getStateByIndex=function(e){var t=null;return typeof e=="undefined"?t=h.savedStates[h.savedStates.length-1]:e<0?t=h.savedStates[h.savedStates.length+e]:t=h.savedStates[e],t},h.getCurrentIndex=function(){var e=null;return h.savedStates.length<1?e=0:e=h.savedStates.length-1,e},h.getHash=function(e){var t=h.getLocationHref(e),n;return n=h.getHashByUrl(t),n},h.unescapeHash=function(e){var t=h.normalizeHash(e);return t=decodeURIComponent(t),t},h.normalizeHash=function(e){var t=e.replace(/[^#]*#/,"").replace(/#.*/,"");return t},h.setHash=function(e,t){var n,i;return t!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.setHash,args:arguments,queue:t}),!1):(h.busy(!0),n=h.extractState(e,!0),n&&!h.emulated.pushState?h.pushState(n.data,n.title,n.url,!1):h.getHash()!==e&&(h.bugs.setHash?(i=h.getPageUrl(),h.pushState(null,null,i+"#"+e,!1)):r.location.hash=e),h)},h.escapeHash=function(t){var n=h.normalizeHash(t);return n=e.encodeURIComponent(n),h.bugs.hashEscape||(n=n.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),n},h.getHashByUrl=function(e){var t=String(e).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return t=h.unescapeHash(t),t},h.setTitle=function(e){var t=e.title,n;t||(n=h.getStateByIndex(0),n&&n.url===e.url&&(t=n.title||h.options.initialTitle));try{r.getElementsByTagName("title")[0].innerHTML=t.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(i){}return r.title=t,h},h.queues=[],h.busy=function(e){typeof e!="undefined"?h.busy.flag=e:typeof h.busy.flag=="undefined"&&(h.busy.flag=!1);if(!h.busy.flag){u(h.busy.timeout);var t=function(){var e,n,r;if(h.busy.flag)return;for(e=h.queues.length-1;e>=0;--e){n=h.queues[e];if(n.length===0)continue;r=n.shift(),h.fireQueueItem(r),h.busy.timeout=o(t,h.options.busyDelay)}};h.busy.timeout=o(t,h.options.busyDelay)}return h.busy.flag},h.busy.flag=!1,h.fireQueueItem=function(e){return e.callback.apply(e.scope||h,e.args||[])},h.pushQueue=function(e){return h.queues[e.queue||0]=h.queues[e.queue||0]||[],h.queues[e.queue||0].push(e),h},h.queue=function(e,t){return typeof e=="function"&&(e={callback:e}),typeof t!="undefined"&&(e.queue=t),h.busy()?h.pushQueue(e):h.fireQueueItem(e),h},h.clearQueue=function(){return h.busy.flag=!1,h.queues=[],h},h.stateChanged=!1,h.doubleChecker=!1,h.doubleCheckComplete=function(){return h.stateChanged=!0,h.doubleCheckClear(),h},h.doubleCheckClear=function(){return h.doubleChecker&&(u(h.doubleChecker),h.doubleChecker=!1),h},h.doubleCheck=function(e){return h.stateChanged=!1,h.doubleCheckClear(),h.bugs.ieDoubleCheck&&(h.doubleChecker=o(function(){return h.doubleCheckClear(),h.stateChanged||e(),!0},h.options.doubleCheckInterval)),h},h.safariStatePoll=function(){var t=h.extractState(h.getLocationHref()),n;if(!h.isLastSavedState(t))return n=t,n||(n=h.createStateObject()),h.Adapter.trigger(e,"popstate"),h;return},h.back=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.back,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.back(!1)}),p.go(-1),!0)},h.forward=function(e){return e!==!1&&h.busy()?(h.pushQueue({scope:h,callback:h.forward,args:arguments,queue:e}),!1):(h.busy(!0),h.doubleCheck(function(){h.forward(!1)}),p.go(1),!0)},h.go=function(e,t){var n;if(e>0)for(n=1;n<=e;++n)h.forward(t);else{if(!(e<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(n=-1;n>=e;--n)h.back(t)}return h};if(h.emulated.pushState){var v=function(){};h.pushState=h.pushState||v,h.replaceState=h.replaceState||v}else h.onPopState=function(t,n){var r=!1,i=!1,s,o;return h.doubleCheckComplete(),s=h.getHash(),s?(o=h.extractState(s||h.getLocationHref(),!0),o?h.replaceState(o.data,o.title,o.url,!1):(h.Adapter.trigger(e,"anchorchange"),h.busy(!1)),h.expectedStateId=!1,!1):(r=h.Adapter.extractEventData("state",t,n)||!1,r?i=h.getStateById(r):h.expectedStateId?i=h.getStateById(h.expectedStateId):i=h.extractState(h.getLocationHref()),i||(i=h.createStateObject(null,null,h.getLocationHref())),h.expectedStateId=!1,h.isLastSavedState(i)?(h.busy(!1),!1):(h.storeState(i),h.saveState(i),h.setTitle(i),h.Adapter.trigger(e,"statechange"),h.busy(!1),!0))},h.Adapter.bind(e,"popstate",h.onPopState),h.pushState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.pushState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.pushState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0},h.replaceState=function(t,n,r,i){if(h.getHashByUrl(r)&&h.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(i!==!1&&h.busy())return h.pushQueue({scope:h,callback:h.replaceState,args:arguments,queue:i}),!1;h.busy(!0);var s=h.createStateObject(t,n,r);return h.isLastSavedState(s)?h.busy(!1):(h.storeState(s),h.expectedStateId=s.id,p.replaceState(s.id,s.title,s.url),h.Adapter.trigger(e,"popstate")),!0};if(s){try{h.store=l.parse(s.getItem("History.store"))||{}}catch(m){h.store={}}h.normalizeStore()}else h.store={},h.normalizeStore();h.Adapter.bind(e,"unload",h.clearAllIntervals),h.saveState(h.storeState(h.extractState(h.getLocationHref(),!0))),s&&(h.onUnload=function(){var e,t,n;try{e=l.parse(s.getItem("History.store"))||{}}catch(r){e={}}e.idToState=e.idToState||{},e.urlToId=e.urlToId||{},e.stateToId=e.stateToId||{};for(t in h.idToState){if(!h.idToState.hasOwnProperty(t))continue;e.idToState[t]=h.idToState[t]}for(t in h.urlToId){if(!h.urlToId.hasOwnProperty(t))continue;e.urlToId[t]=h.urlToId[t]}for(t in h.stateToId){if(!h.stateToId.hasOwnProperty(t))continue;e.stateToId[t]=h.stateToId[t]}h.store=e,h.normalizeStore(),n=l.stringify(e);try{s.setItem("History.store",n)}catch(i){if(i.code!==DOMException.QUOTA_EXCEEDED_ERR)throw i;s.length&&(s.removeItem("History.store"),s.setItem("History.store",n))}},h.intervalList.push(a(h.onUnload,h.options.storeInterval)),h.Adapter.bind(e,"beforeunload",h.onUnload),h.Adapter.bind(e,"unload",h.onUnload));if(!h.emulated.pushState){h.bugs.safariPoll&&h.intervalList.push(a(h.safariStatePoll,h.options.safariPollInterval));if(i.vendor==="Apple Computer, Inc."||(i.appCodeName||"")==="Mozilla")h.Adapter.bind(e,"hashchange",function(){h.Adapter.trigger(e,"popstate")}),h.getHash()&&h.Adapter.onDomLoad(function(){h.Adapter.trigger(e,"hashchange")})}},(!h.options||!h.options.delayInit)&&h.init()}(window)

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.katex=e():t.katex=e()}("undefined"!=typeof self?self:this,function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var a=e[n]={i:n,l:!1,exports:{}};return t[n].call(a.exports,a,a.exports,r),a.l=!0,a.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=3)}([function(t,e,r){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,r){},,function(t,e,r){"use strict";r.r(e);r(1);var n=r(0),a=r.n(n),o=function(){function t(e,r,n){a()(this,t),this.lexer=e,this.start=r,this.end=n}return t.range=function(e,r){return r?e&&e.loc&&r.loc&&e.loc.lexer===r.loc.lexer?new t(e.loc.lexer,e.loc.start,r.loc.end):null:e&&e.loc},t}(),i=function(){function t(e,r){a()(this,t),this.text=e,this.loc=r}return t.prototype.range=function(e,r){return new t(r,o.range(this,e))},t}(),s=function t(e,r){a()(this,t);var n="KaTeX parse error: "+e,o=void 0,i=r&&r.loc;if(i&&i.start<=i.end){var s=i.lexer.input;o=i.start;var h=i.end;o===s.length?n+=" at end of input: ":n+=" at position "+(o+1)+": ";var l=s.slice(o,h).replace(/[^]/g,"$&\u0332");n+=(o>15?"\u2026"+s.slice(o-15,o):s.slice(0,o))+l+(h+15<s.length?s.slice(h,h+15)+"\u2026":s.slice(h))}var m=new Error(n);return m.name="ParseError",m.__proto__=t.prototype,m.position=o,m};s.prototype.__proto__=Error.prototype;var h=s,l=/([A-Z])/g,m={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;"},c=/[&><"']/g;var p=function t(e){return"ordgroup"===e.type?1===e.body.length?t(e.body[0]):e:"color"===e.type?1===e.body.length?t(e.body[0]):e:"font"===e.type?t(e.body):e},u=function(t){if(!t)throw new Error("Expected non-null, but got "+String(t));return t},d={contains:function(t,e){return-1!==t.indexOf(e)},deflt:function(t,e){return void 0===t?e:t},escape:function(t){return String(t).replace(c,function(t){return m[t]})},hyphenate:function(t){return t.replace(l,"-$1").toLowerCase()},getBaseElem:p,isCharacterBox:function(t){var e=p(t);return"mathord"===e.type||"textord"===e.type||"atom"===e.type}},f=function(){function t(e){a()(this,t),e=e||{},this.displayMode=d.deflt(e.displayMode,!1),this.throwOnError=d.deflt(e.throwOnError,!0),this.errorColor=d.deflt(e.errorColor,"#cc0000"),this.macros=e.macros||{},this.colorIsTextColor=d.deflt(e.colorIsTextColor,!1),this.strict=d.deflt(e.strict,"warn"),this.maxSize=Math.max(0,d.deflt(e.maxSize,1/0)),this.maxExpand=Math.max(0,d.deflt(e.maxExpand,1e3)),this.allowedProtocols=d.deflt(e.allowedProtocols,["http","https","mailto","_relative"])}return t.prototype.reportNonstrict=function(t,e,r){var n=this.strict;if("function"==typeof n&&(n=n(t,e,r)),n&&"ignore"!==n){if(!0===n||"error"===n)throw new h("LaTeX-incompatible input and strict mode is set to 'error': "+e+" ["+t+"]",r);"warn"===n?"undefined"!=typeof console&&console.warn("LaTeX-incompatible input and strict mode is set to 'warn': "+e+" ["+t+"]"):"undefined"!=typeof console&&console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '"+n+"': "+e+" ["+t+"]")}},t.prototype.useStrictBehavior=function(t,e,r){var n=this.strict;if("function"==typeof n)try{n=n(t,e,r)}catch(t){n="error"}return!(!n||"ignore"===n)&&(!0===n||"error"===n||("warn"===n?("undefined"!=typeof console&&console.warn("LaTeX-incompatible input and strict mode is set to 'warn': "+e+" ["+t+"]"),!1):("undefined"!=typeof console&&console.warn("LaTeX-incompatible input and strict mode is set to unrecognized '"+n+"': "+e+" ["+t+"]"),!1)))},t}(),g=function(){function t(e,r,n){a()(this,t),this.id=e,this.size=r,this.cramped=n}return t.prototype.sup=function(){return x[v[this.id]]},t.prototype.sub=function(){return x[y[this.id]]},t.prototype.fracNum=function(){return x[b[this.id]]},t.prototype.fracDen=function(){return x[w[this.id]]},t.prototype.cramp=function(){return x[k[this.id]]},t.prototype.text=function(){return x[S[this.id]]},t.prototype.isTight=function(){return this.size>=2},t}(),x=[new g(0,0,!1),new g(1,0,!0),new g(2,1,!1),new g(3,1,!0),new g(4,2,!1),new g(5,2,!0),new g(6,3,!1),new g(7,3,!0)],v=[4,5,4,5,6,7,6,7],y=[5,5,5,5,7,7,7,7],b=[2,3,4,5,6,7,6,7],w=[3,3,5,5,7,7,7,7],k=[1,1,3,3,5,5,7,7],S=[0,1,2,3,2,3,2,3],M={DISPLAY:x[0],TEXT:x[2],SCRIPT:x[4],SCRIPTSCRIPT:x[6]},z=[{name:"latin",blocks:[[256,591],[768,879]]},{name:"cyrillic",blocks:[[1024,1279]]},{name:"brahmic",blocks:[[2304,4255]]},{name:"georgian",blocks:[[4256,4351]]},{name:"cjk",blocks:[[12288,12543],[19968,40879],[65280,65376]]},{name:"hangul",blocks:[[44032,55215]]}];var T=[];function A(t){for(var e=0;e<T.length;e+=2)if(t>=T[e]&&t<=T[e+1])return!0;return!1}z.forEach(function(t){return t.blocks.forEach(function(t){return T.push.apply(T,t)})});var B={path:{sqrtMain:"M95,702c-2.7,0,-7.17,-2.7,-13.5,-8c-5.8,-5.3,-9.5,\n-10,-9.5,-14c0,-2,0.3,-3.3,1,-4c1.3,-2.7,23.83,-20.7,67.5,-54c44.2,-33.3,65.8,\n-50.3,66.5,-51c1.3,-1.3,3,-2,5,-2c4.7,0,8.7,3.3,12,10s173,378,173,378c0.7,0,\n35.3,-71,104,-213c68.7,-142,137.5,-285,206.5,-429c69,-144,104.5,-217.7,106.5,\n-221c5.3,-9.3,12,-14,20,-14H400000v40H845.2724s-225.272,467,-225.272,467\ns-235,486,-235,486c-2.7,4.7,-9,7,-19,7c-6,0,-10,-1,-12,-3s-194,-422,-194,-422\ns-65,47,-65,47z M834 80H400000v40H845z",sqrtSize1:"M263,681c0.7,0,18,39.7,52,119c34,79.3,68.167,\n158.7,102.5,238c34.3,79.3,51.8,119.3,52.5,120c340,-704.7,510.7,-1060.3,512,-1067\nc4.7,-7.3,11,-11,19,-11H40000v40H1012.3s-271.3,567,-271.3,567c-38.7,80.7,-84,\n175,-136,283c-52,108,-89.167,185.3,-111.5,232c-22.3,46.7,-33.8,70.3,-34.5,71\nc-4.7,4.7,-12.3,7,-23,7s-12,-1,-12,-1s-109,-253,-109,-253c-72.7,-168,-109.3,\n-252,-110,-252c-10.7,8,-22,16.7,-34,26c-22,17.3,-33.3,26,-34,26s-26,-26,-26,-26\ns76,-59,76,-59s76,-60,76,-60z M1001 80H40000v40H1012z",sqrtSize2:"M1001,80H400000v40H1013.1s-83.4,268,-264.1,840c-180.7,\n572,-277,876.3,-289,913c-4.7,4.7,-12.7,7,-24,7s-12,0,-12,0c-1.3,-3.3,-3.7,-11.7,\n-7,-25c-35.3,-125.3,-106.7,-373.3,-214,-744c-10,12,-21,25,-33,39s-32,39,-32,39\nc-6,-5.3,-15,-14,-27,-26s25,-30,25,-30c26.7,-32.7,52,-63,76,-91s52,-60,52,-60\ns208,722,208,722c56,-175.3,126.3,-397.3,211,-666c84.7,-268.7,153.8,-488.2,207.5,\n-658.5c53.7,-170.3,84.5,-266.8,92.5,-289.5c4,-6.7,10,-10,18,-10z\nM1001 80H400000v40H1013z",sqrtSize3:"M424,2478c-1.3,-0.7,-38.5,-172,-111.5,-514c-73,\n-342,-109.8,-513.3,-110.5,-514c0,-2,-10.7,14.3,-32,49c-4.7,7.3,-9.8,15.7,-15.5,\n25c-5.7,9.3,-9.8,16,-12.5,20s-5,7,-5,7c-4,-3.3,-8.3,-7.7,-13,-13s-13,-13,-13,\n-13s76,-122,76,-122s77,-121,77,-121s209,968,209,968c0,-2,84.7,-361.7,254,-1079\nc169.3,-717.3,254.7,-1077.7,256,-1081c4,-6.7,10,-10,18,-10H400000v40H1014.6\ns-87.3,378.7,-272.6,1166c-185.3,787.3,-279.3,1182.3,-282,1185c-2,6,-10,9,-24,9\nc-8,0,-12,-0.7,-12,-2z M1001 80H400000v40H1014z",sqrtSize4:"M473,2793c339.3,-1799.3,509.3,-2700,510,-2702\nc3.3,-7.3,9.3,-11,18,-11H400000v40H1017.7s-90.5,478,-276.2,1466c-185.7,988,\n-279.5,1483,-281.5,1485c-2,6,-10,9,-24,9c-8,0,-12,-0.7,-12,-2c0,-1.3,-5.3,-32,\n-16,-92c-50.7,-293.3,-119.7,-693.3,-207,-1200c0,-1.3,-5.3,8.7,-16,30c-10.7,\n21.3,-21.3,42.7,-32,64s-16,33,-16,33s-26,-26,-26,-26s76,-153,76,-153s77,-151,\n77,-151c0.7,0.7,35.7,202,105,604c67.3,400.7,102,602.7,104,606z\nM1001 80H400000v40H1017z",doubleleftarrow:"M262 157\nl10-10c34-36 62.7-77 86-123 3.3-8 5-13.3 5-16 0-5.3-6.7-8-20-8-7.3\n 0-12.2.5-14.5 1.5-2.3 1-4.8 4.5-7.5 10.5-49.3 97.3-121.7 169.3-217 216-28\n 14-57.3 25-88 33-6.7 2-11 3.8-13 5.5-2 1.7-3 4.2-3 7.5s1 5.8 3 7.5\nc2 1.7 6.3 3.5 13 5.5 68 17.3 128.2 47.8 180.5 91.5 52.3 43.7 93.8 96.2 124.5\n 157.5 9.3 8 15.3 12.3 18 13h6c12-.7 18-4 18-10 0-2-1.7-7-5-15-23.3-46-52-87\n-86-123l-10-10h399738v-40H218c328 0 0 0 0 0l-10-8c-26.7-20-65.7-43-117-69 2.7\n-2 6-3.7 10-5 36.7-16 72.3-37.3 107-64l10-8h399782v-40z\nm8 0v40h399730v-40zm0 194v40h399730v-40z",doublerightarrow:"M399738 392l\n-10 10c-34 36-62.7 77-86 123-3.3 8-5 13.3-5 16 0 5.3 6.7 8 20 8 7.3 0 12.2-.5\n 14.5-1.5 2.3-1 4.8-4.5 7.5-10.5 49.3-97.3 121.7-169.3 217-216 28-14 57.3-25 88\n-33 6.7-2 11-3.8 13-5.5 2-1.7 3-4.2 3-7.5s-1-5.8-3-7.5c-2-1.7-6.3-3.5-13-5.5-68\n-17.3-128.2-47.8-180.5-91.5-52.3-43.7-93.8-96.2-124.5-157.5-9.3-8-15.3-12.3-18\n-13h-6c-12 .7-18 4-18 10 0 2 1.7 7 5 15 23.3 46 52 87 86 123l10 10H0v40h399782\nc-328 0 0 0 0 0l10 8c26.7 20 65.7 43 117 69-2.7 2-6 3.7-10 5-36.7 16-72.3 37.3\n-107 64l-10 8H0v40zM0 157v40h399730v-40zm0 194v40h399730v-40z",leftarrow:"M400000 241H110l3-3c68.7-52.7 113.7-120\n 135-202 4-14.7 6-23 6-25 0-7.3-7-11-21-11-8 0-13.2.8-15.5 2.5-2.3 1.7-4.2 5.8\n-5.5 12.5-1.3 4.7-2.7 10.3-4 17-12 48.7-34.8 92-68.5 130S65.3 228.3 18 247\nc-10 4-16 7.7-18 11 0 8.7 6 14.3 18 17 47.3 18.7 87.8 47 121.5 85S196 441.3 208\n 490c.7 2 1.3 5 2 9s1.2 6.7 1.5 8c.3 1.3 1 3.3 2 6s2.2 4.5 3.5 5.5c1.3 1 3.3\n 1.8 6 2.5s6 1 10 1c14 0 21-3.7 21-11 0-2-2-10.3-6-25-20-79.3-65-146.7-135-202\n l-3-3h399890zM100 241v40h399900v-40z",leftbrace:"M6 548l-6-6v-35l6-11c56-104 135.3-181.3 238-232 57.3-28.7 117\n-45 179-50h399577v120H403c-43.3 7-81 15-113 26-100.7 33-179.7 91-237 174-2.7\n 5-6 9-10 13-.7 1-7.3 1-20 1H6z",leftbraceunder:"M0 6l6-6h17c12.688 0 19.313.3 20 1 4 4 7.313 8.3 10 13\n 35.313 51.3 80.813 93.8 136.5 127.5 55.688 33.7 117.188 55.8 184.5 66.5.688\n 0 2 .3 4 1 18.688 2.7 76 4.3 172 5h399450v120H429l-6-1c-124.688-8-235-61.7\n-331-161C60.687 138.7 32.312 99.3 7 54L0 41V6z",leftgroup:"M400000 80\nH435C64 80 168.3 229.4 21 260c-5.9 1.2-18 0-18 0-2 0-3-1-3-3v-38C76 61 257 0\n 435 0h399565z",leftgroupunder:"M400000 262\nH435C64 262 168.3 112.6 21 82c-5.9-1.2-18 0-18 0-2 0-3 1-3 3v38c76 158 257 219\n 435 219h399565z",leftharpoon:"M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3\n-3.3 10.2-9.5 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5\n-18.3 3-21-1.3-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7\n-196 228-6.7 4.7-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40z",leftharpoonplus:"M0 267c.7 5.3 3 10 7 14h399993v-40H93c3.3-3.3 10.2-9.5\n 20.5-18.5s17.8-15.8 22.5-20.5c50.7-52 88-110.3 112-175 4-11.3 5-18.3 3-21-1.3\n-4-7.3-6-18-6-8 0-13 .7-15 2s-4.7 6.7-8 16c-42 98.7-107.3 174.7-196 228-6.7 4.7\n-10.7 8-12 10-1.3 2-2 5.7-2 11zm100-26v40h399900v-40zM0 435v40h400000v-40z\nm0 0v40h400000v-40z",leftharpoondown:"M7 241c-4 4-6.333 8.667-7 14 0 5.333.667 9 2 11s5.333\n 5.333 12 10c90.667 54 156 130 196 228 3.333 10.667 6.333 16.333 9 17 2 .667 5\n 1 9 1h5c10.667 0 16.667-2 18-6 2-2.667 1-9.667-3-21-32-87.333-82.667-157.667\n-152-211l-3-3h399907v-40zM93 281 H400000 v-40L7 241z",leftharpoondownplus:"M7 435c-4 4-6.3 8.7-7 14 0 5.3.7 9 2 11s5.3 5.3 12\n 10c90.7 54 156 130 196 228 3.3 10.7 6.3 16.3 9 17 2 .7 5 1 9 1h5c10.7 0 16.7\n-2 18-6 2-2.7 1-9.7-3-21-32-87.3-82.7-157.7-152-211l-3-3h399907v-40H7zm93 0\nv40h399900v-40zM0 241v40h399900v-40zm0 0v40h399900v-40z",lefthook:"M400000 281 H103s-33-11.2-61-33.5S0 197.3 0 164s14.2-61.2 42.5\n-83.5C70.8 58.2 104 47 142 47 c16.7 0 25 6.7 25 20 0 12-8.7 18.7-26 20-40 3.3\n-68.7 15.7-86 37-10 12-15 25.3-15 40 0 22.7 9.8 40.7 29.5 54 19.7 13.3 43.5 21\n 71.5 23h399859zM103 281v-40h399897v40z",leftlinesegment:"M40 281 V428 H0 V94 H40 V241 H400000 v40z\nM40 281 V428 H0 V94 H40 V241 H400000 v40z",leftmapsto:"M40 281 V448H0V74H40V241H400000v40z\nM40 281 V448H0V74H40V241H400000v40z",leftToFrom:"M0 147h400000v40H0zm0 214c68 40 115.7 95.7 143 167h22c15.3 0 23\n-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69-70-101l-7-8h399905v-40H95l7-8\nc28.7-32 52-65.7 70-101 10.7-23.3 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 265.3\n 68 321 0 361zm0-174v-40h399900v40zm100 154v40h399900v-40z",longequal:"M0 50 h400000 v40H0z m0 194h40000v40H0z\nM0 50 h400000 v40H0z m0 194h40000v40H0z",midbrace:"M200428 334\nc-100.7-8.3-195.3-44-280-108-55.3-42-101.7-93-139-153l-9-14c-2.7 4-5.7 8.7-9 14\n-53.3 86.7-123.7 153-211 199-66.7 36-137.3 56.3-212 62H0V214h199568c178.3-11.7\n 311.7-78.3 403-201 6-8 9.7-12 11-12 .7-.7 6.7-1 18-1s17.3.3 18 1c1.3 0 5 4 11\n 12 44.7 59.3 101.3 106.3 170 141s145.3 54.3 229 60h199572v120z",midbraceunder:"M199572 214\nc100.7 8.3 195.3 44 280 108 55.3 42 101.7 93 139 153l9 14c2.7-4 5.7-8.7 9-14\n 53.3-86.7 123.7-153 211-199 66.7-36 137.3-56.3 212-62h199568v120H200432c-178.3\n 11.7-311.7 78.3-403 201-6 8-9.7 12-11 12-.7.7-6.7 1-18 1s-17.3-.3-18-1c-1.3 0\n-5-4-11-12-44.7-59.3-101.3-106.3-170-141s-145.3-54.3-229-60H0V214z",oiintSize1:"M512.6 71.6c272.6 0 320.3 106.8 320.3 178.2 0 70.8-47.7 177.6\n-320.3 177.6S193.1 320.6 193.1 249.8c0-71.4 46.9-178.2 319.5-178.2z\nm368.1 178.2c0-86.4-60.9-215.4-368.1-215.4-306.4 0-367.3 129-367.3 215.4 0 85.8\n60.9 214.8 367.3 214.8 307.2 0 368.1-129 368.1-214.8z",oiintSize2:"M757.8 100.1c384.7 0 451.1 137.6 451.1 230 0 91.3-66.4 228.8\n-451.1 228.8-386.3 0-452.7-137.5-452.7-228.8 0-92.4 66.4-230 452.7-230z\nm502.4 230c0-111.2-82.4-277.2-502.4-277.2s-504 166-504 277.2\nc0 110 84 276 504 276s502.4-166 502.4-276z",oiiintSize1:"M681.4 71.6c408.9 0 480.5 106.8 480.5 178.2 0 70.8-71.6 177.6\n-480.5 177.6S202.1 320.6 202.1 249.8c0-71.4 70.5-178.2 479.3-178.2z\nm525.8 178.2c0-86.4-86.8-215.4-525.7-215.4-437.9 0-524.7 129-524.7 215.4 0\n85.8 86.8 214.8 524.7 214.8 438.9 0 525.7-129 525.7-214.8z",oiiintSize2:"M1021.2 53c603.6 0 707.8 165.8 707.8 277.2 0 110-104.2 275.8\n-707.8 275.8-606 0-710.2-165.8-710.2-275.8C311 218.8 415.2 53 1021.2 53z\nm770.4 277.1c0-131.2-126.4-327.6-770.5-327.6S248.4 198.9 248.4 330.1\nc0 130 128.8 326.4 772.7 326.4s770.5-196.4 770.5-326.4z",rightarrow:"M0 241v40h399891c-47.3 35.3-84 78-110 128\n-16.7 32-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20\n 11 8 0 13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7\n 39-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85\n-40.5-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n 151.7 139 205zm0 0v40h399900v-40z",rightbrace:"M400000 542l\n-6 6h-17c-12.7 0-19.3-.3-20-1-4-4-7.3-8.3-10-13-35.3-51.3-80.8-93.8-136.5-127.5\ns-117.2-55.8-184.5-66.5c-.7 0-2-.3-4-1-18.7-2.7-76-4.3-172-5H0V214h399571l6 1\nc124.7 8 235 61.7 331 161 31.3 33.3 59.7 72.7 85 118l7 13v35z",rightbraceunder:"M399994 0l6 6v35l-6 11c-56 104-135.3 181.3-238 232-57.3\n 28.7-117 45-179 50H-300V214h399897c43.3-7 81-15 113-26 100.7-33 179.7-91 237\n-174 2.7-5 6-9 10-13 .7-1 7.3-1 20-1h17z",rightgroup:"M0 80h399565c371 0 266.7 149.4 414 180 5.9 1.2 18 0 18 0 2 0\n 3-1 3-3v-38c-76-158-257-219-435-219H0z",rightgroupunder:"M0 262h399565c371 0 266.7-149.4 414-180 5.9-1.2 18 0 18\n 0 2 0 3 1 3 3v38c-76 158-257 219-435 219H0z",rightharpoon:"M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3\n-3.7-15.3-11-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2\n-10.7 0-16.7 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58\n 69.2 92 94.5zm0 0v40h399900v-40z",rightharpoonplus:"M0 241v40h399993c4.7-4.7 7-9.3 7-14 0-9.3-3.7-15.3-11\n-18-92.7-56.7-159-133.7-199-231-3.3-9.3-6-14.7-8-16-2-1.3-7-2-15-2-10.7 0-16.7\n 2-18 6-2 2.7-1 9.7 3 21 15.3 42 36.7 81.8 64 119.5 27.3 37.7 58 69.2 92 94.5z\nm0 0v40h399900v-40z m100 194v40h399900v-40zm0 0v40h399900v-40z",rightharpoondown:"M399747 511c0 7.3 6.7 11 20 11 8 0 13-.8 15-2.5s4.7-6.8\n 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3 8.5-5.8 9.5\n-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3-64.7 57-92 95\n-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 241v40h399900v-40z",rightharpoondownplus:"M399747 705c0 7.3 6.7 11 20 11 8 0 13-.8\n 15-2.5s4.7-6.8 8-15.5c40-94 99.3-166.3 178-217 13.3-8 20.3-12.3 21-13 5.3-3.3\n 8.5-5.8 9.5-7.5 1-1.7 1.5-5.2 1.5-10.5s-2.3-10.3-7-15H0v40h399908c-34 25.3\n-64.7 57-92 95-27.3 38-48.7 77.7-64 119-3.3 8.7-5 14-5 16zM0 435v40h399900v-40z\nm0-194v40h400000v-40zm0 0v40h400000v-40z",righthook:"M399859 241c-764 0 0 0 0 0 40-3.3 68.7-15.7 86-37 10-12 15-25.3\n 15-40 0-22.7-9.8-40.7-29.5-54-19.7-13.3-43.5-21-71.5-23-17.3-1.3-26-8-26-20 0\n-13.3 8.7-20 26-20 38 0 71 11.2 99 33.5 0 0 7 5.6 21 16.7 14 11.2 21 33.5 21\n 66.8s-14 61.2-42 83.5c-28 22.3-61 33.5-99 33.5L0 241z M0 281v-40h399859v40z",rightlinesegment:"M399960 241 V94 h40 V428 h-40 V281 H0 v-40z\nM399960 241 V94 h40 V428 h-40 V281 H0 v-40z",rightToFrom:"M400000 167c-70.7-42-118-97.7-142-167h-23c-15.3 0-23 .3-23\n 1 0 1.3 5.3 13.7 16 37 18 35.3 41.3 69 70 101l7 8H0v40h399905l-7 8c-28.7 32\n-52 65.7-70 101-10.7 23.3-16 35.7-16 37 0 .7 7.7 1 23 1h23c24-69.3 71.3-125 142\n-167z M100 147v40h399900v-40zM0 341v40h399900v-40z",twoheadleftarrow:"M0 167c68 40\n 115.7 95.7 143 167h22c15.3 0 23-.3 23-1 0-1.3-5.3-13.7-16-37-18-35.3-41.3-69\n-70-101l-7-8h125l9 7c50.7 39.3 85 86 103 140h46c0-4.7-6.3-18.7-19-42-18-35.3\n-40-67.3-66-96l-9-9h399716v-40H284l9-9c26-28.7 48-60.7 66-96 12.7-23.333 19\n-37.333 19-42h-46c-18 54-52.3 100.7-103 140l-9 7H95l7-8c28.7-32 52-65.7 70-101\n 10.7-23.333 16-35.7 16-37 0-.7-7.7-1-23-1h-22C115.7 71.3 68 127 0 167z",twoheadrightarrow:"M400000 167\nc-68-40-115.7-95.7-143-167h-22c-15.3 0-23 .3-23 1 0 1.3 5.3 13.7 16 37 18 35.3\n 41.3 69 70 101l7 8h-125l-9-7c-50.7-39.3-85-86-103-140h-46c0 4.7 6.3 18.7 19 42\n 18 35.3 40 67.3 66 96l9 9H0v40h399716l-9 9c-26 28.7-48 60.7-66 96-12.7 23.333\n-19 37.333-19 42h46c18-54 52.3-100.7 103-140l9-7h125l-7 8c-28.7 32-52 65.7-70\n 101-10.7 23.333-16 35.7-16 37 0 .7 7.7 1 23 1h22c27.3-71.3 75-127 143-167z",tilde1:"M200 55.538c-77 0-168 73.953-177 73.953-3 0-7\n-2.175-9-5.437L2 97c-1-2-2-4-2-6 0-4 2-7 5-9l20-12C116 12 171 0 207 0c86 0\n 114 68 191 68 78 0 168-68 177-68 4 0 7 2 9 5l12 19c1 2.175 2 4.35 2 6.525 0\n 4.35-2 7.613-5 9.788l-19 13.05c-92 63.077-116.937 75.308-183 76.128\n-68.267.847-113-73.952-191-73.952z",tilde2:"M344 55.266c-142 0-300.638 81.316-311.5 86.418\n-8.01 3.762-22.5 10.91-23.5 5.562L1 120c-1-2-1-3-1-4 0-5 3-9 8-10l18.4-9C160.9\n 31.9 283 0 358 0c148 0 188 122 331 122s314-97 326-97c4 0 8 2 10 7l7 21.114\nc1 2.14 1 3.21 1 4.28 0 5.347-3 9.626-7 10.696l-22.3 12.622C852.6 158.372 751\n 181.476 676 181.476c-149 0-189-126.21-332-126.21z",tilde3:"M786 59C457 59 32 175.242 13 175.242c-6 0-10-3.457\n-11-10.37L.15 138c-1-7 3-12 10-13l19.2-6.4C378.4 40.7 634.3 0 804.3 0c337 0\n 411.8 157 746.8 157 328 0 754-112 773-112 5 0 10 3 11 9l1 14.075c1 8.066-.697\n 16.595-6.697 17.492l-21.052 7.31c-367.9 98.146-609.15 122.696-778.15 122.696\n -338 0-409-156.573-744-156.573z",tilde4:"M786 58C457 58 32 177.487 13 177.487c-6 0-10-3.345\n-11-10.035L.15 143c-1-7 3-12 10-13l22-6.7C381.2 35 637.15 0 807.15 0c337 0 409\n 177 744 177 328 0 754-127 773-127 5 0 10 3 11 9l1 14.794c1 7.805-3 13.38-9\n 14.495l-20.7 5.574c-366.85 99.79-607.3 139.372-776.3 139.372-338 0-409\n -175.236-744-175.236z",vec:"M377 20c0-5.333 1.833-10 5.5-14S391 0 397 0c4.667 0 8.667 1.667 12 5\n3.333 2.667 6.667 9 10 19 6.667 24.667 20.333 43.667 41 57 7.333 4.667 11\n10.667 11 18 0 6-1 10-3 12s-6.667 5-14 9c-28.667 14.667-53.667 35.667-75 63\n-1.333 1.333-3.167 3.5-5.5 6.5s-4 4.833-5 5.5c-1 .667-2.5 1.333-4.5 2s-4.333 1\n-7 1c-4.667 0-9.167-1.833-13.5-5.5S337 184 337 178c0-12.667 15.667-32.333 47-59\nH213l-171-1c-8.667-6-13-12.333-13-19 0-4.667 4.333-11.333 13-20h359\nc-16-25.333-24-45-24-59z",widehat1:"M529 0h5l519 115c5 1 9 5 9 10 0 1-1 2-1 3l-4 22\nc-1 5-5 9-11 9h-2L532 67 19 159h-2c-5 0-9-4-11-9l-5-22c-1-6 2-12 8-13z",widehat2:"M1181 0h2l1171 176c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 220h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",widehat3:"M1181 0h2l1171 236c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 280h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",widehat4:"M1181 0h2l1171 296c6 0 10 5 10 11l-2 23c-1 6-5 10\n-11 10h-1L1182 67 15 340h-1c-6 0-10-4-11-10l-2-23c-1-6 4-11 10-11z",widecheck1:"M529,159h5l519,-115c5,-1,9,-5,9,-10c0,-1,-1,-2,-1,-3l-4,-22c-1,\n-5,-5,-9,-11,-9h-2l-512,92l-513,-92h-2c-5,0,-9,4,-11,9l-5,22c-1,6,2,12,8,13z",widecheck2:"M1181,220h2l1171,-176c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,153l-1167,-153h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",widecheck3:"M1181,280h2l1171,-236c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,213l-1167,-213h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",widecheck4:"M1181,340h2l1171,-296c6,0,10,-5,10,-11l-2,-23c-1,-6,-5,-10,\n-11,-10h-1l-1168,273l-1167,-273h-1c-6,0,-10,4,-11,10l-2,23c-1,6,4,11,10,11z",baraboveleftarrow:"M400000 620h-399890l3 -3c68.7 -52.7 113.7 -120 135 -202\nc4 -14.7 6 -23 6 -25c0 -7.3 -7 -11 -21 -11c-8 0 -13.2 0.8 -15.5 2.5\nc-2.3 1.7 -4.2 5.8 -5.5 12.5c-1.3 4.7 -2.7 10.3 -4 17c-12 48.7 -34.8 92 -68.5 130\ns-74.2 66.3 -121.5 85c-10 4 -16 7.7 -18 11c0 8.7 6 14.3 18 17c47.3 18.7 87.8 47\n121.5 85s56.5 81.3 68.5 130c0.7 2 1.3 5 2 9s1.2 6.7 1.5 8c0.3 1.3 1 3.3 2 6\ns2.2 4.5 3.5 5.5c1.3 1 3.3 1.8 6 2.5s6 1 10 1c14 0 21 -3.7 21 -11\nc0 -2 -2 -10.3 -6 -25c-20 -79.3 -65 -146.7 -135 -202l-3 -3h399890z\nM100 241v40h399900v-40z M0 241v40h399900v-40zM0 241v40h399900v-40z",rightarrowabovebar:"M0 241v40h399891c-47.3 35.3-84 78-110 128-16.7 32\n-27.7 63.7-33 95 0 1.3-.2 2.7-.5 4-.3 1.3-.5 2.3-.5 3 0 7.3 6.7 11 20 11 8 0\n13.2-.8 15.5-2.5 2.3-1.7 4.2-5.5 5.5-11.5 2-13.3 5.7-27 11-41 14.7-44.7 39\n-84.5 73-119.5s73.7-60.2 119-75.5c6-2 9-5.7 9-11s-3-9-9-11c-45.3-15.3-85-40.5\n-119-75.5s-58.3-74.8-73-119.5c-4.7-14-8.3-27.3-11-40-1.3-6.7-3.2-10.8-5.5\n-12.5-2.3-1.7-7.5-2.5-15.5-2.5-14 0-21 3.7-21 11 0 2 2 10.3 6 25 20.7 83.3 67\n151.7 139 205zm96 379h399894v40H0zm0 0h399904v40H0z",baraboveshortleftharpoon:"M507,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17\nc2,0.7,5,1,9,1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21\nc-32,-87.3,-82.7,-157.7,-152,-211c0,0,-3,-3,-3,-3l399351,0l0,-40\nc-398570,0,-399437,0,-399437,0z M593 435 v40 H399500 v-40z\nM0 281 v-40 H399908 v40z M0 281 v-40 H399908 v40z",rightharpoonaboveshortbar:"M0,241 l0,40c399126,0,399993,0,399993,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM0 241 v40 H399908 v-40z M0 475 v-40 H399500 v40z M0 475 v-40 H399500 v40z",shortbaraboveleftharpoon:"M7,435c-4,4,-6.3,8.7,-7,14c0,5.3,0.7,9,2,11\nc1.3,2,5.3,5.3,12,10c90.7,54,156,130,196,228c3.3,10.7,6.3,16.3,9,17c2,0.7,5,1,9,\n1c0,0,5,0,5,0c10.7,0,16.7,-2,18,-6c2,-2.7,1,-9.7,-3,-21c-32,-87.3,-82.7,-157.7,\n-152,-211c0,0,-3,-3,-3,-3l399907,0l0,-40c-399126,0,-399993,0,-399993,0z\nM93 435 v40 H400000 v-40z M500 241 v40 H400000 v-40z M500 241 v40 H400000 v-40z",shortrightharpoonabovebar:"M53,241l0,40c398570,0,399437,0,399437,0\nc4.7,-4.7,7,-9.3,7,-14c0,-9.3,-3.7,-15.3,-11,-18c-92.7,-56.7,-159,-133.7,-199,\n-231c-3.3,-9.3,-6,-14.7,-8,-16c-2,-1.3,-7,-2,-15,-2c-10.7,0,-16.7,2,-18,6\nc-2,2.7,-1,9.7,3,21c15.3,42,36.7,81.8,64,119.5c27.3,37.7,58,69.2,92,94.5z\nM500 241 v40 H399408 v-40z M500 435 v40 H400000 v-40z"}},C=function(){function t(e){a()(this,t),this.children=e,this.classes=[],this.height=0,this.depth=0,this.maxFontSize=0,this.style={}}return t.prototype.hasClass=function(t){return d.contains(this.classes,t)},t.prototype.tryCombine=function(t){return!1},t.prototype.toNode=function(){for(var t=document.createDocumentFragment(),e=0;e<this.children.length;e++)t.appendChild(this.children[e].toNode());return t},t.prototype.toMarkup=function(){for(var t="",e=0;e<this.children.length;e++)t+=this.children[e].toMarkup();return t},t.prototype.toText=function(){var t=function(t){return t.toText()};return this.children.map(t).join("")},t}(),N=function(t){return t.filter(function(t){return t}).join(" ")},q=function(t,e,r){if(this.classes=t||[],this.attributes={},this.height=0,this.depth=0,this.maxFontSize=0,this.style=r||{},e){e.style.isTight()&&this.classes.push("mtight");var n=e.getColor();n&&(this.style.color=n)}},E=function(t){var e=document.createElement(t);for(var r in e.className=N(this.classes),this.style)this.style.hasOwnProperty(r)&&(e.style[r]=this.style[r]);for(var n in this.attributes)this.attributes.hasOwnProperty(n)&&e.setAttribute(n,this.attributes[n]);for(var a=0;a<this.children.length;a++)e.appendChild(this.children[a].toNode());return e},O=function(t){var e="<"+t;this.classes.length&&(e+=' class="'+d.escape(N(this.classes))+'"');var r="";for(var n in this.style)this.style.hasOwnProperty(n)&&(r+=d.hyphenate(n)+":"+this.style[n]+";");for(var a in r&&(e+=' style="'+d.escape(r)+'"'),this.attributes)this.attributes.hasOwnProperty(a)&&(e+=" "+a+'="'+d.escape(this.attributes[a])+'"');e+=">";for(var o=0;o<this.children.length;o++)e+=this.children[o].toMarkup();return e+="</"+t+">"},I=function(){function t(e,r,n,o){a()(this,t),q.call(this,e,n,o),this.children=r||[]}return t.prototype.setAttribute=function(t,e){this.attributes[t]=e},t.prototype.hasClass=function(t){return d.contains(this.classes,t)},t.prototype.tryCombine=function(t){return!1},t.prototype.toNode=function(){return E.call(this,"span")},t.prototype.toMarkup=function(){return O.call(this,"span")},t}(),R=function(){function t(e,r,n,o){a()(this,t),q.call(this,r,o),this.children=n||[],this.setAttribute("href",e)}return t.prototype.setAttribute=function(t,e){this.attributes[t]=e},t.prototype.hasClass=function(t){return d.contains(this.classes,t)},t.prototype.tryCombine=function(t){return!1},t.prototype.toNode=function(){return E.call(this,"a")},t.prototype.toMarkup=function(){return O.call(this,"a")},t}(),L={"\xee":"\u0131\u0302","\xef":"\u0131\u0308","\xed":"\u0131\u0301","\xec":"\u0131\u0300"},H=function(){function t(e,r,n,o,i,s,h,l){a()(this,t),this.text=e,this.height=r||0,this.depth=n||0,this.italic=o||0,this.skew=i||0,this.width=s||0,this.classes=h||[],this.style=l||{},this.maxFontSize=0;var m=function(t){for(var e=0;e<z.length;e++)for(var r=z[e],n=0;n<r.blocks.length;n++){var a=r.blocks[n];if(t>=a[0]&&t<=a[1])return r.name}return null}(this.text.charCodeAt(0));m&&this.classes.push(m+"_fallback"),/[\xee\xef\xed\xec]/.test(this.text)&&(this.text=L[this.text])}return t.prototype.hasClass=function(t){return d.contains(this.classes,t)},t.prototype.tryCombine=function(e){if(!e||!(e instanceof t)||this.italic>0||N(this.classes)!==N(e.classes)||this.skew!==e.skew||this.maxFontSize!==e.maxFontSize)return!1;for(var r in this.style)if(this.style.hasOwnProperty(r)&&this.style[r]!==e.style[r])return!1;for(var n in e.style)if(e.style.hasOwnProperty(n)&&this.style[n]!==e.style[n])return!1;return this.text+=e.text,this.height=Math.max(this.height,e.height),this.depth=Math.max(this.depth,e.depth),this.italic=e.italic,!0},t.prototype.toNode=function(){var t=document.createTextNode(this.text),e=null;for(var r in this.italic>0&&((e=document.createElement("span")).style.marginRight=this.italic+"em"),this.classes.length>0&&((e=e||document.createElement("span")).className=N(this.classes)),this.style)this.style.hasOwnProperty(r)&&((e=e||document.createElement("span")).style[r]=this.style[r]);return e?(e.appendChild(t),e):t},t.prototype.toMarkup=function(){var t=!1,e="<span";this.classes.length&&(t=!0,e+=' class="',e+=d.escape(N(this.classes)),e+='"');var r="";for(var n in this.italic>0&&(r+="margin-right:"+this.italic+"em;"),this.style)this.style.hasOwnProperty(n)&&(r+=d.hyphenate(n)+":"+this.style[n]+";");r&&(t=!0,e+=' style="'+d.escape(r)+'"');var a=d.escape(this.text);return t?(e+=">",e+=a,e+="</span>"):a},t}(),D=function(){function t(e,r){a()(this,t),this.children=e||[],this.attributes=r||{}}return t.prototype.toNode=function(){var t=document.createElementNS("http://www.w3.org/2000/svg","svg");for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&t.setAttribute(e,this.attributes[e]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t},t.prototype.toMarkup=function(){var t="<svg";for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&(t+=" "+e+"='"+this.attributes[e]+"'");t+=">";for(var r=0;r<this.children.length;r++)t+=this.children[r].toMarkup();return t+="</svg>"},t}(),P=function(){function t(e,r){a()(this,t),this.pathName=e,this.alternate=r}return t.prototype.toNode=function(){var t=document.createElementNS("http://www.w3.org/2000/svg","path");return this.alternate?t.setAttribute("d",this.alternate):t.setAttribute("d",B.path[this.pathName]),t},t.prototype.toMarkup=function(){return this.alternate?"<path d='"+this.alternate+"'/>":"<path d='"+B.path[this.pathName]+"'/>"},t}(),F=function(){function t(e){a()(this,t),this.attributes=e||{}}return t.prototype.toNode=function(){var t=document.createElementNS("http://www.w3.org/2000/svg","line");for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&t.setAttribute(e,this.attributes[e]);return t},t.prototype.toMarkup=function(){var t="<line";for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&(t+=" "+e+"='"+this.attributes[e]+"'");return t+="/>"},t}();var V={"AMS-Regular":{65:[0,.68889,0,0,.72222],66:[0,.68889,0,0,.66667],67:[0,.68889,0,0,.72222],68:[0,.68889,0,0,.72222],69:[0,.68889,0,0,.66667],70:[0,.68889,0,0,.61111],71:[0,.68889,0,0,.77778],72:[0,.68889,0,0,.77778],73:[0,.68889,0,0,.38889],74:[.16667,.68889,0,0,.5],75:[0,.68889,0,0,.77778],76:[0,.68889,0,0,.66667],77:[0,.68889,0,0,.94445],78:[0,.68889,0,0,.72222],79:[.16667,.68889,0,0,.77778],80:[0,.68889,0,0,.61111],81:[.16667,.68889,0,0,.77778],82:[0,.68889,0,0,.72222],83:[0,.68889,0,0,.55556],84:[0,.68889,0,0,.66667],85:[0,.68889,0,0,.72222],86:[0,.68889,0,0,.72222],87:[0,.68889,0,0,1],88:[0,.68889,0,0,.72222],89:[0,.68889,0,0,.72222],90:[0,.68889,0,0,.66667],107:[0,.68889,0,0,.55556],165:[0,.675,.025,0,.75],174:[.15559,.69224,0,0,.94666],240:[0,.68889,0,0,.55556],295:[0,.68889,0,0,.54028],710:[0,.825,0,0,2.33334],732:[0,.9,0,0,2.33334],770:[0,.825,0,0,2.33334],771:[0,.9,0,0,2.33334],989:[.08167,.58167,0,0,.77778],1008:[0,.43056,.04028,0,.66667],8245:[0,.54986,0,0,.275],8463:[0,.68889,0,0,.54028],8487:[0,.68889,0,0,.72222],8498:[0,.68889,0,0,.55556],8502:[0,.68889,0,0,.66667],8503:[0,.68889,0,0,.44445],8504:[0,.68889,0,0,.66667],8513:[0,.68889,0,0,.63889],8592:[-.03598,.46402,0,0,.5],8594:[-.03598,.46402,0,0,.5],8602:[-.13313,.36687,0,0,1],8603:[-.13313,.36687,0,0,1],8606:[.01354,.52239,0,0,1],8608:[.01354,.52239,0,0,1],8610:[.01354,.52239,0,0,1.11111],8611:[.01354,.52239,0,0,1.11111],8619:[0,.54986,0,0,1],8620:[0,.54986,0,0,1],8621:[-.13313,.37788,0,0,1.38889],8622:[-.13313,.36687,0,0,1],8624:[0,.69224,0,0,.5],8625:[0,.69224,0,0,.5],8630:[0,.43056,0,0,1],8631:[0,.43056,0,0,1],8634:[.08198,.58198,0,0,.77778],8635:[.08198,.58198,0,0,.77778],8638:[.19444,.69224,0,0,.41667],8639:[.19444,.69224,0,0,.41667],8642:[.19444,.69224,0,0,.41667],8643:[.19444,.69224,0,0,.41667],8644:[.1808,.675,0,0,1],8646:[.1808,.675,0,0,1],8647:[.1808,.675,0,0,1],8648:[.19444,.69224,0,0,.83334],8649:[.1808,.675,0,0,1],8650:[.19444,.69224,0,0,.83334],8651:[.01354,.52239,0,0,1],8652:[.01354,.52239,0,0,1],8653:[-.13313,.36687,0,0,1],8654:[-.13313,.36687,0,0,1],8655:[-.13313,.36687,0,0,1],8666:[.13667,.63667,0,0,1],8667:[.13667,.63667,0,0,1],8669:[-.13313,.37788,0,0,1],8672:[-.064,.437,0,0,1.334],8674:[-.064,.437,0,0,1.334],8705:[0,.825,0,0,.5],8708:[0,.68889,0,0,.55556],8709:[.08167,.58167,0,0,.77778],8717:[0,.43056,0,0,.42917],8722:[-.03598,.46402,0,0,.5],8724:[.08198,.69224,0,0,.77778],8726:[.08167,.58167,0,0,.77778],8733:[0,.69224,0,0,.77778],8736:[0,.69224,0,0,.72222],8737:[0,.69224,0,0,.72222],8738:[.03517,.52239,0,0,.72222],8739:[.08167,.58167,0,0,.22222],8740:[.25142,.74111,0,0,.27778],8741:[.08167,.58167,0,0,.38889],8742:[.25142,.74111,0,0,.5],8756:[0,.69224,0,0,.66667],8757:[0,.69224,0,0,.66667],8764:[-.13313,.36687,0,0,.77778],8765:[-.13313,.37788,0,0,.77778],8769:[-.13313,.36687,0,0,.77778],8770:[-.03625,.46375,0,0,.77778],8774:[.30274,.79383,0,0,.77778],8776:[-.01688,.48312,0,0,.77778],8778:[.08167,.58167,0,0,.77778],8782:[.06062,.54986,0,0,.77778],8783:[.06062,.54986,0,0,.77778],8785:[.08198,.58198,0,0,.77778],8786:[.08198,.58198,0,0,.77778],8787:[.08198,.58198,0,0,.77778],8790:[0,.69224,0,0,.77778],8791:[.22958,.72958,0,0,.77778],8796:[.08198,.91667,0,0,.77778],8806:[.25583,.75583,0,0,.77778],8807:[.25583,.75583,0,0,.77778],8808:[.25142,.75726,0,0,.77778],8809:[.25142,.75726,0,0,.77778],8812:[.25583,.75583,0,0,.5],8814:[.20576,.70576,0,0,.77778],8815:[.20576,.70576,0,0,.77778],8816:[.30274,.79383,0,0,.77778],8817:[.30274,.79383,0,0,.77778],8818:[.22958,.72958,0,0,.77778],8819:[.22958,.72958,0,0,.77778],8822:[.1808,.675,0,0,.77778],8823:[.1808,.675,0,0,.77778],8828:[.13667,.63667,0,0,.77778],8829:[.13667,.63667,0,0,.77778],8830:[.22958,.72958,0,0,.77778],8831:[.22958,.72958,0,0,.77778],8832:[.20576,.70576,0,0,.77778],8833:[.20576,.70576,0,0,.77778],8840:[.30274,.79383,0,0,.77778],8841:[.30274,.79383,0,0,.77778],8842:[.13597,.63597,0,0,.77778],8843:[.13597,.63597,0,0,.77778],8847:[.03517,.54986,0,0,.77778],8848:[.03517,.54986,0,0,.77778],8858:[.08198,.58198,0,0,.77778],8859:[.08198,.58198,0,0,.77778],8861:[.08198,.58198,0,0,.77778],8862:[0,.675,0,0,.77778],8863:[0,.675,0,0,.77778],8864:[0,.675,0,0,.77778],8865:[0,.675,0,0,.77778],8872:[0,.69224,0,0,.61111],8873:[0,.69224,0,0,.72222],8874:[0,.69224,0,0,.88889],8876:[0,.68889,0,0,.61111],8877:[0,.68889,0,0,.61111],8878:[0,.68889,0,0,.72222],8879:[0,.68889,0,0,.72222],8882:[.03517,.54986,0,0,.77778],8883:[.03517,.54986,0,0,.77778],8884:[.13667,.63667,0,0,.77778],8885:[.13667,.63667,0,0,.77778],8888:[0,.54986,0,0,1.11111],8890:[.19444,.43056,0,0,.55556],8891:[.19444,.69224,0,0,.61111],8892:[.19444,.69224,0,0,.61111],8901:[0,.54986,0,0,.27778],8903:[.08167,.58167,0,0,.77778],8905:[.08167,.58167,0,0,.77778],8906:[.08167,.58167,0,0,.77778],8907:[0,.69224,0,0,.77778],8908:[0,.69224,0,0,.77778],8909:[-.03598,.46402,0,0,.77778],8910:[0,.54986,0,0,.76042],8911:[0,.54986,0,0,.76042],8912:[.03517,.54986,0,0,.77778],8913:[.03517,.54986,0,0,.77778],8914:[0,.54986,0,0,.66667],8915:[0,.54986,0,0,.66667],8916:[0,.69224,0,0,.66667],8918:[.0391,.5391,0,0,.77778],8919:[.0391,.5391,0,0,.77778],8920:[.03517,.54986,0,0,1.33334],8921:[.03517,.54986,0,0,1.33334],8922:[.38569,.88569,0,0,.77778],8923:[.38569,.88569,0,0,.77778],8926:[.13667,.63667,0,0,.77778],8927:[.13667,.63667,0,0,.77778],8928:[.30274,.79383,0,0,.77778],8929:[.30274,.79383,0,0,.77778],8934:[.23222,.74111,0,0,.77778],8935:[.23222,.74111,0,0,.77778],8936:[.23222,.74111,0,0,.77778],8937:[.23222,.74111,0,0,.77778],8938:[.20576,.70576,0,0,.77778],8939:[.20576,.70576,0,0,.77778],8940:[.30274,.79383,0,0,.77778],8941:[.30274,.79383,0,0,.77778],8994:[.19444,.69224,0,0,.77778],8995:[.19444,.69224,0,0,.77778],9416:[.15559,.69224,0,0,.90222],9484:[0,.69224,0,0,.5],9488:[0,.69224,0,0,.5],9492:[0,.37788,0,0,.5],9496:[0,.37788,0,0,.5],9585:[.19444,.68889,0,0,.88889],9586:[.19444,.74111,0,0,.88889],9632:[0,.675,0,0,.77778],9633:[0,.675,0,0,.77778],9650:[0,.54986,0,0,.72222],9651:[0,.54986,0,0,.72222],9654:[.03517,.54986,0,0,.77778],9660:[0,.54986,0,0,.72222],9661:[0,.54986,0,0,.72222],9664:[.03517,.54986,0,0,.77778],9674:[.11111,.69224,0,0,.66667],9733:[.19444,.69224,0,0,.94445],10003:[0,.69224,0,0,.83334],10016:[0,.69224,0,0,.83334],10731:[.11111,.69224,0,0,.66667],10846:[.19444,.75583,0,0,.61111],10877:[.13667,.63667,0,0,.77778],10878:[.13667,.63667,0,0,.77778],10885:[.25583,.75583,0,0,.77778],10886:[.25583,.75583,0,0,.77778],10887:[.13597,.63597,0,0,.77778],10888:[.13597,.63597,0,0,.77778],10889:[.26167,.75726,0,0,.77778],10890:[.26167,.75726,0,0,.77778],10891:[.48256,.98256,0,0,.77778],10892:[.48256,.98256,0,0,.77778],10901:[.13667,.63667,0,0,.77778],10902:[.13667,.63667,0,0,.77778],10933:[.25142,.75726,0,0,.77778],10934:[.25142,.75726,0,0,.77778],10935:[.26167,.75726,0,0,.77778],10936:[.26167,.75726,0,0,.77778],10937:[.26167,.75726,0,0,.77778],10938:[.26167,.75726,0,0,.77778],10949:[.25583,.75583,0,0,.77778],10950:[.25583,.75583,0,0,.77778],10955:[.28481,.79383,0,0,.77778],10956:[.28481,.79383,0,0,.77778],57350:[.08167,.58167,0,0,.22222],57351:[.08167,.58167,0,0,.38889],57352:[.08167,.58167,0,0,.77778],57353:[0,.43056,.04028,0,.66667],57356:[.25142,.75726,0,0,.77778],57357:[.25142,.75726,0,0,.77778],57358:[.41951,.91951,0,0,.77778],57359:[.30274,.79383,0,0,.77778],57360:[.30274,.79383,0,0,.77778],57361:[.41951,.91951,0,0,.77778],57366:[.25142,.75726,0,0,.77778],57367:[.25142,.75726,0,0,.77778],57368:[.25142,.75726,0,0,.77778],57369:[.25142,.75726,0,0,.77778],57370:[.13597,.63597,0,0,.77778],57371:[.13597,.63597,0,0,.77778]},"Caligraphic-Regular":{48:[0,.43056,0,0,.5],49:[0,.43056,0,0,.5],50:[0,.43056,0,0,.5],51:[.19444,.43056,0,0,.5],52:[.19444,.43056,0,0,.5],53:[.19444,.43056,0,0,.5],54:[0,.64444,0,0,.5],55:[.19444,.43056,0,0,.5],56:[0,.64444,0,0,.5],57:[.19444,.43056,0,0,.5],65:[0,.68333,0,.19445,.79847],66:[0,.68333,.03041,.13889,.65681],67:[0,.68333,.05834,.13889,.52653],68:[0,.68333,.02778,.08334,.77139],69:[0,.68333,.08944,.11111,.52778],70:[0,.68333,.09931,.11111,.71875],71:[.09722,.68333,.0593,.11111,.59487],72:[0,.68333,.00965,.11111,.84452],73:[0,.68333,.07382,0,.54452],74:[.09722,.68333,.18472,.16667,.67778],75:[0,.68333,.01445,.05556,.76195],76:[0,.68333,0,.13889,.68972],77:[0,.68333,0,.13889,1.2009],78:[0,.68333,.14736,.08334,.82049],79:[0,.68333,.02778,.11111,.79611],80:[0,.68333,.08222,.08334,.69556],81:[.09722,.68333,0,.11111,.81667],82:[0,.68333,0,.08334,.8475],83:[0,.68333,.075,.13889,.60556],84:[0,.68333,.25417,0,.54464],85:[0,.68333,.09931,.08334,.62583],86:[0,.68333,.08222,0,.61278],87:[0,.68333,.08222,.08334,.98778],88:[0,.68333,.14643,.13889,.7133],89:[.09722,.68333,.08222,.08334,.66834],90:[0,.68333,.07944,.13889,.72473]},"Fraktur-Regular":{33:[0,.69141,0,0,.29574],34:[0,.69141,0,0,.21471],38:[0,.69141,0,0,.73786],39:[0,.69141,0,0,.21201],40:[.24982,.74947,0,0,.38865],41:[.24982,.74947,0,0,.38865],42:[0,.62119,0,0,.27764],43:[.08319,.58283,0,0,.75623],44:[0,.10803,0,0,.27764],45:[.08319,.58283,0,0,.75623],46:[0,.10803,0,0,.27764],47:[.24982,.74947,0,0,.50181],48:[0,.47534,0,0,.50181],49:[0,.47534,0,0,.50181],50:[0,.47534,0,0,.50181],51:[.18906,.47534,0,0,.50181],52:[.18906,.47534,0,0,.50181],53:[.18906,.47534,0,0,.50181],54:[0,.69141,0,0,.50181],55:[.18906,.47534,0,0,.50181],56:[0,.69141,0,0,.50181],57:[.18906,.47534,0,0,.50181],58:[0,.47534,0,0,.21606],59:[.12604,.47534,0,0,.21606],61:[-.13099,.36866,0,0,.75623],63:[0,.69141,0,0,.36245],65:[0,.69141,0,0,.7176],66:[0,.69141,0,0,.88397],67:[0,.69141,0,0,.61254],68:[0,.69141,0,0,.83158],69:[0,.69141,0,0,.66278],70:[.12604,.69141,0,0,.61119],71:[0,.69141,0,0,.78539],72:[.06302,.69141,0,0,.7203],73:[0,.69141,0,0,.55448],74:[.12604,.69141,0,0,.55231],75:[0,.69141,0,0,.66845],76:[0,.69141,0,0,.66602],77:[0,.69141,0,0,1.04953],78:[0,.69141,0,0,.83212],79:[0,.69141,0,0,.82699],80:[.18906,.69141,0,0,.82753],81:[.03781,.69141,0,0,.82699],82:[0,.69141,0,0,.82807],83:[0,.69141,0,0,.82861],84:[0,.69141,0,0,.66899],85:[0,.69141,0,0,.64576],86:[0,.69141,0,0,.83131],87:[0,.69141,0,0,1.04602],88:[0,.69141,0,0,.71922],89:[.18906,.69141,0,0,.83293],90:[.12604,.69141,0,0,.60201],91:[.24982,.74947,0,0,.27764],93:[.24982,.74947,0,0,.27764],94:[0,.69141,0,0,.49965],97:[0,.47534,0,0,.50046],98:[0,.69141,0,0,.51315],99:[0,.47534,0,0,.38946],100:[0,.62119,0,0,.49857],101:[0,.47534,0,0,.40053],102:[.18906,.69141,0,0,.32626],103:[.18906,.47534,0,0,.5037],104:[.18906,.69141,0,0,.52126],105:[0,.69141,0,0,.27899],106:[0,.69141,0,0,.28088],107:[0,.69141,0,0,.38946],108:[0,.69141,0,0,.27953],109:[0,.47534,0,0,.76676],110:[0,.47534,0,0,.52666],111:[0,.47534,0,0,.48885],112:[.18906,.52396,0,0,.50046],113:[.18906,.47534,0,0,.48912],114:[0,.47534,0,0,.38919],115:[0,.47534,0,0,.44266],116:[0,.62119,0,0,.33301],117:[0,.47534,0,0,.5172],118:[0,.52396,0,0,.5118],119:[0,.52396,0,0,.77351],120:[.18906,.47534,0,0,.38865],121:[.18906,.47534,0,0,.49884],122:[.18906,.47534,0,0,.39054],8216:[0,.69141,0,0,.21471],8217:[0,.69141,0,0,.21471],58112:[0,.62119,0,0,.49749],58113:[0,.62119,0,0,.4983],58114:[.18906,.69141,0,0,.33328],58115:[.18906,.69141,0,0,.32923],58116:[.18906,.47534,0,0,.50343],58117:[0,.69141,0,0,.33301],58118:[0,.62119,0,0,.33409],58119:[0,.47534,0,0,.50073]},"Main-Bold":{33:[0,.69444,0,0,.35],34:[0,.69444,0,0,.60278],35:[.19444,.69444,0,0,.95833],36:[.05556,.75,0,0,.575],37:[.05556,.75,0,0,.95833],38:[0,.69444,0,0,.89444],39:[0,.69444,0,0,.31944],40:[.25,.75,0,0,.44722],41:[.25,.75,0,0,.44722],42:[0,.75,0,0,.575],43:[.13333,.63333,0,0,.89444],44:[.19444,.15556,0,0,.31944],45:[0,.44444,0,0,.38333],46:[0,.15556,0,0,.31944],47:[.25,.75,0,0,.575],48:[0,.64444,0,0,.575],49:[0,.64444,0,0,.575],50:[0,.64444,0,0,.575],51:[0,.64444,0,0,.575],52:[0,.64444,0,0,.575],53:[0,.64444,0,0,.575],54:[0,.64444,0,0,.575],55:[0,.64444,0,0,.575],56:[0,.64444,0,0,.575],57:[0,.64444,0,0,.575],58:[0,.44444,0,0,.31944],59:[.19444,.44444,0,0,.31944],60:[.08556,.58556,0,0,.89444],61:[-.10889,.39111,0,0,.89444],62:[.08556,.58556,0,0,.89444],63:[0,.69444,0,0,.54305],64:[0,.69444,0,0,.89444],65:[0,.68611,0,0,.86944],66:[0,.68611,0,0,.81805],67:[0,.68611,0,0,.83055],68:[0,.68611,0,0,.88194],69:[0,.68611,0,0,.75555],70:[0,.68611,0,0,.72361],71:[0,.68611,0,0,.90416],72:[0,.68611,0,0,.9],73:[0,.68611,0,0,.43611],74:[0,.68611,0,0,.59444],75:[0,.68611,0,0,.90138],76:[0,.68611,0,0,.69166],77:[0,.68611,0,0,1.09166],78:[0,.68611,0,0,.9],79:[0,.68611,0,0,.86388],80:[0,.68611,0,0,.78611],81:[.19444,.68611,0,0,.86388],82:[0,.68611,0,0,.8625],83:[0,.68611,0,0,.63889],84:[0,.68611,0,0,.8],85:[0,.68611,0,0,.88472],86:[0,.68611,.01597,0,.86944],87:[0,.68611,.01597,0,1.18888],88:[0,.68611,0,0,.86944],89:[0,.68611,.02875,0,.86944],90:[0,.68611,0,0,.70277],91:[.25,.75,0,0,.31944],92:[.25,.75,0,0,.575],93:[.25,.75,0,0,.31944],94:[0,.69444,0,0,.575],95:[.31,.13444,.03194,0,.575],97:[0,.44444,0,0,.55902],98:[0,.69444,0,0,.63889],99:[0,.44444,0,0,.51111],100:[0,.69444,0,0,.63889],101:[0,.44444,0,0,.52708],102:[0,.69444,.10903,0,.35139],103:[.19444,.44444,.01597,0,.575],104:[0,.69444,0,0,.63889],105:[0,.69444,0,0,.31944],106:[.19444,.69444,0,0,.35139],107:[0,.69444,0,0,.60694],108:[0,.69444,0,0,.31944],109:[0,.44444,0,0,.95833],110:[0,.44444,0,0,.63889],111:[0,.44444,0,0,.575],112:[.19444,.44444,0,0,.63889],113:[.19444,.44444,0,0,.60694],114:[0,.44444,0,0,.47361],115:[0,.44444,0,0,.45361],116:[0,.63492,0,0,.44722],117:[0,.44444,0,0,.63889],118:[0,.44444,.01597,0,.60694],119:[0,.44444,.01597,0,.83055],120:[0,.44444,0,0,.60694],121:[.19444,.44444,.01597,0,.60694],122:[0,.44444,0,0,.51111],123:[.25,.75,0,0,.575],124:[.25,.75,0,0,.31944],125:[.25,.75,0,0,.575],126:[.35,.34444,0,0,.575],168:[0,.69444,0,0,.575],172:[0,.44444,0,0,.76666],176:[0,.69444,0,0,.86944],177:[.13333,.63333,0,0,.89444],184:[.17014,0,0,0,.51111],198:[0,.68611,0,0,1.04166],215:[.13333,.63333,0,0,.89444],216:[.04861,.73472,0,0,.89444],223:[0,.69444,0,0,.59722],230:[0,.44444,0,0,.83055],247:[.13333,.63333,0,0,.89444],248:[.09722,.54167,0,0,.575],305:[0,.44444,0,0,.31944],338:[0,.68611,0,0,1.16944],339:[0,.44444,0,0,.89444],567:[.19444,.44444,0,0,.35139],710:[0,.69444,0,0,.575],711:[0,.63194,0,0,.575],713:[0,.59611,0,0,.575],714:[0,.69444,0,0,.575],715:[0,.69444,0,0,.575],728:[0,.69444,0,0,.575],729:[0,.69444,0,0,.31944],730:[0,.69444,0,0,.86944],732:[0,.69444,0,0,.575],733:[0,.69444,0,0,.575],824:[.19444,.69444,0,0,0],915:[0,.68611,0,0,.69166],916:[0,.68611,0,0,.95833],920:[0,.68611,0,0,.89444],923:[0,.68611,0,0,.80555],926:[0,.68611,0,0,.76666],928:[0,.68611,0,0,.9],931:[0,.68611,0,0,.83055],933:[0,.68611,0,0,.89444],934:[0,.68611,0,0,.83055],936:[0,.68611,0,0,.89444],937:[0,.68611,0,0,.83055],8211:[0,.44444,.03194,0,.575],8212:[0,.44444,.03194,0,1.14999],8216:[0,.69444,0,0,.31944],8217:[0,.69444,0,0,.31944],8220:[0,.69444,0,0,.60278],8221:[0,.69444,0,0,.60278],8224:[.19444,.69444,0,0,.51111],8225:[.19444,.69444,0,0,.51111],8242:[0,.55556,0,0,.34444],8407:[0,.72444,.15486,0,.575],8463:[0,.69444,0,0,.66759],8465:[0,.69444,0,0,.83055],8467:[0,.69444,0,0,.47361],8472:[.19444,.44444,0,0,.74027],8476:[0,.69444,0,0,.83055],8501:[0,.69444,0,0,.70277],8592:[-.10889,.39111,0,0,1.14999],8593:[.19444,.69444,0,0,.575],8594:[-.10889,.39111,0,0,1.14999],8595:[.19444,.69444,0,0,.575],8596:[-.10889,.39111,0,0,1.14999],8597:[.25,.75,0,0,.575],8598:[.19444,.69444,0,0,1.14999],8599:[.19444,.69444,0,0,1.14999],8600:[.19444,.69444,0,0,1.14999],8601:[.19444,.69444,0,0,1.14999],8636:[-.10889,.39111,0,0,1.14999],8637:[-.10889,.39111,0,0,1.14999],8640:[-.10889,.39111,0,0,1.14999],8641:[-.10889,.39111,0,0,1.14999],8656:[-.10889,.39111,0,0,1.14999],8657:[.19444,.69444,0,0,.70277],8658:[-.10889,.39111,0,0,1.14999],8659:[.19444,.69444,0,0,.70277],8660:[-.10889,.39111,0,0,1.14999],8661:[.25,.75,0,0,.70277],8704:[0,.69444,0,0,.63889],8706:[0,.69444,.06389,0,.62847],8707:[0,.69444,0,0,.63889],8709:[.05556,.75,0,0,.575],8711:[0,.68611,0,0,.95833],8712:[.08556,.58556,0,0,.76666],8715:[.08556,.58556,0,0,.76666],8722:[.13333,.63333,0,0,.89444],8723:[.13333,.63333,0,0,.89444],8725:[.25,.75,0,0,.575],8726:[.25,.75,0,0,.575],8727:[-.02778,.47222,0,0,.575],8728:[-.02639,.47361,0,0,.575],8729:[-.02639,.47361,0,0,.575],8730:[.18,.82,0,0,.95833],8733:[0,.44444,0,0,.89444],8734:[0,.44444,0,0,1.14999],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.31944],8741:[.25,.75,0,0,.575],8743:[0,.55556,0,0,.76666],8744:[0,.55556,0,0,.76666],8745:[0,.55556,0,0,.76666],8746:[0,.55556,0,0,.76666],8747:[.19444,.69444,.12778,0,.56875],8764:[-.10889,.39111,0,0,.89444],8768:[.19444,.69444,0,0,.31944],8771:[.00222,.50222,0,0,.89444],8776:[.02444,.52444,0,0,.89444],8781:[.00222,.50222,0,0,.89444],8801:[.00222,.50222,0,0,.89444],8804:[.19667,.69667,0,0,.89444],8805:[.19667,.69667,0,0,.89444],8810:[.08556,.58556,0,0,1.14999],8811:[.08556,.58556,0,0,1.14999],8826:[.08556,.58556,0,0,.89444],8827:[.08556,.58556,0,0,.89444],8834:[.08556,.58556,0,0,.89444],8835:[.08556,.58556,0,0,.89444],8838:[.19667,.69667,0,0,.89444],8839:[.19667,.69667,0,0,.89444],8846:[0,.55556,0,0,.76666],8849:[.19667,.69667,0,0,.89444],8850:[.19667,.69667,0,0,.89444],8851:[0,.55556,0,0,.76666],8852:[0,.55556,0,0,.76666],8853:[.13333,.63333,0,0,.89444],8854:[.13333,.63333,0,0,.89444],8855:[.13333,.63333,0,0,.89444],8856:[.13333,.63333,0,0,.89444],8857:[.13333,.63333,0,0,.89444],8866:[0,.69444,0,0,.70277],8867:[0,.69444,0,0,.70277],8868:[0,.69444,0,0,.89444],8869:[0,.69444,0,0,.89444],8900:[-.02639,.47361,0,0,.575],8901:[-.02639,.47361,0,0,.31944],8902:[-.02778,.47222,0,0,.575],8968:[.25,.75,0,0,.51111],8969:[.25,.75,0,0,.51111],8970:[.25,.75,0,0,.51111],8971:[.25,.75,0,0,.51111],8994:[-.13889,.36111,0,0,1.14999],8995:[-.13889,.36111,0,0,1.14999],9651:[.19444,.69444,0,0,1.02222],9657:[-.02778,.47222,0,0,.575],9661:[.19444,.69444,0,0,1.02222],9667:[-.02778,.47222,0,0,.575],9711:[.19444,.69444,0,0,1.14999],9824:[.12963,.69444,0,0,.89444],9825:[.12963,.69444,0,0,.89444],9826:[.12963,.69444,0,0,.89444],9827:[.12963,.69444,0,0,.89444],9837:[0,.75,0,0,.44722],9838:[.19444,.69444,0,0,.44722],9839:[.19444,.69444,0,0,.44722],10216:[.25,.75,0,0,.44722],10217:[.25,.75,0,0,.44722],10815:[0,.68611,0,0,.9],10927:[.19667,.69667,0,0,.89444],10928:[.19667,.69667,0,0,.89444]},"Main-BoldItalic":{33:[0,.69444,.11417,0,.38611],34:[0,.69444,.07939,0,.62055],35:[.19444,.69444,.06833,0,.94444],37:[.05556,.75,.12861,0,.94444],38:[0,.69444,.08528,0,.88555],39:[0,.69444,.12945,0,.35555],40:[.25,.75,.15806,0,.47333],41:[.25,.75,.03306,0,.47333],42:[0,.75,.14333,0,.59111],43:[.10333,.60333,.03306,0,.88555],44:[.19444,.14722,0,0,.35555],45:[0,.44444,.02611,0,.41444],46:[0,.14722,0,0,.35555],47:[.25,.75,.15806,0,.59111],48:[0,.64444,.13167,0,.59111],49:[0,.64444,.13167,0,.59111],50:[0,.64444,.13167,0,.59111],51:[0,.64444,.13167,0,.59111],52:[.19444,.64444,.13167,0,.59111],53:[0,.64444,.13167,0,.59111],54:[0,.64444,.13167,0,.59111],55:[.19444,.64444,.13167,0,.59111],56:[0,.64444,.13167,0,.59111],57:[0,.64444,.13167,0,.59111],58:[0,.44444,.06695,0,.35555],59:[.19444,.44444,.06695,0,.35555],61:[-.10889,.39111,.06833,0,.88555],63:[0,.69444,.11472,0,.59111],64:[0,.69444,.09208,0,.88555],65:[0,.68611,0,0,.86555],66:[0,.68611,.0992,0,.81666],67:[0,.68611,.14208,0,.82666],68:[0,.68611,.09062,0,.87555],69:[0,.68611,.11431,0,.75666],70:[0,.68611,.12903,0,.72722],71:[0,.68611,.07347,0,.89527],72:[0,.68611,.17208,0,.8961],73:[0,.68611,.15681,0,.47166],74:[0,.68611,.145,0,.61055],75:[0,.68611,.14208,0,.89499],76:[0,.68611,0,0,.69777],77:[0,.68611,.17208,0,1.07277],78:[0,.68611,.17208,0,.8961],79:[0,.68611,.09062,0,.85499],80:[0,.68611,.0992,0,.78721],81:[.19444,.68611,.09062,0,.85499],82:[0,.68611,.02559,0,.85944],83:[0,.68611,.11264,0,.64999],84:[0,.68611,.12903,0,.7961],85:[0,.68611,.17208,0,.88083],86:[0,.68611,.18625,0,.86555],87:[0,.68611,.18625,0,1.15999],88:[0,.68611,.15681,0,.86555],89:[0,.68611,.19803,0,.86555],90:[0,.68611,.14208,0,.70888],91:[.25,.75,.1875,0,.35611],93:[.25,.75,.09972,0,.35611],94:[0,.69444,.06709,0,.59111],95:[.31,.13444,.09811,0,.59111],97:[0,.44444,.09426,0,.59111],98:[0,.69444,.07861,0,.53222],99:[0,.44444,.05222,0,.53222],100:[0,.69444,.10861,0,.59111],101:[0,.44444,.085,0,.53222],102:[.19444,.69444,.21778,0,.4],103:[.19444,.44444,.105,0,.53222],104:[0,.69444,.09426,0,.59111],105:[0,.69326,.11387,0,.35555],106:[.19444,.69326,.1672,0,.35555],107:[0,.69444,.11111,0,.53222],108:[0,.69444,.10861,0,.29666],109:[0,.44444,.09426,0,.94444],110:[0,.44444,.09426,0,.64999],111:[0,.44444,.07861,0,.59111],112:[.19444,.44444,.07861,0,.59111],113:[.19444,.44444,.105,0,.53222],114:[0,.44444,.11111,0,.50167],115:[0,.44444,.08167,0,.48694],116:[0,.63492,.09639,0,.385],117:[0,.44444,.09426,0,.62055],118:[0,.44444,.11111,0,.53222],119:[0,.44444,.11111,0,.76777],120:[0,.44444,.12583,0,.56055],121:[.19444,.44444,.105,0,.56166],122:[0,.44444,.13889,0,.49055],126:[.35,.34444,.11472,0,.59111],163:[0,.69444,0,0,.86853],168:[0,.69444,.11473,0,.59111],176:[0,.69444,0,0,.94888],184:[.17014,0,0,0,.53222],198:[0,.68611,.11431,0,1.02277],216:[.04861,.73472,.09062,0,.88555],223:[.19444,.69444,.09736,0,.665],230:[0,.44444,.085,0,.82666],248:[.09722,.54167,.09458,0,.59111],305:[0,.44444,.09426,0,.35555],338:[0,.68611,.11431,0,1.14054],339:[0,.44444,.085,0,.82666],567:[.19444,.44444,.04611,0,.385],710:[0,.69444,.06709,0,.59111],711:[0,.63194,.08271,0,.59111],713:[0,.59444,.10444,0,.59111],714:[0,.69444,.08528,0,.59111],715:[0,.69444,0,0,.59111],728:[0,.69444,.10333,0,.59111],729:[0,.69444,.12945,0,.35555],730:[0,.69444,0,0,.94888],732:[0,.69444,.11472,0,.59111],733:[0,.69444,.11472,0,.59111],915:[0,.68611,.12903,0,.69777],916:[0,.68611,0,0,.94444],920:[0,.68611,.09062,0,.88555],923:[0,.68611,0,0,.80666],926:[0,.68611,.15092,0,.76777],928:[0,.68611,.17208,0,.8961],931:[0,.68611,.11431,0,.82666],933:[0,.68611,.10778,0,.88555],934:[0,.68611,.05632,0,.82666],936:[0,.68611,.10778,0,.88555],937:[0,.68611,.0992,0,.82666],8211:[0,.44444,.09811,0,.59111],8212:[0,.44444,.09811,0,1.18221],8216:[0,.69444,.12945,0,.35555],8217:[0,.69444,.12945,0,.35555],8220:[0,.69444,.16772,0,.62055],8221:[0,.69444,.07939,0,.62055]},"Main-Italic":{33:[0,.69444,.12417,0,.30667],34:[0,.69444,.06961,0,.51444],35:[.19444,.69444,.06616,0,.81777],37:[.05556,.75,.13639,0,.81777],38:[0,.69444,.09694,0,.76666],39:[0,.69444,.12417,0,.30667],40:[.25,.75,.16194,0,.40889],41:[.25,.75,.03694,0,.40889],42:[0,.75,.14917,0,.51111],43:[.05667,.56167,.03694,0,.76666],44:[.19444,.10556,0,0,.30667],45:[0,.43056,.02826,0,.35778],46:[0,.10556,0,0,.30667],47:[.25,.75,.16194,0,.51111],48:[0,.64444,.13556,0,.51111],49:[0,.64444,.13556,0,.51111],50:[0,.64444,.13556,0,.51111],51:[0,.64444,.13556,0,.51111],52:[.19444,.64444,.13556,0,.51111],53:[0,.64444,.13556,0,.51111],54:[0,.64444,.13556,0,.51111],55:[.19444,.64444,.13556,0,.51111],56:[0,.64444,.13556,0,.51111],57:[0,.64444,.13556,0,.51111],58:[0,.43056,.0582,0,.30667],59:[.19444,.43056,.0582,0,.30667],61:[-.13313,.36687,.06616,0,.76666],63:[0,.69444,.1225,0,.51111],64:[0,.69444,.09597,0,.76666],65:[0,.68333,0,0,.74333],66:[0,.68333,.10257,0,.70389],67:[0,.68333,.14528,0,.71555],68:[0,.68333,.09403,0,.755],69:[0,.68333,.12028,0,.67833],70:[0,.68333,.13305,0,.65277],71:[0,.68333,.08722,0,.77361],72:[0,.68333,.16389,0,.74333],73:[0,.68333,.15806,0,.38555],74:[0,.68333,.14028,0,.525],75:[0,.68333,.14528,0,.76888],76:[0,.68333,0,0,.62722],77:[0,.68333,.16389,0,.89666],78:[0,.68333,.16389,0,.74333],79:[0,.68333,.09403,0,.76666],80:[0,.68333,.10257,0,.67833],81:[.19444,.68333,.09403,0,.76666],82:[0,.68333,.03868,0,.72944],83:[0,.68333,.11972,0,.56222],84:[0,.68333,.13305,0,.71555],85:[0,.68333,.16389,0,.74333],86:[0,.68333,.18361,0,.74333],87:[0,.68333,.18361,0,.99888],88:[0,.68333,.15806,0,.74333],89:[0,.68333,.19383,0,.74333],90:[0,.68333,.14528,0,.61333],91:[.25,.75,.1875,0,.30667],93:[.25,.75,.10528,0,.30667],94:[0,.69444,.06646,0,.51111],95:[.31,.12056,.09208,0,.51111],97:[0,.43056,.07671,0,.51111],98:[0,.69444,.06312,0,.46],99:[0,.43056,.05653,0,.46],100:[0,.69444,.10333,0,.51111],101:[0,.43056,.07514,0,.46],102:[.19444,.69444,.21194,0,.30667],103:[.19444,.43056,.08847,0,.46],104:[0,.69444,.07671,0,.51111],105:[0,.65536,.1019,0,.30667],106:[.19444,.65536,.14467,0,.30667],107:[0,.69444,.10764,0,.46],108:[0,.69444,.10333,0,.25555],109:[0,.43056,.07671,0,.81777],110:[0,.43056,.07671,0,.56222],111:[0,.43056,.06312,0,.51111],112:[.19444,.43056,.06312,0,.51111],113:[.19444,.43056,.08847,0,.46],114:[0,.43056,.10764,0,.42166],115:[0,.43056,.08208,0,.40889],116:[0,.61508,.09486,0,.33222],117:[0,.43056,.07671,0,.53666],118:[0,.43056,.10764,0,.46],119:[0,.43056,.10764,0,.66444],120:[0,.43056,.12042,0,.46389],121:[.19444,.43056,.08847,0,.48555],122:[0,.43056,.12292,0,.40889],126:[.35,.31786,.11585,0,.51111],163:[0,.69444,0,0,.76909],168:[0,.66786,.10474,0,.51111],176:[0,.69444,0,0,.83129],184:[.17014,0,0,0,.46],198:[0,.68333,.12028,0,.88277],216:[.04861,.73194,.09403,0,.76666],223:[.19444,.69444,.10514,0,.53666],230:[0,.43056,.07514,0,.71555],248:[.09722,.52778,.09194,0,.51111],305:[0,.43056,0,.02778,.32246],338:[0,.68333,.12028,0,.98499],339:[0,.43056,.07514,0,.71555],567:[.19444,.43056,0,.08334,.38403],710:[0,.69444,.06646,0,.51111],711:[0,.62847,.08295,0,.51111],713:[0,.56167,.10333,0,.51111],714:[0,.69444,.09694,0,.51111],715:[0,.69444,0,0,.51111],728:[0,.69444,.10806,0,.51111],729:[0,.66786,.11752,0,.30667],730:[0,.69444,0,0,.83129],732:[0,.66786,.11585,0,.51111],733:[0,.69444,.1225,0,.51111],915:[0,.68333,.13305,0,.62722],916:[0,.68333,0,0,.81777],920:[0,.68333,.09403,0,.76666],923:[0,.68333,0,0,.69222],926:[0,.68333,.15294,0,.66444],928:[0,.68333,.16389,0,.74333],931:[0,.68333,.12028,0,.71555],933:[0,.68333,.11111,0,.76666],934:[0,.68333,.05986,0,.71555],936:[0,.68333,.11111,0,.76666],937:[0,.68333,.10257,0,.71555],8211:[0,.43056,.09208,0,.51111],8212:[0,.43056,.09208,0,1.02222],8216:[0,.69444,.12417,0,.30667],8217:[0,.69444,.12417,0,.30667],8220:[0,.69444,.1685,0,.51444],8221:[0,.69444,.06961,0,.51444],8463:[0,.68889,0,0,.54028]},"Main-Regular":{32:[0,0,0,0,.25],33:[0,.69444,0,0,.27778],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.77778],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.19444,.10556,0,0,.27778],45:[0,.43056,0,0,.33333],46:[0,.10556,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.64444,0,0,.5],49:[0,.64444,0,0,.5],50:[0,.64444,0,0,.5],51:[0,.64444,0,0,.5],52:[0,.64444,0,0,.5],53:[0,.64444,0,0,.5],54:[0,.64444,0,0,.5],55:[0,.64444,0,0,.5],56:[0,.64444,0,0,.5],57:[0,.64444,0,0,.5],58:[0,.43056,0,0,.27778],59:[.19444,.43056,0,0,.27778],60:[.0391,.5391,0,0,.77778],61:[-.13313,.36687,0,0,.77778],62:[.0391,.5391,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.77778],65:[0,.68333,0,0,.75],66:[0,.68333,0,0,.70834],67:[0,.68333,0,0,.72222],68:[0,.68333,0,0,.76389],69:[0,.68333,0,0,.68056],70:[0,.68333,0,0,.65278],71:[0,.68333,0,0,.78472],72:[0,.68333,0,0,.75],73:[0,.68333,0,0,.36111],74:[0,.68333,0,0,.51389],75:[0,.68333,0,0,.77778],76:[0,.68333,0,0,.625],77:[0,.68333,0,0,.91667],78:[0,.68333,0,0,.75],79:[0,.68333,0,0,.77778],80:[0,.68333,0,0,.68056],81:[.19444,.68333,0,0,.77778],82:[0,.68333,0,0,.73611],83:[0,.68333,0,0,.55556],84:[0,.68333,0,0,.72222],85:[0,.68333,0,0,.75],86:[0,.68333,.01389,0,.75],87:[0,.68333,.01389,0,1.02778],88:[0,.68333,0,0,.75],89:[0,.68333,.025,0,.75],90:[0,.68333,0,0,.61111],91:[.25,.75,0,0,.27778],92:[.25,.75,0,0,.5],93:[.25,.75,0,0,.27778],94:[0,.69444,0,0,.5],95:[.31,.12056,.02778,0,.5],97:[0,.43056,0,0,.5],98:[0,.69444,0,0,.55556],99:[0,.43056,0,0,.44445],100:[0,.69444,0,0,.55556],101:[0,.43056,0,0,.44445],102:[0,.69444,.07778,0,.30556],103:[.19444,.43056,.01389,0,.5],104:[0,.69444,0,0,.55556],105:[0,.66786,0,0,.27778],106:[.19444,.66786,0,0,.30556],107:[0,.69444,0,0,.52778],108:[0,.69444,0,0,.27778],109:[0,.43056,0,0,.83334],110:[0,.43056,0,0,.55556],111:[0,.43056,0,0,.5],112:[.19444,.43056,0,0,.55556],113:[.19444,.43056,0,0,.52778],114:[0,.43056,0,0,.39167],115:[0,.43056,0,0,.39445],116:[0,.61508,0,0,.38889],117:[0,.43056,0,0,.55556],118:[0,.43056,.01389,0,.52778],119:[0,.43056,.01389,0,.72222],120:[0,.43056,0,0,.52778],121:[.19444,.43056,.01389,0,.52778],122:[0,.43056,0,0,.44445],123:[.25,.75,0,0,.5],124:[.25,.75,0,0,.27778],125:[.25,.75,0,0,.5],126:[.35,.31786,0,0,.5],160:[0,0,0,0,.25],167:[.19444,.69444,0,0,.44445],168:[0,.66786,0,0,.5],172:[0,.43056,0,0,.66667],176:[0,.69444,0,0,.75],177:[.08333,.58333,0,0,.77778],182:[.19444,.69444,0,0,.61111],184:[.17014,0,0,0,.44445],198:[0,.68333,0,0,.90278],215:[.08333,.58333,0,0,.77778],216:[.04861,.73194,0,0,.77778],223:[0,.69444,0,0,.5],230:[0,.43056,0,0,.72222],247:[.08333,.58333,0,0,.77778],248:[.09722,.52778,0,0,.5],305:[0,.43056,0,0,.27778],338:[0,.68333,0,0,1.01389],339:[0,.43056,0,0,.77778],567:[.19444,.43056,0,0,.30556],710:[0,.69444,0,0,.5],711:[0,.62847,0,0,.5],713:[0,.56778,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.66786,0,0,.27778],730:[0,.69444,0,0,.75],732:[0,.66786,0,0,.5],733:[0,.69444,0,0,.5],824:[.19444,.69444,0,0,0],915:[0,.68333,0,0,.625],916:[0,.68333,0,0,.83334],920:[0,.68333,0,0,.77778],923:[0,.68333,0,0,.69445],926:[0,.68333,0,0,.66667],928:[0,.68333,0,0,.75],931:[0,.68333,0,0,.72222],933:[0,.68333,0,0,.77778],934:[0,.68333,0,0,.72222],936:[0,.68333,0,0,.77778],937:[0,.68333,0,0,.72222],8211:[0,.43056,.02778,0,.5],8212:[0,.43056,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5],8224:[.19444,.69444,0,0,.44445],8225:[.19444,.69444,0,0,.44445],8230:[0,.12,0,0,1.172],8242:[0,.55556,0,0,.275],8407:[0,.71444,.15382,0,.5],8463:[0,.68889,0,0,.54028],8465:[0,.69444,0,0,.72222],8467:[0,.69444,0,.11111,.41667],8472:[.19444,.43056,0,.11111,.63646],8476:[0,.69444,0,0,.72222],8501:[0,.69444,0,0,.61111],8592:[-.13313,.36687,0,0,1],8593:[.19444,.69444,0,0,.5],8594:[-.13313,.36687,0,0,1],8595:[.19444,.69444,0,0,.5],8596:[-.13313,.36687,0,0,1],8597:[.25,.75,0,0,.5],8598:[.19444,.69444,0,0,1],8599:[.19444,.69444,0,0,1],8600:[.19444,.69444,0,0,1],8601:[.19444,.69444,0,0,1],8614:[.011,.511,0,0,1],8617:[.011,.511,0,0,1.126],8618:[.011,.511,0,0,1.126],8636:[-.13313,.36687,0,0,1],8637:[-.13313,.36687,0,0,1],8640:[-.13313,.36687,0,0,1],8641:[-.13313,.36687,0,0,1],8652:[.011,.671,0,0,1],8656:[-.13313,.36687,0,0,1],8657:[.19444,.69444,0,0,.61111],8658:[-.13313,.36687,0,0,1],8659:[.19444,.69444,0,0,.61111],8660:[-.13313,.36687,0,0,1],8661:[.25,.75,0,0,.61111],8704:[0,.69444,0,0,.55556],8706:[0,.69444,.05556,.08334,.5309],8707:[0,.69444,0,0,.55556],8709:[.05556,.75,0,0,.5],8711:[0,.68333,0,0,.83334],8712:[.0391,.5391,0,0,.66667],8715:[.0391,.5391,0,0,.66667],8722:[.08333,.58333,0,0,.77778],8723:[.08333,.58333,0,0,.77778],8725:[.25,.75,0,0,.5],8726:[.25,.75,0,0,.5],8727:[-.03472,.46528,0,0,.5],8728:[-.05555,.44445,0,0,.5],8729:[-.05555,.44445,0,0,.5],8730:[.2,.8,0,0,.83334],8733:[0,.43056,0,0,.77778],8734:[0,.43056,0,0,1],8736:[0,.69224,0,0,.72222],8739:[.25,.75,0,0,.27778],8741:[.25,.75,0,0,.5],8743:[0,.55556,0,0,.66667],8744:[0,.55556,0,0,.66667],8745:[0,.55556,0,0,.66667],8746:[0,.55556,0,0,.66667],8747:[.19444,.69444,.11111,0,.41667],8764:[-.13313,.36687,0,0,.77778],8768:[.19444,.69444,0,0,.27778],8771:[-.03625,.46375,0,0,.77778],8773:[-.022,.589,0,0,1],8776:[-.01688,.48312,0,0,.77778],8781:[-.03625,.46375,0,0,.77778],8784:[-.133,.67,0,0,.778],8800:[.215,.716,0,0,.778],8801:[-.03625,.46375,0,0,.77778],8804:[.13597,.63597,0,0,.77778],8805:[.13597,.63597,0,0,.77778],8810:[.0391,.5391,0,0,1],8811:[.0391,.5391,0,0,1],8826:[.0391,.5391,0,0,.77778],8827:[.0391,.5391,0,0,.77778],8834:[.0391,.5391,0,0,.77778],8835:[.0391,.5391,0,0,.77778],8838:[.13597,.63597,0,0,.77778],8839:[.13597,.63597,0,0,.77778],8846:[0,.55556,0,0,.66667],8849:[.13597,.63597,0,0,.77778],8850:[.13597,.63597,0,0,.77778],8851:[0,.55556,0,0,.66667],8852:[0,.55556,0,0,.66667],8853:[.08333,.58333,0,0,.77778],8854:[.08333,.58333,0,0,.77778],8855:[.08333,.58333,0,0,.77778],8856:[.08333,.58333,0,0,.77778],8857:[.08333,.58333,0,0,.77778],8866:[0,.69444,0,0,.61111],8867:[0,.69444,0,0,.61111],8868:[0,.69444,0,0,.77778],8869:[0,.69444,0,0,.77778],8872:[.249,.75,0,0,.867],8900:[-.05555,.44445,0,0,.5],8901:[-.05555,.44445,0,0,.27778],8902:[-.03472,.46528,0,0,.5],8904:[.005,.505,0,0,.9],8942:[.03,.9,0,0,.278],8943:[-.19,.31,0,0,1.172],8945:[-.1,.82,0,0,1.282],8968:[.25,.75,0,0,.44445],8969:[.25,.75,0,0,.44445],8970:[.25,.75,0,0,.44445],8971:[.25,.75,0,0,.44445],8994:[-.14236,.35764,0,0,1],8995:[-.14236,.35764,0,0,1],9136:[.244,.744,0,0,.412],9137:[.244,.744,0,0,.412],9651:[.19444,.69444,0,0,.88889],9657:[-.03472,.46528,0,0,.5],9661:[.19444,.69444,0,0,.88889],9667:[-.03472,.46528,0,0,.5],9711:[.19444,.69444,0,0,1],9824:[.12963,.69444,0,0,.77778],9825:[.12963,.69444,0,0,.77778],9826:[.12963,.69444,0,0,.77778],9827:[.12963,.69444,0,0,.77778],9837:[0,.75,0,0,.38889],9838:[.19444,.69444,0,0,.38889],9839:[.19444,.69444,0,0,.38889],10216:[.25,.75,0,0,.38889],10217:[.25,.75,0,0,.38889],10222:[.244,.744,0,0,.412],10223:[.244,.744,0,0,.412],10229:[.011,.511,0,0,1.609],10230:[.011,.511,0,0,1.638],10231:[.011,.511,0,0,1.859],10232:[.024,.525,0,0,1.609],10233:[.024,.525,0,0,1.638],10234:[.024,.525,0,0,1.858],10236:[.011,.511,0,0,1.638],10815:[0,.68333,0,0,.75],10927:[.13597,.63597,0,0,.77778],10928:[.13597,.63597,0,0,.77778]},"Math-BoldItalic":{47:[.19444,.69444,0,0,0],65:[0,.68611,0,0,.86944],66:[0,.68611,.04835,0,.8664],67:[0,.68611,.06979,0,.81694],68:[0,.68611,.03194,0,.93812],69:[0,.68611,.05451,0,.81007],70:[0,.68611,.15972,0,.68889],71:[0,.68611,0,0,.88673],72:[0,.68611,.08229,0,.98229],73:[0,.68611,.07778,0,.51111],74:[0,.68611,.10069,0,.63125],75:[0,.68611,.06979,0,.97118],76:[0,.68611,0,0,.75555],77:[0,.68611,.11424,0,1.14201],78:[0,.68611,.11424,0,.95034],79:[0,.68611,.03194,0,.83666],80:[0,.68611,.15972,0,.72309],81:[.19444,.68611,0,0,.86861],82:[0,.68611,.00421,0,.87235],83:[0,.68611,.05382,0,.69271],84:[0,.68611,.15972,0,.63663],85:[0,.68611,.11424,0,.80027],86:[0,.68611,.25555,0,.67778],87:[0,.68611,.15972,0,1.09305],88:[0,.68611,.07778,0,.94722],89:[0,.68611,.25555,0,.67458],90:[0,.68611,.06979,0,.77257],97:[0,.44444,0,0,.63287],98:[0,.69444,0,0,.52083],99:[0,.44444,0,0,.51342],100:[0,.69444,0,0,.60972],101:[0,.44444,0,0,.55361],102:[.19444,.69444,.11042,0,.56806],103:[.19444,.44444,.03704,0,.5449],104:[0,.69444,0,0,.66759],105:[0,.69326,0,0,.4048],106:[.19444,.69326,.0622,0,.47083],107:[0,.69444,.01852,0,.6037],108:[0,.69444,.0088,0,.34815],109:[0,.44444,0,0,1.0324],110:[0,.44444,0,0,.71296],111:[0,.44444,0,0,.58472],112:[.19444,.44444,0,0,.60092],113:[.19444,.44444,.03704,0,.54213],114:[0,.44444,.03194,0,.5287],115:[0,.44444,0,0,.53125],116:[0,.63492,0,0,.41528],117:[0,.44444,0,0,.68102],118:[0,.44444,.03704,0,.56666],119:[0,.44444,.02778,0,.83148],120:[0,.44444,0,0,.65903],121:[.19444,.44444,.03704,0,.59028],122:[0,.44444,.04213,0,.55509],915:[0,.68611,.15972,0,.65694],916:[0,.68611,0,0,.95833],920:[0,.68611,.03194,0,.86722],923:[0,.68611,0,0,.80555],926:[0,.68611,.07458,0,.84125],928:[0,.68611,.08229,0,.98229],931:[0,.68611,.05451,0,.88507],933:[0,.68611,.15972,0,.67083],934:[0,.68611,0,0,.76666],936:[0,.68611,.11653,0,.71402],937:[0,.68611,.04835,0,.8789],945:[0,.44444,0,0,.76064],946:[.19444,.69444,.03403,0,.65972],947:[.19444,.44444,.06389,0,.59003],948:[0,.69444,.03819,0,.52222],949:[0,.44444,0,0,.52882],950:[.19444,.69444,.06215,0,.50833],951:[.19444,.44444,.03704,0,.6],952:[0,.69444,.03194,0,.5618],953:[0,.44444,0,0,.41204],954:[0,.44444,0,0,.66759],955:[0,.69444,0,0,.67083],956:[.19444,.44444,0,0,.70787],957:[0,.44444,.06898,0,.57685],958:[.19444,.69444,.03021,0,.50833],959:[0,.44444,0,0,.58472],960:[0,.44444,.03704,0,.68241],961:[.19444,.44444,0,0,.6118],962:[.09722,.44444,.07917,0,.42361],963:[0,.44444,.03704,0,.68588],964:[0,.44444,.13472,0,.52083],965:[0,.44444,.03704,0,.63055],966:[.19444,.44444,0,0,.74722],967:[.19444,.44444,0,0,.71805],968:[.19444,.69444,.03704,0,.75833],969:[0,.44444,.03704,0,.71782],977:[0,.69444,0,0,.69155],981:[.19444,.69444,0,0,.7125],982:[0,.44444,.03194,0,.975],1009:[.19444,.44444,0,0,.6118],1013:[0,.44444,0,0,.48333]},"Math-Italic":{47:[.19444,.69444,0,0,0],65:[0,.68333,0,.13889,.75],66:[0,.68333,.05017,.08334,.75851],67:[0,.68333,.07153,.08334,.71472],68:[0,.68333,.02778,.05556,.82792],69:[0,.68333,.05764,.08334,.7382],70:[0,.68333,.13889,.08334,.64306],71:[0,.68333,0,.08334,.78625],72:[0,.68333,.08125,.05556,.83125],73:[0,.68333,.07847,.11111,.43958],74:[0,.68333,.09618,.16667,.55451],75:[0,.68333,.07153,.05556,.84931],76:[0,.68333,0,.02778,.68056],77:[0,.68333,.10903,.08334,.97014],78:[0,.68333,.10903,.08334,.80347],79:[0,.68333,.02778,.08334,.76278],80:[0,.68333,.13889,.08334,.64201],81:[.19444,.68333,0,.08334,.79056],82:[0,.68333,.00773,.08334,.75929],83:[0,.68333,.05764,.08334,.6132],84:[0,.68333,.13889,.08334,.58438],85:[0,.68333,.10903,.02778,.68278],86:[0,.68333,.22222,0,.58333],87:[0,.68333,.13889,0,.94445],88:[0,.68333,.07847,.08334,.82847],89:[0,.68333,.22222,0,.58056],90:[0,.68333,.07153,.08334,.68264],97:[0,.43056,0,0,.52859],98:[0,.69444,0,0,.42917],99:[0,.43056,0,.05556,.43276],100:[0,.69444,0,.16667,.52049],101:[0,.43056,0,.05556,.46563],102:[.19444,.69444,.10764,.16667,.48959],103:[.19444,.43056,.03588,.02778,.47697],104:[0,.69444,0,0,.57616],105:[0,.65952,0,0,.34451],106:[.19444,.65952,.05724,0,.41181],107:[0,.69444,.03148,0,.5206],108:[0,.69444,.01968,.08334,.29838],109:[0,.43056,0,0,.87801],110:[0,.43056,0,0,.60023],111:[0,.43056,0,.05556,.48472],112:[.19444,.43056,0,.08334,.50313],113:[.19444,.43056,.03588,.08334,.44641],114:[0,.43056,.02778,.05556,.45116],115:[0,.43056,0,.05556,.46875],116:[0,.61508,0,.08334,.36111],117:[0,.43056,0,.02778,.57246],118:[0,.43056,.03588,.02778,.48472],119:[0,.43056,.02691,.08334,.71592],120:[0,.43056,0,.02778,.57153],121:[.19444,.43056,.03588,.05556,.49028],122:[0,.43056,.04398,.05556,.46505],915:[0,.68333,.13889,.08334,.61528],916:[0,.68333,0,.16667,.83334],920:[0,.68333,.02778,.08334,.76278],923:[0,.68333,0,.16667,.69445],926:[0,.68333,.07569,.08334,.74236],928:[0,.68333,.08125,.05556,.83125],931:[0,.68333,.05764,.08334,.77986],933:[0,.68333,.13889,.05556,.58333],934:[0,.68333,0,.08334,.66667],936:[0,.68333,.11,.05556,.61222],937:[0,.68333,.05017,.08334,.7724],945:[0,.43056,.0037,.02778,.6397],946:[.19444,.69444,.05278,.08334,.56563],947:[.19444,.43056,.05556,0,.51773],948:[0,.69444,.03785,.05556,.44444],949:[0,.43056,0,.08334,.46632],950:[.19444,.69444,.07378,.08334,.4375],951:[.19444,.43056,.03588,.05556,.49653],952:[0,.69444,.02778,.08334,.46944],953:[0,.43056,0,.05556,.35394],954:[0,.43056,0,0,.57616],955:[0,.69444,0,0,.58334],956:[.19444,.43056,0,.02778,.60255],957:[0,.43056,.06366,.02778,.49398],958:[.19444,.69444,.04601,.11111,.4375],959:[0,.43056,0,.05556,.48472],960:[0,.43056,.03588,0,.57003],961:[.19444,.43056,0,.08334,.51702],962:[.09722,.43056,.07986,.08334,.36285],963:[0,.43056,.03588,0,.57141],964:[0,.43056,.1132,.02778,.43715],965:[0,.43056,.03588,.02778,.54028],966:[.19444,.43056,0,.08334,.65417],967:[.19444,.43056,0,.05556,.62569],968:[.19444,.69444,.03588,.11111,.65139],969:[0,.43056,.03588,0,.62245],977:[0,.69444,0,.08334,.59144],981:[.19444,.69444,0,.08334,.59583],982:[0,.43056,.02778,0,.82813],1009:[.19444,.43056,0,.08334,.51702],1013:[0,.43056,0,.05556,.4059]},"Math-Regular":{65:[0,.68333,0,.13889,.75],66:[0,.68333,.05017,.08334,.75851],67:[0,.68333,.07153,.08334,.71472],68:[0,.68333,.02778,.05556,.82792],69:[0,.68333,.05764,.08334,.7382],70:[0,.68333,.13889,.08334,.64306],71:[0,.68333,0,.08334,.78625],72:[0,.68333,.08125,.05556,.83125],73:[0,.68333,.07847,.11111,.43958],74:[0,.68333,.09618,.16667,.55451],75:[0,.68333,.07153,.05556,.84931],76:[0,.68333,0,.02778,.68056],77:[0,.68333,.10903,.08334,.97014],78:[0,.68333,.10903,.08334,.80347],79:[0,.68333,.02778,.08334,.76278],80:[0,.68333,.13889,.08334,.64201],81:[.19444,.68333,0,.08334,.79056],82:[0,.68333,.00773,.08334,.75929],83:[0,.68333,.05764,.08334,.6132],84:[0,.68333,.13889,.08334,.58438],85:[0,.68333,.10903,.02778,.68278],86:[0,.68333,.22222,0,.58333],87:[0,.68333,.13889,0,.94445],88:[0,.68333,.07847,.08334,.82847],89:[0,.68333,.22222,0,.58056],90:[0,.68333,.07153,.08334,.68264],97:[0,.43056,0,0,.52859],98:[0,.69444,0,0,.42917],99:[0,.43056,0,.05556,.43276],100:[0,.69444,0,.16667,.52049],101:[0,.43056,0,.05556,.46563],102:[.19444,.69444,.10764,.16667,.48959],103:[.19444,.43056,.03588,.02778,.47697],104:[0,.69444,0,0,.57616],105:[0,.65952,0,0,.34451],106:[.19444,.65952,.05724,0,.41181],107:[0,.69444,.03148,0,.5206],108:[0,.69444,.01968,.08334,.29838],109:[0,.43056,0,0,.87801],110:[0,.43056,0,0,.60023],111:[0,.43056,0,.05556,.48472],112:[.19444,.43056,0,.08334,.50313],113:[.19444,.43056,.03588,.08334,.44641],114:[0,.43056,.02778,.05556,.45116],115:[0,.43056,0,.05556,.46875],116:[0,.61508,0,.08334,.36111],117:[0,.43056,0,.02778,.57246],118:[0,.43056,.03588,.02778,.48472],119:[0,.43056,.02691,.08334,.71592],120:[0,.43056,0,.02778,.57153],121:[.19444,.43056,.03588,.05556,.49028],122:[0,.43056,.04398,.05556,.46505],915:[0,.68333,.13889,.08334,.61528],916:[0,.68333,0,.16667,.83334],920:[0,.68333,.02778,.08334,.76278],923:[0,.68333,0,.16667,.69445],926:[0,.68333,.07569,.08334,.74236],928:[0,.68333,.08125,.05556,.83125],931:[0,.68333,.05764,.08334,.77986],933:[0,.68333,.13889,.05556,.58333],934:[0,.68333,0,.08334,.66667],936:[0,.68333,.11,.05556,.61222],937:[0,.68333,.05017,.08334,.7724],945:[0,.43056,.0037,.02778,.6397],946:[.19444,.69444,.05278,.08334,.56563],947:[.19444,.43056,.05556,0,.51773],948:[0,.69444,.03785,.05556,.44444],949:[0,.43056,0,.08334,.46632],950:[.19444,.69444,.07378,.08334,.4375],951:[.19444,.43056,.03588,.05556,.49653],952:[0,.69444,.02778,.08334,.46944],953:[0,.43056,0,.05556,.35394],954:[0,.43056,0,0,.57616],955:[0,.69444,0,0,.58334],956:[.19444,.43056,0,.02778,.60255],957:[0,.43056,.06366,.02778,.49398],958:[.19444,.69444,.04601,.11111,.4375],959:[0,.43056,0,.05556,.48472],960:[0,.43056,.03588,0,.57003],961:[.19444,.43056,0,.08334,.51702],962:[.09722,.43056,.07986,.08334,.36285],963:[0,.43056,.03588,0,.57141],964:[0,.43056,.1132,.02778,.43715],965:[0,.43056,.03588,.02778,.54028],966:[.19444,.43056,0,.08334,.65417],967:[.19444,.43056,0,.05556,.62569],968:[.19444,.69444,.03588,.11111,.65139],969:[0,.43056,.03588,0,.62245],977:[0,.69444,0,.08334,.59144],981:[.19444,.69444,0,.08334,.59583],982:[0,.43056,.02778,0,.82813],1009:[.19444,.43056,0,.08334,.51702],1013:[0,.43056,0,.05556,.4059]},"SansSerif-Bold":{33:[0,.69444,0,0,.36667],34:[0,.69444,0,0,.55834],35:[.19444,.69444,0,0,.91667],36:[.05556,.75,0,0,.55],37:[.05556,.75,0,0,1.02912],38:[0,.69444,0,0,.83056],39:[0,.69444,0,0,.30556],40:[.25,.75,0,0,.42778],41:[.25,.75,0,0,.42778],42:[0,.75,0,0,.55],43:[.11667,.61667,0,0,.85556],44:[.10556,.13056,0,0,.30556],45:[0,.45833,0,0,.36667],46:[0,.13056,0,0,.30556],47:[.25,.75,0,0,.55],48:[0,.69444,0,0,.55],49:[0,.69444,0,0,.55],50:[0,.69444,0,0,.55],51:[0,.69444,0,0,.55],52:[0,.69444,0,0,.55],53:[0,.69444,0,0,.55],54:[0,.69444,0,0,.55],55:[0,.69444,0,0,.55],56:[0,.69444,0,0,.55],57:[0,.69444,0,0,.55],58:[0,.45833,0,0,.30556],59:[.10556,.45833,0,0,.30556],61:[-.09375,.40625,0,0,.85556],63:[0,.69444,0,0,.51945],64:[0,.69444,0,0,.73334],65:[0,.69444,0,0,.73334],66:[0,.69444,0,0,.73334],67:[0,.69444,0,0,.70278],68:[0,.69444,0,0,.79445],69:[0,.69444,0,0,.64167],70:[0,.69444,0,0,.61111],71:[0,.69444,0,0,.73334],72:[0,.69444,0,0,.79445],73:[0,.69444,0,0,.33056],74:[0,.69444,0,0,.51945],75:[0,.69444,0,0,.76389],76:[0,.69444,0,0,.58056],77:[0,.69444,0,0,.97778],78:[0,.69444,0,0,.79445],79:[0,.69444,0,0,.79445],80:[0,.69444,0,0,.70278],81:[.10556,.69444,0,0,.79445],82:[0,.69444,0,0,.70278],83:[0,.69444,0,0,.61111],84:[0,.69444,0,0,.73334],85:[0,.69444,0,0,.76389],86:[0,.69444,.01528,0,.73334],87:[0,.69444,.01528,0,1.03889],88:[0,.69444,0,0,.73334],89:[0,.69444,.0275,0,.73334],90:[0,.69444,0,0,.67223],91:[.25,.75,0,0,.34306],93:[.25,.75,0,0,.34306],94:[0,.69444,0,0,.55],95:[.35,.10833,.03056,0,.55],97:[0,.45833,0,0,.525],98:[0,.69444,0,0,.56111],99:[0,.45833,0,0,.48889],100:[0,.69444,0,0,.56111],101:[0,.45833,0,0,.51111],102:[0,.69444,.07639,0,.33611],103:[.19444,.45833,.01528,0,.55],104:[0,.69444,0,0,.56111],105:[0,.69444,0,0,.25556],106:[.19444,.69444,0,0,.28611],107:[0,.69444,0,0,.53056],108:[0,.69444,0,0,.25556],109:[0,.45833,0,0,.86667],110:[0,.45833,0,0,.56111],111:[0,.45833,0,0,.55],112:[.19444,.45833,0,0,.56111],113:[.19444,.45833,0,0,.56111],114:[0,.45833,.01528,0,.37222],115:[0,.45833,0,0,.42167],116:[0,.58929,0,0,.40417],117:[0,.45833,0,0,.56111],118:[0,.45833,.01528,0,.5],119:[0,.45833,.01528,0,.74445],120:[0,.45833,0,0,.5],121:[.19444,.45833,.01528,0,.5],122:[0,.45833,0,0,.47639],126:[.35,.34444,0,0,.55],168:[0,.69444,0,0,.55],176:[0,.69444,0,0,.73334],180:[0,.69444,0,0,.55],184:[.17014,0,0,0,.48889],305:[0,.45833,0,0,.25556],567:[.19444,.45833,0,0,.28611],710:[0,.69444,0,0,.55],711:[0,.63542,0,0,.55],713:[0,.63778,0,0,.55],728:[0,.69444,0,0,.55],729:[0,.69444,0,0,.30556],730:[0,.69444,0,0,.73334],732:[0,.69444,0,0,.55],733:[0,.69444,0,0,.55],915:[0,.69444,0,0,.58056],916:[0,.69444,0,0,.91667],920:[0,.69444,0,0,.85556],923:[0,.69444,0,0,.67223],926:[0,.69444,0,0,.73334],928:[0,.69444,0,0,.79445],931:[0,.69444,0,0,.79445],933:[0,.69444,0,0,.85556],934:[0,.69444,0,0,.79445],936:[0,.69444,0,0,.85556],937:[0,.69444,0,0,.79445],8211:[0,.45833,.03056,0,.55],8212:[0,.45833,.03056,0,1.10001],8216:[0,.69444,0,0,.30556],8217:[0,.69444,0,0,.30556],8220:[0,.69444,0,0,.55834],8221:[0,.69444,0,0,.55834]},"SansSerif-Italic":{33:[0,.69444,.05733,0,.31945],34:[0,.69444,.00316,0,.5],35:[.19444,.69444,.05087,0,.83334],36:[.05556,.75,.11156,0,.5],37:[.05556,.75,.03126,0,.83334],38:[0,.69444,.03058,0,.75834],39:[0,.69444,.07816,0,.27778],40:[.25,.75,.13164,0,.38889],41:[.25,.75,.02536,0,.38889],42:[0,.75,.11775,0,.5],43:[.08333,.58333,.02536,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,.01946,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,.13164,0,.5],48:[0,.65556,.11156,0,.5],49:[0,.65556,.11156,0,.5],50:[0,.65556,.11156,0,.5],51:[0,.65556,.11156,0,.5],52:[0,.65556,.11156,0,.5],53:[0,.65556,.11156,0,.5],54:[0,.65556,.11156,0,.5],55:[0,.65556,.11156,0,.5],56:[0,.65556,.11156,0,.5],57:[0,.65556,.11156,0,.5],58:[0,.44444,.02502,0,.27778],59:[.125,.44444,.02502,0,.27778],61:[-.13,.37,.05087,0,.77778],63:[0,.69444,.11809,0,.47222],64:[0,.69444,.07555,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,.08293,0,.66667],67:[0,.69444,.11983,0,.63889],68:[0,.69444,.07555,0,.72223],69:[0,.69444,.11983,0,.59722],70:[0,.69444,.13372,0,.56945],71:[0,.69444,.11983,0,.66667],72:[0,.69444,.08094,0,.70834],73:[0,.69444,.13372,0,.27778],74:[0,.69444,.08094,0,.47222],75:[0,.69444,.11983,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,.08094,0,.875],78:[0,.69444,.08094,0,.70834],79:[0,.69444,.07555,0,.73611],80:[0,.69444,.08293,0,.63889],81:[.125,.69444,.07555,0,.73611],82:[0,.69444,.08293,0,.64584],83:[0,.69444,.09205,0,.55556],84:[0,.69444,.13372,0,.68056],85:[0,.69444,.08094,0,.6875],86:[0,.69444,.1615,0,.66667],87:[0,.69444,.1615,0,.94445],88:[0,.69444,.13372,0,.66667],89:[0,.69444,.17261,0,.66667],90:[0,.69444,.11983,0,.61111],91:[.25,.75,.15942,0,.28889],93:[.25,.75,.08719,0,.28889],94:[0,.69444,.0799,0,.5],95:[.35,.09444,.08616,0,.5],97:[0,.44444,.00981,0,.48056],98:[0,.69444,.03057,0,.51667],99:[0,.44444,.08336,0,.44445],100:[0,.69444,.09483,0,.51667],101:[0,.44444,.06778,0,.44445],102:[0,.69444,.21705,0,.30556],103:[.19444,.44444,.10836,0,.5],104:[0,.69444,.01778,0,.51667],105:[0,.67937,.09718,0,.23889],106:[.19444,.67937,.09162,0,.26667],107:[0,.69444,.08336,0,.48889],108:[0,.69444,.09483,0,.23889],109:[0,.44444,.01778,0,.79445],110:[0,.44444,.01778,0,.51667],111:[0,.44444,.06613,0,.5],112:[.19444,.44444,.0389,0,.51667],113:[.19444,.44444,.04169,0,.51667],114:[0,.44444,.10836,0,.34167],115:[0,.44444,.0778,0,.38333],116:[0,.57143,.07225,0,.36111],117:[0,.44444,.04169,0,.51667],118:[0,.44444,.10836,0,.46111],119:[0,.44444,.10836,0,.68334],120:[0,.44444,.09169,0,.46111],121:[.19444,.44444,.10836,0,.46111],122:[0,.44444,.08752,0,.43472],126:[.35,.32659,.08826,0,.5],168:[0,.67937,.06385,0,.5],176:[0,.69444,0,0,.73752],184:[.17014,0,0,0,.44445],305:[0,.44444,.04169,0,.23889],567:[.19444,.44444,.04169,0,.26667],710:[0,.69444,.0799,0,.5],711:[0,.63194,.08432,0,.5],713:[0,.60889,.08776,0,.5],714:[0,.69444,.09205,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,.09483,0,.5],729:[0,.67937,.07774,0,.27778],730:[0,.69444,0,0,.73752],732:[0,.67659,.08826,0,.5],733:[0,.69444,.09205,0,.5],915:[0,.69444,.13372,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,.07555,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,.12816,0,.66667],928:[0,.69444,.08094,0,.70834],931:[0,.69444,.11983,0,.72222],933:[0,.69444,.09031,0,.77778],934:[0,.69444,.04603,0,.72222],936:[0,.69444,.09031,0,.77778],937:[0,.69444,.08293,0,.72222],8211:[0,.44444,.08616,0,.5],8212:[0,.44444,.08616,0,1],8216:[0,.69444,.07816,0,.27778],8217:[0,.69444,.07816,0,.27778],8220:[0,.69444,.14205,0,.5],8221:[0,.69444,.00316,0,.5]},"SansSerif-Regular":{33:[0,.69444,0,0,.31945],34:[0,.69444,0,0,.5],35:[.19444,.69444,0,0,.83334],36:[.05556,.75,0,0,.5],37:[.05556,.75,0,0,.83334],38:[0,.69444,0,0,.75834],39:[0,.69444,0,0,.27778],40:[.25,.75,0,0,.38889],41:[.25,.75,0,0,.38889],42:[0,.75,0,0,.5],43:[.08333,.58333,0,0,.77778],44:[.125,.08333,0,0,.27778],45:[0,.44444,0,0,.33333],46:[0,.08333,0,0,.27778],47:[.25,.75,0,0,.5],48:[0,.65556,0,0,.5],49:[0,.65556,0,0,.5],50:[0,.65556,0,0,.5],51:[0,.65556,0,0,.5],52:[0,.65556,0,0,.5],53:[0,.65556,0,0,.5],54:[0,.65556,0,0,.5],55:[0,.65556,0,0,.5],56:[0,.65556,0,0,.5],57:[0,.65556,0,0,.5],58:[0,.44444,0,0,.27778],59:[.125,.44444,0,0,.27778],61:[-.13,.37,0,0,.77778],63:[0,.69444,0,0,.47222],64:[0,.69444,0,0,.66667],65:[0,.69444,0,0,.66667],66:[0,.69444,0,0,.66667],67:[0,.69444,0,0,.63889],68:[0,.69444,0,0,.72223],69:[0,.69444,0,0,.59722],70:[0,.69444,0,0,.56945],71:[0,.69444,0,0,.66667],72:[0,.69444,0,0,.70834],73:[0,.69444,0,0,.27778],74:[0,.69444,0,0,.47222],75:[0,.69444,0,0,.69445],76:[0,.69444,0,0,.54167],77:[0,.69444,0,0,.875],78:[0,.69444,0,0,.70834],79:[0,.69444,0,0,.73611],80:[0,.69444,0,0,.63889],81:[.125,.69444,0,0,.73611],82:[0,.69444,0,0,.64584],83:[0,.69444,0,0,.55556],84:[0,.69444,0,0,.68056],85:[0,.69444,0,0,.6875],86:[0,.69444,.01389,0,.66667],87:[0,.69444,.01389,0,.94445],88:[0,.69444,0,0,.66667],89:[0,.69444,.025,0,.66667],90:[0,.69444,0,0,.61111],91:[.25,.75,0,0,.28889],93:[.25,.75,0,0,.28889],94:[0,.69444,0,0,.5],95:[.35,.09444,.02778,0,.5],97:[0,.44444,0,0,.48056],98:[0,.69444,0,0,.51667],99:[0,.44444,0,0,.44445],100:[0,.69444,0,0,.51667],101:[0,.44444,0,0,.44445],102:[0,.69444,.06944,0,.30556],103:[.19444,.44444,.01389,0,.5],104:[0,.69444,0,0,.51667],105:[0,.67937,0,0,.23889],106:[.19444,.67937,0,0,.26667],107:[0,.69444,0,0,.48889],108:[0,.69444,0,0,.23889],109:[0,.44444,0,0,.79445],110:[0,.44444,0,0,.51667],111:[0,.44444,0,0,.5],112:[.19444,.44444,0,0,.51667],113:[.19444,.44444,0,0,.51667],114:[0,.44444,.01389,0,.34167],115:[0,.44444,0,0,.38333],116:[0,.57143,0,0,.36111],117:[0,.44444,0,0,.51667],118:[0,.44444,.01389,0,.46111],119:[0,.44444,.01389,0,.68334],120:[0,.44444,0,0,.46111],121:[.19444,.44444,.01389,0,.46111],122:[0,.44444,0,0,.43472],126:[.35,.32659,0,0,.5],168:[0,.67937,0,0,.5],176:[0,.69444,0,0,.66667],184:[.17014,0,0,0,.44445],305:[0,.44444,0,0,.23889],567:[.19444,.44444,0,0,.26667],710:[0,.69444,0,0,.5],711:[0,.63194,0,0,.5],713:[0,.60889,0,0,.5],714:[0,.69444,0,0,.5],715:[0,.69444,0,0,.5],728:[0,.69444,0,0,.5],729:[0,.67937,0,0,.27778],730:[0,.69444,0,0,.66667],732:[0,.67659,0,0,.5],733:[0,.69444,0,0,.5],915:[0,.69444,0,0,.54167],916:[0,.69444,0,0,.83334],920:[0,.69444,0,0,.77778],923:[0,.69444,0,0,.61111],926:[0,.69444,0,0,.66667],928:[0,.69444,0,0,.70834],931:[0,.69444,0,0,.72222],933:[0,.69444,0,0,.77778],934:[0,.69444,0,0,.72222],936:[0,.69444,0,0,.77778],937:[0,.69444,0,0,.72222],8211:[0,.44444,.02778,0,.5],8212:[0,.44444,.02778,0,1],8216:[0,.69444,0,0,.27778],8217:[0,.69444,0,0,.27778],8220:[0,.69444,0,0,.5],8221:[0,.69444,0,0,.5]},"Script-Regular":{65:[0,.7,.22925,0,.80253],66:[0,.7,.04087,0,.90757],67:[0,.7,.1689,0,.66619],68:[0,.7,.09371,0,.77443],69:[0,.7,.18583,0,.56162],70:[0,.7,.13634,0,.89544],71:[0,.7,.17322,0,.60961],72:[0,.7,.29694,0,.96919],73:[0,.7,.19189,0,.80907],74:[.27778,.7,.19189,0,1.05159],75:[0,.7,.31259,0,.91364],76:[0,.7,.19189,0,.87373],77:[0,.7,.15981,0,1.08031],78:[0,.7,.3525,0,.9015],79:[0,.7,.08078,0,.73787],80:[0,.7,.08078,0,1.01262],81:[0,.7,.03305,0,.88282],82:[0,.7,.06259,0,.85],83:[0,.7,.19189,0,.86767],84:[0,.7,.29087,0,.74697],85:[0,.7,.25815,0,.79996],86:[0,.7,.27523,0,.62204],87:[0,.7,.27523,0,.80532],88:[0,.7,.26006,0,.94445],89:[0,.7,.2939,0,.70961],90:[0,.7,.24037,0,.8212]},"Size1-Regular":{40:[.35001,.85,0,0,.45834],41:[.35001,.85,0,0,.45834],47:[.35001,.85,0,0,.57778],91:[.35001,.85,0,0,.41667],92:[.35001,.85,0,0,.57778],93:[.35001,.85,0,0,.41667],123:[.35001,.85,0,0,.58334],125:[.35001,.85,0,0,.58334],710:[0,.72222,0,0,.55556],732:[0,.72222,0,0,.55556],770:[0,.72222,0,0,.55556],771:[0,.72222,0,0,.55556],8214:[-99e-5,.601,0,0,.77778],8593:[1e-5,.6,0,0,.66667],8595:[1e-5,.6,0,0,.66667],8657:[1e-5,.6,0,0,.77778],8659:[1e-5,.6,0,0,.77778],8719:[.25001,.75,0,0,.94445],8720:[.25001,.75,0,0,.94445],8721:[.25001,.75,0,0,1.05556],8730:[.35001,.85,0,0,1],8739:[-.00599,.606,0,0,.33333],8741:[-.00599,.606,0,0,.55556],8747:[.30612,.805,.19445,0,.47222],8748:[.306,.805,.19445,0,.47222],8749:[.306,.805,.19445,0,.47222],8750:[.30612,.805,.19445,0,.47222],8896:[.25001,.75,0,0,.83334],8897:[.25001,.75,0,0,.83334],8898:[.25001,.75,0,0,.83334],8899:[.25001,.75,0,0,.83334],8968:[.35001,.85,0,0,.47222],8969:[.35001,.85,0,0,.47222],8970:[.35001,.85,0,0,.47222],8971:[.35001,.85,0,0,.47222],9168:[-99e-5,.601,0,0,.66667],10216:[.35001,.85,0,0,.47222],10217:[.35001,.85,0,0,.47222],10752:[.25001,.75,0,0,1.11111],10753:[.25001,.75,0,0,1.11111],10754:[.25001,.75,0,0,1.11111],10756:[.25001,.75,0,0,.83334],10758:[.25001,.75,0,0,.83334]},"Size2-Regular":{40:[.65002,1.15,0,0,.59722],41:[.65002,1.15,0,0,.59722],47:[.65002,1.15,0,0,.81111],91:[.65002,1.15,0,0,.47222],92:[.65002,1.15,0,0,.81111],93:[.65002,1.15,0,0,.47222],123:[.65002,1.15,0,0,.66667],125:[.65002,1.15,0,0,.66667],710:[0,.75,0,0,1],732:[0,.75,0,0,1],770:[0,.75,0,0,1],771:[0,.75,0,0,1],8719:[.55001,1.05,0,0,1.27778],8720:[.55001,1.05,0,0,1.27778],8721:[.55001,1.05,0,0,1.44445],8730:[.65002,1.15,0,0,1],8747:[.86225,1.36,.44445,0,.55556],8748:[.862,1.36,.44445,0,.55556],8749:[.862,1.36,.44445,0,.55556],8750:[.86225,1.36,.44445,0,.55556],8896:[.55001,1.05,0,0,1.11111],8897:[.55001,1.05,0,0,1.11111],8898:[.55001,1.05,0,0,1.11111],8899:[.55001,1.05,0,0,1.11111],8968:[.65002,1.15,0,0,.52778],8969:[.65002,1.15,0,0,.52778],8970:[.65002,1.15,0,0,.52778],8971:[.65002,1.15,0,0,.52778],10216:[.65002,1.15,0,0,.61111],10217:[.65002,1.15,0,0,.61111],10752:[.55001,1.05,0,0,1.51112],10753:[.55001,1.05,0,0,1.51112],10754:[.55001,1.05,0,0,1.51112],10756:[.55001,1.05,0,0,1.11111],10758:[.55001,1.05,0,0,1.11111]},"Size3-Regular":{40:[.95003,1.45,0,0,.73611],41:[.95003,1.45,0,0,.73611],47:[.95003,1.45,0,0,1.04445],91:[.95003,1.45,0,0,.52778],92:[.95003,1.45,0,0,1.04445],93:[.95003,1.45,0,0,.52778],123:[.95003,1.45,0,0,.75],125:[.95003,1.45,0,0,.75],710:[0,.75,0,0,1.44445],732:[0,.75,0,0,1.44445],770:[0,.75,0,0,1.44445],771:[0,.75,0,0,1.44445],8730:[.95003,1.45,0,0,1],8968:[.95003,1.45,0,0,.58334],8969:[.95003,1.45,0,0,.58334],8970:[.95003,1.45,0,0,.58334],8971:[.95003,1.45,0,0,.58334],10216:[.95003,1.45,0,0,.75],10217:[.95003,1.45,0,0,.75]},"Size4-Regular":{40:[1.25003,1.75,0,0,.79167],41:[1.25003,1.75,0,0,.79167],47:[1.25003,1.75,0,0,1.27778],91:[1.25003,1.75,0,0,.58334],92:[1.25003,1.75,0,0,1.27778],93:[1.25003,1.75,0,0,.58334],123:[1.25003,1.75,0,0,.80556],125:[1.25003,1.75,0,0,.80556],710:[0,.825,0,0,1.8889],732:[0,.825,0,0,1.8889],770:[0,.825,0,0,1.8889],771:[0,.825,0,0,1.8889],8730:[1.25003,1.75,0,0,1],8968:[1.25003,1.75,0,0,.63889],8969:[1.25003,1.75,0,0,.63889],8970:[1.25003,1.75,0,0,.63889],8971:[1.25003,1.75,0,0,.63889],9115:[.64502,1.155,0,0,.875],9116:[1e-5,.6,0,0,.875],9117:[.64502,1.155,0,0,.875],9118:[.64502,1.155,0,0,.875],9119:[1e-5,.6,0,0,.875],9120:[.64502,1.155,0,0,.875],9121:[.64502,1.155,0,0,.66667],9122:[-99e-5,.601,0,0,.66667],9123:[.64502,1.155,0,0,.66667],9124:[.64502,1.155,0,0,.66667],9125:[-99e-5,.601,0,0,.66667],9126:[.64502,1.155,0,0,.66667],9127:[1e-5,.9,0,0,.88889],9128:[.65002,1.15,0,0,.88889],9129:[.90001,0,0,0,.88889],9130:[0,.3,0,0,.88889],9131:[1e-5,.9,0,0,.88889],9132:[.65002,1.15,0,0,.88889],9133:[.90001,0,0,0,.88889],9143:[.88502,.915,0,0,1.05556],10216:[1.25003,1.75,0,0,.80556],10217:[1.25003,1.75,0,0,.80556],57344:[-.00499,.605,0,0,1.05556],57345:[-.00499,.605,0,0,1.05556],57680:[0,.12,0,0,.45],57681:[0,.12,0,0,.45],57682:[0,.12,0,0,.45],57683:[0,.12,0,0,.45]},"Typewriter-Regular":{32:[0,0,0,0,.525],33:[0,.61111,0,0,.525],34:[0,.61111,0,0,.525],35:[0,.61111,0,0,.525],36:[.08333,.69444,0,0,.525],37:[.08333,.69444,0,0,.525],38:[0,.61111,0,0,.525],39:[0,.61111,0,0,.525],40:[.08333,.69444,0,0,.525],41:[.08333,.69444,0,0,.525],42:[0,.52083,0,0,.525],43:[-.08056,.53055,0,0,.525],44:[.13889,.125,0,0,.525],45:[-.08056,.53055,0,0,.525],46:[0,.125,0,0,.525],47:[.08333,.69444,0,0,.525],48:[0,.61111,0,0,.525],49:[0,.61111,0,0,.525],50:[0,.61111,0,0,.525],51:[0,.61111,0,0,.525],52:[0,.61111,0,0,.525],53:[0,.61111,0,0,.525],54:[0,.61111,0,0,.525],55:[0,.61111,0,0,.525],56:[0,.61111,0,0,.525],57:[0,.61111,0,0,.525],58:[0,.43056,0,0,.525],59:[.13889,.43056,0,0,.525],60:[-.05556,.55556,0,0,.525],61:[-.19549,.41562,0,0,.525],62:[-.05556,.55556,0,0,.525],63:[0,.61111,0,0,.525],64:[0,.61111,0,0,.525],65:[0,.61111,0,0,.525],66:[0,.61111,0,0,.525],67:[0,.61111,0,0,.525],68:[0,.61111,0,0,.525],69:[0,.61111,0,0,.525],70:[0,.61111,0,0,.525],71:[0,.61111,0,0,.525],72:[0,.61111,0,0,.525],73:[0,.61111,0,0,.525],74:[0,.61111,0,0,.525],75:[0,.61111,0,0,.525],76:[0,.61111,0,0,.525],77:[0,.61111,0,0,.525],78:[0,.61111,0,0,.525],79:[0,.61111,0,0,.525],80:[0,.61111,0,0,.525],81:[.13889,.61111,0,0,.525],82:[0,.61111,0,0,.525],83:[0,.61111,0,0,.525],84:[0,.61111,0,0,.525],85:[0,.61111,0,0,.525],86:[0,.61111,0,0,.525],87:[0,.61111,0,0,.525],88:[0,.61111,0,0,.525],89:[0,.61111,0,0,.525],90:[0,.61111,0,0,.525],91:[.08333,.69444,0,0,.525],92:[.08333,.69444,0,0,.525],93:[.08333,.69444,0,0,.525],94:[0,.61111,0,0,.525],95:[.09514,0,0,0,.525],96:[0,.61111,0,0,.525],97:[0,.43056,0,0,.525],98:[0,.61111,0,0,.525],99:[0,.43056,0,0,.525],100:[0,.61111,0,0,.525],101:[0,.43056,0,0,.525],102:[0,.61111,0,0,.525],103:[.22222,.43056,0,0,.525],104:[0,.61111,0,0,.525],105:[0,.61111,0,0,.525],106:[.22222,.61111,0,0,.525],107:[0,.61111,0,0,.525],108:[0,.61111,0,0,.525],109:[0,.43056,0,0,.525],110:[0,.43056,0,0,.525],111:[0,.43056,0,0,.525],112:[.22222,.43056,0,0,.525],113:[.22222,.43056,0,0,.525],114:[0,.43056,0,0,.525],115:[0,.43056,0,0,.525],116:[0,.55358,0,0,.525],117:[0,.43056,0,0,.525],118:[0,.43056,0,0,.525],119:[0,.43056,0,0,.525],120:[0,.43056,0,0,.525],121:[.22222,.43056,0,0,.525],122:[0,.43056,0,0,.525],123:[.08333,.69444,0,0,.525],124:[.08333,.69444,0,0,.525],125:[.08333,.69444,0,0,.525],126:[0,.61111,0,0,.525],127:[0,.61111,0,0,.525],160:[0,0,0,0,.525],176:[0,.61111,0,0,.525],184:[.19445,0,0,0,.525],305:[0,.43056,0,0,.525],567:[.22222,.43056,0,0,.525],711:[0,.56597,0,0,.525],713:[0,.56555,0,0,.525],714:[0,.61111,0,0,.525],715:[0,.61111,0,0,.525],728:[0,.61111,0,0,.525],730:[0,.61111,0,0,.525],770:[0,.61111,0,0,.525],771:[0,.61111,0,0,.525],776:[0,.61111,0,0,.525],915:[0,.61111,0,0,.525],916:[0,.61111,0,0,.525],920:[0,.61111,0,0,.525],923:[0,.61111,0,0,.525],926:[0,.61111,0,0,.525],928:[0,.61111,0,0,.525],931:[0,.61111,0,0,.525],933:[0,.61111,0,0,.525],934:[0,.61111,0,0,.525],936:[0,.61111,0,0,.525],937:[0,.61111,0,0,.525],8216:[0,.61111,0,0,.525],8217:[0,.61111,0,0,.525],8242:[0,.61111,0,0,.525],9251:[.11111,.21944,0,0,.525]}},G={slant:[.25,.25,.25],space:[0,0,0],stretch:[0,0,0],shrink:[0,0,0],xHeight:[.431,.431,.431],quad:[1,1.171,1.472],extraSpace:[0,0,0],num1:[.677,.732,.925],num2:[.394,.384,.387],num3:[.444,.471,.504],denom1:[.686,.752,1.025],denom2:[.345,.344,.532],sup1:[.413,.503,.504],sup2:[.363,.431,.404],sup3:[.289,.286,.294],sub1:[.15,.143,.2],sub2:[.247,.286,.4],supDrop:[.386,.353,.494],subDrop:[.05,.071,.1],delim1:[2.39,1.7,1.98],delim2:[1.01,1.157,1.42],axisHeight:[.25,.25,.25],defaultRuleThickness:[.04,.049,.049],bigOpSpacing1:[.111,.111,.111],bigOpSpacing2:[.166,.166,.166],bigOpSpacing3:[.2,.2,.2],bigOpSpacing4:[.6,.611,.611],bigOpSpacing5:[.1,.143,.143],sqrtRuleThickness:[.04,.04,.04],ptPerEm:[10,10,10],doubleRuleSep:[.2,.2,.2]},U={"\xc5":"A","\xc7":"C","\xd0":"D","\xde":"o","\xe5":"a","\xe7":"c","\xf0":"d","\xfe":"o","\u0410":"A","\u0411":"B","\u0412":"B","\u0413":"F","\u0414":"A","\u0415":"E","\u0416":"K","\u0417":"3","\u0418":"N","\u0419":"N","\u041a":"K","\u041b":"N","\u041c":"M","\u041d":"H","\u041e":"O","\u041f":"N","\u0420":"P","\u0421":"C","\u0422":"T","\u0423":"y","\u0424":"O","\u0425":"X","\u0426":"U","\u0427":"h","\u0428":"W","\u0429":"W","\u042a":"B","\u042b":"X","\u042c":"B","\u042d":"3","\u042e":"X","\u042f":"R","\u0430":"a","\u0431":"b","\u0432":"a","\u0433":"r","\u0434":"y","\u0435":"e","\u0436":"m","\u0437":"e","\u0438":"n","\u0439":"n","\u043a":"n","\u043b":"n","\u043c":"m","\u043d":"n","\u043e":"o","\u043f":"n","\u0440":"p","\u0441":"c","\u0442":"o","\u0443":"y","\u0444":"b","\u0445":"x","\u0446":"n","\u0447":"n","\u0448":"w","\u0449":"w","\u044a":"a","\u044b":"m","\u044c":"a","\u044d":"e","\u044e":"m","\u044f":"r"};function X(t,e,r){if(!V[e])throw new Error("Font metrics not found for font: "+e+".");var n=t.charCodeAt(0);t[0]in U&&(n=U[t[0]].charCodeAt(0));var a=V[e][n];if(a||"text"!==r||A(n)&&(a=V[e][77]),a)return{depth:a[0],height:a[1],italic:a[2],skew:a[3],width:a[4]}}var Y={};var _={bin:1,close:1,inner:1,open:1,punct:1,rel:1},W={"accent-token":1,mathord:1,"op-token":1,spacing:1,textord:1},j={math:{},text:{}},$=j;function Z(t,e,r,n,a,o){j[t][a]={font:e,group:r,replace:n},o&&n&&(j[t][n]=j[t][a])}var K="main",J="ams",Q="bin",tt="mathord",et="op-token",rt="rel",nt="spacing";Z("math",K,rt,"\u2261","\\equiv",!0),Z("math",K,rt,"\u227a","\\prec",!0),Z("math",K,rt,"\u227b","\\succ",!0),Z("math",K,rt,"\u223c","\\sim",!0),Z("math",K,rt,"\u22a5","\\perp"),Z("math",K,rt,"\u2aaf","\\preceq",!0),Z("math",K,rt,"\u2ab0","\\succeq",!0),Z("math",K,rt,"\u2243","\\simeq",!0),Z("math",K,rt,"\u2223","\\mid",!0),Z("math",K,rt,"\u226a","\\ll",!0),Z("math",K,rt,"\u226b","\\gg",!0),Z("math",K,rt,"\u224d","\\asymp",!0),Z("math",K,rt,"\u2225","\\parallel"),Z("math",K,rt,"\u22c8","\\bowtie",!0),Z("math",K,rt,"\u2323","\\smile",!0),Z("math",K,rt,"\u2291","\\sqsubseteq",!0),Z("math",K,rt,"\u2292","\\sqsupseteq",!0),Z("math",K,rt,"\u2250","\\doteq",!0),Z("math",K,rt,"\u2322","\\frown",!0),Z("math",K,rt,"\u220b","\\ni",!0),Z("math",K,rt,"\u221d","\\propto",!0),Z("math",K,rt,"\u22a2","\\vdash",!0),Z("math",K,rt,"\u22a3","\\dashv",!0),Z("math",K,rt,"\u220b","\\owns"),Z("math",K,"punct",".","\\ldotp"),Z("math",K,"punct","\u22c5","\\cdotp"),Z("math",K,"textord","#","\\#"),Z("text",K,"textord","#","\\#"),Z("math",K,"textord","&","\\&"),Z("text",K,"textord","&","\\&"),Z("math",K,"textord","\u2135","\\aleph",!0),Z("math",K,"textord","\u2200","\\forall",!0),Z("math",K,"textord","\u210f","\\hbar",!0),Z("math",K,"textord","\u2203","\\exists",!0),Z("math",K,"textord","\u2207","\\nabla",!0),Z("math",K,"textord","\u266d","\\flat",!0),Z("math",K,"textord","\u2113","\\ell",!0),Z("math",K,"textord","\u266e","\\natural",!0),Z("math",K,"textord","\u2663","\\clubsuit",!0),Z("math",K,"textord","\u2118","\\wp",!0),Z("math",K,"textord","\u266f","\\sharp",!0),Z("math",K,"textord","\u2662","\\diamondsuit",!0),Z("math",K,"textord","\u211c","\\Re",!0),Z("math",K,"textord","\u2661","\\heartsuit",!0),Z("math",K,"textord","\u2111","\\Im",!0),Z("math",K,"textord","\u2660","\\spadesuit",!0),Z("text",K,"textord","\xa7","\\S",!0),Z("text",K,"textord","\xb6","\\P",!0),Z("math",K,"textord","\u2020","\\dag"),Z("text",K,"textord","\u2020","\\dag"),Z("text",K,"textord","\u2020","\\textdagger"),Z("math",K,"textord","\u2021","\\ddag"),Z("text",K,"textord","\u2021","\\ddag"),Z("text",K,"textord","\u2021","\\textdaggerdbl"),Z("math",K,"close","\u23b1","\\rmoustache",!0),Z("math",K,"open","\u23b0","\\lmoustache",!0),Z("math",K,"close","\u27ef","\\rgroup",!0),Z("math",K,"open","\u27ee","\\lgroup",!0),Z("math",K,Q,"\u2213","\\mp",!0),Z("math",K,Q,"\u2296","\\ominus",!0),Z("math",K,Q,"\u228e","\\uplus",!0),Z("math",K,Q,"\u2293","\\sqcap",!0),Z("math",K,Q,"\u2217","\\ast"),Z("math",K,Q,"\u2294","\\sqcup",!0),Z("math",K,Q,"\u25ef","\\bigcirc"),Z("math",K,Q,"\u2219","\\bullet"),Z("math",K,Q,"\u2021","\\ddagger"),Z("math",K,Q,"\u2240","\\wr",!0),Z("math",K,Q,"\u2a3f","\\amalg"),Z("math",K,Q,"&","\\And"),Z("math",K,rt,"\u27f5","\\longleftarrow",!0),Z("math",K,rt,"\u21d0","\\Leftarrow",!0),Z("math",K,rt,"\u27f8","\\Longleftarrow",!0),Z("math",K,rt,"\u27f6","\\longrightarrow",!0),Z("math",K,rt,"\u21d2","\\Rightarrow",!0),Z("math",K,rt,"\u27f9","\\Longrightarrow",!0),Z("math",K,rt,"\u2194","\\leftrightarrow",!0),Z("math",K,rt,"\u27f7","\\longleftrightarrow",!0),Z("math",K,rt,"\u21d4","\\Leftrightarrow",!0),Z("math",K,rt,"\u27fa","\\Longleftrightarrow",!0),Z("math",K,rt,"\u21a6","\\mapsto",!0),Z("math",K,rt,"\u27fc","\\longmapsto",!0),Z("math",K,rt,"\u2197","\\nearrow",!0),Z("math",K,rt,"\u21a9","\\hookleftarrow",!0),Z("math",K,rt,"\u21aa","\\hookrightarrow",!0),Z("math",K,rt,"\u2198","\\searrow",!0),Z("math",K,rt,"\u21bc","\\leftharpoonup",!0),Z("math",K,rt,"\u21c0","\\rightharpoonup",!0),Z("math",K,rt,"\u2199","\\swarrow",!0),Z("math",K,rt,"\u21bd","\\leftharpoondown",!0),Z("math",K,rt,"\u21c1","\\rightharpoondown",!0),Z("math",K,rt,"\u2196","\\nwarrow",!0),Z("math",K,rt,"\u21cc","\\rightleftharpoons",!0),Z("math",J,rt,"\u226e","\\nless",!0),Z("math",J,rt,"\ue010","\\nleqslant"),Z("math",J,rt,"\ue011","\\nleqq"),Z("math",J,rt,"\u2a87","\\lneq",!0),Z("math",J,rt,"\u2268","\\lneqq",!0),Z("math",J,rt,"\ue00c","\\lvertneqq"),Z("math",J,rt,"\u22e6","\\lnsim",!0),Z("math",J,rt,"\u2a89","\\lnapprox",!0),Z("math",J,rt,"\u2280","\\nprec",!0),Z("math",J,rt,"\u22e0","\\npreceq",!0),Z("math",J,rt,"\u22e8","\\precnsim",!0),Z("math",J,rt,"\u2ab9","\\precnapprox",!0),Z("math",J,rt,"\u2241","\\nsim",!0),Z("math",J,rt,"\ue006","\\nshortmid"),Z("math",J,rt,"\u2224","\\nmid",!0),Z("math",J,rt,"\u22ac","\\nvdash",!0),Z("math",J,rt,"\u22ad","\\nvDash",!0),Z("math",J,rt,"\u22ea","\\ntriangleleft"),Z("math",J,rt,"\u22ec","\\ntrianglelefteq",!0),Z("math",J,rt,"\u228a","\\subsetneq",!0),Z("math",J,rt,"\ue01a","\\varsubsetneq"),Z("math",J,rt,"\u2acb","\\subsetneqq",!0),Z("math",J,rt,"\ue017","\\varsubsetneqq"),Z("math",J,rt,"\u226f","\\ngtr",!0),Z("math",J,rt,"\ue00f","\\ngeqslant"),Z("math",J,rt,"\ue00e","\\ngeqq"),Z("math",J,rt,"\u2a88","\\gneq",!0),Z("math",J,rt,"\u2269","\\gneqq",!0),Z("math",J,rt,"\ue00d","\\gvertneqq"),Z("math",J,rt,"\u22e7","\\gnsim",!0),Z("math",J,rt,"\u2a8a","\\gnapprox",!0),Z("math",J,rt,"\u2281","\\nsucc",!0),Z("math",J,rt,"\u22e1","\\nsucceq",!0),Z("math",J,rt,"\u22e9","\\succnsim",!0),Z("math",J,rt,"\u2aba","\\succnapprox",!0),Z("math",J,rt,"\u2246","\\ncong",!0),Z("math",J,rt,"\ue007","\\nshortparallel"),Z("math",J,rt,"\u2226","\\nparallel",!0),Z("math",J,rt,"\u22af","\\nVDash",!0),Z("math",J,rt,"\u22eb","\\ntriangleright"),Z("math",J,rt,"\u22ed","\\ntrianglerighteq",!0),Z("math",J,rt,"\ue018","\\nsupseteqq"),Z("math",J,rt,"\u228b","\\supsetneq",!0),Z("math",J,rt,"\ue01b","\\varsupsetneq"),Z("math",J,rt,"\u2acc","\\supsetneqq",!0),Z("math",J,rt,"\ue019","\\varsupsetneqq"),Z("math",J,rt,"\u22ae","\\nVdash",!0),Z("math",J,rt,"\u2ab5","\\precneqq",!0),Z("math",J,rt,"\u2ab6","\\succneqq",!0),Z("math",J,rt,"\ue016","\\nsubseteqq"),Z("math",J,Q,"\u22b4","\\unlhd"),Z("math",J,Q,"\u22b5","\\unrhd"),Z("math",J,rt,"\u219a","\\nleftarrow",!0),Z("math",J,rt,"\u219b","\\nrightarrow",!0),Z("math",J,rt,"\u21cd","\\nLeftarrow",!0),Z("math",J,rt,"\u21cf","\\nRightarrow",!0),Z("math",J,rt,"\u21ae","\\nleftrightarrow",!0),Z("math",J,rt,"\u21ce","\\nLeftrightarrow",!0),Z("math",J,rt,"\u25b3","\\vartriangle"),Z("math",J,"textord","\u210f","\\hslash"),Z("math",J,"textord","\u25bd","\\triangledown"),Z("math",J,"textord","\u25ca","\\lozenge"),Z("math",J,"textord","\u24c8","\\circledS"),Z("math",J,"textord","\xae","\\circledR"),Z("text",J,"textord","\xae","\\circledR"),Z("math",J,"textord","\u2221","\\measuredangle",!0),Z("math",J,"textord","\u2204","\\nexists"),Z("math",J,"textord","\u2127","\\mho"),Z("math",J,"textord","\u2132","\\Finv",!0),Z("math",J,"textord","\u2141","\\Game",!0),Z("math",J,"textord","k","\\Bbbk"),Z("math",J,"textord","\u2035","\\backprime"),Z("math",J,"textord","\u25b2","\\blacktriangle"),Z("math",J,"textord","\u25bc","\\blacktriangledown"),Z("math",J,"textord","\u25a0","\\blacksquare"),Z("math",J,"textord","\u29eb","\\blacklozenge"),Z("math",J,"textord","\u2605","\\bigstar"),Z("math",J,"textord","\u2222","\\sphericalangle",!0),Z("math",J,"textord","\u2201","\\complement",!0),Z("math",J,"textord","\xf0","\\eth",!0),Z("math",J,"textord","\u2571","\\diagup"),Z("math",J,"textord","\u2572","\\diagdown"),Z("math",J,"textord","\u25a1","\\square"),Z("math",J,"textord","\u25a1","\\Box"),Z("math",J,"textord","\u25ca","\\Diamond"),Z("math",J,"textord","\xa5","\\yen",!0),Z("text",J,"textord","\xa5","\\yen",!0),Z("math",J,"textord","\u2713","\\checkmark",!0),Z("text",J,"textord","\u2713","\\checkmark"),Z("math",J,"textord","\u2136","\\beth",!0),Z("math",J,"textord","\u2138","\\daleth",!0),Z("math",J,"textord","\u2137","\\gimel",!0),Z("math",J,"textord","\u03dd","\\digamma"),Z("math",J,"textord","\u03f0","\\varkappa"),Z("math",J,"open","\u250c","\\ulcorner",!0),Z("math",J,"close","\u2510","\\urcorner",!0),Z("math",J,"open","\u2514","\\llcorner",!0),Z("math",J,"close","\u2518","\\lrcorner",!0),Z("math",J,rt,"\u2266","\\leqq",!0),Z("math",J,rt,"\u2a7d","\\leqslant",!0),Z("math",J,rt,"\u2a95","\\eqslantless",!0),Z("math",J,rt,"\u2272","\\lesssim",!0),Z("math",J,rt,"\u2a85","\\lessapprox",!0),Z("math",J,rt,"\u224a","\\approxeq",!0),Z("math",J,Q,"\u22d6","\\lessdot"),Z("math",J,rt,"\u22d8","\\lll",!0),Z("math",J,rt,"\u2276","\\lessgtr",!0),Z("math",J,rt,"\u22da","\\lesseqgtr",!0),Z("math",J,rt,"\u2a8b","\\lesseqqgtr",!0),Z("math",J,rt,"\u2251","\\doteqdot"),Z("math",J,rt,"\u2253","\\risingdotseq",!0),Z("math",J,rt,"\u2252","\\fallingdotseq",!0),Z("math",J,rt,"\u223d","\\backsim",!0),Z("math",J,rt,"\u22cd","\\backsimeq",!0),Z("math",J,rt,"\u2ac5","\\subseteqq",!0),Z("math",J,rt,"\u22d0","\\Subset",!0),Z("math",J,rt,"\u228f","\\sqsubset",!0),Z("math",J,rt,"\u227c","\\preccurlyeq",!0),Z("math",J,rt,"\u22de","\\curlyeqprec",!0),Z("math",J,rt,"\u227e","\\precsim",!0),Z("math",J,rt,"\u2ab7","\\precapprox",!0),Z("math",J,rt,"\u22b2","\\vartriangleleft"),Z("math",J,rt,"\u22b4","\\trianglelefteq"),Z("math",J,rt,"\u22a8","\\vDash",!0),Z("math",J,rt,"\u22aa","\\Vvdash",!0),Z("math",J,rt,"\u2323","\\smallsmile"),Z("math",J,rt,"\u2322","\\smallfrown"),Z("math",J,rt,"\u224f","\\bumpeq",!0),Z("math",J,rt,"\u224e","\\Bumpeq",!0),Z("math",J,rt,"\u2267","\\geqq",!0),Z("math",J,rt,"\u2a7e","\\geqslant",!0),Z("math",J,rt,"\u2a96","\\eqslantgtr",!0),Z("math",J,rt,"\u2273","\\gtrsim",!0),Z("math",J,rt,"\u2a86","\\gtrapprox",!0),Z("math",J,Q,"\u22d7","\\gtrdot"),Z("math",J,rt,"\u22d9","\\ggg",!0),Z("math",J,rt,"\u2277","\\gtrless",!0),Z("math",J,rt,"\u22db","\\gtreqless",!0),Z("math",J,rt,"\u2a8c","\\gtreqqless",!0),Z("math",J,rt,"\u2256","\\eqcirc",!0),Z("math",J,rt,"\u2257","\\circeq",!0),Z("math",J,rt,"\u225c","\\triangleq",!0),Z("math",J,rt,"\u223c","\\thicksim"),Z("math",J,rt,"\u2248","\\thickapprox"),Z("math",J,rt,"\u2ac6","\\supseteqq",!0),Z("math",J,rt,"\u22d1","\\Supset",!0),Z("math",J,rt,"\u2290","\\sqsupset",!0),Z("math",J,rt,"\u227d","\\succcurlyeq",!0),Z("math",J,rt,"\u22df","\\curlyeqsucc",!0),Z("math",J,rt,"\u227f","\\succsim",!0),Z("math",J,rt,"\u2ab8","\\succapprox",!0),Z("math",J,rt,"\u22b3","\\vartriangleright"),Z("math",J,rt,"\u22b5","\\trianglerighteq"),Z("math",J,rt,"\u22a9","\\Vdash",!0),Z("math",J,rt,"\u2223","\\shortmid"),Z("math",J,rt,"\u2225","\\shortparallel"),Z("math",J,rt,"\u226c","\\between",!0),Z("math",J,rt,"\u22d4","\\pitchfork",!0),Z("math",J,rt,"\u221d","\\varpropto"),Z("math",J,rt,"\u25c0","\\blacktriangleleft"),Z("math",J,rt,"\u2234","\\therefore",!0),Z("math",J,rt,"\u220d","\\backepsilon"),Z("math",J,rt,"\u25b6","\\blacktriangleright"),Z("math",J,rt,"\u2235","\\because",!0),Z("math",J,rt,"\u22d8","\\llless"),Z("math",J,rt,"\u22d9","\\gggtr"),Z("math",J,Q,"\u22b2","\\lhd"),Z("math",J,Q,"\u22b3","\\rhd"),Z("math",J,rt,"\u2242","\\eqsim",!0),Z("math",K,rt,"\u22c8","\\Join"),Z("math",J,rt,"\u2251","\\Doteq",!0),Z("math",J,Q,"\u2214","\\dotplus",!0),Z("math",J,Q,"\u2216","\\smallsetminus"),Z("math",J,Q,"\u22d2","\\Cap",!0),Z("math",J,Q,"\u22d3","\\Cup",!0),Z("math",J,Q,"\u2a5e","\\doublebarwedge",!0),Z("math",J,Q,"\u229f","\\boxminus",!0),Z("math",J,Q,"\u229e","\\boxplus",!0),Z("math",J,Q,"\u22c7","\\divideontimes",!0),Z("math",J,Q,"\u22c9","\\ltimes",!0),Z("math",J,Q,"\u22ca","\\rtimes",!0),Z("math",J,Q,"\u22cb","\\leftthreetimes",!0),Z("math",J,Q,"\u22cc","\\rightthreetimes",!0),Z("math",J,Q,"\u22cf","\\curlywedge",!0),Z("math",J,Q,"\u22ce","\\curlyvee",!0),Z("math",J,Q,"\u229d","\\circleddash",!0),Z("math",J,Q,"\u229b","\\circledast",!0),Z("math",J,Q,"\u22c5","\\centerdot"),Z("math",J,Q,"\u22ba","\\intercal",!0),Z("math",J,Q,"\u22d2","\\doublecap"),Z("math",J,Q,"\u22d3","\\doublecup"),Z("math",J,Q,"\u22a0","\\boxtimes",!0),Z("math",J,rt,"\u21e2","\\dashrightarrow",!0),Z("math",J,rt,"\u21e0","\\dashleftarrow",!0),Z("math",J,rt,"\u21c7","\\leftleftarrows",!0),Z("math",J,rt,"\u21c6","\\leftrightarrows",!0),Z("math",J,rt,"\u21da","\\Lleftarrow",!0),Z("math",J,rt,"\u219e","\\twoheadleftarrow",!0),Z("math",J,rt,"\u21a2","\\leftarrowtail",!0),Z("math",J,rt,"\u21ab","\\looparrowleft",!0),Z("math",J,rt,"\u21cb","\\leftrightharpoons",!0),Z("math",J,rt,"\u21b6","\\curvearrowleft",!0),Z("math",J,rt,"\u21ba","\\circlearrowleft",!0),Z("math",J,rt,"\u21b0","\\Lsh",!0),Z("math",J,rt,"\u21c8","\\upuparrows",!0),Z("math",J,rt,"\u21bf","\\upharpoonleft",!0),Z("math",J,rt,"\u21c3","\\downharpoonleft",!0),Z("math",J,rt,"\u22b8","\\multimap",!0),Z("math",J,rt,"\u21ad","\\leftrightsquigarrow",!0),Z("math",J,rt,"\u21c9","\\rightrightarrows",!0),Z("math",J,rt,"\u21c4","\\rightleftarrows",!0),Z("math",J,rt,"\u21a0","\\twoheadrightarrow",!0),Z("math",J,rt,"\u21a3","\\rightarrowtail",!0),Z("math",J,rt,"\u21ac","\\looparrowright",!0),Z("math",J,rt,"\u21b7","\\curvearrowright",!0),Z("math",J,rt,"\u21bb","\\circlearrowright",!0),Z("math",J,rt,"\u21b1","\\Rsh",!0),Z("math",J,rt,"\u21ca","\\downdownarrows",!0),Z("math",J,rt,"\u21be","\\upharpoonright",!0),Z("math",J,rt,"\u21c2","\\downharpoonright",!0),Z("math",J,rt,"\u21dd","\\rightsquigarrow",!0),Z("math",J,rt,"\u21dd","\\leadsto"),Z("math",J,rt,"\u21db","\\Rrightarrow",!0),Z("math",J,rt,"\u21be","\\restriction"),Z("math",K,"textord","\u2018","`"),Z("math",K,"textord","$","\\$"),Z("text",K,"textord","$","\\$"),Z("text",K,"textord","$","\\textdollar"),Z("math",K,"textord","%","\\%"),Z("text",K,"textord","%","\\%"),Z("math",K,"textord","_","\\_"),Z("text",K,"textord","_","\\_"),Z("text",K,"textord","_","\\textunderscore"),Z("math",K,"textord","\u2220","\\angle",!0),Z("math",K,"textord","\u221e","\\infty",!0),Z("math",K,"textord","\u2032","\\prime"),Z("math",K,"textord","\u25b3","\\triangle"),Z("math",K,"textord","\u0393","\\Gamma",!0),Z("math",K,"textord","\u0394","\\Delta",!0),Z("math",K,"textord","\u0398","\\Theta",!0),Z("math",K,"textord","\u039b","\\Lambda",!0),Z("math",K,"textord","\u039e","\\Xi",!0),Z("math",K,"textord","\u03a0","\\Pi",!0),Z("math",K,"textord","\u03a3","\\Sigma",!0),Z("math",K,"textord","\u03a5","\\Upsilon",!0),Z("math",K,"textord","\u03a6","\\Phi",!0),Z("math",K,"textord","\u03a8","\\Psi",!0),Z("math",K,"textord","\u03a9","\\Omega",!0),Z("math",K,"textord","A","\u0391"),Z("math",K,"textord","B","\u0392"),Z("math",K,"textord","E","\u0395"),Z("math",K,"textord","Z","\u0396"),Z("math",K,"textord","H","\u0397"),Z("math",K,"textord","I","\u0399"),Z("math",K,"textord","K","\u039a"),Z("math",K,"textord","M","\u039c"),Z("math",K,"textord","N","\u039d"),Z("math",K,"textord","O","\u039f"),Z("math",K,"textord","P","\u03a1"),Z("math",K,"textord","T","\u03a4"),Z("math",K,"textord","X","\u03a7"),Z("math",K,"textord","\xac","\\neg",!0),Z("math",K,"textord","\xac","\\lnot"),Z("math",K,"textord","\u22a4","\\top"),Z("math",K,"textord","\u22a5","\\bot"),Z("math",K,"textord","\u2205","\\emptyset"),Z("math",J,"textord","\u2205","\\varnothing"),Z("math",K,tt,"\u03b1","\\alpha",!0),Z("math",K,tt,"\u03b2","\\beta",!0),Z("math",K,tt,"\u03b3","\\gamma",!0),Z("math",K,tt,"\u03b4","\\delta",!0),Z("math",K,tt,"\u03f5","\\epsilon",!0),Z("math",K,tt,"\u03b6","\\zeta",!0),Z("math",K,tt,"\u03b7","\\eta",!0),Z("math",K,tt,"\u03b8","\\theta",!0),Z("math",K,tt,"\u03b9","\\iota",!0),Z("math",K,tt,"\u03ba","\\kappa",!0),Z("math",K,tt,"\u03bb","\\lambda",!0),Z("math",K,tt,"\u03bc","\\mu",!0),Z("math",K,tt,"\u03bd","\\nu",!0),Z("math",K,tt,"\u03be","\\xi",!0),Z("math",K,tt,"\u03bf","\\omicron",!0),Z("math",K,tt,"\u03c0","\\pi",!0),Z("math",K,tt,"\u03c1","\\rho",!0),Z("math",K,tt,"\u03c3","\\sigma",!0),Z("math",K,tt,"\u03c4","\\tau",!0),Z("math",K,tt,"\u03c5","\\upsilon",!0),Z("math",K,tt,"\u03d5","\\phi",!0),Z("math",K,tt,"\u03c7","\\chi",!0),Z("math",K,tt,"\u03c8","\\psi",!0),Z("math",K,tt,"\u03c9","\\omega",!0),Z("math",K,tt,"\u03b5","\\varepsilon",!0),Z("math",K,tt,"\u03d1","\\vartheta",!0),Z("math",K,tt,"\u03d6","\\varpi",!0),Z("math",K,tt,"\u03f1","\\varrho",!0),Z("math",K,tt,"\u03c2","\\varsigma",!0),Z("math",K,tt,"\u03c6","\\varphi",!0),Z("math",K,Q,"\u2217","*"),Z("math",K,Q,"+","+"),Z("math",K,Q,"\u2212","-"),Z("math",K,Q,"\u22c5","\\cdot",!0),Z("math",K,Q,"\u2218","\\circ"),Z("math",K,Q,"\xf7","\\div",!0),Z("math",K,Q,"\xb1","\\pm",!0),Z("math",K,Q,"\xd7","\\times",!0),Z("math",K,Q,"\u2229","\\cap",!0),Z("math",K,Q,"\u222a","\\cup",!0),Z("math",K,Q,"\u2216","\\setminus"),Z("math",K,Q,"\u2227","\\land"),Z("math",K,Q,"\u2228","\\lor"),Z("math",K,Q,"\u2227","\\wedge",!0),Z("math",K,Q,"\u2228","\\vee",!0),Z("math",K,"textord","\u221a","\\surd"),Z("math",K,"open","(","("),Z("math",K,"open","[","["),Z("math",K,"open","\u27e8","\\langle",!0),Z("math",K,"open","\u2223","\\lvert"),Z("math",K,"open","\u2225","\\lVert"),Z("math",K,"close",")",")"),Z("math",K,"close","]","]"),Z("math",K,"close","?","?"),Z("math",K,"close","!","!"),Z("math",K,"close","\u27e9","\\rangle",!0),Z("math",K,"close","\u2223","\\rvert"),Z("math",K,"close","\u2225","\\rVert"),Z("math",K,rt,"=","="),Z("math",K,rt,"<","<"),Z("math",K,rt,">",">"),Z("math",K,rt,":",":"),Z("math",K,rt,"\u2248","\\approx",!0),Z("math",K,rt,"\u2245","\\cong",!0),Z("math",K,rt,"\u2265","\\ge"),Z("math",K,rt,"\u2265","\\geq",!0),Z("math",K,rt,"\u2190","\\gets"),Z("math",K,rt,">","\\gt"),Z("math",K,rt,"\u2208","\\in",!0),Z("math",K,rt,"\u0338","\\@not"),Z("math",K,rt,"\u2282","\\subset",!0),Z("math",K,rt,"\u2283","\\supset",!0),Z("math",K,rt,"\u2286","\\subseteq",!0),Z("math",K,rt,"\u2287","\\supseteq",!0),Z("math",J,rt,"\u2288","\\nsubseteq",!0),Z("math",J,rt,"\u2289","\\nsupseteq",!0),Z("math",K,rt,"\u22a8","\\models"),Z("math",K,rt,"\u2190","\\leftarrow",!0),Z("math",K,rt,"\u2264","\\le"),Z("math",K,rt,"\u2264","\\leq",!0),Z("math",K,rt,"<","\\lt"),Z("math",K,rt,"\u2192","\\rightarrow",!0),Z("math",K,rt,"\u2192","\\to"),Z("math",J,rt,"\u2271","\\ngeq",!0),Z("math",J,rt,"\u2270","\\nleq",!0),Z("math",K,nt,"\xa0","\\ "),Z("math",K,nt,"\xa0","~"),Z("math",K,nt,"\xa0","\\space"),Z("math",K,nt,"\xa0","\\nobreakspace"),Z("text",K,nt,"\xa0","\\ "),Z("text",K,nt,"\xa0","~"),Z("text",K,nt,"\xa0","\\space"),Z("text",K,nt,"\xa0","\\nobreakspace"),Z("math",K,nt,null,"\\nobreak"),Z("math",K,nt,null,"\\allowbreak"),Z("math",K,"punct",",",","),Z("math",K,"punct",";",";"),Z("math",J,Q,"\u22bc","\\barwedge",!0),Z("math",J,Q,"\u22bb","\\veebar",!0),Z("math",K,Q,"\u2299","\\odot",!0),Z("math",K,Q,"\u2295","\\oplus",!0),Z("math",K,Q,"\u2297","\\otimes",!0),Z("math",K,"textord","\u2202","\\partial",!0),Z("math",K,Q,"\u2298","\\oslash",!0),Z("math",J,Q,"\u229a","\\circledcirc",!0),Z("math",J,Q,"\u22a1","\\boxdot",!0),Z("math",K,Q,"\u25b3","\\bigtriangleup"),Z("math",K,Q,"\u25bd","\\bigtriangledown"),Z("math",K,Q,"\u2020","\\dagger"),Z("math",K,Q,"\u22c4","\\diamond"),Z("math",K,Q,"\u22c6","\\star"),Z("math",K,Q,"\u25c3","\\triangleleft"),Z("math",K,Q,"\u25b9","\\triangleright"),Z("math",K,"open","{","\\{"),Z("text",K,"textord","{","\\{"),Z("text",K,"textord","{","\\textbraceleft"),Z("math",K,"close","}","\\}"),Z("text",K,"textord","}","\\}"),Z("text",K,"textord","}","\\textbraceright"),Z("math",K,"open","{","\\lbrace"),Z("math",K,"close","}","\\rbrace"),Z("math",K,"open","[","\\lbrack"),Z("text",K,"textord","[","\\lbrack"),Z("math",K,"close","]","\\rbrack"),Z("text",K,"textord","]","\\rbrack"),Z("text",K,"textord","<","\\textless"),Z("text",K,"textord",">","\\textgreater"),Z("math",K,"open","\u230a","\\lfloor",!0),Z("math",K,"close","\u230b","\\rfloor",!0),Z("math",K,"open","\u2308","\\lceil",!0),Z("math",K,"close","\u2309","\\rceil",!0),Z("math",K,"textord","\\","\\backslash"),Z("math",K,"textord","\u2223","|"),Z("math",K,"textord","\u2223","\\vert"),Z("text",K,"textord","|","\\textbar"),Z("math",K,"textord","\u2225","\\|"),Z("math",K,"textord","\u2225","\\Vert"),Z("text",K,"textord","\u2225","\\textbardbl"),Z("text",K,"textord","~","\\textasciitilde"),Z("math",K,rt,"\u2191","\\uparrow",!0),Z("math",K,rt,"\u21d1","\\Uparrow",!0),Z("math",K,rt,"\u2193","\\downarrow",!0),Z("math",K,rt,"\u21d3","\\Downarrow",!0),Z("math",K,rt,"\u2195","\\updownarrow",!0),Z("math",K,rt,"\u21d5","\\Updownarrow",!0),Z("math",K,et,"\u2210","\\coprod"),Z("math",K,et,"\u22c1","\\bigvee"),Z("math",K,et,"\u22c0","\\bigwedge"),Z("math",K,et,"\u2a04","\\biguplus"),Z("math",K,et,"\u22c2","\\bigcap"),Z("math",K,et,"\u22c3","\\bigcup"),Z("math",K,et,"\u222b","\\int"),Z("math",K,et,"\u222b","\\intop"),Z("math",K,et,"\u222c","\\iint"),Z("math",K,et,"\u222d","\\iiint"),Z("math",K,et,"\u220f","\\prod"),Z("math",K,et,"\u2211","\\sum"),Z("math",K,et,"\u2a02","\\bigotimes"),Z("math",K,et,"\u2a01","\\bigoplus"),Z("math",K,et,"\u2a00","\\bigodot"),Z("math",K,et,"\u222e","\\oint"),Z("math",K,et,"\u222f","\\oiint"),Z("math",K,et,"\u2230","\\oiiint"),Z("math",K,et,"\u2a06","\\bigsqcup"),Z("math",K,et,"\u222b","\\smallint"),Z("text",K,"inner","\u2026","\\textellipsis"),Z("math",K,"inner","\u2026","\\mathellipsis"),Z("text",K,"inner","\u2026","\\ldots",!0),Z("math",K,"inner","\u2026","\\ldots",!0),Z("math",K,"inner","\u22ef","\\@cdots",!0),Z("math",K,"inner","\u22f1","\\ddots",!0),Z("math",K,"textord","\u22ee","\\varvdots"),Z("math",K,"accent-token","\u02ca","\\acute"),Z("math",K,"accent-token","\u02cb","\\grave"),Z("math",K,"accent-token","\xa8","\\ddot"),Z("math",K,"accent-token","~","\\tilde"),Z("math",K,"accent-token","\u02c9","\\bar"),Z("math",K,"accent-token","\u02d8","\\breve"),Z("math",K,"accent-token","\u02c7","\\check"),Z("math",K,"accent-token","^","\\hat"),Z("math",K,"accent-token","\u20d7","\\vec"),Z("math",K,"accent-token","\u02d9","\\dot"),Z("math",K,"accent-token","\u02da","\\mathring"),Z("math",K,tt,"\u0131","\\imath",!0),Z("math",K,tt,"\u0237","\\jmath",!0),Z("text",K,"textord","\u0131","\\i",!0),Z("text",K,"textord","\u0237","\\j",!0),Z("text",K,"textord","\xdf","\\ss",!0),Z("text",K,"textord","\xe6","\\ae",!0),Z("text",K,"textord","\xe6","\\ae",!0),Z("text",K,"textord","\u0153","\\oe",!0),Z("text",K,"textord","\xf8","\\o",!0),Z("text",K,"textord","\xc6","\\AE",!0),Z("text",K,"textord","\u0152","\\OE",!0),Z("text",K,"textord","\xd8","\\O",!0),Z("text",K,"accent-token","\u02ca","\\'"),Z("text",K,"accent-token","\u02cb","\\`"),Z("text",K,"accent-token","\u02c6","\\^"),Z("text",K,"accent-token","\u02dc","\\~"),Z("text",K,"accent-token","\u02c9","\\="),Z("text",K,"accent-token","\u02d8","\\u"),Z("text",K,"accent-token","\u02d9","\\."),Z("text",K,"accent-token","\u02da","\\r"),Z("text",K,"accent-token","\u02c7","\\v"),Z("text",K,"accent-token","\xa8",'\\"'),Z("text",K,"accent-token","\u02dd","\\H"),Z("text",K,"accent-token","\u25ef","\\textcircled");var at={"--":!0,"---":!0,"``":!0,"''":!0};Z("text",K,"textord","\u2013","--"),Z("text",K,"textord","\u2013","\\textendash"),Z("text",K,"textord","\u2014","---"),Z("text",K,"textord","\u2014","\\textemdash"),Z("text",K,"textord","\u2018","`"),Z("text",K,"textord","\u2018","\\textquoteleft"),Z("text",K,"textord","\u2019","'"),Z("text",K,"textord","\u2019","\\textquoteright"),Z("text",K,"textord","\u201c","``"),Z("text",K,"textord","\u201c","\\textquotedblleft"),Z("text",K,"textord","\u201d","''"),Z("text",K,"textord","\u201d","\\textquotedblright"),Z("math",K,"textord","\xb0","\\degree",!0),Z("text",K,"textord","\xb0","\\degree"),Z("text",K,"textord","\xb0","\\textdegree",!0),Z("math",K,tt,"\xa3","\\pounds"),Z("math",K,tt,"\xa3","\\mathsterling",!0),Z("text",K,tt,"\xa3","\\pounds"),Z("text",K,tt,"\xa3","\\textsterling",!0),Z("math",J,"textord","\u2720","\\maltese"),Z("text",J,"textord","\u2720","\\maltese"),Z("text",K,nt,"\xa0","\\ "),Z("text",K,nt,"\xa0"," "),Z("text",K,nt,"\xa0","~");for(var ot=0;ot<'0123456789/@."'.length;ot++){var it='0123456789/@."'.charAt(ot);Z("math",K,"textord",it,it)}for(var st=0;st<'0123456789!@*()-=+[]<>|";:?/.,'.length;st++){var ht='0123456789!@*()-=+[]<>|";:?/.,'.charAt(st);Z("text",K,"textord",ht,ht)}for(var lt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",mt=0;mt<lt.length;mt++){var ct=lt.charAt(mt);Z("math",K,tt,ct,ct),Z("text",K,"textord",ct,ct)}for(var pt="",ut=0;ut<lt.length;ut++){var dt=lt.charAt(ut);Z("math",K,tt,dt,pt=String.fromCharCode(55349,56320+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56372+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56424+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56580+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56736+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56788+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56840+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56944+ut)),Z("text",K,"textord",dt,pt),ut<26&&(Z("math",K,tt,dt,pt=String.fromCharCode(55349,56632+ut)),Z("text",K,"textord",dt,pt),Z("math",K,tt,dt,pt=String.fromCharCode(55349,56476+ut)),Z("text",K,"textord",dt,pt))}Z("math",K,tt,"k",pt=String.fromCharCode(55349,56668)),Z("text",K,"textord","k",pt);for(var ft=0;ft<10;ft++){var gt=ft.toString();Z("math",K,tt,gt,pt=String.fromCharCode(55349,57294+ft)),Z("text",K,"textord",gt,pt),Z("math",K,tt,gt,pt=String.fromCharCode(55349,57314+ft)),Z("text",K,"textord",gt,pt),Z("math",K,tt,gt,pt=String.fromCharCode(55349,57324+ft)),Z("text",K,"textord",gt,pt),Z("math",K,tt,gt,pt=String.fromCharCode(55349,57334+ft)),Z("text",K,"textord",gt,pt)}for(var xt=0;xt<"\xc7\xd0\xde\xe7\xfe".length;xt++){var vt="\xc7\xd0\xde\xe7\xfe".charAt(xt);Z("math",K,tt,vt,vt),Z("text",K,"textord",vt,vt)}Z("text",K,"textord","\xf0","\xf0"),Z("text",K,"textord","\u2013","\u2013"),Z("text",K,"textord","\u2014","\u2014"),Z("text",K,"textord","\u2018","\u2018"),Z("text",K,"textord","\u2019","\u2019"),Z("text",K,"textord","\u201c","\u201c"),Z("text",K,"textord","\u201d","\u201d");var yt=[["mathbf","textbf","Main-Bold"],["mathbf","textbf","Main-Bold"],["mathit","textit","Math-Italic"],["mathit","textit","Math-Italic"],["boldsymbol","boldsymbol","Main-BoldItalic"],["boldsymbol","boldsymbol","Main-BoldItalic"],["mathscr","textscr","Script-Regular"],["","",""],["","",""],["","",""],["mathfrak","textfrak","Fraktur-Regular"],["mathfrak","textfrak","Fraktur-Regular"],["mathbb","textbb","AMS-Regular"],["mathbb","textbb","AMS-Regular"],["","",""],["","",""],["mathsf","textsf","SansSerif-Regular"],["mathsf","textsf","SansSerif-Regular"],["mathboldsf","textboldsf","SansSerif-Bold"],["mathboldsf","textboldsf","SansSerif-Bold"],["mathitsf","textitsf","SansSerif-Italic"],["mathitsf","textitsf","SansSerif-Italic"],["","",""],["","",""],["mathtt","texttt","Typewriter-Regular"],["mathtt","texttt","Typewriter-Regular"]],bt=[["mathbf","textbf","Main-Bold"],["","",""],["mathsf","textsf","SansSerif-Regular"],["mathboldsf","textboldsf","SansSerif-Bold"],["mathtt","texttt","Typewriter-Regular"]],wt=[[1,1,1],[2,1,1],[3,1,1],[4,2,1],[5,2,1],[6,3,1],[7,4,2],[8,6,3],[9,7,6],[10,8,7],[11,10,9]],kt=[.5,.6,.7,.8,.9,1,1.2,1.44,1.728,2.074,2.488],St=function(t,e){return e.size<2?t:wt[t-1][e.size-1]},Mt=function(){function t(e){a()(this,t),this.style=e.style,this.color=e.color,this.size=e.size||t.BASESIZE,this.textSize=e.textSize||this.size,this.phantom=!!e.phantom,this.font=e.font||"",this.fontFamily=e.fontFamily||"",this.fontWeight=e.fontWeight||"",this.fontShape=e.fontShape||"",this.sizeMultiplier=kt[this.size-1],this.maxSize=e.maxSize,this._fontMetrics=void 0}return t.prototype.extend=function(e){var r={style:this.style,size:this.size,textSize:this.textSize,color:this.color,phantom:this.phantom,font:this.font,fontFamily:this.fontFamily,fontWeight:this.fontWeight,fontShape:this.fontShape,maxSize:this.maxSize};for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);return new t(r)},t.prototype.havingStyle=function(t){return this.style===t?this:this.extend({style:t,size:St(this.textSize,t)})},t.prototype.havingCrampedStyle=function(){return this.havingStyle(this.style.cramp())},t.prototype.havingSize=function(t){return this.size===t&&this.textSize===t?this:this.extend({style:this.style.text(),size:t,textSize:t,sizeMultiplier:kt[t-1]})},t.prototype.havingBaseStyle=function(e){e=e||this.style.text();var r=St(t.BASESIZE,e);return this.size===r&&this.textSize===t.BASESIZE&&this.style===e?this:this.extend({style:e,size:r})},t.prototype.havingBaseSizing=function(){var t=void 0;switch(this.style.id){case 4:case 5:t=3;break;case 6:case 7:t=1;break;default:t=6}return this.extend({style:this.style.text(),size:t})},t.prototype.withColor=function(t){return this.extend({color:t})},t.prototype.withPhantom=function(){return this.extend({phantom:!0})},t.prototype.withFont=function(t){return this.extend({font:t})},t.prototype.withTextFontFamily=function(t){return this.extend({fontFamily:t,font:""})},t.prototype.withTextFontWeight=function(t){return this.extend({fontWeight:t,font:""})},t.prototype.withTextFontShape=function(t){return this.extend({fontShape:t,font:""})},t.prototype.sizingClasses=function(t){return t.size!==this.size?["sizing","reset-size"+t.size,"size"+this.size]:[]},t.prototype.baseSizingClasses=function(){return this.size!==t.BASESIZE?["sizing","reset-size"+this.size,"size"+t.BASESIZE]:[]},t.prototype.fontMetrics=function(){return this._fontMetrics||(this._fontMetrics=function(t){var e=void 0;if(!Y[e=t>=5?0:t>=3?1:2]){var r=Y[e]={cssEmPerMu:G.quad[e]/18};for(var n in G)G.hasOwnProperty(n)&&(r[n]=G[n][e])}return Y[e]}(this.size)),this._fontMetrics},t.prototype.getColor=function(){return this.phantom?"transparent":null!=this.color&&t.colorMap.hasOwnProperty(this.color)?t.colorMap[this.color]:this.color},t}();Mt.BASESIZE=6,Mt.colorMap={"katex-blue":"#6495ed","katex-orange":"#ffa500","katex-pink":"#ff00af","katex-red":"#df0030","katex-green":"#28ae7b","katex-gray":"gray","katex-purple":"#9d38bd","katex-blueA":"#ccfaff","katex-blueB":"#80f6ff","katex-blueC":"#63d9ea","katex-blueD":"#11accd","katex-blueE":"#0c7f99","katex-tealA":"#94fff5","katex-tealB":"#26edd5","katex-tealC":"#01d1c1","katex-tealD":"#01a995","katex-tealE":"#208170","katex-greenA":"#b6ffb0","katex-greenB":"#8af281","katex-greenC":"#74cf70","katex-greenD":"#1fab54","katex-greenE":"#0d923f","katex-goldA":"#ffd0a9","katex-goldB":"#ffbb71","katex-goldC":"#ff9c39","katex-goldD":"#e07d10","katex-goldE":"#a75a05","katex-redA":"#fca9a9","katex-redB":"#ff8482","katex-redC":"#f9685d","katex-redD":"#e84d39","katex-redE":"#bc2612","katex-maroonA":"#ffbde0","katex-maroonB":"#ff92c6","katex-maroonC":"#ed5fa6","katex-maroonD":"#ca337c","katex-maroonE":"#9e034e","katex-purpleA":"#ddd7ff","katex-purpleB":"#c6b9fc","katex-purpleC":"#aa87ff","katex-purpleD":"#7854ab","katex-purpleE":"#543b78","katex-mintA":"#f5f9e8","katex-mintB":"#edf2df","katex-mintC":"#e0e5cc","katex-grayA":"#f6f7f7","katex-grayB":"#f0f1f2","katex-grayC":"#e3e5e6","katex-grayD":"#d6d8da","katex-grayE":"#babec2","katex-grayF":"#888d93","katex-grayG":"#626569","katex-grayH":"#3b3e40","katex-grayI":"#21242c","katex-kaBlue":"#314453","katex-kaGreen":"#71B307"};var zt=Mt,Tt={pt:1,mm:7227/2540,cm:7227/254,in:72.27,bp:1.00375,pc:12,dd:1238/1157,cc:14856/1157,nd:685/642,nc:1370/107,sp:1/65536,px:1.00375},At={ex:!0,em:!0,mu:!0},Bt=function(t,e){var r=void 0;if(t.unit in Tt)r=Tt[t.unit]/e.fontMetrics().ptPerEm/e.sizeMultiplier;else if("mu"===t.unit)r=e.fontMetrics().cssEmPerMu;else{var n=void 0;if(n=e.style.isTight()?e.havingStyle(e.style.text()):e,"ex"===t.unit)r=n.fontMetrics().xHeight;else{if("em"!==t.unit)throw new h("Invalid unit: '"+t.unit+"'");r=n.fontMetrics().quad}n!==e&&(r*=n.sizeMultiplier/e.sizeMultiplier)}return Math.min(t.number*r,e.maxSize)},Ct=["\\imath","\u0131","\\jmath","\u0237","\\pounds","\\mathsterling","\\textsterling","\xa3"],Nt=function(t,e,r){return $[r][t]&&$[r][t].replace&&(t=$[r][t].replace),{value:t,metrics:X(t,e,r)}},qt=function(t,e,r,n,a){var o=Nt(t,e,r),i=o.metrics;t=o.value;var s=void 0;if(i){var h=i.italic;"text"===r&&(h=0),s=new H(t,i.height,i.depth,h,i.skew,i.width,a)}else"undefined"!=typeof console&&console.warn("No character metrics for '"+t+"' in style '"+e+"'"),s=new H(t,0,0,0,0,0,a);if(n){s.maxFontSize=n.sizeMultiplier,n.style.isTight()&&s.classes.push("mtight");var l=n.getColor();l&&(s.style.color=l)}return s},Et=function(t,e,r,n,a){if("mathord"===a){var o=Ot(t,e,r,n);return qt(t,o.fontName,e,r,n.concat([o.fontClass]))}if("textord"===a){var i=$[e][t]&&$[e][t].font;if("ams"===i){var s=Dt("amsrm",r.fontWeight,r.fontShape);return qt(t,s,e,r,n.concat("amsrm",r.fontWeight,r.fontShape))}if("main"!==i&&i){var h=Dt(i,r.fontWeight,r.fontShape);return qt(t,h,e,r,n.concat(h,r.fontWeight,r.fontShape))}var l=Dt("textrm",r.fontWeight,r.fontShape);return qt(t,l,e,r,n.concat(r.fontWeight,r.fontShape))}throw new Error("unexpected type: "+a+" in mathDefault")},Ot=function(t,e,r,n){return/[0-9]/.test(t.charAt(0))||d.contains(Ct,t)?{fontName:"Main-Italic",fontClass:"mainit"}:{fontName:"Math-Italic",fontClass:"mathit"}},It=function(t){for(var e=0,r=0,n=0,a=0;a<t.children.length;a++){var o=t.children[a];o.height>e&&(e=o.height),o.depth>r&&(r=o.depth),o.maxFontSize>n&&(n=o.maxFontSize)}t.height=e,t.depth=r,t.maxFontSize=n},Rt=function(t,e,r,n){var a=new I(t,e,r,n);return It(a),a},Lt=function(t,e,r,n){return new I(t,e,r,n)},Ht=function(t){var e=new C(t);return It(e),e},Dt=function(t,e,r){var n="";switch(t){case"amsrm":n="AMS";break;case"textrm":n="Main";break;case"textsf":n="SansSerif";break;case"texttt":n="Typewriter";break;default:n=t}return n+"-"+("textbf"===e&&"textit"===r?"BoldItalic":"textbf"===e?"Bold":"textit"===e?"Italic":"Regular")},Pt={mathbf:{variant:"bold",fontName:"Main-Bold"},mathrm:{variant:"normal",fontName:"Main-Regular"},textit:{variant:"italic",fontName:"Main-Italic"},mathbb:{variant:"double-struck",fontName:"AMS-Regular"},mathcal:{variant:"script",fontName:"Caligraphic-Regular"},mathfrak:{variant:"fraktur",fontName:"Fraktur-Regular"},mathscr:{variant:"script",fontName:"Script-Regular"},mathsf:{variant:"sans-serif",fontName:"SansSerif-Regular"},mathtt:{variant:"monospace",fontName:"Typewriter-Regular"}},Ft={vec:["vec",.471,.714],oiintSize1:["oiintSize1",.957,.499],oiintSize2:["oiintSize2",1.472,.659],oiiintSize1:["oiiintSize1",1.304,.499],oiiintSize2:["oiiintSize2",1.98,.659]},Vt={fontMap:Pt,makeSymbol:qt,mathsym:function(t,e,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[];return r&&r.font&&"boldsymbol"===r.font&&Nt(t,"Main-Bold",e).metrics?qt(t,"Main-Bold",e,r,n.concat(["mathbf"])):"\\"===t||"main"===$[e][t].font?qt(t,"Main-Regular",e,r,n):qt(t,"AMS-Regular",e,r,n.concat(["amsrm"]))},makeSpan:Rt,makeSvgSpan:Lt,makeLineSpan:function(t,e,r){var n=Rt([t],[],e);return n.height=r||e.fontMetrics().defaultRuleThickness,n.style.borderBottomWidth=n.height+"em",n.maxFontSize=1,n},makeAnchor:function(t,e,r,n){var a=new R(t,e,r,n);return It(a),a},makeFragment:Ht,makeVList:function(t,e){for(var r=function(t){if("individualShift"===t.positionType){for(var e=t.children,r=[e[0]],n=-e[0].shift-e[0].elem.depth,a=n,o=1;o<e.length;o++){var i=-e[o].shift-a-e[o].elem.depth,s=i-(e[o-1].elem.height+e[o-1].elem.depth);a+=i,r.push({type:"kern",size:s}),r.push(e[o])}return{children:r,depth:n}}var h=void 0;if("top"===t.positionType){for(var l=t.positionData,m=0;m<t.children.length;m++){var c=t.children[m];l-="kern"===c.type?c.size:c.elem.height+c.elem.depth}h=l}else if("bottom"===t.positionType)h=-t.positionData;else{var p=t.children[0];if("elem"!==p.type)throw new Error('First child must have type "elem".');if("shift"===t.positionType)h=-p.elem.depth-t.positionData;else{if("firstBaseline"!==t.positionType)throw new Error("Invalid positionType "+t.positionType+".");h=-p.elem.depth}}return{children:t.children,depth:h}}(t),n=r.children,a=r.depth,o=0,i=0;i<n.length;i++){var s=n[i];if("elem"===s.type){var h=s.elem;o=Math.max(o,h.maxFontSize,h.height)}}o+=2;var l=Rt(["pstrut"],[]);l.style.height=o+"em";for(var m=[],c=a,p=a,u=a,d=0;d<n.length;d++){var f=n[d];if("kern"===f.type)u+=f.size;else{var g=f.elem,x=f.wrapperClasses||[],v=f.wrapperStyle||{},y=Rt(x,[l,g],void 0,v);y.style.top=-o-u-g.depth+"em",f.marginLeft&&(y.style.marginLeft=f.marginLeft),f.marginRight&&(y.style.marginRight=f.marginRight),m.push(y),u+=g.height+g.depth}c=Math.min(c,u),p=Math.max(p,u)}var b=Rt(["vlist"],m);b.style.height=p+"em";var w=void 0;if(c<0){var k=Rt([],[]),S=Rt(["vlist"],[k]);S.style.height=-c+"em";var M=Rt(["vlist-s"],[new H("\u200b")]);w=[Rt(["vlist-r"],[b,M]),Rt(["vlist-r"],[S])]}else w=[Rt(["vlist-r"],[b])];var z=Rt(["vlist-t"],w);return 2===w.length&&z.classes.push("vlist-t2"),z.height=p,z.depth=-c,z},makeOrd:function(t,e,r){var n=t.mode,a=t.text,o=["mord"],i="math"===n||"text"===n&&e.font,s=i?e.font:e.fontFamily;if(55349===a.charCodeAt(0)){var l=function(t,e){var r=1024*(t.charCodeAt(0)-55296)+(t.charCodeAt(1)-56320)+65536,n="math"===e?0:1;if(119808<=r&&r<120484){var a=Math.floor((r-119808)/26);return[yt[a][2],yt[a][n]]}if(120782<=r&&r<=120831){var o=Math.floor((r-120782)/10);return[bt[o][2],bt[o][n]]}if(120485===r||120486===r)return[yt[0][2],yt[0][n]];if(120486<r&&r<120782)return["",""];throw new h("Unsupported character: "+t)}(a,n),m=l[0],c=l[1];return qt(a,m,n,e,o.concat(c))}if(s){var p=void 0,u=void 0;if("boldsymbol"===s){var f=function(t,e,r,n){return Nt(t,"Math-BoldItalic",e).metrics?{fontName:"Math-BoldItalic",fontClass:"boldsymbol"}:{fontName:"Main-Bold",fontClass:"mathbf"}}(a,n);p=f.fontName,u=[f.fontClass]}else if("mathit"===s||d.contains(Ct,a)){var g=Ot(a,n,e,o);p=g.fontName,u=[g.fontClass]}else i?(p=Pt[s].fontName,u=[s]):(p=Dt(s,e.fontWeight,e.fontShape),u=[s,e.fontWeight,e.fontShape]);if(Nt(a,p,n).metrics)return qt(a,p,n,e,o.concat(u));if(at.hasOwnProperty(a)&&"Typewriter"===p.substr(0,10)){for(var x=[],v=0;v<a.length;v++)x.push(qt(a[v],p,n,e,o.concat(u)));return Ht(x)}return Et(a,n,e,o,r)}return Et(a,n,e,o,r)},makeVerb:function(t,e){var r=t.body;return r=t.star?r.replace(/ /g,"\u2423"):r.replace(/ /g,"\xa0")},makeGlue:function(t,e){var r=Rt(["mspace"],[],e),n=Bt(t,e);return r.style.marginRight=n+"em",r},staticSvg:function(t,e){var r=Ft[t],n=r[0],a=r[1],o=r[2],i=new P(n),s=new D([i],{width:a+"em",height:o+"em",style:"width:"+a+"em",viewBox:"0 0 "+1e3*a+" "+1e3*o,preserveAspectRatio:"xMinYMin"}),h=Lt(["overlay"],[s],e);return h.height=o,h.style.height=o+"em",h.style.width=a+"em",h},svgData:Ft,tryCombineChars:function(t){for(var e=0;e<t.length-1;e++)t[e].tryCombine(t[e+1])&&(t.splice(e+1,1),e--);return t},cssSpace:{"\\nobreak":"nobreak","\\allowbreak":"allowbreak"},regularSpace:{" ":{},"\\ ":{},"~":{className:"nobreak"},"\\space":{},"\\nobreakspace":{className:"nobreak"}}};function Gt(t,e){var r=Ut(t,e);if(!r)throw new Error("Expected node of type "+e+", but got "+(t?"node of type "+t.type:String(t)));return r}function Ut(t,e){return t&&t.type===e?t:null}function Xt(t,e){var r=function(t,e){return t&&"atom"===t.type&&t.family===e?t:null}(t,e);if(!r)throw new Error('Expected node of type "atom" and family "'+e+'", but got '+(t?"atom"===t.type?"atom of family "+t.family:"node of type "+t.type:String(t)));return r}function Yt(t){return t&&("atom"===t.type||W.hasOwnProperty(t.type))?t:null}var _t={number:3,unit:"mu"},Wt={number:4,unit:"mu"},jt={number:5,unit:"mu"},$t={mord:{mop:_t,mbin:Wt,mrel:jt,minner:_t},mop:{mord:_t,mop:_t,mrel:jt,minner:_t},mbin:{mord:Wt,mop:Wt,mopen:Wt,minner:Wt},mrel:{mord:jt,mop:jt,mopen:jt,minner:jt},mopen:{},mclose:{mop:_t,mbin:Wt,mrel:jt,minner:_t},mpunct:{mord:_t,mop:_t,mrel:jt,mopen:_t,mclose:_t,mpunct:_t,minner:_t},minner:{mord:_t,mop:_t,mbin:Wt,mrel:jt,mopen:_t,mpunct:_t,minner:_t}},Zt={mord:{mop:_t},mop:{mord:_t,mop:_t},mbin:{},mrel:{},mopen:{},mclose:{mop:_t},mpunct:{},minner:{mop:_t}},Kt={},Jt={},Qt={};function te(t){for(var e=t.type,r=(t.nodeType,t.names),n=t.props,a=t.handler,o=t.htmlBuilder,i=t.mathmlBuilder,s={type:e,numArgs:n.numArgs,argTypes:n.argTypes,greediness:void 0===n.greediness?1:n.greediness,allowedInText:!!n.allowedInText,allowedInMath:void 0===n.allowedInMath||n.allowedInMath,numOptionalArgs:n.numOptionalArgs||0,infix:!!n.infix,consumeMode:n.consumeMode,handler:a},h=0;h<r.length;++h)Kt[r[h]]=s;e&&(o&&(Jt[e]=o),i&&(Qt[e]=i))}function ee(t){te({type:t.type,names:[],props:{numArgs:0},handler:function(){throw new Error("Should never be called.")},htmlBuilder:t.htmlBuilder,mathmlBuilder:t.mathmlBuilder})}var re=function(t){var e=Ut(t,"ordgroup");return e?e.body:[t]},ne=Vt.makeSpan,ae=function(t,e){return t?d.contains(["mbin","mopen","mrel","mop","mpunct"],me(t,"right")):e},oe=function(t,e){return t?d.contains(["mrel","mclose","mpunct"],me(t,"left")):e},ie={display:M.DISPLAY,text:M.TEXT,script:M.SCRIPT,scriptscript:M.SCRIPTSCRIPT},se={mord:"mord",mop:"mop",mbin:"mbin",mrel:"mrel",mopen:"mopen",mclose:"mclose",mpunct:"mpunct",minner:"minner"},he=function(t,e,r){for(var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:[null,null],a=[],o=0;o<t.length;o++){var i=ue(t[o],e);if(i instanceof C){var s=i.children;a.push.apply(a,s)}else a.push(i)}for(var h=[n[0]?ne([n[0]],[],e):null].concat(a.filter(function(t){return t&&"mspace"!==t.classes[0]}),[n[1]?ne([n[1]],[],e):null]),l=1;l<h.length-1;l++){var m=u(h[l]),c=le(m,"left");"mbin"===c.classes[0]&&ae(h[l-1],r)&&(c.classes[0]="mord");var p=le(m,"right");"mbin"===p.classes[0]&&oe(h[l+1],r)&&(p.classes[0]="mord")}for(var d=[],f=0,g=0;g<a.length;g++)if(d.push(a[g]),"mspace"!==a[g].classes[0]&&f<h.length-1){0===f&&(d.pop(),g--);var x=me(h[f],"right"),v=me(h[f+1],"left");if(x&&v&&r){var y=u(h[f+1]),b=ce(y)?Zt[x][v]:$t[x][v];if(b){var w=e;if(1===t.length){var k=Ut(t[0],"sizing")||Ut(t[0],"styling");k&&("sizing"===k.type?w=e.havingSize(k.size):"styling"===k.type&&(w=e.havingStyle(ie[k.style])))}d.push(Vt.makeGlue(b,w))}}f++}return d},le=function t(e,r){if(e instanceof C||e instanceof R){var n=e.children;if(n.length){if("right"===r)return t(n[n.length-1],"right");if("left"===r)return t(n[0],"right")}}return e},me=function(t,e){return t?(t=le(t,e),se[t.classes[0]]||null):null},ce=function(t){return(t=le(t,"left")).hasClass("mtight")},pe=function(t,e){var r=["nulldelimiter"].concat(t.baseSizingClasses());return ne(e.concat(r))},ue=function(t,e,r){if(!t)return ne();if(Jt[t.type]){var n=Jt[t.type](t,e);if(r&&e.size!==r.size){n=ne(e.sizingClasses(r),[n],e);var a=e.sizeMultiplier/r.sizeMultiplier;n.height*=a,n.depth*=a}return n}throw new h("Got group of unknown type: '"+t.type+"'")};function de(t,e){var r=ne(["base"],t,e),n=ne(["strut"]);return n.style.height=r.height+r.depth+"em",n.style.verticalAlign=-r.depth+"em",r.children.unshift(n),r}function fe(t,e){var r=null;1===t.length&&"tag"===t[0].type&&(r=t[0].tag,t=t[0].body);for(var n=he(t,e,!0),a=[],o=[],i=0;i<n.length;i++)if(o.push(n[i]),n[i].hasClass("mbin")||n[i].hasClass("mrel")||n[i].hasClass("allowbreak")){for(var s=!1;i<n.length-1&&n[i+1].hasClass("mspace");)i++,o.push(n[i]),n[i].hasClass("nobreak")&&(s=!0);s||(a.push(de(o,e)),o=[])}else n[i].hasClass("newline")&&(o.pop(),o.length>0&&(a.push(de(o,e)),o=[]),a.push(n[i]));o.length>0&&a.push(de(o,e));var h=void 0;r&&((h=de(he(r,e,!0))).classes=["tag"],a.push(h));var l=ne(["katex-html"],a);if(l.setAttribute("aria-hidden","true"),h){var m=h.children[0];m.style.height=l.height+l.depth+"em",m.style.verticalAlign=-l.depth+"em"}return l}function ge(t){return new C(t)}var xe=function(){function t(e,r){a()(this,t),this.type=e,this.attributes={},this.children=r||[]}return t.prototype.setAttribute=function(t,e){this.attributes[t]=e},t.prototype.getAttribute=function(t){return this.attributes[t]},t.prototype.toNode=function(){var t=document.createElementNS("http://www.w3.org/1998/Math/MathML",this.type);for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&t.setAttribute(e,this.attributes[e]);for(var r=0;r<this.children.length;r++)t.appendChild(this.children[r].toNode());return t},t.prototype.toMarkup=function(){var t="<"+this.type;for(var e in this.attributes)Object.prototype.hasOwnProperty.call(this.attributes,e)&&(t+=" "+e+'="',t+=d.escape(this.attributes[e]),t+='"');t+=">";for(var r=0;r<this.children.length;r++)t+=this.children[r].toMarkup();return t+="</"+this.type+">"},t.prototype.toText=function(){return this.children.map(function(t){return t.toText()}).join("")},t}(),ve=function(){function t(e){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];a()(this,t),this.text=e,this.needsEscape=r}return t.prototype.toNode=function(){return document.createTextNode(this.toText())},t.prototype.toMarkup=function(){return this.toText()},t.prototype.toText=function(){return this.needsEscape?d.escape(this.text):this.text},t}(),ye=function(){function t(e){a()(this,t),this.width=e,this.character=e>=.05555&&e<=.05556?"&VeryThinSpace;":e>=.1666&&e<=.1667?"&ThinSpace;":e>=.2222&&e<=.2223?"&MediumSpace;":e>=.2777&&e<=.2778?"&ThickSpace;":e>=-.05556&&e<=-.05555?"&NegativeVeryThinSpace;":e>=-.1667&&e<=-.1666?"&NegativeThinSpace;":e>=-.2223&&e<=-.2222?"&NegativeMediumSpace;":e>=-.2778&&e<=-.2777?"&NegativeThickSpace;":null}return t.prototype.toNode=function(){if(this.character)return document.createTextNode(this.character);var t=document.createElementNS("http://www.w3.org/1998/Math/MathML","mspace");return t.setAttribute("width",this.width+"em"),t},t.prototype.toMarkup=function(){return this.character?"<mtext>"+this.character+"</mtext>":'<mspace width="'+this.width+'em"/>'},t.prototype.toText=function(){return this.character?this.character:" "},t}(),be={MathNode:xe,TextNode:ve,SpaceNode:ye,newDocumentFragment:ge},we=function(t,e,r){return!$[e][t]||!$[e][t].replace||55349===t.charCodeAt(0)||at.hasOwnProperty(t)&&r&&(r.fontFamily&&"tt"===r.fontFamily.substr(4,2)||r.font&&"tt"===r.font.substr(4,2))||(t=$[e][t].replace),new be.TextNode(t)},ke=function(t){return 1===t.length?t[0]:new be.MathNode("mrow",t)},Se=function(t,e){if("texttt"===e.fontFamily)return"monospace";if("textsf"===e.fontFamily)return"textit"===e.fontShape&&"textbf"===e.fontWeight?"sans-serif-bold-italic":"textit"===e.fontShape?"sans-serif-italic":"textbf"===e.fontWeight?"bold-sans-serif":"sans-serif";if("textit"===e.fontShape&&"textbf"===e.fontWeight)return"bold-italic";if("textit"===e.fontShape)return"italic";if("textbf"===e.fontWeight)return"bold";var r=e.font;if(!r)return null;var n=t.mode;if("mathit"===r)return"italic";if("boldsymbol"===r)return"bold-italic";var a=t.text;return d.contains(["\\imath","\\jmath"],a)?null:($[n][a]&&$[n][a].replace&&(a=$[n][a].replace),X(a,Vt.fontMap[r].fontName,n)?Vt.fontMap[r].variant:null)},Me=function(t,e){for(var r=[],n=void 0,a=0;a<t.length;a++){var o=Te(t[a],e);if(o instanceof xe&&n instanceof xe){if("mtext"===o.type&&"mtext"===n.type&&o.getAttribute("mathvariant")===n.getAttribute("mathvariant")){var i;(i=n.children).push.apply(i,o.children);continue}if("mn"===o.type&&"mn"===n.type){var s;(s=n.children).push.apply(s,o.children);continue}if("mi"===o.type&&1===o.children.length&&"mn"===n.type){var h=o.children[0];if(h instanceof ve&&"."===h.text){var l;(l=n.children).push.apply(l,o.children);continue}}}r.push(o),n=o}return r},ze=function(t,e){return ke(Me(t,e))},Te=function(t,e){if(!t)return new be.MathNode("mrow");if(Qt[t.type])return Qt[t.type](t,e);throw new h("Got group of unknown type: '"+t.type+"'")};var Ae=function(t){return new zt({style:t.displayMode?M.DISPLAY:M.TEXT,maxSize:t.maxSize})},Be=function(t,e,r){var n=Ae(r),a=function(t,e,r){var n=Me(t,r),a=void 0;a=1===n.length&&n[0]instanceof xe&&d.contains(["mrow","mtable"],n[0].type)?n[0]:new be.MathNode("mrow",n);var o=new be.MathNode("annotation",[new be.TextNode(e)]);o.setAttribute("encoding","application/x-tex");var i=new be.MathNode("semantics",[a,o]),s=new be.MathNode("math",[i]);return Vt.makeSpan(["katex-mathml"],[s])}(t,e,n),o=fe(t,n),i=Vt.makeSpan(["katex"],[a,o]);return r.displayMode?Vt.makeSpan(["katex-display"],[i]):i},Ce={widehat:"^",widecheck:"\u02c7",widetilde:"~",utilde:"~",overleftarrow:"\u2190",underleftarrow:"\u2190",xleftarrow:"\u2190",overrightarrow:"\u2192",underrightarrow:"\u2192",xrightarrow:"\u2192",underbrace:"\u23b5",overbrace:"\u23de",overleftrightarrow:"\u2194",underleftrightarrow:"\u2194",xleftrightarrow:"\u2194",Overrightarrow:"\u21d2",xRightarrow:"\u21d2",overleftharpoon:"\u21bc",xleftharpoonup:"\u21bc",overrightharpoon:"\u21c0",xrightharpoonup:"\u21c0",xLeftarrow:"\u21d0",xLeftrightarrow:"\u21d4",xhookleftarrow:"\u21a9",xhookrightarrow:"\u21aa",xmapsto:"\u21a6",xrightharpoondown:"\u21c1",xleftharpoondown:"\u21bd",xrightleftharpoons:"\u21cc",xleftrightharpoons:"\u21cb",xtwoheadleftarrow:"\u219e",xtwoheadrightarrow:"\u21a0",xlongequal:"=",xtofrom:"\u21c4",xrightleftarrows:"\u21c4",xrightequilibrium:"\u21cc",xleftequilibrium:"\u21cb"},Ne={overrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],overleftarrow:[["leftarrow"],.888,522,"xMinYMin"],underrightarrow:[["rightarrow"],.888,522,"xMaxYMin"],underleftarrow:[["leftarrow"],.888,522,"xMinYMin"],xrightarrow:[["rightarrow"],1.469,522,"xMaxYMin"],xleftarrow:[["leftarrow"],1.469,522,"xMinYMin"],Overrightarrow:[["doublerightarrow"],.888,560,"xMaxYMin"],xRightarrow:[["doublerightarrow"],1.526,560,"xMaxYMin"],xLeftarrow:[["doubleleftarrow"],1.526,560,"xMinYMin"],overleftharpoon:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoonup:[["leftharpoon"],.888,522,"xMinYMin"],xleftharpoondown:[["leftharpoondown"],.888,522,"xMinYMin"],overrightharpoon:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoonup:[["rightharpoon"],.888,522,"xMaxYMin"],xrightharpoondown:[["rightharpoondown"],.888,522,"xMaxYMin"],xlongequal:[["longequal"],.888,334,"xMinYMin"],xtwoheadleftarrow:[["twoheadleftarrow"],.888,334,"xMinYMin"],xtwoheadrightarrow:[["twoheadrightarrow"],.888,334,"xMaxYMin"],overleftrightarrow:[["leftarrow","rightarrow"],.888,522],overbrace:[["leftbrace","midbrace","rightbrace"],1.6,548],underbrace:[["leftbraceunder","midbraceunder","rightbraceunder"],1.6,548],underleftrightarrow:[["leftarrow","rightarrow"],.888,522],xleftrightarrow:[["leftarrow","rightarrow"],1.75,522],xLeftrightarrow:[["doubleleftarrow","doublerightarrow"],1.75,560],xrightleftharpoons:[["leftharpoondownplus","rightharpoonplus"],1.75,716],xleftrightharpoons:[["leftharpoonplus","rightharpoondownplus"],1.75,716],xhookleftarrow:[["leftarrow","righthook"],1.08,522],xhookrightarrow:[["lefthook","rightarrow"],1.08,522],overlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],underlinesegment:[["leftlinesegment","rightlinesegment"],.888,522],overgroup:[["leftgroup","rightgroup"],.888,342],undergroup:[["leftgroupunder","rightgroupunder"],.888,342],xmapsto:[["leftmapsto","rightarrow"],1.5,522],xtofrom:[["leftToFrom","rightToFrom"],1.75,528],xrightleftarrows:[["baraboveleftarrow","rightarrowabovebar"],1.75,901],xrightequilibrium:[["baraboveshortleftharpoon","rightharpoonaboveshortbar"],1.75,716],xleftequilibrium:[["shortbaraboveleftharpoon","shortrightharpoonabovebar"],1.75,716]},qe=function(t){return"ordgroup"===t.type?t.body.length:1},Ee=function(t,e,r,n){var a=void 0,o=t.height+t.depth+2*r;if(/fbox|color/.test(e)){if(a=Vt.makeSpan(["stretchy",e],[],n),"fbox"===e){var i=n.color&&n.getColor();i&&(a.style.borderColor=i)}}else{var s=[];/^[bx]cancel$/.test(e)&&s.push(new F({x1:"0",y1:"0",x2:"100%",y2:"100%","stroke-width":"0.046em"})),/^x?cancel$/.test(e)&&s.push(new F({x1:"0",y1:"100%",x2:"100%",y2:"0","stroke-width":"0.046em"}));var h=new D(s,{width:"100%",height:o+"em"});a=Vt.makeSvgSpan([],[h],n)}return a.height=o,a.style.height=o+"em",a},Oe=function(t){var e=new be.MathNode("mo",[new be.TextNode(Ce[t.substr(1)])]);return e.setAttribute("stretchy","true"),e},Ie=function(t,e){var r=function(){var r=4e5,n=t.label.substr(1);if(d.contains(["widehat","widecheck","widetilde","utilde"],n)){var a=qe(t.base),o=void 0,i=void 0,s=void 0;if(a>5)"widehat"===n||"widecheck"===n?(o=420,r=2364,s=.42,i=n+"4"):(o=312,r=2340,s=.34,i="tilde4");else{var h=[1,1,2,2,3,3][a];"widehat"===n||"widecheck"===n?(r=[0,1062,2364,2364,2364][h],o=[0,239,300,360,420][h],s=[0,.24,.3,.3,.36,.42][h],i=n+h):(r=[0,600,1033,2339,2340][h],o=[0,260,286,306,312][h],s=[0,.26,.286,.3,.306,.34][h],i="tilde"+h)}var l=new P(i),m=new D([l],{width:"100%",height:s+"em",viewBox:"0 0 "+r+" "+o,preserveAspectRatio:"none"});return{span:Vt.makeSvgSpan([],[m],e),minWidth:0,height:s}}var c=[],p=Ne[n],u=p[0],f=p[1],g=p[2],x=g/1e3,v=u.length,y=void 0,b=void 0;if(1===v)y=["hide-tail"],b=[p[3]];else if(2===v)y=["halfarrow-left","halfarrow-right"],b=["xMinYMin","xMaxYMin"];else{if(3!==v)throw new Error("Correct katexImagesData or update code here to support\n                    "+v+" children.");y=["brace-left","brace-center","brace-right"],b=["xMinYMin","xMidYMin","xMaxYMin"]}for(var w=0;w<v;w++){var k=new P(u[w]),S=new D([k],{width:"400em",height:x+"em",viewBox:"0 0 "+r+" "+g,preserveAspectRatio:b[w]+" slice"}),M=Vt.makeSvgSpan([y[w]],[S],e);if(1===v)return{span:M,minWidth:f,height:x};M.style.height=x+"em",c.push(M)}return{span:Vt.makeSpan(["stretchy"],c,e),minWidth:f,height:x}}(),n=r.span,a=r.minWidth,o=r.height;return n.height=o,n.style.height=o+"em",a>0&&(n.style.minWidth=a+"em"),n},Re=function(t,e){var r=void 0,n=void 0,a=Ut(t,"supsub"),o=void 0;a?(r=(n=Gt(a.base,"accent")).base,a.base=r,o=function(t){if(t instanceof I)return t;throw new Error("Expected span<HtmlDomNode> but got "+String(t)+".")}(ue(a,e)),a.base=n):r=(n=Gt(t,"accent")).base;var i=ue(r,e.havingCrampedStyle()),s=0;if(n.isShifty&&d.isCharacterBox(r)){var h=d.getBaseElem(r);s=function(t){if(t instanceof H)return t;throw new Error("Expected symbolNode but got "+String(t)+".")}(ue(h,e.havingCrampedStyle())).skew}var l=Math.min(i.height,e.fontMetrics().xHeight),m=void 0;if(n.isStretchy)m=Ie(n,e),m=Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:i},{type:"elem",elem:m,wrapperClasses:["svg-align"],wrapperStyle:s>0?{width:"calc(100% - "+2*s+"em)",marginLeft:2*s+"em"}:void 0}]},e);else{var c=void 0,p=void 0;"\\vec"===n.label?(c=Vt.staticSvg("vec",e),p=Vt.svgData.vec[1]):((c=Vt.makeSymbol(n.label,"Main-Regular",n.mode,e)).italic=0,p=c.width),m=Vt.makeSpan(["accent-body"],[c]);var u="\\textcircled"===n.label;u&&(m.classes.push("accent-full"),l=i.height);var f=s;u||(f-=p/2),m.style.left=f+"em","\\textcircled"===n.label&&(m.style.top=".2em"),m=Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:i},{type:"kern",size:-l},{type:"elem",elem:m}]},e)}var g=Vt.makeSpan(["mord","accent"],[m],e);return o?(o.children[0]=g,o.height=Math.max(g.height,o.height),o.classes[0]="mord",o):g},Le=function(t,e){var r=t.isStretchy?Oe(t.label):new be.MathNode("mo",[we(t.label,t.mode)]),n=new be.MathNode("mover",[Te(t.base,e),r]);return n.setAttribute("accent","true"),n},He=new RegExp(["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot","\\mathring"].map(function(t){return"\\"+t}).join("|"));te({type:"accent",names:["\\acute","\\grave","\\ddot","\\tilde","\\bar","\\breve","\\check","\\hat","\\vec","\\dot","\\mathring","\\widecheck","\\widehat","\\widetilde","\\overrightarrow","\\overleftarrow","\\Overrightarrow","\\overleftrightarrow","\\overgroup","\\overlinesegment","\\overleftharpoon","\\overrightharpoon"],props:{numArgs:1},handler:function(t,e){var r=e[0],n=!He.test(t.funcName),a=!n||"\\widehat"===t.funcName||"\\widetilde"===t.funcName||"\\widecheck"===t.funcName;return{type:"accent",mode:t.parser.mode,label:t.funcName,isStretchy:n,isShifty:a,base:r}},htmlBuilder:Re,mathmlBuilder:Le}),te({type:"accent",names:["\\'","\\`","\\^","\\~","\\=","\\u","\\.",'\\"',"\\r","\\H","\\v","\\textcircled"],props:{numArgs:1,allowedInText:!0,allowedInMath:!1},handler:function(t,e){var r=e[0];return{type:"accent",mode:t.parser.mode,label:t.funcName,isStretchy:!1,isShifty:!0,base:r}},htmlBuilder:Re,mathmlBuilder:Le}),te({type:"accentUnder",names:["\\underleftarrow","\\underrightarrow","\\underleftrightarrow","\\undergroup","\\underlinesegment","\\utilde"],props:{numArgs:1},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[0];return{type:"accentUnder",mode:r.mode,label:n,base:a}},htmlBuilder:function(t,e){var r=ue(t.base,e),n=Ie(t,e),a="\\utilde"===t.label?.12:0,o=Vt.makeVList({positionType:"bottom",positionData:n.height+a,children:[{type:"elem",elem:n,wrapperClasses:["svg-align"]},{type:"kern",size:a},{type:"elem",elem:r}]},e);return Vt.makeSpan(["mord","accentunder"],[o],e)},mathmlBuilder:function(t,e){var r=Oe(t.label),n=new be.MathNode("munder",[Te(t.base,e),r]);return n.setAttribute("accentunder","true"),n}}),te({type:"xArrow",names:["\\xleftarrow","\\xrightarrow","\\xLeftarrow","\\xRightarrow","\\xleftrightarrow","\\xLeftrightarrow","\\xhookleftarrow","\\xhookrightarrow","\\xmapsto","\\xrightharpoondown","\\xrightharpoonup","\\xleftharpoondown","\\xleftharpoonup","\\xrightleftharpoons","\\xleftrightharpoons","\\xlongequal","\\xtwoheadrightarrow","\\xtwoheadleftarrow","\\xtofrom","\\xrightleftarrows","\\xrightequilibrium","\\xleftequilibrium"],props:{numArgs:1,numOptionalArgs:1},handler:function(t,e,r){var n=t.parser,a=t.funcName;return{type:"xArrow",mode:n.mode,label:a,body:e[0],below:r[0]}},htmlBuilder:function(t,e){var r=e.style,n=e.havingStyle(r.sup()),a=ue(t.body,n,e);a.classes.push("x-arrow-pad");var o=void 0;t.below&&(n=e.havingStyle(r.sub()),(o=ue(t.below,n,e)).classes.push("x-arrow-pad"));var i=Ie(t,e),s=-e.fontMetrics().axisHeight+.5*i.height,h=-e.fontMetrics().axisHeight-.5*i.height-.111;(a.depth>.25||"\\xleftequilibrium"===t.label)&&(h-=a.depth);var l=void 0;if(o){var m=-e.fontMetrics().axisHeight+o.height+.5*i.height+.111;l=Vt.makeVList({positionType:"individualShift",children:[{type:"elem",elem:a,shift:h},{type:"elem",elem:i,shift:s},{type:"elem",elem:o,shift:m}]},e)}else l=Vt.makeVList({positionType:"individualShift",children:[{type:"elem",elem:a,shift:h},{type:"elem",elem:i,shift:s}]},e);return l.children[0].children[0].children[1].classes.push("svg-align"),Vt.makeSpan(["mrel","x-arrow"],[l],e)},mathmlBuilder:function(t,e){var r=Oe(t.label),n=void 0,a=void 0;if(t.body){var o=Te(t.body,e);t.below?(a=Te(t.below,e),n=new be.MathNode("munderover",[r,a,o])):n=new be.MathNode("mover",[r,o])}else t.below?(a=Te(t.below,e),n=new be.MathNode("munder",[r,a])):n=new be.MathNode("mover",[r]);return n}}),te({type:"textord",names:["\\@char"],props:{numArgs:1,allowedInText:!0},handler:function(t,e){for(var r=t.parser,n=Gt(e[0],"ordgroup").body,a="",o=0;o<n.length;o++){a+=Gt(n[o],"textord").text}var i=parseInt(a);if(isNaN(i))throw new h("\\@char has non-numeric argument "+a);return{type:"textord",mode:r.mode,text:String.fromCharCode(i)}}});var De=function(t,e){var r=he(t.body,e.withColor(t.color),!1);return Vt.makeFragment(r)},Pe=function(t,e){var r=Me(t.body,e),n=new be.MathNode("mstyle",r);return n.setAttribute("mathcolor",t.color),n};te({type:"color",names:["\\textcolor"],props:{numArgs:2,allowedInText:!0,greediness:3,argTypes:["color","original"]},handler:function(t,e){var r=t.parser,n=Gt(e[0],"color-token").color,a=e[1];return{type:"color",mode:r.mode,color:n,body:re(a)}},htmlBuilder:De,mathmlBuilder:Pe}),te({type:"color",names:["\\blue","\\orange","\\pink","\\red","\\green","\\gray","\\purple","\\blueA","\\blueB","\\blueC","\\blueD","\\blueE","\\tealA","\\tealB","\\tealC","\\tealD","\\tealE","\\greenA","\\greenB","\\greenC","\\greenD","\\greenE","\\goldA","\\goldB","\\goldC","\\goldD","\\goldE","\\redA","\\redB","\\redC","\\redD","\\redE","\\maroonA","\\maroonB","\\maroonC","\\maroonD","\\maroonE","\\purpleA","\\purpleB","\\purpleC","\\purpleD","\\purpleE","\\mintA","\\mintB","\\mintC","\\grayA","\\grayB","\\grayC","\\grayD","\\grayE","\\grayF","\\grayG","\\grayH","\\grayI","\\kaBlue","\\kaGreen"],props:{numArgs:1,allowedInText:!0,greediness:3},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[0];return{type:"color",mode:r.mode,color:"katex-"+n.slice(1),body:re(a)}},htmlBuilder:De,mathmlBuilder:Pe}),te({type:"color",names:["\\color"],props:{numArgs:1,allowedInText:!0,greediness:3,argTypes:["color"]},handler:function(t,e){var r=t.parser,n=t.breakOnTokenText,a=Gt(e[0],"color-token").color,o=r.parseExpression(!0,n);return{type:"color",mode:r.mode,color:a,body:o}},htmlBuilder:De,mathmlBuilder:Pe}),te({type:"cr",names:["\\cr","\\newline"],props:{numArgs:0,numOptionalArgs:1,argTypes:["size"],allowedInText:!0},handler:function(t,e,r){var n=t.parser,a=t.funcName,o=r[0],i="\\cr"===a,s=!1;return i||(s=!n.settings.displayMode||!n.settings.useStrictBehavior("newLineInDisplayMode","In LaTeX, \\\\ or \\newline does nothing in display mode")),{type:"cr",mode:n.mode,newLine:s,newRow:i,size:o&&Gt(o,"size").value}},htmlBuilder:function(t,e){if(t.newRow)throw new h("\\cr valid only within a tabular/array environment");var r=Vt.makeSpan(["mspace"],[],e);return t.newLine&&(r.classes.push("newline"),t.size&&(r.style.marginTop=Bt(t.size,e)+"em")),r},mathmlBuilder:function(t,e){var r=new be.MathNode("mspace");return t.newLine&&(r.setAttribute("linebreak","newline"),t.size&&r.setAttribute("height",Bt(t.size,e)+"em")),r}});var Fe=function(t,e,r){var n=X($.math[t]&&$.math[t].replace||t,e,r);if(!n)throw new Error("Unsupported symbol "+t+" and font size "+e+".");return n},Ve=function(t,e,r,n){var a=r.havingBaseStyle(e),o=Vt.makeSpan(n.concat(a.sizingClasses(r)),[t],r),i=a.sizeMultiplier/r.sizeMultiplier;return o.height*=i,o.depth*=i,o.maxFontSize=a.sizeMultiplier,o},Ge=function(t,e,r){var n=e.havingBaseStyle(r),a=(1-e.sizeMultiplier/n.sizeMultiplier)*e.fontMetrics().axisHeight;t.classes.push("delimcenter"),t.style.top=a+"em",t.height-=a,t.depth+=a},Ue=function(t,e,r,n,a,o){var i=function(t,e,r,n){return Vt.makeSymbol(t,"Size"+e+"-Regular",r,n)}(t,e,a,n),s=Ve(Vt.makeSpan(["delimsizing","size"+e],[i],n),M.TEXT,n,o);return r&&Ge(s,n,M.TEXT),s},Xe=function(t,e,r){var n=void 0;return n="Size1-Regular"===e?"delim-size1":"delim-size4",{type:"elem",elem:Vt.makeSpan(["delimsizinginner",n],[Vt.makeSpan([],[Vt.makeSymbol(t,e,r)])])}},Ye=function(t,e,r,n,a,o){var i=void 0,s=void 0,h=void 0,l=void 0;i=h=l=t,s=null;var m="Size1-Regular";"\\uparrow"===t?h=l="\u23d0":"\\Uparrow"===t?h=l="\u2016":"\\downarrow"===t?i=h="\u23d0":"\\Downarrow"===t?i=h="\u2016":"\\updownarrow"===t?(i="\\uparrow",h="\u23d0",l="\\downarrow"):"\\Updownarrow"===t?(i="\\Uparrow",h="\u2016",l="\\Downarrow"):"["===t||"\\lbrack"===t?(i="\u23a1",h="\u23a2",l="\u23a3",m="Size4-Regular"):"]"===t||"\\rbrack"===t?(i="\u23a4",h="\u23a5",l="\u23a6",m="Size4-Regular"):"\\lfloor"===t||"\u230a"===t?(h=i="\u23a2",l="\u23a3",m="Size4-Regular"):"\\lceil"===t||"\u2308"===t?(i="\u23a1",h=l="\u23a2",m="Size4-Regular"):"\\rfloor"===t||"\u230b"===t?(h=i="\u23a5",l="\u23a6",m="Size4-Regular"):"\\rceil"===t||"\u2309"===t?(i="\u23a4",h=l="\u23a5",m="Size4-Regular"):"("===t?(i="\u239b",h="\u239c",l="\u239d",m="Size4-Regular"):")"===t?(i="\u239e",h="\u239f",l="\u23a0",m="Size4-Regular"):"\\{"===t||"\\lbrace"===t?(i="\u23a7",s="\u23a8",l="\u23a9",h="\u23aa",m="Size4-Regular"):"\\}"===t||"\\rbrace"===t?(i="\u23ab",s="\u23ac",l="\u23ad",h="\u23aa",m="Size4-Regular"):"\\lgroup"===t||"\u27ee"===t?(i="\u23a7",l="\u23a9",h="\u23aa",m="Size4-Regular"):"\\rgroup"===t||"\u27ef"===t?(i="\u23ab",l="\u23ad",h="\u23aa",m="Size4-Regular"):"\\lmoustache"===t||"\u23b0"===t?(i="\u23a7",l="\u23ad",h="\u23aa",m="Size4-Regular"):"\\rmoustache"!==t&&"\u23b1"!==t||(i="\u23ab",l="\u23a9",h="\u23aa",m="Size4-Regular");var c=Fe(i,m,a),p=c.height+c.depth,u=Fe(h,m,a),d=u.height+u.depth,f=Fe(l,m,a),g=f.height+f.depth,x=0,v=1;if(null!==s){var y=Fe(s,m,a);x=y.height+y.depth,v=2}var b=p+g+x,w=Math.ceil((e-b)/(v*d)),k=b+w*v*d,S=n.fontMetrics().axisHeight;r&&(S*=n.sizeMultiplier);var z=k/2-S,T=[];if(T.push(Xe(l,m,a)),null===s)for(var A=0;A<w;A++)T.push(Xe(h,m,a));else{for(var B=0;B<w;B++)T.push(Xe(h,m,a));T.push(Xe(s,m,a));for(var C=0;C<w;C++)T.push(Xe(h,m,a))}T.push(Xe(i,m,a));var N=n.havingBaseStyle(M.TEXT),q=Vt.makeVList({positionType:"bottom",positionData:z,children:T},N);return Ve(Vt.makeSpan(["delimsizing","mult"],[q],N),M.TEXT,n,o)},_e=function(t,e,r,n){var a=void 0;"sqrtTall"===t&&(a="M702 80H400000v40H742v"+(r-54-80)+"l-4 4-4 4c-.667.7\n-2 1.5-4 2.5s-4.167 1.833-6.5 2.5-5.5 1-9.5 1h-12l-28-84c-16.667-52-96.667\n-294.333-240-727l-212 -643 -85 170c-4-3.333-8.333-7.667-13 -13l-13-13l77-155\n 77-156c66 199.333 139 419.667 219 661 l218 661zM702 80H400000v40H742z");var o=new P(t,a),i=new D([o],{width:"400em",height:e+"em",viewBox:"0 0 400000 "+r,preserveAspectRatio:"xMinYMin slice"});return Vt.makeSvgSpan(["hide-tail"],[i],n)},We=["(",")","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","\u230a","\u230b","\\lceil","\\rceil","\u2308","\u2309","\\surd"],je=["\\uparrow","\\downarrow","\\updownarrow","\\Uparrow","\\Downarrow","\\Updownarrow","|","\\|","\\vert","\\Vert","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","\u27ee","\u27ef","\\lmoustache","\\rmoustache","\u23b0","\u23b1"],$e=["<",">","\\langle","\\rangle","/","\\backslash","\\lt","\\gt"],Ze=[0,1.2,1.8,2.4,3],Ke=[{type:"small",style:M.SCRIPTSCRIPT},{type:"small",style:M.SCRIPT},{type:"small",style:M.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4}],Je=[{type:"small",style:M.SCRIPTSCRIPT},{type:"small",style:M.SCRIPT},{type:"small",style:M.TEXT},{type:"stack"}],Qe=[{type:"small",style:M.SCRIPTSCRIPT},{type:"small",style:M.SCRIPT},{type:"small",style:M.TEXT},{type:"large",size:1},{type:"large",size:2},{type:"large",size:3},{type:"large",size:4},{type:"stack"}],tr=function(t){if("small"===t.type)return"Main-Regular";if("large"===t.type)return"Size"+t.size+"-Regular";if("stack"===t.type)return"Size4-Regular";throw new Error("Add support for delim type '"+t.type+"' here.")},er=function(t,e,r,n){for(var a=Math.min(2,3-n.style.size);a<r.length&&"stack"!==r[a].type;a++){var o=Fe(t,tr(r[a]),"math"),i=o.height+o.depth;if("small"===r[a].type&&(i*=n.havingBaseStyle(r[a].style).sizeMultiplier),i>e)return r[a]}return r[r.length-1]},rr=function(t,e,r,n,a,o){"<"===t||"\\lt"===t||"\u27e8"===t?t="\\langle":">"!==t&&"\\gt"!==t&&"\u27e9"!==t||(t="\\rangle");var i=void 0;i=d.contains($e,t)?Ke:d.contains(We,t)?Qe:Je;var s=er(t,e,i,n);return"small"===s.type?function(t,e,r,n,a,o){var i=Vt.makeSymbol(t,"Main-Regular",a,n),s=Ve(i,e,n,o);return r&&Ge(s,n,e),s}(t,s.style,r,n,a,o):"large"===s.type?Ue(t,s.size,r,n,a,o):Ye(t,e,r,n,a,o)},nr=function(t,e){var r=e.havingBaseSizing(),n=er("\\surd",t*r.sizeMultiplier,Qe,r),a=r.sizeMultiplier,o=void 0,i=0,s=0,h=0,l=void 0;return"small"===n.type?(h=1080,t<1?a=1:t<1.4&&(a=.7),s=1/a,(o=_e("sqrtMain",i=1.08/a,h,e)).style.minWidth="0.853em",l=.833/a):"large"===n.type?(h=1080*Ze[n.size],s=Ze[n.size]/a,i=(Ze[n.size]+.08)/a,(o=_e("sqrtSize"+n.size,i,h,e)).style.minWidth="1.02em",l=1/a):(i=t+.08,s=t,h=Math.floor(1e3*t)+80,(o=_e("sqrtTall",i,h,e)).style.minWidth="0.742em",l=1.056),o.height=s,o.style.height=i+"em",{span:o,advanceWidth:l,ruleWidth:e.fontMetrics().sqrtRuleThickness*a}},ar=function(t,e,r,n,a){if("<"===t||"\\lt"===t||"\u27e8"===t?t="\\langle":">"!==t&&"\\gt"!==t&&"\u27e9"!==t||(t="\\rangle"),d.contains(We,t)||d.contains($e,t))return Ue(t,e,!1,r,n,a);if(d.contains(je,t))return Ye(t,Ze[e],!1,r,n,a);throw new h("Illegal delimiter: '"+t+"'")},or=rr,ir=function(t,e,r,n,a,o){var i=n.fontMetrics().axisHeight*n.sizeMultiplier,s=5/n.fontMetrics().ptPerEm,h=Math.max(e-i,r+i),l=Math.max(h/500*901,2*h-s);return rr(t,l,!0,n,a,o)},sr={"\\bigl":{mclass:"mopen",size:1},"\\Bigl":{mclass:"mopen",size:2},"\\biggl":{mclass:"mopen",size:3},"\\Biggl":{mclass:"mopen",size:4},"\\bigr":{mclass:"mclose",size:1},"\\Bigr":{mclass:"mclose",size:2},"\\biggr":{mclass:"mclose",size:3},"\\Biggr":{mclass:"mclose",size:4},"\\bigm":{mclass:"mrel",size:1},"\\Bigm":{mclass:"mrel",size:2},"\\biggm":{mclass:"mrel",size:3},"\\Biggm":{mclass:"mrel",size:4},"\\big":{mclass:"mord",size:1},"\\Big":{mclass:"mord",size:2},"\\bigg":{mclass:"mord",size:3},"\\Bigg":{mclass:"mord",size:4}},hr=["(",")","[","\\lbrack","]","\\rbrack","\\{","\\lbrace","\\}","\\rbrace","\\lfloor","\\rfloor","\u230a","\u230b","\\lceil","\\rceil","\u2308","\u2309","<",">","\\langle","\u27e8","\\rangle","\u27e9","\\lt","\\gt","\\lvert","\\rvert","\\lVert","\\rVert","\\lgroup","\\rgroup","\u27ee","\u27ef","\\lmoustache","\\rmoustache","\u23b0","\u23b1","/","\\backslash","|","\\vert","\\|","\\Vert","\\uparrow","\\Uparrow","\\downarrow","\\Downarrow","\\updownarrow","\\Updownarrow","."];function lr(t,e){var r=Yt(t);if(r&&d.contains(hr,r.text))return r;throw new h("Invalid delimiter: '"+(r?r.text:JSON.stringify(t))+"' after '"+e.funcName+"'",t)}function mr(t){if(!t.body)throw new Error("Bug: The leftright ParseNode wasn't fully parsed.")}te({type:"delimsizing",names:["\\bigl","\\Bigl","\\biggl","\\Biggl","\\bigr","\\Bigr","\\biggr","\\Biggr","\\bigm","\\Bigm","\\biggm","\\Biggm","\\big","\\Big","\\bigg","\\Bigg"],props:{numArgs:1},handler:function(t,e){var r=lr(e[0],t);return{type:"delimsizing",mode:t.parser.mode,size:sr[t.funcName].size,mclass:sr[t.funcName].mclass,delim:r.text}},htmlBuilder:function(t,e){return"."===t.delim?Vt.makeSpan([t.mclass]):ar(t.delim,t.size,e,t.mode,[t.mclass])},mathmlBuilder:function(t){var e=[];"."!==t.delim&&e.push(we(t.delim,t.mode));var r=new be.MathNode("mo",e);return"mopen"===t.mclass||"mclose"===t.mclass?r.setAttribute("fence","true"):r.setAttribute("fence","false"),r}}),te({type:"leftright-right",names:["\\right"],props:{numArgs:1},handler:function(t,e){return{type:"leftright-right",mode:t.parser.mode,delim:lr(e[0],t).text}}}),te({type:"leftright",names:["\\left"],props:{numArgs:1},handler:function(t,e){var r=lr(e[0],t),n=t.parser;++n.leftrightDepth;var a=n.parseExpression(!1);--n.leftrightDepth,n.expect("\\right",!1);var o=n.parseFunction();if(!o)throw new h("failed to parse function after \\right");return{type:"leftright",mode:n.mode,body:a,left:r.text,right:Gt(o,"leftright-right").delim}},htmlBuilder:function(t,e){mr(t);for(var r=he(t.body,e,!0,[null,"mclose"]),n=0,a=0,o=!1,i=0;i<r.length;i++)r[i].isMiddle?o=!0:(n=Math.max(r[i].height,n),a=Math.max(r[i].depth,a));n*=e.sizeMultiplier,a*=e.sizeMultiplier;var s=void 0;if(s="."===t.left?pe(e,["mopen"]):ir(t.left,n,a,e,t.mode,["mopen"]),r.unshift(s),o)for(var h=1;h<r.length;h++){var l=r[h].isMiddle;l&&(r[h]=ir(l.delim,n,a,l.options,t.mode,[]))}var m=void 0;return m="."===t.right?pe(e,["mclose"]):ir(t.right,n,a,e,t.mode,["mclose"]),r.push(m),Vt.makeSpan(["minner"],r,e)},mathmlBuilder:function(t,e){mr(t);var r=Me(t.body,e);if("."!==t.left){var n=new be.MathNode("mo",[we(t.left,t.mode)]);n.setAttribute("fence","true"),r.unshift(n)}if("."!==t.right){var a=new be.MathNode("mo",[we(t.right,t.mode)]);a.setAttribute("fence","true"),r.push(a)}return ke(r)}}),te({type:"middle",names:["\\middle"],props:{numArgs:1},handler:function(t,e){var r=lr(e[0],t);if(!t.parser.leftrightDepth)throw new h("\\middle without preceding \\left",r);return{type:"middle",mode:t.parser.mode,delim:r.text}},htmlBuilder:function(t,e){var r=void 0;if("."===t.delim)r=pe(e,[]);else{r=ar(t.delim,1,e,t.mode,[]);var n={delim:t.delim,options:e};r.isMiddle=n}return r},mathmlBuilder:function(t,e){var r=new be.MathNode("mo",[we(t.delim,t.mode)]);return r.setAttribute("fence","true"),r}});var cr=function(t,e){var r=ue(t.body,e),n=t.label.substr(1),a=e.sizeMultiplier,o=void 0,i=0,s=d.isCharacterBox(t.body);if("sout"===n)(o=Vt.makeSpan(["stretchy","sout"])).height=e.fontMetrics().defaultRuleThickness/a,i=-.5*e.fontMetrics().xHeight;else{/cancel/.test(n)?s||r.classes.push("cancel-pad"):r.classes.push("boxpad");var h=0;h=/box/.test(n)?"colorbox"===n?.3:.34:s?.2:0,o=Ee(r,n,h,e),i=r.depth+h,t.backgroundColor&&(o.style.backgroundColor=t.backgroundColor,t.borderColor&&(o.style.borderColor=t.borderColor))}var l=void 0;return l=t.backgroundColor?Vt.makeVList({positionType:"individualShift",children:[{type:"elem",elem:o,shift:i},{type:"elem",elem:r,shift:0}]},e):Vt.makeVList({positionType:"individualShift",children:[{type:"elem",elem:r,shift:0},{type:"elem",elem:o,shift:i,wrapperClasses:/cancel/.test(n)?["svg-align"]:[]}]},e),/cancel/.test(n)&&(l.height=r.height,l.depth=r.depth),/cancel/.test(n)&&!s?Vt.makeSpan(["mord","cancel-lap"],[l],e):Vt.makeSpan(["mord"],[l],e)},pr=function(t,e){var r=new be.MathNode("menclose",[Te(t.body,e)]);switch(t.label){case"\\cancel":r.setAttribute("notation","updiagonalstrike");break;case"\\bcancel":r.setAttribute("notation","downdiagonalstrike");break;case"\\sout":r.setAttribute("notation","horizontalstrike");break;case"\\fbox":case"\\fcolorbox":r.setAttribute("notation","box");break;case"\\xcancel":r.setAttribute("notation","updiagonalstrike downdiagonalstrike")}return t.backgroundColor&&r.setAttribute("mathbackground",t.backgroundColor),r};te({type:"enclose",names:["\\colorbox"],props:{numArgs:2,allowedInText:!0,greediness:3,argTypes:["color","text"]},handler:function(t,e,r){var n=t.parser,a=t.funcName,o=Gt(e[0],"color-token").color,i=e[1];return{type:"enclose",mode:n.mode,label:a,backgroundColor:o,body:i}},htmlBuilder:cr,mathmlBuilder:pr}),te({type:"enclose",names:["\\fcolorbox"],props:{numArgs:3,allowedInText:!0,greediness:3,argTypes:["color","color","text"]},handler:function(t,e,r){var n=t.parser,a=t.funcName,o=Gt(e[0],"color-token").color,i=Gt(e[1],"color-token").color,s=e[2];return{type:"enclose",mode:n.mode,label:a,backgroundColor:i,borderColor:o,body:s}},htmlBuilder:cr,mathmlBuilder:pr}),te({type:"enclose",names:["\\fbox"],props:{numArgs:1,argTypes:["text"],allowedInText:!0},handler:function(t,e){return{type:"enclose",mode:t.parser.mode,label:"\\fbox",body:e[0]}}}),te({type:"enclose",names:["\\cancel","\\bcancel","\\xcancel","\\sout"],props:{numArgs:1},handler:function(t,e,r){var n=t.parser,a=t.funcName,o=e[0];return{type:"enclose",mode:n.mode,label:a,body:o}},htmlBuilder:cr,mathmlBuilder:pr}),te({type:"environment",names:["\\begin","\\end"],props:{numArgs:1,argTypes:["text"]},handler:function(t,e){var r=t.parser,n=e[0];if("ordgroup"!==n.type)throw new h("Invalid environment name",n);for(var a="",o=0;o<n.body.length;++o)a+=Gt(n.body[o],"textord").text;return{type:"environment",mode:r.mode,name:a,nameGroup:n}}});var ur=Vt.makeSpan;function dr(t,e){var r=he(t.body,e,!0);return ur([t.mclass],r,e)}function fr(t,e){var r=Me(t.body,e);return be.newDocumentFragment(r)}te({type:"mclass",names:["\\mathord","\\mathbin","\\mathrel","\\mathopen","\\mathclose","\\mathpunct","\\mathinner"],props:{numArgs:1},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[0];return{type:"mclass",mode:r.mode,mclass:"m"+n.substr(5),body:re(a)}},htmlBuilder:dr,mathmlBuilder:fr});var gr=function(t){var e="ordgroup"===t.type&&t.body.length?t.body[0]:t;return"atom"!==e.type||"bin"!==e.family&&"rel"!==e.family?"mord":"m"+e.family};te({type:"mclass",names:["\\@binrel"],props:{numArgs:2},handler:function(t,e){return{type:"mclass",mode:t.parser.mode,mclass:gr(e[0]),body:[e[1]]}}}),te({type:"mclass",names:["\\stackrel","\\overset","\\underset"],props:{numArgs:2},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[1],o=e[0],i=void 0;i="\\stackrel"!==n?gr(a):"mrel";var s={type:"op",mode:a.mode,limits:!0,alwaysHandleSupSub:!0,symbol:!1,suppressBaseShift:"\\stackrel"!==n,body:re(a)},h={type:"supsub",mode:o.mode,base:s,sup:"\\underset"===n?null:o,sub:"\\underset"===n?o:null};return{type:"mclass",mode:r.mode,mclass:i,body:[h]}},htmlBuilder:dr,mathmlBuilder:fr});var xr=function(t,e){var r=t.font,n=e.withFont(r);return ue(t.body,n)},vr=function(t,e){var r=t.font,n=e.withFont(r);return Te(t.body,n)},yr={"\\Bbb":"\\mathbb","\\bold":"\\mathbf","\\frak":"\\mathfrak","\\bm":"\\boldsymbol"};te({type:"font",names:["\\mathrm","\\mathit","\\mathbf","\\mathbb","\\mathcal","\\mathfrak","\\mathscr","\\mathsf","\\mathtt","\\Bbb","\\bold","\\frak"],props:{numArgs:1,greediness:2},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[0],o=n;return o in yr&&(o=yr[o]),{type:"font",mode:r.mode,font:o.slice(1),body:a}},htmlBuilder:xr,mathmlBuilder:vr}),te({type:"mclass",names:["\\boldsymbol","\\bm"],props:{numArgs:1,greediness:2},handler:function(t,e){var r=t.parser,n=e[0];return{type:"mclass",mode:r.mode,mclass:gr(n),body:[{type:"font",mode:r.mode,font:"boldsymbol",body:n}]}}}),te({type:"font",names:["\\rm","\\sf","\\tt","\\bf","\\it"],props:{numArgs:0,allowedInText:!0},handler:function(t,e){var r=t.parser,n=t.funcName,a=t.breakOnTokenText,o=r.mode;r.consumeSpaces();var i=r.parseExpression(!0,a);return{type:"font",mode:o,font:"math"+n.slice(1),body:{type:"ordgroup",mode:r.mode,body:i}}},htmlBuilder:xr,mathmlBuilder:vr});var br=function(t,e){var r=e.style;"display"===t.size?r=M.DISPLAY:"text"===t.size&&r.size===M.DISPLAY.size?r=M.TEXT:"script"===t.size?r=M.SCRIPT:"scriptscript"===t.size&&(r=M.SCRIPTSCRIPT);var n=r.fracNum(),a=r.fracDen(),o=void 0;o=e.havingStyle(n);var i=ue(t.numer,o,e);if(t.continued){var s=8.5/e.fontMetrics().ptPerEm,h=3.5/e.fontMetrics().ptPerEm;i.height=i.height<s?s:i.height,i.depth=i.depth<h?h:i.depth}o=e.havingStyle(a);var l=ue(t.denom,o,e),m=void 0,c=void 0,p=void 0;t.hasBarLine?(t.barSize?(c=Bt(t.barSize,e),m=Vt.makeLineSpan("frac-line",e,c)):m=Vt.makeLineSpan("frac-line",e),c=m.height,p=m.height):(m=null,c=0,p=e.fontMetrics().defaultRuleThickness);var u=void 0,d=void 0,f=void 0;r.size===M.DISPLAY.size?(u=e.fontMetrics().num1,d=c>0?3*p:7*p,f=e.fontMetrics().denom1):(c>0?(u=e.fontMetrics().num2,d=p):(u=e.fontMetrics().num3,d=3*p),f=e.fontMetrics().denom2);var g=void 0;if(m){var x=e.fontMetrics().axisHeight;u-i.depth-(x+.5*c)<d&&(u+=d-(u-i.depth-(x+.5*c))),x-.5*c-(l.height-f)<d&&(f+=d-(x-.5*c-(l.height-f)));var v=-(x-.5*c);g=Vt.makeVList({positionType:"individualShift",children:[{type:"elem",elem:l,shift:f},{type:"elem",elem:m,shift:v},{type:"elem",elem:i,shift:-u}]},e)}else{var y=u-i.depth-(l.height-f);y<d&&(u+=.5*(d-y),f+=.5*(d-y)),g=Vt.makeVList({positionType:"individualShift",children:[{type:"elem",elem:l,shift:f},{type:"elem",elem:i,shift:-u}]},e)}o=e.havingStyle(r),g.height*=o.sizeMultiplier/e.sizeMultiplier,g.depth*=o.sizeMultiplier/e.sizeMultiplier;var b=void 0;b=r.size===M.DISPLAY.size?e.fontMetrics().delim1:e.fontMetrics().delim2;var w=void 0,k=void 0;return w=null==t.leftDelim?pe(e,["mopen"]):or(t.leftDelim,b,!0,e.havingStyle(r),t.mode,["mopen"]),k=t.continued?Vt.makeSpan([]):null==t.rightDelim?pe(e,["mclose"]):or(t.rightDelim,b,!0,e.havingStyle(r),t.mode,["mclose"]),Vt.makeSpan(["mord"].concat(o.sizingClasses(e)),[w,Vt.makeSpan(["mfrac"],[g]),k],e)},wr=function(t,e){var r=new be.MathNode("mfrac",[Te(t.numer,e),Te(t.denom,e)]);if(t.hasBarLine){if(t.barSize){var n=Bt(t.barSize,e);r.setAttribute("linethickness",n+"em")}}else r.setAttribute("linethickness","0px");if(null!=t.leftDelim||null!=t.rightDelim){var a=[];if(null!=t.leftDelim){var o=new be.MathNode("mo",[new be.TextNode(t.leftDelim)]);o.setAttribute("fence","true"),a.push(o)}if(a.push(r),null!=t.rightDelim){var i=new be.MathNode("mo",[new be.TextNode(t.rightDelim)]);i.setAttribute("fence","true"),a.push(i)}return ke(a)}return r};te({type:"genfrac",names:["\\cfrac","\\dfrac","\\frac","\\tfrac","\\dbinom","\\binom","\\tbinom","\\\\atopfrac","\\\\bracefrac","\\\\brackfrac"],props:{numArgs:2,greediness:2},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[0],o=e[1],i=void 0,s=null,h=null,l="auto";switch(n){case"\\cfrac":case"\\dfrac":case"\\frac":case"\\tfrac":i=!0;break;case"\\\\atopfrac":i=!1;break;case"\\dbinom":case"\\binom":case"\\tbinom":i=!1,s="(",h=")";break;case"\\\\bracefrac":i=!1,s="\\{",h="\\}";break;case"\\\\brackfrac":i=!1,s="[",h="]";break;default:throw new Error("Unrecognized genfrac command")}switch(n){case"\\cfrac":case"\\dfrac":case"\\dbinom":l="display";break;case"\\tfrac":case"\\tbinom":l="text"}return{type:"genfrac",mode:r.mode,continued:"\\cfrac"===n,numer:a,denom:o,hasBarLine:i,leftDelim:s,rightDelim:h,size:l,barSize:null}},htmlBuilder:br,mathmlBuilder:wr}),te({type:"infix",names:["\\over","\\choose","\\atop","\\brace","\\brack"],props:{numArgs:0,infix:!0},handler:function(t){var e=t.parser,r=t.funcName,n=t.token,a=void 0;switch(r){case"\\over":a="\\frac";break;case"\\choose":a="\\binom";break;case"\\atop":a="\\\\atopfrac";break;case"\\brace":a="\\\\bracefrac";break;case"\\brack":a="\\\\brackfrac";break;default:throw new Error("Unrecognized infix genfrac command")}return{type:"infix",mode:e.mode,replaceWith:a,token:n}}});var kr=["display","text","script","scriptscript"],Sr=function(t){var e=null;return t.length>0&&(e="."===(e=t)?null:e),e};te({type:"genfrac",names:["\\genfrac"],props:{numArgs:6,greediness:6,argTypes:["math","math","size","text","math","math"]},handler:function(t,e){var r=t.parser,n=e[4],a=e[5],o=Ut(e[0],"ordgroup");o=Xt(o?o.body[0]:e[0],"open");var i=Sr(o.text),s=Ut(e[1],"ordgroup");s=Xt(s?s.body[0]:e[1],"close");var h=Sr(s.text),l=Gt(e[2],"size"),m=void 0,c=null;m=!!l.isBlank||(c=l.value).number>0;var p="auto",u=Ut(e[3],"ordgroup");if(u){if(u.body.length>0){var d=Gt(u.body[0],"textord");p=kr[Number(d.text)]}}else u=Gt(e[3],"textord"),p=kr[Number(u.text)];return{type:"genfrac",mode:r.mode,numer:n,denom:a,continued:!1,hasBarLine:m,barSize:c,leftDelim:i,rightDelim:h,size:p}},htmlBuilder:br,mathmlBuilder:wr}),te({type:"infix",names:["\\above"],props:{numArgs:1,argTypes:["size"],infix:!0},handler:function(t,e){var r=t.parser,n=(t.funcName,t.token);return{type:"infix",mode:r.mode,replaceWith:"\\\\abovefrac",size:Gt(e[0],"size").value,token:n}}}),te({type:"genfrac",names:["\\\\abovefrac"],props:{numArgs:3,argTypes:["math","size","math"]},handler:function(t,e){var r=t.parser,n=(t.funcName,e[0]),a=u(Gt(e[1],"infix").size),o=e[2],i=a.number>0;return{type:"genfrac",mode:r.mode,numer:n,denom:o,continued:!1,hasBarLine:i,barSize:a,leftDelim:null,rightDelim:null,size:"auto"}},htmlBuilder:br,mathmlBuilder:wr});var Mr=function(t,e){var r=e.style,n=void 0,a=void 0,o=Ut(t,"supsub");o?(n=o.sup?ue(o.sup,e.havingStyle(r.sup()),e):ue(o.sub,e.havingStyle(r.sub()),e),a=Gt(o.base,"horizBrace")):a=Gt(t,"horizBrace");var i=ue(a.base,e.havingBaseStyle(M.DISPLAY)),s=Ie(a,e),h=void 0;if(a.isOver?(h=Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:i},{type:"kern",size:.1},{type:"elem",elem:s}]},e)).children[0].children[0].children[1].classes.push("svg-align"):(h=Vt.makeVList({positionType:"bottom",positionData:i.depth+.1+s.height,children:[{type:"elem",elem:s},{type:"kern",size:.1},{type:"elem",elem:i}]},e)).children[0].children[0].children[0].classes.push("svg-align"),n){var l=Vt.makeSpan(["mord",a.isOver?"mover":"munder"],[h],e);h=a.isOver?Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:l},{type:"kern",size:.2},{type:"elem",elem:n}]},e):Vt.makeVList({positionType:"bottom",positionData:l.depth+.2+n.height+n.depth,children:[{type:"elem",elem:n},{type:"kern",size:.2},{type:"elem",elem:l}]},e)}return Vt.makeSpan(["mord",a.isOver?"mover":"munder"],[h],e)};te({type:"horizBrace",names:["\\overbrace","\\underbrace"],props:{numArgs:1},handler:function(t,e){var r=t.parser,n=t.funcName;return{type:"horizBrace",mode:r.mode,label:n,isOver:/^\\over/.test(n),base:e[0]}},htmlBuilder:Mr,mathmlBuilder:function(t,e){var r=Oe(t.label);return new be.MathNode(t.isOver?"mover":"munder",[Te(t.base,e),r])}}),te({type:"href",names:["\\href"],props:{numArgs:2,argTypes:["url","original"],allowedInText:!0},handler:function(t,e){var r=t.parser,n=e[1],a=Gt(e[0],"url").url;return{type:"href",mode:r.mode,href:a,body:re(n)}},htmlBuilder:function(t,e){var r=he(t.body,e,!1);return Vt.makeAnchor(t.href,[],r,e)},mathmlBuilder:function(t,e){var r=ze(t.body,e);return function(t,e){if(t instanceof e)return t;var r=String(e.name||e),n=String(t.constructor.name||t);throw new Error("Expected "+r+" but got "+n+".")}(r,xe).setAttribute("href",t.href),r}}),te({type:"href",names:["\\url"],props:{numArgs:1,argTypes:["url"],allowedInText:!0},handler:function(t,e){for(var r=t.parser,n=Gt(e[0],"url").url,a=[],o=0;o<n.length;o++){var i=n[o];"~"===i&&(i="\\textasciitilde"),a.push({type:"textord",mode:"text",text:i})}var s={type:"text",mode:r.mode,font:"\\texttt",body:a};return{type:"href",mode:r.mode,href:n,body:re(s)}}}),te({type:"htmlmathml",names:["\\html@mathml"],props:{numArgs:2,allowedInText:!0},handler:function(t,e){return{type:"htmlmathml",mode:t.parser.mode,html:re(e[0]),mathml:re(e[1])}},htmlBuilder:function(t,e){var r=he(t.html,e,!1);return Vt.makeFragment(r)},mathmlBuilder:function(t,e){return ze(t.mathml,e)}}),te({type:"kern",names:["\\kern","\\mkern","\\hskip","\\mskip"],props:{numArgs:1,argTypes:["size"],allowedInText:!0},handler:function(t,e){var r=t.parser,n=t.funcName,a=Gt(e[0],"size");if(r.settings.strict){var o="m"===n[1],i="mu"===a.value.unit;o?(i||r.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" supports only mu units, not "+a.value.unit+" units"),"math"!==r.mode&&r.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" works only in math mode")):i&&r.settings.reportNonstrict("mathVsTextUnits","LaTeX's "+n+" doesn't support mu units")}return{type:"kern",mode:r.mode,dimension:a.value}},htmlBuilder:function(t,e){return Vt.makeGlue(t.dimension,e)},mathmlBuilder:function(t,e){var r=Bt(t.dimension,e);return new be.SpaceNode(r)}}),te({type:"lap",names:["\\mathllap","\\mathrlap","\\mathclap"],props:{numArgs:1,allowedInText:!0},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[0];return{type:"lap",mode:r.mode,alignment:n.slice(5),body:a}},htmlBuilder:function(t,e){var r=void 0;"clap"===t.alignment?(r=Vt.makeSpan([],[ue(t.body,e)]),r=Vt.makeSpan(["inner"],[r],e)):r=Vt.makeSpan(["inner"],[ue(t.body,e)]);var n=Vt.makeSpan(["fix"],[]),a=Vt.makeSpan([t.alignment],[r,n],e),o=Vt.makeSpan(["strut"]);return o.style.height=a.height+a.depth+"em",o.style.verticalAlign=-a.depth+"em",a.children.unshift(o),a=Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:a}]},e),Vt.makeSpan(["mord"],[a],e)},mathmlBuilder:function(t,e){var r=new be.MathNode("mpadded",[Te(t.body,e)]);if("rlap"!==t.alignment){var n="llap"===t.alignment?"-1":"-0.5";r.setAttribute("lspace",n+"width")}return r.setAttribute("width","0px"),r}}),te({type:"styling",names:["\\(","$"],props:{numArgs:0,allowedInText:!0,allowedInMath:!1,consumeMode:"math"},handler:function(t,e){var r=t.funcName,n=t.parser,a=n.mode;n.switchMode("math");var o="\\("===r?"\\)":"$",i=n.parseExpression(!1,o);return n.expect(o,!1),n.switchMode(a),n.consume(),{type:"styling",mode:n.mode,style:"text",body:i}}}),te({type:"text",names:["\\)","\\]"],props:{numArgs:0,allowedInText:!0,allowedInMath:!1},handler:function(t,e){throw new h("Mismatched "+t.funcName)}});var zr=function(t,e){switch(e.style.size){case M.DISPLAY.size:return t.display;case M.TEXT.size:return t.text;case M.SCRIPT.size:return t.script;case M.SCRIPTSCRIPT.size:return t.scriptscript;default:return t.text}};te({type:"mathchoice",names:["\\mathchoice"],props:{numArgs:4},handler:function(t,e){return{type:"mathchoice",mode:t.parser.mode,display:re(e[0]),text:re(e[1]),script:re(e[2]),scriptscript:re(e[3])}},htmlBuilder:function(t,e){var r=zr(t,e),n=he(r,e,!1);return Vt.makeFragment(n)},mathmlBuilder:function(t,e){var r=zr(t,e);return ze(r,e)}});var Tr=function(t,e){var r=void 0,n=void 0,a=!1,o=void 0,i=Ut(t,"supsub");i?(r=i.sup,n=i.sub,o=Gt(i.base,"op"),a=!0):o=Gt(t,"op");var s=e.style,h=!1;s.size===M.DISPLAY.size&&o.symbol&&!d.contains(["\\smallint"],o.name)&&(h=!0);var l=void 0;if(o.symbol){var m=h?"Size2-Regular":"Size1-Regular",c="";if("\\oiint"!==o.name&&"\\oiiint"!==o.name||(c=o.name.substr(1),o.name="oiint"===c?"\\iint":"\\iiint"),l=Vt.makeSymbol(o.name,m,"math",e,["mop","op-symbol",h?"large-op":"small-op"]),c.length>0){var p=l.italic,u=Vt.staticSvg(c+"Size"+(h?"2":"1"),e);l=Vt.makeVList({positionType:"individualShift",children:[{type:"elem",elem:l,shift:0},{type:"elem",elem:u,shift:h?.08:0}]},e),o.name="\\"+c,l.classes.unshift("mop"),l.italic=p}}else if(o.body){var f=he(o.body,e,!0);1===f.length&&f[0]instanceof H?(l=f[0]).classes[0]="mop":l=Vt.makeSpan(["mop"],f,e)}else{for(var g=[],x=1;x<o.name.length;x++)g.push(Vt.mathsym(o.name[x],o.mode));l=Vt.makeSpan(["mop"],g,e)}var v=0,y=0;if((l instanceof H||"\\oiint"===o.name||"\\oiiint"===o.name)&&!o.suppressBaseShift&&(v=(l.height-l.depth)/2-e.fontMetrics().axisHeight,y=l.italic),a){l=Vt.makeSpan([],[l]);var b=void 0,w=void 0;if(r){var k=ue(r,e.havingStyle(s.sup()),e);w={elem:k,kern:Math.max(e.fontMetrics().bigOpSpacing1,e.fontMetrics().bigOpSpacing3-k.depth)}}if(n){var S=ue(n,e.havingStyle(s.sub()),e);b={elem:S,kern:Math.max(e.fontMetrics().bigOpSpacing2,e.fontMetrics().bigOpSpacing4-S.height)}}var z=void 0;if(w&&b){var T=e.fontMetrics().bigOpSpacing5+b.elem.height+b.elem.depth+b.kern+l.depth+v;z=Vt.makeVList({positionType:"bottom",positionData:T,children:[{type:"kern",size:e.fontMetrics().bigOpSpacing5},{type:"elem",elem:b.elem,marginLeft:-y+"em"},{type:"kern",size:b.kern},{type:"elem",elem:l},{type:"kern",size:w.kern},{type:"elem",elem:w.elem,marginLeft:y+"em"},{type:"kern",size:e.fontMetrics().bigOpSpacing5}]},e)}else if(b){var A=l.height-v;z=Vt.makeVList({positionType:"top",positionData:A,children:[{type:"kern",size:e.fontMetrics().bigOpSpacing5},{type:"elem",elem:b.elem,marginLeft:-y+"em"},{type:"kern",size:b.kern},{type:"elem",elem:l}]},e)}else{if(!w)return l;var B=l.depth+v;z=Vt.makeVList({positionType:"bottom",positionData:B,children:[{type:"elem",elem:l},{type:"kern",size:w.kern},{type:"elem",elem:w.elem,marginLeft:y+"em"},{type:"kern",size:e.fontMetrics().bigOpSpacing5}]},e)}return Vt.makeSpan(["mop","op-limits"],[z],e)}return v&&(l.style.position="relative",l.style.top=v+"em"),l},Ar=function(t,e){var r=void 0;if(t.symbol)r=new xe("mo",[we(t.name,t.mode)]);else{if(!t.body)return ge([r=new xe("mi",[new ve(t.name.slice(1))]),new xe("mo",[we("\u2061","text")])]);r=new xe("mo",Me(t.body,e))}return r},Br={"\u220f":"\\prod","\u2210":"\\coprod","\u2211":"\\sum","\u22c0":"\\bigwedge","\u22c1":"\\bigvee","\u22c2":"\\bigcap","\u22c3":"\\bigcap","\u2a00":"\\bigodot","\u2a01":"\\bigoplus","\u2a02":"\\bigotimes","\u2a04":"\\biguplus","\u2a06":"\\bigsqcup"};te({type:"op",names:["\\coprod","\\bigvee","\\bigwedge","\\biguplus","\\bigcap","\\bigcup","\\intop","\\prod","\\sum","\\bigotimes","\\bigoplus","\\bigodot","\\bigsqcup","\\smallint","\u220f","\u2210","\u2211","\u22c0","\u22c1","\u22c2","\u22c3","\u2a00","\u2a01","\u2a02","\u2a04","\u2a06"],props:{numArgs:0},handler:function(t,e){var r=t.parser,n=t.funcName;return 1===n.length&&(n=Br[n]),{type:"op",mode:r.mode,limits:!0,symbol:!0,name:n}},htmlBuilder:Tr,mathmlBuilder:Ar}),te({type:"op",names:["\\mathop"],props:{numArgs:1},handler:function(t,e){var r=t.parser,n=e[0];return{type:"op",mode:r.mode,limits:!1,symbol:!1,body:re(n)}},htmlBuilder:Tr,mathmlBuilder:Ar});var Cr={"\u222b":"\\int","\u222c":"\\iint","\u222d":"\\iiint","\u222e":"\\oint","\u222f":"\\oiint","\u2230":"\\oiiint"};function Nr(t,e,r){for(var n=he(t,e,!1),a=e.sizeMultiplier/r.sizeMultiplier,o=0;o<n.length;o++){var i=n[o].classes.indexOf("sizing");i<0?Array.prototype.push.apply(n[o].classes,e.sizingClasses(r)):n[o].classes[i+1]==="reset-size"+e.size&&(n[o].classes[i+1]="reset-size"+r.size),n[o].height*=a,n[o].depth*=a}return Vt.makeFragment(n)}te({type:"op",names:["\\mathop"],props:{numArgs:1},handler:function(t,e){var r=t.parser,n=e[0];return{type:"op",mode:r.mode,limits:!1,symbol:!1,body:re(n)}},htmlBuilder:Tr,mathmlBuilder:Ar}),te({type:"op",names:["\\arcsin","\\arccos","\\arctan","\\arctg","\\arcctg","\\arg","\\ch","\\cos","\\cosec","\\cosh","\\cot","\\cotg","\\coth","\\csc","\\ctg","\\cth","\\deg","\\dim","\\exp","\\hom","\\ker","\\lg","\\ln","\\log","\\sec","\\sin","\\sinh","\\sh","\\tan","\\tanh","\\tg","\\th"],props:{numArgs:0},handler:function(t){var e=t.parser,r=t.funcName;return{type:"op",mode:e.mode,limits:!1,symbol:!1,name:r}},htmlBuilder:Tr,mathmlBuilder:Ar}),te({type:"op",names:["\\det","\\gcd","\\inf","\\lim","\\max","\\min","\\Pr","\\sup"],props:{numArgs:0},handler:function(t){var e=t.parser,r=t.funcName;return{type:"op",mode:e.mode,limits:!0,symbol:!1,name:r}},htmlBuilder:Tr,mathmlBuilder:Ar}),te({type:"op",names:["\\int","\\iint","\\iiint","\\oint","\\oiint","\\oiiint","\u222b","\u222c","\u222d","\u222e","\u222f","\u2230"],props:{numArgs:0},handler:function(t){var e=t.parser,r=t.funcName;return 1===r.length&&(r=Cr[r]),{type:"op",mode:e.mode,limits:!1,symbol:!0,name:r}},htmlBuilder:Tr,mathmlBuilder:Ar}),te({type:"operatorname",names:["\\operatorname"],props:{numArgs:1},handler:function(t,e){var r=t.parser,n=e[0];return{type:"operatorname",mode:r.mode,body:re(n)}},htmlBuilder:function(t,e){if(t.body.length>0){for(var r=t.body.map(function(t){var e=t.text;return"string"==typeof e?{type:"textord",mode:t.mode,text:e}:t}),n=he(r,e.withFont("mathrm"),!0),a=0;a<n.length;a++){var o=n[a];o instanceof H&&(o.text=o.text.replace(/\u2212/,"-").replace(/\u2217/,"*"))}return Vt.makeSpan(["mop"],n,e)}return Vt.makeSpan(["mop"],[],e)},mathmlBuilder:function(t,e){for(var r=Me(t.body,e.withFont("mathrm")),n=!0,a=0;a<r.length;a++){var o=r[a];if(o instanceof be.SpaceNode);else if(o instanceof be.MathNode)switch(o.type){case"mi":case"mn":case"ms":case"mspace":case"mtext":break;case"mo":var i=o.children[0];1===o.children.length&&i instanceof be.TextNode?i.text=i.text.replace(/\u2212/,"-").replace(/\u2217/,"*"):n=!1;break;default:n=!1}else n=!1}if(n){var s=r.map(function(t){return t.toText()}).join("");r=[new be.TextNode(s,!1)]}var h=new be.MathNode("mi",r);h.setAttribute("mathvariant","normal");var l=new be.MathNode("mo",[we("\u2061","text")]);return be.newDocumentFragment([h,l])}}),ee({type:"ordgroup",htmlBuilder:function(t,e){return Vt.makeSpan(["mord"],he(t.body,e,!0),e)},mathmlBuilder:function(t,e){return ze(t.body,e)}}),te({type:"overline",names:["\\overline"],props:{numArgs:1},handler:function(t,e){var r=t.parser,n=e[0];return{type:"overline",mode:r.mode,body:n}},htmlBuilder:function(t,e){var r=ue(t.body,e.havingCrampedStyle()),n=Vt.makeLineSpan("overline-line",e),a=Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:r},{type:"kern",size:3*n.height},{type:"elem",elem:n},{type:"kern",size:n.height}]},e);return Vt.makeSpan(["mord","overline"],[a],e)},mathmlBuilder:function(t,e){var r=new be.MathNode("mo",[new be.TextNode("\u203e")]);r.setAttribute("stretchy","true");var n=new be.MathNode("mover",[Te(t.body,e),r]);return n.setAttribute("accent","true"),n}}),te({type:"phantom",names:["\\phantom"],props:{numArgs:1,allowedInText:!0},handler:function(t,e){var r=t.parser,n=e[0];return{type:"phantom",mode:r.mode,body:re(n)}},htmlBuilder:function(t,e){var r=he(t.body,e.withPhantom(),!1);return Vt.makeFragment(r)},mathmlBuilder:function(t,e){var r=Me(t.body,e);return new be.MathNode("mphantom",r)}}),te({type:"hphantom",names:["\\hphantom"],props:{numArgs:1,allowedInText:!0},handler:function(t,e){var r=t.parser,n=e[0];return{type:"hphantom",mode:r.mode,body:n}},htmlBuilder:function(t,e){var r=Vt.makeSpan([],[ue(t.body,e.withPhantom())]);if(r.height=0,r.depth=0,r.children)for(var n=0;n<r.children.length;n++)r.children[n].height=0,r.children[n].depth=0;return r=Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:r}]},e)},mathmlBuilder:function(t,e){var r=Me(re(t.body),e),n=new be.MathNode("mphantom",r);return n.setAttribute("height","0px"),n}}),te({type:"vphantom",names:["\\vphantom"],props:{numArgs:1,allowedInText:!0},handler:function(t,e){var r=t.parser,n=e[0];return{type:"vphantom",mode:r.mode,body:n}},htmlBuilder:function(t,e){var r=Vt.makeSpan(["inner"],[ue(t.body,e.withPhantom())]),n=Vt.makeSpan(["fix"],[]);return Vt.makeSpan(["mord","rlap"],[r,n],e)},mathmlBuilder:function(t,e){var r=Me(re(t.body),e),n=new be.MathNode("mphantom",r);return n.setAttribute("width","0px"),n}});var qr=["\\tiny","\\sixptsize","\\scriptsize","\\footnotesize","\\small","\\normalsize","\\large","\\Large","\\LARGE","\\huge","\\Huge"],Er=function(t,e){var r=e.havingSize(t.size);return Nr(t.body,r,e)};te({type:"sizing",names:qr,props:{numArgs:0,allowedInText:!0},handler:function(t,e){var r=t.breakOnTokenText,n=t.funcName,a=t.parser;a.consumeSpaces();var o=a.parseExpression(!1,r);return{type:"sizing",mode:a.mode,size:qr.indexOf(n)+1,body:o}},htmlBuilder:Er,mathmlBuilder:function(t,e){var r=e.havingSize(t.size),n=Me(t.body,r),a=new be.MathNode("mstyle",n);return a.setAttribute("mathsize",r.sizeMultiplier+"em"),a}}),te({type:"raisebox",names:["\\raisebox"],props:{numArgs:2,argTypes:["size","text"],allowedInText:!0},handler:function(t,e){var r=t.parser,n=Gt(e[0],"size").value,a=e[1];return{type:"raisebox",mode:r.mode,dy:n,body:a}},htmlBuilder:function(t,e){var r={type:"text",mode:t.mode,body:re(t.body),font:"mathrm"},n={type:"sizing",mode:t.mode,body:[r],size:6},a=Er(n,e),o=Bt(t.dy,e);return Vt.makeVList({positionType:"shift",positionData:-o,children:[{type:"elem",elem:a}]},e)},mathmlBuilder:function(t,e){var r=new be.MathNode("mpadded",[Te(t.body,e)]),n=t.dy.number+t.dy.unit;return r.setAttribute("voffset",n),r}}),te({type:"rule",names:["\\rule"],props:{numArgs:2,numOptionalArgs:1,argTypes:["size","size","size"]},handler:function(t,e,r){var n=t.parser,a=r[0],o=Gt(e[0],"size"),i=Gt(e[1],"size");return{type:"rule",mode:n.mode,shift:a&&Gt(a,"size").value,width:o.value,height:i.value}},htmlBuilder:function(t,e){var r=Vt.makeSpan(["mord","rule"],[],e),n=0;t.shift&&(n=Bt(t.shift,e));var a=Bt(t.width,e),o=Bt(t.height,e);return r.style.borderRightWidth=a+"em",r.style.borderTopWidth=o+"em",r.style.bottom=n+"em",r.width=a,r.height=o+n,r.depth=-n,r.maxFontSize=1.125*o*e.sizeMultiplier,r},mathmlBuilder:function(t,e){return new be.MathNode("mrow")}}),te({type:"smash",names:["\\smash"],props:{numArgs:1,numOptionalArgs:1,allowedInText:!0},handler:function(t,e,r){var n=t.parser,a=!1,o=!1,i=r[0]&&Gt(r[0],"ordgroup");if(i)for(var s="",h=0;h<i.body.length;++h){if("t"===(s=i.body[h].text))a=!0;else{if("b"!==s){a=!1,o=!1;break}o=!0}}else a=!0,o=!0;var l=e[0];return{type:"smash",mode:n.mode,body:l,smashHeight:a,smashDepth:o}},htmlBuilder:function(t,e){var r=Vt.makeSpan(["mord"],[ue(t.body,e)]);if(!t.smashHeight&&!t.smashDepth)return r;if(t.smashHeight&&(r.height=0,r.children))for(var n=0;n<r.children.length;n++)r.children[n].height=0;if(t.smashDepth&&(r.depth=0,r.children))for(var a=0;a<r.children.length;a++)r.children[a].depth=0;return Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:r}]},e)},mathmlBuilder:function(t,e){var r=new be.MathNode("mpadded",[Te(t.body,e)]);return t.smashHeight&&r.setAttribute("height","0px"),t.smashDepth&&r.setAttribute("depth","0px"),r}}),te({type:"sqrt",names:["\\sqrt"],props:{numArgs:1,numOptionalArgs:1},handler:function(t,e,r){var n=t.parser,a=r[0],o=e[0];return{type:"sqrt",mode:n.mode,body:o,index:a}},htmlBuilder:function(t,e){var r=ue(t.body,e.havingCrampedStyle());0===r.height&&(r.height=e.fontMetrics().xHeight),r instanceof C&&(r=Vt.makeSpan([],[r],e));var n=e.fontMetrics().defaultRuleThickness,a=n;e.style.id<M.TEXT.id&&(a=e.fontMetrics().xHeight);var o=n+a/4,i=r.height+r.depth+o+n,s=nr(i,e),h=s.span,l=s.ruleWidth,m=s.advanceWidth,c=h.height-l;c>r.height+r.depth+o&&(o=(o+c-r.height-r.depth)/2);var p=h.height-r.height-o-l;r.style.paddingLeft=m+"em";var u=Vt.makeVList({positionType:"firstBaseline",children:[{type:"elem",elem:r,wrapperClasses:["svg-align"]},{type:"kern",size:-(r.height+p)},{type:"elem",elem:h},{type:"kern",size:l}]},e);if(t.index){var d=e.havingStyle(M.SCRIPTSCRIPT),f=ue(t.index,d,e),g=.6*(u.height-u.depth),x=Vt.makeVList({positionType:"shift",positionData:-g,children:[{type:"elem",elem:f}]},e),v=Vt.makeSpan(["root"],[x]);return Vt.makeSpan(["mord","sqrt"],[v,u],e)}return Vt.makeSpan(["mord","sqrt"],[u],e)},mathmlBuilder:function(t,e){var r=t.body,n=t.index;return n?new be.MathNode("mroot",[Te(r,e),Te(n,e)]):new be.MathNode("msqrt",[Te(r,e)])}});var Or={display:M.DISPLAY,text:M.TEXT,script:M.SCRIPT,scriptscript:M.SCRIPTSCRIPT};te({type:"styling",names:["\\displaystyle","\\textstyle","\\scriptstyle","\\scriptscriptstyle"],props:{numArgs:0,allowedInText:!0},handler:function(t,e){var r=t.breakOnTokenText,n=t.funcName,a=t.parser;a.consumeSpaces();var o=a.parseExpression(!0,r),i=n.slice(1,n.length-5);return{type:"styling",mode:a.mode,style:i,body:o}},htmlBuilder:function(t,e){var r=Or[t.style],n=e.havingStyle(r).withFont("");return Nr(t.body,n,e)},mathmlBuilder:function(t,e){var r={display:M.DISPLAY,text:M.TEXT,script:M.SCRIPT,scriptscript:M.SCRIPTSCRIPT}[t.style],n=e.havingStyle(r),a=Me(t.body,n),o=new be.MathNode("mstyle",a),i={display:["0","true"],text:["0","false"],script:["1","false"],scriptscript:["2","false"]}[t.style];return o.setAttribute("scriptlevel",i[0]),o.setAttribute("displaystyle",i[1]),o}});ee({type:"supsub",htmlBuilder:function(t,e){var r=function(t,e){var r=t.base;return r?"op"===r.type?r.limits&&(e.style.size===M.DISPLAY.size||r.alwaysHandleSupSub)?Tr:null:"accent"===r.type?d.isCharacterBox(r.base)?Re:null:"horizBrace"===r.type&&!t.sub===r.isOver?Mr:null:null}(t,e);if(r)return r(t,e);var n=t.base,a=t.sup,o=t.sub,i=ue(n,e),s=void 0,h=void 0,l=e.fontMetrics(),m=0,c=0,p=n&&d.isCharacterBox(n);if(a){var u=e.havingStyle(e.style.sup());s=ue(a,u,e),p||(m=i.height-u.fontMetrics().supDrop*u.sizeMultiplier/e.sizeMultiplier)}if(o){var f=e.havingStyle(e.style.sub());h=ue(o,f,e),p||(c=i.depth+f.fontMetrics().subDrop*f.sizeMultiplier/e.sizeMultiplier)}var g=void 0;g=e.style===M.DISPLAY?l.sup1:e.style.cramped?l.sup3:l.sup2;var x=e.sizeMultiplier,v=.5/l.ptPerEm/x+"em",y=null;if(h){var b=t.base&&"op"===t.base.type&&t.base.name&&("\\oiint"===t.base.name||"\\oiiint"===t.base.name);(i instanceof H||b)&&(y=-i.italic+"em")}var w=void 0;if(s&&h){m=Math.max(m,g,s.depth+.25*l.xHeight),c=Math.max(c,l.sub2);var k=4*l.defaultRuleThickness;if(m-s.depth-(h.height-c)<k){c=k-(m-s.depth)+h.height;var S=.8*l.xHeight-(m-s.depth);S>0&&(m+=S,c-=S)}var z=[{type:"elem",elem:h,shift:c,marginRight:v,marginLeft:y},{type:"elem",elem:s,shift:-m,marginRight:v}];w=Vt.makeVList({positionType:"individualShift",children:z},e)}else if(h){c=Math.max(c,l.sub1,h.height-.8*l.xHeight);var T=[{type:"elem",elem:h,marginLeft:y,marginRight:v}];w=Vt.makeVList({positionType:"shift",positionData:c,children:T},e)}else{if(!s)throw new Error("supsub must have either sup or sub.");m=Math.max(m,g,s.depth+.25*l.xHeight),w=Vt.makeVList({positionType:"shift",positionData:-m,children:[{type:"elem",elem:s,marginRight:v}]},e)}var A=me(i,"right")||"mord";return Vt.makeSpan([A],[i,Vt.makeSpan(["msupsub"],[w])],e)},mathmlBuilder:function(t,e){var r=!1,n=void 0,a=Ut(t.base,"horizBrace");a&&!!t.sup===a.isOver&&(r=!0,n=a.isOver);var o=[Te(t.base,e)];t.sub&&o.push(Te(t.sub,e)),t.sup&&o.push(Te(t.sup,e));var i=void 0;if(r)i=n?"mover":"munder";else if(t.sub)if(t.sup){var s=t.base;i=s&&"op"===s.type&&s.limits&&e.style===M.DISPLAY?"munderover":"msubsup"}else{var h=t.base;i=h&&"op"===h.type&&h.limits&&e.style===M.DISPLAY?"munder":"msub"}else{var l=t.base;i=l&&"op"===l.type&&l.limits&&e.style===M.DISPLAY?"mover":"msup"}return new be.MathNode(i,o)}}),ee({type:"atom",htmlBuilder:function(t,e){return Vt.mathsym(t.text,t.mode,e,["m"+t.family])},mathmlBuilder:function(t,e){var r=new be.MathNode("mo",[we(t.text,t.mode)]);if("bin"===t.family){var n=Se(t,e);"bold-italic"===n&&r.setAttribute("mathvariant",n)}else"punct"===t.family&&r.setAttribute("separator","true");return r}});var Ir={mi:"italic",mn:"normal",mtext:"normal"};ee({type:"mathord",htmlBuilder:function(t,e){return Vt.makeOrd(t,e,"mathord")},mathmlBuilder:function(t,e){var r=new be.MathNode("mi",[we(t.text,t.mode,e)]),n=Se(t,e)||"italic";return n!==Ir[r.type]&&r.setAttribute("mathvariant",n),r}}),ee({type:"textord",htmlBuilder:function(t,e){return Vt.makeOrd(t,e,"textord")},mathmlBuilder:function(t,e){var r=we(t.text,t.mode,e),n=Se(t,e)||"normal",a=void 0;return a="text"===t.mode?new be.MathNode("mtext",[r]):/[0-9]/.test(t.text)?new be.MathNode("mn",[r]):"\\prime"===t.text?new be.MathNode("mo",[r]):new be.MathNode("mi",[r]),n!==Ir[a.type]&&a.setAttribute("mathvariant",n),a}}),ee({type:"spacing",htmlBuilder:function(t,e){if(Vt.regularSpace.hasOwnProperty(t.text)){var r=Vt.regularSpace[t.text].className||"";if("text"===t.mode){var n=Vt.makeOrd(t,e,"textord");return n.classes.push(r),n}return Vt.makeSpan(["mspace",r],[Vt.mathsym(t.text,t.mode,e)],e)}if(Vt.cssSpace.hasOwnProperty(t.text))return Vt.makeSpan(["mspace",Vt.cssSpace[t.text]],[],e);throw new h('Unknown type of space "'+t.text+'"')},mathmlBuilder:function(t,e){if(!Vt.regularSpace.hasOwnProperty(t.text)){if(Vt.cssSpace.hasOwnProperty(t.text))return new be.MathNode("mspace");throw new h('Unknown type of space "'+t.text+'"')}return new be.MathNode("mtext",[new be.TextNode("\xa0")])}}),ee({type:"tag",mathmlBuilder:function(t,e){var r=new be.MathNode("mtable",[new be.MathNode("mlabeledtr",[new be.MathNode("mtd",[ze(t.tag,e)]),new be.MathNode("mtd",[ze(t.body,e)])])]);return r.setAttribute("side","right"),r}});var Rr={"\\text":void 0,"\\textrm":"textrm","\\textsf":"textsf","\\texttt":"texttt","\\textnormal":"textrm"},Lr={"\\textbf":"textbf"},Hr={"\\textit":"textit"},Dr=function(t,e){var r=t.font;return r?Rr[r]?e.withTextFontFamily(Rr[r]):Lr[r]?e.withTextFontWeight(Lr[r]):e.withTextFontShape(Hr[r]):e};te({type:"text",names:["\\text","\\textrm","\\textsf","\\texttt","\\textnormal","\\textbf","\\textit"],props:{numArgs:1,argTypes:["text"],greediness:2,allowedInText:!0,consumeMode:"text"},handler:function(t,e){var r=t.parser,n=t.funcName,a=e[0];return{type:"text",mode:r.mode,body:re(a),font:n}},htmlBuilder:function(t,e){var r=Dr(t,e),n=he(t.body,r,!0);return Vt.tryCombineChars(n),Vt.makeSpan(["mord","text"],n,r)},mathmlBuilder:function(t,e){var r=Dr(t,e);return ze(t.body,r)}}),te({type:"underline",names:["\\underline"],props:{numArgs:1,allowedInText:!0},handler:function(t,e){return{type:"underline",mode:t.parser.mode,body:e[0]}},htmlBuilder:function(t,e){var r=ue(t.body,e),n=Vt.makeLineSpan("underline-line",e),a=Vt.makeVList({positionType:"top",positionData:r.height,children:[{type:"kern",size:n.height},{type:"elem",elem:n},{type:"kern",size:3*n.height},{type:"elem",elem:r}]},e);return Vt.makeSpan(["mord","underline"],[a],e)},mathmlBuilder:function(t,e){var r=new be.MathNode("mo",[new be.TextNode("\u203e")]);r.setAttribute("stretchy","true");var n=new be.MathNode("munder",[Te(t.body,e),r]);return n.setAttribute("accentunder","true"),n}}),te({type:"verb",names:["\\verb"],props:{numArgs:0,allowedInText:!0},handler:function(t,e,r){throw new h("\\verb ended by end of line instead of matching delimiter")},htmlBuilder:function(t,e){for(var r=Vt.makeVerb(t,e),n=[],a=e.havingStyle(e.style.text()),o=0;o<r.length;o++){var i=r[o];"~"===i&&(i="\\textasciitilde"),n.push(Vt.makeSymbol(i,"Typewriter-Regular",t.mode,a,["mord","texttt"]))}return Vt.tryCombineChars(n),Vt.makeSpan(["mord","text"].concat(a.sizingClasses(e)),n,a)},mathmlBuilder:function(t,e){var r=new be.TextNode(Vt.makeVerb(t,e)),n=new be.MathNode("mtext",[r]);return n.setAttribute("mathvariant","monospace"),n}});var Pr=Kt,Fr={};function Vr(t){for(var e=t.type,r=t.names,n=t.props,a=t.handler,o=t.htmlBuilder,i=t.mathmlBuilder,s={type:e,numArgs:n.numArgs||0,greediness:1,allowedInText:!1,numOptionalArgs:0,handler:a},h=0;h<r.length;++h)Fr[r[h]]=s;o&&(Jt[e]=o),i&&(Qt[e]=i)}function Gr(t){var e=[];t.consumeSpaces();for(var r=t.nextToken.text;"\\hline"===r||"\\hdashline"===r;)t.consume(),e.push("\\hdashline"===r),t.consumeSpaces(),r=t.nextToken.text;return e}function Ur(t,e,r){var n=e.hskipBeforeAndAfter,a=e.addJot,o=e.cols,i=e.arraystretch;if(t.gullet.beginGroup(),t.gullet.macros.set("\\\\","\\cr"),!i){var s=t.gullet.expandMacroAsText("\\arraystretch");if(null==s)i=1;else if(!(i=parseFloat(s))||i<0)throw new h("Invalid \\arraystretch: "+s)}var l=[],m=[l],c=[],p=[];for(p.push(Gr(t));;){var u=t.parseExpression(!1,"\\cr");u={type:"ordgroup",mode:t.mode,body:u},r&&(u={type:"styling",mode:t.mode,style:r,body:[u]}),l.push(u);var d=t.nextToken.text;if("&"===d)t.consume();else{if("\\end"===d){1===l.length&&"styling"===u.type&&0===u.body[0].body.length&&m.pop(),p.length<m.length+1&&p.push([]);break}if("\\cr"!==d)throw new h("Expected & or \\\\ or \\cr or \\end",t.nextToken);var f=t.parseFunction();if(!f)throw new h("Failed to parse function after "+d);c.push(Gt(f,"cr").size),p.push(Gr(t)),l=[],m.push(l)}}return t.gullet.endGroup(),{type:"array",mode:t.mode,addJot:a,arraystretch:i,body:m,cols:o,rowGaps:c,hskipBeforeAndAfter:n,hLinesBeforeRow:p}}function Xr(t){return"d"===t.substr(0,1)?"display":"text"}var Yr=function(t,e){var r=void 0,n=void 0,a=t.body.length,o=t.hLinesBeforeRow,i=0,s=new Array(a),l=[],m=1/e.fontMetrics().ptPerEm,c=5*m,p=12*m,u=3*m,f=t.arraystretch*p,g=.7*f,x=.3*f,v=0;function y(t){for(var e=0;e<t.length;++e)e>0&&(v+=.25),l.push({pos:v,isDashed:t[e]})}for(y(o[0]),r=0;r<t.body.length;++r){var b=t.body[r],w=g,k=x;i<b.length&&(i=b.length);var S=new Array(b.length);for(n=0;n<b.length;++n){var M=ue(b[n],e);k<M.depth&&(k=M.depth),w<M.height&&(w=M.height),S[n]=M}var z=t.rowGaps[r],T=0;z&&(T=Bt(z,e))>0&&(k<(T+=x)&&(k=T),T=0),t.addJot&&(k+=u),S.height=w,S.depth=k,v+=w,S.pos=v,v+=k+T,s[r]=S,y(o[r+1])}var A=v/2+e.fontMetrics().axisHeight,B=t.cols||[],C=[],N=void 0,q=void 0;for(n=0,q=0;n<i||q<B.length;++n,++q){for(var E=B[q]||{},O=!0;"separator"===E.type;){if(O||((N=Vt.makeSpan(["arraycolsep"],[])).style.width=e.fontMetrics().doubleRuleSep+"em",C.push(N)),"|"===E.separator){var I=Vt.makeSpan(["vertical-separator"],[],e);I.style.height=v+"em",I.style.verticalAlign=-(v-A)+"em",C.push(I)}else{if(":"!==E.separator)throw new h("Invalid separator type: "+E.separator);var R=Vt.makeSpan(["vertical-separator","vs-dashed"],[],e);R.style.height=v+"em",R.style.verticalAlign=-(v-A)+"em",C.push(R)}E=B[++q]||{},O=!1}if(!(n>=i)){var L=void 0;(n>0||t.hskipBeforeAndAfter)&&0!==(L=d.deflt(E.pregap,c))&&((N=Vt.makeSpan(["arraycolsep"],[])).style.width=L+"em",C.push(N));var H=[];for(r=0;r<a;++r){var D=s[r],P=D[n];if(P){var F=D.pos-A;P.depth=D.depth,P.height=D.height,H.push({type:"elem",elem:P,shift:F})}}H=Vt.makeVList({positionType:"individualShift",children:H},e),H=Vt.makeSpan(["col-align-"+(E.align||"c")],[H]),C.push(H),(n<i-1||t.hskipBeforeAndAfter)&&0!==(L=d.deflt(E.postgap,c))&&((N=Vt.makeSpan(["arraycolsep"],[])).style.width=L+"em",C.push(N))}}if(s=Vt.makeSpan(["mtable"],C),l.length>0){for(var V=Vt.makeLineSpan("hline",e,.05),G=Vt.makeLineSpan("hdashline",e,.05),U=[{type:"elem",elem:s,shift:0}];l.length>0;){var X=l.pop(),Y=X.pos-A;X.isDashed?U.push({type:"elem",elem:G,shift:Y}):U.push({type:"elem",elem:V,shift:Y})}s=Vt.makeVList({positionType:"individualShift",children:U},e)}return Vt.makeSpan(["mord"],[s],e)},_r=function(t,e){return new be.MathNode("mtable",t.body.map(function(t){return new be.MathNode("mtr",t.map(function(t){return new be.MathNode("mtd",[Te(t,e)])}))}))},Wr=function(t,e){var r=[],n=Ur(t.parser,{cols:r,addJot:!0},"display"),a=void 0,o=0,i={type:"ordgroup",mode:t.mode,body:[]},s=Ut(e[0],"ordgroup");if(s){for(var l="",m=0;m<s.body.length;m++){l+=Gt(s.body[m],"textord").text}a=Number(l),o=2*a}var c=!o;n.body.forEach(function(t){for(var e=1;e<t.length;e+=2){Gt(Gt(t[e],"styling").body[0],"ordgroup").body.unshift(i)}if(c)o<t.length&&(o=t.length);else{var r=t.length/2;if(a<r)throw new h("Too many math in a row: expected "+a+", but got "+r,t[0])}});for(var p=0;p<o;++p){var u="r",d=0;p%2==1?u="l":p>0&&c&&(d=1),r[p]={type:"align",align:u,pregap:d,postgap:0}}return n};Vr({type:"array",names:["array","darray"],props:{numArgs:1},handler:function(t,e){var r={cols:(Yt(e[0])?[e[0]]:Gt(e[0],"ordgroup").body).map(function(t){var e=function(t){var e=Yt(t);if(!e)throw new Error("Expected node of symbol group type, but got "+(t?"node of type "+t.type:String(t)));return e}(t).text;if(-1!=="lcr".indexOf(e))return{type:"align",align:e};if("|"===e)return{type:"separator",separator:"|"};if(":"===e)return{type:"separator",separator:":"};throw new h("Unknown column alignment: "+e,t)}),hskipBeforeAndAfter:!0};return Ur(t.parser,r,Xr(t.envName))},htmlBuilder:Yr,mathmlBuilder:_r}),Vr({type:"array",names:["matrix","pmatrix","bmatrix","Bmatrix","vmatrix","Vmatrix"],props:{numArgs:0},handler:function(t){var e={matrix:null,pmatrix:["(",")"],bmatrix:["[","]"],Bmatrix:["\\{","\\}"],vmatrix:["|","|"],Vmatrix:["\\Vert","\\Vert"]}[t.envName],r=Ur(t.parser,{hskipBeforeAndAfter:!1},Xr(t.envName));return e?{type:"leftright",mode:t.mode,body:[r],left:e[0],right:e[1]}:r},htmlBuilder:Yr,mathmlBuilder:_r}),Vr({type:"array",names:["cases","dcases"],props:{numArgs:0},handler:function(t){var e=Ur(t.parser,{arraystretch:1.2,cols:[{type:"align",align:"l",pregap:0,postgap:1},{type:"align",align:"l",pregap:0,postgap:0}]},Xr(t.envName));return{type:"leftright",mode:t.mode,body:[e],left:"\\{",right:"."}},htmlBuilder:Yr,mathmlBuilder:_r}),Vr({type:"array",names:["aligned"],props:{numArgs:0},handler:Wr,htmlBuilder:Yr,mathmlBuilder:_r}),Vr({type:"array",names:["gathered"],props:{numArgs:0},handler:function(t){return Ur(t.parser,{cols:[{type:"align",align:"c"}],addJot:!0},"display")},htmlBuilder:Yr,mathmlBuilder:_r}),Vr({type:"array",names:["alignedat"],props:{numArgs:1},handler:Wr,htmlBuilder:Yr,mathmlBuilder:_r}),te({type:"text",names:["\\hline","\\hdashline"],props:{numArgs:0,allowedInText:!0,allowedInMath:!0},handler:function(t,e){throw new h(t.funcName+" valid only within array environment")}});var jr=Fr,$r=new RegExp("^(\\\\[a-zA-Z@]+)[ \r\n\t]*$"),Zr=new RegExp("[\u0300-\u036f]+$"),Kr="(\\\\href|\\\\url)(?:[ \r\n\t]*\\{((?:[^{}\\\\]|\\\\[^]|{[^{}]*})*)\\}|[ \r\n\t]+([^{}])|[ \r\n\t]*([^{}a-zA-Z]))",Jr="([ \r\n\t]+)|(%[^\n]*(?:\n|$)|[!-\\[\\]-\u2027\u202a-\ud7ff\uf900-\uffff][\u0300-\u036f]*|[\ud800-\udbff][\udc00-\udfff][\u0300-\u036f]*|\\\\verb\\*([^]).*?\\3|\\\\verb([^*a-zA-Z]).*?\\4|"+Kr+"|\\\\[a-zA-Z@]+[ \r\n\t]*|\\\\[^\ud800-\udfff])",Qr=(new RegExp("^\\\\[a-zA-Z@]+"),new RegExp("^"+Kr)),tn=function(){function t(e,r){a()(this,t),this.input=e,this.settings=r,this.tokenRegex=new RegExp(Jr,"g")}return t.prototype.lex=function(){var t=this.input,e=this.tokenRegex.lastIndex;if(e===t.length)return new i("EOF",new o(this,e,e));var r=this.tokenRegex.exec(t);if(null===r||r.index!==e)throw new h("Unexpected character: '"+t[e]+"'",new i(t[e],new o(this,e,e+1)));var n=r[2]||" ",a=n.match($r);return a&&(n=a[1]+n.slice(a[0].length)),"%"===n[0]?("\n"!==n[n.length-1]&&this.settings.reportNonstrict("commentAtEnd","% comment has no terminating newline; LaTeX would fail because of commenting the end of math mode (e.g. $)"),this.lex()):new i(n,new o(this,e,this.tokenRegex.lastIndex))},t}(),en=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};a()(this,t),this.current=r,this.builtins=e,this.undefStack=[]}return t.prototype.beginGroup=function(){this.undefStack.push({})},t.prototype.endGroup=function(){if(0===this.undefStack.length)throw new h("Unbalanced namespace destruction: attempt to pop global namespace; please report this as a bug");var t=this.undefStack.pop();for(var e in t)t.hasOwnProperty(e)&&(void 0===t[e]?delete this.current[e]:this.current[e]=t[e])},t.prototype.has=function(t){return this.current.hasOwnProperty(t)||this.builtins.hasOwnProperty(t)},t.prototype.get=function(t){return this.current.hasOwnProperty(t)?this.current[t]:this.builtins[t]},t.prototype.set=function(t,e){if(arguments.length>2&&void 0!==arguments[2]&&arguments[2]){for(var r=0;r<this.undefStack.length;r++)delete this.undefStack[r][t];this.undefStack.length>0&&(this.undefStack[this.undefStack.length-1][t]=e)}else{var n=this.undefStack[this.undefStack.length-1];n&&!n.hasOwnProperty(t)&&(n[t]=this.current[t])}this.current[t]=e},t}(),rn={},nn=rn;function an(t,e){rn[t]=e}an("\\@firstoftwo",function(t){return{tokens:t.consumeArgs(2)[0],numArgs:0}}),an("\\@secondoftwo",function(t){return{tokens:t.consumeArgs(2)[1],numArgs:0}}),an("\\@ifnextchar",function(t){var e=t.consumeArgs(3),r=t.future();return 1===e[0].length&&e[0][0].text===r.text?{tokens:e[1],numArgs:0}:{tokens:e[2],numArgs:0}}),an("\\@ifstar","\\@ifnextchar *{\\@firstoftwo{#1}}"),an("\\TextOrMath",function(t){var e=t.consumeArgs(2);return"text"===t.mode?{tokens:e[0],numArgs:0}:{tokens:e[1],numArgs:0}});var on={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,a:10,A:10,b:11,B:11,c:12,C:12,d:13,D:13,e:14,E:14,f:15,F:15};an("\\char",function(t){var e=t.popToken(),r=void 0,n="";if("'"===e.text)r=8,e=t.popToken();else if('"'===e.text)r=16,e=t.popToken();else if("`"===e.text)if("\\"===(e=t.popToken()).text[0])n=e.text.charCodeAt(1);else{if("EOF"===e.text)throw new h("\\char` missing argument");n=e.text.charCodeAt(0)}else r=10;if(r){if(null==(n=on[e.text])||n>=r)throw new h("Invalid base-"+r+" digit "+e.text);for(var a=void 0;null!=(a=on[t.future().text])&&a<r;)n*=r,n+=a,t.popToken()}return"\\@char{"+n+"}"});var sn=function(t,e){var r=t.consumeArgs(1)[0];if(1!==r.length)throw new h("\\gdef's first argument must be a macro name");var n=r[0].text,a=0;for(r=t.consumeArgs(1)[0];1===r.length&&"#"===r[0].text;){if(1!==(r=t.consumeArgs(1)[0]).length)throw new h('Invalid argument number length "'+r.length+'"');if(!/^[1-9]$/.test(r[0].text))throw new h('Invalid argument number "'+r[0].text+'"');if(a++,parseInt(r[0].text)!==a)throw new h('Argument number "'+r[0].text+'" out of order');r=t.consumeArgs(1)[0]}return t.macros.set(n,{tokens:r,numArgs:a},e),""};an("\\gdef",function(t){return sn(t,!0)}),an("\\def",function(t){return sn(t,!1)}),an("\\global",function(t){var e=t.consumeArgs(1)[0];if(1!==e.length)throw new h("Invalid command after \\global");var r=e[0].text;if("\\def"===r)return sn(t,!0);throw new h("Invalid command '"+r+"' after \\global")});var hn=function(t,e,r){var n=t.consumeArgs(1)[0];if(1!==n.length)throw new h("\\newcommand's first argument must be a macro name");var a=n[0].text,o=t.isDefined(a);if(o&&!e)throw new h("\\newcommand{"+a+"} attempting to redefine "+a+"; use \\renewcommand");if(!o&&!r)throw new h("\\renewcommand{"+a+"} when command "+a+" does not yet exist; use \\newcommand");var i=0;if(1===(n=t.consumeArgs(1)[0]).length&&"["===n[0].text){for(var s="",l=t.expandNextToken();"]"!==l.text&&"EOF"!==l.text;)s+=l.text,l=t.expandNextToken();if(!s.match(/^\s*[0-9]+\s*$/))throw new h("Invalid number of arguments: "+s);i=parseInt(s),n=t.consumeArgs(1)[0]}return t.macros.set(a,{tokens:n,numArgs:i}),""};an("\\newcommand",function(t){return hn(t,!1,!0)}),an("\\renewcommand",function(t){return hn(t,!0,!1)}),an("\\providecommand",function(t){return hn(t,!0,!0)}),an("\\bgroup","{"),an("\\egroup","}"),an("\\begingroup","{"),an("\\endgroup","}"),an("\\lq","`"),an("\\rq","'"),an("\\aa","\\r a"),an("\\AA","\\r A"),an("\\textcopyright","\\html@mathml{\\textcircled{c}}{\\char`\xa9}"),an("\\copyright","\\TextOrMath{\\textcopyright}{\\text{\\textcopyright}}"),an("\\textregistered","\\html@mathml{\\textcircled{\\scriptsize R}}{\\char`\xae}"),an("\u2102","\\mathbb{C}"),an("\u210d","\\mathbb{H}"),an("\u2115","\\mathbb{N}"),an("\u2119","\\mathbb{P}"),an("\u211a","\\mathbb{Q}"),an("\u211d","\\mathbb{R}"),an("\u2124","\\mathbb{Z}"),an("\u210e","\\mathit{h}"),an("\u212c","\\mathscr{B}"),an("\u2130","\\mathscr{E}"),an("\u2131","\\mathscr{F}"),an("\u210b","\\mathscr{H}"),an("\u2110","\\mathscr{I}"),an("\u2112","\\mathscr{L}"),an("\u2133","\\mathscr{M}"),an("\u211b","\\mathscr{R}"),an("\u212d","\\mathfrak{C}"),an("\u210c","\\mathfrak{H}"),an("\u2128","\\mathfrak{Z}"),an("\xb7","\\cdotp"),an("\\llap","\\mathllap{\\textrm{#1}}"),an("\\rlap","\\mathrlap{\\textrm{#1}}"),an("\\clap","\\mathclap{\\textrm{#1}}"),an("\\not","\\mathrel{\\mathrlap\\@not}"),an("\\neq","\\html@mathml{\\mathrel{\\not=}}{\\mathrel{\\char`\u2260}}"),an("\\ne","\\neq"),an("\u2260","\\neq"),an("\\notin","\\html@mathml{\\mathrel{{\\in}\\mathllap{/\\mskip1mu}}}{\\mathrel{\\char`\u2209}}"),an("\u2209","\\notin"),an("\u2258","\\html@mathml{\\mathrel{=\\kern{-1em}\\raisebox{0.4em}{$\\scriptsize\\frown$}}}{\\mathrel{\\char`\u2258}}"),an("\u2259","\\html@mathml{\\stackrel{\\tiny\\wedge}{=}}{\\mathrel{\\char`\u2258}}"),an("\u225a","\\html@mathml{\\stackrel{\\tiny\\vee}{=}}{\\mathrel{\\char`\u225a}}"),an("\u225b","\\html@mathml{\\stackrel{\\scriptsize\\star}{=}}{\\mathrel{\\char`\u225b}}"),an("\u225d","\\html@mathml{\\stackrel{\\tiny\\mathrm{def}}{=}}{\\mathrel{\\char`\u225d}}"),an("\u225e","\\html@mathml{\\stackrel{\\tiny\\mathrm{m}}{=}}{\\mathrel{\\char`\u225e}}"),an("\u225f","\\html@mathml{\\stackrel{\\tiny?}{=}}{\\mathrel{\\char`\u225f}}"),an("\u27c2","\\perp"),an("\u203c","\\mathclose{!\\mkern-0.8mu!}"),an("\u220c","\\notni"),an("\u231c","\\ulcorner"),an("\u231d","\\urcorner"),an("\u231e","\\llcorner"),an("\u231f","\\lrcorner"),an("\xa9","\\copyright"),an("\xae","\\textregistered"),an("\ufe0f","\\textregistered"),an("\\vdots","\\mathord{\\varvdots\\rule{0pt}{15pt}}"),an("\u22ee","\\vdots"),an("\\varGamma","\\mathit{\\Gamma}"),an("\\varDelta","\\mathit{\\Delta}"),an("\\varTheta","\\mathit{\\Theta}"),an("\\varLambda","\\mathit{\\Lambda}"),an("\\varXi","\\mathit{\\Xi}"),an("\\varPi","\\mathit{\\Pi}"),an("\\varSigma","\\mathit{\\Sigma}"),an("\\varUpsilon","\\mathit{\\Upsilon}"),an("\\varPhi","\\mathit{\\Phi}"),an("\\varPsi","\\mathit{\\Psi}"),an("\\varOmega","\\mathit{\\Omega}"),an("\\colon","\\nobreak\\mskip2mu\\mathpunct{}\\mathchoice{\\mkern-3mu}{\\mkern-3mu}{}{}{:}\\mskip6mu"),an("\\boxed","\\fbox{$\\displaystyle{#1}$}"),an("\\iff","\\DOTSB\\;\\Longleftrightarrow\\;"),an("\\implies","\\DOTSB\\;\\Longrightarrow\\;"),an("\\impliedby","\\DOTSB\\;\\Longleftarrow\\;");var ln={",":"\\dotsc","\\not":"\\dotsb","+":"\\dotsb","=":"\\dotsb","<":"\\dotsb",">":"\\dotsb","-":"\\dotsb","*":"\\dotsb",":":"\\dotsb","\\DOTSB":"\\dotsb","\\coprod":"\\dotsb","\\bigvee":"\\dotsb","\\bigwedge":"\\dotsb","\\biguplus":"\\dotsb","\\bigcap":"\\dotsb","\\bigcup":"\\dotsb","\\prod":"\\dotsb","\\sum":"\\dotsb","\\bigotimes":"\\dotsb","\\bigoplus":"\\dotsb","\\bigodot":"\\dotsb","\\bigsqcup":"\\dotsb","\\And":"\\dotsb","\\longrightarrow":"\\dotsb","\\Longrightarrow":"\\dotsb","\\longleftarrow":"\\dotsb","\\Longleftarrow":"\\dotsb","\\longleftrightarrow":"\\dotsb","\\Longleftrightarrow":"\\dotsb","\\mapsto":"\\dotsb","\\longmapsto":"\\dotsb","\\hookrightarrow":"\\dotsb","\\doteq":"\\dotsb","\\mathbin":"\\dotsb","\\mathrel":"\\dotsb","\\relbar":"\\dotsb","\\Relbar":"\\dotsb","\\xrightarrow":"\\dotsb","\\xleftarrow":"\\dotsb","\\DOTSI":"\\dotsi","\\int":"\\dotsi","\\oint":"\\dotsi","\\iint":"\\dotsi","\\iiint":"\\dotsi","\\iiiint":"\\dotsi","\\idotsint":"\\dotsi","\\DOTSX":"\\dotsx"};an("\\dots",function(t){var e="\\dotso",r=t.expandAfterFuture().text;return r in ln?e=ln[r]:"\\not"===r.substr(0,4)?e="\\dotsb":r in $.math&&d.contains(["bin","rel"],$.math[r].group)&&(e="\\dotsb"),e});var mn={")":!0,"]":!0,"\\rbrack":!0,"\\}":!0,"\\rbrace":!0,"\\rangle":!0,"\\rceil":!0,"\\rfloor":!0,"\\rgroup":!0,"\\rmoustache":!0,"\\right":!0,"\\bigr":!0,"\\biggr":!0,"\\Bigr":!0,"\\Biggr":!0,$:!0,";":!0,".":!0,",":!0};an("\\dotso",function(t){return t.future().text in mn?"\\ldots\\,":"\\ldots"}),an("\\dotsc",function(t){var e=t.future().text;return e in mn&&","!==e?"\\ldots\\,":"\\ldots"}),an("\\cdots",function(t){return t.future().text in mn?"\\@cdots\\,":"\\@cdots"}),an("\\dotsb","\\cdots"),an("\\dotsm","\\cdots"),an("\\dotsi","\\!\\cdots"),an("\\dotsx","\\ldots\\,"),an("\\DOTSI","\\relax"),an("\\DOTSB","\\relax"),an("\\DOTSX","\\relax"),an("\\tmspace","\\TextOrMath{\\kern#1#3}{\\mskip#1#2}\\relax"),an("\\,","\\tmspace+{3mu}{.1667em}"),an("\\thinspace","\\,"),an("\\:","\\tmspace+{4mu}{.2222em}"),an("\\medspace","\\:"),an("\\;","\\tmspace+{5mu}{.2777em}"),an("\\thickspace","\\;"),an("\\!","\\tmspace-{3mu}{.1667em}"),an("\\negthinspace","\\!"),an("\\negmedspace","\\tmspace-{4mu}{.2222em}"),an("\\negthickspace","\\tmspace-{5mu}{.277em}"),an("\\enspace","\\kern.5em "),an("\\enskip","\\hskip.5em\\relax"),an("\\quad","\\hskip1em\\relax"),an("\\qquad","\\hskip2em\\relax"),an("\\tag","\\@ifstar\\tag@literal\\tag@paren"),an("\\tag@paren","\\tag@literal{({#1})}"),an("\\tag@literal",function(t){if(t.macros.get("\\df@tag"))throw new h("Multiple \\tag");return"\\gdef\\df@tag{\\text{#1}}"}),an("\\bmod","\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}\\mathbin{\\rm mod}\\mathchoice{\\mskip1mu}{\\mskip1mu}{\\mskip5mu}{\\mskip5mu}"),an("\\pod","\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern8mu}{\\mkern8mu}{\\mkern8mu}(#1)"),an("\\pmod","\\pod{{\\rm mod}\\mkern6mu#1}"),an("\\mod","\\allowbreak\\mathchoice{\\mkern18mu}{\\mkern12mu}{\\mkern12mu}{\\mkern12mu}{\\rm mod}\\,\\,#1"),an("\\pmb","\\html@mathml{\\@binrel{#1}{\\mathrlap{#1}\\mathrlap{\\mkern0.4mu\\raisebox{0.4mu}{$#1$}}{\\mkern0.8mu#1}}}{\\mathbf{#1}}"),an("\\\\","\\newline"),an("\\TeX","\\textrm{\\html@mathml{T\\kern-.1667em\\raisebox{-.5ex}{E}\\kern-.125emX}{TeX}}");var cn=V["Main-Regular"]["T".charCodeAt(0)][1]-.7*V["Main-Regular"]["A".charCodeAt(0)][1]+"em";an("\\LaTeX","\\textrm{\\html@mathml{L\\kern-.36em\\raisebox{"+cn+"}{\\scriptsize A}\\kern-.15em\\TeX}{LaTeX}}"),an("\\KaTeX","\\textrm{\\html@mathml{K\\kern-.17em\\raisebox{"+cn+"}{\\scriptsize A}\\kern-.15em\\TeX}{KaTeX}}"),an("\\hspace","\\@ifstar\\@hspacer\\@hspace"),an("\\@hspace","\\hskip #1\\relax"),an("\\@hspacer","\\rule{0pt}{0pt}\\hskip #1\\relax"),an("\\ordinarycolon",":"),an("\\vcentcolon","\\mathrel{\\mathop\\ordinarycolon}"),an("\\dblcolon","\\mathrel{\\vcentcolon\\mathrel{\\mkern-.9mu}\\vcentcolon}"),an("\\coloneqq","\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}=}"),an("\\Coloneqq","\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}=}"),an("\\coloneq","\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}"),an("\\Coloneq","\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\mathrel{-}}"),an("\\eqqcolon","\\mathrel{=\\mathrel{\\mkern-1.2mu}\\vcentcolon}"),an("\\Eqqcolon","\\mathrel{=\\mathrel{\\mkern-1.2mu}\\dblcolon}"),an("\\eqcolon","\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\vcentcolon}"),an("\\Eqcolon","\\mathrel{\\mathrel{-}\\mathrel{\\mkern-1.2mu}\\dblcolon}"),an("\\colonapprox","\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\approx}"),an("\\Colonapprox","\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\approx}"),an("\\colonsim","\\mathrel{\\vcentcolon\\mathrel{\\mkern-1.2mu}\\sim}"),an("\\Colonsim","\\mathrel{\\dblcolon\\mathrel{\\mkern-1.2mu}\\sim}"),an("\u2254","\\coloneqq"),an("\u2255","\\eqqcolon"),an("\u2a74","\\Coloneqq"),an("\\ratio","\\vcentcolon"),an("\\coloncolon","\\dblcolon"),an("\\colonequals","\\coloneqq"),an("\\coloncolonequals","\\Coloneqq"),an("\\equalscolon","\\eqqcolon"),an("\\equalscoloncolon","\\Eqqcolon"),an("\\colonminus","\\coloneq"),an("\\coloncolonminus","\\Coloneq"),an("\\minuscolon","\\eqcolon"),an("\\minuscoloncolon","\\Eqcolon"),an("\\coloncolonapprox","\\Colonapprox"),an("\\coloncolonsim","\\Colonsim"),an("\\simcolon","\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\vcentcolon}"),an("\\simcoloncolon","\\mathrel{\\sim\\mathrel{\\mkern-1.2mu}\\dblcolon}"),an("\\approxcolon","\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\vcentcolon}"),an("\\approxcoloncolon","\\mathrel{\\approx\\mathrel{\\mkern-1.2mu}\\dblcolon}"),an("\\notni","\\html@mathml{\\not\\ni}{\\mathrel{\\char`\u220c}}"),an("\\limsup","\\DOTSB\\mathop{\\operatorname{lim\\,sup}}\\limits"),an("\\liminf","\\DOTSB\\mathop{\\operatorname{lim\\,inf}}\\limits"),an("\\darr","\\downarrow"),an("\\dArr","\\Downarrow"),an("\\Darr","\\Downarrow"),an("\\lang","\\langle"),an("\\rang","\\rangle"),an("\\uarr","\\uparrow"),an("\\uArr","\\Uparrow"),an("\\Uarr","\\Uparrow"),an("\\N","\\mathbb{N}"),an("\\R","\\mathbb{R}"),an("\\Z","\\mathbb{Z}"),an("\\alef","\\aleph"),an("\\alefsym","\\aleph"),an("\\Alpha","\\mathrm{A}"),an("\\Beta","\\mathrm{B}"),an("\\bull","\\bullet"),an("\\Chi","\\mathrm{X}"),an("\\clubs","\\clubsuit"),an("\\cnums","\\mathbb{C}"),an("\\Complex","\\mathbb{C}"),an("\\Dagger","\\ddagger"),an("\\diamonds","\\diamondsuit"),an("\\empty","\\emptyset"),an("\\Epsilon","\\mathrm{E}"),an("\\Eta","\\mathrm{H}"),an("\\exist","\\exists"),an("\\harr","\\leftrightarrow"),an("\\hArr","\\Leftrightarrow"),an("\\Harr","\\Leftrightarrow"),an("\\hearts","\\heartsuit"),an("\\image","\\Im"),an("\\infin","\\infty"),an("\\Iota","\\mathrm{I}"),an("\\isin","\\in"),an("\\Kappa","\\mathrm{K}"),an("\\larr","\\leftarrow"),an("\\lArr","\\Leftarrow"),an("\\Larr","\\Leftarrow"),an("\\lrarr","\\leftrightarrow"),an("\\lrArr","\\Leftrightarrow"),an("\\Lrarr","\\Leftrightarrow"),an("\\Mu","\\mathrm{M}"),an("\\natnums","\\mathbb{N}"),an("\\Nu","\\mathrm{N}"),an("\\Omicron","\\mathrm{O}"),an("\\plusmn","\\pm"),an("\\rarr","\\rightarrow"),an("\\rArr","\\Rightarrow"),an("\\Rarr","\\Rightarrow"),an("\\real","\\Re"),an("\\reals","\\mathbb{R}"),an("\\Reals","\\mathbb{R}"),an("\\Rho","\\mathrm{R}"),an("\\sdot","\\cdot"),an("\\sect","\\S"),an("\\spades","\\spadesuit"),an("\\sub","\\subset"),an("\\sube","\\subseteq"),an("\\supe","\\supseteq"),an("\\Tau","\\mathrm{T}"),an("\\thetasym","\\vartheta"),an("\\weierp","\\wp"),an("\\Zeta","\\mathrm{Z}");var pn={"\\relax":!0,"^":!0,_:!0,"\\limits":!0,"\\nolimits":!0},un=function(){function t(e,r,n){a()(this,t),this.settings=r,this.expansionCount=0,this.feed(e),this.macros=new en(nn,r.macros),this.mode=n,this.stack=[]}return t.prototype.feed=function(t){this.lexer=new tn(t,this.settings)},t.prototype.switchMode=function(t){this.mode=t},t.prototype.beginGroup=function(){this.macros.beginGroup()},t.prototype.endGroup=function(){this.macros.endGroup()},t.prototype.future=function(){return 0===this.stack.length&&this.pushToken(this.lexer.lex()),this.stack[this.stack.length-1]},t.prototype.popToken=function(){return this.future(),this.stack.pop()},t.prototype.pushToken=function(t){this.stack.push(t)},t.prototype.pushTokens=function(t){var e;(e=this.stack).push.apply(e,t)},t.prototype.consumeSpaces=function(){for(;;){if(" "!==this.future().text)break;this.stack.pop()}},t.prototype.consumeArgs=function(t){for(var e=[],r=0;r<t;++r){this.consumeSpaces();var n=this.popToken();if("{"===n.text){for(var a=[],o=1;0!==o;){var i=this.popToken();if(a.push(i),"{"===i.text)++o;else if("}"===i.text)--o;else if("EOF"===i.text)throw new h("End of input in macro argument",n)}a.pop(),a.reverse(),e[r]=a}else{if("EOF"===n.text)throw new h("End of input expecting macro argument");e[r]=[n]}}return e},t.prototype.expandOnce=function(){var t=this.popToken(),e=t.text,r=this._getExpansion(e);if(null==r)return this.pushToken(t),t;if(this.expansionCount++,this.expansionCount>this.settings.maxExpand)throw new h("Too many expansions: infinite loop or need to increase maxExpand setting");var n=r.tokens;if(r.numArgs)for(var a=this.consumeArgs(r.numArgs),o=(n=n.slice()).length-1;o>=0;--o){var i=n[o];if("#"===i.text){if(0===o)throw new h("Incomplete placeholder at end of macro body",i);if("#"===(i=n[--o]).text)n.splice(o+1,1);else{if(!/^[1-9]$/.test(i.text))throw new h("Not a valid argument number",i);var s;(s=n).splice.apply(s,[o,2].concat(a[+i.text-1]))}}}return this.pushTokens(n),n},t.prototype.expandAfterFuture=function(){return this.expandOnce(),this.future()},t.prototype.expandNextToken=function(){for(;;){var t=this.expandOnce();if(t instanceof i){if("\\relax"!==t.text)return this.stack.pop();this.stack.pop()}}throw new Error},t.prototype.expandMacro=function(t){if(this.macros.get(t)){var e=[],r=this.stack.length;for(this.pushToken(new i(t));this.stack.length>r;){this.expandOnce()instanceof i&&e.push(this.stack.pop())}return e}},t.prototype.expandMacroAsText=function(t){var e=this.expandMacro(t);return e?e.map(function(t){return t.text}).join(""):e},t.prototype._getExpansion=function(t){var e=this.macros.get(t);if(null==e)return e;var r="function"==typeof e?e(this):e;if("string"==typeof r){var n=0;if(-1!==r.indexOf("#"))for(var a=r.replace(/##/g,"");-1!==a.indexOf("#"+(n+1));)++n;for(var o=new tn(r,this.settings),i=[],s=o.lex();"EOF"!==s.text;)i.push(s),s=o.lex();return i.reverse(),{tokens:i,numArgs:n}}return r},t.prototype.isDefined=function(t){return this.macros.has(t)||Pr.hasOwnProperty(t)||$.math.hasOwnProperty(t)||$.text.hasOwnProperty(t)||pn.hasOwnProperty(t)},t}(),dn={"\u0301":{text:"\\'",math:"\\acute"},"\u0300":{text:"\\`",math:"\\grave"},"\u0308":{text:'\\"',math:"\\ddot"},"\u0303":{text:"\\~",math:"\\tilde"},"\u0304":{text:"\\=",math:"\\bar"},"\u0306":{text:"\\u",math:"\\breve"},"\u030c":{text:"\\v",math:"\\check"},"\u0302":{text:"\\^",math:"\\hat"},"\u0307":{text:"\\.",math:"\\dot"},"\u030a":{text:"\\r",math:"\\mathring"},"\u030b":{text:"\\H"}},fn={"\xe1":"a\u0301","\xe0":"a\u0300","\xe4":"a\u0308","\u01df":"a\u0308\u0304","\xe3":"a\u0303","\u0101":"a\u0304","\u0103":"a\u0306","\u1eaf":"a\u0306\u0301","\u1eb1":"a\u0306\u0300","\u1eb5":"a\u0306\u0303","\u01ce":"a\u030c","\xe2":"a\u0302","\u1ea5":"a\u0302\u0301","\u1ea7":"a\u0302\u0300","\u1eab":"a\u0302\u0303","\u0227":"a\u0307","\u01e1":"a\u0307\u0304","\xe5":"a\u030a","\u01fb":"a\u030a\u0301","\u1e03":"b\u0307","\u0107":"c\u0301","\u010d":"c\u030c","\u0109":"c\u0302","\u010b":"c\u0307","\u010f":"d\u030c","\u1e0b":"d\u0307","\xe9":"e\u0301","\xe8":"e\u0300","\xeb":"e\u0308","\u1ebd":"e\u0303","\u0113":"e\u0304","\u1e17":"e\u0304\u0301","\u1e15":"e\u0304\u0300","\u0115":"e\u0306","\u011b":"e\u030c","\xea":"e\u0302","\u1ebf":"e\u0302\u0301","\u1ec1":"e\u0302\u0300","\u1ec5":"e\u0302\u0303","\u0117":"e\u0307","\u1e1f":"f\u0307","\u01f5":"g\u0301","\u1e21":"g\u0304","\u011f":"g\u0306","\u01e7":"g\u030c","\u011d":"g\u0302","\u0121":"g\u0307","\u1e27":"h\u0308","\u021f":"h\u030c","\u0125":"h\u0302","\u1e23":"h\u0307","\xed":"i\u0301","\xec":"i\u0300","\xef":"i\u0308","\u1e2f":"i\u0308\u0301","\u0129":"i\u0303","\u012b":"i\u0304","\u012d":"i\u0306","\u01d0":"i\u030c","\xee":"i\u0302","\u01f0":"j\u030c","\u0135":"j\u0302","\u1e31":"k\u0301","\u01e9":"k\u030c","\u013a":"l\u0301","\u013e":"l\u030c","\u1e3f":"m\u0301","\u1e41":"m\u0307","\u0144":"n\u0301","\u01f9":"n\u0300","\xf1":"n\u0303","\u0148":"n\u030c","\u1e45":"n\u0307","\xf3":"o\u0301","\xf2":"o\u0300","\xf6":"o\u0308","\u022b":"o\u0308\u0304","\xf5":"o\u0303","\u1e4d":"o\u0303\u0301","\u1e4f":"o\u0303\u0308","\u022d":"o\u0303\u0304","\u014d":"o\u0304","\u1e53":"o\u0304\u0301","\u1e51":"o\u0304\u0300","\u014f":"o\u0306","\u01d2":"o\u030c","\xf4":"o\u0302","\u1ed1":"o\u0302\u0301","\u1ed3":"o\u0302\u0300","\u1ed7":"o\u0302\u0303","\u022f":"o\u0307","\u0231":"o\u0307\u0304","\u0151":"o\u030b","\u1e55":"p\u0301","\u1e57":"p\u0307","\u0155":"r\u0301","\u0159":"r\u030c","\u1e59":"r\u0307","\u015b":"s\u0301","\u1e65":"s\u0301\u0307","\u0161":"s\u030c","\u1e67":"s\u030c\u0307","\u015d":"s\u0302","\u1e61":"s\u0307","\u1e97":"t\u0308","\u0165":"t\u030c","\u1e6b":"t\u0307","\xfa":"u\u0301","\xf9":"u\u0300","\xfc":"u\u0308","\u01d8":"u\u0308\u0301","\u01dc":"u\u0308\u0300","\u01d6":"u\u0308\u0304","\u01da":"u\u0308\u030c","\u0169":"u\u0303","\u1e79":"u\u0303\u0301","\u016b":"u\u0304","\u1e7b":"u\u0304\u0308","\u016d":"u\u0306","\u01d4":"u\u030c","\xfb":"u\u0302","\u016f":"u\u030a","\u0171":"u\u030b","\u1e7d":"v\u0303","\u1e83":"w\u0301","\u1e81":"w\u0300","\u1e85":"w\u0308","\u0175":"w\u0302","\u1e87":"w\u0307","\u1e98":"w\u030a","\u1e8d":"x\u0308","\u1e8b":"x\u0307","\xfd":"y\u0301","\u1ef3":"y\u0300","\xff":"y\u0308","\u1ef9":"y\u0303","\u0233":"y\u0304","\u0177":"y\u0302","\u1e8f":"y\u0307","\u1e99":"y\u030a","\u017a":"z\u0301","\u017e":"z\u030c","\u1e91":"z\u0302","\u017c":"z\u0307","\xc1":"A\u0301","\xc0":"A\u0300","\xc4":"A\u0308","\u01de":"A\u0308\u0304","\xc3":"A\u0303","\u0100":"A\u0304","\u0102":"A\u0306","\u1eae":"A\u0306\u0301","\u1eb0":"A\u0306\u0300","\u1eb4":"A\u0306\u0303","\u01cd":"A\u030c","\xc2":"A\u0302","\u1ea4":"A\u0302\u0301","\u1ea6":"A\u0302\u0300","\u1eaa":"A\u0302\u0303","\u0226":"A\u0307","\u01e0":"A\u0307\u0304","\xc5":"A\u030a","\u01fa":"A\u030a\u0301","\u1e02":"B\u0307","\u0106":"C\u0301","\u010c":"C\u030c","\u0108":"C\u0302","\u010a":"C\u0307","\u010e":"D\u030c","\u1e0a":"D\u0307","\xc9":"E\u0301","\xc8":"E\u0300","\xcb":"E\u0308","\u1ebc":"E\u0303","\u0112":"E\u0304","\u1e16":"E\u0304\u0301","\u1e14":"E\u0304\u0300","\u0114":"E\u0306","\u011a":"E\u030c","\xca":"E\u0302","\u1ebe":"E\u0302\u0301","\u1ec0":"E\u0302\u0300","\u1ec4":"E\u0302\u0303","\u0116":"E\u0307","\u1e1e":"F\u0307","\u01f4":"G\u0301","\u1e20":"G\u0304","\u011e":"G\u0306","\u01e6":"G\u030c","\u011c":"G\u0302","\u0120":"G\u0307","\u1e26":"H\u0308","\u021e":"H\u030c","\u0124":"H\u0302","\u1e22":"H\u0307","\xcd":"I\u0301","\xcc":"I\u0300","\xcf":"I\u0308","\u1e2e":"I\u0308\u0301","\u0128":"I\u0303","\u012a":"I\u0304","\u012c":"I\u0306","\u01cf":"I\u030c","\xce":"I\u0302","\u0130":"I\u0307","\u0134":"J\u0302","\u1e30":"K\u0301","\u01e8":"K\u030c","\u0139":"L\u0301","\u013d":"L\u030c","\u1e3e":"M\u0301","\u1e40":"M\u0307","\u0143":"N\u0301","\u01f8":"N\u0300","\xd1":"N\u0303","\u0147":"N\u030c","\u1e44":"N\u0307","\xd3":"O\u0301","\xd2":"O\u0300","\xd6":"O\u0308","\u022a":"O\u0308\u0304","\xd5":"O\u0303","\u1e4c":"O\u0303\u0301","\u1e4e":"O\u0303\u0308","\u022c":"O\u0303\u0304","\u014c":"O\u0304","\u1e52":"O\u0304\u0301","\u1e50":"O\u0304\u0300","\u014e":"O\u0306","\u01d1":"O\u030c","\xd4":"O\u0302","\u1ed0":"O\u0302\u0301","\u1ed2":"O\u0302\u0300","\u1ed6":"O\u0302\u0303","\u022e":"O\u0307","\u0230":"O\u0307\u0304","\u0150":"O\u030b","\u1e54":"P\u0301","\u1e56":"P\u0307","\u0154":"R\u0301","\u0158":"R\u030c","\u1e58":"R\u0307","\u015a":"S\u0301","\u1e64":"S\u0301\u0307","\u0160":"S\u030c","\u1e66":"S\u030c\u0307","\u015c":"S\u0302","\u1e60":"S\u0307","\u0164":"T\u030c","\u1e6a":"T\u0307","\xda":"U\u0301","\xd9":"U\u0300","\xdc":"U\u0308","\u01d7":"U\u0308\u0301","\u01db":"U\u0308\u0300","\u01d5":"U\u0308\u0304","\u01d9":"U\u0308\u030c","\u0168":"U\u0303","\u1e78":"U\u0303\u0301","\u016a":"U\u0304","\u1e7a":"U\u0304\u0308","\u016c":"U\u0306","\u01d3":"U\u030c","\xdb":"U\u0302","\u016e":"U\u030a","\u0170":"U\u030b","\u1e7c":"V\u0303","\u1e82":"W\u0301","\u1e80":"W\u0300","\u1e84":"W\u0308","\u0174":"W\u0302","\u1e86":"W\u0307","\u1e8c":"X\u0308","\u1e8a":"X\u0307","\xdd":"Y\u0301","\u1ef2":"Y\u0300","\u0178":"Y\u0308","\u1ef8":"Y\u0303","\u0232":"Y\u0304","\u0176":"Y\u0302","\u1e8e":"Y\u0307","\u0179":"Z\u0301","\u017d":"Z\u030c","\u1e90":"Z\u0302","\u017b":"Z\u0307","\u03ac":"\u03b1\u0301","\u1f70":"\u03b1\u0300","\u1fb1":"\u03b1\u0304","\u1fb0":"\u03b1\u0306","\u03ad":"\u03b5\u0301","\u1f72":"\u03b5\u0300","\u03ae":"\u03b7\u0301","\u1f74":"\u03b7\u0300","\u03af":"\u03b9\u0301","\u1f76":"\u03b9\u0300","\u03ca":"\u03b9\u0308","\u0390":"\u03b9\u0308\u0301","\u1fd2":"\u03b9\u0308\u0300","\u1fd1":"\u03b9\u0304","\u1fd0":"\u03b9\u0306","\u03cc":"\u03bf\u0301","\u1f78":"\u03bf\u0300","\u03cd":"\u03c5\u0301","\u1f7a":"\u03c5\u0300","\u03cb":"\u03c5\u0308","\u03b0":"\u03c5\u0308\u0301","\u1fe2":"\u03c5\u0308\u0300","\u1fe1":"\u03c5\u0304","\u1fe0":"\u03c5\u0306","\u03ce":"\u03c9\u0301","\u1f7c":"\u03c9\u0300","\u038e":"\u03a5\u0301","\u1fea":"\u03a5\u0300","\u03ab":"\u03a5\u0308","\u1fe9":"\u03a5\u0304","\u1fe8":"\u03a5\u0306","\u038f":"\u03a9\u0301","\u1ffa":"\u03a9\u0300"};function gn(t,e){return{type:"arg",result:t,token:e}}var xn=function(){function t(e,r){a()(this,t),this.mode="math",this.gullet=new un(e,r,this.mode),this.settings=r,this.leftrightDepth=0}return t.prototype.expect=function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(this.nextToken.text!==t)throw new h("Expected '"+t+"', got '"+this.nextToken.text+"'",this.nextToken);e&&this.consume()},t.prototype.consume=function(){this.nextToken=this.gullet.expandNextToken()},t.prototype.switchMode=function(t){this.mode=t,this.gullet.switchMode(t)},t.prototype.parse=function(){this.gullet.beginGroup(),this.settings.colorIsTextColor&&this.gullet.macros.set("\\color","\\textcolor"),this.consume();var t=this.parseExpression(!1);return this.expect("EOF",!1),this.gullet.endGroup(),t},t.prototype.parseExpression=function(e,r){for(var n=[];;){"math"===this.mode&&this.consumeSpaces();var a=this.nextToken;if(-1!==t.endOfExpression.indexOf(a.text))break;if(r&&a.text===r)break;if(e&&Pr[a.text]&&Pr[a.text].infix)break;var o=this.parseAtom(r);if(!o){if(!this.settings.throwOnError&&"\\"===a.text[0]){var i=this.handleUnsupportedCmd();n.push(i);continue}break}n.push(o)}return"text"===this.mode&&this.formLigatures(n),this.handleInfixNodes(n)},t.prototype.handleInfixNodes=function(t){for(var e=-1,r=void 0,n=0;n<t.length;n++){var a=Ut(t[n],"infix");if(a){if(-1!==e)throw new h("only one infix operator per group",a.token);e=n,r=a.replaceWith}}if(-1!==e&&r){var o=void 0,i=void 0,s=t.slice(0,e),l=t.slice(e+1);o=1===s.length&&"ordgroup"===s[0].type?s[0]:{type:"ordgroup",mode:this.mode,body:s},i=1===l.length&&"ordgroup"===l[0].type?l[0]:{type:"ordgroup",mode:this.mode,body:l};return["\\\\abovefrac"===r?this.callFunction(r,[o,t[e],i],[]):this.callFunction(r,[o,i],[])]}return t},t.prototype.handleSupSubscript=function(e){var r=this.nextToken,n=r.text;this.consume(),this.consumeSpaces();var a=this.parseGroup();if(!a){if(this.settings.throwOnError||"\\"!==this.nextToken.text[0])throw new h("Expected group after '"+n+"'",r);return this.handleUnsupportedCmd()}if("fn"===a.type){if(Pr[a.result].greediness>t.SUPSUB_GREEDINESS)return this.parseGivenFunction(a);throw new h("Got function '"+a.result+"' with no arguments as "+e,r)}return a.result},t.prototype.handleUnsupportedCmd=function(){for(var t=this.nextToken.text,e=[],r=0;r<t.length;r++)e.push({type:"textord",mode:"text",text:t[r]});var n={type:"text",mode:this.mode,body:e},a={type:"color",mode:this.mode,color:this.settings.errorColor,body:[n]};return this.consume(),a},t.prototype.parseAtom=function(t){var e=this.parseImplicitGroup(t);if("text"===this.mode)return e;for(var r=void 0,n=void 0;;){this.consumeSpaces();var a=this.nextToken;if("\\limits"===a.text||"\\nolimits"===a.text){var o=Ut(e,"op");if(!o)throw new h("Limit controls must follow a math operator",a);var i="\\limits"===a.text;o.limits=i,o.alwaysHandleSupSub=!0,this.consume()}else if("^"===a.text){if(r)throw new h("Double superscript",a);r=this.handleSupSubscript("superscript")}else if("_"===a.text){if(n)throw new h("Double subscript",a);n=this.handleSupSubscript("subscript")}else{if("'"!==a.text)break;if(r)throw new h("Double superscript",a);var s={type:"textord",mode:this.mode,text:"\\prime"},l=[s];for(this.consume();"'"===this.nextToken.text;)l.push(s),this.consume();"^"===this.nextToken.text&&l.push(this.handleSupSubscript("superscript")),r={type:"ordgroup",mode:this.mode,body:l}}}return r||n?{type:"supsub",mode:this.mode,base:e,sup:r,sub:n}:e},t.prototype.parseImplicitGroup=function(t){var e=this.parseSymbol();if(null==e)return this.parseFunction();if("arg"===e.type)return this.parseGivenFunction(e);if("\\begin"===e.result){var r=Gt(this.parseGivenFunction(e),"environment"),n=r.name;if(!jr.hasOwnProperty(n))throw new h("No such environment: "+n,r.nameGroup);var a=jr[n],o=this.parseArguments("\\begin{"+n+"}",a),i=o.args,s=o.optArgs,l={mode:this.mode,envName:n,parser:this},m=a.handler(l,i,s);this.expect("\\end",!1);var c=this.nextToken,p=this.parseFunction();if(!p)throw new h("failed to parse function after \\end");if((p=Gt(p,"environment")).name!==n)throw new h("Mismatch: \\begin{"+n+"} matched by \\end{"+p.name+"}",c);return m}return this.parseGivenFunction(e,t)},t.prototype.parseFunction=function(){var t=this.parseGroup();return t?this.parseGivenFunction(t):null},t.prototype.parseGivenFunction=function(t,e){if("fn"===t.type){var r=t.result,n=Pr[r];if("text"===this.mode&&!n.allowedInText)throw new h("Can't use function '"+r+"' in text mode",t.token);if("math"===this.mode&&!1===n.allowedInMath)throw new h("Can't use function '"+r+"' in math mode",t.token);if(n.consumeMode){var a=this.mode;this.switchMode(n.consumeMode),this.consume(),this.switchMode(a)}else this.consume();var o=this.parseArguments(r,n),i=o.args,s=o.optArgs,l=t.token;return this.callFunction(r,i,s,l,e)}return t.result},t.prototype.callFunction=function(t,e,r,n,a){var o={funcName:t,parser:this,token:n,breakOnTokenText:a},i=Pr[t];if(i&&i.handler)return i.handler(o,e,r);throw new h("No function handler for "+t)},t.prototype.parseArguments=function(t,e){var r=e.numArgs+e.numOptionalArgs;if(0===r)return{args:[],optArgs:[]};for(var n=e.greediness,a=[],o=[],i=0;i<r;i++){var s=e.argTypes&&e.argTypes[i],l=i<e.numOptionalArgs;i>0&&!l&&this.consumeSpaces(),0!==i||l||"math"!==this.mode||this.consumeSpaces();var m=this.nextToken,c=s?this.parseGroupOfType(s,l):this.parseGroup(l);if(!c){if(l){o.push(null);continue}if(this.settings.throwOnError||"\\"!==this.nextToken.text[0])throw new h("Expected group after '"+t+"'",m);c=gn(this.handleUnsupportedCmd(),m)}var p=void 0;if("fn"===c.type){if(!(Pr[c.result].greediness>n))throw new h("Got function '"+c.result+"' as argument to '"+t+"'",m);p=this.parseGivenFunction(c)}else p=c.result;(l?o:a).push(p)}return{args:a,optArgs:o}},t.prototype.parseGroupOfType=function(t,e){if("original"===t&&(t=this.mode),"color"===t)return this.parseColorGroup(e);if("size"===t)return this.parseSizeGroup(e);if("url"===t)throw new h("Internal bug: 'url' arguments should be handled by Lexer",this.nextToken);return this.parseGroup(e,t)},t.prototype.consumeSpaces=function(){for(;" "===this.nextToken.text;)this.consume()},t.prototype.parseStringGroup=function(t,e){if(e&&"["!==this.nextToken.text)return null;var r=this.mode;this.mode="text",this.expect(e?"[":"{");for(var n="",a=this.nextToken,o=a;this.nextToken.text!==(e?"]":"}");){if("EOF"===this.nextToken.text)throw new h("Unexpected end of input in "+t,a.range(this.nextToken,n));n+=(o=this.nextToken).text,this.consume()}return this.mode=r,this.expect(e?"]":"}"),a.range(o,n)},t.prototype.parseRegexGroup=function(t,e){var r=this.mode;this.mode="text";for(var n=this.nextToken,a=n,o="";"EOF"!==this.nextToken.text&&t.test(o+this.nextToken.text);)o+=(a=this.nextToken).text,this.consume();if(""===o)throw new h("Invalid "+e+": '"+n.text+"'",n);return this.mode=r,n.range(a,o)},t.prototype.parseColorGroup=function(t){var e=this.parseStringGroup("color",t);if(!e)return null;var r=/^(#[a-f0-9]{3}|#[a-f0-9]{6}|[a-z]+)$/i.exec(e.text);if(!r)throw new h("Invalid color: '"+e.text+"'",e);return gn({type:"color-token",mode:this.mode,color:r[0]},e)},t.prototype.parseSizeGroup=function(t){var e=void 0,r=!1;if(!(e=t||"{"===this.nextToken.text?this.parseStringGroup("size",t):this.parseRegexGroup(/^[-+]? *(?:$|\d+|\d+\.\d*|\.\d*) *[a-z]{0,2} *$/,"size")))return null;t||0!==e.text.length||(e.text="0pt",r=!0);var n=/([-+]?) *(\d+(?:\.\d*)?|\.\d+) *([a-z]{2})/.exec(e.text);if(!n)throw new h("Invalid size: '"+e.text+"'",e);var a={number:+(n[1]+n[2]),unit:n[3]};if(!function(t){return"string"!=typeof t&&(t=t.unit),t in Tt||t in At||"ex"===t}(a))throw new h("Invalid unit: '"+a.unit+"'",e);return gn({type:"size",mode:this.mode,value:a,isBlank:r},e)},t.prototype.parseGroup=function(t,e){var r=this.mode,n=this.nextToken;if(this.nextToken.text===(t?"[":"{")){e&&this.switchMode(e),this.gullet.beginGroup(),this.consume();var a=this.parseExpression(!1,t?"]":"}"),i=this.nextToken;return e&&this.switchMode(r),this.gullet.endGroup(),this.expect(t?"]":"}"),gn({type:"ordgroup",mode:this.mode,loc:o.range(n,i),body:a},n.range(i,n.text))}e&&this.switchMode(e);var s=t?null:this.parseSymbol();return e&&this.switchMode(r),s},t.prototype.formLigatures=function(t){for(var e=t.length-1,r=0;r<e;++r){var n=t[r],a=n.text;"-"===a&&"-"===t[r+1].text&&(r+1<e&&"-"===t[r+2].text?(t.splice(r,3,{type:"textord",mode:"text",loc:o.range(n,t[r+2]),text:"---"}),e-=2):(t.splice(r,2,{type:"textord",mode:"text",loc:o.range(n,t[r+1]),text:"--"}),e-=1)),"'"!==a&&"`"!==a||t[r+1].text!==a||(t.splice(r,2,{type:"textord",mode:"text",loc:o.range(n,t[r+1]),text:a+a}),e-=1)}},t.prototype.parseSymbol=function(){var t=this.nextToken,e=t.text;if(Pr[e])return function(t){return{type:"fn",result:t.text,token:t}}(t);if(/^\\(href|url)[^a-zA-Z]/.test(e)){var r=e.match(Qr);if(!r)throw new h("Internal error: invalid URL token '"+e+"'",t);var n=r[1],a=(r[4]||r[3]||r[2]).replace(/\\([#$%&~_^{}])/g,"$1"),i=/^\s*([^\\/#]*?)(?::|&#0*58|&#x0*3a)/i.exec(a);i=null!=i?i[1]:"_relative";var s=this.settings.allowedProtocols;if(!d.contains(s,"*")&&!d.contains(s,i))throw new h("Forbidden protocol '"+i+"' in "+n,t);var l={type:"url",mode:this.mode,url:a};if(this.consume(),"\\href"===n){this.consumeSpaces();var m=this.parseGroupOfType("original",!1);if(null==m)throw new h(n+" missing second argument",t);return m="fn"===m.type?this.parseGivenFunction(m):m.result,gn(this.callFunction(n,[l,m],[]),t)}return gn(this.callFunction(n,[l],[]),t)}if(/^\\verb[^a-zA-Z]/.test(e)){this.consume();var c=e.slice(5),p="*"===c.charAt(0);if(p&&(c=c.slice(1)),c.length<2||c.charAt(0)!==c.slice(-1))throw new h("\\verb assertion failed --\n                    please report what input caused this bug");return gn({type:"verb",mode:"text",body:c=c.slice(1,-1),star:p},t)}fn.hasOwnProperty(e[0])&&!$[this.mode][e[0]]&&(this.settings.strict&&"math"===this.mode&&this.settings.reportNonstrict("unicodeTextInMathMode",'Accented Unicode text character "'+e[0]+'" used in math mode',t),e=fn[e[0]]+e.substr(1));var u=Zr.exec(e);u&&("i"===(e=e.substring(0,u.index))?e="\u0131":"j"===e&&(e="\u0237"));var f=void 0;if($[this.mode][e]){this.settings.strict&&"math"===this.mode&&"\xc7\xd0\xde\xe7\xfe".indexOf(e)>=0&&this.settings.reportNonstrict("unicodeTextInMathMode",'Latin-1/Unicode text character "'+e[0]+'" used in math mode',t);var g=$[this.mode][e].group,x=o.range(t),v=void 0;if(_.hasOwnProperty(g)){var y=g;v={type:"atom",mode:this.mode,family:y,loc:x,text:e}}else v={type:g,mode:this.mode,loc:x,text:e};f=v}else{if(!(e.charCodeAt(0)>=128))return null;this.settings.strict&&(A(e.charCodeAt(0))?"math"===this.mode&&this.settings.reportNonstrict("unicodeTextInMathMode",'Unicode text character "'+e[0]+'" used in math mode',t):this.settings.reportNonstrict("unknownSymbol",'Unrecognized Unicode character "'+e[0]+'" ('+e.charCodeAt(0)+")",t)),f={type:"textord",mode:this.mode,loc:o.range(t),text:e}}if(this.consume(),u)for(var b=0;b<u[0].length;b++){var w=u[0][b];if(!dn[w])throw new h("Unknown accent ' "+w+"'",t);var k=dn[w][this.mode];if(!k)throw new h("Accent "+w+" unsupported in "+this.mode+" mode",t);f={type:"accent",mode:this.mode,loc:o.range(t),label:k,isStretchy:!1,isShifty:!0,base:f}}return gn(f,t)},t}();xn.endOfExpression=["}","\\end","\\right","&"],xn.SUPSUB_GREEDINESS=1;var vn=xn,yn=function(t,e){if(!("string"==typeof t||t instanceof String))throw new TypeError("KaTeX can only parse string typed expression");var r=new vn(t,e);delete r.gullet.macros.current["\\df@tag"];var n=r.parse();if(r.gullet.macros.get("\\df@tag")){if(!e.displayMode)throw new h("\\tag works only in display equations");r.gullet.feed("\\df@tag"),n=[{type:"tag",mode:"text",body:n,tag:r.parse()}]}return n},bn=function(t,e,r){e.textContent="";var n=kn(t,r).toNode();e.appendChild(n)};"undefined"!=typeof document&&"CSS1Compat"!==document.compatMode&&("undefined"!=typeof console&&console.warn("Warning: KaTeX doesn't work in quirks mode. Make sure your website has a suitable doctype."),bn=function(){throw new h("KaTeX doesn't work in quirks mode.")});var wn=function(t,e,r){if(r.throwOnError||!(t instanceof h))throw t;var n=Vt.makeSpan(["katex-error"],[new H(e)]);return n.setAttribute("title",t.toString()),n.setAttribute("style","color:"+r.errorColor),n},kn=function(t,e){var r=new f(e);try{var n=yn(t,r);return Be(n,t,r)}catch(e){return wn(e,t,r)}},Sn={version:"0.10.0-rc.1",render:bn,renderToString:function(t,e){return kn(t,e).toMarkup()},ParseError:h,__parse:function(t,e){var r=new f(e);return yn(t,r)},__renderToDomTree:kn,__renderToHTMLTree:function(t,e){var r=new f(e);try{return function(t,e,r){var n=fe(t,Ae(r)),a=Vt.makeSpan(["katex"],[n]);return r.displayMode?Vt.makeSpan(["katex-display"],[a]):a}(yn(t,r),0,r)}catch(e){return wn(e,t,r)}},__setFontMetrics:function(t,e){V[t]=e},__defineSymbol:Z,__defineMacro:an,__domTree:{Span:I,Anchor:R,SymbolNode:H,SvgNode:D,PathNode:P,LineNode:F}};e.default=Sn}]).default});

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

}


function base64_decode (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_decode
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'

    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['btoa'] == 'function') {
    //    return btoa(data);
    //}

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do {  // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1<<18 | h2<<12 | h3<<6 | h4;

        o1 = bits>>16 & 0xff;
        o2 = bits>>8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');
    dec = this.utf8_decode(dec);

    return dec;
}

function base64_encode( data ) {	// Encodes data with MIME base64
	//
	// +   original by: Tyler Akins (http://rumkin.com)
	// +   improved by: Bayron Guevara

	var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';

	do { // pack three octets into four hexets
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1<<16 | o2<<8 | o3;

		h1 = bits>>18 & 0x3f;
		h2 = bits>>12 & 0x3f;
		h3 = bits>>6 & 0x3f;
		h4 = bits & 0x3f;

		// use hexets to index into b64, and append result to encoded string
		enc += b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	switch( data.length % 3 ){
		case 1:
			enc = enc.slice(0, -2) + '==';
		break;
		case 2:
			enc = enc.slice(0, -1) + '=';
		break;
	}

	return enc;
}

function htmlspecialchars (string, quote_style, charset, double_encode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +      input by: Mailfaker (http://www.weedem.fr/)
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +      input by: felix
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: charset argument not supported
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
    // *     returns 2: 'ab"c&#039;d'
    // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
    // *     returns 3: 'my &quot;&entity;&quot; is still here'

    var optTemp = 0, i = 0, noquotes= false;
    if (typeof quote_style === 'undefined' || quote_style === null) {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false) { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE' : 1,
        'ENT_HTML_QUOTE_DOUBLE' : 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE' : 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i=0; i < quote_style.length; i++) {
            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            }
            else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}

function strip_tags (str, allowed_tags) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Luke Godfrey
    // +      input by: Pul
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +      input by: Alex
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Marc Palau
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Eric Nagel
    // +      input by: Bobby Drake
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Tomasz Wesolowski
    // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
    // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
    // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
    // *     returns 2: '<p>Kevin van Zonneveld</p>'
    // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
    // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
    // *     example 4: strip_tags('1 < 5 5 > 1');
    // *     returns 4: '1 < 5 5 > 1'

    var key = '', allowed = false;
    var matches = [];
    var allowed_array = [];
    var allowed_tag = '';
    var i = 0;
    var k = '';
    var html = '';

    var replacer = function (search, replace, str) {
        return str.split(search).join(replace);
    };

    // Build allowes tags associative array
    if (allowed_tags) {
        allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
    }

    str += '';

    // Match tags
    matches = str.match(/(<\/?[\S][^>]*>)/gi);

    // Go through all HTML tags
    for (key in matches) {
        if (isNaN(key)) {
            // IE7 Hack
            continue;
        }

        // Save HTML tag
        html = matches[key].toString();

        // Is tag not in allowed list? Remove from str!
        allowed = false;

        // Go through all allowed tags
        for (k in allowed_array) {
            // Init
            allowed_tag = allowed_array[k];
            i = -1;

            if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+'>');}
            if (i != 0) { i = html.toLowerCase().indexOf('<'+allowed_tag+' ');}
            if (i != 0) { i = html.toLowerCase().indexOf('</'+allowed_tag)   ;}

            // Determine
            if (i == 0) {
                allowed = true;
                break;
            }
        }

        if (!allowed) {
            str = replacer(html, "", str); // Custom replace. No regexing
        }
    }

    return str;
}


function nl2br (str, is_xhtml) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Philip Peterson
    // +   improved by: Onno Marsman
    // +   improved by: Atli У�УГr
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Maximusya
    // *     example 1: nl2br('Kevin\nvan\nZonneveld');
    // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
    // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
    // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
    // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
    // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'

    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';

    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

$(document).ready(function(){;
			var seoContent = {"terms":"PGEgaHJlZj0iL3BhZ2UvdGVybXMtb2YtdXNlIj7Qo9C80L7QstC4INC60L7RgNC40YHRgtGD0LLQsNC90L3RjzwvYT4=",
							"privacy":"PGEgaHJlZj0iL3BhZ2UvcHJpdmFjeS1wb2xpY3kiPtCf0L7Qu9GW0YLQuNC60LAg0LrQvtC90YTRltC00LXQvdGG0ZbQudC90L7RgdGC0ZY8L2E+",
							"contact":"PGEgaHJlZj0iL3BhZ2UvY29udGFjdC11cyI+0JfQstC+0YDQvtGC0L3QuNC5INC30LIn0Y/Qt9C+0Lo8L2E+",
							"about":"PGEgaHJlZj0iL3BhZ2UvYWJvdXQiPtCf0YDQviDQv9GA0L7QtdC60YI8L2E+"};


			$('[hashstring]').each(function(){
				var key = $(this).attr("hashstring");

				if($(this).attr("hashtype") == 'href'){
					$(this).attr('href', Base64.decode(seoHrefs[key]));
				}else{
					var content = Base64.decode(seoContent[key]);
					$(this).replaceWith(content);
				}

			});
			$(document).trigger( "renderpage.finish");
		});

jQuery(document).ready(function($){
	//set animation timing
	var animationDelay = 1500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect
		revealDuration = 600,
		revealAnimationDelay = 1500;

	initHeadline();


	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);

			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);

		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');
			setTimeout(function(){
				parentSpan.removeClass('selected');
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');

		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else if($bool) {
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		}
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');

		if(!$letter.is(':last-child')) {
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
		} else {
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}
});

$(document).ready(function(){;
			var seoContent = {"terms":"PGEgaHJlZj0iL3BhZ2UvdGVybXMtb2YtdXNlIj7Qo9C80L7QstC4INC60L7RgNC40YHRgtGD0LLQsNC90L3RjzwvYT4=",
							"privacy":"PGEgaHJlZj0iL3BhZ2UvcHJpdmFjeS1wb2xpY3kiPtCf0L7Qu9GW0YLQuNC60LAg0LrQvtC90YTRltC00LXQvdGG0ZbQudC90L7RgdGC0ZY8L2E+",
							"contact":"PGEgaHJlZj0iL3BhZ2UvY29udGFjdC11cyI+0JfQstC+0YDQvtGC0L3QuNC5INC30LIn0Y/Qt9C+0Lo8L2E+",
							"about":"PGEgaHJlZj0iL3BhZ2UvYWJvdXQiPtCf0YDQviDQv9GA0L7QtdC60YI8L2E+"};


			$('[hashstring]').each(function(){
				var key = $(this).attr("hashstring");

				if($(this).attr("hashtype") == 'href'){
					$(this).attr('href', Base64.decode(seoHrefs[key]));
				}else{
					var content = Base64.decode(seoContent[key]);
					$(this).replaceWith(content);
				}

			});
			$(document).trigger( "renderpage.finish");
		});

(function($) {

  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */

  $.fn.visible = function(partial) {

      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };

})(jQuery);

var win = $(window);

var allMods = $(".module");

allMods.each(function(i, el) {
  var el = $(el);
  if (el.visible(true)) {
    el.addClass("already-visible");
  }
});

win.scroll(function(event) {

  allMods.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass("come-in");
    }
  });

});

function createResponse(point, campaign_id){
    var _csrf = $('meta[name="csrf-token"]').attr('content');
    $.ajax({
          type: "POST",
          url: '/api/nps',
          data: {point:point,'_csrf':_csrf, campaign_id:campaign_id},
          success: function(response){
              console.log(response);
              $('.nps-response-id').val(response.id);
              $('.nps-step1').addClass('hide');
              $('.nps-step2').removeClass('hide');
              $('.nps-close1').addClass('hide');
              $('.nps-close2').removeClass('hide');
          }
    });
}

function updateResponse(campaign_id){
    var _csrf = $('meta[name="csrf-token"]').attr('content');
    var id = $('.nps-response-id').val();
    var comment = $('.nps-response-comment').val();
    $.ajax({
          type: "PUT",
          url: '/api/nps/'+id,
          data: {comment:comment},
          success: function(response){
              console.log(response);
              $('.nps-step2').addClass('hide');
              $('.nps-step3').removeClass('hide');
              setTimeout(function(){
                  $('.nps-form').addClass('animated slideOutDown');
                  $('.nps-wrapper').addClass('hide');
              },1500)
             // $('.nps-response-id').val(response.id);
          }
    });
}

function closeNps(campaign_id){
     $('.nps-form').addClass('animated slideOutDown');
     $('.nps-wrapper').addClass('hide');
        var _csrf = $('meta[name="csrf-token"]').attr('content');
        $.ajax({
              type: "POST",
              url: '/api/nps',
              data: {closed:1,'_csrf':_csrf, campaign_id:campaign_id},
              success: function(response){}
        });
}

function closeModalNps(){
     $('.nps-form').addClass('animated slideOutDown');
     $('.nps-wrapper').addClass('hide');
}

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
(function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)})(function(i){"use strict";var e=window.Slick||{};e=function(){function e(e,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(e),appendDots:i(e),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(e),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(e).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,"undefined"!=typeof document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=t++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}var t=0;return e}(),e.prototype.activateADA=function(){var i=this;i.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):o===!0?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),s.options.rtl===!0&&s.options.vertical===!1&&(e=-e),s.transformsEnabled===!1?s.options.vertical===!1?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):s.cssTransitions===!1?(s.options.rtl===!0&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),s.options.vertical===!1?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),s.options.vertical===!1?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this,o=t.getNavTarget();null!==o&&"object"==typeof o&&o.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};e.options.fade===!1?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(i.options.infinite===!1&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1===0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;e.options.arrows===!0&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),e.options.infinite!==!0&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(o.options.dots===!0&&o.slideCount>o.options.slidesToShow){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),e.options.centerMode!==!0&&e.options.swipeToSlide!==!0||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.options.draggable===!0&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>0){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(r.originalSettings.mobileFirst===!1?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||l===!1||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!==0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t,o=this;if(e=o.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var s in e){if(i<e[s]){i=t;break}t=e[s]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),e.options.accessibility===!0&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),e.options.accessibility===!0&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),e.options.accessibility===!0&&e.$list.off("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>0&&(i=e.$slides.children().children(),i.removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){var e=this;e.shouldClick===!1&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;t.cssTransitions===!1?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;e.cssTransitions===!1?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(t){var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&o.is(":focus")&&(e.focussed=!0,e.autoPlay())},0)}).on("blur.slick","*",function(t){i(this);e.options.pauseOnFocus&&(e.focussed=!1,e.autoPlay())})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){var i=this;return i.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(i.options.infinite===!0)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(i.options.centerMode===!0)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),n.options.infinite===!0?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,n.options.vertical===!0&&n.options.centerMode===!0&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!==0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),n.options.centerMode===!0&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:n.options.centerMode===!0&&n.options.infinite===!0?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:n.options.centerMode===!0&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=n.options.vertical===!1?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,n.options.variableWidth===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,n.options.centerMode===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){var e=this;return e.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(e.options.infinite===!1?i=e.slideCount:(t=e.options.slidesToScroll*-1,o=e.options.slidesToScroll*-1,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o,s,n=this;return s=n.options.centerMode===!0?Math.floor(n.$list.width()/2):0,o=n.swipeLeft*-1+s,n.options.swipeToSlide===!0?(n.$slideTrack.find(".slick-slide").each(function(e,s){var r,l,d;if(r=i(s).outerWidth(),l=s.offsetLeft,n.options.centerMode!==!0&&(l+=r/2),d=l+r,o<d)return t=s,!1}),e=Math.abs(i(t).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){var t=this;t.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),t.options.accessibility===!0&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);if(i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),s!==-1){var n="slick-slide-control"+e.instanceUid+s;i("#"+n).length&&i(this).attr({"aria-describedby":n})}}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.options.focusOnChange?e.$slides.eq(s).attr({tabindex:"0"}):e.$slides.eq(s).removeAttr("tabindex");e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),i.options.accessibility===!0&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;e.options.dots===!0&&e.slideCount>e.options.slidesToShow&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),e.options.accessibility===!0&&e.$dots.on("keydown.slick",e.keyHandler)),e.options.dots===!0&&e.options.pauseOnDotsHover===!0&&e.slideCount>e.options.slidesToShow&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),e.options.accessibility===!0&&e.$list.on("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&e.options.accessibility===!0?e.changeSlide({data:{message:e.options.rtl===!0?"next":"previous"}}):39===i.keyCode&&e.options.accessibility===!0&&e.changeSlide({data:{message:e.options.rtl===!0?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||r.$slider.attr("data-sizes"),n=document.createElement("img");n.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),r.$slider.trigger("lazyLoaded",[r,e,t])})},n.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),r.$slider.trigger("lazyLoadError",[r,e,t])},n.src=t})}var t,o,s,n,r=this;if(r.options.centerMode===!0?r.options.infinite===!0?(s=r.currentSlide+(r.options.slidesToShow/2+1),n=s+r.options.slidesToShow+2):(s=Math.max(0,r.currentSlide-(r.options.slidesToShow/2+1)),n=2+(r.options.slidesToShow/2+1)+r.currentSlide):(s=r.options.infinite?r.options.slidesToShow+r.currentSlide:r.currentSlide,n=Math.ceil(s+r.options.slidesToShow),r.options.fade===!0&&(s>0&&s--,n<=r.slideCount&&n++)),t=r.$slider.find(".slick-slide").slice(s,n),"anticipated"===r.options.lazyLoad)for(var l=s-1,d=n,a=r.$slider.find(".slick-slide"),c=0;c<r.options.slidesToScroll;c++)l<0&&(l=r.slideCount-1),t=t.add(a.eq(l)),t=t.add(a.eq(d)),l--,d++;e(t),r.slideCount<=r.options.slidesToShow?(o=r.$slider.find(".slick-slide"),e(o)):r.currentSlide>=r.slideCount-r.options.slidesToShow?(o=r.$slider.find(".slick-cloned").slice(0,r.options.slidesToShow),e(o)):0===r.currentSlide&&(o=r.$slider.find(".slick-cloned").slice(r.options.slidesToShow*-1),e(o))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){var i=this;i.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;if(!t.unslicked&&(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),t.options.accessibility===!0&&(t.initADA(),t.options.focusOnChange))){var o=i(t.$slides.get(t.currentSlide));o.attr("tabindex",0).focus()}},e.prototype.prev=e.prototype.slickPrev=function(){var i=this;i.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),r=document.createElement("img"),r.onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),l.options.adaptiveHeight===!0&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;return"boolean"==typeof i?(e=i,i=e===!0?0:o.slideCount-1):i=e===!0?--i:i,!(o.slideCount<1||i<0||i>o.slideCount-1)&&(o.unload(),t===!0?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,void o.reinit())},e.prototype.setCSS=function(i){var e,t,o=this,s={};o.options.rtl===!0&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,o.transformsEnabled===!1?o.$slideTrack.css(s):(s={},o.cssTransitions===!1?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;i.options.vertical===!1?i.options.centerMode===!0&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),i.options.centerMode===!0&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),i.options.vertical===!1&&i.options.variableWidth===!1?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):i.options.variableWidth===!0?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();i.options.variableWidth===!1&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,t.options.rtl===!0?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":"undefined"!=typeof arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),i.options.fade===!1?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=i.options.vertical===!0?"top":"left",
"top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||i.options.useCSS===!0&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&i.animType!==!1&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&i.animType!==!1},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),n.options.centerMode===!0){var r=n.options.slidesToShow%2===0?1:0;e=Math.floor(n.options.slidesToShow/2),n.options.infinite===!0&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=n.options.infinite===!0?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(s.options.fade===!0&&(s.options.centerMode=!1),s.options.infinite===!0&&s.options.fade===!1&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=s.options.centerMode===!0?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));return s||(s=0),t.slideCount<=t.options.slidesToShow?void t.slideHandler(s,!1,!0):void t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(a.animating===!0&&a.options.waitForAnimate===!0||a.options.fade===!0&&a.currentSlide===i))return e===!1&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,a.options.infinite===!1&&a.options.centerMode===!1&&(i<0||i>a.getDotCount()*a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):a.options.infinite===!1&&a.options.centerMode===!0&&(i<0||i>a.slideCount-a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!==0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!==0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=a.getNavTarget(),l=l.slick("getSlick"),l.slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide)),a.updateDots(),a.updateArrows(),a.options.fade===!0?(t!==!0?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight()):void(t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)))},e.prototype.startLoad=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),o=Math.round(180*t/Math.PI),o<0&&(o=360-Math.abs(o)),o<=45&&o>=0?s.options.rtl===!1?"left":"right":o<=360&&o>=315?s.options.rtl===!1?"left":"right":o>=135&&o<=225?s.options.rtl===!1?"right":"left":s.options.verticalSwiping===!0?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(o.touchObject.edgeHit===!0&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(e.options.swipe===!1||"ontouchend"in document&&e.options.swipe===!1||e.options.draggable===!1&&i.type.indexOf("mouse")!==-1))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,e.options.verticalSwiping===!0&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(l.options.verticalSwiping===!0&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(l.options.rtl===!1?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),l.options.verticalSwiping===!0&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,l.options.infinite===!1&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),l.options.vertical===!1?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,l.options.verticalSwiping===!0&&(l.swipeLeft=e+o*s),l.options.fade!==!0&&l.options.touchMove!==!1&&(l.animating===!0?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;return t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow?(t.touchObject={},!1):(void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,void(t.dragging=!0))},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i,e=this;i=Math.floor(e.options.slidesToShow/2),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&!e.options.infinite&&(e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===e.currentSlide?(e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-e.options.slidesToShow&&e.options.centerMode===!1?(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-1&&e.options.centerMode===!0&&(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||"undefined"==typeof s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),"undefined"!=typeof t)return t;return o}});

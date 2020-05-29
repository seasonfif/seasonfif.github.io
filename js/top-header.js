//# sourceURL=top-header.js 
(function($) {
    $(document).ready(function() {
        // 隐藏禁用javascript（针对微信内置浏览器）的提示
        // $('.noscript').hide();

        // // 图片缩放效果
        // var $imgs = $('img').not('.slider-image').not('.avatar-image').not('.carousel-image').not('.card-cover-image').not('.qrcode');

        // // 给图片加上点击放大效果（materialbox插件）
        // // $imgs.addClass('materialboxed').each(function(i, el) {
        // //     $(this).attr('data-caption', $(this).attr('alt') || ' ');
        // // }).materialbox();

        // // 优化表格的显示
        // $('table').each(function() {
        //     var $table = $(this);
        //     // 除去多行代码的情况
        //     if ($table.find('pre').length == 0) {
        //         $table.addClass('responsive-table striped bordered');
        //     }
        // });

        // // 首页幻灯片
        // // $('.slider').slider({indicators: true, full_width: true, interval: 8000});

        // $(".button-collapse").sideNav();
        // $(".category-menu").sideNav();

        // // 针对gallery post
        // $('.carousel').carousel({full_width: true});
        // $('.carousel-control.prev').click(function() {
        //     $('.carousel').carousel('prev');
        // });
        // $('.carousel-control.next').click(function() {
        //     $('.carousel').carousel('next');
        // });

        // // 文章目录
        // $('article').not('.simple-article').find('h1').add('h2').add('h3').add('h4').add('h5').add('h6').scrollSpy();

        // // 修正文章目录的left-border颜色
        // var color = $('.table-of-contents-text').css('color');
        // $('.table-of-contents-link').css('border-left-color', color);

        // // 针对移动端做的优化：FAB按钮点击一下收回
        // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        //     $('.fixed-action-btn').addClass('click-to-toggle');
        // }
        // // 回到顶部
        // $('.btn-return-top').click(function() {
        //     $('body, html').animate({
        //         scrollTop: 0
        //     }, 500);
        // });

        // // 重置读书页面的Tab标签页的颜色
        // $('li.tab a').hover(function() {
        //     $(this).toggleClass('text-lighten-4');
        // });
        // $('.indicator').addClass('<%= theme.color.tab %> lighten-2');

        // // <% if (site.data.hint) { %>
        // // // 添加new标签
        // // $('<%= site.data.hint.new.selector.join(', ') %>').append('<span class="new badge <%= theme.color.new %>"></span>');
        // // <% } %>

        // 搜索功能
        $('.modal-trigger').leanModal({
            // 打开搜索框时自动聚焦
            ready: function() {
                if ($('#search').is(":visible")) {
                    $('#search-input').focus();
                }
            }
        });
    });

    // 初始化搜索与匹配函数
    var initSearch = function(path, search_id, content_id) {
        $.ajax({
            url: path,
            dataType: "xml",
            success: function(xmlResponse) {
                // get the contents from search data
                var datas = $("entry", xmlResponse).map(function() {
                    return {
                        title: $("title", this).text(),
                        content: $("content", this).text(),
                        url: $("url", this).text()
                    };
                }).get();
                var $input = document.getElementById(search_id);
                var $resultContent = document.getElementById(content_id);
                $input.addEventListener('input', function() {
                    var str = '<ul class=\"search-result-list\">';
                    var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                    $resultContent.innerHTML = "";
                    if (this.value.trim().length <= 0) {
                        return;
                    }
                    // perform local searching
                    datas.forEach(function(data) {
                        var isMatch = true;
                        var content_index = [];
                        var data_title = data.title.trim().toLowerCase();
                        var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                        var data_url = data.url;
                        var index_title = -1;
                        var index_content = -1;
                        var first_occur = -1;
                        // only match artiles with not empty titles and contents
                        if (data_title != '' && data_content != '') {
                            keywords.forEach(function(keyword, i) {
                                index_title = data_title.indexOf(keyword);
                                index_content = data_content.indexOf(keyword);
                                if (index_title < 0 && index_content < 0) {
                                    isMatch = false;
                                } else {
                                    if (index_content < 0) {
                                        index_content = 0;
                                    }
                                    if (i == 0) {
                                        first_occur = index_content;
                                    }
                                }
                            });
                        }
                        // show search results
                        if (data_content != '' && isMatch) {
                            keywords.forEach(function(keyword) {
                                var regS = new RegExp(keyword, "gi");
                                data_title = data_title.replace(regS, "<span class=\"search-keyword <%= theme.color.link %> lighten-2\">" + keyword + "</span>");
                            });

                            str += "<li><a href='" + data_url + "' class='search-result-title'>" + data_title + "</a>";
                            var content = data.content.trim().replace(/<[^>]+>/g, "");
                            if (first_occur >= 0) {
                                // cut out 100 characters
                                var start = first_occur - 20;
                                var end = first_occur + 80;
                                if (start < 0) {
                                    start = 0;
                                }
                                if (start == 0) {
                                    end = 100;
                                }
                                if (end > content.length) {
                                    end = content.length;
                                }
                                var match_content = content.substring(start, end);
                                // highlight all keywords
                                keywords.forEach(function(keyword) {
                                    var regS = new RegExp(keyword, "gi");
                                    match_content = match_content.replace(regS, "<span class=\"search-keyword <%= theme.color.link %> lighten-2\">" + keyword + "</span>");
                                });

                                str += "<p class=\"search-result\">..." + match_content + "...</p>"
                            }
                            str += "</li>";
                        }
                    });
                    str += "</ul>";
                    $resultContent.innerHTML = str;
                });
            }
        });
    }

    var searchFunc = function (c, a, b) {
        'use strict';
        $.ajax({
            url: c,
            dataType: "xml",
            success: function (e) {
                var d = $("entry", e).map(function () {
                    return {
                        title: $("title", this).text(),
                        content: $("content", this).text(),
                        url: $("url", this).text()
                    }
                }).get();
                var g = document.getElementById(a);
                var f = document.getElementById(b);
                g.addEventListener("input", function () {
                    var i = '<ul class="search-result-list">';
                    var h = $(this).val().trim().toLowerCase().split(/[\s\-]+/);
                    f.innerHTML = "";
                    if ($(this).val().trim().length <= 0) {
                        return
                    }
                    d.forEach(function (o) {
                        var n = true;
                        var s = [];
                        var t = o.title.trim().toLowerCase();
                        var m = o.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
                        var j = o.url;
                        var u = -1;
                        var q = -1;
                        var p = -1;
                        if (t !== "" && m !== "") {
                            h.forEach(function (w, x) {
                                u = t.indexOf(w);
                                q = m.indexOf(w);
                                if (u < 0 && q < 0) {
                                    n = false
                                } else {
                                    if (q < 0) {
                                        q = 0
                                    }
                                    if (x === 0) {
                                        p = q
                                    }
                                }
                            })
                        }
                        if (n) {
                            i += '<li><a href="' + j + '" class="search-result-title" target="_blank">' + t;
                            var r = o.content.trim().replace(/<[^>]+>/g, "");
                            if (p >= 0) {
                                var k = p - 6;
                                var l = p + 6;
                                if (k < 0) {
                                    k = 0
                                }
                                if (k === 0) {
                                    l = 10
                                }
                                if (l > r.length) {
                                    l = r.length
                                }
                                var v = r.substr(k, l);
                                h.forEach(function (w) {
                                    var x = new RegExp(w, "gi");
                                    v = v.replace(x, '<em class="search-keyword">' + w + "</em>")
                                });
                                i += '<p class="search-result">' + v + "...</p></a>"
                            }
                        }
                    });
                    f.innerHTML = i
                })
            }
        })
    };

    var inputArea = document.querySelector('#search-input');
    var getSearchFile = function() {
        // var path = '<%= config.search.path %>';
        // searchFunc("/search.xml", 'search-input', 'local-search-result');
        initSearch("/search.xml", 'search-input', 'local-search-result');
    }

    if(inputArea) {
        inputArea.onfocus = function() {
            getSearchFile();
        }
    }

    var originTop = 0;
    $(window).scroll(function (event) {
        var top = $(window).scrollTop();
        var topH = $('#header_top').height();
        var headerH = $('#header').height();
        if (top > 0) {
            $('#header_top').addClass('fixed');
        } else {
            $('#header_top').removeClass('fixed');
        }

        if(top > headerH && top > originTop){
            $('#header_top').slideUp("swing");
        }else{
            $('#header_top').slideDown("swing");
        }
        originTop = top;
    });
})(jQuery);

var repository=function(){var t=[],n="https://rickandmortyapi.com/api/character/?page=1";$(".modal");function e(t){var n=$(".rickopedia-list"),e=$("<li></li>");n.append(e);var a=$('<button class="btn btn-dark col-lg-8 col-sm button--li" data-toggle="modal" data-target="#modal-container">'+t.name+"</button>");e.append(a),a.on("click",function(n){var e;i(e=t).then(function(){r(e)})})}function a(n){"object"==typeof n&&t.push(n)}function o(t){var n=[];return $.each(t,function(e){var o={name:t[e].name,detailsUrl:t[e].url};a(o),n.push(o),console.log("getCharacters",o)}),n}function i(t){var n=t.detailsUrl;return $.ajax(n).then(function(n){return t.imageUrl=n.image,t.name=n.name,t.type=n.type,t.gender=n.gender,t.species=n.species,t.origin=n.origin.name,t}).catch(function(t){console.error(t)})}function r(t){$(".modal-title").text(t.name);var n=$(".modal-body");n.empty();var e=$('<img class="character-image img-fluid"></img>');e.attr("src",t.imageUrl),n.append(e);var a=$("<p>Species: "+t.species+"</p>");n.append(a);var o=$("<p>Type: "+t.type+"</p>");n.append(o);var i=$("<p>Species: "+t.gender+"</p>");n.append(i);var r=$("<p>Origin: "+t.origin+"</p>");n.append(r)}return{add:a,getAll:function(){return t},addListItem:e,loadList:function(t){return t||(t=n),$.ajax(t,{dataType:"json"}).then(function(t){var n=t.info.next;o(t.results),jQuery(function(t){t("#rickopedia-scroll").on("scroll",function(){if(Math.ceil(t(this).scrollTop())+t(this).innerHeight()>=t(this)[0].scrollHeight&&n)return t("#loading").show(),t.ajax(n,{dataType:"json"}).then(function(t){n=t.info.next,o(t.results).forEach(function(t){e(t)})})})})})},loadDetails:i,showModal:r}}();repository.loadList().then(function(){repository.getAll().forEach(function(t){repository.addListItem(t)})});var $toTop=$(".to-top");$toTop.on("click",function(){$("#rickopedia-scroll").scrollTop(0)});
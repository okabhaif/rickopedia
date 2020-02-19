var repository = (function() {
    var rickopedia = [];
    var apiUrl = 'https://rickandmortyapi.com/api/character/?page=1';
    var $modalContainer = $('.modal');

    function addListItem(character) {
        var $rickopediaList = $('.rickopediaList');

        var $listItem = $('<li></li>');
        $rickopediaList.append($listItem);

        var $button = $('<button class="btn btn-dark col-lg-8 col-sm button--li" data-toggle="modal" data-target="#modalContainer">' + character.name + '</button>');
        $listItem.append($button);

        ($button).on('click', function(event) {
            return showDetails(character);
        });
    }

    function showDetails(item) {
        loadDetails(item).then(function() {
            showModal(item);
        });
    }

    function add(character) {
        if (typeof character === "object") {
            rickopedia.push(character);
        }
    }



    function getAll() {
        return rickopedia;
    }

    function getCharacters(results) {
      var moreCharacters = [];
        $.each(results, function(i) {
            var $character = {
                name: results[i].name,
                detailsUrl: results[i].url,
            };

            add($character);
            moreCharacters.push($character);
                      console.log('getCharacters', $character);
        });
        return moreCharacters
    }

//reference https://www.sitepoint.com/jquery-infinite-scrolling-demos/
    function loadList(url) {

        if (!url) {
            url = apiUrl;
        }

        return $.ajax(url, {
                dataType: 'json'
            })
            .then(function(response) {
                var next = response.info.next;
                getCharacters(response.results);

//scroll to bottom of screen event listener
//updated code to target bottom of rickopedia div - used potato as var to make it easier to work with!
                var potato = $('#potato');
                var loading = false;

                jQuery(function($) {
            $('#potato').on('scroll', function() {
                if(Math.ceil($(this).scrollTop()) + $(this).innerHeight() >= $(this)[0].scrollHeight) {


                  if (next && !loading) {
                    //need to add a loading message
                      $('#loading').show();
                      return $.ajax(next, {
                              dataType: 'json'
                          })

                          .then(function(nextResponse)
                           {
                              next = nextResponse.info.next;
                              var moreCharacters = getCharacters(nextResponse.results)

                              moreCharacters.forEach(function(character) {
                                  addListItem(character);
                              });

                          });
                  }                }
            })

                });

            });
    }

    //function loadItems
    function loadDetails(item) {
        var url = item.detailsUrl;
        return $.ajax(url)
            .then(function(details) {
                // Now we add the details to the item
                item.imageUrl = details.image;
                item.name = details.name;
                item.type = details.type;
                item.gender = details.gender;
                item.species = details.species;
                item.origin = details.origin.name;

                return item;
            })
            .catch(function(e) {
                console.error(e);
            });
    }

    function showModal(item) {
        // Clear all existing modal content
        console.log(item);

        // Add the new modal content

        var $title = $('.modal-title');
        ($title).text(item.name);
//main details
        var $modal = $('.modal-body');
        ($modal).empty();
        console.log($modal);

        var $img = $('<img class="characterImage img-fluid"></img>');
        $img.attr('src', item.imageUrl);
        ($modal).append($img);

        var $species = $('<p>Species: ' + item.species + '</p>');
        ($modal).append($species);

        var $type = $('<p>Type: ' + item.type + '</p>');
        ($modal).append($type);

        var $gender = $('<p>Species: ' + item.gender + '</p>');
        ($modal).append($gender);

        var $origin = $('<p>Origin: ' + item.origin + '</p>');
        ($modal).append($origin);
    }


    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal,
    };
})();

repository.loadList().then(function() {
    // Now the data is loaded!
    repository.getAll().forEach(function(character) {
        repository.addListItem(character);
    });
});

var $toTop = $('.toTop');
$toTop.on('click', function(){
  $('#potato').scrollTop(0);
});

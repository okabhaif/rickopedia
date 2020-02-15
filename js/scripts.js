var repository = (function() {
    var rickopedia = [];
    var apiUrl = 'https://rickandmortyapi.com/api/character/?page=1';
    var $modalContainer = $('#modal-container');

    function addListItem(character) {
        var $rickopediaList = $('.rickopediaList')

        var $listItem = $('<li></li>');
        $rickopediaList.append($listItem);

        var $button = $('<button class="button--li">' + character.name + '</button>');
        $listItem.append($button);

        ($button).on('click', function(event) {
            $button.addClass('button-clicked');
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
                var win = $(window);
                var loading = false;
                win.scroll(function() {
                    if (win.height() + win.scrollTop()
                                == $(document).height()) {
                        if (!next) {
                            next = apiUrl;
                        }

                        if (next && !loading) {
                            $('#loading').show();
                            return $.ajax(next, {
                                    dataType: 'json'
                                })
                                .then(function(nextResponse) {
                                    next = nextResponse.info.next;
                                    var moreCharacters = getCharacters(nextResponse.results)

                                    moreCharacters.forEach(function(character) {
                                        addListItem(character);
                                    });;

                                });
                        }

                    }
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
        ($modalContainer).empty();

        var $modal = $('<div class="modal"></div>');
        ($modalContainer).append($modal);

        // Add the new modal content
        var $closeButton = $('<button class="modal-close">Close</button>');
        ($modal).append($closeButton);
        ($closeButton).on('click', hideModal);


        var $title = $('<h1>' + item.name + '</h1>');
        ($modal).append($title);

        var $img = $('<img></img>');
        $img.attr('src', item.imageUrl);
        ($modal).append($img);


        var $species = $('<p>Species: ' + item.species + '</p>');
        ($modal).append($species);

        var $origin = $('<p>Origin: ' + item.origin + '</p>');
        ($modal).append($origin);
        ($modalContainer).addClass('is-visible');

    }

    function hideModal() {
        ($modalContainer).removeClass('is-visible')
    }

    $(window).on('keydown', function(e) {
        if (e.key === 'Escape') {
            hideModal();
        }
    });

    ($modalContainer).on('click', (e) => {
        // Since this is also triggered when clicking INSIDE the modal container,
        // We only want to close if the user clicks directly on the overlay
        var target = e.target;
        if (target === $modalContainer) {
            hideModal();
        }
    })

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal,
        hideModal: hideModal,
    };
})();

var $rickopediaList = $('.rickopediaList');

repository.loadList().then(function() {
    // Now the data is loaded!
    repository.getAll().forEach(function(character) {
        repository.addListItem(character);
    });
});

const maxResults = 35;
let maleFemaleDate = "female";
let ajaxQuery;
let timeout;

const renderPeople = function(people)
{
    const template = Handlebars.compile($('#menu-template').html());
    $("#results").append(template(people));
};

const loadMoreClick = function(isTimeout)
{
    if (isTimeout)
        timeout = setTimeout(ajaxLoad, 100);
    else
        ajaxLoad();

    $('#div_load_more').hide();
};

const ajaxLoad = function()
{
    ajaxQuery = $.ajax(
        {
            url: `https://randomuser.me/api?gender=${maleFemaleDate}&results=${maxResults}`,
            dataType: 'json',
            beforeSend: function() {
                $("#results").append('<img class="loading" src="images/loading.gif"></img>');
            },
            complete: function() {
                $(".loading").remove();
            },
            success: function(data)
            {
                if (ajaxQuery)
                {
                    const my_people = [];
                    data.results.forEach(d => my_people.push({title:d.name.title, first:d.name.first, last:d.name.last, phone:d.phone, age:d.dob.age, nat:d.nat, pic:d.picture.large, city:d.location.city, country:d.location.country}));
                    renderPeople(my_people);
                    $('#div_load_more').show();

                    if (timeout)
                        $('html').animate({scrollTop: $(window).scrollTop() + 540});
                }
            },
            error: function(data)
            {
                loadMoreClick(true);
            }
        });
};

const refreshClick = function()
{
    $("#results").empty();
    ajaxQuery.abort();
    ajaxQuery = null;
    clearTimeout(timeout);
    timeout = null;
    loadMoreClick(false);
};

const maleFemaleClick = function()
{
    const male = $('#male');

    if (male.attr('disabled'))
    {
        male.removeAttr('disabled');
        $('#female').attr('disabled', true);
        maleFemaleDate = "male";
    }
    else
    {
        male.attr('disabled', true);
        $('#female').removeAttr('disabled');
        maleFemaleDate = "female";
    }

    refreshClick();
};

$(function()
{
    $("#male, #female").click(maleFemaleClick);
    $("#refresh").click(refreshClick);
    $("#btn_load_more").click(loadMoreClick);
    ajaxLoad();
});
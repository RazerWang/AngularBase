crmApp
    .directive('ngSpinnerLoader', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default
                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar
                });
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {

                    setTimeout(function () {
                        element.addClass('hide'); // hide spinner bar
                    }, 500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);
                });
                //
                $rootScope.$on('savingStart', function () {
                    element.removeClass('hide'); // show spinner bar
                });

                $rootScope.$on('savingEnd', function () {
                    setTimeout(function () {
                        element.addClass('hide'); // hide spinner bar
                    }, 500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);
                });


            }
        };
    }
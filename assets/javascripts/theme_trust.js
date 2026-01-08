var Swell =(function($) {

    var $window = $(window),
        $body = $('body'),
        $contentArea = $(".content-area"),
        $home = $('.home'),
        $top = $home.find('.site-header').find('.top'),
        $siteHeader = $('.home.has-video').find('.site-header'),
        $mainMenu = $("#main-menu"),
        $menuToggle = $("#menu-toggle"),
        $videoBG    = $siteHeader.find('#video-background'),
        $grid = $('.thumbs'), /** Isotope */
        $brick = $('.project.small'),
        $bannerContent = $home.find('#banner-content'), /** Banner */
        $down = $('#down-button'),
        $players = $('.player'), /** Video */
        $player1, $player2, $vimeo1, $vimeo2,
        $play = $("a#play-button"),
        $pause = $("a#pause-button"),
        $mobilePlay = $();


    var options = {
            verbose: false
        },
        windowH = $window.height(),
        windowW = $window.width(),
        adminBarOffset = $body.hasClass('admin-bar') ? 32 : 0,
        bannerContentTop,
        headerContentW = 0,
        headerBreakPt = 0,
        windowHAdjust,iframe, vimeo, selfVideo, playerH, playerW, parentH,
        aspectRatio = 16 / 9,
        canPlay = true,
        playerType, playerID, errorMsg;

    var init = function (settings) {

        errorMsg = "\nError Messages: \n";

        $.extend(options, settings);

        $contentArea.fitVids();
        mmenu_nav();

        windowHAdjust = windowH - adminBarOffset - $top.height();
        $videoBG.height(windowHAdjust);

        /** Set Down Arrow Button */
        down_arrow();

        /** Video Stuff */
        if(!isMobile()){
			video_init();
		}

        /** Isotope Stuff */
        jQuery(window).load(function(){
            filter_init();
            isotope_init();
            center_home_banner_content();
        });

        /** Resize event */
        $window.resize(function(){

            /** Recalculate the window height and width */
            windowW = $window.width();
            windowH = $window.height();

            windowHAdjust = windowH - adminBarOffset - $top.height();

            /** Resize the video parent */
            $videoBG.height(windowHAdjust);

            /** Conditionally fire the video resize */
            if( $player1.length > 0 )
                video_resize( $player1 );
            if( $player1.length > 0 )
                video_resize( $player2 );

            mmenu_nav();
            center_home_banner_content();
        });

        if(options.verbose)
            console.log(errorMsg);

    };

    /**
     * Check whether user is on mobile or not.
     *
     * @returns string
     */
    var isMobile = function () {

        if (options.verbose)
            console.log('isMobile');

        return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/))
        );

    };

    /**
     * Initializes the scroll down arrow
     */
    var down_arrow = function(){

        $down.click( function(e){
            e.preventDefault();

            jQuery.scrollTo( ".middle", {easing: 'easeInOutExpo', duration: 1000} );
        });

    };

    /**
     * Initialize video
     */
    var video_init = function(){

        if(options.verbose)
            console.log("Video_init called\n");

        /** Get unique players */
        $player1 = $players.eq(0);
        $player2 = $players.eq(1);

        if($.type($player1) !== 'undefined' && $player1.length > 0 ) {

            if(options.verbose)
                console.log( "Video 1 detected" );

            video_type($player1);

            if(options.verbose)
                console.log( "Video 1 uses " + playerType );

            video_load( $player1 );
            button_init();
            video_hide_and_show($player1);

            video_resize( $player1); // We're going to let load_vimeo do this, so it fires when the video is ready

        }

        if($.type($player2) !== 'undefined' && $player2.length > 0 ) {

            if(options.verbose)
                console.log( "Video 2 detected" );

            video_type($player2);

            if(options.verbose)
                console.log( "Video 2 uses " + playerType );

            video_load($player2);
            video_hide_and_show($player2);
            if(playerType !== 'vimeo')
                video_resize($player2);

        }

    };

    /**
     * Simple function to find the type of video service via the player class.
     *
     * @returns string
     */
    var video_type = function($player){

        if ($player.hasClass('youtube'))
            playerType = 'youtube';

        else if ($player.hasClass('vimeo'))
            playerType = 'vimeo';

        else if ($player.hasClass('self'))
            playerType = 'self';

        else {
            errorMsg += "Video player with ID " + playerID + " does not have a class to tell me what service it uses.\n";
            playerType = null;
        }

    };

    /**
     * Load the video and start it playing
     */
    var video_load = function ( $player ) {

        playerID = $player.attr('id');

        switch( playerType ){

            case "youtube":
                load_youtube( $player );
                break;

            case "vimeo":
                iframe = $('#' + playerID)[0]; // Use HTML DOM Object
                vimeo = $f(iframe);
                /** Add ready event */
                vimeo.addEvent('ready', load_vimeo);
                break;

            case "self":
                if(options.verbose)
                    console.log("Loading self-hosted\n");
                selfVideo = document.getElementById(playerID);
                if( $('#self1').length > 0 ) {
                    $('#self1').on('play', function () {
                        $player.parent().siblings(".overlay").addClass("fade-out");
                    });
                }
                selfVideo.play();
                break;

            default:
                errorMsg += "Video player with ID " + playerID + " does not have a class to tell me what service it uses.\n";
                break;
        }

    };

    /**
     * Load YouTube video and play
     *
     * @uses mb.YTPlayer
     */
    var load_youtube = function($player){

        if(options.verbose)
            console.log("Loading YouTube\n");

        $player.height(windowH).mb_YTPlayer();

        $player.YTPPlay();

        $player.on("YTPStart", function(){
            $(this).siblings(".overlay").addClass("fade-out");
        });

    };

    /**
     * Load Vimeo video and play
     */
    var load_vimeo = function(id){

        if(options.verbose)
            console.log("Loading Vimeo, #" + id + "\n");

        /** Rebuild the objects locally */
        var lv_vimeoParent = $('#' + id),
            lv_iframe = lv_vimeoParent[0], // Use HTML DOM Object
            lv_vimeo = $f(lv_iframe);

        /** Resize the video */
        video_resize( lv_vimeoParent );

        /** Play video */
        lv_vimeo.api('play'); // To prevent autoplay bug

        if(options.verbose)
            console.log("Setting the Vimeo video to mute, and fading out overlay.\n");

        lv_vimeo.api( 'setVolume', 0 );
        lv_vimeoParent.parent().siblings(".overlay").addClass("fade-out");

    };

    /**
     * Play function for the play button
     */
    var play = function( $player ){

        video_type( $player );

        switch( playerType ){

            case "youtube":
                $player1.playYTP();
                break;

            case "vimeo":
                $vimeo1 = $f( $player[0] );
                $vimeo1.api('play');
                break;

            case "self":
                selfVideo.play();

        }

    };

    /**
     * Pause for the pause button
     */
    var pause = function($player){

        video_type( $player );

        switch( playerType ){

            case "youtube":
                $player1.pauseYTP();
                break;

            case "vimeo":
                $vimeo1 = $f( $player[0] );
                $vimeo1.api('pause');
                break;

            case "self":
                selfVideo.pause();

        }

    };

    /**
     * Set up the play/pause buttons
     */
    var button_init = function(){

        /**
         * One button is meaningless without the other,
         * and this entire function will not work if
         * they are not both present
         */
        if( ! $play.length > 0 || ! $pause.length > 0 )
            return false;

        if(options.verbose)
            console.log("Binding play and pause to click\n");

        $play.click( function(e){

            e.preventDefault();

            if(options.verbose)
                console.log("Pressed play\n");

            if( isMobile() )
                $player1.parent().siblings(".overlay").addClass("fade-out");

            play( $player1 );

        });

        $pause.click( function(e){

            e.preventDefault();

            if(options.verbose)
                console.log("Pressed pause\n");

            pause( $player1 );

        });

    };

    /**
     * Resize the video to fill the screen and hide the player chrome
     *
     * @param $player object
     */
    var video_resize = function($player) {

        if(options.verbose) {
            console.log("Video resize called on #" + $player.attr('id') + "\n");
            console.log($player);
        }

        $player.height( windowH );

        playerW = $player.width();
        playerH = $player.height();
        parentH = $player.parent().height() + 55;

        $siteHeader.height(windowH);
        $videoBG.height(windowHAdjust + 55);

        /** When screen aspectRatio differs from video, video must center and underlay one dimension */
        if ( ( windowW / aspectRatio ) < parentH ) { // if new video parentH < window parentH (gap underneath)

            if(options.verbose)
                console.log("Video is shorter than parent (" + parentH + "px). Fixing...\n");

            playerW = Math.ceil( parentH * aspectRatio ); // get new player width
            $player.height(parentH).width(playerW).css({
                left: (windowW - playerW) / 2,
                top: 0
            }); // player width is greater, offset left; reset top

        } else { // new video width < window width (gap to right)

            if(options.verbose)
                console.log("Video is narrower than parent (" + windowW + "). Fixing...\n");

            playerH = Math.ceil( windowW / aspectRatio); // get new player height
            $player.width(windowW).height(playerH).css({
                left: 0,
                top: (parentH - playerH ) / 2
            }); // player parentH is greater, offset top; reset left

        }

    };

    /**
     * Function to pause and play the video when user stops looking at the tab (memory conservation)
     *
     * @param $player object
     */
    var video_hide_and_show = function($player){

        $(document).on('hide', function(){
            if(options.verbose)
                console.log("You're not even looking.\n");

            pause($player);
        });
        $(document).on('show', function(){
            if( canPlay ) // Prevent from playing if user has elected to pause using the buttons
                play($player);

            if(options.verbose)
                console.log("You're looking again!\n");
        });

    };

    /**
     * Check whether the menu is too big for the space is has, and, if so, enable mobile menu
     * @returns {boolean}
     */
    var has_long_menu = function() {

        var $hsm_site_header = $('.site-header'),
            $logo = $('#logo'),
            $mainNav = $('#main-nav'),
            siteHeaderW = $hsm_site_header.width();

        if( headerContentW === 0 )
            headerContentW = $logo.width() + $mainNav.width();

        if( headerContentW >= siteHeaderW * 0.90 ) {

            if(options.verbose)
                console.log("The menu is too long for the space. Going mobile...\n");

            $hsm_site_header.addClass("long-menu");

            if(headerBreakPt == 0)
                headerBreakPt = siteHeaderW;

            return true;

        } else if( siteHeaderW > headerBreakPt ){

            $hsm_site_header.removeClass("long-menu");

            return false;
        }

    };

    /**
     * Initialize Mmenu
     */
    var mmenu_nav = function(){

        var mn_hasLongMenu = has_long_menu(),
            $mmMainMenu;

        if( $window.width() < 700 || mn_hasLongMenu ){

            if(options.verbose)
                console.log("Switching to mobile menu.\n");

            var mn_status = 'closed';

            $mainMenu.mmenu({
                // options
            }, {
                // configuration
                clone: true
            });

            $mmMainMenu = $('#mm-main-menu');

            $mmMainMenu.find('ul').removeClass('sf-menu');

            $menuToggle.click(function() {

                if( mn_status === 'closed' ) {

                    if(options.verbose)
                        console.log("Open menu.\n");

                    $mainMenu.trigger("open.mm");
                    mn_status = 'open';

                } else
                    $mainMenu.trigger("close.mm");

            });
        }
    };

    /**
     * Center the home banner content
     */
    var center_home_banner_content = function(){

        if( ! $bannerContent.length > 0 )
            return false;

        bannerContentTop = ( windowHAdjust / 2 ) - ( $bannerContent.actual('height') / 2 );

        $bannerContent.css( 'margin-top', bannerContentTop + 'px' );
        $bannerContent.show();

    };

    /**
     * Isotope Filters
     */
    var filter_init = function() {

        var $filterA = $('#filter-nav').find('a');

        if( $filterA.length > 0 ) {
            $filterA.click(function(){

                var selector = jQuery(this).attr('data-filter');

                $grid.isotope({
                    filter: selector,
                    hiddenStyle : {
                        opacity: 0,
                        scale : 1
                    }
                });

                if ( ! $(this).hasClass('selected') ) {
                    $(this).parents('#filter-nav').find('.selected').removeClass('selected');
                    $(this).addClass('selected');
                }

                return false;
            });
        } // if() - Don't have this element on every page on which we call Isotope
    };

    /**
     * Isotope Init
     */
    var isotope_init = function() {

        $grid.isotope({
            resizable: true,
            layoutMode: 'fitRows'
        });

        $brick.css("opacity", "1");
    };

    /** Public API */
    return {
        init: init
    }

})(jQuery);

jQuery(document).ready(function () {
    Swell.init();
});
